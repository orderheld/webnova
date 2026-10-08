import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import "./globals.css";

const inter = localFont({ src: "./fonts/inter.woff2", weight: "300 700", variable: "--font-inter", display: "swap" });
const interTight = localFont({ src: "./fonts/inter-tight.woff2", weight: "300 700", variable: "--font-inter-tight", display: "swap" });

export const metadata: Metadata = {
  title: "Seite nicht gefunden | Webnova",
  robots: { index: false },
};

/** Branded 404 for any unmatched URL. The language is unknown here, so it speaks German and French. */
export default function GlobalNotFound() {
  const de = getDict("de");
  const fr = getDict("fr");
  const links = [
    { de: { label: de.common.home, href: href("de", "home") }, fr: { label: fr.common.home, href: href("fr", "home") } },
    { de: { label: de.nav.services, href: href("de", "services") }, fr: { label: fr.nav.services, href: href("fr", "services") } },
    { de: { label: de.nav.guides, href: href("de", "guides") }, fr: { label: fr.nav.guides, href: href("fr", "guides") } },
    { de: { label: de.nav.contact, href: href("de", "contact") }, fr: { label: fr.nav.contact, href: href("fr", "contact") } },
  ];
  return (
    <html lang="de-CH" className={`${inter.variable} ${interTight.variable}`}>
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-line">
          <div className="container-x flex h-[72px] items-center justify-between">
            <Link href="/de" aria-label="Webnova">
              <Logo tone="dark" className="h-7 sm:h-8" />
            </Link>
            <Link
              href={href("de", "request")}
              className="hidden rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-night sm:inline-flex"
            >
              {de.nav.cta}
            </Link>
          </div>
        </header>
        <main className="surface-tint flex-1">
          <div className="container-x py-20 md:py-28">
            <p className="eyebrow mb-6">404</p>
            <h1 className="display max-w-3xl text-[clamp(2.4rem,5.4vw,4.2rem)]">{de.pages.notFoundTitle}</h1>
            <p className="mt-3 font-display text-[clamp(1.4rem,2.6vw,2rem)] font-semibold tracking-[-0.02em] text-muted" lang="fr-CH">
              {fr.pages.notFoundTitle}
            </p>
            <div className="mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
              {(["de", "fr"] as const).map((l) => (
                <div key={l} lang={l === "de" ? "de-CH" : "fr-CH"} className="card p-7">
                  <p className="text-[15px] leading-relaxed text-ink-soft">{(l === "de" ? de : fr).pages.notFoundText}</p>
                  <ul className="mt-5 space-y-1">
                    {links.map((x) => (
                      <li key={x[l].href}>
                        <Link href={x[l].href} className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-bright-soft hover:text-accent">
                          {x[l].label}
                          <Icon name="arrow" className="h-4 w-4 text-bright transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={href(l, "request")}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-[15px] font-medium text-white transition-colors hover:bg-night"
                  >
                    {(l === "de" ? de : fr).nav.cta}
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
        <footer className="surface-night text-white">
          <div className="container-x flex flex-col gap-4 py-8 text-[14px] text-white/75 sm:flex-row sm:items-center sm:justify-between">
            <Logo className="h-7" />
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a href={site.phoneHref} className="hover:text-white">{site.phone}</a>
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
