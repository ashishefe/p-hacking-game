"use client";

export default function DownloadButton() {
  function handleDownload() {
    fetch("/appendix-econ.md")
      .then((res) => res.text())
      .then((text) => {
        const blob = new Blob([text], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "appendix-econ-students-p-hacking.md";
        a.click();
        URL.revokeObjectURL(url);
      });
  }

  return (
    <button
      onClick={handleDownload}
      style={{
        fontFamily: "var(--font-source), serif",
        color: "#ffffff",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "5px",
        fontSize: "0.8rem",
        padding: "5px 12px",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      ↓ Download .md
    </button>
  );
}
