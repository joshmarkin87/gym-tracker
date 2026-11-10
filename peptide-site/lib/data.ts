/**
 * Reads products and lots from /content at build time and checks every file.
 * A malformed file, or a lot marked "For sale" whose results miss the published
 * specification, stops the build with a plain-language error, so a mistake can
 * never reach the live site.
 */
import fs from "node:fs";
import path from "node:path";
import { RETAINS_PER_LOT, SAMPLES_PER_LOT, SPEC } from "@/site.config";

export const LOT_STATUSES = [
  "In testing",
  "For sale",
  "Sold out",
  "FAILED - Destroyed",
  "FAILED - Returned",
] as const;
export type LotStatus = (typeof LOT_STATUSES)[number];

export type Product = {
  demo?: boolean;
  slug: string;
  name: string;
  nominalSize: string;
  nominalMg: number;
  lotPrefix: string;
  form: string;
  storage: string;
  priceCad: number;
};

export type Sample = {
  id: string;
  identity: "Detected" | "Not detected";
  netContentMg: number;
  purityPct: number;
};

export type Results = {
  lab: string;
  analysisDate: string;
  publishedDate?: string;
  report: string;
  methods?: string;
  /** Optional link to this report on the laboratory's own website, so it can be checked at the source. */
  verifyUrl?: string;
  samples: Sample[];
};

export type Lot = {
  demo?: boolean;
  code: string;
  product: string;
  arrivalDate: string;
  status: LotStatus;
  samplesPulled: number;
  retainVials: number;
  results?: Results;
  disposition?: { date: string; note: string };
  /** Set if a lot is recalled after sale (for example, after a guarantee claim). Shown on the lot page and The Record. */
  recall?: { date: string; note: string };
  notes?: string;
};

export type SampleCheck = {
  sample: Sample;
  identityOk: boolean;
  contentOk: boolean;
  purityOk: boolean;
  pass: boolean;
  contentPctOfClaim: number;
};

export type LotSummary = {
  checks: SampleCheck[];
  contentMin: number;
  contentMax: number;
  purityMin: number;
  purityMax: number;
  meetsSpec: boolean;
};

const ROOT = process.cwd();
const PRODUCTS_DIR = path.join(ROOT, "content", "products");
const LOTS_DIR = path.join(ROOT, "content", "lots");
const PUBLIC_DIR = path.join(ROOT, "public");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function fail(file: string, msg: string): never {
  throw new Error(`\n\nContent error in ${path.relative(ROOT, file)}:\n  ${msg}\n`);
}

function readJsonDir<T>(dir: string): { file: string; data: T }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => {
      const file = path.join(dir, f);
      try {
        return { file, data: JSON.parse(fs.readFileSync(file, "utf8")) as T };
      } catch (e) {
        fail(file, `This is not valid JSON (${(e as Error).message}). Check for a missing comma or quote.`);
      }
    });
}

function req(file: string, obj: Record<string, unknown>, key: string, type: "string" | "number") {
  if (typeof obj[key] !== type || (type === "string" && !(obj[key] as string).trim())) {
    fail(file, `"${key}" is missing or is not a ${type}.`);
  }
}

function checkDate(file: string, value: unknown, key: string) {
  if (typeof value !== "string" || !DATE_RE.test(value) || isNaN(Date.parse(value))) {
    fail(file, `"${key}" must be a date written as YYYY-MM-DD, for example "2026-10-27".`);
  }
}

export function summarize(lot: Lot, product: Product): LotSummary | null {
  if (!lot.results) return null;
  const checks = lot.results.samples.map((sample) => {
    const contentPctOfClaim = (sample.netContentMg / product.nominalMg) * 100;
    const identityOk = sample.identity === "Detected";
    const contentOk =
      contentPctOfClaim >= SPEC.netContentMinPct - 1e-9 && contentPctOfClaim <= SPEC.netContentMaxPct + 1e-9;
    const purityOk = sample.purityPct >= SPEC.purityMinPct;
    return { sample, identityOk, contentOk, purityOk, pass: identityOk && contentOk && purityOk, contentPctOfClaim };
  });
  const contents = lot.results.samples.map((s) => s.netContentMg);
  const purities = lot.results.samples.map((s) => s.purityPct);
  return {
    checks,
    contentMin: Math.min(...contents),
    contentMax: Math.max(...contents),
    purityMin: Math.min(...purities),
    purityMax: Math.max(...purities),
    meetsSpec: checks.every((c) => c.pass),
  };
}

let cache: { products: Product[]; lots: Lot[] } | null = null;

function load() {
  if (cache) return cache;

  const products = readJsonDir<Product>(PRODUCTS_DIR).map(({ file, data }) => {
    const o = data as unknown as Record<string, unknown>;
    for (const k of ["slug", "name", "nominalSize", "lotPrefix", "form", "storage"]) req(file, o, k, "string");
    for (const k of ["nominalMg", "priceCad"]) req(file, o, k, "number");
    if (!/^[a-z0-9-]+$/.test(data.slug)) fail(file, `"slug" may only use lowercase letters, numbers and dashes.`);
    if (path.basename(file, ".json") !== data.slug) fail(file, `The file name must match the slug: ${data.slug}.json`);
    return data;
  });
  const slugs = new Set(products.map((p) => p.slug));

  const lots = readJsonDir<Lot>(LOTS_DIR).map(({ file, data }) => {
    const o = data as unknown as Record<string, unknown>;
    for (const k of ["code", "product", "status"]) req(file, o, k, "string");
    for (const k of ["samplesPulled", "retainVials"]) req(file, o, k, "number");
    checkDate(file, data.arrivalDate, "arrivalDate");
    if (!/^[A-Z0-9]+-\d{4}-\d{3}$/.test(data.code)) fail(file, `"code" must look like RET-2026-001.`);
    if (path.basename(file, ".json") !== data.code) fail(file, `The file name must match the lot code: ${data.code}.json`);
    if (!slugs.has(data.product)) fail(file, `"product" is "${data.product}" but there is no content/products/${data.product}.json`);
    if (!LOT_STATUSES.includes(data.status)) {
      fail(file, `"status" must be exactly one of: ${LOT_STATUSES.map((s) => `"${s}"`).join(", ")}`);
    }
    if (data.samplesPulled !== SAMPLES_PER_LOT) fail(file, `"samplesPulled" must be ${SAMPLES_PER_LOT}. That is the protocol.`);
    if (data.retainVials !== RETAINS_PER_LOT) fail(file, `"retainVials" must be ${RETAINS_PER_LOT}. That is the protocol.`);

    if (data.status !== "In testing") {
      if (!data.results) fail(file, `A lot with status "${data.status}" must have "results". Only "In testing" lots may leave them out.`);
    }
    if (data.results) {
      const r = data.results as unknown as Record<string, unknown>;
      for (const k of ["lab", "report"]) req(file, r, k, "string");
      checkDate(file, r.analysisDate, "results.analysisDate");
      if (r.publishedDate !== undefined) checkDate(file, r.publishedDate, "results.publishedDate");
      if (!data.results.report.startsWith("/reports/")) fail(file, `"results.report" must start with /reports/`);
      if (!fs.existsSync(path.join(PUBLIC_DIR, data.results.report))) {
        fail(file, `The report file public${data.results.report} does not exist. Add the PDF before publishing.`);
      }
      if (!Array.isArray(data.results.samples) || data.results.samples.length !== SAMPLES_PER_LOT) {
        fail(file, `"results.samples" must list exactly ${SAMPLES_PER_LOT} individual samples. Never a pooled average.`);
      }
      data.results.samples.forEach((s, i) => {
        const so = s as unknown as Record<string, unknown>;
        req(file, so, "id", "string");
        req(file, so, "netContentMg", "number");
        req(file, so, "purityPct", "number");
        if (s.identity !== "Detected" && s.identity !== "Not detected") {
          fail(file, `Sample ${i + 1}: "identity" must be "Detected" or "Not detected".`);
        }
      });
    }
    if (data.status.startsWith("FAILED") && !data.disposition) {
      fail(file, `A failed lot must have a "disposition" with a date and a note saying what happened to the stock.`);
    }
    if (data.disposition) checkDate(file, data.disposition.date, "disposition.date");
    if (data.recall) {
      checkDate(file, data.recall.date, "recall.date");
      if (data.status === "For sale") fail(file, `A recalled lot cannot be "For sale". Change its status.`);
    }

    // The rule that matters: nothing goes on sale unless every sample meets the published spec.
    const product = products.find((p) => p.slug === data.product)!;
    if (data.status === "For sale" || data.status === "Sold out") {
      const s = summarize(data, product)!;
      if (!s.meetsSpec) {
        fail(
          file,
          `This lot is marked "${data.status}" but at least one sample misses the published specification ` +
            `(identity confirmed, net content ${SPEC.netContentMinPct}-${SPEC.netContentMaxPct}% of claim, purity at or above ${SPEC.purityMinPct}%). ` +
            `It cannot be sold. Mark it "FAILED - Destroyed" or "FAILED - Returned" and add a disposition.`,
        );
      }
    }
    if (!data.code.startsWith(product.lotPrefix + "-")) {
      fail(file, `Lot codes for ${product.name} must start with ${product.lotPrefix}-`);
    }
    return data;
  });

  const seen = new Set<string>();
  for (const l of lots) {
    if (seen.has(l.code)) throw new Error(`Duplicate lot code ${l.code}`);
    seen.add(l.code);
  }

  cache = { products, lots };
  return cache;
}

/** Newest first: by arrival date, then by lot code. */
function byNewest(a: Lot, b: Lot) {
  return b.arrivalDate.localeCompare(a.arrivalDate) || b.code.localeCompare(a.code);
}

export function getProducts(): Product[] {
  return [...load().products].sort((a, b) => a.name.localeCompare(b.name));
}

export function getProduct(slug: string): Product | undefined {
  return load().products.find((p) => p.slug === slug);
}

export function getLots(): Lot[] {
  return [...load().lots].sort(byNewest);
}

export function normalizeLotCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "").replace(/[–—_]/g, "-");
}

export function getLot(code: string): Lot | undefined {
  const c = normalizeLotCode(decodeURIComponent(code));
  return load().lots.find((l) => l.code === c);
}

export function getLotsForProduct(slug: string): Lot[] {
  return getLots().filter((l) => l.product === slug);
}

/** The lot a customer would receive today: the newest lot that is For sale. */
export function getCurrentLot(slug: string): Lot | undefined {
  return getLotsForProduct(slug).find((l) => l.status === "For sale");
}

/** Lots with published results, newest result first. */
export function getRecentResults(n: number): Lot[] {
  return getLots()
    .filter((l) => l.results)
    .sort(
      (a, b) =>
        (b.results!.publishedDate ?? b.results!.analysisDate).localeCompare(
          a.results!.publishedDate ?? a.results!.analysisDate,
        ) || byNewest(a, b),
    )
    .slice(0, n);
}

export function isFailed(lot: Lot) {
  return lot.status.startsWith("FAILED");
}

export function hasDemoContent() {
  const { products, lots } = load();
  return products.some((p) => p.demo) || lots.some((l) => l.demo);
}

export function lotCounts() {
  const lots = getLots();
  return {
    total: lots.length,
    tested: lots.filter((l) => l.results).length,
    failed: lots.filter(isFailed).length,
  };
}
