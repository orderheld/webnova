import { cities } from "@/content/cities";
import { guides } from "@/content/guides";
import { industries } from "@/content/industries";
import { problems } from "@/content/problems";
import { localServices } from "@/content/local";
import { standalonePages } from "@/content/pages";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { routes, type RouteEntry, type RouteKind } from "@/lib/routes";

/** Route kinds that get their own social preview image. Everything else uses the generic one. */
const ownImage: RouteKind[] = ["service", "city", "citySeo", "localService", "guide", "industry", "problem", "page"];

export interface OgData {
  eyebrow: string;
  title: string;
}

/** File name (without locale) of the preview image for a route, e.g. "guide--lokales-seo-kmu". */
export function ogFile(entry: RouteEntry): string {
  return ownImage.includes(entry.kind) ? entry.id.replace(/:/g, "--") : "home";
}

/** Every image the /og route renders, per locale. */
export function ogFiles(): string[] {
  return ["home", ...routes.filter((r) => ownImage.includes(r.kind) && !r.noindex).map(ogFile)];
}

export function ogData(locale: Locale, file: string): OgData | undefined {
  const d = getDict(locale);
  if (file === "home") return { eyebrow: d.hero.eyebrow, title: `${d.hero.title1} ${d.hero.title2}` };
  const entry = routes.find((r) => ogFile(r) === file);
  if (!entry) return undefined;
  switch (entry.kind) {
    case "service": {
      const c = services.find((s) => s.key === entry.key)!.content[locale];
      return { eyebrow: c.navLabel, title: c.h1 };
    }
    case "city":
    case "citySeo": {
      const city = cities.find((c) => c.key === entry.key)!;
      const c = entry.kind === "city" ? city.content[locale] : city.seo![locale];
      const label = entry.kind === "city" ? (locale === "de" ? "Webdesign" : "Site internet") : locale === "de" ? "SEO" : "Référencement";
      return { eyebrow: `${label} · ${city.content[locale].name}`, title: c.h1 };
    }
    case "localService": {
      const [serviceKey, cityKey] = entry.key.split(":");
      const ls = localServices.find((l) => l.service === serviceKey && l.city === cityKey)!;
      const s = services.find((x) => x.key === serviceKey)!;
      const city = cities.find((c) => c.key === cityKey)!;
      return { eyebrow: `${s.content[locale].navLabel} · ${city.content[locale].name}`, title: ls.content[locale].h1 };
    }
    case "guide": {
      const g = guides.find((x) => x.key === entry.key)!;
      return { eyebrow: `${d.nav.guides} · ${g.readingMinutes} ${d.common.minutes}`, title: g.content[locale].h1 };
    }
    case "industry": {
      const c = industries.find((x) => x.key === entry.key)!.content[locale];
      return { eyebrow: `${locale === "de" ? "Branche" : "Secteur"} · ${c.navLabel}`, title: c.h1 };
    }
    case "problem": {
      const c = problems.find((x) => x.key === entry.key)!.content[locale];
      return { eyebrow: c.eyebrow, title: c.h1 };
    }
    case "page": {
      const c = standalonePages.find((x) => x.key === entry.key)!.content[locale];
      return { eyebrow: c.eyebrow, title: c.h1 };
    }
    default:
      return undefined;
  }
}
