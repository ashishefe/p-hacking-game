"use client";

import type { TrackerEntry } from "@/lib/types";

interface PValuePlotProps {
  entries: TrackerEntry[];
  publishedEntry?: TrackerEntry | null;
}

export default function PValuePlot({ entries, publishedEntry }: PValuePlotProps) {
  if (entries.length === 0) return null;

  const height = 200;
  const width = 500;
  const padLeft = 50;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  // p-value axis: 0 (bottom) to 1 (top) — wait, convention: lower p = better
  // Let's show p on y-axis: 0 at bottom, 1 at top, red line at 0.05
  const pToY = (p: number) => padTop + (1 - p) * plotHeight;
  const xToPlot = (i: number) => padLeft + (i / (entries.length + 1)) * plotWidth;

  const threshold = 0.05;
  const thresholdY = pToY(threshold);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-lg"
        style={{ fontFamily: "inherit" }}
      >
        {/* Y-axis */}
        <line
          x1={padLeft} y1={padTop}
          x2={padLeft} y2={padTop + plotHeight}
          stroke="#9ca3af" strokeWidth={1}
        />
        {/* X-axis */}
        <line
          x1={padLeft} y1={padTop + plotHeight}
          x2={padLeft + plotWidth} y2={padTop + plotHeight}
          stroke="#9ca3af" strokeWidth={1}
        />

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((p) => (
          <g key={p}>
            <line
              x1={padLeft - 4} y1={pToY(p)}
              x2={padLeft} y2={pToY(p)}
              stroke="#9ca3af" strokeWidth={1}
            />
            <text
              x={padLeft - 6}
              y={pToY(p) + 4}
              textAnchor="end"
              fontSize={9}
              fill="#6b7280"
            >
              {p.toFixed(2)}
            </text>
          </g>
        ))}

        {/* p=0.05 threshold line */}
        <line
          x1={padLeft} y1={thresholdY}
          x2={padLeft + plotWidth} y2={thresholdY}
          stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4,3"
        />
        <text
          x={padLeft + plotWidth + 3}
          y={thresholdY + 4}
          fontSize={9}
          fill="#ef4444"
        >
          p=0.05
        </text>

        {/* Shaded region below threshold (significant zone) */}
        <rect
          x={padLeft}
          y={thresholdY}
          width={plotWidth}
          height={pToY(0) - thresholdY}
          fill="#dcfce7"
          opacity={0.5}
        />

        {/* Y-axis label */}
        <text
          x={12}
          y={padTop + plotHeight / 2}
          textAnchor="middle"
          fontSize={9}
          fill="#6b7280"
          transform={`rotate(-90, 12, ${padTop + plotHeight / 2})`}
        >
          p-value
        </text>

        {/* X-axis label */}
        <text
          x={padLeft + plotWidth / 2}
          y={height - 4}
          textAnchor="middle"
          fontSize={9}
          fill="#6b7280"
        >
          Analysis number
        </text>

        {/* Dots */}
        {entries.map((entry, i) => {
          const cx = xToPlot(i + 1);
          const cy = pToY(entry.result.p_value);
          const isPublished = publishedEntry?.id === entry.id;
          const significant = entry.result.p_value < 0.05;

          return (
            <g key={entry.id}>
              <circle
                cx={cx}
                cy={cy}
                r={isPublished ? 8 : 5}
                fill={
                  isPublished
                    ? "#dc2626"
                    : significant
                    ? "#16a34a"
                    : "#93c5fd"
                }
                stroke="white"
                strokeWidth={1.5}
                opacity={0.9}
              />
              {isPublished && (
                <>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={12}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth={1.5}
                    opacity={0.4}
                  />
                  <text
                    x={cx}
                    y={cy - 14}
                    textAnchor="middle"
                    fontSize={8}
                    fill="#dc2626"
                    fontWeight="bold"
                  >
                    "Published"
                  </text>
                </>
              )}
              <title>
                Analysis {i + 1}: p = {entry.result.p_value.toFixed(4)}
                {"\n"}
                {entry.request.description}
              </title>
            </g>
          );
        })}
      </svg>

      <div className="flex gap-4 text-xs text-gray-500 mt-2 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-300" />
          <span>Not significant</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-600" />
          <span>Significant (p &lt; 0.05)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-600" />
          <span>Your "published" finding</span>
        </div>
      </div>
    </div>
  );
}
