import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const user = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (!user) return NextResponse.redirect(new URL("/admin/login", request.url));
    return NextResponse.next();
  }

  if (pathname === "/" || !/^\/(de|fr)(\/|$)/.test(pathname)) {
    const accept = request.headers.get("accept-language") ?? "";
    const lang = /^\s*fr/i.test(accept) ? "fr" : "de";
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${lang}` : `/de${pathname}`;
    return NextResponse.redirect(url, pathname === "/" ? 307 : 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|sitemap.xml|robots.txt|manifest.webmanifest|og/|icons/|logo.png|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml|pdf|webmanifest|woff2?)$).*)",
  ],
};
