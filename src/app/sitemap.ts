import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (l: "de" | "fr", p: string) => `${site.url}/${l}${p ? `/${p}` : ""}`;
  const prio: Record<string, number> = { home: 1, service: 0.9, city: 0.8, citySeo: 0.7, services: 0.8, regions: 0.7, guide: 0.6 };
  return routes
    .filter((r) => !r.noindex)
    .flatMap((r) =>
      (["de", "fr"] as const).map((l) => ({
        url: url(l, r.paths[l]),
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: prio[r.kind] ?? 0.5,
        alternates: { languages: { "de-CH": url("de", r.paths.de), "fr-CH": url("fr", r.paths.fr) } },
      })),
    );
}
