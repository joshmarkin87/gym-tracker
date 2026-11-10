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
      className={`group flex h-full flex-col rounded-2xl border bg-card p-5 transition hover:shadow-md ${
        failed ? "border-fail/40" : "border-line hover:border-accent/50"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="lot-code text-sm font-semibold">{lot.code}</span>
        <StatusBadge status={lot.status} />
      </div>
      <p className="mt-3 text-lg font-semibold">
        {product.name} <span className="font-normal text-muted">{product.nominalSize}</span>
      </p>
      <p className={`num mt-1 ${failed ? "font-semibold text-fail" : ""}`}>{lotSummaryText(lot, product)}</p>
      <p className="mt-auto pt-4 text-sm text-muted">
        {lot.results ? `Tested ${date(lot.results.analysisDate)}` : `Arrived ${date(lot.arrivalDate)}`}
        <span className="float-right inline-flex items-center gap-1 font-semibold text-accent group-hover:underline">
          See all results <ArrowIcon />
        </span>
      </p>
    </Link>
  );
}
