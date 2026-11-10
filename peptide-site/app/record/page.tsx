import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/Container";
import { StatusBadge } from "@/components/StatusBadge";
import { getLots, getProduct, isFailed, lotCounts, summarize } from "@/lib/data";
import { date, mg, pct, range } from "@/lib/format";
import { RecordFilter } from "@/components/RecordFilter";
import { DocIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "The Record",
  description: "Every lot ever received, pass or fail, with individual results and what happened to it. Nothing is ever removed.",
};

export default function Record() {
  const lots = getLots();
  const counts = lotCounts();
  return (
    <>
      <PageHeader eyebrow="The Record" title="Every lot we have ever received">
        Passed or failed, with every individual result and what happened to the stock. Lots are added the day they
        arrive. Nothing on this page is ever edited away or removed.
      </PageHeader>
      <Container className="py-10">
        <dl className="readout surface grid grid-cols-3 rounded-2xl border border-line bg-card py-5 text-center">
          <div><dt className="label px-1">Lots received</dt><dd className="num mt-1 text-4xl font-medium">{counts.total}</dd></div>
          <div><dt className="label px-1">Results published</dt><dd className="num mt-1 text-4xl font-medium">{counts.tested}</dd></div>
          <div><dt className="label px-1">Failed</dt><dd className="num mt-1 text-4xl font-medium text-fail">{counts.failed}</dd></div>
        </dl>

        <p className="mt-6 text-sm text-muted">
          Newest arrival first. Net content shows all three vials, as tested.{" "}
          <a href="/record.csv" download className="text-accent underline">Download The Record as a spreadsheet (CSV)</a>.
        </p>

        <RecordFilter
          counts={{
            all: lots.length,
            fail: lots.filter((l) => isFailed(l) || !!l.recall).length,
            wait: lots.filter((l) => l.status === "In testing").length,
            pass: lots.filter((l) => (l.status === "For sale" || l.status === "Sold out") && !l.recall).length,
          }}
        />

        <ol className="mt-4 space-y-4">
          {lots.map((lot) => {
            const p = getProduct(lot.product)!;
            const s = summarize(lot, p);
            const failed = isFailed(lot) || !!lot.recall;
            return (
              <li key={lot.code} data-record-row data-kind={failed ? "fail" : lot.status === "In testing" ? "wait" : "pass"} data-text={`${lot.code} ${p.name} ${p.nominalSize}`.toLowerCase()}>
                <article className={`surface rounded-2xl border bg-card p-5 sm:p-6 ${failed ? "border-fail/50" : "border-line"}`} aria-labelledby={`r-${lot.code}`}>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <h2 id={`r-${lot.code}`} className="lot-code text-lg font-semibold">
                      <Link href={`/lot/${lot.code}`} className="hover:text-accent hover:underline">{lot.code}</Link>
                    </h2>
                    <StatusBadge status={lot.status} />
                    <span className="text-sm text-muted sm:ml-auto">Arrived {date(lot.arrivalDate)}</span>
                  </div>
                  <p className="mt-1.5 font-medium">{p.name} <span className="font-normal text-muted">{p.nominalSize}</span></p>

                  {s && lot.results ? (
                    <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm sm:grid-cols-[1.5fr_1fr_1fr_1.2fr] [&_dt]:mb-0.5">
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="label">Net content, vials A / B / C</dt>
                        <dd className={`num font-semibold ${failed ? "text-fail" : ""}`}>
                          {lot.results.samples.map((x) => mg(x.netContentMg)).join(" / ")} mg
                        </dd>
                      </div>
                      <div>
                        <dt className="label">Purity range</dt>
                        <dd className="num font-semibold">{range(s.purityMin, s.purityMax, pct)}%</dd>
                      </div>
                      <div>
                        <dt className="label">Identity</dt>
                        <dd className="font-semibold">
                          {s.checks.every((c) => c.identityOk) ? "Confirmed, all 3" : `Confirmed in ${s.checks.filter((c) => c.identityOk).length} of 3`}
                        </dd>
                      </div>
                      <div>
                        <dt className="label">Tested</dt>
                        <dd className="font-semibold">{date(lot.results.analysisDate)}</dd>
                      </div>
                    </dl>
                  ) : (
                    <p className="mt-4 flex items-center gap-2.5 border-t border-line pt-4 text-sm text-wait"><span aria-hidden="true" className="led led-live" />With the lab. Not for sale until results are published here.</p>
                  )}

                  {lot.disposition && (
                    <p className="mt-4 rounded-lg border border-fail/20 bg-fail-soft px-4 py-3 text-sm">
                      <strong className="text-fail">Disposition, {date(lot.disposition.date)}:</strong> {lot.disposition.note}
                    </p>
                  )}

                  {lot.recall && (
                    <p className="mt-4 rounded-lg bg-fail-soft px-4 py-3 text-sm">
                      <strong className="text-fail">Recalled {date(lot.recall.date)}:</strong> {lot.recall.note}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <Link href={`/lot/${lot.code}`} className="font-semibold text-accent underline underline-offset-2">Lot page</Link>
                    {lot.results && (
                      <a href={lot.results.report} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-accent underline underline-offset-2">
                        <DocIcon className="h-4 w-4" /> Full lab report (PDF)
                      </a>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </Container>
    </>
  );
}
