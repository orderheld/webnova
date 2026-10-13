import type { Locale, Localized } from "./types";

/*
 * Public prices, confirmed by Ferhat on 2026-10-13. The packages are the defaults of the admin
 * calculator (src/lib/admin/calculator.ts): change both together. Every price on the site (Preise page,
 * service and industry pages, FAQ answers, llms.txt) is built from this file.
 */

export type PackageId = "starter" | "kmu" | "professional" | "shop";

export interface PricePackage {
  id: PackageId;
  name: Localized<string>;
  /** price "from", in CHF, paid once */
  price: number;
  /** service preset of the request form */
  service: "webdesign" | "shop";
  /** our recommendation for most small businesses */
  recommended?: boolean;
  forWhom: Localized<string>;
  features: Localized<string[]>;
}

export const pricePackages: PricePackage[] = [
  {
    id: "starter",
    name: { de: "Starter", fr: "Starter" },
    price: 2000,
    service: "webdesign",
    forWhom: {
      de: "Für einen raschen, sauberen Auftritt: neue Firmen, Einzelunternehmen und kleine Betriebe.",
      fr: "Pour une présence rapide et soignée : nouvelles entreprises, indépendants et petites structures.",
    },
    features: {
      de: ["Onepager oder bis 3 Seiten", "Responsives Design für Handy und Computer", "Kontaktformular", "Basis-SEO", "Aufschaltung und Go-live"],
      fr: ["One-page ou jusqu'à 3 pages", "Design responsive pour mobile et ordinateur", "Formulaire de contact", "SEO de base", "Mise en ligne"],
    },
  },
  {
    id: "kmu",
    name: { de: "KMU", fr: "PME" },
    price: 3900,
    service: "webdesign",
    recommended: true,
    forWhom: {
      de: "Für KMU, die mit ihrer Webseite regelmässig Anfragen gewinnen wollen.",
      fr: "Pour les PME qui veulent obtenir régulièrement des demandes grâce à leur site.",
    },
    features: {
      de: ["Bis 6 Seiten", "Individuelles Design", "Inhalte selbst bearbeiten (CMS)", "Kontaktformular", "Onpage-SEO", "Google-Unternehmensprofil eingerichtet", "Schulung bei der Übergabe"],
      fr: ["Jusqu'à 6 pages", "Design sur mesure", "Contenus modifiables vous-même (CMS)", "Formulaire de contact", "SEO on-page", "Fiche Google Business Profile créée", "Formation à la remise"],
    },
  },
  {
    id: "professional",
    name: { de: "Professional", fr: "Professional" },
    price: 6200,
    service: "webdesign",
    forWhom: {
      de: "Für Betriebe mit mehreren Angeboten, Standorten oder viel Inhalt.",
      fr: "Pour les entreprises avec plusieurs offres, sites ou beaucoup de contenu.",
    },
    features: {
      de: ["Bis 12 Seiten", "Designkonzept", "Inhalte selbst bearbeiten (CMS)", "Blog oder News", "Erweiterte SEO-Grundlagen", "Animationen", "Schulung bei der Übergabe"],
      fr: ["Jusqu'à 12 pages", "Concept graphique", "Contenus modifiables vous-même (CMS)", "Blog ou actualités", "Bases SEO avancées", "Animations", "Formation à la remise"],
    },
  },
  {
    id: "shop",
    name: { de: "Onlineshop", fr: "Boutique en ligne" },
    price: 7900,
    service: "shop",
    forWhom: {
      de: "Für Läden und Hersteller, die online verkaufen wollen.",
      fr: "Pour les commerces et fabricants qui veulent vendre en ligne.",
    },
    features: {
      de: ["Shop mit bis zu 50 Produkten", "Bezahlen mit TWINT und Karte", "Versand und MWST eingerichtet", "Rechtstexte für den Shop", "Kundenkonto", "Schulung bei der Übergabe"],
      fr: ["Boutique jusqu'à 50 produits", "Paiement par TWINT et carte", "Livraison et TVA configurées", "Textes juridiques de la boutique", "Compte client", "Formation à la remise"],
    },
  },
];

/** Hosting and maintenance of a website we built, per month. The first year is part of the project price (Ferhat, 2026-10-08). */
export const carePrice = 60;

/** Google Business Profile: setup once, care optional per month. */
export const gbpPrice = { setup: 290, monthly: 49 };

export function packagePrice(id: PackageId): number {
  return pricePackages.find((p) => p.id === id)!.price;
}

/** "2’000": the Swiss thousands separator, in both languages. */
export function swissNumber(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "’");
}

/** "CHF 2’000" */
export function chf(n: number): string {
  return `CHF ${swissNumber(n)}`;
}

/** "ab CHF 2’000" / "dès CHF 2’000" */
export function fromPrice(locale: Locale, n: number): string {
  return `${locale === "de" ? "ab" : "dès"} ${chf(n)}`;
}

export type PriceTopic = "website" | "shop" | "redesign" | "care" | "gbp";

/** Short price line for heroes and the sector preview, e.g. "Webseiten ab CHF 2’000". */
export function priceLine(locale: Locale, topic: PriceTopic): string {
  const de = locale === "de";
  switch (topic) {
    case "website":
    case "redesign":
      return de ? `Webseiten ${fromPrice(locale, packagePrice("starter"))}` : `Sites internet ${fromPrice(locale, packagePrice("starter"))}`;
    case "shop":
      return de ? `Onlineshops ${fromPrice(locale, packagePrice("shop"))}` : `Boutiques en ligne ${fromPrice(locale, packagePrice("shop"))}`;
    case "care":
      return de ? `Hosting und Wartung ${chf(carePrice)} pro Monat` : `Hébergement et maintenance ${chf(carePrice)} par mois`;
    case "gbp":
      return de ? `Einrichtung ${chf(gbpPrice.setup)}, Betreuung ${chf(gbpPrice.monthly)} pro Monat` : `Mise en place ${chf(gbpPrice.setup)}, suivi ${chf(gbpPrice.monthly)} par mois`;
  }
}

/** Topic of the price shown on a service page, by service key. Services without a public price are missing. */
export const servicePriceTopic: Record<string, PriceTopic> = {
  webdesign: "website",
  "website-kmu": "website",
  firmenwebsite: "website",
  "website-redesign": "redesign",
  onlineshop: "shop",
  wartung: "care",
  "google-profil": "gbp",
};

/** Price lines for an industry: every industry gets the website price, retail also the shop price. */
export function industryPriceLines(locale: Locale, industryKey: string): string[] {
  return industryKey === "detailhandel" ? [priceLine(locale, "website"), priceLine(locale, "shop")] : [priceLine(locale, "website")];
}

/** Answer to "Was kostet ...?" in FAQs, built from the prices above. */
export function costAnswer(locale: Locale, topic: PriceTopic): string {
  const s = chf(packagePrice("starter"));
  const k = chf(packagePrice("kmu"));
  const p = chf(packagePrice("professional"));
  const shop = chf(packagePrice("shop"));
  const care = chf(carePrice);
  if (locale === "de") {
    const careLine = `Hosting und Wartung kosten ${care} pro Monat, im ersten Jahr sind sie im Projektpreis inbegriffen.`;
    switch (topic) {
      case "website":
        return `Webseiten gibt es bei Webnova ab ${s}: Starter (Onepager oder bis 3 Seiten) ab ${s}, KMU (bis 6 Seiten) ab ${k} und Professional (bis 12 Seiten) ab ${p}. ${careLine} Den genauen Preis erhalten Sie nach dem kostenlosen Erstgespräch in einer schriftlichen Offerte.`;
      case "redesign":
        return `Für eine erneuerte Webseite gelten dieselben Pakete wie für eine neue: Starter ab ${s}, KMU ab ${k} und Professional ab ${p}. Die Übernahme Ihrer bisherigen Inhalte und Weiterleitungen der alten Adressen stehen als eigene Position in der Offerte. ${careLine}`;
      case "shop":
        return `Ein Onlineshop kostet bei Webnova ab ${shop}. Darin enthalten sind bis zu 50 Produkte, Zahlung mit TWINT und Karte, Versand- und MWST-Einstellungen, Rechtstexte, Kundenkonto und eine Schulung. ${careLine} Den genauen Preis für Ihr Sortiment erhalten Sie nach dem kostenlosen Erstgespräch.`;
      case "care":
        return `Für Webseiten von Webnova kosten Hosting und Wartung ${care} pro Monat, im ersten Jahr sind sie im Projektpreis inbegriffen. Enthalten sind Hosting mit SSL, tägliche Backups, Updates, Sicherheit und kleine Anpassungen. Für Webseiten anderer Anbieter richtet sich der Preis nach System und Umfang, Sie erhalten nach dem kostenlosen Erstgespräch eine Offerte.`;
      case "gbp":
        return `Bei Google ist das Profil kostenlos. Die Einrichtung durch uns kostet ${chf(gbpPrice.setup)} einmalig, die freiwillige Betreuung ${chf(gbpPrice.monthly)} pro Monat. Im Webseiten-Paket KMU ist die Einrichtung bereits enthalten.`;
    }
  }
  const careLine = `L'hébergement et la maintenance coûtent ${care} par mois et sont compris dans le prix du projet la première année.`;
  switch (topic) {
    case "website":
      return `Chez Webnova, les sites internet commencent à ${s} : Starter (one-page ou jusqu'à 3 pages) dès ${s}, PME (jusqu'à 6 pages) dès ${k} et Professional (jusqu'à 12 pages) dès ${p}. ${careLine} Vous recevez le prix exact dans un devis écrit après le premier entretien gratuit.`;
    case "redesign":
      return `Une refonte suit les mêmes formules qu'un nouveau site : Starter dès ${s}, PME dès ${k} et Professional dès ${p}. La reprise de vos contenus actuels et les redirections des anciennes adresses figurent comme poste séparé dans le devis. ${careLine}`;
    case "shop":
      return `Chez Webnova, une boutique en ligne coûte dès ${shop}. Cela comprend jusqu'à 50 produits, le paiement par TWINT et carte, la livraison et la TVA configurées, les textes juridiques, le compte client et une formation. ${careLine} Vous recevez le prix exact pour votre assortiment après le premier entretien gratuit.`;
    case "care":
      return `Pour les sites créés par Webnova, l'hébergement et la maintenance coûtent ${care} par mois et sont compris dans le prix du projet la première année. Cela comprend l'hébergement avec SSL, des sauvegardes quotidiennes, les mises à jour, la sécurité et de petites adaptations. Pour les sites d'autres prestataires, le prix dépend du système et de l'ampleur : vous recevez un devis après le premier entretien gratuit.`;
    case "gbp":
      return `Chez Google, la fiche est gratuite. La mise en place par nos soins coûte ${chf(gbpPrice.setup)} une fois, le suivi facultatif ${chf(gbpPrice.monthly)} par mois. Dans la formule PME pour les sites internet, la mise en place est déjà comprise.`;
  }
}

/** Formatted prices for page texts, e.g. `ab ${prices.starter}` -> "ab CHF 2’000". */
export const prices = {
  starter: chf(packagePrice("starter")),
  kmu: chf(packagePrice("kmu")),
  professional: chf(packagePrice("professional")),
  shop: chf(packagePrice("shop")),
  care: chf(carePrice),
  gbpSetup: chf(gbpPrice.setup),
  gbpMonthly: chf(gbpPrice.monthly),
};
