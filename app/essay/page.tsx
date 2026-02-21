import fs from "fs";
import path from "path";
import Link from "next/link";

// Server component — reads and renders the essay markdown
export default function EssayPage() {
  const filePath = path.join(process.cwd(), "public", "essay.md");
  const raw = fs.readFileSync(filePath, "utf-8");
  const sections = parseMarkdown(raw);

  return (
    <div style={{ minHeight: "100vh", background: "var(--page-bg)" }}>
      {/* Header */}
      <header style={{ background: "var(--navy)", borderBottom: "2px solid #152d4a", padding: "14px 24px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-playfair)", color: "#ffffff", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
              The Story of P-Hacking
            </h1>
            <p style={{ fontFamily: "var(--font-mono-plex)", color: "#93c5fd", fontSize: "0.68rem", margin: "3px 0 0", letterSpacing: "0.04em" }}>
              ~15 minute read · Research Methods Series
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link href="/deeper" style={{ fontFamily: "var(--font-source), serif", color: "#7dd3fc", fontSize: "0.85rem", textDecoration: "none" }}>
              ← Back
            </Link>
            <Link href="/" style={{
              fontFamily: "var(--font-source), serif",
              color: "#ffffff",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "5px",
              fontSize: "0.8rem",
              padding: "5px 12px",
              fontWeight: 600,
              textDecoration: "none",
            }}>
              New game
            </Link>
          </div>
        </div>
      </header>

      {/* Essay body */}
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 32px 80px" }}>
        {/* Title block */}
        <div style={{ marginBottom: "48px", paddingBottom: "32px", borderBottom: "2px solid var(--border)" }}>
          <p style={{
            fontFamily: "var(--font-mono-plex)",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "16px",
          }}>
            Research Methods · Statistical Inference
          </p>
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "2.4rem",
            fontWeight: 700,
            color: "var(--navy)",
            lineHeight: 1.2,
            marginBottom: "16px",
          }}>
            The Story of P-Hacking: Why You Should Read Research Papers With One Eyebrow Raised
          </h1>
        </div>

        {/* Rendered sections */}
        <div style={{ color: "var(--text-secondary)" }}>
          {sections.map((s, i) => renderSection(s, i))}
        </div>

        {/* Footer nav */}
        <div style={{
          marginTop: "64px",
          paddingTop: "24px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <Link href="/deeper" style={{ color: "var(--forest)", fontSize: "0.85rem", textDecoration: "none", fontFamily: "var(--font-source), serif" }}>
            ← Go Deeper
          </Link>
          <Link href="/" style={{ color: "var(--text-muted)", fontSize: "0.82rem", textDecoration: "none", fontFamily: "var(--font-source), serif" }}>
            Start a new game →
          </Link>
        </div>
      </main>
    </div>
  );
}

// ── Simple markdown parser ───────────────────────────────────────────────────

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "hr" }
  | { type: "p"; text: string }
  | { type: "blank" };

function parseMarkdown(raw: string): Block[] {
  const lines = raw.split("\n");
  const blocks: Block[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { blocks.push({ type: "blank" }); continue; }
    if (trimmed.startsWith("### ")) { blocks.push({ type: "h3", text: trimmed.slice(4) }); continue; }
    if (trimmed.startsWith("## ")) { blocks.push({ type: "h2", text: trimmed.slice(3) }); continue; }
    if (trimmed.startsWith("# ")) { blocks.push({ type: "h1", text: trimmed.slice(2) }); continue; }
    if (trimmed === "---") { blocks.push({ type: "hr" }); continue; }
    blocks.push({ type: "p", text: trimmed });
  }

  return blocks;
}

// Convert inline markdown (bold, italic, links, code, sup) → React elements
function inlineToReact(text: string, key: string) {
  // We'll build segments by parsing through the string
  const segments: React.ReactNode[] = [];
  let i = 0;
  let buf = "";

  const flush = () => { if (buf) { segments.push(buf); buf = ""; } };

  while (i < text.length) {
    // Bold: **text**
    if (text[i] === "*" && text[i + 1] === "*") {
      flush();
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        segments.push(<strong key={`b${i}`} style={{ color: "var(--text-primary)", fontWeight: 600 }}>{text.slice(i + 2, end)}</strong>);
        i = end + 2;
        continue;
      }
    }
    // Italic: *text*
    if (text[i] === "*" && text[i + 1] !== "*") {
      flush();
      const end = text.indexOf("*", i + 1);
      if (end !== -1) {
        segments.push(<em key={`em${i}`}>{text.slice(i + 1, end)}</em>);
        i = end + 1;
        continue;
      }
    }
    // Inline code: `text`
    if (text[i] === "`") {
      flush();
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        segments.push(
          <code key={`c${i}`} style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.85em", background: "var(--forest-bg)", color: "var(--forest)", padding: "1px 5px", borderRadius: "3px" }}>
            {text.slice(i + 1, end)}
          </code>
        );
        i = end + 1;
        continue;
      }
    }
    // Link: [text](url)
    if (text[i] === "[") {
      const closeBracket = text.indexOf("]", i);
      if (closeBracket !== -1 && text[closeBracket + 1] === "(") {
        const closeParen = text.indexOf(")", closeBracket + 2);
        if (closeParen !== -1) {
          flush();
          const linkText = text.slice(i + 1, closeBracket);
          const url = text.slice(closeBracket + 2, closeParen);
          segments.push(
            <a key={`a${i}`} href={url} target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--forest)", textDecoration: "underline", textDecorationColor: "#a7f3d0" }}>
              {linkText}
            </a>
          );
          i = closeParen + 1;
          continue;
        }
      }
    }
    // Superscript: <sup>N</sup>
    if (text.startsWith("<sup>", i)) {
      flush();
      const end = text.indexOf("</sup>", i);
      if (end !== -1) {
        segments.push(<sup key={`sup${i}`}>{text.slice(i + 5, end)}</sup>);
        i = end + 6;
        continue;
      }
    }
    buf += text[i];
    i++;
  }
  flush();
  return <>{segments}</>;
}

function renderSection(block: Block, i: number) {
  switch (block.type) {
    case "h1":
      return null; // Already rendered as page title
    case "h2":
      return (
        <h2 key={i} style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1.55rem",
          fontWeight: 700,
          color: "var(--navy)",
          marginTop: "48px",
          marginBottom: "20px",
          lineHeight: 1.3,
        }}>
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1.15rem",
          fontWeight: 600,
          color: "var(--navy)",
          marginTop: "32px",
          marginBottom: "14px",
          lineHeight: 1.4,
        }}>
          {block.text}
        </h3>
      );
    case "hr":
      return (
        <div key={i} style={{ margin: "40px 0", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--border-strong)" }} />
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>
      );
    case "blank":
      return null;
    case "p":
      return (
        <p key={i} style={{
          fontSize: "1rem",
          lineHeight: 1.85,
          marginBottom: "20px",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-source), Georgia, serif",
        }}>
          {inlineToReact(block.text, String(i))}
        </p>
      );
  }
}
