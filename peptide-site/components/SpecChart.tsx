import type { Lot, Product } from "@/lib/data";
import { summarize } from "@/lib/data";
import { mg, pct } from "@/lib/format";
import { SPEC } from "@/site.config";

/**
 * Each tested vial plotted against the pass window, so the spread between vials
 * (and how far a failed lot missed by) is visible at a glance. The table below
 * the chart carries the same numbers as text.
 */
export function SpecChart({ lot, product }: { lot: Lot; product: Product }) {
  const s = summarize(lot, product);
  if (!s) return null;
  const pcts = s.checks.map((c) => c.contentPctOfClaim);
  const lo = Math.max(0, Math.min(80, Math.floor((Math.min(...pcts) - 8) / 10) * 10));
  const hi = Math.max(120, Math.ceil((Math.max(...pcts) + 8) / 10) * 10);
  const W = 440, L = 12, R = 12, top = 46, barH = 26;
  const x = (v: number) => L + ((v - lo) / (hi - lo)) * (W - L - R);
  const ticks = [lo, SPEC.netContentMinPct, 100, SPEC.netContentMaxPct, hi].filter((v, i, a) => a.indexOf(v) === i);
  const spread = ((s.contentMax - s.contentMin) / product.nominalMg) * 100;

  // Purity scale: zoomed to where the action is.
  const pLo = Math.min(SPEC.purityMinPct - 2, Math.floor(s.purityMin - 1));
  const px = (v: number) => L + ((v - pLo) / (100 - pLo)) * (W - L - R);

  const desc =
    `Net content: ` +
    s.checks.map((c) => `vial ${c.sample.id} ${mg(c.sample.netContentMg)} mg (${c.contentPctOfClaim.toFixed(0)}% of label)`).join(", ") +
    `. Pass window ${SPEC.netContentMinPct} to ${SPEC.netContentMaxPct}%. Purity: ` +
    s.checks.map((c) => `vial ${c.sample.id} ${pct(c.sample.purityPct)}%`).join(", ") +
    `. Pass at ${SPEC.purityMinPct}% or above.`;

  const dots = (vals: number[], ok: boolean[], scale: (v: number) => number, yMid: number) =>
    vals.map((v, i) => {
      // Nudge labels apart when two vials land close together.
      const near = vals.filter((o, j) => j < i && Math.abs(scale(o) - scale(v)) < 18).length;
      const cx = scale(v);
      const color = ok[i] ? "var(--color-pass)" : "var(--color-fail)";
      return (
        <g key={i}>
          <line x1={cx} x2={cx} y1={yMid - barH / 2 - 4 - near * 13} y2={yMid} stroke={color} strokeWidth="1.5" />
          <circle cx={cx} cy={yMid} r="7" fill={color} stroke="var(--color-paper)" strokeWidth="2.5" />
          <circle cx={cx} cy={yMid} r="12" fill={color} fillOpacity="0.18" />
          <text x={cx} y={yMid - barH / 2 - 8 - near * 13} textAnchor="middle" fontSize="13" fontWeight="700" fill={color} style={{ fontFamily: "var(--font-mono)" }}>
            {s.checks[i].sample.id}
          </text>
        </g>
      );
    });

  return (
    <figure className="rounded-xl border border-line bg-paper p-4 sm:p-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="label">Where each vial landed</span>
        <span className="num text-xs text-muted">
          Spread between vials: <strong className="text-ink">{spread.toFixed(1)}% of label</strong>
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${W} 210`} role="img" aria-label={desc} className="mt-2 w-full">
        {/* net content */}
        <text x={L} y="14" fontSize="12" fill="var(--color-muted)" style={{ fontFamily: "var(--font-mono)" }}>
          NET CONTENT, % OF LABEL
        </text>
        <rect x={L} y={top} width={W - L - R} height={barH} rx="6" fill="var(--color-fail-soft)" stroke="var(--color-line)" />
        <rect x={x(SPEC.netContentMinPct)} y={top} width={x(SPEC.netContentMaxPct) - x(SPEC.netContentMinPct)} height={barH} fill="var(--color-pass)" fillOpacity="0.22" stroke="var(--color-pass)" strokeOpacity="0.6" />
        <line x1={x(100)} x2={x(100)} y1={top - 3} y2={top + barH + 3} stroke="var(--color-ink)" strokeOpacity="0.5" strokeDasharray="3 3" />
        {ticks.map((t) => (
          <text key={t} x={x(t)} y={top + barH + 17} textAnchor={t === lo ? "start" : t === hi ? "end" : "middle"} fontSize="11" fill="var(--color-muted)" style={{ fontFamily: "var(--font-mono)" }}>
            {t}%
          </text>
        ))}
        {dots(pcts, s.checks.map((c) => c.contentOk), x, top + barH / 2)}

        {/* purity */}
        <text x={L} y="122" fontSize="12" fill="var(--color-muted)" style={{ fontFamily: "var(--font-mono)" }}>
          PURITY
        </text>
        <rect x={L} y="150" width={W - L - R} height={barH} rx="6" fill="var(--color-fail-soft)" stroke="var(--color-line)" />
        <rect x={px(SPEC.purityMinPct)} y="150" width={px(100) - px(SPEC.purityMinPct)} height={barH} fill="var(--color-pass)" fillOpacity="0.22" stroke="var(--color-pass)" strokeOpacity="0.6" />
        {[pLo, SPEC.purityMinPct, 100].map((t) => (
          <text key={t} x={px(t)} y={150 + barH + 17} textAnchor={t === pLo ? "start" : t === 100 ? "end" : "middle"} fontSize="11" fill="var(--color-muted)" style={{ fontFamily: "var(--font-mono)" }}>
            {t}%
          </text>
        ))}
        {dots(s.checks.map((c) => c.sample.purityPct), s.checks.map((c) => c.purityOk), px, 150 + barH / 2)}
      </svg>
      <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span><span aria-hidden="true" className="mr-1.5 inline-block h-2.5 w-4 rounded-sm border border-pass/60 bg-pass/20 align-middle" />Pass window</span>
        <span><span aria-hidden="true" className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-pass align-middle" />Vial passed</span>
        <span><span aria-hidden="true" className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-fail align-middle" />Vial failed</span>
      </p>
    </figure>
  );
}
