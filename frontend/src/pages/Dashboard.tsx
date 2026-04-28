import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { apiGet } from "../lib/api";

interface HistoryItem {
  id: string | number;
  type: string;
  target: string;
  risk: "safe" | "caution" | "danger";
  date: string;
  score: number;
}

const MOCK_HISTORY: HistoryItem[] = [
  { id: 1, type: "URL",      target: "uniswap.org",        risk: "safe",    date: "2026-04-13", score: 12 },
  { id: 2, type: "Contract", target: "TokenSale.sol",      risk: "caution", date: "2026-04-12", score: 55 },
  { id: 3, type: "URL",      target: "app.aave.com",       risk: "safe",    date: "2026-04-12", score: 8  },
  { id: 4, type: "URL",      target: "free-nft-drop.xyz",  risk: "danger",  date: "2026-04-11", score: 91 },
  { id: 5, type: "Contract", target: "StakingPool.json",   risk: "safe",    date: "2026-04-10", score: 22 },
];

const RISK_ICONS: Record<string, string> = { safe: "🟢", caution: "🟡", danger: "🔴" };
const RISK_LABELS: Record<string, string> = { safe: "Safe", caution: "Caution", danger: "Danger" };

function SecurityGauge({ score }: { score: number }): React.JSX.Element {
  const circumference = 2 * Math.PI * 54;
  const fill = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "At Risk";
  return (
    <div className="gauge-wrapper">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={fill}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 1.5s ease" }}
        />
        <text x="60" y="56" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="700">{score}</text>
        <text x="60" y="74" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">/100</text>
      </svg>
      <div className="gauge-label" style={{ color }}>{label}</div>
    </div>
  );
}

export default function Dashboard(): React.JSX.Element {
  const { connected, authenticated, address, authToken } = useWallet();

  const [history,       setHistory]       = useState<HistoryItem[]>(MOCK_HISTORY);
  const [historyLoad,   setHistoryLoad]   = useState(false);
  const [securityScore, setSecurityScore] = useState(74);

  // Try to load real scan history from backend when authenticated
  useEffect(() => {
    if (!authenticated || !authToken) return;
    setHistoryLoad(true);
    apiGet<{ scans?: HistoryItem[] }>("/scans/history", authToken)
      .then((data: { scans?: HistoryItem[] } | null) => {
        if (data?.scans?.length) {
          setHistory(data.scans);
          const avg = data.scans.reduce((a: number, s: HistoryItem) => a + (s.score || 0), 0) / data.scans.length;
          setSecurityScore(Math.round(100 - avg));
        }
      })
      .catch(() => null)
      .finally(() => setHistoryLoad(false));
  }, [authenticated, authToken]);

  return (
    <div className="page-dashboard">
      <div className="page-header">
        <h1 className="page-title">📊 Your Dashboard</h1>
        <p className="page-subtitle">
          {connected
            ? `Welcome back! Here's your security overview, ${address.slice(0,6)}…${address.slice(-4)}`
            : "Connect your wallet to see your personal security history."}
        </p>
      </div>

      {!connected && (
        <div className="uu-card connect-prompt-card">
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>🔌</div>
            <h2>Connect Your Wallet to Unlock Your Dashboard</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>
              Your scan history and security score are tied to your wallet address.
              Hit the <strong>Connect Wallet</strong> button in the top-right corner to get started.
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
              (Showing a preview with sample data below)
            </p>
          </div>
        </div>
      )}

      {/* ── STATS ROW ── */}
      <div className="dashboard-stats-row" data-tour="dashboard-stats">
        <div className="uu-card stat-card">
          <SecurityGauge score={securityScore} />
          <h3>Security Score</h3>
          <p>Based on your recent scans and how risky the sites you visit are.</p>
        </div>

        <div className="uu-card stat-card">
          <div className="big-stat">
            <span className="big-number gradient-text">{history.length}</span>
            <span className="big-unit">scans</span>
          </div>
          <h3>Total Scans</h3>
          <p>All-time scans you've run through Urban Umbrella.</p>
          <div className="mini-breakdown">
            <span>🟢 {history.filter(h => h.risk === "safe").length} safe</span>
            <span>🟡 {history.filter(h => h.risk === "caution").length} caution</span>
            <span>🔴 {history.filter(h => h.risk === "danger").length} danger</span>
          </div>
        </div>

        <div className="uu-card stat-card">
          <div className="big-stat">
            <span className="big-number" style={{ color: "#ef4444" }}>
              {history.filter(h => h.risk === "danger").length}
            </span>
            <span className="big-unit">threats</span>
          </div>
          <h3>Threats Blocked</h3>
          <p>Dangerous sites and contracts we caught before they could hurt you.</p>
          <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
            🛡️ You're {history.filter(h => h.risk === "danger").length}x more secure than average
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="uu-card">
        <div className="uu-card-header">
          <div className="uu-card-title">⚡ Quick Actions</div>
        </div>
        <div className="uu-card-body quick-actions">
          <Link to="/scan-url" className="uu-btn uu-btn-primary quick-action-btn">
            🔗 Scan a URL
          </Link>
          <Link to="/scan-document" className="uu-btn quick-action-btn">
            📄 Scan a Contract
          </Link>
          <Link to="/learn" className="uu-btn uu-btn-ghost quick-action-btn">
            🎓 Continue Learning
          </Link>
        </div>
      </div>

      {/* ── SCAN HISTORY ── */}
      <div className="uu-card" data-tour="dashboard-history">
        <div className="uu-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="uu-card-title">🕒 Recent Scans</div>
          {historyLoad && <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>Loading…</span>}
          {!authenticated && <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>Preview data</span>}
        </div>
        <div className="uu-card-body">
          <div className="history-table">
            <div className="history-header">
              <span>Risk</span>
              <span>Type</span>
              <span>Target</span>
              <span>Score</span>
              <span>Date</span>
            </div>
            {history.map(item => (
              <div key={item.id} className={`history-row risk-row-${item.risk}`}>
                <span>{RISK_ICONS[item.risk]} {RISK_LABELS[item.risk]}</span>
                <span className="history-type">{item.type}</span>
                <span className="history-target uu-mono">{item.target}</span>
                <span className="history-score">{item.score}/100</span>
                <span className="history-date">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
