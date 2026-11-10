"use client";

import { useId, useState } from "react";

export function WaitlistForm({
  productSlug,
  productLabel,
  lotCode,
  heading,
}: {
  productSlug: string;
  productLabel: string;
  lotCode: string | null;
  heading: string;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product: productSlug, lot: lotCode, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-xl border border-pass/30 bg-pass-soft p-4 text-pass">
        <p className="font-semibold">You&apos;re on the list.</p>
        <p className="mt-1 text-sm text-ink">
          We&apos;ll email <strong>{email}</strong> once, when ordering opens for {productLabel}
          {lotCode ? <> (lot <span className="lot-code">{lotCode}</span>)</> : null}. Nothing else.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <p className="font-semibold">{heading}</p>
      <label htmlFor={id} className="mt-3 block text-sm text-muted">
        Email address
      </label>
      <div className="mt-1 flex flex-col gap-2">
        <input
          id={id}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state === "error"}
          aria-describedby={error ? `${id}-err` : undefined}
          className="min-w-0 flex-1 rounded-lg border border-line bg-card px-4 py-3 focus:border-accent"
          placeholder="you@example.com"
        />
        {/* Honeypot for bots; hidden from people and assistive tech. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-lg bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
        >
          {state === "sending" ? "Joining…" : "Join the waitlist"}
        </button>
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-2 text-sm text-fail">
          {error}
        </p>
      )}
      <p className="mt-2 text-xs text-muted">One email when ordering opens. We never share your address.</p>
    </form>
  );
}
