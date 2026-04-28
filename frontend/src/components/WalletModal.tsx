import React from "react";
import { useWallet } from "../context/WalletContext";

const WALLET_OPTIONS = [
  { id: "metamask",      label: "MetaMask",        icon: "🦊", desc: "The most popular Ethereum wallet" },
  { id: "coinbase",      label: "Coinbase Wallet",  icon: "🔵", desc: "Easy to use, great for beginners" },
  { id: "walletconnect", label: "WalletConnect",    icon: "🔗", desc: "Scan QR with any mobile wallet" },
  { id: "phantom",       label: "Phantom",          icon: "👻", desc: "Popular for Solana & Ethereum" },
];

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps): React.JSX.Element | null {
  const {
    status, address, chainId, providerType, error,
    connected, authenticated, chainAllowed,
    connectWallet, disconnect, authenticate,
  } = useWallet();

  if (!isOpen) return null;

  const handleConnect = async (walletId: string): Promise<void> => {
    await connectWallet(walletId);
  };

  return (
    <div className="uu-modal-overlay" onClick={onClose}>
      <div className="uu-modal-card" onClick={e => e.stopPropagation()}>

        <div className="uu-modal-header">
          <div>
            <h2 className="uu-modal-title">
              {connected ? "Your Wallet" : "Connect a Wallet"}
            </h2>
            <p className="uu-modal-subtitle">
              {connected
                ? "You're connected and ready to go"
                : "Choose how you'd like to connect. New to wallets? Try MetaMask 🦊"}
            </p>
          </div>
          <button className="uu-modal-close" onClick={onClose} aria-label="Close">✖</button>
        </div>

        <div className="uu-modal-body">
          {!connected ? (
            <>
              <div className="uu-wallet-options">
                {WALLET_OPTIONS.map(w => (
                  <button
                    key={w.id}
                    className={`uu-wallet-option ${status === "connecting" ? "disabled" : ""}`}
                    onClick={() => handleConnect(w.id)}
                    disabled={status === "connecting"}
                  >
                    <span className="icon">{w.icon}</span>
                    <div className="info">
                      <h3>{w.label}</h3>
                      <p>{w.desc}</p>
                    </div>
                    <span className="arrow">›</span>
                  </button>
                ))}
              </div>
              <p className="uu-modal-footnote">
                🔒 We never store your private keys. Your wallet stays in your control.
              </p>
            </>
          ) : (
            <div className="uu-wallet-connected-state">
              <div className="uu-connected-badge">
                <span className="uu-live-dot large" />
                <span>Connected via {providerType}</span>
              </div>

              <div className="uu-kv" style={{ margin: "20px 0" }}>
                <div className="uu-kv-row">
                  <div className="uu-kv-key">Address</div>
                  <div className="uu-kv-val uu-mono">{address}</div>
                </div>
                <div className="uu-kv-row">
                  <div className="uu-kv-key">Network</div>
                  <div className="uu-kv-val">
                    {chainId === 1 ? "🟢 Ethereum Mainnet"
                    : chainId === 11155111 ? "🟡 Sepolia Testnet"
                    : `Chain ${chainId}`}
                  </div>
                </div>
                <div className="uu-kv-row">
                  <div className="uu-kv-key">Auth Status</div>
                  <div className={`uu-kv-val uu-pill uu-pill-${status}`}>{status}</div>
                </div>
              </div>

              {!chainAllowed && (
                <div className="uu-alert uu-alert-warn" style={{ marginBottom: 16 }}>
                  ⚠️ Unsupported network. Please switch to Ethereum Mainnet or Sepolia Testnet.
                </div>
              )}

              {!authenticated && chainAllowed && (
                <button
                  className="uu-btn uu-btn-primary"
                  onClick={authenticate}
                  style={{ width: "100%", marginBottom: 12 }}
                  disabled={status === "authenticating"}
                >
                  {status === "authenticating" ? "⏳ Signing…" : "✍️ Sign In to Authenticate"}
                </button>
              )}
              {authenticated && (
                <div className="uu-auth-success">
                  ✅ You're fully authenticated and ready!
                </div>
              )}

              <button className="uu-btn uu-btn-ghost" onClick={disconnect} style={{ width: "100%" }}>
                Disconnect Wallet
              </button>
            </div>
          )}

          {error && (
            <div className="uu-alert uu-alert-error" style={{ marginTop: 16 }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
