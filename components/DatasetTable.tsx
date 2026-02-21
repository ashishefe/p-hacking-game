"use client";

import { useState, useMemo } from "react";
import type { Farm } from "@/lib/types";
import { datasetToCSV } from "@/lib/dataset";

interface DatasetTableProps {
  data: Farm[];
  onNewDataset: () => void;
}

const COLUMNS: { key: keyof Farm; label: string }[] = [
  { key: "farm_id",               label: "ID" },
  { key: "uses_growmax",          label: "GrowMax" },
  { key: "yield_kg_per_hectare",  label: "Yield (kg/ha)" },
  { key: "crop_type",             label: "Crop" },
  { key: "soil_type",             label: "Soil" },
  { key: "irrigation",            label: "Irrigation" },
  { key: "rainfall_mm",           label: "Rainfall (mm)" },
  { key: "altitude_m",            label: "Altitude (m)" },
  { key: "farm_size_hectares",    label: "Size (ha)" },
  { key: "years_since_rotation",  label: "Yrs Rotation" },
  { key: "avg_march_temp_c",      label: "Mar Temp (°C)" },
];

const PAGE_SIZE = 20;

export default function DatasetTable({ data, onNewDataset }: DatasetTableProps) {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof Farm>("farm_id");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    if (!filter.trim()) return data;
    const q = filter.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [data, filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = typeof av === "number" ? av - (bv as number) : String(av).localeCompare(String(bv));
      return sortAsc ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortAsc]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleSort(key: keyof Farm) {
    if (key === sortKey) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
    setPage(0);
  }

  function handleDownload() {
    const blob = new Blob([datasetToCSV(data)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "growmax-study-data.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const btnStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    border: "1px solid var(--border)",
    borderRadius: "5px",
    padding: "5px 12px",
    background: "#ffffff",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontFamily: "var(--font-source), serif",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
        <input
          type="text"
          placeholder="Search farms…"
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(0); }}
          style={{
            flex: 1, minWidth: "140px",
            border: "1px solid var(--border)", borderRadius: "5px",
            padding: "5px 10px", fontSize: "0.82rem",
            color: "var(--text-primary)", background: "#ffffff", outline: "none",
            fontFamily: "var(--font-source), serif",
          }}
        />
        <span style={{ fontSize: "0.72rem", color: "var(--text-faint)", fontFamily: "var(--font-mono-plex)", whiteSpace: "nowrap" }}>
          {sorted.length} / {data.length}
        </span>
        <button onClick={handleDownload} style={btnStyle}>↓ CSV</button>
        <button onClick={onNewDataset} style={btnStyle}>New Dataset</button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "6px" }}>
        <table style={{ width: "100%", minWidth: "max-content", borderCollapse: "collapse", fontSize: "0.78rem" }}>
          <thead>
            <tr style={{ background: "#1e3a5f" }}>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    padding: "9px 12px",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#e0eaff",
                    fontFamily: "var(--font-mono-plex)",
                    fontSize: "0.67rem",
                    fontWeight: 600,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    borderRight: "1px solid #2d4f7a",
                  }}
                >
                  {col.label}{sortKey === col.key ? (sortAsc ? " ↑" : " ↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, i) => (
              <tr
                key={row.farm_id}
                style={{ background: i % 2 === 0 ? "#ffffff" : "#f9fafb" }}
              >
                {COLUMNS.map((col) => {
                  const val = row[col.key];
                  const isGrowmax = col.key === "uses_growmax";
                  const isGrowmaxYes = isGrowmax && val === 1;
                  return (
                    <td
                      key={col.key}
                      style={{
                        padding: "6px 12px",
                        whiteSpace: "nowrap",
                        borderBottom: "1px solid var(--border)",
                        borderRight: "1px solid #f0f2f5",
                        fontFamily: typeof val === "number" || isGrowmax ? "var(--font-mono-plex)" : "inherit",
                        color: isGrowmaxYes ? "var(--forest)" : "var(--text-primary)",
                        fontWeight: isGrowmaxYes ? 600 : 400,
                      }}
                    >
                      {isGrowmax ? (val === 1 ? "Yes" : "No") : String(val)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button disabled={page === 0} onClick={() => setPage(page - 1)}
            style={{ ...btnStyle, opacity: page === 0 ? 0.4 : 1 }}>← Prev</button>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono-plex)" }}>
            Page {page + 1} of {totalPages}
          </span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}
            style={{ ...btnStyle, opacity: page >= totalPages - 1 ? 0.4 : 1 }}>Next →</button>
        </div>
      )}
    </div>
  );
}
