import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { ogFile } from "./og/data";
import { alternates, type RouteEntry } from "./routes";
import { site } from "./site";

/** Absolute URL of the social preview image for a route (see src/app/og). */
export function ogImageUrl(locale: Locale, entry: RouteEntry): string {
  return `${site.url}/og/${locale}/${ogFile(entry)}.png`;
}

export function pageMetadata(
  locale: Locale,
  entry: RouteEntry,
  meta: { title: string; description: string },
  opts: { absoluteTitle?: boolean } = {},
): Metadata {
  const alt = alternates(entry);
  const url = `${site.url}${alt[locale]}`;
  const image = { url: ogImageUrl(locale, entry), width: 1200, height: 630, alt: meta.title, type: "image/png" };
  return {
    title: opts.absoluteTitle ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: { "de-CH": `${site.url}${alt.de}`, "fr-CH": `${site.url}${alt.fr}`, "x-default": `${site.url}${alt.de}` },
    },
    openGraph: {
      type: entry.kind === "guide" ? "article" : "website",
      url,
      title: meta.title,
      description: meta.description,
      siteName: site.name,
      locale: locale === "de" ? "de_CH" : "fr_CH",
      alternateLocale: locale === "de" ? ["fr_CH"] : ["de_CH"],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [image],
    },
    robots: entry.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
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
    description:
      locale === "de"
        ? "Webdesign Agentur in Grenchen für Unternehmen in der ganzen Schweiz: Webseiten erstellen lassen, Redesign, Wartung und SEO, dazu Onlineshops und Kassensysteme, auf Deutsch und Französisch."
        : "Agence web à Granges (SO) pour les entreprises de toute la Suisse : création et refonte de sites internet, maintenance et SEO, ainsi que boutiques en ligne et systèmes de caisse, en français et en allemand.",
    slogan: locale === "de" ? "Webseiten für Schweizer Unternehmen" : "Des sites internet pour les entreprises suisses",
    knowsAbout:
      locale === "de"
        ? ["Webdesign", "Webseite erstellen", "Website-Redesign", "Suchmaschinenoptimierung", "Local SEO", "Onlineshop", "Kassensystem"]
        : ["Création de site internet", "Webdesign", "Refonte de site", "Référencement naturel", "SEO local", "Boutique en ligne", "Système de caisse"],
    logo: { "@type": "ImageObject", url: `${site.url}/icons/icon-512.png`, width: 512, height: 512 },
    image: `${site.url}/og/${locale}/home.png`,
    founder: { "@type": "Person", name: "Ferhat Demir" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone,
      email: site.email,
      contactType: "customer service",
      availableLanguage: ["German", "French"],
      areaServed: "CH",
    },
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
    areaServed: [{ "@type": "Country", name: locale === "de" ? "Schweiz" : "Suisse" }, ...areaServed.map((name) => ({ "@type": "City", name }))],
    knowsLanguage: ["de", "fr"],
    ...(site.google.maps && { hasMap: site.google.maps }),
    ...(site.openingHours.length > 0 && {
      openingHoursSpecification: site.openingHours.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
        opens: h.opens,
        closes: h.closes,
      })),
    }),
    sameAs: [...Object.values(site.social), site.google.maps, ...site.directories].filter(Boolean),
  };
}

export function websiteLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: `${site.url}/${locale}`,
    inLanguage: locale === "de" ? "de-CH" : "fr-CH",
    publisher: { "@id": orgId },
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
