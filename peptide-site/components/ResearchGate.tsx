"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BRAND_NAME } from "@/site.config";

const KEY = "research-use-confirmed.v1";

/**
 * One-time research-use confirmation, shown before a visitor browses the shop.
 * Lot pages opened from a QR code are public record and are never blocked.
 */
export function ResearchGate() {
  const [open, setOpen] = useState(false);
  const [declined, setDeclined] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) !== "yes") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);
  useEffect(() => {
    if (open) btn.current?.focus();
  }, [open]);

  const path = usePathname() ?? "/";
  const gated = path === "/" || ["/shop", "/products", "/cart", "/checkout"].some((p) => path.startsWith(p));
  if (!open || !gated) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="glass w-full max-w-md rounded-3xl border p-6 sm:p-8">
        <p className="eyebrow">{BRAND_NAME}</p>
        <h2 id="gate-title" className="mt-3 text-2xl font-semibold tracking-tight">Research use only</h2>
        {declined ? (
          <p className="mt-3 text-muted">
            No problem. You can still read The Record, any lot page and our protocol, but the shop is only for research
            buyers aged 21 or over.
          </p>
        ) : (
          <p className="mt-3 text-muted">
            Everything sold here is a laboratory research material. It is not for human consumption. By continuing you
            confirm you are 21 or older and are buying for research purposes only.
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <button
            ref={btn}
            type="button"
            onClick={() => {
              try {
                localStorage.setItem(KEY, "yes");
              } catch {}
              setOpen(false);
            }}
            className="btn-primary rounded-xl bg-accent px-5 py-3.5 font-semibold text-on-accent hover:bg-accent-dark"
          >
            I confirm
          </button>
          {!declined && (
            <button type="button" onClick={() => setDeclined(true)} className="rounded-xl px-5 py-2.5 text-sm font-medium text-muted underline underline-offset-4 hover:text-ink">
              I don&apos;t meet these requirements
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
