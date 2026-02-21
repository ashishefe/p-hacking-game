"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatasetTable from "@/components/DatasetTable";
import ChatInterface from "@/components/ChatInterface";
import AnalysisTracker from "@/components/AnalysisTracker";
import GuidedExploration from "@/components/GuidedExploration";
import { generateDataset, generateSeed } from "@/lib/dataset";
import type { Farm, TrackerEntry } from "@/lib/types";

const VARIABLES = [
  { name: "uses_growmax",         type: "Binary",      desc: "1 = used GrowMax last season, 0 = did not" },
  { name: "yield_kg_per_hectare", type: "Continuous",  desc: "Crop yield in kg/ha — the main outcome variable" },
  { name: "crop_type",            type: "Categorical", desc: "wheat · rice · sorghum · maize · cotton" },
  { name: "soil_type",            type: "Categorical", desc: "clay · loam · sandy" },
  { name: "irrigation",           type: "Categorical", desc: "drip · flood · rainfed" },
  { name: "rainfall_mm",          type: "Continuous",  desc: "Annual rainfall at the farm (mm)" },
  { name: "altitude_m",           type: "Continuous",  desc: "Farm altitude above sea level (m)" },
  { name: "farm_size_hectares",   type: "Continuous",  desc: "Total cultivable area (ha)" },
  { name: "years_since_rotation", type: "Integer 1–5", desc: "Years since last crop rotation" },
  { name: "avg_march_temp_c",     type: "Continuous",  desc: "Average temperature in March — peak growing season (°C)" },
];

export default function GamePage() {
  const router = useRouter();
  const [seed, setSeed] = useState(42);
  const [data, setData] = useState<Farm[]>(() => generateDataset(42));
  const [tracker, setTracker] = useState<TrackerEntry[]>([]);
  const [pendingInput, setPendingInput] = useState<string | undefined>();

  // Randomise seed client-side only — avoids SSR/client hydration mismatch
  useEffect(() => {
    const s = Math.floor(Math.random() * 1000000);
    setSeed(s);
    setData(generateDataset(s));
  }, []);

  function handleNewDataset() {
    const newSeed = generateSeed();
    setSeed(newSeed);
    setData(generateDataset(newSeed));
    setTracker([]);
  }

  const handleAnalysis = useCallback((entry: TrackerEntry) => {
    setTracker((prev) => [...prev, entry]);
  }, []);

  function handlePublish() {
    const bestEntry = tracker.reduce<TrackerEntry | null>((best, e) => {
      if (!best || e.result.p_value < best.result.p_value) return e;
      return best;
    }, null);
    const publishState = { tracker, publishedEntry: bestEntry, seed };
    sessionStorage.setItem("phacking_game_state", JSON.stringify(publishState));
    router.push("/reveal");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--page-bg)" }}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <header style={{
        background: "var(--navy)",
        borderBottom: "2px solid #152d4a",
        padding: "14px 24px",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{
              fontFamily: "var(--font-playfair)",
              color: "#ffffff",
              fontSize: "1.25rem",
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.01em",
            }}>
              GrowMax Fertilizer Study
            </h1>
            <p style={{
              fontFamily: "var(--font-mono-plex)",
              color: "#93c5fd",
              fontSize: "0.7rem",
              margin: "3px 0 0",
              letterSpacing: "0.04em",
            }}>
              Research Dashboard · Dataset #{seed}
            </p>
          </div>
          <div style={{
            fontFamily: "var(--font-mono-plex)",
            color: "#7dd3fc",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "right",
          }}>
            <div>Research Portal</div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 24px 48px" }}>

        {/* ── Mission brief ─────────────────────────────────────── */}
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          {/* Card header bar */}
          <div style={{
            background: "#dbeafe",
            borderBottom: "1px solid #bfdbfe",
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono-plex)", color: "#1d4ed8", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              📋  Researcher Briefing
            </span>
          </div>

          <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>
            {/* Left: narrative */}
            <div>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.35rem", fontWeight: 600, color: "var(--navy)", marginBottom: "14px" }}>
                Welcome, Researcher.
              </h2>
              <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "12px" }}>
                You are a junior agricultural economist. You have been given data from <strong style={{ color: "var(--text-primary)" }}>200 farms</strong> — some used the new fertilizer <strong style={{ color: "var(--text-primary)" }}>GrowMax</strong> last season, others did not. Your job is to determine whether GrowMax has a statistically significant effect on crop yields.
              </p>
              <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "12px" }}>
                Use the AI assistant to run statistical analyses. Ask it anything in plain English — compare groups, filter by crop type or soil, add control variables, test subgroups. Each analysis will report a <strong style={{ color: "var(--text-primary)" }}>p-value</strong>: the lower it is, the more "statistically significant" your result.
              </p>
              <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "14px" }}>
                The conventional threshold for publication is <code style={{ fontFamily: "var(--font-mono-plex)", background: "var(--forest-bg)", color: "var(--forest)", padding: "1px 6px", borderRadius: "3px", fontSize: "0.88rem", border: "1px solid #a7f3d0" }}>p &lt; 0.05</code>. Once you find a result that clears that bar, you may hit <strong style={{ color: "var(--text-primary)" }}>Submit for Publication</strong>.
              </p>
              <div style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "6px",
                padding: "11px 16px",
                fontSize: "0.9rem",
                color: "#78350f",
                lineHeight: 1.65,
              }}>
                <strong>Department requirement:</strong> Run at least <strong>5 analyses</strong> before submitting — your department head wants evidence that you explored the data thoroughly, not just the first thing you tried.
              </div>
            </div>

            {/* Right: variable table */}
            <div>
              <p style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "10px", fontWeight: 600 }}>
                Dataset Variables (200 farms, 10 columns)
              </p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    <th style={{ padding: "6px 8px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid var(--border)" }}>Variable</th>
                    <th style={{ padding: "6px 8px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid var(--border)" }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {VARIABLES.map((v, i) => (
                    <tr key={v.name} style={{ background: i % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", verticalAlign: "top" }}>
                        <code style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.7rem", color: "var(--forest)", background: "var(--forest-bg)", padding: "1px 5px", borderRadius: "3px" }}>
                          {v.name}
                        </code>
                      </td>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                        {v.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Main two-column layout ────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>

          {/* Left: data + exploration + chat */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <Card label="Farm Dataset" meta="200 rows · click column headers to sort">
              <DatasetTable data={data} onNewDataset={handleNewDataset} />
            </Card>

            <Card label="Suggested Analyses" meta="Click to pre-fill the assistant">
              <GuidedExploration onSelect={(s) => setPendingInput(s)} />
            </Card>

            <Card label="Statistical Analysis Assistant" meta="Plain-English requests · results computed locally">
              <div style={{ height: "400px", display: "flex", flexDirection: "column" }}>
                <ChatInterface
                  data={data}
                  onAnalysis={handleAnalysis}
                  pendingInput={pendingInput}
                  onPendingConsumed={() => setPendingInput(undefined)}
                />
              </div>
            </Card>
          </div>

          {/* Right: sticky tracker */}
          <div style={{ position: "sticky", top: "20px" }}>
            <Card label="Analysis Tracker" meta="Your research record">
              <AnalysisTracker entries={tracker} onPublish={handlePublish} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ label, meta, children }: { label: string; meta?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        padding: "10px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "baseline",
        gap: "10px",
        background: "#f9fafb",
      }}>
        <h2 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "var(--navy)",
          margin: 0,
        }}>
          {label}
        </h2>
        {meta && (
          <span style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.67rem", color: "var(--text-faint)" }}>
            {meta}
          </span>
        )}
      </div>
      <div style={{ padding: "16px" }}>
        {children}
      </div>
    </div>
  );
}
