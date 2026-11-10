import { NextResponse, type NextRequest } from "next/server";

/** Lot codes typed by hand arrive in any case: /lot/ret-2026-001 -> /lot/RET-2026-001 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const upper = pathname.replace(/^\/lot\/([^/]+)/, (_m, code: string) => `/lot/${decodeURIComponent(code).trim().toUpperCase()}`);
  if (upper !== pathname) {
    const url = req.nextUrl.clone();
    url.pathname = upper;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: "/lot/:path*" };
