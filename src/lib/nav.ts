import type { NavData, NavGroup, NavItem } from "@/components/header";
import { cities } from "@/content/cities";
import { guides } from "@/content/guides";
import { industries } from "@/content/industries";
import { industryUi } from "@/content/industries/ui";
import { legal } from "@/content/legal";
import { problems } from "@/content/problems";
import { services } from "@/content/services";
import type { Locale, Localized } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hasRoute, href, routes } from "./routes";
import { showReferences, site } from "./site";

/*
 * Navigation data, shared by header, footer and the services grids.
 * Groups list route ids; ids that do not exist (yet) are skipped, so pages added later
 * (e.g. service:local-seo or page:website-check) appear in menus and footer automatically.
 */

export const serviceGroupIds: { key: string; label: Localized<string>; ids: string[] }[] = [
  {
    key: "website",
    label: { de: "Webseiten", fr: "Sites internet" },
    ids: ["service:webdesign", "service:website-kmu", "service:firmenwebsite", "service:website-redesign", "service:wartung", "service:branding"],
  },
  {
    key: "visibility",
    label: { de: "Sichtbarkeit & Marketing", fr: "Visibilité & marketing" },
    ids: ["service:seo", "service:local-seo", "service:ki-sichtbarkeit", "service:online-marketing", "page:website-check"],
  },
  {
    key: "commerce",
    label: { de: "Kasse & Shop", fr: "Caisse & boutique" },
    ids: ["service:onlineshop", "service:kassensystem", "service:kassensystem-gastro", "service:kassensystem-retail"],
  },
];

/**
 * Pages kept for Google (own search terms) but not offered as separate services in menus and grids,
 * because for visitors they repeat "Webdesign" (Ferhat, 2026-10-08). The footer index and the
 * sitemap still list them; on their own page they stay visible in the grids.
 */
const secondaryServiceIds = new Set(["service:website-kmu", "service:firmenwebsite"]);

/** Labels and icons for pages that are not services (tools by other branches). */
const pageLabels: Record<string, { icon: string; label: Localized<string>; text: Localized<string> }> = {
  "page:website-check": {
    icon: "search",
    label: { de: "Kostenloser Website-Check", fr: "Analyse de site gratuite" },
    text: { de: "Wir prüfen Ihre Webseite und zeigen, wo sie Anfragen verliert.", fr: "Nous analysons votre site et montrons où il perd des demandes." },
  },
  "page:impressum-generator": {
    icon: "file",
    label: { de: "Impressum-Generator", fr: "Générateur de mentions légales" },
    text: { de: "Ein Impressum für Ihre Schweizer Webseite in wenigen Minuten.", fr: "Des mentions légales pour votre site suisse en quelques minutes." },
  },
};

/** Menu entry for a route id, or undefined when that route does not exist. */
export function navItem(locale: Locale, id: string): NavItem | undefined {
  if (!hasRoute(id)) return undefined;
  if (id.startsWith("service:")) {
    const s = services.find((x) => `service:${x.key}` === id);
    if (!s) return undefined;
    return { label: s.content[locale].navLabel, href: href(locale, id), icon: s.icon, text: s.content[locale].lead };
  }
  const p = pageLabels[id];
  if (!p) return undefined;
  return { label: p.label[locale], href: href(locale, id), icon: p.icon, text: p.text[locale] };
}

function items(locale: Locale, ids: string[]): NavItem[] {
  return ids.map((id) => navItem(locale, id)).filter((x) => x !== undefined);
}

/** Service groups as in the mega menu. `current` (an href) keeps a secondary page visible on itself. */
export function serviceGroups(locale: Locale, current?: string): NavGroup[] {
  return serviceGroupIds
    .map((g) => ({
      key: g.key,
      label: g.label[locale],
      items: items(
        locale,
        g.ids.filter((id) => !secondaryServiceIds.has(id) || (hasRoute(id) && href(locale, id) === current)),
      ),
    }))
    .filter((g) => g.items.length > 0);
}

const resourceText: Localized<{ label: string; guides: string; tools: string; agency: string; allGuides: string }> = {
  de: { label: "Ratgeber", guides: "Ratgeber für KMU", tools: "Gratis-Tools", agency: "Agentur", allGuides: "Alle Ratgeber" },
  fr: { label: "Conseils", guides: "Conseils pour PME", tools: "Outils gratuits", agency: "Agence", allGuides: "Tous les conseils" },
};

function resourceGroups(locale: Locale): NavGroup[] {
  const d = getDict(locale);
  const t = resourceText[locale];
  const guideItems: NavItem[] = guides
    .filter((g) => hasRoute(`guide:${g.key}`))
    .slice(0, 5)
    .map((g) => ({ label: guideLabel(g.content[locale].h1), href: href(locale, `guide:${g.key}`), icon: "file" }));
  const agency: NavItem[] = [
    { label: d.nav.about, href: href(locale, "about"), icon: "users" },
    ...(showReferences ? [{ label: d.nav.references, href: href(locale, "references"), icon: "layout" }] : []),
    { label: industryUi[locale].allProblems, href: href(locale, "problems"), icon: "spark" },
    { label: d.nav.contact, href: href(locale, "contact"), icon: "mail" },
  ];
  return [
    { key: "guides", label: t.guides, items: guideItems, more: { label: t.allGuides, href: href(locale, "guides") } },
    { key: "tools", label: t.tools, items: items(locale, ["page:website-check", "page:impressum-generator"]) },
    { key: "agency", label: t.agency, items: agency },
  ].filter((g) => g.items.length > 0);
}

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
    serviceGroups: serviceGroups(locale),
    industriesLabel: industryUi[locale].industries,
    industriesHref: href(locale, "industries"),
    allIndustriesLabel: industryUi[locale].allIndustries,
    problemsLabel: industryUi[locale].problems,
    problemsHref: href(locale, "problems"),
    industries: industries.map((i) => ({ label: i.content[locale].navLabel, href: href(locale, `industry:${i.key}`), icon: i.icon })),
    resourcesLabel: resourceText[locale].label,
    resourcesHref: href(locale, "guides"),
    resourceGroups: resourceGroups(locale),
    links: [
      { label: d.nav.regions, href: href(locale, "regions") },
      ...(showReferences ? [{ label: d.nav.references, href: href(locale, "references") }] : []),
      { label: d.nav.about, href: href(locale, "about") },
      { label: d.nav.contact, href: href(locale, "contact") },
    ],
    cta: { label: d.nav.cta, href: href(locale, "request") },
    menuLabel: d.nav.menu,
    closeLabel: d.nav.close,
    phone: { label: site.phone, href: site.phoneHref },
    whatsappHref: site.whatsappHref,
    email: site.email,
    switchMap,
  };
}

/* ---------- Footer ---------- */

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export function buildFooter(locale: Locale): FooterColumn[] {
  const d = getDict(locale);
  const u = industryUi[locale];
  const t = resourceText[locale];
  const groups = serviceGroupIds.map((g) => ({ ...g, items: items(locale, g.ids) }));
  const byKey = (k: string) => groups.find((g) => g.key === k)!.items.map((i) => ({ label: i.label, href: i.href }));
  const seoCities = cities
    .filter((c) => c.seo && hasRoute(`citySeo:${c.key}`))
    .map((c) => ({ label: `${locale === "de" ? "SEO" : "Référencement"} ${c.content[locale].name}`, href: href(locale, `citySeo:${c.key}`) }));
  return [
    {
      title: d.footer.services,
      links: [...byKey("website"), ...byKey("commerce"), { label: d.nav.allServices, href: href(locale, "services") }],
    },
    {
      title: locale === "de" ? "Sichtbarkeit" : "Visibilité",
      links: [...byKey("visibility"), ...seoCities],
    },
    {
      title: locale === "de" ? "Standorte" : "Régions",
      links: [
        ...cities.map((c) => ({
          label: `${locale === "de" ? "Webdesign" : "Site internet"} ${c.content[locale].name}`,
          href: href(locale, `city:${c.key}`),
        })),
        { label: locale === "de" ? "Alle Standorte" : "Toutes les régions", href: href(locale, "regions") },
      ],
    },
    {
      title: `${u.industries} & ${u.problems}`,
      links: [
        ...industries.map((i) => ({ label: i.content[locale].navLabel, href: href(locale, `industry:${i.key}`) })),
        { label: u.allIndustries, href: href(locale, "industries") },
        ...problems.filter((p) => hasRoute(`problem:${p.key}`)).map((p) => ({ label: p.content[locale].navLabel, href: href(locale, `problem:${p.key}`) })),
        { label: u.allProblems, href: href(locale, "problems") },
      ],
    },
    {
      title: locale === "de" ? "Ratgeber & Agentur" : "Conseils & agence",
      links: [
        ...guides.filter((g) => hasRoute(`guide:${g.key}`)).map((g) => ({ label: guideLabel(g.content[locale].h1), href: href(locale, `guide:${g.key}`) })),
        { label: t.allGuides, href: href(locale, "guides") },
        ...items(locale, ["page:impressum-generator"]).map((i) => ({ label: i.label, href: i.href })),
        { label: d.nav.about, href: href(locale, "about") },
        ...(showReferences ? [{ label: d.nav.references, href: href(locale, "references") }] : []),
        { label: d.nav.contact, href: href(locale, "contact") },
      ],
    },
    {
      title: d.footer.legal,
      links: (Object.keys(legal) as (keyof typeof legal)[]).map((k) => ({ label: legal[k][locale].title, href: href(locale, `legal:${k}`) })),
    },
  ];
}

/** Guide H1s are long; the footer shows the part before a colon (keeps the French space before "?"). */
export function guideLabel(h1: string) {
  const m = h1.match(/^(.+?)(\s?)([?:])\s/);
  if (!m || m[1].length < 12) return h1;
  return m[3] === "?" ? `${m[1]}${m[2]}?` : m[1];
}
