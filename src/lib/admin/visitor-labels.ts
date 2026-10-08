import "server-only";
import { cities } from "@/content/cities";
import { guides } from "@/content/guides";
import { industries } from "@/content/industries";
import { legal } from "@/content/legal";
import { standalonePages } from "@/content/pages";
import { problems } from "@/content/problems";
import { services } from "@/content/services";
import { findRoute, isLocale, type RouteKind } from "@/lib/routes";

/* Labels for the visitor statistics (/admin/besucher). Kept apart from the queries in ./visitors,
   which the admin layout loads on every page, because they pull in the site content. */

const hubLabels: Partial<Record<RouteKind, string>> = {
  home: "Startseite",
  services: "Leistungen",
  industries: "Branchen",
  problems: "Lösungen",
  regions: "Standorte",
  references: "Referenzen",
  guides: "Ratgeber",
  about: "Über uns",
  contact: "Kontakt",
  request: "Anfrage",
  thanks: "Danke-Seite (Anfrage gesendet)",
};

/** Readable German name of a site path, e.g. "/fr/contact" -> "Kontakt". Unknown paths stay as they are. */
export function pageLabel(path: string): string {
  const m = /^\/([a-z]{2})(?:\/(.+))?$/.exec(path);
  if (!m || !isLocale(m[1])) return path;
  const entry = findRoute(m[1], m[2] ?? "");
  if (!entry) return path;
  const city = (key: string) => cities.find((c) => c.key === key)?.content.de.name ?? key;
  switch (entry.kind) {
    case "service":
      return services.find((s) => s.key === entry.key)?.content.de.navLabel ?? path;
    case "industry":
      return `Branche: ${industries.find((i) => i.key === entry.key)?.content.de.navLabel ?? entry.key}`;
    case "problem":
      return `Lösung: ${problems.find((p) => p.key === entry.key)?.content.de.navLabel ?? entry.key}`;
    case "city":
      return `Webdesign ${city(entry.key)}`;
    case "citySeo":
      return `SEO ${city(entry.key)}`;
    case "localService": {
      const [service, place] = entry.key.split(":");
      return `${services.find((s) => s.key === service)?.content.de.navLabel ?? service} ${city(place)}`;
    }
    case "guide":
      return `Ratgeber: ${guides.find((g) => g.key === entry.key)?.content.de.meta.title ?? entry.key}`;
    case "page":
      return standalonePages.find((p) => p.key === entry.key)?.content.de.navLabel ?? path;
    case "legal":
      return legal[entry.key as keyof typeof legal]?.de.title ?? path;
    case "lp":
      return entry.key === "kassensystem" ? "Landingpage Kassensystem" : "Landingpage Neue Webseite";
    case "reference":
      return "Referenz";
    default:
      return hubLabels[entry.kind] ?? path;
  }
}

// Referrer hosts (google.ch, l.instagram.com) and utm_source tags ("instagram", "Instagram Story") of the same channel.
const knownSources: [RegExp, string][] = [
  [/(^|\.)google\.[a-z.]+$|googlequicksearchbox|^google\b/, "Google"],
  [/(^|\.)bing\.com$|^bing\b/, "Bing"],
  [/duckduckgo/, "DuckDuckGo"],
  [/(^|\.)ecosia\.org$|^ecosia\b/, "Ecosia"],
  [/(^|\.)yahoo\.com$/, "Yahoo"],
  [/instagram|^ig\b/, "Instagram"],
  [/facebook|^fb\b|^fb\.me$/, "Facebook"],
  [/linkedin|^lnkd\.in$/, "LinkedIn"],
  [/whatsapp|^wa\.me$/, "WhatsApp"],
  [/tiktok/, "TikTok"],
  [/youtube|^youtu\.be$/, "YouTube"],
  [/^t\.co$|(^|\.)x\.com$|twitter/, "X"],
  [/chatgpt|openai\.com$/, "ChatGPT"],
  [/perplexity/, "Perplexity"],
  [/(^|\.)local\.ch$/, "local.ch"],
  [/(^|\.)search\.ch$/, "search.ch"],
];

/** "www.google.ch" -> "Google"; null -> "Direkt". */
export function sourceLabel(source: string | null): string {
  if (!source) return "Direkt";
  for (const [re, label] of knownSources) if (re.test(source)) return label;
  return source;
}

/** Sources grouped by their label (google.ch and google.com are both "Google"), largest first. */
export function groupSources(rows: { source: string | null; visitors: number }[]) {
  const m = new Map<string, number>();
  for (const r of rows) m.set(sourceLabel(r.source), (m.get(sourceLabel(r.source)) ?? 0) + r.visitors);
  return [...m.entries()].map(([label, visitors]) => ({ label, visitors })).sort((a, b) => b.visitors - a.visitors);
}

export const deviceLabels: Record<string, string> = { mobile: "Smartphone", tablet: "Tablet", desktop: "Computer" };
export const deviceIcons: Record<string, string> = { mobile: "smartphone", tablet: "tablet", desktop: "monitor" };

const cantons: Record<string, string> = {
  AG: "Aargau",
  AI: "Appenzell Innerrhoden",
  AR: "Appenzell Ausserrhoden",
  BE: "Bern",
  BL: "Basel-Landschaft",
  BS: "Basel-Stadt",
  FR: "Freiburg",
  GE: "Genf",
  GL: "Glarus",
  GR: "Graubünden",
  JU: "Jura",
  LU: "Luzern",
  NE: "Neuenburg",
  NW: "Nidwalden",
  OW: "Obwalden",
  SG: "St. Gallen",
  SH: "Schaffhausen",
  SO: "Solothurn",
  SZ: "Schwyz",
  TG: "Thurgau",
  TI: "Tessin",
  UR: "Uri",
  VD: "Waadt",
  VS: "Wallis",
  ZG: "Zug",
  ZH: "Zürich",
};

export const cantonName = (code: string | null) => (code ? (cantons[code] ?? code) : "Unbekannt");

const regionNames = new Intl.DisplayNames(["de-CH"], { type: "region" });
export function countryName(code: string | null) {
  if (!code) return "Unbekannt";
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

/** The canton for Swiss visitors ("Solothurn"), otherwise the country ("Deutschland"). */
export const placeLabel = (country: string | null, region: string | null) =>
  country === "CH" && region ? cantonName(region) : countryName(country);
