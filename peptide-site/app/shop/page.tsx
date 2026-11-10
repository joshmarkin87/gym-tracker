import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/Container";
import { RuoNotice } from "@/components/RuoNotice";
import { StatusGlyph } from "@/components/StatusBadge";
import { lotSummaryText } from "@/components/LotSummaryLine";
import { getCurrentLot, getLotsForProduct, getProducts } from "@/lib/data";
import { price } from "@/lib/format";
import { Vial } from "@/components/Vial";
import { LAUNCH_MODE } from "@/site.config";

export const metadata: Metadata = { title: "Shop" };

export default function Shop() {
  const products = getProducts();
  return (
    <>
      <PageHeader eyebrow="Shop" title="Every product shows the lot you'd receive">
        Each card shows the lot currently on sale and its three individual results. If a product has no lot that has
        passed testing, it can&apos;t be bought. No exceptions.
      </PageHeader>
      <Container className="py-10">
        {LAUNCH_MODE === "waitlist" && (
          <p className="mb-6 rounded-xl border border-accent/25 bg-gradient-to-br from-card to-accent-soft px-4 py-3 text-accent-dark">
            <strong>Ordering opens soon.</strong> Prices and results are live now. Join the waitlist for a lot from its
            product page and we&apos;ll email you once when you can order.
          </p>
        )}
        <ul className="grid gap-5 sm:grid-cols-2">
          {products.map((p) => {
            const lot = getCurrentLot(p.slug);
            const testing = getLotsForProduct(p.slug).find((l) => l.status === "In testing");
            return (
              <li key={p.slug}>
                <article className="flex h-full flex-col surface rounded-2xl border border-line bg-card p-6">
                  <div className="vial-stage -mx-6 -mt-6 mb-5 flex justify-center rounded-t-2xl border-b border-line py-6">
                    <Vial name={p.name} size={p.nominalSize} lotCode={(lot ?? testing)?.code} prefix={p.lotPrefix} status={(lot ?? testing)?.status} className="h-52" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    <Link href={`/products/${p.slug}`} className="hover:text-accent hover:underline">
                      {p.name} <span className="font-normal text-muted">{p.nominalSize}</span>
                    </Link>
                  </h2>
                  <p className="num mt-1 text-lg font-medium">{price(p.priceCad)}</p>
                  <div className="mt-4 flex-1 rounded-xl border border-line bg-paper p-4 text-sm">
                    {lot ? (
                      <p className="num">
                        <span className="font-semibold text-pass"><StatusGlyph kind="pass" className="mr-1.5 h-3.5 w-3.5 align-[-0.15em]" />Lot </span>
                        <span className="lot-code font-semibold text-pass">{lot.code}</span>
                        <span className="font-semibold text-pass">:</span> {lotSummaryText(lot, p)}
                      </p>
                    ) : (
                      <p className="font-semibold text-wait">
                        <span aria-hidden="true" className="led led-live mr-2.5 align-middle" />
                        In testing, not for sale.
                        {testing && (
                          <span className="mt-1 block font-normal text-ink">
                            Lot <span className="lot-code">{testing.code}</span> is with the lab. Results will be
                            published here first.
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/products/${p.slug}`}
                    className={`mt-5 rounded-lg px-5 py-3 text-center font-semibold ${
                      lot ? "btn-primary bg-accent text-on-accent hover:bg-accent-dark" : "border border-ink/15 bg-card text-ink shadow-[0_1px_2px_rgb(18_27_36/0.05)] hover:bg-paper"
                    }`}
                  >
                    {lot
                      ? LAUNCH_MODE === "live"
                        ? "See results and buy"
                        : "See results, join the waitlist"
                      : "See lot history, get notified"}
                    <span className="sr-only">: {p.name} {p.nominalSize}</span>
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
        <RuoNotice className="mt-10 text-center" />
      </Container>
    </>
  );
}
