import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Logo } from "@/components/logo";
import { locales } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { buildNav } from "@/lib/nav";
import { isLocale } from "@/lib/routes";
import { site } from "@/lib/site";
import { cities } from "@/content/cities";
import { JsonLd, organizationLd, websiteLd } from "@/lib/seo";
import "../../globals.css";

const jakarta = localFont({
  src: "../../fonts/plus-jakarta-sans.woff2",
  weight: "200 800",
  variable: "--font-jakarta",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#f4f1ec",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(site.url),
    title: { default: "Webnova", template: "%s | Webnova" },
    applicationName: "Webnova",
    formatDetection: { telephone: false },
    other: { "geo.region": "CH-SO", "geo.placename": lang === "fr" ? "Granges" : "Grenchen" },
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  return (
    <html lang={lang === "de" ? "de-CH" : "fr-CH"} className={`${GeistSans.variable} ${GeistMono.variable} ${jakarta.variable}`}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={organizationLd(lang, cities.map((c) => c.content[lang].name))} />
        <JsonLd data={websiteLd(lang)} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:text-white focus:px-4 focus:py-2">
          {d.skip}
        </a>
        <Header nav={buildNav(lang)} logo={<Logo tone="dark" className="h-7 sm:h-8" />} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={lang} />
      </body>
    </html>
  );
}
