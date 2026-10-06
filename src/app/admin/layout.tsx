import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Webnova Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="admin-theme min-h-screen bg-bg text-ink">{children}</body>
    </html>
  );
}
