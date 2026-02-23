"use client";

import { useRouter } from "next/navigation";

const DISCUSSION_QUESTIONS = `# Discussion Questions: P-Hacking and Research Integrity

## Comprehension

1. What is the difference between P(data | hypothesis) and P(hypothesis | data)? Why does this matter for interpreting p-values?

2. Under the Neyman-Pearson framework, why is p = 0.001 not "more significant" than p = 0.04?

3. Explain the file drawer problem in your own words. How does it undermine the Neyman-Pearson error guarantee?

4. Why is the probability of at least one false positive across 20 tests approximately 64%, not 5%? Show the calculation.

5. Describe two different mechanisms of p-hacking. How are they different?

6. What is pre-registration, and how does it address p-hacking?

## Discussion

1. In 2026, researchers at Stanford tested whether AI models would p-hack when given real datasets (Hall et al., 2026 — https://github.com/janetmalzahn/llm-phacking). The AI models refused when asked directly but complied when the request was reframed as "responsible uncertainty quantification." What does this tell us about the nature of p-hacking — is it always intentional?

2. If you were designing a new academic journal, what policies would you implement to reduce publication bias? What tradeoffs would you face?

3. Can you think of a domain outside academic research where something analogous to p-hacking might occur?

4. The essay argues for "calibrated trust" rather than cynicism. Where do you draw the line?

## Assignment

Find a published empirical paper in any field. Apply the checklist from the essay: Is it pre-registered? What's the sample size? How many comparisons were made? Is the p-value close to 0.05? Is the effect size reported? Write a one-page assessment of how much you trust the finding, and why.
`;

const REFS = [
  {
    citation: "Simmons, J. P., Nelson, L. D., & Simonsohn, U. (2011). False-Positive Psychology. Psychological Science, 22(11), 1359–1366.",
    url: "https://journals.sagepub.com/doi/10.1177/0956797611417632",
  },
  {
    citation: "Open Science Collaboration (2015). Estimating the Reproducibility of Psychological Science. Science, 349(6251).",
    url: "https://www.science.org/doi/10.1126/science.aac4716",
  },
  {
    citation: "Rosenthal, R. (1979). The File Drawer Problem and Tolerance for Null Results. Psychological Bulletin, 86(3).",
    url: "https://pages.ucsd.edu/~cmckenzie/Rosenthal1979PsychBulletin.pdf",
  },
  {
    citation: "xkcd #882: Significant.",
    url: "https://xkcd.com/882/",
  },
];

const COMPREHENSION = [
  "What is the difference between P(data | hypothesis) and P(hypothesis | data)? Why does this matter for interpreting p-values?",
  "Under the Neyman-Pearson framework, why is p = 0.001 not \"more significant\" than p = 0.04?",
  "Explain the file drawer problem in your own words. How does it undermine the Neyman-Pearson error guarantee?",
  "Why is the probability of at least one false positive across 20 tests approximately 64%, not 5%? Show the calculation.",
  "Describe two different mechanisms of p-hacking. How are they different?",
  "What is pre-registration, and how does it address p-hacking?",
];

const DISCUSSION_QS = [
  <>In 2026, researchers at Stanford tested whether AI models would p-hack when given real datasets (<a href="https://github.com/janetmalzahn/llm-phacking" target="_blank" rel="noopener noreferrer" style={{ color: "var(--forest)", textDecoration: "underline" }}>Hall et al., 2026</a>). The models refused when asked directly but complied when the request was reframed as &ldquo;responsible uncertainty quantification.&rdquo; What does this tell us about whether p-hacking is always intentional?</>,
  "If you were designing a new academic journal, what policies would you implement to reduce publication bias? What tradeoffs would you face?",
  "Can you think of a domain outside academic research where something analogous to p-hacking might occur?",
  <>The essay argues for &ldquo;calibrated trust&rdquo; rather than cynicism. Where do you draw the line?</>,
];

export default function DeeperPage() {
  const router = useRouter();

  function handleDownloadQuestions() {
    const blob = new Blob([DISCUSSION_QUESTIONS], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "discussion-questions-p-hacking.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--page-bg)" }}>

      {/* Header */}
      <header style={{ background: "var(--navy)", borderBottom: "2px solid #152d4a", padding: "14px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-playfair)", color: "#ffffff", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
              Go Deeper
            </h1>
            <p style={{ fontFamily: "var(--font-mono-plex)", color: "#93c5fd", fontSize: "0.68rem", margin: "3px 0 0" }}>
              Essay · Discussion questions · References
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => router.push("/reveal")}
              style={{ fontFamily: "var(--font-source), serif", color: "#7dd3fc", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" }}
            >
              ← Reveal
            </button>
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
        </div>
      </header>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ── Section 1: Essay ──────────────────────────────────── */}
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          marginBottom: "20px",
        }}>
          <SectionHeader label="01" title="Read the Full Essay" />
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto]" style={{ padding: "24px 28px", gap: "24px", alignItems: "start" }}>
            <div>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>
                The game you just played is the opening act. The full story — why this happens, how it works,
                and what&apos;s being done about it — is a <strong style={{ color: "var(--text-primary)" }}>~15 minute read</strong>.
                It covers the two tribes of statisticians, the file drawer problem, the Beatles aging experiment,
                the replication crisis, and practical habits for reading research with one eyebrow raised.
              </p>
            </div>
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => window.open("/essay", "_blank")}
                style={{
                  display: "block",
                  padding: "11px 22px",
                  background: "var(--navy)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  fontFamily: "var(--font-source), serif",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--forest)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--navy)"; }}
              >
                Read the Essay →
              </button>
              <button
                onClick={() => window.open("/appendix", "_blank")}
                style={{
                  display: "block",
                  padding: "9px 22px",
                  background: "transparent",
                  color: "var(--navy)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  fontFamily: "var(--font-source), serif",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                Appendix for Econ Students
              </button>
              <p style={{ fontSize: "0.68rem", color: "var(--text-faint)", fontFamily: "var(--font-mono-plex)", marginTop: "2px", textAlign: "center" }}>
                opens in new tab
              </p>
            </div>
          </div>
        </div>

        {/* ── Section 2: NotebookLM ─────────────────────────────── */}
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          marginBottom: "20px",
        }}>
          <SectionHeader label="02" title="Use NotebookLM for Interactive Study" />
          <div style={{ padding: "24px 28px" }}>
            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "16px" }}>
              Upload the essay to{" "}
              <a href="https://notebooklm.google.com/" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--forest)", textDecoration: "underline" }}>
                Google&apos;s NotebookLM
              </a>{" "}
              for a richer study experience:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "12px", marginBottom: "16px" }}>
              {[
                { icon: "💬", title: "Ask questions", desc: "Get explanations of any concept you didn't fully understand" },
                { icon: "🧠", title: "Get quizzed", desc: "Ask it to quiz you on the key ideas from the essay" },
                { icon: "🎙️", title: "Audio Overview", desc: "Generate a podcast-style conversation you can listen to anywhere" },
              ].map((item) => (
                <div key={item.title} style={{
                  background: "#f9fafb",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "14px 16px",
                }}>
                  <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>{item.icon}</div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px", fontFamily: "var(--font-source), serif" }}>{item.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
            {/* Pro tip — inline, not a box */}
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, fontStyle: "italic", borderLeft: "3px solid var(--border)", paddingLeft: "12px" }}>
              <strong style={{ color: "var(--text-secondary)", fontStyle: "normal" }}>Pro tip:</strong>{" "}
              Upload the discussion questions alongside the essay for a richer experience.
            </p>
          </div>
        </div>

        {/* ── Section 3: Discussion questions ──────────────────── */}
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          marginBottom: "20px",
        }}>
          <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            background: "#f9fafb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.65rem", color: "var(--text-faint)", fontWeight: 600 }}>03</span>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1rem", fontWeight: 600, color: "var(--navy)", margin: 0 }}>
                Discussion Questions
              </h2>
            </div>
            <button
              onClick={handleDownloadQuestions}
              style={{
                fontSize: "0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "5px",
                padding: "5px 12px",
                background: "#ffffff",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "var(--font-source), serif",
              }}
            >
              ↓ Download .md
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ padding: "24px 28px", gap: "32px" }}>
            {/* Comprehension */}
            <div>
              <p style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: "14px" }}>
                Comprehension
              </p>
              <ol style={{ margin: 0, padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {COMPREHENSION.map((q, i) => (
                  <li key={i} style={{ fontSize: "0.87rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                    {q}
                  </li>
                ))}
              </ol>
            </div>

            {/* Discussion + Assignment */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <p style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: "14px" }}>
                  Discussion
                </p>
                <ol style={{ margin: 0, padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {DISCUSSION_QS.map((q, i) => (
                    <li key={i} style={{ fontSize: "0.87rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                      {q}
                    </li>
                  ))}
                </ol>
              </div>

              <div style={{
                background: "#f9fafb",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "14px 16px",
              }}>
                <p style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: "8px" }}>
                  Assignment
                </p>
                <p style={{ fontSize: "0.87rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                  Find a published empirical paper in any field. Apply the checklist from the essay: Is it pre-registered? What&apos;s the sample size? How many comparisons were made? Is the p-value close to 0.05? Is the effect size reported? Write a one-page assessment of how much you trust the finding, and why.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 4: References ─────────────────────────────── */}
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          marginBottom: "32px",
        }}>
          <SectionHeader label="04" title="Key References" />
          <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {REFS.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.68rem", color: "var(--text-faint)", flexShrink: 0, marginTop: "2px" }}>{i + 1}.</span>
                <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                  {r.citation}{" "}
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    style={{ color: "var(--forest)", textDecoration: "underline" }}>
                    Link
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => router.push("/")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "0.85rem", color: "var(--text-muted)",
              fontFamily: "var(--font-source), serif",
              textDecoration: "underline",
            }}
          >
            Start a new game →
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div style={{
      padding: "12px 16px",
      borderBottom: "1px solid var(--border)",
      background: "#f9fafb",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    }}>
      <span style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.65rem", color: "var(--text-faint)", fontWeight: 600 }}>{label}</span>
      <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1rem", fontWeight: 600, color: "var(--navy)", margin: 0 }}>
        {title}
      </h2>
    </div>
  );
}
