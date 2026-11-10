import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ResultsTable } from "@/components/ResultsTable";
import { StatusBadge } from "@/components/StatusBadge";
import { LotQr } from "@/components/LotQr";
import { BuyBox } from "@/components/BuyBox";
import { Vial } from "@/components/Vial";
import { RuoNotice } from "@/components/RuoNotice";
import { lotSummaryText } from "@/components/LotSummaryLine";
import { getCurrentLot, getLotsForProduct, getProduct, getProducts, isFailed } from "@/lib/data";
import { date, price } from "@/lib/format";
import { LAUNCH_MODE } from "@/site.config";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: `${p.name} ${p.nominalSize}`, description: `Lot results and lab reports for ${p.name} ${p.nominalSize}. Research use only.` } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const lots = getLotsForProduct(product.slug);
  const current = getCurrentLot(product.slug);
  const testing = lots.find((l) => l.status === "In testing");
  const shown = current ?? testing;

  return (
    <Container className="py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
        <Link href="/shop" className="hover:text-accent hover:underline">Shop</Link> <span aria-hidden="true">/</span>{" "}
        <span aria-current="page">{product.name} {product.nominalSize}</span>
      </nav>

      <div className="vial-stage mt-4 flex items-center gap-5 rounded-3xl border border-line p-5 sm:gap-8 sm:p-8">
        <Vial name={product.name} size={product.nominalSize} lotCode={(current ?? testing)?.code} prefix={product.lotPrefix} status={(current ?? testing)?.status} className="h-44 sm:h-60" />
        <div className="min-w-0">
          <p className="eyebrow">Research material</p>
          <h1 className="headline mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            {product.name} <span className="font-normal">{product.nominalSize}</span>
          </h1>
          <p className="mt-3 max-w-md text-muted">
            The label on your vial carries this lot code. Every number for that lot is below, vial by vial.
          </p>
        </div>
      </div>
      <RuoNotice className="mt-4" />

      <dl className="surface mt-6 grid gap-4 rounded-2xl border border-line bg-card p-5 text-sm sm:grid-cols-3 [&_dt]:mb-1">
        <div>
          <dt className="label">Nominal size (label claim)</dt>
          <dd className="font-semibold">{product.nominalSize} per vial</dd>
        </div>
        <div>
          <dt className="label">Form</dt>
          <dd className="font-semibold">{product.form}</dd>
        </div>
        <div>
          <dt className="label">Storage</dt>
          <dd>{product.storage}</dd>
        </div>
      </dl>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <section aria-labelledby="current-lot" className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="current-lot" className="text-xl font-semibold tracking-tight">
              {current ? "The lot you would receive" : "Current lot"}
            </h2>
            {shown && <StatusBadge status={shown.status} />}
          </div>
          {shown ? (
            <div className="surface mt-4 rounded-2xl border border-line bg-card p-4 sm:p-6">
              <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="label">Lot code</p>
                  <p className="lot-code mt-1 text-2xl font-semibold">{shown.code}</p>
                  <p className="mt-1 text-sm text-muted">
                    Arrived {date(shown.arrivalDate)}
                    {shown.results && <> · Tested {date(shown.results.analysisDate)}</>}
                  </p>
                  <Link href={`/lot/${shown.code}`} className="mt-2 inline-block text-sm font-semibold text-accent underline underline-offset-2">
                    Open this lot&apos;s verification page
                  </Link>
                </div>
                <LotQr code={shown.code} className="h-28 w-28" />
              </div>
              <div className="mt-6">
                <ResultsTable lot={shown} product={product} />
              </div>
            </div>
          ) : (
            <p className="mt-4 surface rounded-2xl border border-line bg-card p-5 text-muted">
              No lot is on sale or in testing right now. The history of every past lot is below.
            </p>
          )}
        </section>

        <aside aria-label="Purchase" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <BuyBox
            launchMode={LAUNCH_MODE}
            product={{ slug: product.slug, name: product.name, nominalSize: product.nominalSize, priceCad: product.priceCad }}
            saleLot={current?.code ?? null}
            testingLot={testing?.code ?? null}
            priceLabel={price(product.priceCad)}
          />
          <RuoNotice className="mt-4" />
        </aside>
      </div>

      <section aria-labelledby="history" className="mt-14">
        <h2 id="history" className="text-xl font-semibold">Every lot of {product.name} {product.nominalSize}</h2>
        <p className="text-muted">Passed and failed. Nothing is removed. Select a lot for all results and its full report.</p>
        <ul className="mt-4 divide-y divide-line overflow-hidden surface rounded-2xl border border-line bg-card">
          {lots.map((l) => (
            <li key={l.code}>
              <Link href={`/lot/${l.code}`} className="flex flex-col gap-2 p-4 transition-colors hover:bg-paper sm:flex-row sm:items-center sm:gap-4">
                <span className="lot-code w-36 shrink-0 font-semibold">{l.code}</span>
                <span className="shrink-0"><StatusBadge status={l.status} /></span>
                <span className={`num flex-1 text-sm ${isFailed(l) ? "font-semibold text-fail" : ""}`}>{lotSummaryText(l, product)}</span>
                <span className="text-sm text-muted">Arrived {date(l.arrivalDate)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
