import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTour } from "../context/TourContext";
import LoadingIcon from "./LoadingIcon";

// Single session flag — resets every hard refresh / npm run dev
let tourAutoStarted = false;

interface TourStep {
  target: string;
  title: string;
  body: string;
  position?: "top" | "bottom" | "left" | "right";
}

// The order pages are visited during the full tour
const TOUR_ROUTE_ORDER = ["/", "/scan-url", "/scan-contract", "/scan-document", "/dashboard", "/learn"];

const TOUR_STEPS: Record<string, TourStep[]> = {
  "/": [
    {
      target: ".uu-navbar",
      title: "☂️ Urban Umbrella",
      body: "This is the navbar — your home base. You can jump to any tool from here at any time, no matter which page you're on.",
      position: "bottom",
    },
    {
      target: ".uu-navbar-right .uu-btn",
      title: "👛 Connect Your Wallet",
      body: "Click here to connect your crypto wallet. It's optional — but connecting unlocks your personal scan history and security score on the Dashboard.",
      position: "top",
    },
    {
      target: "[data-tour='hero-subtitle']",
      title: "🛡️ What Is Urban Umbrella?",
      body: "Urban Umbrella scans blockchain apps, smart contracts, and crypto websites for threats — and explains the risks in plain language anyone can understand. Even your grandma. 👵",
      position: "bottom",
    },
    {
      target: ".hero-cta",
      title: "🚀 Check a Website Now",
      body: "This is your fastest tool. Paste any suspicious link — from Discord, Twitter, or an email — and our AI will give you an instant safety verdict.",
      position: "top",
    },
    {
      target: ".hero-cta-secondary",
      title: "📖 Learn How It Works",
      body: "New to Web3 or crypto? Start here. Our Security Academy has bite-sized lessons that teach you how to spot scams and protect yourself — no tech background needed.",
      position: "top",
    },
    {
      target: "[data-tour='feature-url']",
      title: "🔗 URL Safety Check",
      body: "Paste any website or DApp link and we'll instantly check if it's safe to use. Think of it like a seatbelt for your browser — quick, automatic, and essential.",
      position: "bottom",
    },
    {
      target: "[data-tour='feature-document']",
      title: "📄 Smart Contract Scanner",
      body: "Upload a smart contract and our AI reads the code for you — flagging anything suspicious in plain English. No Solidity knowledge required.",
      position: "bottom",
    },
    {
      target: "[data-tour='feature-dashboard']",
      title: "📊 Your Dashboard",
      body: "See all your past scans, your overall security score, and stay on top of potential threats — all in one place. Connect your wallet to see your real data.",
      position: "bottom",
    },
    {
      target: "[data-tour='feature-learn']",
      title: "🎓 Security Academy",
      body: "Learn how blockchain works, what makes DApps dangerous, and how to protect yourself — in bite-size lessons. Complete all 6 to earn your Certificate of Mastery!",
      position: "bottom",
    },
  ],
  "/scan-url": [
    { target: ".page-title", title: "🔗 URL Safety Checker", body: "Got a suspicious link? Paste it here and our AI checks it against scam databases, analyses the domain, and gives you a verdict.", position: "bottom" },
    { target: "[data-tour='url-input']", title: "📋 Paste the Link", body: "Copy any URL from Discord, Twitter, or email and paste it here. We support any web address.", position: "bottom" },
    { target: "[data-tour='url-scan-btn']", title: "🤖 Hit Scan", body: "One click and our AI checks blacklists, SSL certificates, domain age, and content for threats.", position: "top" },
    { target: ".tips-card", title: "💡 Safety Tips", body: "Quick tips covering the most common ways people get scammed in Web3 — worth a read!", position: "top" },
  ],
  "/scan-contract": [
    { target: ".page-title", title: "📄 Smart Contract Scanner", body: "Before trusting a DeFi protocol or sending funds anywhere, scan the smart contract first. Our AI reads the code and flags hidden dangers.", position: "bottom" },
    { target: "[data-tour='contract-upload']", title: "📤 Upload or Paste Code", body: "Drag & drop a Solidity, JSON, or bytecode file — or paste contract code directly into the text area.", position: "bottom" },
    { target: "[data-tour='contract-scan-btn']", title: "🔬 Deep Analysis", body: "Checks for reentrancy attacks, hidden minting functions, ownership exploits, and 50+ known vulnerability patterns.", position: "top" },
    { target: "[data-tour='contract-results']", title: "📊 Results Panel", body: "Your security report appears here. Toggle 'Simple English' for a plain-language explanation of any issues.", position: "left" },
  ],
  "/scan-document": [
    { target: ".page-title", title: "📁 Document Fact-Checker", body: "Got a whitepaper or investment document? Our AI cross-references every claim against live blockchain data.", position: "bottom" },
    { target: "[data-tour='doc-upload']", title: "📤 Upload Your Document", body: "Drop a PDF, Word doc, or text file here. The AI extracts all claims and starts fact-checking instantly.", position: "bottom" },
    { target: "[data-tour='doc-scan-btn']", title: "✅ Verify & Fact-Check", body: "Click to start the scan. The AI flags anything misleading, exaggerated, or outright false.", position: "top" },
  ],
  "/dashboard": [
    { target: ".page-title", title: "📊 Your Security Dashboard", body: "All your security activity in one place. Connect your wallet to see your real data instead of the preview.", position: "bottom" },
    { target: "[data-tour='dashboard-stats']", title: "🎯 Security Score & Stats", body: "Your overall security score is calculated from your scan history. The higher the score, the safer your habits.", position: "bottom" },
    { target: "[data-tour='dashboard-history']", title: "🕒 Scan History", body: "Every URL, contract, and document you've scanned is logged here. Green = safe, yellow = caution, red = danger.", position: "top" },
  ],
  "/learn": [
    { target: ".page-title", title: "🎓 Security Academy", body: "Learn everything about Web3 security — from blockchain basics to avoiding rug pulls — in bite-sized lessons.", position: "bottom" },
    { target: "[data-tour='learn-progress']", title: "📈 Track Your Progress", body: "This bar shows how many lessons you've completed. Finish all 6 to unlock your Certificate of Mastery!", position: "bottom" },
    { target: "[data-tour='lessons-grid']", title: "📚 Lesson Library", body: "Click any card to open a lesson. Each ends with a quiz — get it wrong and you can retry with a new question!", position: "top" },
  ],
};

const PAD = 14;

function computeTooltipPlacement(rect: DOMRect, pos: TourStep["position"], tw: number, th: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top = 0, left = 0, arrowClass = "arrow-up";

  switch (pos) {
    case "bottom": top = rect.bottom + PAD + 12; left = rect.left + rect.width / 2 - tw / 2; arrowClass = "arrow-up"; break;
    case "top":    top = rect.top - th - PAD - 12; left = rect.left + rect.width / 2 - tw / 2; arrowClass = "arrow-down"; break;
    case "left":   top = rect.top + rect.height / 2 - th / 2; left = rect.left - tw - PAD - 12; arrowClass = "arrow-right"; break;
    case "right":  top = rect.top + rect.height / 2 - th / 2; left = rect.right + PAD + 12; arrowClass = "arrow-left"; break;
    default:       top = rect.bottom + PAD + 12; left = rect.left + rect.width / 2 - tw / 2; arrowClass = "arrow-up";
  }

  left = Math.max(16, Math.min(left, vw - tw - 16));
  top  = Math.max(80, Math.min(top,  vh - th - 16));
  return { style: { position: "fixed" as const, top, left, width: tw, zIndex: 10002 }, arrowClass };
}

type Phase = "idle" | "splash" | "steps";

export default function SpotlightTour() {
  const { isTourActive, startTour, stopTour } = useTour();
  const location = useLocation();
  const [phase, setPhase]       = useState<Phase>("idle");
  const [stepIdx, setStepIdx]   = useState(0);
  const [rect, setRect]         = useState<DOMRect | null>(null);
  const tooltipRef              = useRef<HTMLDivElement>(null);
  const [tipSize, setTipSize]   = useState({ w: 340, h: 230 });
  const splashTimer             = useRef<ReturnType<typeof setTimeout> | null>(null);

  const steps = TOUR_STEPS[location.pathname] ?? [];

  // Use refs so handleNext always reads the latest values (avoids stale closures)
  const stepsRef     = useRef(steps);
  const stepIdxRef   = useRef(stepIdx);
  const pathnameRef  = useRef(location.pathname);
  stepsRef.current    = steps;
  stepIdxRef.current  = stepIdx;
  pathnameRef.current = location.pathname;

  // ── Auto-start once per session (only on first page load) ──────────────
  useEffect(() => {
    if (!tourAutoStarted) {
      tourAutoStarted = true;
      const t = setTimeout(() => startTour(), 700);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Scroll lock ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isTourActive) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isTourActive]);

  // ── Phase management — reset steps whenever route changes during active tour ──
  useEffect(() => {
    if (isTourActive) {
      setStepIdx(0);
      setRect(null);
      if (location.pathname === "/") {
        setPhase("splash");
        splashTimer.current = setTimeout(() => setPhase("steps"), 2600);
        return () => { if (splashTimer.current) clearTimeout(splashTimer.current); };
      } else {
        setPhase("steps");
      }
    } else {
      setPhase("idle");
    }
  }, [isTourActive, location.pathname]);

  // ── Position spotlight ───────────────────────────────────────────────────
  const measure = useCallback((step: TourStep) => {
    let targetSelector = step.target;
    
    // Mobile special case for Wallet Connect
    if (location.pathname === "/" && step.title === "👛 Connect Your Wallet" && window.innerWidth < 768) {
      const burger = document.querySelector(".uu-hamburger:not(.open)") as HTMLElement;
      if (burger) {
        burger.click();
        // Wait for React to render the menu and the animation to finish
        let attempts = 0;
        const check = setInterval(() => {
          const mobileBtn = document.querySelector("[data-tour='mobile-wallet-btn']");
          if (mobileBtn) {
            const rect = mobileBtn.getBoundingClientRect();
            if (rect.width > 0) {
              setRect(rect);
              // If it's near the final state, clear but do one last check soon
              if (attempts > 10) {
                clearInterval(check);
                setTimeout(() => {
                  const finalBtn = document.querySelector("[data-tour='mobile-wallet-btn']");
                  if (finalBtn) setRect(finalBtn.getBoundingClientRect());
                }, 200);
              }
            }
          }
          if (attempts++ > 30) clearInterval(check);
        }, 60);
        return;
      }
      targetSelector = "[data-tour='mobile-wallet-btn']";
    }

    const el = document.querySelector(targetSelector);
    if (!el) { setStepIdx(p => p + 1); return; }
    el.scrollIntoView({ behavior: "instant", block: "center" });
    setTimeout(() => setRect(el.getBoundingClientRect()), 80);
  }, [location.pathname]);

  useEffect(() => {
    if (phase !== "steps") return;
    if (steps.length === 0) { stopTour(); return; }
    // stepIdx may temporarily exceed steps.length mid-navigation — just wait for phase reset
    if (stepIdx >= steps.length) return;
    measure(steps[stepIdx]);
  }, [stepIdx, phase, steps, measure, stopTour]);

  // ── Tooltip size measurement ─────────────────────────────────────────────
  useEffect(() => {
    if (tooltipRef.current) {
      setTipSize({ w: tooltipRef.current.offsetWidth || 340, h: tooltipRef.current.offsetHeight || 230 });
    }
  });

  // ── Handle Next ──────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    const curStepIdx = stepIdxRef.current;
    const curSteps   = stepsRef.current;
    const curPath    = pathnameRef.current;

    // Close mobile menu if we are leaving the wallet step on home page
    if (curPath === "/" && curStepIdx === 1 && window.innerWidth < 768) {
      const burger = document.querySelector(".uu-hamburger.open") as HTMLElement;
      if (burger) burger.click();
    }

    if (curStepIdx < curSteps.length - 1) {
      setStepIdx(p => p + 1);
    } else {
      stopTour();
    }
  }, [stopTour]);

  // ── Handle Back ──────────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    // Close mobile menu if we are leaving the wallet step
    if (location.pathname === "/" && stepIdx === 1 && window.innerWidth < 768) {
      const burger = document.querySelector(".uu-hamburger.open") as HTMLElement;
      if (burger) burger.click();
    }
    setStepIdx(p => Math.max(0, p - 1));
  }, [location.pathname, stepIdx]);

  // ── Keyboard nav ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isTourActive) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopTour();
      if (e.key === "ArrowRight" || e.key === "Enter") handleNext();
      if (e.key === "ArrowLeft") handleBack();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isTourActive, stopTour, handleNext]);

  if (phase === "idle") return null;

  // ── SPLASH (home page only) ───────────────────────────────────────────────
  if (phase === "splash") {
    return (
      <div className="tour-splash">
        <div className="tour-splash-inner">
          <div className="tour-splash-logo">☂️</div>
          <div className="tour-splash-brand">Urban Umbrella</div>
          <h2 className="tour-splash-title">Welcome to Your Guided Tour</h2>
          <p className="tour-splash-subtitle">
            We'll walk you through every tool — from scanning suspicious links to earning your Web3 Security Certificate.
          </p>
          <LoadingIcon label="Preparing your tour..." />
          <button className="tour-splash-skip" onClick={() => { if (splashTimer.current) clearTimeout(splashTimer.current); stopTour(); }}>
            Skip — I know my way around
          </button>
        </div>
      </div>
    );
  }

  // ── STEPS ────────────────────────────────────────────────────────────────
  if (stepIdx >= steps.length) return null;
  const step = steps[stepIdx];
  const pct  = Math.round(((stepIdx + 1) / steps.length) * 100);

  // Label the Next button
  const isLastStep = stepIdx === steps.length - 1;
  const nextLabel = isLastStep ? "Finish 🎉" : "Next →";

  let tipStyle: React.CSSProperties = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 340, zIndex: 10002 };
  let arrowClass = "arrow-up";

  if (rect) {
    const p = computeTooltipPlacement(rect, step.position, tipSize.w, tipSize.h);
    tipStyle   = p.style;
    arrowClass = p.arrowClass;
  }

  return (
    <>
      <div className="tour-overlay" />
      {rect && (
        <div className="tour-spotlight" style={{ top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }} />
      )}
      <div ref={tooltipRef} className={`tour-tooltip ${arrowClass}`} style={tipStyle}>
        <div className="tour-progress-bar">
          <div className="tour-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="tour-header">
          <span className="tour-step-label">Step {stepIdx + 1} / {steps.length}</span>
          <div className="tour-dots">
            {steps.map((_, i) => (
              <span key={i} className={`tour-dot ${i === stepIdx ? "active" : i < stepIdx ? "done" : ""}`} />
            ))}
          </div>
        </div>
        <h3 className="tour-title">{step.title}</h3>
        <p className="tour-body">{step.body}</p>
        <div className="tour-actions">
          <button className="tour-btn-skip" onClick={stopTour}>Skip Tour</button>
          <div style={{ display: "flex", gap: 8 }}>
            {stepIdx > 0 && <button className="tour-btn-back" onClick={handleBack}>← Back</button>}
            <button className="tour-btn-next" onClick={handleNext}>
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
