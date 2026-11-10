import { getLots, getProduct, summarize } from "@/lib/data";

export const dynamic = "force-static";

const cell = (v: unknown) => {
  const s = v === undefined || v === null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** The Record as a CSV anyone can open in a spreadsheet. */
export function GET() {
  const header = [
    "lot_code", "product", "label_claim_mg", "arrival_date", "status",
    "vial_A_mg", "vial_B_mg", "vial_C_mg", "vial_A_purity_pct", "vial_B_purity_pct", "vial_C_purity_pct",
    "identity_confirmed", "meets_spec", "lab", "analysis_date", "report", "disposition_date", "disposition_note", "recall_date", "recall_note",
  ];
  const rows = getLots().map((l) => {
    const p = getProduct(l.product)!;
    const s = summarize(l, p);
    const smp = l.results?.samples ?? [];
    return [
      l.code, `${p.name} ${p.nominalSize}`, p.nominalMg, l.arrivalDate, l.status,
      smp[0]?.netContentMg, smp[1]?.netContentMg, smp[2]?.netContentMg,
      smp[0]?.purityPct, smp[1]?.purityPct, smp[2]?.purityPct,
      s ? s.checks.filter((c) => c.identityOk).length + "/3" : "", s ? (s.meetsSpec ? "yes" : "no") : "",
      l.results?.lab, l.results?.analysisDate, l.results?.report, l.disposition?.date, l.disposition?.note, l.recall?.date, l.recall?.note,
    ].map(cell).join(",");
  });
  return new Response([header.join(","), ...rows].join("\n") + "\n", {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="the-record.csv"' },
  });
}
