import type { LotStatus } from "@/lib/data";

type Kind = "pass" | "wait" | "fail";

const styles: Record<LotStatus, { kind: Kind; label: string }> = {
  "For sale": { kind: "pass", label: "Passed · For sale" },
  "Sold out": { kind: "pass", label: "Passed · Sold out" },
  "In testing": { kind: "wait", label: "In testing · Not for sale" },
  "FAILED - Destroyed": { kind: "fail", label: "FAILED · Destroyed" },
  "FAILED - Returned": { kind: "fail", label: "FAILED · Returned to supplier" },
};

const tone: Record<Kind, string> = {
  pass: "bg-pass-soft text-pass border-pass/25",
  wait: "bg-wait-soft text-wait border-wait/25",
  fail: "bg-fail-soft text-fail border-fail/30",
};

/** Small status glyph: a check, a cross, or a pulsing "live" LED. Decorative; the label carries the meaning. */
export function StatusGlyph({ kind, className = "h-3.5 w-3.5" }: { kind: Kind; className?: string }) {
  if (kind === "wait") {
    return (
      <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center ${className}`}>
        <span className="led led-live" />
      </span>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`inline-block shrink-0 ${className}`}>
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      {kind === "pass" ? (
        <path d="m4.6 8.3 2.3 2.3 4.5-4.9" fill="none" stroke="var(--color-paper)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m5.2 5.2 5.6 5.6m0-5.6-5.6 5.6" fill="none" stroke="var(--color-paper)" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function StatusBadge({ status, size = "sm" }: { status: LotStatus; size?: "sm" | "lg" }) {
  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono font-medium uppercase whitespace-nowrap ${tone[s.kind]} ${
        size === "lg" ? "gap-2 px-3.5 py-1.5 text-[0.8125rem] tracking-[0.06em]" : "gap-1.5 py-1 pl-1.5 pr-2.5 text-[0.6875rem] tracking-[0.05em]"
      }`}
    >
      <StatusGlyph kind={s.kind} className={size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      {s.label}
    </span>
  );
}
