import Link from "next/link";
import { cities } from "@/content/cities";
import { legal } from "@/content/legal";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import { Icon } from "./icons";
import { Logo } from "./logo";

export function Footer({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const year = new Date().getFullYear();
  return (
    <footer className="relative isolate overflow-hidden bg-night text-white">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden="true" className="absolute -bottom-40 left-1/2 -z-10 h-[380px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
      <div className="container-x grid gap-12 py-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo className="h-9" />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">{d.footer.tagline}</p>
          <div className="mt-8 space-y-3 text-[15px]">
            <a href={site.phoneHref} className="flex items-center gap-3 text-white/80 transition-colors hover:text-accent">
              <Icon name="phone" className="h-4 w-4 text-accent" /> {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-white/80 transition-colors hover:text-accent">
              <Icon name="mail" className="h-4 w-4 text-accent" /> {site.email}
            </a>
            <p className="flex items-start gap-3 text-white/80">
              <Icon name="pin" className="mt-0.5 h-4 w-4 text-accent" />
              <span>
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city}
              </span>
            </p>
          </div>
        </div>
        <FooterCol title={d.footer.services} className="md:col-span-3">
          {services.map((s) => (
            <FooterLink key={s.key} href={href(locale, `service:${s.key}`)}>
              {s.content[locale].navLabel}
            </FooterLink>
          ))}
        </FooterCol>
        <FooterCol title={d.footer.regions} className="md:col-span-3">
          {cities.map((c) => (
            <FooterLink key={c.key} href={href(locale, `city:${c.key}`)}>
              {locale === "de" ? "Webdesign" : "Site internet"} {c.content[locale].name}
            </FooterLink>
          ))}
        </FooterCol>
        <FooterCol title={d.footer.company} className="md:col-span-2">
          <FooterLink href={href(locale, "about")}>{d.nav.about}</FooterLink>
          <FooterLink href={href(locale, "references")}>{d.nav.references}</FooterLink>
          <FooterLink href={href(locale, "guides")}>{d.nav.guides}</FooterLink>
          <FooterLink href={href(locale, "contact")}>{d.nav.contact}</FooterLink>
          <FooterLink href={href(locale, "request")}>{d.nav.cta}</FooterLink>
          <FooterLink href={href(locale, "regions")}>{d.nav.regions}</FooterLink>
          {Object.keys(legal).map((k) => (
            <FooterLink key={k} href={href(locale, `legal:${k}`)}>
              {legal[k as keyof typeof legal][locale].title}
            </FooterLink>
          ))}
        </FooterCol>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-6 text-[13px] text-white/50 sm:flex-row sm:items-center">
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

function FooterCol({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.12em] text-white/40">{title}</p>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[15px] text-white/65 transition-colors hover:text-accent">
        {children}
      </Link>
    </li>
  );
}
