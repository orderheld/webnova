import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

// Same local Inter fonts as the public site. Geist was used here before, but Turbopack merged its
// font CSS into the shared globals chunk, so every public page preloaded 140 KB of unused Geist.
const inter = localFont({
  src: "../fonts/inter.woff2",
  weight: "300 700",
  variable: "--font-inter",
  display: "swap",
});

const interTight = localFont({
  src: "../fonts/inter-tight.woff2",
  weight: "300 700",
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Webnova Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH" className={`${inter.variable} ${interTight.variable}`}>
      <body className="admin-theme min-h-screen bg-bg text-ink">{children}</body>
    </html>
  );
}
