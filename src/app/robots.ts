import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/", "/og/"], disallow: ["/admin", "/api", "/de/lp/", "/fr/lp/", "/de/danke", "/fr/merci"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
