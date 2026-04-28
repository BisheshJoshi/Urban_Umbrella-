import React from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🔗",
    title: "URL Safety Check",
    desc: "Paste any website or DApp link and we'll instantly check if it's safe to use. Like a seatbelt for your browser.",
    to: "/scan-url",
    cta: "Check a URL",
  },
  {
    icon: "📄",
    title: "Smart Contract Scanner",
    desc: "Upload a smart contract and we'll read the code for you — flagging anything suspicious in plain English.",
    to: "/scan-document",
    cta: "Scan a Contract",
  },
  {
    icon: "📊",
    title: "Your Dashboard",
    desc: "See all your past scans, your security score, and stay on top of threats — all in one place.",
    to: "/dashboard",
    cta: "View Dashboard",
  },
  {
    icon: "🎓",
    title: "Security Academy",
    desc: "Learn how blockchain works, what makes DApps dangerous, and how to protect yourself — in bite-size lessons.",
    to: "/learn",
    cta: "Start Learning",
  },
];

const STATS = [
  { value: "50K+", label: "Scans completed" },
  { value: "1,200+", label: "Threats detected" },
  { value: "99.8%", label: "Accuracy rate" },
  { value: "Free", label: "Always" },
];

export default function Home() {
  return (
    <div className="page-home">

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🛡️ AI-Powered Web3 Security</div>
          <h1 className="hero-title">
            Is your DApp <span className="gradient-text">actually safe?</span>
          </h1>
          <p className="hero-subtitle" data-tour="hero-subtitle">
            Urban Umbrella scans blockchain apps, smart contracts, and crypto websites
            for threats — and explains the risks in plain language <em>anyone</em> can understand.
            Even your grandma. 👵
          </p>
          <div className="hero-actions">
            <Link to="/scan-url" className="uu-btn uu-btn-primary hero-cta">
              🚀 Check a Website Now
            </Link>
            <Link to="/learn" className="uu-btn uu-btn-ghost hero-cta-secondary">
              📖 Learn How It Works
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-shield">
            <div className="shield-ring ring-1" />
            <div className="shield-ring ring-2" />
            <div className="shield-ring ring-3" />
            <div className="shield-center">☂️</div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <h2 className="section-title">How it works</h2>
        <p className="section-subtitle">Three simple steps. No crypto knowledge needed.</p>
        <div className="steps-grid">
          {[
            { step: "01", icon: "📋", title: "Enter or Upload", desc: "Paste a URL, or drop a smart contract file." },
            { step: "02", icon: "🤖", title: "AI Scans It", desc: "Our AI engine checks it against thousands of known threat patterns instantly." },
            { step: "03", icon: "💡", title: "Get Plain English Results", desc: "We tell you exactly what we found — and what to do about it — in simple language." },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="step-card">
              <div className="step-number">{step}</div>
              <div className="step-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <h2 className="section-title">Everything in one place</h2>
        <div className="features-grid">
          {FEATURES.map(({ icon, title, desc, to, cta }) => (
            <div
              key={to}
              className="feature-card uu-card"
              data-tour={`feature-${to.replace("/scan-", "").replace("/", "")}`}
            >
              <div className="feature-icon">{icon}</div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
              <Link to={to} className="uu-btn uu-btn-ghost feature-link">{cta} →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        <div className="stats-grid">
          {STATS.map(({ value, label }) => (
            <div key={label} className="stat-item">
              <div className="stat-value gradient-text">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="uu-card cta-card">
          <h2>Ready to stay safe in Web3?</h2>
          <p>Join thousands of users protecting their crypto assets with Urban Umbrella.</p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link to="/scan-url" className="uu-btn uu-btn-primary">Get Started — It's Free</Link>
            <Link to="/learn" className="uu-btn uu-btn-ghost">Learn First</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
