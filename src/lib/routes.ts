import { cities } from "@/content/cities";
import { showReferences } from "./site";
import { guides } from "@/content/guides";
import { industries } from "@/content/industries";
import { problems } from "@/content/problems";
import { legal } from "@/content/legal";
import { localServices } from "@/content/local";
import { standalonePages } from "@/content/pages";
import { references } from "@/content/references";
import { services } from "@/content/services";
import { locales, type Locale, type Localized } from "@/content/types";

export type RouteKind =
  | "home"
  | "services"
  | "service"
  | "regions"
  | "city"
  | "citySeo"
  | "localService"
  | "guides"
  | "guide"
  | "industries"
  | "industry"
  | "problems"
  | "problem"
  | "about"
  | "references"
  | "reference"
  | "contact"
  | "request"
  | "thanks"
  | "legal"
  | "page"
  | "lp";

export interface RouteEntry {
  id: string;
  kind: RouteKind;
  key: string;
  /** Path below the locale prefix, without leading slash. "" = home. */
  paths: Localized<string>;
  noindex?: boolean;
}

const page = (kind: RouteKind, de: string, fr: string, noindex = false): RouteEntry => ({
  id: kind,
  kind,
  key: kind,
  paths: { de, fr },
  noindex,
});

export const lpKeys = ["webseite", "kassensystem"] as const;
export type LpKey = (typeof lpKeys)[number];

function buildRoutes(): RouteEntry[] {
  const r: RouteEntry[] = [
    page("home", "", ""),
    page("services", "leistungen", "services"),
    page("industries", "branchen", "secteurs"),
    page("problems", "loesungen", "solutions"),
    page("regions", "standorte", "regions"),
    ...(showReferences ? [page("references", "referenzen", "references")] : []),
    page("guides", "ratgeber", "conseils"),
    page("about", "ueber-uns", "a-propos"),
    page("contact", "kontakt", "contact"),
    page("request", "anfrage", "demande"),
    page("thanks", "danke", "merci", true),
  ];
  for (const s of services) {
    r.push({ id: `service:${s.key}`, kind: "service", key: s.key, paths: { de: s.content.de.slug, fr: s.content.fr.slug } });
  }
  for (const i of industries) {
    r.push({ id: `industry:${i.key}`, kind: "industry", key: i.key, paths: { de: `branchen/${i.content.de.slug}`, fr: `secteurs/${i.content.fr.slug}` } });
  }
  for (const p of problems) {
    r.push({ id: `problem:${p.key}`, kind: "problem", key: p.key, paths: { de: `loesungen/${p.content.de.slug}`, fr: `solutions/${p.content.fr.slug}` } });
  }
  for (const c of cities) {
    r.push({ id: `city:${c.key}`, kind: "city", key: c.key, paths: { de: c.content.de.slug, fr: c.content.fr.slug } });
    if (c.seo) {
      r.push({ id: `citySeo:${c.key}`, kind: "citySeo", key: c.key, paths: { de: c.seo.de.slug, fr: c.seo.fr.slug } });
    }
  }
  for (const ref of showReferences ? references : []) {
    r.push({ id: `reference:${ref.key}`, kind: "reference", key: ref.key, paths: { de: `referenzen/${ref.key}`, fr: `references/${ref.key}` } });
  }
  for (const ls of localServices) {
    r.push({
      id: localId(ls.service, ls.city),
      kind: "localService",
      key: `${ls.service}:${ls.city}`,
      paths: { de: ls.content.de.slug, fr: ls.content.fr.slug },
    });
  }
  for (const g of guides) {
    r.push({
      id: `guide:${g.key}`,
      kind: "guide",
      key: g.key,
      paths: { de: `ratgeber/${g.content.de.slug}`, fr: `conseils/${g.content.fr.slug}` },
    });
  }
  // Standalone pages (free website check, Impressum generator): ids "page:<key>".
  for (const p of standalonePages) {
    r.push({ id: `page:${p.key}`, kind: "page", key: p.key, paths: { de: p.content.de.slug, fr: p.content.fr.slug } });
  }
  for (const [key, l] of Object.entries(legal)) {
    r.push({ id: `legal:${key}`, kind: "legal", key, paths: { de: l.de.slug, fr: l.fr.slug } });
  }
  r.push({ id: "lp:webseite", kind: "lp", key: "webseite", paths: { de: "lp/neue-webseite", fr: "lp/nouveau-site-internet" }, noindex: true });
  r.push({ id: "lp:kassensystem", kind: "lp", key: "kassensystem", paths: { de: "lp/kassensystem", fr: "lp/systeme-de-caisse" }, noindex: true });
  return r;
}

/** Route id of a service × city page, e.g. localId("onlineshop", "biel"). */
export function localId(service: string, city: string): string {
  return `local:${service}:${city}`;
}

export const routes = buildRoutes();
const byId = new Map(routes.map((r) => [r.id, r]));

export function findRoute(locale: Locale, path: string): RouteEntry | undefined {
  return routes.find((r) => r.paths[locale] === path);
}

export function getRoute(id: string): RouteEntry {
  const r = byId.get(id);
  if (!r) throw new Error(`Unknown route ${id}`);
  return r;
}

/** Absolute-path href for a route id, e.g. href("de", "service:seo") -> "/de/seo-agentur" */
export function hasRoute(id: string): boolean {
  return byId.has(id);
}

export function href(locale: Locale, id: string): string {
  const p = getRoute(id).paths[locale];
  return p ? `/${locale}/${p}` : `/${locale}`;
}

export function alternates(entry: RouteEntry): Localized<string> {
  return Object.fromEntries(
    locales.map((l) => [l, entry.paths[l] ? `/${l}/${entry.paths[l]}` : `/${l}`]),
  ) as Localized<string>;
}

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}
