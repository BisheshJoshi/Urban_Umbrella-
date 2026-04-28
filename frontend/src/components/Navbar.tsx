import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import WalletModal from "./WalletModal";
import { useWallet } from "../context/WalletContext";
import { useTour } from "../context/TourContext";

const NAV_LINKS = [
  { to: "/",              label: "Home",      icon: "🏠" },
  { to: "/scan-url",      label: "URL Check", icon: "🔗" },
  { to: "/scan-contract", label: "Contracts", icon: "📄" },
  { to: "/scan-document", label: "Documents", icon: "📁" },
  { to: "/dashboard",     label: "Dashboard", icon: "📊" },
  { to: "/learn",         label: "Learn",     icon: "🎓" },
];

export default function Navbar() {
  const { status, address } = useWallet();
  const { startTour } = useTour();
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen]  = useState(false);
  const [scrolled, setScrolled]  = useState(false);

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const connected     = status === "connected" || status === "authenticated";
  const authenticated = status === "authenticated";

  const walletLabel = authenticated
    ? `🔐 ${address.slice(0, 6)}…${address.slice(-4)}`
    : connected
    ? `🟡 ${address.slice(0, 6)}…${address.slice(-4)}`
    : "Connect Wallet";

  return (
    <>
      <header className={`uu-navbar ${scrolled ? "scrolled" : ""}`}>
        <NavLink to="/" className="uu-navbar-brand">
          <span className="uu-logo-mark" aria-hidden="true">☂️</span>
          <span className="uu-navbar-title">Urban Umbrella</span>
        </NavLink>

        {/* Desktop links */}
        <nav className="uu-navbar-links" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `uu-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="uu-navbar-right">
          <button
            className="tour-help-btn"
            onClick={startTour}
            title="Start guided tour"
            aria-label="Start guided tour"
          >
            ?
          </button>
          <button
            className={`uu-btn ${connected ? "uu-btn-connected" : "uu-btn-primary"}`}
            onClick={() => setModalOpen(true)}
          >
            {connected && <span className="uu-live-dot" />}
            {walletLabel}
          </button>

          {/* Hamburger */}
          <button
            className={`uu-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="uu-mobile-menu">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `uu-mobile-link ${isActive ? "active" : ""}`
              }
            >
              {icon} {label}
            </NavLink>
          ))}
          <button
            className="uu-btn uu-btn-primary"
            data-tour="mobile-wallet-btn"
            style={{ width: "100%", marginTop: 12 }}
            onClick={() => { setMenuOpen(false); setModalOpen(true); }}
          >
            {walletLabel}
          </button>
        </div>
      )}

      <WalletModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
