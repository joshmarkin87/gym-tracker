import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE, COUNTRY, RUO_NOTICE, SUPPORT_EMAIL } from "@/site.config";

const cols = [
  {
    title: "Verify",
    links: [
      { href: "/verify", label: "Verify a lot" },
      { href: "/record", label: "The Record" },
      { href: "/protocol", label: "Our Protocol" },
      { href: "/guarantee", label: "The Guarantee" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/shop", label: "Shop" },
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-card">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="rounded-lg border border-line bg-paper px-4 py-3 text-center font-semibold">{RUO_NOTICE}</p>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-semibold">{BRAND_NAME}</p>
            <p className="text-muted">{BRAND_TAGLINE}</p>
            <p className="mt-3 text-sm text-muted">
              Based in {COUNTRY}.
              <br />
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent underline underline-offset-2">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">{c.title}</p>
              <ul className="space-y-1.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-accent hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-10 text-xs leading-relaxed text-muted">
          All products are sold to qualified buyers strictly as laboratory research materials. They are not drugs, food,
          cosmetics or supplements, and are not intended to diagnose, treat, cure or prevent any condition. Nothing on
          this site is advice about using any product in a person or animal. Testing is performed by an independent
          third-party laboratory. © {new Date().getFullYear()} {BRAND_NAME}.
        </p>
      </div>
    </footer>
  );
}
