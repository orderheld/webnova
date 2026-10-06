import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { alternates, type RouteEntry } from "./routes";
import { site } from "./site";

export function pageMetadata(
  locale: Locale,
  entry: RouteEntry,
  meta: { title: string; description: string },
  opts: { absoluteTitle?: boolean } = {},
): Metadata {
  const alt = alternates(entry);
  const url = alt[locale];
  return {
    title: opts.absoluteTitle ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: { "de-CH": alt.de, "fr-CH": alt.fr, "x-default": alt.de },
    },
    openGraph: {
      type: "website",
      url,
      title: meta.title,
      description: meta.description,
      siteName: site.name,
      locale: locale === "de" ? "de_CH" : "fr_CH",
    },
    robots: entry.noindex ? { index: false, follow: true } : undefined,
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const orgId = `${site.url}/#organization`;

export function organizationLd(locale: Locale, areaServed: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": orgId,
    name: site.name,
    legalName: site.legalName,
    url: `${site.url}/${locale}`,
    logo: `${site.url}/icon.png`,
    image: `${site.url}/opengraph-image`,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.zip,
      addressLocality: site.address.city,
      addressRegion: site.address.canton,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: areaServed.map((name) => ({ "@type": "City", name })),
    knowsLanguage: ["de", "fr"],
    sameAs: Object.values(site.social),
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.url}`,
    })),
  };
}

export function faqLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
