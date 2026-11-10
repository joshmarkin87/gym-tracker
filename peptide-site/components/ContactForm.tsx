"use client";

import { useState } from "react";

const TOPICS = ["Order or shipping", "A lot or a test result", "The guarantee", "Something else"];
const field = "mt-1 w-full rounded-lg border border-line bg-card px-4 py-3 focus:border-accent";

export function ContactForm({ responseCommitment }: { responseCommitment: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Something went wrong. Please try again, or email us.");
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-2xl border border-pass/30 bg-pass-soft p-6">
        <p className="text-lg font-semibold text-pass">Message received.</p>
        <p className="mt-1">{responseCommitment} A copy of the confirmation is on its way to your inbox.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-line bg-card p-5 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="font-medium">Name <span className="font-normal text-muted">(optional)</span></label>
          <input id="c-name" name="name" autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="c-email" className="font-medium">Email</label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className={field} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-topic" className="font-medium">What&apos;s it about?</label>
          <select id="c-topic" name="topic" className={field} defaultValue={TOPICS[0]}>
            {TOPICS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="c-lot" className="font-medium">Lot code <span className="font-normal text-muted">(if any)</span></label>
          <input id="c-lot" name="lot" autoCapitalize="characters" placeholder="e.g. RET-2026-001" className={`${field} lot-code uppercase placeholder:normal-case`} />
        </div>
      </div>
      <div>
        <label htmlFor="c-message" className="font-medium">Message</label>
        <textarea id="c-message" name="message" required rows={6} className={field} />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {error && <p role="alert" className="text-fail">{error}</p>}
      <button type="submit" disabled={state === "sending"} className="rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
