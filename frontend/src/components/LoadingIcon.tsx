import React from "react";

interface LoadingIconProps {
  size?: number;
  label?: string;
}

export default function LoadingIcon({ size = 80, label }: LoadingIconProps) {
  return (
    <div className="uu-loading-container">
      <div className="uu-loading-umbrella-wrapper" style={{ width: size, height: size }}>
        <div className="uu-loading-radar" />
        <div className="uu-loading-umbrella">☂️</div>
        <div className="uu-loading-rain">
          <span>0</span><span>1</span><span>0</span><span>1</span><span>0</span>
        </div>
      </div>
      {label && <p className="uu-loading-label">{label}</p>}
    </div>
  );
}
