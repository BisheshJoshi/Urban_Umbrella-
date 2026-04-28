import React, { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { apiGet, apiPost } from "../lib/api";

/* ── Types ── */
type WalletStatus = "disconnected" | "connecting" | "connected" | "authenticating" | "authenticated";

interface WalletContextValue {
  status: WalletStatus;
  address: string;
  chainId: number | null;
  providerType: string | null;
  authToken: string;
  error: string;
  setError: (_msg: string) => void;
  connected: boolean;
  authenticated: boolean;
  chainAllowed: boolean;
  allowedChainIds: number[];
  connectWallet: (_walletId: string) => Promise<void>;
  disconnect: () => void;
  authenticate: () => Promise<void>;
  clearSession: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}

function parseAllowedChainIds(): number[] {
  const raw = import.meta.env.VITE_EVM_ALLOWED_CHAIN_IDS || "1,11155111";
  const ids = raw.split(",").map((p: string) => Number(p.trim())).filter((n: number) => Number.isFinite(n) && n > 0);
  return ids.length > 0 ? Array.from(new Set(ids)) : [1, 11155111];
}

function humanizeWalletError(err: unknown): string {
  const errObj = err as { message?: string; code?: number } | undefined;
  const msg = (errObj?.message || String(err || "")).trim();
  const code = errObj?.code;
  if (code === 4001) return "You rejected the request in your wallet.";
  if (/user rejected/i.test(msg)) return "You rejected the request in your wallet.";
  if (/already processing/i.test(msg)) return "Your wallet already has a pending request — open it and resolve it first.";
  if (msg) return msg;
  return "Wallet request failed.";
}

async function requestWithFallback(provider: EthereumProvider, method: string, paramsList: unknown[][]): Promise<unknown> {
  let lastErr: unknown = null;
  for (const params of paramsList) {
    try { return await provider.request({ method, params }); }
    catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("Request failed");
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps): React.JSX.Element {
  const allowedChainIds = useMemo(() => parseAllowedChainIds(), []);
  const providerRef = useRef<EthereumProvider | null>(null);

  const [status,       setStatus]       = useState<WalletStatus>("disconnected");
  const [address,      setAddress]      = useState("");
  const [chainId,      setChainId]      = useState<number | null>(null);
  const [providerType, setProviderType] = useState<string | null>(null);
  const [authToken,    setAuthToken]    = useState("");
  const [error,        setError]        = useState("");

  const connected     = status === "connected" || status === "authenticated";
  const authenticated = status === "authenticated";
  const chainAllowed  = chainId ? allowedChainIds.includes(chainId) : true;

  const clearSession = useCallback(() => {
    setAuthToken("");
    setStatus(providerRef.current ? "connected" : "disconnected");
  }, []);

  const handleAccountsChanged = useCallback((accounts: unknown) => {
    const list = accounts as string[] | undefined;
    const next = (list || [])[0] || "";
    if (!next) {
      setAddress(""); setChainId(null); setProviderType(null);
      providerRef.current = null; setStatus("disconnected"); setAuthToken("");
      return;
    }
    setAddress(next); setStatus("connected"); setAuthToken("");
  }, []);

  const handleChainChanged = useCallback((nextChainId: unknown) => {
    const raw = nextChainId as string | number;
    const parsed = typeof raw === "string" && raw.startsWith("0x")
      ? parseInt(raw, 16) : Number(raw);
    if (Number.isFinite(parsed)) {
      setChainId(parsed); setAuthToken("");
      if (!allowedChainIds.includes(parsed)) setStatus("connected");
    }
  }, [allowedChainIds]);

  const connectWallet = useCallback(async (walletId: string): Promise<void> => {
    setError(""); setStatus("connecting");
    if (walletId !== "metamask") {
      setTimeout(() => {
        setStatus("disconnected");
        setError(`${walletId} extension not detected in this environment. Try MetaMask.`);
      }, 800);
      return;
    }
    try {
      let injected: EthereumProvider | undefined = window.ethereum;
      if (injected && Array.isArray(injected.providers))
        injected = injected.providers.find((p: EthereumProvider) => p.isMetaMask) || injected.providers[0];
      if (!injected || typeof injected.request !== "function")
        throw new Error("MetaMask not detected. Please install it from metamask.io and refresh.");

      const accounts      = await injected.request({ method: "eth_requestAccounts" });
      const currentChainId = await injected.request({ method: "eth_chainId" });
      providerRef.current = injected;
      setProviderType(injected.isMetaMask ? "MetaMask" : "Injected");
      handleAccountsChanged(accounts);
      handleChainChanged(currentChainId);

      injected.on?.("accountsChanged", handleAccountsChanged);
      injected.on?.("chainChanged", handleChainChanged);
      injected.on?.("disconnect", () => {
        setAddress(""); setChainId(null); setProviderType(null);
        providerRef.current = null; setStatus("disconnected"); setAuthToken("");
      });
    } catch (e) {
      setStatus("disconnected"); setError(humanizeWalletError(e));
    }
  }, [handleAccountsChanged, handleChainChanged]);

  const disconnect = useCallback(() => {
    setError(""); clearSession();
    setAddress(""); setChainId(null); setProviderType(null);
    providerRef.current = null; setStatus("disconnected");
  }, [clearSession]);

  const authenticate = useCallback(async (): Promise<void> => {
    setError(""); setStatus("authenticating");
    const provider = providerRef.current;
    try {
      if (!provider)                             throw new Error("No wallet connected.");
      if (!address)                              throw new Error("No account selected.");
      if (!chainId)                              throw new Error("Unknown chain.");
      if (!allowedChainIds.includes(chainId))    throw new Error(`Chain ${chainId} is not supported.`);

      const nonceBody = await apiPost<{ typedData?: unknown; message?: string }>(
        "/auth/nonce",
        { address, chainId, uri: window.location.origin },
      );

      let verifyPayload: Record<string, unknown> | null = null;
      try {
        const typedData      = nonceBody.typedData;
        const typedDataParam = JSON.stringify(typedData);
        const signature = await requestWithFallback(provider, "eth_signTypedData_v4", [
          [address, typedDataParam], [address, typedData],
        ]);
        verifyPayload = { address, chainId, typedData, signature };
      } catch {
        const message   = nonceBody.message;
        const signature = await requestWithFallback(provider, "personal_sign", [
          [message, address], [address, message],
        ]);
        verifyPayload = { address, chainId, message, signature };
      }

      const verifyBody = await apiPost<{ token?: string }>("/auth/verify", verifyPayload);
      if (!verifyBody.token) throw new Error("Missing auth token in response.");
      setAuthToken(verifyBody.token);
      setStatus("authenticated");
    } catch (e) {
      setStatus("connected"); setError(humanizeWalletError(e));
    }
  }, [address, chainId, allowedChainIds]);

  const refreshSession = useCallback(async (): Promise<void> => {
    setError("");
    if (!authToken) return;
    try {
      const body = await apiGet<{ authenticated?: boolean }>("/auth/me", authToken);
      if (body?.authenticated) {
        setStatus("authenticated");
      } else {
        clearSession();
      }
    } catch {
      clearSession();
    }
  }, [authToken, clearSession]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  return (
    <WalletContext.Provider value={{
      status, address, chainId, providerType, authToken, error, setError,
      connected, authenticated, chainAllowed, allowedChainIds,
      connectWallet, disconnect, authenticate, clearSession,
    }}>
      {children}
    </WalletContext.Provider>
  );
}
