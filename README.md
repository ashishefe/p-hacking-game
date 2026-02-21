# The P-Hacking Game

A classroom web app that teaches students what p-hacking is through direct experience. Students unknowingly p-hack a fake agricultural dataset, then the curtain drops — revealing that everything they "found" was a false positive from pure noise.

## How it works

**Page 1 — The Game:** Students explore a realistic-looking 200-farm dataset studying the fictional "GrowMax" fertilizer. They chat with an AI assistant to run statistical analyses (t-tests, ANOVA, regression) and try to find a significant result (p < 0.05) to "publish." Must run at least 5 analyses before publishing.

**Page 2 — The Reveal:** The dataset was 100% randomly generated. Every variable is independent. GrowMax doesn't do anything. The game shows students exactly how many tests they ran and how likely a false positive was given that number.

**Page 3 — Go Deeper:** The full essay on p-hacking rendered as a readable page, NotebookLM instructions, downloadable discussion questions, and key references.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Gemini 3 Flash Preview** for parsing analysis intent and narrating results
- **simple-statistics** for client-side t-tests, ANOVA, and regression
- Deployed on **Vercel**

## Setup

```bash
# Install dependencies
npm install

# Add your Gemini API key
# Edit .env.local and set GEMINI_API_KEY=your_key_here

# Run locally
npm run dev
# → http://localhost:3000
```

## Environment variables

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/).

## Deploy to Vercel

Connect your GitHub repo and Vercel handles auto-deployments on every push to `main`. Set `GEMINI_API_KEY` in your Vercel project environment variables before deploying.

## Architecture

- **`/`** — Game page (dataset table, AI chat, analysis tracker, publish button)
- **`/reveal`** — Reveal page (timed rug-pull sequence, p-value dot plot, explanation)
- **`/deeper`** — Go Deeper page (essay link, NotebookLM guide, discussion questions, references)
- **`/essay`** — Full essay rendered from markdown with rich typography
- **`/api/chat`** — Server-side Gemini route (parse mode + narrate mode)
- **`lib/dataset.ts`** — Seeded LCG dataset generation (200 rows, 10 variables)
- **`lib/statistics.ts`** — Client-side stats (Welch's t-test, OLS regression, one-way ANOVA)

**Key design decision:** Gemini never sees the raw dataset. The client parses the user's intent via Gemini (returning a structured `AnalysisRequest` JSON), runs real statistics locally via `simple-statistics`, then sends only the computed results back to Gemini for narration. This prevents hallucinated p-values and keeps token costs low.

## Development notes

- The dataset seed is randomised client-side in a `useEffect` (not at module level) to avoid SSR/client hydration mismatches
- Game state (tracker + published finding) is passed to the Reveal page via `sessionStorage`
- The AI assistant is deliberately instructed to encourage further analysis and never warn about p-hacking
- The publish button requires both ≥5 analyses run AND at least one result with p < 0.05
