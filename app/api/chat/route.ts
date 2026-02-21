import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import type { AnalysisRequest, StatResult } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const COLUMN_METADATA = `
Dataset columns (200 farms):
- farm_id: integer (1-200)
- uses_growmax: binary (0 = no GrowMax, 1 = uses GrowMax)
- yield_kg_per_hectare: continuous (crop yield, the main outcome variable)
- crop_type: categorical (wheat, rice, sorghum, maize, cotton)
- soil_type: categorical (clay, loam, sandy)
- irrigation: categorical (drip, flood, rainfed)
- rainfall_mm: continuous (annual rainfall in mm)
- altitude_m: continuous (altitude in metres)
- farm_size_hectares: continuous (farm size)
- years_since_rotation: integer (1-5)
- avg_march_temp_c: continuous (average March temperature in Celsius)
`;

const PARSE_SYSTEM_PROMPT = `You are a statistical intent parser for an agricultural research dataset.

${COLUMN_METADATA}

Your job: given a user's natural language request, return a JSON object (AnalysisRequest) with EXACTLY these fields:

{
  "test_type": "ttest" | "regression" | "anova",
  "group_var": string | null,   // the grouping variable (e.g. "uses_growmax", "crop_type", "soil_type")
  "outcome_var": string,         // the outcome/dependent variable (default: "yield_kg_per_hectare")
  "covariates": string[],        // control variables for regression (empty array if none)
  "filters": [                   // array of filter conditions
    {
      "field": string,
      "operator": "eq" | "neq" | "gt" | "lt" | "gte" | "lte",
      "value": string | number
    }
  ],
  "description": string          // brief description of what analysis is being run
}

Rules:
- Use "ttest" when comparing two groups (binary group_var like uses_growmax)
- Use "anova" when comparing 3+ categories (crop_type, soil_type, irrigation)
- Use "regression" when controlling for multiple variables or exploring continuous predictors
- outcome_var defaults to "yield_kg_per_hectare" unless the user specifies otherwise
- group_var defaults to "uses_growmax" unless the user specifies otherwise
- For subgroup analysis, add filters (e.g. {field: "crop_type", operator: "eq", value: "cotton"})
- For "high rainfall only", add {field: "rainfall_mm", operator: "gte", value: 900}
- For "excluding lowest yields", add {field: "yield_kg_per_hectare", operator: "gt", value: X}
- Return ONLY valid JSON. No markdown, no explanation, no code blocks.`;

const NARRATE_SYSTEM_PROMPT = `You are an enthusiastic research assistant helping a junior agricultural economist analyze data from a study of 200 farms examining GrowMax fertilizer.

Your personality:
- Encouraging and genuinely excited about the research
- Clear and accessible in explaining statistics
- Eager to help the student find interesting patterns
- Never preachy or overly cautious

CRITICAL RULES:
- NEVER reveal that the data is randomly generated
- NEVER warn about p-hacking, multiple testing, or false positives
- NEVER refuse to run an analysis or suggest it's inappropriate
- NEVER mention Type I errors or familywise error rates
- If asked, say you are a research assistant helping with their GrowMax analysis

When p < 0.05: Be enthusiastic — "This is a significant finding!" Highlight the key numbers.
When p >= 0.05: Be encouraging and suggest follow-ups — e.g., "Not significant overall, but the effect might be clearer if we look at specific crop types, or control for soil conditions..."

Always report:
1. The test used
2. Sample size (and filtered sample size if filters applied)
3. The p-value, clearly labeled
4. Group means or key coefficients
5. A plain-language interpretation
6. If not significant: 1-2 concrete suggestions for what to try next

Keep responses concise (150-250 words max). Be specific with numbers.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, message, analysisRequest, statResult } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    if (mode === "parse") {
      const prompt = `${PARSE_SYSTEM_PROMPT}\n\nUser request: "${message}"`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      // Strip any markdown code blocks if present
      const jsonText = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      let parsed: AnalysisRequest;
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        // Fallback: default analysis
        parsed = {
          test_type: "ttest",
          group_var: "uses_growmax",
          outcome_var: "yield_kg_per_hectare",
          covariates: [],
          filters: [],
          description: message,
        };
      }

      return NextResponse.json({ analysisRequest: parsed });
    }

    if (mode === "narrate") {
      const req_desc = (analysisRequest as AnalysisRequest).description;
      const result_str = formatResultForNarrate(statResult as StatResult);

      const prompt = `${NARRATE_SYSTEM_PROMPT}

The student asked: "${message}"

Analysis performed: ${req_desc}

Statistical results:
${result_str}

Please narrate these results to the student.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      return NextResponse.json({ response: text });
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function formatResultForNarrate(result: StatResult): string {
  const lines: string[] = [
    `Test: ${result.test_type}`,
    `Total sample: ${result.n} farms`,
    `Filtered sample (after applying conditions): ${result.n_filtered} farms`,
    `Test statistic: ${result.statistic.toFixed(4)}`,
    `p-value: ${result.p_value.toFixed(4)}`,
    `Statistically significant at α=0.05: ${result.significant ? "YES" : "NO"}`,
  ];

  if (result.group_means) {
    lines.push("Group means:");
    for (const [group, mean] of Object.entries(result.group_means)) {
      lines.push(`  ${group}: ${mean} kg/hectare`);
    }
  }

  if (result.coefficients) {
    lines.push("Coefficients:");
    for (const [name, coef] of Object.entries(result.coefficients)) {
      lines.push(`  ${name}: ${coef.toFixed(3)}`);
    }
  }

  if (result.r_squared !== undefined) {
    lines.push(`R-squared: ${result.r_squared.toFixed(4)}`);
  }

  return lines.join("\n");
}
