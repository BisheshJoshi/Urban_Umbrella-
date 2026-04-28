const fs = require('fs');
let css = fs.readFileSync('frontend/src/App.css', 'utf8');

// Remove old tour section if it exists
css = css.replace(/\/\*[\s\S]*?SPOTLIGHT TOUR[\s\S]*$/m, '');
css = css.replace(/\/\*[\s\S]*?Spotlight Tour[\s\S]*$/m, '');

const tourCss = `
/* ============================================================
   SPOTLIGHT TOUR — Enhanced
============================================================ */

/* ── Splash Screen ── */
.tour-splash {
  position: fixed;
  inset: 0;
  z-index: 11000;
  background: radial-gradient(ellipse at 50% 40%, #1a0a3a 0%, #050508 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: splashFadeIn 0.5s ease-out;
}
@keyframes splashFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.tour-splash-inner {
  text-align: center;
  max-width: 520px;
  padding: 48px 40px;
  animation: splashRise 0.65s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes splashRise {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tour-splash-logo {
  font-size: 5rem;
  display: block;
  margin-bottom: 16px;
  animation: logoFloat 2.5s ease-in-out infinite;
  filter: drop-shadow(0 0 32px rgba(251, 113, 133, 0.7));
}
@keyframes logoFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%       { transform: translateY(-12px) rotate(-6deg); }
}
.tour-splash-brand {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 5px;
  background: linear-gradient(90deg, #c084fc, #fb7185);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 22px;
}
.tour-splash-title {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 14px;
  line-height: 1.2;
}
.tour-splash-subtitle {
  font-size: 0.97rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.75;
  margin: 0 0 36px;
}
.tour-splash-bar {
  height: 3px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 28px;
}
.tour-splash-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #9333ea, #fb7185);
  border-radius: 2px;
  animation: barFill 2.5s ease-out forwards;
}
@keyframes barFill {
  from { width: 0; }
  to   { width: 100%; }
}
.tour-splash-skip {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.35);
  padding: 10px 28px;
  border-radius: 50px;
  font-size: 0.83rem;
  cursor: pointer;
  transition: all 0.25s;
}
.tour-splash-skip:hover {
  border-color: rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.04);
}

/* ── Overlay ── */
.tour-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: transparent;
  cursor: pointer;
}

/* ── Spotlight hole with pulsing glow ── */
.tour-spotlight {
  position: fixed;
  border-radius: 12px;
  z-index: 9999;
  pointer-events: none;
  transition: top 0.45s cubic-bezier(0.4, 0, 0.2, 1),
              left 0.45s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.45s cubic-bezier(0.4, 0, 0.2, 1),
              height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 0 0 9999px rgba(0, 0, 0, 0.82),
    0 0 0 2px rgba(147, 51, 234, 0.9),
    0 0 0 4px rgba(147, 51, 234, 0.15),
    0 0 40px rgba(147, 51, 234, 0.4);
  animation: spotPulse 2.2s ease-in-out infinite;
}
@keyframes spotPulse {
  0%, 100% {
    box-shadow:
      0 0 0 9999px rgba(0,0,0,0.82),
      0 0 0 2px rgba(147,51,234,0.9),
      0 0 20px rgba(147,51,234,0.35);
  }
  50% {
    box-shadow:
      0 0 0 9999px rgba(0,0,0,0.82),
      0 0 0 2px rgba(167,71,255,1),
      0 0 50px rgba(147,51,234,0.65),
      0 0 90px rgba(147,51,234,0.2);
  }
}

/* ── Tooltip Card ── */
.tour-tooltip {
  position: fixed;
  z-index: 10002;
  background: rgba(8, 4, 20, 0.97);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid rgba(147, 51, 234, 0.45);
  border-radius: 18px;
  padding: 0 0 20px;
  box-shadow:
    0 24px 64px rgba(0,0,0,0.65),
    0 0 0 1px rgba(255,255,255,0.04),
    inset 0 1px 0 rgba(255,255,255,0.07);
  animation: tooltipPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  max-width: 340px;
  overflow: hidden;
}
@keyframes tooltipPop {
  from { opacity: 0; transform: scale(0.82) translateY(12px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}

/* ── Arrow pointers ── */
.tour-tooltip::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border: 9px solid transparent;
  z-index: 1;
}
.tour-tooltip.arrow-up::before    { top: -18px; left: 50%; transform: translateX(-50%); border-bottom-color: rgba(147, 51, 234, 0.45); }
.tour-tooltip.arrow-down::before  { bottom: -18px; left: 50%; transform: translateX(-50%); border-top-color: rgba(147, 51, 234, 0.45); }
.tour-tooltip.arrow-left::before  { left: -18px; top: 40px; border-right-color: rgba(147, 51, 234, 0.45); }
.tour-tooltip.arrow-right::before { right: -18px; top: 40px; border-left-color: rgba(147, 51, 234, 0.45); }

/* ── Progress bar ── */
.tour-progress-bar {
  height: 3px;
  background: rgba(255,255,255,0.06);
  width: 100%;
  margin-bottom: 18px;
}
.tour-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #9333ea, #fb7185);
  transition: width 0.4s ease;
  border-radius: 0 2px 2px 0;
}

/* ── Header row ── */
.tour-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 12px;
}
.tour-step-label {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.tour-dots { display: flex; gap: 5px; align-items: center; }
.tour-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  transition: all 0.35s ease;
}
.tour-dot.active { background: #9333ea; width: 20px; border-radius: 3px; }
.tour-dot.done   { background: rgba(147, 51, 234, 0.4); }

/* ── Text ── */
.tour-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
  padding: 0 20px;
  line-height: 1.35;
}
.tour-body {
  font-size: 0.86rem;
  color: rgba(255,255,255,0.58);
  line-height: 1.72;
  margin: 0 0 20px;
  padding: 0 20px;
}

/* ── Action buttons ── */
.tour-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  gap: 8px;
}
.tour-btn-skip {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.22);
  font-size: 0.76rem;
  cursor: pointer;
  transition: color 0.2s;
  white-space: nowrap;
  padding: 0;
}
.tour-btn-skip:hover { color: rgba(255,255,255,0.5); }
.tour-btn-back {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.5);
  font-size: 0.82rem;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.tour-btn-back:hover { background: rgba(255,255,255,0.09); color: #fff; }
.tour-btn-next {
  background: linear-gradient(135deg, #9333ea, #7c3aed);
  border: none;
  color: #fff;
  font-size: 0.88rem;
  font-weight: 600;
  padding: 9px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(147, 51, 234, 0.45);
  white-space: nowrap;
}
.tour-btn-next:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(147, 51, 234, 0.55); }

/* ── Help button in navbar ── */
.tour-help-btn {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: rgba(147, 51, 234, 0.15);
  border: 1px solid rgba(147, 51, 234, 0.35);
  color: #c084fc;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.tour-help-btn:hover {
  background: rgba(147, 51, 234, 0.3);
  border-color: rgba(147, 51, 234, 0.6);
  color: #e9d5ff;
  transform: scale(1.08);
}
`;

fs.writeFileSync('frontend/src/App.css', css.trimEnd() + '\n' + tourCss);
console.log('Done — Tour CSS replaced successfully');
