import type { Locale, Localized } from "./types";

/*
 * Public prices, set by Ferhat on 2026-10-13 (a paid design demo credited on order, website packages paid once
 * at the level of the regional competition, never below it, hosting optional per month). Webnova is not
 * subject to VAT: the prices are final, no MWST is added. The packages are the defaults of the admin calculator (src/lib/admin/calculator.ts):
 * change both together. Every price on the site (Preise page, service and industry pages, FAQ answers,
 * llms.txt) is built from this file.
 */

export type PackageId = "demo" | "starter" | "kmu" | "professional" | "individuell";

export interface PricePackage {
  id: PackageId;
  name: Localized<string>;
  /** in CHF, paid once */
  price: number;
  /** the price is a starting point ("ab"), the offer follows the scope */
  from?: boolean;
  /** short line under the price */
  note: Localized<string>;
  /** service preset of the request form */
  service: "webdesign";
  /** our recommendation for most small businesses */
  recommended?: boolean;
  forWhom: Localized<string>;
  features: Localized<string[]>;
  cta: Localized<string>;
}

/** Days within which the demo is refunded on request if no website order follows. */
export const guaranteeDays = 30;
/** Days of free hosting from the launch, without automatic renewal. */
export const hostingTrialDays = 30;
/** Months of free hosting with SEO in the package KMU. */
export const kmuFreeMonths = 3;

export const pricePackages: PricePackage[] = [
  {
    id: "demo",
    name: { de: "Design-Demo", fr: "Démo design" },
    price: 59,
    note: { de: "einmalig, bei Auftrag angerechnet", fr: "paiement unique, déduit à la commande" },
    service: "webdesign",
    forWhom: {
      de: "Sehen Sie Ihre neue Startseite, bevor Sie sich entscheiden.",
      fr: "Voyez votre nouvelle page d'accueil avant de vous décider.",
    },
    features: {
      de: ["Ihre künftige Startseite, gestaltet von uns", "In Ihren Farben und mit Ihrem Logo", "Zum Anschauen, programmiert wird erst nach Ihrem OK", "Wird bei Auftrag vom Preis abgezogen", `Geld zurück, wenn innert ${guaranteeDays} Tagen kein Auftrag folgt`],
      fr: ["Votre future page d'accueil, conçue par nous", "Dans vos couleurs et avec votre logo", "À regarder, le développement suit votre accord", "Déduite du prix à la commande", `Remboursée si aucune commande dans les ${guaranteeDays} jours`],
    },
    cta: { de: "Demo anfragen", fr: "Demander la démo" },
  },
  {
    id: "starter",
    name: { de: "Starter", fr: "Starter" },
    price: 990,
    note: { de: "einmalig", fr: "paiement unique" },
    service: "webdesign",
    forWhom: {
      de: "Eine Seite mit allem Wichtigen: für neue Firmen, Einzelunternehmen und klare Angebote.",
      fr: "Une page avec l'essentiel : pour les nouvelles entreprises, les indépendants et les offres claires.",
    },
    features: {
      de: ["Onepager: eine Seite mit allen Infos", "Individuelles Design für Handy und Computer", "Kontaktformular", "Google-Grundlagen", "In der Regel in 1 bis 2 Wochen online"],
      fr: ["One-page : une page avec toutes les infos", "Design sur mesure pour mobile et ordinateur", "Formulaire de contact", "Bases Google", "En ligne en général en 1 à 2 semaines"],
    },
    cta: { de: "Paket anfragen", fr: "Demander cette formule" },
  },
  {
    id: "kmu",
    name: { de: "KMU", fr: "PME" },
    price: 2690,
    note: { de: "einmalig", fr: "paiement unique" },
    service: "webdesign",
    recommended: true,
    forWhom: {
      de: "Mehrere Seiten für Betriebe, die über ihre Webseite Anfragen gewinnen wollen.",
      fr: "Plusieurs pages pour les entreprises qui veulent obtenir des demandes par leur site.",
    },
    features: {
      de: [
        "Bis 5 Seiten",
        "Eigenes Design mit dezenten Bewegungen",
        "Kontaktformular und Online-Termine",
        "Google-Unternehmensprofil eingerichtet",
        "Google-Grundlagen und Besucherzahlen ohne Cookies",
        "In der Regel in rund 3 Wochen online",
        `Die ersten ${kmuFreeMonths} Monate Hosting mit SEO kosten nichts`,
      ],
      fr: [
        "Jusqu'à 5 pages",
        "Design propre avec mouvements discrets",
        "Formulaire de contact et rendez-vous en ligne",
        "Fiche Google Business Profile créée",
        "Bases Google et visites mesurées sans cookies",
        "En ligne en général en 3 semaines environ",
        `Les ${kmuFreeMonths} premiers mois d'hébergement avec SEO sont offerts`,
      ],
    },
    cta: { de: "Paket anfragen", fr: "Demander cette formule" },
  },
  {
    id: "professional",
    name: { de: "Professional", fr: "Professional" },
    price: 4900,
    note: { de: "einmalig", fr: "paiement unique" },
    service: "webdesign",
    forWhom: {
      de: "Für Betriebe mit mehreren Angeboten, Standorten oder viel Inhalt.",
      fr: "Pour les entreprises avec plusieurs offres, sites ou beaucoup de contenu.",
    },
    features: {
      de: ["Bis 10 Seiten", "Designkonzept mit Animationen", "Inhalte selbst bearbeiten (CMS)", "Blog oder News", "Erweiterte Google-Grundlagen", "Google-Unternehmensprofil eingerichtet", "Schulung bei der Übergabe"],
      fr: ["Jusqu'à 10 pages", "Concept graphique avec animations", "Contenus modifiables vous-même (CMS)", "Blog ou actualités", "Bases Google avancées", "Fiche Google Business Profile créée", "Formation à la remise"],
    },
    cta: { de: "Paket anfragen", fr: "Demander cette formule" },
  },
  {
    id: "individuell",
    name: { de: "Individuell", fr: "Sur mesure" },
    price: 6500,
    from: true,
    note: { de: "individuell offeriert", fr: "sur devis" },
    service: "webdesign",
    forWhom: {
      de: "Für Onlineshops, Web-Apps und Auftritte mit mehr als 10 Seiten.",
      fr: "Pour les boutiques en ligne, les applications web et les sites de plus de 10 pages.",
    },
    features: {
      de: ["Onlineshop mit TWINT und Karte", "Web-App, Buchungssystem oder Kundenbereich", "Mehr als 10 Seiten oder mehrere Sprachen", "Verbindung mit Ihrer Kasse und anderen Programmen", "Zeitplan nach Umfang", "Preis nach Aufwand, schriftlich offeriert"],
      fr: ["Boutique en ligne avec TWINT et carte", "Application web, réservations ou espace client", "Plus de 10 pages ou plusieurs langues", "Liaison avec votre caisse et d'autres logiciels", "Calendrier selon l'ampleur", "Prix selon le travail, devis écrit"],
    },
    cta: { de: "Offerte anfragen", fr: "Demander un devis" },
  },
];

/** The website packages without the demo. */
export const websitePackages = pricePackages.filter((p) => p.id !== "demo");

export type CareTierId = "hosting" | "seo" | "rundum";

export interface CareTier {
  id: CareTierId;
  name: Localized<string>;
  /** CHF per month, cancellable any time */
  price: number;
  items: Localized<string[]>;
}

/** Hosting and care for websites we built: optional, per month, cancellable any time. */
export const careTiers: CareTier[] = [
  {
    id: "hosting",
    name: { de: "Hosting", fr: "Hébergement" },
    price: 39,
    items: {
      de: ["Hosting mit SSL-Zertifikat", "Tägliche Backups", "Technische Updates und Sicherheit", "Persönlicher Support"],
      fr: ["Hébergement avec certificat SSL", "Sauvegardes quotidiennes", "Mises à jour techniques et sécurité", "Support personnel"],
    },
  },
  {
    id: "seo",
    name: { de: "Hosting + SEO", fr: "Hébergement + SEO" },
    price: 59,
    items: {
      de: ["Alles aus Hosting", "Wir arbeiten laufend an Ihrer Sichtbarkeit bei Google"],
      fr: ["Tout l'hébergement", "Nous travaillons en continu à votre visibilité sur Google"],
    },
  },
  {
    id: "rundum",
    name: { de: "Rundum", fr: "Tout compris" },
    price: 89,
    items: {
      de: ["Alles aus Hosting + SEO", "Kleine Änderungen machen wir laufend für Sie", "Ein Ansprechpartner für alles"],
      fr: ["Tout l'hébergement + SEO", "Nous faisons les petites modifications pour vous", "Un seul interlocuteur pour tout"],
    },
  },
];

/** Google Business Profile: setup once, care optional per month. */
export const gbpPrice = { setup: 290, monthly: 49 };

export function packagePrice(id: PackageId): number {
  return pricePackages.find((p) => p.id === id)!.price;
}

export function carePrice(id: CareTierId): number {
  return careTiers.find((t) => t.id === id)!.price;
}

/** The lowest monthly hosting price. */
export const hostingFrom = Math.min(...careTiers.map((t) => t.price));

/** "2’500": the Swiss thousands separator, in both languages. */
export function swissNumber(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "’");
}

/** "CHF 2’500" */
export function chf(n: number): string {
  return `CHF ${swissNumber(n)}`;
}

/** "ab CHF 2’500" / "dès CHF 2’500" */
export function fromPrice(locale: Locale, n: number): string {
  return `${locale === "de" ? "ab" : "dès"} ${chf(n)}`;
}

/** "CHF 1’390" or, for a starting price, "ab CHF 2’500". */
export function packagePriceLabel(locale: Locale, p: PricePackage): string {
  return p.from ? fromPrice(locale, p.price) : chf(p.price);
}

/** The VAT note shown next to the prices. */
export const vatNote: Localized<string> = {
  de: "Alle Preise in CHF. Webnova ist nicht mehrwertsteuerpflichtig, es kommt keine MWST dazu.",
  fr: "Tous les prix en CHF. Webnova n'est pas assujettie à la TVA, aucune TVA ne s'y ajoute.",
};

/** The fine print for the money-back guarantee and the free hosting test. */
export const guaranteeNote: Localized<string> = {
  de: `Zur Design-Demo: Sie erhalten die Rechnung, wenn die Demo fertig ist. Bestellen Sie die Webseite nicht innert ${guaranteeDays} Tagen, zahlen wir Ihnen die ${chf(packagePrice("demo"))} zurück, wenn Sie uns das kurz mitteilen. Zum Hosting: Die ersten ${hostingTrialDays} Tage nach der Aufschaltung kosten nichts. Danach läuft es nur weiter, wenn Sie ein Hosting-Paket wählen, sonst entstehen keine Kosten.`,
  fr: `Démo design : vous recevez la facture quand la démo est prête. Si vous ne commandez pas le site dans les ${guaranteeDays} jours, nous vous remboursons les ${chf(packagePrice("demo"))} sur simple message. Hébergement : les ${hostingTrialDays} premiers jours après la mise en ligne ne coûtent rien. Ensuite, il ne continue que si vous choisissez une formule, sinon aucun frais.`,
};

export type PriceTopic = "website" | "shop" | "redesign" | "care" | "gbp";

/** Short price line for heroes and the sector preview, e.g. "Webseiten ab CHF 600". */
export function priceLine(locale: Locale, topic: PriceTopic): string {
  const de = locale === "de";
  switch (topic) {
    case "website":
    case "redesign":
      return de ? `Webseiten ${fromPrice(locale, packagePrice("starter"))}` : `Sites internet ${fromPrice(locale, packagePrice("starter"))}`;
    case "shop":
      return de ? `Onlineshops ${fromPrice(locale, packagePrice("individuell"))}` : `Boutiques en ligne ${fromPrice(locale, packagePrice("individuell"))}`;
    case "care":
      return de ? `Hosting ${fromPrice(locale, hostingFrom)} pro Monat` : `Hébergement ${fromPrice(locale, hostingFrom)} par mois`;
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

/** Formatted prices for page texts, e.g. `ab ${prices.starter}` -> "ab CHF 600". */
export const prices = {
  demo: chf(packagePrice("demo")),
  starter: chf(packagePrice("starter")),
  kmu: chf(packagePrice("kmu")),
  professional: chf(packagePrice("professional")),
  shop: chf(packagePrice("individuell")),
  hosting: chf(carePrice("hosting")),
  hostingSeo: chf(carePrice("seo")),
  rundum: chf(carePrice("rundum")),
  gbpSetup: chf(gbpPrice.setup),
  gbpMonthly: chf(gbpPrice.monthly),
};

/** The three fixed-price packages in one phrase, for FAQ answers and guides. */
export function packageSummary(locale: Locale): string {
  const { starter, kmu, professional } = prices;
  return locale === "de"
    ? `Starter (Onepager) ${starter}, KMU (bis 5 Seiten) ${kmu} und Professional (bis 10 Seiten) ${professional}`
    : `Starter (une page) ${starter}, PME (jusqu'à 5 pages) ${kmu} et Professional (jusqu'à 10 pages) ${professional}`;
}

/** Answer to "Was kostet ...?" in FAQs, built from the prices above. */
export function costAnswer(locale: Locale, topic: PriceTopic): string {
  const { demo, shop, hosting, hostingSeo, rundum } = prices;
  if (locale === "de") {
    const hostingLine = `Hosting gibt es ab ${hosting} pro Monat, monatlich kündbar.`;
    switch (topic) {
      case "website":
        return `Die Webseiten-Pakete bei Webnova kosten einmalig: ${packageSummary("de")}. Onlineshops, Web-Apps und grössere Auftritte offerieren wir individuell ab ${shop}. ${hostingLine} Möchten Sie Ihre Startseite zuerst sehen, erhalten Sie für ${demo} eine Design-Demo, die bei Auftrag angerechnet wird.`;
      case "redesign":
        return `Für eine erneuerte Webseite gelten dieselben Pakete wie für eine neue: ${packageSummary("de")}, grössere Projekte ab ${shop}. Die Übernahme Ihrer bisherigen Inhalte und Weiterleitungen der alten Adressen stehen als eigene Position in der Offerte. ${hostingLine}`;
      case "shop":
        return `Onlineshops offerieren wir bei Webnova individuell ab ${shop}. Der genaue Preis hängt von Sortiment, Zahlungsarten wie TWINT und Karte, Versand und Anbindungen ab. Sie erhalten ihn nach einem kostenlosen Erstgespräch in einer schriftlichen Offerte. ${hostingLine}`;
      case "care":
        return `Für Webseiten von Webnova gibt es drei Hosting-Pakete, monatlich und jederzeit kündbar: Hosting ${hosting} pro Monat mit SSL, täglichen Backups und Updates, Hosting + SEO ${hostingSeo} und Rundum ${rundum} mit laufenden kleinen Änderungen. Ab der Aufschaltung testen Sie das Hosting ${hostingTrialDays} Tage gratis, beim Paket KMU sind Hosting und SEO ${kmuFreeMonths} Monate gratis. Die Domain steht separat in der Offerte. Für Webseiten anderer Anbieter richtet sich der Preis nach System und Umfang, Sie erhalten nach dem kostenlosen Erstgespräch eine Offerte.`;
      case "gbp":
        return `Bei Google ist das Profil kostenlos. Die Einrichtung durch uns kostet ${chf(gbpPrice.setup)} einmalig, die freiwillige Betreuung ${chf(gbpPrice.monthly)} pro Monat. In den Webseiten-Paketen KMU und Professional ist die Einrichtung bereits enthalten.`;
    }
  }
  const hostingLine = `L'hébergement commence à ${hosting} par mois, résiliable chaque mois.`;
  switch (topic) {
    case "website":
      return `Les formules site internet de Webnova se paient une fois : ${packageSummary("fr")}. Les boutiques en ligne, applications web et sites plus grands sont proposés sur devis dès ${shop}. ${hostingLine} Si vous voulez d'abord voir votre page d'accueil, une démo design coûte ${demo} et elle est déduite à la commande.`;
    case "redesign":
      return `Une refonte suit les mêmes formules qu'un nouveau site : ${packageSummary("fr")}, les projets plus grands dès ${shop}. La reprise de vos contenus actuels et les redirections des anciennes adresses figurent comme poste séparé dans le devis. ${hostingLine}`;
    case "shop":
      return `Chez Webnova, les boutiques en ligne sont proposées sur devis dès ${shop}. Le prix exact dépend de l'assortiment, des moyens de paiement comme TWINT et carte, de la livraison et des interfaces. Vous le recevez dans un devis écrit après un premier entretien gratuit. ${hostingLine}`;
    case "care":
      return `Pour les sites créés par Webnova, il existe trois formules d'hébergement, mensuelles et résiliables en tout temps : Hébergement ${hosting} par mois avec SSL, sauvegardes quotidiennes et mises à jour, Hébergement + SEO ${hostingSeo} et Tout compris ${rundum} avec les petites modifications courantes. Dès la mise en ligne, vous testez l'hébergement gratuitement pendant ${hostingTrialDays} jours, avec la formule PME l'hébergement avec SEO est offert ${kmuFreeMonths} mois. Le nom de domaine figure séparément dans le devis. Pour les sites d'autres prestataires, le prix dépend du système et de l'ampleur : vous recevez un devis après le premier entretien gratuit.`;
    case "gbp":
      return `Chez Google, la fiche est gratuite. La mise en place par nos soins coûte ${chf(gbpPrice.setup)} une fois, le suivi facultatif ${chf(gbpPrice.monthly)} par mois. Dans les formules PME et Professional pour les sites internet, la mise en place est déjà comprise.`;
  }
}
