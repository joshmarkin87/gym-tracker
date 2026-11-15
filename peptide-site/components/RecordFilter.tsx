"use client";

import { useEffect, useState } from "react";

const KINDS = [
  { id: "all", label: "All" },
  { id: "pass", label: "Passed" },
  { id: "fail", label: "Failed" },
  { id: "wait", label: "In testing" },
] as const;

/** Filter chips and search for The Record. Hides rows in place; with JavaScript off, every lot simply shows. */
export function RecordFilter({ counts }: { counts: Record<string, number> }) {
  const [kind, setKind] = useState<string>("all");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>("[data-record-row]");
    const needle = q.trim().toLowerCase();
    let n = 0;
    rows.forEach((r) => {
      const ok = (kind === "all" || r.dataset.kind === kind) && (!needle || (r.dataset.text ?? "").includes(needle));
      r.hidden = !ok;
      if (ok) n++;
    });
    setShown(n);
  }, [kind, q]);

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div role="group" aria-label="Filter lots by outcome" className="flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            aria-pressed={kind === k.id}
            onClick={() => setKind(k.id)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.08em] transition-colors ${
              kind === k.id ? "border-accent bg-accent text-on-accent" : "border-line bg-card text-muted hover:border-accent/50 hover:text-ink"
            }`}
          >
            {k.label} <span className="opacity-70">{counts[k.id] ?? 0}</span>
          </button>
        ))}
      </div>
      <div className="sm:w-64">
        <label htmlFor="record-search" className="sr-only">Search The Record by lot code or product</label>
        <input
          id="record-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search lot or product"
          className="field w-full rounded-xl border border-line px-4 py-2.5 text-sm"
        />
      </div>
      <p aria-live="polite" className="sr-only">{shown !== null ? `${shown} lots shown` : ""}</p>
    </div>
  );
}
