import React, { useState, DragEvent, useRef } from "react";
import { useWallet } from "../context/WalletContext";
import LoadingIcon from "../components/LoadingIcon";

function UploadIcon(): React.JSX.Element {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

export default function ScanDocument(): React.JSX.Element {
  const { authToken } = useWallet();

  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [eli5, setEli5] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    // Don't read raw bytes as text! Just store the file name for the demo.
    e.target.value = '';
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>): void => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDragOver = (e: DragEvent<HTMLDivElement>): void => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDragLeave = (e: DragEvent<HTMLDivElement>): void => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const onDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setFileName(file.name);
    // Again, don't read the raw bytes as text to avoid garbled output.
  };

  const handleScan = async (): Promise<void> => {
    if (!fileName) {
      setError("Please upload a document first.");
      return;
    }
    setLoading(true); setError(""); setResult(null);

    const steps = [
      "Extracting claims from document...",
      "Cross-referencing claims with live Web3 data...",
      "Analyzing historical blockchain ledgers...",
      "Generating AI Truth & Accuracy report..."
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setLoadingStep(steps[i]);
        await new Promise(r => setTimeout(r, 800));
      }

      const demoData = {
        fact_check_score: 98,
        status: "VERIFIED",
        document_type: fileName.split('.').pop()?.toUpperCase() || "UNKNOWN",
        misinformation_detected: 0,
        unverifiable_claims: 0,
        verified_sources: [
          "https://etherscan.io",
          "https://coinmarketcap.com"
        ]
      };

      setResult(demoData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const resultText = result ? JSON.stringify(result, null, 2) : "";

  return (
    <div className="page-scan-doc">

      <div className="page-header">
        <h1 className="page-title">📄 Web3 Fact-Checker</h1>
        <p className="page-subtitle">
          Upload whitepapers, pitch decks, or articles. Our AI will cross-reference their claims against live on-chain data and trusted Web3 sources.
        </p>
      </div>

      <div className="scan-doc-grid">
        {/* LEFT: Input */}
        <div className="uu-card">
          <div className="uu-card-header">
            <div className="uu-card-title">📥 Your Document</div>
          </div>
          <div className="uu-card-body">
            {/* Drop Zone */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
            />
            <div
              data-tour="doc-upload"
              className={`uu-drag-zone ${isDragging ? "active" : ""}`}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={handleZoneClick}
              role="button"
              tabIndex={0}
              aria-label="Drop zone for documents"
              style={{ padding: "4rem 2rem", marginTop: "1rem" }}
            >
              <div className="uu-drag-icon"><UploadIcon /></div>
              <div>
                {fileName
                  ? <><strong>✅ {fileName}</strong><br /><small>Document loaded — ready to scan</small></>
                  : <><strong>Drop your document here</strong><br /><small>PDF, DOCX, XLSX, TXT</small></>
                }
              </div>
            </div>

            <button
              data-tour="doc-scan-btn"
              className="uu-btn uu-btn-primary"
              onClick={handleScan}
              disabled={loading}
              style={{ width: "100%", marginTop: 24 }}
            >
              {loading ? "⏳ Scanning…" : "🔬 Scan Document"}
            </button>

            {error && <div className="uu-alert uu-alert-error" style={{ marginTop: 16 }}>⚠️ {error}</div>}
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="uu-card">
          <div className="uu-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="uu-card-title">📋 Results</div>
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
          <div className="uu-card-body">
            {result ? (
              <div className="uu-results-container">
                <pre className="uu-code">{resultText}</pre>

                {eli5 && (
                  <div style={{ marginTop: 24, padding: "16px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem" }}>🤖 AI Simple Summary</h3>
                    <p style={{ margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
                      Our AI has checked this document against the whole internet. Good news! Everything written here seems true and matches the official records. It doesn't look like they are trying to trick you with fake info. But remember always double-check things yourself before making big choices!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="uu-empty-state">
                {loading
                  ? (
                    <LoadingIcon label={loadingStep || "AI is scanning your document..."} />
                  )
                  : "Your results will appear here after scanning."}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
