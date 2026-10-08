import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit reads its font metrics from disk at runtime, so it must not be bundled.
  serverExternalPackages: ["pdfkit", "swissqrbill"],
  outputFileTracingIncludes: {
    "/admin/**": ["./node_modules/pdfkit/js/data/**", "./src/lib/admin/logo-print.png"],
    "/api/**": ["./node_modules/pdfkit/js/data/**", "./src/lib/admin/logo-print.png"],
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
    ];
    return [
      // One canonical host: www.webnova.ch -> https://webnova.ch (301)
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "www.webnova.ch" }],
        destination: "https://webnova.ch/:path*",
        statusCode: 301 as const,
      },
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
        ],
      },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
