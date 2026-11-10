import Link from "next/link";
import type { Lot, Product } from "@/lib/data";
import { isFailed } from "@/lib/data";
import { date } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import { lotSummaryText } from "./LotSummaryLine";
import { ArrowIcon } from "./icons";

export function LotCard({ lot, product }: { lot: Lot; product: Product }) {
  const failed = isFailed(lot);
  return (
    <Link
      href={`/lot/${lot.code}`}
      className={`surface group flex h-full flex-col rounded-2xl border bg-card p-5 ${
        failed ? "border-fail/40" : "border-line hover:border-accent/40"
      }`}
    >
      <div className="flex flex-col items-start gap-2.5">
        <span className="lot-code text-sm font-medium text-muted">{lot.code}</span>
        <StatusBadge status={lot.status} />
      </div>
      <p className="mt-4 text-lg font-semibold tracking-tight">
        {product.name} <span className="font-normal text-muted">{product.nominalSize}</span>
      </p>
      <p className={`num mt-2 rounded-lg border px-3 py-2 text-sm ${failed ? "border-fail/20 bg-fail-soft font-semibold text-fail" : "border-line bg-paper"}`}>
        {lotSummaryText(lot, product)}
      </p>
      <p className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-4 text-sm text-muted">
        <span>{lot.results ? `Tested ${date(lot.results.analysisDate)}` : `Arrived ${date(lot.arrivalDate)}`}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-accent group-hover:underline">
          See all results <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
        </span>
      </p>
    </Link>
  );
}
