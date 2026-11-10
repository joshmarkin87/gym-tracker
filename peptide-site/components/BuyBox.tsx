"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { MAX_QTY, useCart } from "./cart";
import { WaitlistForm } from "./WaitlistForm";

type Props = {
  launchMode: "waitlist" | "live";
  product: { slug: string; name: string; nominalSize: string; priceCad: number };
  /** The lot currently for sale, if any. */
  saleLot: string | null;
  /** The lot in testing, if any (for the waitlist when nothing is for sale). */
  testingLot: string | null;
  priceLabel: string;
};

export function BuyBox({ launchMode, product, saleLot, testingLot, priceLabel }: Props) {
  const label = `${product.name} ${product.nominalSize}`;
  const qtyId = useId();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="rounded-2xl border border-line bg-card p-5 sm:p-6">
      <p className="num text-3xl font-semibold">{priceLabel}</p>
      <p className="text-sm text-muted">per vial, {product.nominalSize} label claim</p>

      <div className="mt-5">
        {!saleLot ? (
          <>
            <p className="mb-4 rounded-lg border border-wait/30 bg-wait-soft px-4 py-3 font-semibold text-wait">
              In testing, not for sale.
            </p>
            <WaitlistForm
              productSlug={product.slug}
              productLabel={label}
              lotCode={testingLot}
              heading={
                testingLot
                  ? `Get one email when lot ${testingLot} has published results and is ready to order.`
                  : "Get one email when the next lot has published results and is ready to order."
              }
            />
          </>
        ) : launchMode === "waitlist" ? (
          <WaitlistForm
            productSlug={product.slug}
            productLabel={label}
            lotCode={saleLot}
            heading={`Join the waitlist for this lot (${saleLot})`}
          />
        ) : (
          <div>
            <p className="text-sm">
              You will receive vials from lot <span className="lot-code font-semibold">{saleLot}</span>, the lot whose
              results are shown on this page.
            </p>
            <div className="mt-4 flex items-end gap-3">
              <div>
                <label htmlFor={qtyId} className="block text-sm text-muted">
                  Quantity
                </label>
                <select
                  id={qtyId}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="mt-1 rounded-lg border border-line bg-card px-3 py-3"
                >
                  {Array.from({ length: MAX_QTY }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  add({ slug: product.slug, name: product.name, nominalSize: product.nominalSize, lotCode: saleLot, unitPrice: product.priceCad }, qty);
                  setAdded(true);
                }}
                className="flex-1 rounded-lg bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark"
              >
                Add to cart
              </button>
            </div>
            <p aria-live="polite" className="mt-3 text-sm">
              {added && (
                <>
                  Added.{" "}
                  <Link href="/cart" className="font-semibold text-accent underline">
                    View cart
                  </Link>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
