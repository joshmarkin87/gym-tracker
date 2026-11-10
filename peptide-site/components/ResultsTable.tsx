import type { Lot, Product } from "@/lib/data";
import { summarize } from "@/lib/data";
import { date, mg, pct, range } from "@/lib/format";
import { SPEC } from "@/site.config";
import Link from "next/link";
import { DocIcon } from "./icons";

function Mark({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="text-pass" aria-label="meets specification" title="Meets specification">✓</span>
  ) : (
    <span className="font-bold text-fail" aria-label="fails specification" title="Fails specification">✕</span>
  );
}

/** The three individual sample results, the range, and where the numbers came from. */
export function ResultsTable({ lot, product }: { lot: Lot; product: Product }) {
  const s = summarize(lot, product);

  if (!s || !lot.results) {
    return (
      <div className="rounded-xl border border-wait/30 bg-wait-soft p-5 text-wait">
        <p className="font-semibold">Results not published yet.</p>
        <p className="mt-1 text-sm">
          Three vials from this lot were pulled at random and sent to the lab, coded and blind. All three results will
          appear here, together with the full lab report. Until then, no vial from this lot is sold.
        </p>
      </div>
    );
  }

  const r = lot.results;
  const lowPct = (s.contentMin / product.nominalMg) * 100;
  const highPct = (s.contentMax / product.nominalMg) * 100;

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-line bg-card">
        <table className="w-full text-left text-sm sm:text-base">
          <caption className="sr-only">
            Individual results for the three vials tested from lot {lot.code}, label claim {product.nominalSize}
          </caption>
          <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-3 py-2.5 font-semibold sm:px-4">Vial</th>
              <th scope="col" className="px-3 py-2.5 font-semibold sm:px-4">Identity</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">Net content</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">Purity</th>
            </tr>
          </thead>
          <tbody className="num">
            {s.checks.map((c) => (
              <tr key={c.sample.id} className={`border-t border-line ${c.pass ? "" : "bg-fail-soft/60"}`}>
                <th scope="row" className="px-3 py-3 font-semibold sm:px-4">
                  {c.sample.id}
                </th>
                <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                  <Mark ok={c.identityOk} /> {c.sample.identity === "Detected" ? "Confirmed" : "Not detected"}
                </td>
                <td className="px-3 py-3 text-right sm:px-4">
                  <span className="font-semibold">{mg(c.sample.netContentMg)} mg</span> <Mark ok={c.contentOk} />
                  <span className="block text-xs text-muted">{c.contentPctOfClaim.toFixed(0)}% of label</span>
                </td>
                <td className="px-3 py-3 text-right sm:px-4">
                  <span className="font-semibold">{pct(c.sample.purityPct)}%</span> <Mark ok={c.purityOk} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="num border-t-2 border-line bg-paper">
            <tr>
              <th scope="row" colSpan={2} className="px-3 py-3 text-left font-semibold sm:px-4">
                Range (lowest–highest)
              </th>
              <td className="px-3 py-3 text-right font-semibold sm:px-4">
                {range(s.contentMin, s.contentMax, mg)} mg
                <span className="block text-xs font-normal text-muted">
                  {range(Math.round(lowPct), Math.round(highPct), String)}% of label
                </span>
              </td>
              <td className="px-3 py-3 text-right font-semibold sm:px-4">{range(s.purityMin, s.purityMax, pct)}%</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-3 text-sm text-muted">
        Label claim {product.nominalSize}. Pass requires, for every vial: identity confirmed, net content{" "}
        {SPEC.netContentMinPct}–{SPEC.netContentMaxPct}% of label, purity at or above {SPEC.purityMinPct}%.{" "}
        <Link href="/protocol#thresholds" className="text-accent underline underline-offset-2">
          Why these numbers
        </Link>
      </p>

      <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Tested by</dt>
          <dd className="font-medium">{r.lab}</dd>
        </div>
        <div>
          <dt className="text-muted">Analysis date</dt>
          <dd className="font-medium">{date(r.analysisDate)}</dd>
        </div>
        {r.methods && (
          <div>
            <dt className="text-muted">Methods</dt>
            <dd className="font-medium">{r.methods}</dd>
          </div>
        )}
        {r.publishedDate && (
          <div>
            <dt className="text-muted">Published here</dt>
            <dd className="font-medium">{date(r.publishedDate)}</dd>
          </div>
        )}
      </dl>

      <a
        href={r.report}
        target="_blank"
        rel="noopener"
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-accent px-4 py-2.5 font-semibold text-accent hover:bg-accent-soft"
      >
        <DocIcon /> Read the full, unedited lab report (PDF)
      </a>
    </div>
  );
}
