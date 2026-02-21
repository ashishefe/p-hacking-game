"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PValuePlot from "@/components/PValuePlot";
import type { TrackerEntry } from "@/lib/types";

interface GameState {
  tracker: TrackerEntry[];
  publishedEntry: TrackerEntry | null;
  seed: number;
}

type RevealStep = "celebration" | "rugpull" | "explanation" | "recap";

export default function RevealPage() {
  const router = useRouter();
  const [state, setState] = useState<GameState | null>(null);
  const [step, setStep] = useState<RevealStep>("celebration");

  useEffect(() => {
    const raw = sessionStorage.getItem("phacking_game_state");
    if (!raw) { router.push("/"); return; }
    try { setState(JSON.parse(raw)); } catch { router.push("/"); }
  }, [router]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep("rugpull"), 2500),
      setTimeout(() => setStep("explanation"), 5000),
      setTimeout(() => setStep("recap"), 9000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!state) return null;

  const { tracker, publishedEntry } = state;
  const totalAnalyses = tracker.length;
  const sigCount = tracker.filter((e) => e.result.p_value < 0.05).length;
  const publishedP = publishedEntry?.result.p_value;
  const fpProb = (1 - Math.pow(0.95, totalAnalyses)) * 100;
  const paperTitle = buildPaperTitle(publishedEntry);

  // Background shifts as reveal progresses
  const bg =
    step === "celebration" ? "#f0fdf4" :
    step === "rugpull"     ? "#fffbeb" :
    "var(--page-bg)";

  return (
    <div style={{ minHeight: "100vh", background: bg, transition: "background 1s ease" }}>

      {/* Header — consistent with other pages */}
      <header style={{ background: "var(--navy)", borderBottom: "2px solid #152d4a", padding: "14px 24px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontFamily: "var(--font-playfair)", color: "#ffffff", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
            {step === "celebration" ? "Publication Result" : "The Reveal"}
          </h1>
          <button
            onClick={() => router.push("/")}
            style={{
              fontFamily: "var(--font-source), serif",
              color: "#ffffff",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.8rem",
              padding: "5px 12px",
              fontWeight: 600,
            }}
          >
            New game
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* ── STEP 1: Fake celebration ──────────────────────────── */}
        {step === "celebration" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "20px", display: "inline-block", animation: "bounce 0.8s ease infinite" }}>🎉</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "2rem", fontWeight: 700, color: "#166534", marginBottom: "8px" }}>
              Paper Accepted!
            </h2>
            <p style={{ color: "#15803d", fontSize: "0.9rem", marginBottom: "32px" }}>
              Congratulations on your first publication.
            </p>
            <div style={{
              background: "#ffffff",
              border: "2px solid #bbf7d0",
              borderRadius: "10px",
              padding: "24px 28px",
              textAlign: "left",
              maxWidth: "520px",
              margin: "0 auto",
              boxShadow: "0 4px 16px rgba(22,101,52,0.08)",
            }}>
              <p style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: "10px" }}>
                Journal of Agricultural Economics · Forthcoming
              </p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.15rem", fontWeight: 600, color: "var(--navy)", lineHeight: 1.4, marginBottom: "16px" }}>
                &ldquo;{paperTitle}&rdquo;
              </p>
              <div style={{ display: "flex", gap: "20px" }}>
                {[
                  { label: "p-value", val: publishedP !== undefined ? publishedP.toFixed(3) : "—" },
                  { label: "sample (n)", val: String(publishedEntry?.result.n_filtered ?? "—") },
                  { label: "significance", val: "p < 0.05 ✓" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono-plex)", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                    <div style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.9rem", fontWeight: 600, color: "#166534" }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2+: Rug pull onward ──────────────────────────── */}
        {step !== "celebration" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Rug pull card */}
            <div style={{
              background: "var(--card-bg)",
              border: "2px solid #fcd34d",
              borderRadius: "10px",
              padding: "28px 32px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>⛔</div>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "2rem", fontWeight: 700, color: "var(--navy)", marginBottom: "16px" }}>
                Wait.
              </h2>
              <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto 12px" }}>
                That dataset was{" "}
                <strong style={{ color: "var(--rust)", fontWeight: 700 }}>100% randomly generated.</strong>{" "}
                Every variable was independent. GrowMax doesn&apos;t do anything. There was no effect to find.
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto" }}>
                You ran <strong style={{ color: "var(--navy)" }}>{totalAnalyses} analyses</strong>{" "}
                and found{" "}
                {sigCount > 0 ? (
                  <><strong style={{ color: "var(--rust)" }}>{sigCount}</strong> with p &lt; 0.05. That&apos;s not a discovery — that&apos;s exactly what probability theory predicts.</>
                ) : (
                  <>none with p &lt; 0.05 — but you got very close.</>
                )}
              </p>
            </div>

            {/* Explanation cards */}
            {(step === "explanation" || step === "recap") && (
              <>
                <div style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ background: "#f9fafb", borderBottom: "1px solid var(--border)", padding: "10px 20px" }}>
                    <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "0.95rem", fontWeight: 600, color: "var(--navy)", margin: 0 }}>
                      What just happened
                    </h3>
                  </div>
                  <div style={{ padding: "0" }}>
                    {[
                      {
                        label: "The mathematics of false positives",
                        text: `If you run ${totalAnalyses} tests at α = 0.05 on data where nothing is real, the probability of at least one false positive is 1 − 0.95${totalAnalyses} ≈ ${fpProb.toFixed(0)}%. You didn't get lucky. You got statistics.`,
                        math: true,
                        n: totalAnalyses,
                        fp: fpProb,
                      },
                      {
                        label: "What you did has a name: p-hacking",
                        text: "It's the practice of trying multiple analyses and reporting only the one that produces a significant result. Each choice — which subgroup, which controls, which farms to exclude — is effectively a new test. Run enough and something will cross 0.05 by pure chance.",
                      },
                      {
                        label: "This isn't just a classroom trick",
                        text: "It happens in real published research across every field. It's one of the main drivers of the replication crisis: a 2015 study found that only 36% of published psychology findings could be replicated.",
                      },
                      {
                        label: "The good news: once you know this, you can spot it",
                        text: "There are tools to prevent p-hacking — like pre-registration, where researchers commit to their analysis plan before seeing the data. The bullseye has to be drawn before the shot is fired, not after.",
                      },
                    ].map((item, i, arr) => (
                      <div key={item.label} style={{
                        padding: "16px 20px",
                        borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                        display: "flex",
                        gap: "16px",
                      }}>
                        <span style={{
                          fontFamily: "var(--font-mono-plex)",
                          fontSize: "0.68rem",
                          color: "var(--text-faint)",
                          flexShrink: 0,
                          paddingTop: "3px",
                          fontWeight: 600,
                        }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px", fontFamily: "var(--font-source), serif" }}>
                            {item.label}
                          </p>
                          {item.math ? (
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                              If you run {item.n} tests at α = 0.05 on data where nothing is real, the probability of at least one false positive is{" "}
                              <span style={{ fontFamily: "var(--font-mono-plex)", color: "var(--rust)", fontWeight: 600 }}>
                                1 − 0.95<sup>{item.n}</sup> ≈ {item.fp!.toFixed(0)}%
                              </span>
                              . You didn&apos;t get lucky. You got statistics.
                            </p>
                          ) : (
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                              {item.text}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Recap */}
            {step === "recap" && (
              <>
                {/* Stat grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "12px" }}>
                  {[
                    { label: "Analyses run", value: totalAnalyses, variant: "neutral" },
                    { label: "Significant results", value: sigCount, variant: sigCount > 0 ? "amber" : "neutral" },
                    { label: "Published p-value", value: publishedP !== undefined ? publishedP.toFixed(3) : "—", variant: "red" },
                    { label: "Actual false positive risk", value: `~${fpProb.toFixed(0)}%`, variant: "red" },
                  ].map((s) => (
                    <div key={s.label} style={{
                      background: s.variant === "red" ? "var(--rust-bg)" : s.variant === "amber" ? "var(--amber-bg)" : "var(--card-bg)",
                      border: `1px solid ${s.variant === "red" ? "#fca5a5" : s.variant === "amber" ? "#fde68a" : "var(--border)"}`,
                      borderRadius: "8px",
                      padding: "16px",
                      textAlign: "center",
                    }}>
                      <div style={{
                        fontFamily: "var(--font-mono-plex)",
                        fontSize: "1.8rem",
                        fontWeight: 700,
                        color: s.variant === "red" ? "var(--rust)" : s.variant === "amber" ? "var(--amber)" : "var(--navy)",
                        marginBottom: "4px",
                        lineHeight: 1,
                      }}>
                        {s.value}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono-plex)" }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* P-value plot */}
                {tracker.length > 0 && (
                  <div style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "20px 24px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "16px" }}>
                      <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "0.95rem", fontWeight: 600, color: "var(--navy)", margin: 0 }}>
                        Your research journey
                      </h3>
                      <span style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.68rem", color: "var(--text-faint)" }}>
                        red line = p = 0.05 threshold
                      </span>
                    </div>
                    <PValuePlot entries={tracker} publishedEntry={publishedEntry} />
                    <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", textAlign: "center", marginTop: "12px", lineHeight: 1.6 }}>
                      You tested <strong style={{ color: "var(--navy)" }}>{totalAnalyses}</strong> {totalAnalyses === 1 ? "hypothesis" : "hypotheses"} and reported 1 result.
                      Your actual false positive risk was <strong style={{ color: "var(--rust)" }}>{fpProb.toFixed(0)}%</strong> — not 5%.
                    </p>
                  </div>
                )}

                {/* Nav buttons */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => router.push("/")}
                    style={{
                      flex: 1, padding: "13px",
                      border: "1px solid var(--border)", borderRadius: "6px",
                      background: "var(--card-bg)", color: "var(--text-secondary)",
                      fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                      fontFamily: "var(--font-source), serif", transition: "background 0.15s",
                    }}
                  >
                    ← Play Again
                  </button>
                  <button
                    onClick={() => router.push("/deeper")}
                    style={{
                      flex: 1, padding: "13px",
                      border: "none", borderRadius: "6px",
                      background: "var(--navy)", color: "#ffffff",
                      fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                      fontFamily: "var(--font-source), serif", transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--forest)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--navy)"; }}
                  >
                    Go Deeper →
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function buildPaperTitle(entry: TrackerEntry | null): string {
  if (!entry) return "GrowMax Increases Crop Yields: A Rigorous Analysis";
  const outcome = entry.request.outcome_var === "yield_kg_per_hectare"
    ? "Crop Yields" : entry.request.outcome_var.replace(/_/g, " ");
  const filters = entry.request.filters;
  if (filters.length === 0) return `GrowMax Significantly Increases ${outcome}: Evidence from 200 Farms`;
  const filterDesc = filters.map((f) => {
    if (f.operator === "eq") return `${cap(String(f.value))} Farms`;
    if (f.operator === "gt" || f.operator === "gte") return `High-${cap(f.field.replace(/_/g, " "))} Farms`;
    return cap(f.field.replace(/_/g, " "));
  }).join(", ");
  return `GrowMax Increases ${outcome} in ${filterDesc}: A Rigorous Analysis`;
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
