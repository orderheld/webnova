import type { NavData } from "@/components/header";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href, routes } from "./routes";
import { site } from "./site";

export function buildNav(locale: Locale): NavData {
  const d = getDict(locale);
  const switchMap: Record<string, string> = {};
  for (const r of routes) {
    const de = r.paths.de ? `/de/${r.paths.de}` : "/de";
    const fr = r.paths.fr ? `/fr/${r.paths.fr}` : "/fr";
    switchMap[de] = fr;
    switchMap[fr] = de;
  }
  return {
    locale,
    home: href(locale, "home"),
    servicesLabel: d.nav.services,
    servicesHref: href(locale, "services"),
    allServicesLabel: d.nav.allServices,
    services: services
      .filter((s) => s.key !== "kassensystem-gastro" && s.key !== "kassensystem-retail")
      .map((s) => ({ label: s.content[locale].navLabel, href: href(locale, `service:${s.key}`), icon: s.icon })),
    links: [
      { label: d.nav.references, href: href(locale, "references") },
      { label: d.nav.regions, href: href(locale, "regions") },
      { label: d.nav.guides, href: href(locale, "guides") },
      { label: d.nav.about, href: href(locale, "about") },
      { label: d.nav.contact, href: href(locale, "contact") },
    ],
    cta: { label: d.nav.cta, href: href(locale, "request") },
    menuLabel: d.nav.menu,
    closeLabel: d.nav.close,
    phone: { label: site.phone, href: site.phoneHref },
    switchMap,
  };
}
