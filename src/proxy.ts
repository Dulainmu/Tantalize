import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Tantalize '25 has wrapped — After Hours (the lead-up to Tantalize 2026)
// is the live, ongoing thing right now. Send everything else there.
const ALLOWED_PREFIXES = ["/after-hours", "/api/after-hours"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAllowed =
    ALLOWED_PREFIXES.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    /\.[a-zA-Z0-9]+$/.test(pathname); // static assets (images, fonts, favicon, etc.)

  if (isAllowed) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/after-hours", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
