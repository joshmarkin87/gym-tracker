# Open Door website

The website for a Canadian research peptide company built on one idea: **Don't trust us. Check.**

The site's main job is lot verification. Every lot the company receives gets a public page with three
individual vial results, their range, its status, and the lab's full report. Lots that fail stay on the
site for good.

> **Legal rules, built into the content:** products are for research use only. "For research use only. Not for
> human consumption." appears on every product page, in the cart and in the footer. The site makes no efficacy,
> dosing, usage or results claims, and claims no lab accreditation. Keep it that way when you edit copy.

Next.js (App Router), TypeScript and Tailwind CSS. There is no database. Pages are built from the JSON files in
`/content`.

---

## Run it locally

You need Node.js 20 or newer.

```bash
cd peptide-site
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build        # also checks every content file (see "The build is the safety check")
npm start
```

## Change the brand name

Everything lives in **`site.config.ts`**:

| Setting | Default | What it does |
|---|---|---|
| `BRAND_NAME` | `"Open Door"` | Header, footer, page titles, email templates |
| `BRAND_TAGLINE` | `"Don't trust us. Check."` | Under the logo, in titles and on the home page |
| `LAUNCH_MODE` | `"waitlist"` | See below |
| `SITE_URL` | `https://example.com` | Base of every QR code (`SITE_URL/lot/<code>`). **Set this before printing labels.** |
| `SUPPORT_EMAIL`, `RESPONSE_COMMITMENT`, `COUNTRY` | | Contact page, footer, emails |
| `SHIPPING` | ships from Canada; other lines hidden | Shipping facts on product pages. Fill in dispatch time, delivery estimate and free-shipping threshold when you have real ones; `null` hides a line. |
| `TOP_BAR` | three short lines | The slim bar across the top of every page |
| `SPEC` | 90–110 %, ≥ 98 % | Published pass thresholds. Every page and the build check read these. |

Edit the value, save, and rebuild. The logo is a small inline SVG in `components/Header.tsx` (plus `public/icon.svg`).

Colours, fonts and the shared visual styles (cards, status lights, the hero grid) are in `app/globals.css`. The
typefaces are Geist Sans and Geist Mono, bundled from the `geist` npm package, so nothing is fetched from a font
service at build time or in the browser.

## Flip LAUNCH_MODE (open the shop)

- `"waitlist"` (default): prices and results are shown. The buy button is replaced by **Join the waitlist for
  this lot**. Signups are saved with the product and the lot code.
- `"live"`: add to cart, the cart and the checkout stub are switched on.

Either change the default in `site.config.ts`, or set it at build time without editing code:

```bash
NEXT_PUBLIC_LAUNCH_MODE=live npm run build
```

A product with no lot marked `"For sale"` shows **In testing, not for sale** and can't be bought in either mode.

---

## Add a product

Create `content/products/<slug>.json`. The file name must match the `slug`.

```json
{
  "slug": "bpc-157-10mg",
  "name": "BPC-157",
  "nominalSize": "10 mg",
  "nominalMg": 10,
  "lotPrefix": "BPC",
  "form": "Lyophilized powder, single sealed vial",
  "storage": "Store sealed vials at -20 °C, protected from light. Keep dry.",
  "priceCad": 99
}
```

Product pages show only the name, nominal size, form, storage, lot information and test results. **Do not add a
description of what a compound does.** There's no field for one on purpose.

## Publish a lot result

A lot's whole life lives in one file: `content/lots/<LOT-CODE>.json`.

**1. When the shipment arrives**, add the lot as "In testing". It shows on The Record straight away.

```json
{
  "code": "RET-2026-002",
  "product": "retatrutide-10mg",
  "arrivalDate": "2026-12-01",
  "status": "In testing",
  "samplesPulled": 3,
  "retainVials": 2
}
```

**2. When the lab report comes back**, put the lab's PDF, unedited, at `public/reports/RET-2026-002.pdf`. Then add
`results` and change `status`:

```json
{
  "code": "RET-2026-002",
  "product": "retatrutide-10mg",
  "arrivalDate": "2026-12-01",
  "status": "For sale",
  "samplesPulled": 3,
  "retainVials": 2,
  "results": {
    "lab": "Name of the independent laboratory",
    "analysisDate": "2026-12-12",
    "publishedDate": "2026-12-13",
    "report": "/reports/RET-2026-002.pdf",
    "methods": "Identity by LC-MS. Net content and purity by HPLC-UV.",
    "verifyUrl": "https://lab.example.com/report/12345",
    "samples": [
      { "id": "A", "identity": "Detected", "netContentMg": 9.9, "purityPct": 99.0 },
      { "id": "B", "identity": "Detected", "netContentMg": 10.2, "purityPct": 99.3 },
      { "id": "C", "identity": "Detected", "netContentMg": 10.0, "purityPct": 99.1 }
    ]
  }
}
```

**3. If it fails**, use `"FAILED - Destroyed"` or `"FAILED - Returned"` and say what happened to the stock:

```json
  "status": "FAILED - Destroyed",
  "disposition": {
    "date": "2026-12-15",
    "note": "Net content was under half the label claim in all three vials. All stock was destroyed."
  }
```

**4. Later:** when the last vial sells, change `status` to `"Sold out"`. If a lot is ever recalled (for example
after a guarantee claim), add a `recall` and change the status away from `"For sale"`:

```json
  "recall": { "date": "2027-02-03", "note": "A customer's independent test found 7.1 mg. Recalled; all buyers refunded." }
```

Rules:

- Allowed statuses, spelled exactly: `In testing`, `For sale`, `Sold out`, `FAILED - Destroyed`, `FAILED - Returned`.
- Dates are `YYYY-MM-DD`. Lot codes look like `RET-2026-001` and must start with the product's `lotPrefix`.
- Always exactly 3 samples, never an average. `identity` is `"Detected"` or `"Not detected"`.
- `verifyUrl` is optional: a link to the same report on the lab's own website, if the lab offers one.
- **Never delete a lot file.** The Record promises that nothing is removed.

### The build is the safety check

`npm run build` reads every file and stops with a plain-English message if anything is wrong. For example, it stops
if a lot is marked `"For sale"` while any vial misses the published spec, if the report PDF is missing, if a failed
lot has no disposition, or if a sample count isn't 3. A mistake can't reach the live site.

### QR codes for vial labels

Each lot page shows its QR code. A print-ready file is at `/lot/<LOT-CODE>/qr.svg`. QR codes point to
`SITE_URL/lot/<LOT-CODE>`. Lowercase codes typed by hand are redirected to the right page.

### Demo content

The seeded files have `"demo": true`. While any file has that flag, a "Demo content" banner shows across the site.
The demo PDFs in `public/reports` are generated by `npm run demo-reports` and say DEMO on them. Delete the demo
files (and their PDFs) before launch.

---

## Where things are

```
site.config.ts            brand name, tagline, LAUNCH_MODE, SITE_URL, spec thresholds
content/products/*.json   one file per product
content/lots/*.json       one file per lot
public/reports/*.pdf      lab reports, unedited
lib/data.ts               loads and checks content; pass/fail logic
lib/email.ts              email templates (sending is stubbed)
lib/store.ts              where waitlist signups and contact messages are saved
app/                      pages: / shop products/[slug] lot/[code] verify record protocol guarantee faq about contact cart checkout
app/record.csv            The Record as a downloadable spreadsheet
proxy.ts                  /lot/ret-2026-001 → /lot/RET-2026-001
```

## Stubbed for later

- **Payments.** `/checkout` shows the order and a research-use acknowledgement, then stops. It takes no payment and places no
  order. Connect a payment provider in `components/CheckoutStub.tsx`.
- **Email sending.** `lib/email.ts` composes confirmation emails with the brand name and writes them to the server log.
  Replace `sendEmail` with your email provider.
- **Storage for waitlist and contact messages.** These are appended to `.data/waitlist.jsonl` and `.data/contact.jsonl`.
  That works on a server with a persistent disk. On serverless hosting (e.g. Vercel) the disk is temporary, so point
  `lib/store.ts` at a database or form service before launch.
- **About page** text is a marked placeholder.
- **Order-problem answers in the FAQ** (damaged or missing items replaced within 14 days, refunds, wrong address) are proposed policies. Have them reviewed.
- **Guarantee terms** (12-month claim window, 5-business-day decision) are proposed defaults. Have them reviewed.
- The data model supports one lab report per lot. Mystery re-buy and second-lab reports are described in the protocol.
  Showing them on lot pages is the natural next addition.
