import type { Lot, Product } from "@/lib/data";
import { summarize } from "@/lib/data";
import { date, mg, pct, range } from "@/lib/format";
import { SPEC } from "@/site.config";
import Link from "next/link";
import { SpecChart } from "./SpecChart";
import { DocIcon } from "./icons";
import { StatusGlyph } from "./StatusBadge";

function Mark({ ok }: { ok: boolean }) {
  return ok ? (
    <span role="img" className="inline-flex align-[-0.15em] text-pass" aria-label="meets specification" title="Meets specification">
      <StatusGlyph kind="pass" />
    </span>
  ) : (
    <span role="img" className="inline-flex align-[-0.15em] text-fail" aria-label="fails specification" title="Fails specification">
      <StatusGlyph kind="fail" />
    </span>
  );
}

/** The three individual sample results, the range, and where the numbers came from. */
export function ResultsTable({ lot, product }: { lot: Lot; product: Product }) {
  const s = summarize(lot, product);

  if (!s || !lot.results) {
    return (
      <div className="scan rounded-xl border border-wait/30 bg-wait-soft p-5 text-wait">
        <p className="flex items-center gap-2.5 font-semibold">
          <span aria-hidden="true" className="led led-live" />
          Results not published yet.
        </p>
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
      <div className="mb-4"><SpecChart lot={lot} product={product} /></div>
      <div className="surface overflow-x-auto rounded-xl border border-line bg-card">
        <table className="w-full text-left text-xs sm:text-base">
          <caption className="sr-only">
            Individual results for the three vials tested from lot {lot.code}, label claim {product.nominalSize}
          </caption>
          <thead className="bg-paper font-mono text-[0.625rem] uppercase tracking-[0.06em] text-muted sm:text-[0.6875rem] sm:tracking-[0.1em]">
            <tr>
              <th scope="col" className="px-1.5 py-2.5 font-medium sm:px-4">Vial</th>
              <th scope="col" className="px-1.5 py-2.5 font-medium sm:px-4">Identity</th>
              <th scope="col" className="px-1.5 py-2.5 text-right font-medium sm:px-4">Net content</th>
              <th scope="col" className="px-1.5 py-2.5 text-right font-medium sm:px-4">Purity</th>
            </tr>
          </thead>
          <tbody className="num">
            {s.checks.map((c) => (
              <tr key={c.sample.id} className={`border-t border-line ${c.pass ? "" : "bg-fail-soft/60"}`}>
                <th scope="row" className="px-1.5 py-3 sm:px-4">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-line bg-paper text-xs font-medium sm:h-7 sm:w-7 sm:text-sm">
                    {c.sample.id}
                  </span>
                </th>
                <td className="whitespace-nowrap px-1.5 py-3 font-sans sm:px-4">
                  <Mark ok={c.identityOk} /> {c.sample.identity === "Detected" ? "Confirmed" : "Not detected"}
                </td>
                <td className="whitespace-nowrap px-1.5 py-3 text-right sm:px-4">
                  <span className="font-semibold">{mg(c.sample.netContentMg)} mg</span> <Mark ok={c.contentOk} />
                  <span className="block text-[0.6875rem] text-muted sm:pr-[1.375rem] sm:text-xs">{c.contentPctOfClaim.toFixed(0)}% of label</span>
                </td>
                <td className="whitespace-nowrap px-1.5 py-3 text-right sm:px-4">
                  <span className="font-semibold">{pct(c.sample.purityPct)}%</span> <Mark ok={c.purityOk} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="num border-t border-ink/15 bg-paper">
            <tr>
              <th scope="row" colSpan={2} className="px-1.5 py-3 text-left font-sans text-xs font-semibold sm:px-4 sm:text-sm">
                Range (lowest–highest)
              </th>
              <td className="whitespace-nowrap px-1.5 py-3 text-right font-semibold sm:pl-4 sm:pr-[2.375rem]">
                {range(s.contentMin, s.contentMax, mg)} mg
                <span className="block text-[0.6875rem] font-normal text-muted sm:text-xs">
                  {range(Math.round(lowPct), Math.round(highPct), String)}% of label
                </span>
              </td>
              <td className="whitespace-nowrap px-1.5 py-3 text-right font-semibold sm:pl-4 sm:pr-[2.375rem]">{range(s.purityMin, s.purityMax, pct)}%</td>
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

      <dl className="mt-5 grid gap-x-6 gap-y-4 border-t border-line pt-5 text-sm sm:grid-cols-2 [&_dt]:mb-0.5">
        <div>
          <dt className="label">Tested by</dt>
          <dd className="font-medium">{r.lab}</dd>
        </div>
        <div>
          <dt className="label">Analysis date</dt>
          <dd className="font-medium">{date(r.analysisDate)}</dd>
        </div>
        {r.methods && (
          <div>
            <dt className="label">Methods</dt>
            <dd className="font-medium">{r.methods}</dd>
          </div>
        )}
        {r.publishedDate && (
          <div>
            <dt className="label">Published here</dt>
            <dd className="font-medium">{date(r.publishedDate)}</dd>
          </div>
        )}
      </dl>

      <a
        href={r.report}
        target="_blank"
        rel="noopener"
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-accent/60 bg-card px-4 py-2.5 font-semibold text-accent shadow-[0_1px_2px_rgb(18_27_36/0.05)] transition-colors hover:border-accent hover:bg-accent-soft"
      >
        <DocIcon /> Read the full, unedited lab report (PDF)
      </a>
      {r.verifyUrl && (
        <a href={r.verifyUrl} target="_blank" rel="noopener noreferrer" className="ml-0 mt-3 block text-sm font-semibold text-accent underline underline-offset-2 sm:ml-4 sm:mt-0 sm:inline">
          Check this report on the lab&apos;s own website
        </a>
      )}
    </div>
  );
}
