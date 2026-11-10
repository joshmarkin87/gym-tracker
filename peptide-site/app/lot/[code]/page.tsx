import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ResultsTable } from "@/components/ResultsTable";
import { StatusBadge, StatusGlyph } from "@/components/StatusBadge";
import { LotQr } from "@/components/LotQr";
import { RuoNotice } from "@/components/RuoNotice";
import { getLot, getLots, getProduct, type Lot } from "@/lib/data";
import { date } from "@/lib/format";
import { RETAINS_PER_LOT, SAMPLES_PER_LOT } from "@/site.config";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLots().map((l) => ({ code: l.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const lot = getLot((await params).code);
  if (!lot) return {};
  const p = getProduct(lot.product)!;
  return { title: `Lot ${lot.code}`, description: `${p.name} ${p.nominalSize}, lot ${lot.code}: ${lot.status}. All three individual results and the full lab report.` };
}

function Verdict({ lot }: { lot: Lot }) {
  const disp = lot.disposition;
  switch (lot.status) {
    case "FAILED - Destroyed":
    case "FAILED - Returned":
      return (
        <div className="rounded-2xl border border-fail/50 bg-gradient-to-b from-white to-fail-soft p-5 shadow-[0_14px_32px_-20px_rgb(180_35_24/0.5)] sm:p-6">
          <p className="flex items-center gap-3 text-2xl font-bold tracking-tight text-fail"><StatusGlyph kind="fail" className="h-6 w-6" />FAILED</p>
          <p className="mt-2 text-lg">
            This lot did not meet our published specification.{" "}
            {lot.status === "FAILED - Destroyed" ? "It was destroyed" : "It was returned to the supplier"}
            {disp && <> on {date(disp.date)}</>}. Failed lots are never put on sale.
          </p>
          {disp?.note && <p className="mt-3">{disp.note}</p>}
          <p className="mt-3 text-sm text-muted">
            This page stays up permanently, results included, like every lot on{" "}
            <Link href="/record" className="text-accent underline">The Record</Link>.
          </p>
        </div>
      );
    case "In testing":
      return (
        <div className="scan rounded-2xl border border-wait/40 bg-gradient-to-b from-white to-wait-soft p-5 shadow-[0_14px_32px_-20px_rgb(138_75_0/0.45)] sm:p-6">
          <p className="flex items-center gap-3 text-2xl font-bold tracking-tight text-wait"><StatusGlyph kind="wait" className="h-6 w-6" />In testing</p>
          <p className="mt-2 text-lg">
            Three vials from this lot are with the lab. Nothing from it is sold until all three results are published on
            this page.
          </p>
        </div>
      );
    case "For sale":
    case "Sold out":
      return (
        <div className="rounded-2xl border border-pass/40 bg-gradient-to-b from-white to-pass-soft p-5 shadow-[0_14px_32px_-20px_rgb(20_108_52/0.5)] sm:p-6">
          <p className="flex items-center gap-3 text-2xl font-bold tracking-tight text-pass"><StatusGlyph kind="pass" className="h-6 w-6" />PASSED</p>
          <p className="mt-2 text-lg">
            All {SAMPLES_PER_LOT} vials tested met the published specification.{" "}
            {lot.status === "For sale" ? "This lot is on sale now." : "This lot has sold out."}
          </p>
        </div>
      );
  }
}

export default async function LotPage({ params }: { params: Promise<{ code: string }> }) {
  const lot = getLot((await params).code);
  if (!lot) notFound();
  const product = getProduct(lot.product)!;
  const passed = lot.status === "For sale" || lot.status === "Sold out";

  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <p className="eyebrow">Lot verification</p>
      <h1 className="lot-code mt-3 text-[2rem] font-semibold leading-tight sm:text-5xl">{lot.code}</h1>
      <p className="mt-1 text-lg">
        <Link href={`/products/${product.slug}`} className="hover:text-accent hover:underline">
          {product.name} {product.nominalSize}
        </Link>
      </p>
      <div className="mt-3">
        <StatusBadge status={lot.status} size="lg" />
      </div>

      {lot.recall && (
        <div role="alert" className="mt-6 rounded-2xl border-2 border-fail bg-fail-soft p-5 sm:p-6">
          <p className="text-2xl font-bold text-fail">RECALLED {date(lot.recall.date)}</p>
          <p className="mt-2 text-lg">{lot.recall.note}</p>
          <p className="mt-2">If you have a vial from this lot, please <Link href="/contact" className="text-accent underline">contact us</Link> for a full refund.</p>
        </div>
      )}

      <div className="mt-6">
        <Verdict lot={lot} />
      </div>

      <section aria-labelledby="results" className="mt-8">
        <h2 id="results" className="mb-3 text-xl font-semibold">Results, vial by vial</h2>
        <ResultsTable lot={lot} product={product} />
      </section>

      <section aria-labelledby="facts" className="mt-10 grid gap-6 surface rounded-2xl border border-line bg-card p-5 sm:grid-cols-[1fr_auto] sm:p-6">
        <div>
          <h2 id="facts" className="text-xl font-semibold">About this lot</h2>
          <dl className="mt-4 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 [&_dt]:mb-0.5">
            <div><dt className="label">Product</dt><dd className="font-medium">{product.name}</dd></div>
            <div><dt className="label">Label claim</dt><dd className="font-medium">{product.nominalSize} per vial</dd></div>
            <div><dt className="label">Arrived</dt><dd className="font-medium">{date(lot.arrivalDate)}</dd></div>
            <div><dt className="label">Status</dt><dd className="font-medium">{lot.status}</dd></div>
            <div><dt className="label">Vials pulled for testing</dt><dd className="font-medium">{lot.samplesPulled}, at random from sellable stock</dd></div>
            <div><dt className="label">Sealed retain vials</dt><dd className="font-medium">{lot.retainVials} kept</dd></div>
            <div className="sm:col-span-2"><dt className="label">Storage</dt><dd>{product.storage}</dd></div>
          </dl>
          {lot.notes && <p className="mt-4 text-sm">{lot.notes}</p>}
        </div>
        <LotQr code={lot.code} />
      </section>

      {passed && (
        <section className="mt-8 rounded-2xl border border-accent/25 bg-gradient-to-br from-white to-accent-soft p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-accent-dark">Have a vial from this lot? Don&apos;t take our word for it.</h2>
          <p className="mt-1">
            Send it to an independent lab of your choice. If it materially fails the published specification, we refund
            your purchase in full, pay you back for the test, and recall this lot in public.
          </p>
          <Link href="/guarantee" className="mt-3 inline-block font-semibold text-accent-dark underline underline-offset-2">
            How the guarantee works
          </Link>
        </section>
      )}

      <p className="mt-8 text-sm text-muted">
        Not the lot you expected? Check the code on your label, or{" "}
        <Link href="/verify" className="text-accent underline">look up another lot</Link>. Every lot ever received is on{" "}
        <Link href="/record" className="text-accent underline">The Record</Link>.
      </p>
      <RuoNotice className="mt-6" />
    </Container>
  );
}
