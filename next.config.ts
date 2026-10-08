import type { NextConfig } from "next";
import { referencesOnRequest, showReferences } from "./src/lib/site";

/*
 * Content Security Policy for the pages (site and admin): scripts, styles, images, fonts and requests
 * only from webnova.ch itself, no plugins, no foreign forms, no framing by other sites.
 * Static pages carry Next's inline RSC scripts, and nonces would make every page dynamic, so scripts
 * keep 'unsafe-inline' (the approach the Next CSP guide gives for sites without nonces).
 * React needs eval only in development.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // pdfkit reads its font metrics from disk at runtime, so it must not be bundled. The PDFs also read the logo and the Inter font files from disk.
  serverExternalPackages: ["pdfkit", "swissqrbill"],
  outputFileTracingIncludes: {
    "/admin/**": ["./node_modules/pdfkit/js/data/**", "./src/lib/admin/logo-print.png", "./src/lib/admin/fonts/**"],
    "/api/**": ["./node_modules/pdfkit/js/data/**", "./src/lib/admin/logo-print.png", "./src/lib/admin/fonts/**"],
  },
  poweredByHeader: false,
  // Branded 404 for unmatched URLs (src/app/global-not-found.tsx); the app has several root layouts.
  experimental: { globalNotFound: true },
  async redirects() {
    // Old WordPress URLs -> new structure (keeps existing Google rankings)
    const map: [string, string][] = [
      ["/ueber-uns", "/de/ueber-uns"],
      ["/kontakt", "/de/kontakt"],
      ["/offerte", "/de/anfrage"],
      ["/webdesign-entwicklung", "/de/webdesign"],
      ["/e-commerce-loesungen", "/de/onlineshop-erstellen"],
      ["/branding-grafikdesign", "/de/branding-grafikdesign"],
      ["/online-marketing", "/de/online-marketing"],
      ["/partner-freelancer", "/de/ueber-uns"],
      ["/impressum", "/de/impressum"],
      ["/datenschutzerklaerung", "/de/datenschutz"],
      // Reference renamed to its real domain dersut.ch (2026-10-08)
      ["/de/referenzen/dersut-kaffee", "/de/referenzen/dersut"],
      ["/fr/references/dersut-kaffee", "/fr/references/dersut"],
      // Favicon file renamed when the PNG favicon was added (2026-10-08)
      ["/icon.svg", "/icon2.svg"],
    ];
    return [
      // One canonical host: www.webnova.ch -> https://webnova.ch (301)
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "www.webnova.ch" }],
        destination: "https://webnova.ch/:path*",
        statusCode: 301 as const,
      },
      // References on request (src/lib/site.ts): the project pages lead to the overview for now (307).
      // Listed before the old-URL map, so the old Dersut address does not take two hops.
      ...(showReferences && referencesOnRequest
        ? [
            { source: "/de/referenzen/:key", destination: "/de/referenzen", permanent: false },
            { source: "/fr/references/:key", destination: "/fr/references", permanent: false },
          ]
        : []),
      ...map.map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      // Pages only: API responses (PDFs, CSV exports, the page-view beacon) are not documents that run scripts.
      ...["/de/:path*", "/fr/:path*", "/admin/:path*"].map((source) => ({
        source,
        headers: [{ key: "Content-Security-Policy", value: contentSecurityPolicy }],
      })),
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
