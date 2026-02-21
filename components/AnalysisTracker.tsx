"use client";

import type { TrackerEntry } from "@/lib/types";

const MIN_ANALYSES = 5;

interface AnalysisTrackerProps {
  entries: TrackerEntry[];
  onPublish: () => void;
}

export default function AnalysisTracker({ entries, onPublish }: AnalysisTrackerProps) {
  const bestEntry = entries.reduce<TrackerEntry | null>((best, e) => {
    if (!best || e.result.p_value < best.result.p_value) return e;
    return best;
  }, null);

  const hasSignificant = entries.some((e) => e.result.p_value < 0.05);
  const hasEnough = entries.length >= MIN_ANALYSES;
  const canPublish = hasSignificant && hasEnough;
  const nudge = entries.length >= 12 && !hasSignificant;

  function formatP(p: number) {
    return p < 0.001 ? "< 0.001" : p.toFixed(3);
  }

  const remaining = Math.max(0, MIN_ANALYSES - entries.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono-plex)", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Analyses run
          </span>
          <span style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono-plex)", color: "var(--navy)", fontWeight: 700 }}>
            {entries.length} <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>/ {MIN_ANALYSES} min.</span>
          </span>
        </div>
        <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${Math.min(100, (entries.length / MIN_ANALYSES) * 100)}%`,
            background: hasEnough ? "var(--forest)" : "#f59e0b",
            borderRadius: "3px",
            transition: "width 0.4s ease",
          }} />
        </div>
        {!hasEnough && entries.length > 0 && (
          <p style={{ fontSize: "0.7rem", color: "var(--text-faint)", fontFamily: "var(--font-mono-plex)", marginTop: "4px" }}>
            {remaining} more {remaining === 1 ? "analysis" : "analyses"} required
          </p>
        )}
      </div>

      {/* Best p-value */}
      {bestEntry && (
        <div style={{
          border: `1px solid ${bestEntry.result.p_value < 0.05 ? "#6ee7b7" : "var(--border)"}`,
          borderRadius: "6px",
          padding: "12px 14px",
          background: bestEntry.result.p_value < 0.05 ? "var(--forest-bg)" : "#f9fafb",
        }}>
          <p style={{ fontSize: "0.67rem", fontFamily: "var(--font-mono-plex)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 6px" }}>
            Best p-value
          </p>
          <p style={{
            fontFamily: "var(--font-mono-plex)",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: bestEntry.result.p_value < 0.05 ? "var(--forest)" : "var(--navy)",
            margin: "0 0 4px",
            lineHeight: 1,
          }}>
            p = {formatP(bestEntry.result.p_value)}
          </p>
          <p style={{ fontSize: "0.73rem", color: "var(--text-muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {bestEntry.request.description}
          </p>
        </div>
      )}

      {/* P-value list */}
      {entries.length > 0 ? (
        <div>
          <p style={{ fontSize: "0.67rem", fontFamily: "var(--font-mono-plex)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px", fontWeight: 600 }}>
            All p-values
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {entries.map((entry, i) => {
              const p = entry.result.p_value;
              const sig = p < 0.05;
              return (
                <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.67rem", fontFamily: "var(--font-mono-plex)", color: "var(--text-faint)", width: "16px", textAlign: "right", flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, position: "relative", height: "12px", background: "#e5e7eb", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, height: "100%",
                      width: `${Math.min(100, Math.max(2, (1 - p) * 100))}%`,
                      background: sig ? "var(--forest)" : "#93c5fd",
                      borderRadius: "2px",
                      transition: "width 0.3s ease",
                    }} />
                    {/* p=0.05 threshold line at 95% of bar */}
                    <div style={{ position: "absolute", top: 0, left: "95%", height: "100%", width: "2px", background: "#ef4444", opacity: 0.8 }} />
                  </div>
                  <span style={{
                    fontSize: "0.72rem", fontFamily: "var(--font-mono-plex)",
                    width: "54px", textAlign: "right", flexShrink: 0,
                    color: sig ? "var(--forest)" : "var(--text-secondary)",
                    fontWeight: sig ? 700 : 400,
                  }}>
                    {formatP(p)}
                  </span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: "0.65rem", color: "var(--text-faint)", fontFamily: "var(--font-mono-plex)", marginTop: "5px", textAlign: "right" }}>
            red line = p = 0.05 threshold
          </p>
        </div>
      ) : (
        <p style={{ fontSize: "0.82rem", color: "var(--text-faint)", textAlign: "center", padding: "20px 0", fontStyle: "italic" }}>
          P-values will appear here as you run analyses.
        </p>
      )}

      {/* Nudge */}
      {nudge && (
        <div style={{
          background: "var(--amber-bg)", border: "1px solid #fcd34d",
          borderRadius: "6px", padding: "10px 14px",
          fontSize: "0.8rem", color: "#78350f", lineHeight: 1.55,
        }}>
          <strong>Tip:</strong> Try a specific combination — e.g., a particular crop on a particular soil type with a particular irrigation method. Or try adding more control variables to the regression.
        </div>
      )}

      {/* Publish button */}
      <div>
        <button
          onClick={onPublish}
          disabled={!canPublish}
          className={canPublish ? "pulse-green" : ""}
          style={{
            width: "100%", padding: "13px",
            borderRadius: "6px", border: "none",
            fontSize: "0.9rem", fontWeight: 700,
            fontFamily: "var(--font-source), serif",
            cursor: canPublish ? "pointer" : "not-allowed",
            transition: "background 0.2s",
            background: canPublish ? "var(--forest)" : "#e5e7eb",
            color: canPublish ? "#ffffff" : "var(--text-faint)",
          }}
        >
          {canPublish ? "🎉  Submit for Publication" : "Submit for Publication"}
        </button>
        {!canPublish && (
          <p style={{ fontSize: "0.7rem", color: "var(--text-faint)", fontFamily: "var(--font-mono-plex)", textAlign: "center", marginTop: "6px" }}>
            {!hasEnough && !hasSignificant
              ? `Need ${remaining} more ${remaining === 1 ? "analysis" : "analyses"} + p < 0.05`
              : !hasEnough
              ? `Need ${remaining} more ${remaining === 1 ? "analysis" : "analyses"}`
              : "Need a result with p < 0.05"}
          </p>
        )}
      </div>
    </div>
  );
}
