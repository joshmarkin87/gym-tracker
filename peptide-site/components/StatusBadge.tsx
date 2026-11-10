import type { LotStatus } from "@/lib/data";

const styles: Record<LotStatus, { cls: string; icon: string; label: string }> = {
  "For sale": { cls: "bg-pass-soft text-pass border-pass/30", icon: "✓", label: "Passed · For sale" },
  "Sold out": { cls: "bg-pass-soft text-pass border-pass/30", icon: "✓", label: "Passed · Sold out" },
  "In testing": { cls: "bg-wait-soft text-wait border-wait/30", icon: "…", label: "In testing · Not for sale" },
  "FAILED - Destroyed": { cls: "bg-fail-soft text-fail border-fail/30", icon: "✕", label: "FAILED · Destroyed" },
  "FAILED - Returned": { cls: "bg-fail-soft text-fail border-fail/30", icon: "✕", label: "FAILED · Returned to supplier" },
};

export function StatusBadge({ status, size = "sm" }: { status: LotStatus; size?: "sm" | "lg" }) {
  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap ${s.cls} ${
        size === "lg" ? "px-4 py-1.5 text-base" : "px-2.5 py-0.5 text-xs"
      }`}
    >
      <span aria-hidden="true">{s.icon}</span>
      {s.label}
    </span>
  );
}
