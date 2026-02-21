"use client";

import { useState, useRef, useEffect } from "react";
import type { Farm, Message, TrackerEntry, AnalysisRequest, StatResult } from "@/lib/types";
import { runAnalysis } from "@/lib/statistics";

interface ChatInterfaceProps {
  data: Farm[];
  onAnalysis: (entry: TrackerEntry) => void;
  pendingInput?: string;
  onPendingConsumed?: () => void;
}

export default function ChatInterface({ data, onAnalysis, pendingInput, onPendingConsumed }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome",
    role: "assistant",
    content: "Hello — I'm your statistical analysis assistant. I have access to the full 200-farm GrowMax dataset.\n\nAsk me anything in plain English: compare groups, run regressions, filter by crop or soil type, control for confounders. I'll compute the results and report the p-value.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (pendingInput) {
      setInput(pendingInput);
      onPendingConsumed?.();
      inputRef.current?.focus();
    }
  }, [pendingInput, onPendingConsumed]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", content: text }]);
    setLoading(true);

    try {
      const parseRes = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "parse", message: text }),
      });
      const analysisRequest: AnalysisRequest = (await parseRes.json()).analysisRequest;
      const statResult: StatResult = runAnalysis(data, analysisRequest);

      const narrateRes = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "narrate", message: text, analysisRequest, statResult }),
      });
      const responseText = (await narrateRes.json()).response ?? "Analysis complete.";

      const entry: TrackerEntry = {
        id: `entry-${Date.now()}`, timestamp: Date.now(),
        request: analysisRequest, result: statResult, summary: analysisRequest.description,
      };
      setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: "assistant", content: responseText, trackerEntry: entry }]);
      onAnalysis(entry);
    } catch {
      setMessages((prev) => [...prev, { id: `error-${Date.now()}`, role: "assistant", content: "I ran into an error — please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  }

  function formatP(p: number) { return p < 0.001 ? "< 0.001" : p.toFixed(3); }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px", paddingRight: "4px", minHeight: 0 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "86%",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "0.85rem",
              lineHeight: 1.65,
              ...(msg.role === "user"
                ? { background: "var(--navy)", color: "#ffffff", borderBottomRightRadius: "3px" }
                : { background: "#f9fafb", border: "1px solid var(--border)", color: "var(--text-primary)", borderBottomLeftRadius: "3px" }
              ),
            }}>
              <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>

              {msg.trackerEntry && (
                <div style={{
                  marginTop: "8px", paddingTop: "8px",
                  borderTop: `1px solid ${msg.trackerEntry.result.p_value < 0.05 ? "#a7f3d0" : "#e5e7eb"}`,
                  display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap",
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono-plex)", fontSize: "0.82rem", fontWeight: 700,
                    color: msg.trackerEntry.result.p_value < 0.05 ? "var(--forest)" : "var(--text-secondary)",
                    background: msg.trackerEntry.result.p_value < 0.05 ? "var(--forest-bg)" : "#e5e7eb",
                    padding: "2px 8px", borderRadius: "3px",
                    border: `1px solid ${msg.trackerEntry.result.p_value < 0.05 ? "#6ee7b7" : "#d1d5db"}`,
                  }}>
                    p = {formatP(msg.trackerEntry.result.p_value)}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono-plex)", fontSize: "0.72rem", color: "var(--text-faint)" }}>
                    n = {msg.trackerEntry.result.n_filtered}
                  </span>
                  {msg.trackerEntry.result.p_value < 0.05 && (
                    <span style={{ fontSize: "0.75rem", color: "var(--forest)", fontWeight: 600 }}>✓ significant</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex" }}>
            <div style={{ background: "#f9fafb", border: "1px solid var(--border)", borderRadius: "8px", borderBottomLeftRadius: "3px", padding: "10px 14px", display: "flex", gap: "5px", alignItems: "center" }}>
              {[0, 160, 320].map((d) => (
                <div key={d} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#9ca3af", animation: "bounce 1.2s ease-in-out infinite", animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={2}
          placeholder="e.g. 'Compare GrowMax vs. control on drip-irrigated loam soil farms'"
          style={{
            flex: 1, border: "1px solid var(--border)", borderRadius: "6px",
            padding: "9px 12px", fontSize: "0.84rem", resize: "none", outline: "none",
            background: "#ffffff", color: "var(--text-primary)",
            fontFamily: "var(--font-source), serif", lineHeight: 1.5,
            opacity: loading ? 0.6 : 1, transition: "border-color 0.15s",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--forest)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: "0 18px", height: "40px", alignSelf: "flex-end",
            background: loading || !input.trim() ? "#e5e7eb" : "var(--forest)",
            color: loading || !input.trim() ? "var(--text-faint)" : "#ffffff",
            border: "none", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            transition: "background 0.15s", flexShrink: 0,
            fontFamily: "var(--font-source), serif",
          }}
        >
          Run
        </button>
      </form>
    </div>
  );
}
