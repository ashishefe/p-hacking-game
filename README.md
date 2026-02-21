# The P-Hacking Game

A classroom web app that teaches students what p-hacking is through direct experience. Students unknowingly p-hack a fake agricultural dataset, then the curtain drops — revealing that everything they "found" was a false positive from pure noise.

Built for Ashish Kulkarni's statistics courses at Gokhale Institute and Takshashila Institution.

## How it works

**Page 1 — The Game:** Students explore a realistic-looking 200-farm dataset studying the fictional "GrowMax" fertilizer. They chat with an AI assistant to run statistical analyses (t-tests, ANOVA, regression) and try to find a significant result (p < 0.05) to "publish."

**Page 2 — The Reveal:** The dataset was 100% randomly generated. Every variable is independent. GrowMax doesn't do anything. The game shows students exactly how many tests they ran and how likely a false positive was given that number.

**Page 3 — Go Deeper:** The full essay on p-hacking, NotebookLM instructions, and downloadable discussion questions.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Gemini 1.5 Flash** for parsing analysis intent and narrating results
- **simple-statistics** for client-side t-tests, ANOVA, and regression
- Deployable to **Vercel** with one environment variable

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

```bash
vercel deploy
```

Set `GEMINI_API_KEY` in your Vercel project environment variables.

Or connect your GitHub repo and let Vercel handle auto-deployments.

## Architecture

- **`/`** — Game page (dataset table, AI chat, analysis tracker, publish button)
- **`/reveal`** — Reveal page (animated rug-pull, p-value plot, explanation)
- **`/deeper`** — Go Deeper page (essay, NotebookLM guide, discussion questions)
- **`/api/chat`** — Server-side Gemini route (parse mode + narrate mode)
- **`lib/dataset.ts`** — Seeded PRNG dataset generation (200 rows, 11 variables)
- **`lib/statistics.ts`** — Client-side stats (Welch's t-test, OLS regression, one-way ANOVA)

**Key design decision:** Gemini never sees the raw dataset. The client parses the user's intent via Gemini, runs real statistics locally, then Gemini narrates the results. This prevents hallucinated p-values and keeps token costs low.

## Development notes

- The dataset is generated client-side with a seeded LCG so results are consistent within a session
- Game state (tracker + published finding) is passed to the Reveal page via `sessionStorage`
- The AI assistant is deliberately instructed to encourage further analysis and never warn about p-hacking
