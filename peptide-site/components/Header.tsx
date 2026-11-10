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
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-9 w-9 shrink-0 drop-shadow-[0_0_14px_rgb(46_230_208/0.55)]">
        <defs>
          <linearGradient id="logo-tile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5ff5e2" />
            <stop offset="1" stopColor="#12b5a3" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8.5" fill="url(#logo-tile)" />
        <rect x="9.75" y="6.75" width="12.5" height="18.5" rx="1.5" fill="none" stroke="#03201d" strokeOpacity="0.5" strokeWidth="1.5" />
        <path d="M10.5 7.5 18 10v15l-7.5-1.2z" fill="#03201d" />
        <circle cx="15.6" cy="17" r="1" fill="#5ff5e2" />
      </svg>
      <span className="leading-none">
        <span className="block text-[1.0625rem] font-semibold tracking-tight">{BRAND_NAME}</span>
        <span className="mt-1 hidden font-mono text-[0.6875rem] tracking-[0.04em] text-muted sm:block">{BRAND_TAGLINE}</span>
      </span>
    </Link>
  );
}

export function Header() {
  const live = LAUNCH_MODE === "live";
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="rounded-full px-3 py-2 font-medium text-ink transition-colors hover:bg-accent-soft hover:text-accent-dark">
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
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-ink/10 bg-card/70 px-3.5 py-2 text-sm font-medium shadow-[0_1px_2px_rgb(18_27_36/0.05)] [&::-webkit-details-marker]:hidden">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              </svg>
              Menu
            </summary>
            <nav aria-label="Main" className="absolute right-0 mt-2 w-64 rounded-2xl border border-ink/10 bg-card p-2 shadow-[0_24px_48px_-16px_rgb(18_27_36/0.28)]">
              <ul>
                {[...NAV, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }].map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="block rounded-lg px-3 py-2.5 font-medium hover:bg-accent-soft">
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
