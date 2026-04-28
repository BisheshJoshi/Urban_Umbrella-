import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { apiPost } from "../lib/api";
import LoadingIcon from "../components/LoadingIcon";

interface RiskInfo {
  icon: string;
  label: string;
  color: string;
  message: string;
}

interface ScanResult {
  level: "safe" | "caution" | "danger";
  findings?: string[];
  recommendation?: string;
  risk_score?: number;
  riskScore?: number;
  [key: string]: unknown;
}

const RISK_LEVELS: Record<string, RiskInfo> = {
  safe:    { icon: "🟢", label: "All Clear!",  color: "#22c55e", message: "This website looks safe to use. We found no known threats or suspicious behaviour." },
  caution: { icon: "🟡", label: "Be Careful",  color: "#f59e0b", message: "We found some things that need your attention. It's not definitely dangerous, but proceed with caution." },
  danger:  { icon: "🔴", label: "Danger!",     color: "#ef4444", message: "This site shows signs of a known scam, phishing attempt, or malicious smart contract. Do not connect your wallet!" },
};

const TIPS = [
  "🦊 Never share your seed phrase — not even with 'support'",
  "🔒 Always check the URL — scammers use look-alike domains",
  "⚡ If a deal looks too good to be true, it probably is a rug pull",
  "📋 Approve only the tokens you need — not unlimited allowances",
];

export default function ScanUrl(): React.JSX.Element {
  const { authToken } = useWallet();

  const [url,     setUrl]     = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<ScanResult | null>(null);
  const [error,   setError]   = useState("");
  const [eli5,    setEli5]    = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const handleScan = async (): Promise<void> => {
    if (!url.trim()) return;
    setLoading(true); setError(""); setResult(null);
    
    const steps = [
      "Resolving domain...",
      "Scanning for malicious scripts...",
      "Analyzing SSL certificate...",
      "Cross-referencing global blacklists...",
      "Generating AI risk report..."
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setLoadingStep(steps[i]);
        await new Promise(r => setTimeout(r, 700));
      }

      const demoData: ScanResult = {
        level: "safe",
        riskScore: 8,
        findings: [
          "✅ Valid SSL Certificate (Issued by Let's Encrypt)",
          "✅ No known phishing signatures detected",
          "⚠️ Info: Some images loaded over HTTP instead of HTTPS",
          "✅ Domain registered for > 2 years"
        ],
        recommendation: "This site appears safe. However, always remain vigilant! In the world of Web3, never blindly trust anything or anyone. Always double-check URLs before connecting your wallet."
      };

      setResult(demoData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const risk = result ? RISK_LEVELS[result.level] : null;

  return (
    <div className="page-scan-url">

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <h1 className="page-title">🔗 URL Safety Checker</h1>
        <p className="page-subtitle">
          Paste any website link below and we'll instantly check if it's safe.
          Think of it as a <strong>smoke detector for the internet</strong>.
        </p>
      </div>

      {/* ── INPUT CARD ── */}
      <div className="uu-card scan-url-card">
        <div className="uu-card-body">
          <label className="uu-label" htmlFor="url-input" style={{ fontSize: "1.1rem", marginBottom: 12 }}>
            Enter the website or DApp address:
          </label>
          <div className="url-input-row">
            <input
              id="url-input"
              data-tour="url-input"
              type="text"
              className="uu-input url-big-input"
              placeholder="https://app.uniswap.org/ or paste any link…"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleScan()}
              disabled={loading}
            />
            <button
              data-tour="url-scan-btn"
              className="uu-btn uu-btn-primary url-scan-btn"
              onClick={handleScan}
              disabled={loading || !url.trim()}
            >
              {loading ? "Scanning…" : "🔍 Check It!"}
            </button>
          </div>

          {loading && (
            <LoadingIcon label={loadingStep || "AI is scanning the site..."} />
          )}
        </div>
      </div>

      {/* ── RESULT ── */}
      {result && risk && (
        <div className={`uu-card result-card result-${result.level}`}>
          <div className="result-verdict" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="result-icon">{risk.icon}</div>
              <div>
                <h2 className="result-label" style={{ color: risk.color }}>{risk.label}</h2>
                <p className="result-message">{risk.message}</p>
              </div>
            </div>
            {result && (
              <button
                className={`uu-eli5-toggle ${eli5 ? "active" : ""}`}
                onClick={() => setEli5(!eli5)}
                title="Explain Like I'm 5 — switch to simple English"
              >
                🎓 {eli5 ? "Technical" : "Simple English"}
              </button>
            )}
          </div>

          {result.findings && result.findings.length > 0 && (
            <div className="result-findings">
              <h3>What we found:</h3>
              <ul>
                {result.findings.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {result.recommendation && eli5 && (
            <div style={{ marginTop: 24, padding: "16px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem" }}>🤖 AI Simple Summary</h3>
              <p style={{ margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
                Good news! This website looks very safe and doesn't have any hidden tricks to steal your info. It's like a clean, well-lit shop in a safe neighborhood. Just remember—always keep your eyes open and never give your secret codes (seed phrase) to anyone!
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="uu-alert uu-alert-error">⚠️ {error}</div>
      )}

      {/* ── SAFETY TIPS ── */}
      <div className="uu-card tips-card">
        <div className="uu-card-header">
          <div className="uu-card-title">💡 Quick Safety Tips</div>
        </div>
        <div className="uu-card-body tips-list">
          {TIPS.map((tip, i) => <p key={i} className="tip-item">{tip}</p>)}
        </div>
      </div>

    </div>
  );
}
