import type { Lot, Product } from "@/lib/data";
import { summarize } from "@/lib/data";
import { mg, pct, range } from "@/lib/format";

/** One line: "9.8 / 10.1 / 10.3 mg, purity 99.1–99.4%". All three numbers, never an average. */
export function lotSummaryText(lot: Lot, product: Product): string {
  const s = summarize(lot, product);
  if (!s || !lot.results) return "In testing. No results yet.";
  const contents = lot.results.samples.map((x) => mg(x.netContentMg)).join(" / ");
  return `${contents} mg, purity ${range(s.purityMin, s.purityMax, pct)}%`;
}
