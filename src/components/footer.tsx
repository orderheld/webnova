import Link from "next/link";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hoursLines } from "@/lib/hours";
import { buildFooter } from "@/lib/nav";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import { Icon } from "./icons";
import { Logo } from "./logo";

/** Large footer: contact block on top, then every service, region, industry, guide and legal page. */
export function Footer({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const year = new Date().getFullYear();
  const columns = buildFooter(locale);
  const hours = hoursLines(locale);
  return (
    <footer className="surface-night relative isolate overflow-hidden text-white">
      <div className="container-x grid gap-10 border-b border-white/10 pb-12 pt-20 md:grid-cols-12 md:items-start">
        <div className="md:col-span-5">
          <Logo className="h-8" />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/70">{d.footer.tagline}</p>
          <Link
            href={href(locale, "request")}
            className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-accent transition-colors hover:bg-bright-soft"
          >
            {d.nav.cta}
            <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-3 md:col-span-7">
          <div>
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">{d.nav.contact}</p>
            <div className="space-y-3 text-[15px]">
              <a href={site.phoneHref} className="flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                <Icon name="phone" className="h-4 w-4 text-accent-light" /> {site.phone}
              </a>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                <Icon name="chat" className="h-4 w-4 text-accent-light" /> WhatsApp
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                <Icon name="mail" className="h-4 w-4 text-accent-light" /> {site.email}
              </a>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">{d.pages.office}</p>
            <address className="flex items-start gap-3 text-[15px] not-italic leading-relaxed text-white/80">
              <Icon name="pin" className="mt-1 h-4 w-4 shrink-0 text-accent-light" />
              <span>
                {site.legalName}
                <br />
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city}
              </span>
            </address>
          </div>
          {hours.length > 0 && (
            <div>
              <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">{d.pages.hours}</p>
              <ul className="space-y-1.5 text-[15px] text-white/80">
                {hours.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <nav aria-label={locale === "de" ? "Fusszeile" : "Pied de page"} className="container-x grid gap-x-8 gap-y-10 py-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {columns.map((c) => (
          <div key={c.title}>
            <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">{c.title}</p>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14.5px] leading-snug text-white/75 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-6 pb-24 text-[13px] text-white/60 sm:flex-row sm:items-center lg:pb-6">
          <p>
            © {year} {site.legalName}. {d.footer.rights}
          </p>
          <div className="flex gap-5">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
            <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a>
            <Link href={locale === "de" ? "/fr" : "/de"} className="uppercase hover:text-white">
              {locale === "de" ? "FR" : "DE"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
