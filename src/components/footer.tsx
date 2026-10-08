import Link from "next/link";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hoursLines } from "@/lib/hours";
import { buildFooter } from "@/lib/nav";
import { href } from "@/lib/routes";
import { showReferences, site } from "@/lib/site";
import { FooterIndex } from "./footer-index";
import { Icon } from "./icons";
import { Logo } from "./logo";

const ft = {
  de: {
    studio: "Webagentur · Schweiz",
    navigation: "Navigation",
    office: "Büro",
    index: "Verzeichnis",
    top: "Nach oben",
  },
  fr: {
    studio: "Agence web · Suisse",
    navigation: "Navigation",
    office: "Bureau",
    index: "Répertoire",
    top: "Haut de page",
  },
};

/** Footer: closing line, three main columns, the full link index (SEO) and a faint Webnova mark. */
export function Footer({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const t = ft[locale];
  const year = new Date().getFullYear();
  const columns = buildFooter(locale);
  const legalCol = columns[columns.length - 1];
  const indexCols = columns.slice(0, -1);
  const hours = hoursLines(locale);
  const mainLinks = [
    { label: d.nav.services, href: href(locale, "services") },
    { label: locale === "de" ? "Branchen" : "Secteurs", href: href(locale, "industries") },
    { label: d.nav.guides, href: href(locale, "guides") },
    { label: d.nav.regions, href: href(locale, "regions") },
    ...(showReferences ? [{ label: d.nav.references, href: href(locale, "references") }] : []),
    { label: d.nav.about, href: href(locale, "about") },
    { label: d.nav.contact, href: href(locale, "contact") },
  ];
  const colTitle = "mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50";
  const link = "text-white/80 transition-colors hover:text-white";
  return (
    <footer className="stage-night relative isolate overflow-hidden text-white">
      {/* Studio line and three main columns */}
      <div className="container-x grid gap-10 border-b border-white/10 pb-14 pt-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo className="h-8" />
          <p className="mt-4 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white/55">{t.studio}</p>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/70">{d.footer.tagline}</p>
          <Link
            href={href(locale, "request")}
            className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-accent transition-colors hover:bg-bright-soft"
          >
            {d.nav.cta}
            <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-10 sm:grid-cols-3 md:col-span-8">
          <div>
            <p className={colTitle}>{t.navigation}</p>
            <ul className="space-y-2.5 text-[15px]">
              {mainLinks.map((l, i) => (
                <li key={l.href}>
                  <Link href={l.href} className={`${link} inline-flex items-baseline gap-3`}>
                    <span className="text-[11.5px] tabular-nums text-accent-light/80">{String(i + 1).padStart(2, "0")}</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={colTitle}>{d.nav.contact}</p>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <a href={site.phoneHref} className={link}>
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className={link}>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className={`${link} break-all`}>
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className={link}>
                  Instagram
                </a>
              </li>
              <li>
                <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className={link}>
                  Facebook
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className={colTitle}>{t.office}</p>
            <address className="text-[15px] not-italic leading-relaxed text-white/80">
              {site.legalName}
              <br />
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </address>
            {hours.length > 0 && (
              <ul className="mt-4 space-y-1 text-[14px] text-white/60">
                {hours.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Full link index: every service, region, industry and guide */}
      <nav aria-label={locale === "de" ? "Fusszeile" : "Pied de page"} className="container-x py-14">
        <p className={colTitle}>{t.index}</p>
        <FooterIndex columns={indexCols} />
      </nav>

      {/* Bottom line */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-6 text-[13px] text-white/55 lg:flex-row lg:items-center">
          <p>
            © {year} {site.legalName} · {d.footer.rights}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalCol.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={locale === "de" ? "/fr" : "/de"} hrefLang={locale === "de" ? "fr" : "de"} className="uppercase hover:text-white">
                {locale === "de" ? "FR" : "DE"}
              </Link>
            </li>
            <li>
              <a href="#top" className="inline-flex items-center gap-1.5 hover:text-white">
                {t.top}
                <Icon name="arrow" className="h-3.5 w-3.5 -rotate-90" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Large faint wordmark mark as the closing graphic */}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-16 -z-10 h-[420px] w-[420px] opacity-[0.06] [background:url(/logo-mark.svg)_center/contain_no-repeat] [filter:brightness(0)_invert(1)]" />
      <div className="pb-24 lg:pb-8" />
    </footer>
  );
}
