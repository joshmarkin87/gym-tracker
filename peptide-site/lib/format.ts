import { CURRENCY } from "@/site.config";

/** 9.8 -> "9.8", 10 -> "10.0", 2.15 -> "2.15". Never hides precision the lab reported. */
export function mg(n: number): string {
  const s = n.toString();
  return s.includes(".") ? s : n.toFixed(1);
}

export function pct(n: number): string {
  const s = n.toString();
  return s.includes(".") ? s : n.toFixed(1);
}

export function range(min: number, max: number, f: (n: number) => string): string {
  return min === max ? f(min) : `${f(min)}–${f(max)}`;
}

export function date(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function price(n: number): string {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: CURRENCY }).format(n) + ` ${CURRENCY}`;
}
