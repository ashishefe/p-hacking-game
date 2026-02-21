"use client";

interface GuidedExplorationProps {
  onSelect: (suggestion: string) => void;
}

const SUGGESTIONS = [
  { label: "Overall effect",          text: "Is there a significant difference in yield between GrowMax and non-GrowMax farms?" },
  { label: "By crop type",            text: "Does the GrowMax effect vary across crop types — wheat, rice, sorghum, maize, and cotton?" },
  { label: "Loam soil only",          text: "Compare GrowMax vs. no GrowMax yields, but only for farms on loam soil" },
  { label: "High altitude",           text: "Is there a GrowMax effect among farms above 500m altitude?" },
  { label: "Drip irrigation",         text: "Test GrowMax effect specifically on drip-irrigated farms" },
  { label: "Cotton + drip + loam",    text: "Compare yields for cotton farms using drip irrigation on loam soil, GrowMax vs. control" },
  { label: "Control for rainfall",    text: "Run a regression of yield on GrowMax, controlling for rainfall and temperature" },
  { label: "Small farms",             text: "Is there an effect for farms under 8 hectares in size?" },
  { label: "Low crop rotation",       text: "Look only at farms that haven't rotated crops in 4 or 5 years" },
  { label: "Full model",              text: "Regress yield on GrowMax while controlling for soil type, irrigation, rainfall, altitude, and farm size" },
  { label: "Rice + high rainfall",    text: "Test GrowMax effect on rice farms with above-average rainfall (>850mm)" },
  { label: "Soil type comparison",    text: "Compare mean yields across clay, loam, and sandy soil farms" },
];

const TESTS = [
  {
    name: "Welch's t-test",
    when: "Comparing two groups (e.g. GrowMax vs. no GrowMax)",
    note: "Like a standard two-sample t-test but doesn't assume both groups have the same variance — more robust for real-world data.",
    url: "https://en.wikipedia.org/wiki/Welch%27s_t-test",
  },
  {
    name: "One-way ANOVA",
    when: "Comparing 3 or more categories (e.g. crop types, soil types)",
    note: "Tests whether at least one group mean differs from the others by comparing variance between groups to variance within groups.",
    url: "https://en.wikipedia.org/wiki/One-way_analysis_of_variance",
  },
  {
    name: "Simple linear regression",
    when: "One continuous predictor and one outcome",
    note: "Fits a straight line through the data and tests whether the slope is significantly different from zero.",
    url: "https://en.wikipedia.org/wiki/Simple_linear_regression",
  },
  {
    name: "Multiple linear regression",
    when: "Controlling for several variables at once",
    note: "Estimates the effect of each predictor while holding others constant. The p-value reported is from an F-test on the full model.",
    url: "https://en.wikipedia.org/wiki/Linear_regression",
  },
];

export default function GuidedExploration({ onSelect }: GuidedExplorationProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Suggestions */}
      <div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "4px" }}>
          These are meant to show you the kinds of variations that are possible — subgroups, controls, different crop or soil combinations.
          Click any to pre-fill the assistant, or <strong style={{ color: "var(--text-primary)" }}>type your own combination</strong> in the chat below.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "10px" }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => onSelect(s.text)}
              title={s.text}
              style={{
                fontSize: "0.78rem",
                background: "#ffffff",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                borderRadius: "5px",
                padding: "5px 12px",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "var(--font-source), serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--forest-bg)";
                e.currentTarget.style.borderColor = "#6ee7b7";
                e.currentTarget.style.color = "var(--forest)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid var(--border)" }} />

      {/* Statistical tests reference */}
      <div>
        <p style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: "10px" }}>
          Tests available — click any to read the Wikipedia article
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
          {TESTS.map((t) => (
            <a
              key={t.name}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#6ee7b7";
                  (e.currentTarget as HTMLElement).style.background = "var(--forest-bg)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.background = "#f9fafb";
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "3px" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--navy)", fontFamily: "var(--font-source), serif" }}>
                    {t.name}
                  </span>
                  <span style={{ fontSize: "0.65rem", color: "var(--forest)", fontFamily: "var(--font-mono-plex)" }}>
                    Wikipedia ↗
                  </span>
                </div>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: "0 0 3px", fontStyle: "italic" }}>
                  Used when: {t.when}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                  {t.note}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
