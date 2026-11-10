/**
 * Site-wide settings. Change a value here and it changes everywhere:
 * header, footer, page titles, email templates, QR codes.
 */

/** The company name. Not final, so it lives in exactly one place. */
export const BRAND_NAME = "Open Door";

/** The positioning line shown under the name and in page titles. */
export const BRAND_TAGLINE = "Don't trust us. Check.";

/**
 * "waitlist" (default): prices and results are visible, but every buy button is
 *   replaced by "Join the waitlist for this lot". No cart, no checkout.
 * "live": add-to-cart, the cart page and the checkout stub are switched on.
 *
 * Can be overridden at build time with NEXT_PUBLIC_LAUNCH_MODE=live.
 */
export const LAUNCH_MODE: "waitlist" | "live" =
  process.env.NEXT_PUBLIC_LAUNCH_MODE === "live" ? "live" : "waitlist";

/**
 * The public address of the site, with no trailing slash. QR codes printed on
 * vial labels point at `${SITE_URL}/lot/<lotcode>`, so set this before printing
 * labels. Can be overridden with NEXT_PUBLIC_SITE_URL.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");

/** Customer service. */
export const SUPPORT_EMAIL = "help@example.com";
export const RESPONSE_COMMITMENT = "Every message gets a reply from a person within one business day.";
export const COUNTRY = "Canada";
export const CURRENCY = "CAD";

/** The fixed research-use line. Shown on every product page, in the cart and in the footer. */
export const RUO_NOTICE = "For research use only. Not for human consumption.";

/**
 * Published pass thresholds. Every sample in a lot must meet all three for the
 * lot to go on sale. The site checks lot files against these at build time.
 */
export const SPEC = {
  netContentMinPct: 90,
  netContentMaxPct: 110,
  purityMinPct: 98,
} as const;

/** Every lot: this many vials pulled for testing, this many sealed retains kept. */
export const SAMPLES_PER_LOT = 3;
export const RETAINS_PER_LOT = 2;
