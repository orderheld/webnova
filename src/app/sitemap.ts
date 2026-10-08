import type { MetadataRoute } from "next";
import { guides } from "@/content/guides";
import { references } from "@/content/references";
import { routes, type RouteEntry } from "@/lib/routes";
import { site } from "@/lib/site";

/** Last content update of the site pages. Bump when page texts change substantially. */
const SITE_UPDATED = "2026-10-08";

const prio: Record<string, number> = {
  home: 1,
  service: 0.9,
  city: 0.8,
  services: 0.8,
  citySeo: 0.7,
  localService: 0.7,
  regions: 0.7,
  guides: 0.7,
  guide: 0.7,
  about: 0.6,
  contact: 0.6,
  request: 0.6,
  references: 0.5,
  reference: 0.5,
  legal: 0.2,
  industries: 0.8,
  industry: 0.8,
  problems: 0.7,
  problem: 0.7,
  page: 0.7,
};

function lastModified(r: RouteEntry): string {
  if (r.kind === "guide") {
    const g = guides.find((x) => x.key === r.key);
    if (g) return g.updated ?? g.date;
  }
  if (r.kind === "guides") return guides.map((g) => g.updated ?? g.date).sort().at(-1) ?? SITE_UPDATED;
  return SITE_UPDATED;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (l: "de" | "fr", p: string) => `${site.url}/${l}${p ? `/${p}` : ""}`;
  return routes
    .filter((r) => !r.noindex)
    .flatMap((r) =>
      (["de", "fr"] as const).map((l) => ({
        url: url(l, r.paths[l]),
        lastModified: lastModified(r),
        changeFrequency: (r.kind === "legal" ? "yearly" : r.kind === "home" || r.kind === "guides" ? "weekly" : "monthly") as "yearly" | "weekly" | "monthly",
        priority: prio[r.kind] ?? 0.5,
        ...(r.kind === "reference" && { images: references.filter((x) => x.key === r.key && x.image).map((x) => `${site.url}${x.image}`) }),
        alternates: { languages: { "de-CH": url("de", r.paths.de), "fr-CH": url("fr", r.paths.fr), "x-default": url("de", r.paths.de) } },
      })),
    );
}
