"use client";

import { useState } from "react";
import { useCart } from "./cart";

/**
 * CHECKOUT STUB. No payment is taken. Replace `onSubmit` with your payment
 * provider's flow (create the order server-side, then redirect to payment).
 */
export function CheckoutStub() {
  const { items } = useCart();
  const [ack, setAck] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  if (items.length === 0) return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="mt-6 space-y-4 rounded-2xl border border-line bg-card p-5 sm:p-7"
    >
      <p className="rounded-lg border border-wait/30 bg-wait-soft px-4 py-3 text-sm text-wait">
        <strong>Payment not connected.</strong> This checkout is a placeholder for a payment provider. Submitting it
        takes no payment and places no order.
      </p>
      <label className="flex items-start gap-3">
        <input type="checkbox" required checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--color-accent)]" />
        <span>
          I am purchasing these materials for laboratory research use only. They are not for human consumption, and I
          will not use them in people or animals.
        </span>
      </label>
      <button type="submit" disabled={!ack} className="w-full rounded-lg bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark disabled:opacity-50">
        Continue to payment
      </button>
      <p aria-live="polite" className="text-sm">
        {submitted && "Stub reached: this is where the payment provider takes over. No order was placed."}
      </p>
    </form>
  );
}
