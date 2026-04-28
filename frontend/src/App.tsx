import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import { TourProvider } from "./context/TourContext";
import SpotlightTour from "./components/SpotlightTour";
import Navbar   from "./components/Navbar";
import Home     from "./pages/Home";
import ScanUrl  from "./pages/ScanUrl";
import ScanDocument from "./pages/ScanDocument";
import ScanContract from "./pages/ScanContract";
import Dashboard from "./pages/Dashboard";
import Learn    from "./pages/Learn";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <WalletProvider>
        <TourProvider>
          <ScrollToTop />
          <div className="uu-app">
            <Navbar />
            <SpotlightTour />
            <main className="uu-main">
              <Routes>
                <Route path="/"              element={<Home />} />
                <Route path="/scan-url"      element={<ScanUrl />} />
                <Route path="/scan-contract" element={<ScanContract />} />
                <Route path="/scan-document" element={<ScanDocument />} />
                <Route path="/dashboard"     element={<Dashboard />} />
                <Route path="/learn"         element={<Learn />} />
                <Route path="*"              element={
                  <div style={{ textAlign: "center", padding: "8rem 2rem" }}>
                    <div style={{ fontSize: "4rem" }}>404</div>
                    <h2 style={{ color: "#fff", marginTop: 16 }}>Page not found</h2>
                  </div>
                } />
              </Routes>
            </main>
            <footer className="uu-footer">
              <div>☂️ Urban Umbrella — AI-Powered Web3 Security</div>
              <div style={{ fontSize: "0.8rem", opacity: 0.5 }}>
                © 2026 Gabriele Iacopo Langellotto &amp; Bishesh Joshi · MIT Licence
              </div>
            </footer>
          </div>
          <Analytics />
        </TourProvider>
      </WalletProvider>
    </BrowserRouter>
  );
}
