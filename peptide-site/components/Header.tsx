import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE, LAUNCH_MODE } from "@/site.config";
import { CartCount } from "./cart";

export const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/verify", label: "Verify a lot" },
  { href: "/record", label: "The Record" },
  { href: "/protocol", label: "Our Protocol" },
  { href: "/guarantee", label: "Guarantee" },
  { href: "/faq", label: "FAQ" },
];

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${BRAND_NAME}, home`}>
      {/* A door, slightly open. */}
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8 shrink-0">
        <rect x="5" y="3" width="22" height="26" rx="3" fill="#e6f2f0" stroke="#0e6b63" strokeWidth="2" />
        <path d="M9 6.5 19 9v18.5L9 25z" fill="#0e6b63" />
        <circle cx="16.5" cy="17" r="1.2" fill="#fff" />
      </svg>
      <span className="leading-tight">
        <span className="block text-lg font-semibold tracking-tight">{BRAND_NAME}</span>
        <span className="hidden text-xs text-muted sm:block">{BRAND_TAGLINE}</span>
      </span>
    </Link>
  );
}

export function Header() {
  const live = LAUNCH_MODE === "live";
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[0.95rem]">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="rounded-md px-3 py-2 font-medium text-ink hover:bg-accent-soft hover:text-accent-dark">
                  {n.label}
                </Link>
              </li>
            ))}
            {live && (
              <li>
                <Link href="/cart" className="rounded-md px-3 py-2 font-medium hover:bg-accent-soft">
                  <CartCount />
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          {live && (
            <Link href="/cart" className="rounded-md px-3 py-2 font-medium hover:bg-accent-soft">
              <CartCount />
            </Link>
          )}
          {/* No-JS mobile menu: <details> is keyboard and screen-reader friendly out of the box. */}
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md border border-line px-3 py-2 font-medium [&::-webkit-details-marker]:hidden">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
              Menu
            </summary>
            <nav aria-label="Main" className="absolute right-0 mt-2 w-64 rounded-xl border border-line bg-card p-2 shadow-lg">
              <ul>
                {[...NAV, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }].map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="block rounded-md px-3 py-2.5 font-medium hover:bg-accent-soft">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
