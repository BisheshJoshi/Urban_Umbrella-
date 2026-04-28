const fs = require('fs');
let css = fs.readFileSync('frontend/src/App.css', 'utf8');
const tourCss = `

/* ============================================================
   SPOTLIGHT TOUR
============================================================ */
.tour-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: transparent;
  cursor: pointer;
}
.tour-spotlight {
  position: fixed;
  border-radius: 12px;
  z-index: 9999;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 0 0 9999px rgba(0, 0, 0, 0.82),
    0 0 0 2px rgba(147, 51, 234, 0.7),
    0 0 30px rgba(147, 51, 234, 0.4);
}
.tour-tooltip {
  position: fixed;
  z-index: 10002;
  background: rgba(15, 10, 30, 0.92);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(147, 51, 234, 0.35);
  border-radius: 18px;
  padding: 22px 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  animation: tourIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  max-width: 320px;
}
@keyframes tourIn {
  from { opacity: 0; transform: scale(0.9) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.tour-step-count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}
.tour-dots { display: flex; gap: 5px; }
.tour-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  transition: all 0.3s;
}
.tour-dot.active {
  background: var(--purple);
  width: 18px;
  border-radius: 3px;
}
.tour-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  line-height: 1.3;
}
.tour-body {
  font-size: 0.88rem;
  color: rgba(255,255,255,0.65);
  line-height: 1.65;
  margin: 0 0 18px;
}
.tour-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.tour-btn-skip {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.3);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 6px 0;
  transition: color 0.2s;
}
.tour-btn-skip:hover { color: rgba(255,255,255,0.6); }
.tour-btn-back {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.tour-btn-back:hover { background: rgba(255,255,255,0.1); color: #fff; }
.tour-btn-next {
  background: var(--gradient);
  border: none;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 9px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(147, 51, 234, 0.35);
}
.tour-btn-next:hover { opacity: 0.9; transform: translateY(-1px); }
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
fs.writeFileSync('frontend/src/App.css', css + tourCss);
console.log('Done');
