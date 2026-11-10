"use client";

import Link from "next/link";
import { MAX_QTY, useCart } from "./cart";

const fmt = (n: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n) + " CAD";

export function CartView({ ruo, checkout = false }: { ruo: string; checkout?: boolean }) {
  const { items, subtotal, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <div className="surface rounded-2xl border border-line bg-card p-6">
        <p className="text-lg font-semibold">Your cart is empty.</p>
        <Link href="/shop" className="mt-3 inline-block font-semibold text-accent underline">Go to the shop</Link>
        <p className="mt-6 font-semibold">{ruo}</p>
      </div>
    );
  }

  return (
    <div className="surface rounded-2xl border border-line bg-card">
      <ul className="divide-y divide-line">
        {items.map((i) => (
          <li key={i.lotCode} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="font-semibold">{i.name} {i.nominalSize}</p>
              <p className="text-sm text-muted">
                Lot <Link href={`/lot/${i.lotCode}`} className="lot-code text-accent underline">{i.lotCode}</Link> · {fmt(i.unitPrice)} each
              </p>
            </div>
            {checkout ? (
              <p className="num">× {i.qty}</p>
            ) : (
              <div className="flex items-center gap-3">
                <label className="sr-only" htmlFor={`q-${i.lotCode}`}>Quantity for {i.name}</label>
                <select id={`q-${i.lotCode}`} value={i.qty} onChange={(e) => setQty(i.lotCode, Number(e.target.value))} className="field rounded-lg border border-line bg-card px-3 py-2">
                  {Array.from({ length: MAX_QTY }, (_, n) => n + 1).map((n) => <option key={n}>{n}</option>)}
                </select>
                <button type="button" onClick={() => remove(i.lotCode)} className="text-sm font-semibold text-fail underline">
                  Remove<span className="sr-only"> {i.name}</span>
                </button>
              </div>
            )}
            <p className="num w-32 text-right font-semibold">{fmt(i.unitPrice * i.qty)}</p>
          </li>
        ))}
      </ul>
      <div className="border-t border-line p-5">
        <p className="num flex justify-between text-lg font-semibold"><span>Subtotal</span><span>{fmt(subtotal)}</span></p>
        <p className="mt-1 text-sm text-muted">Shipping and taxes are calculated at checkout.</p>
        <p role="note" className="mt-4 rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm font-semibold">{ruo}</p>
        {!checkout && (
          <Link href="/checkout" className="mt-4 block btn-primary rounded-lg bg-accent px-5 py-3 text-center font-semibold text-on-accent hover:bg-accent-dark">
            Continue to checkout
          </Link>
        )}
      </div>
    </div>
  );
}
