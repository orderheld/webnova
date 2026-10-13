import type { Locale, Localized } from "./types";

/*
 * Public prices, set by Ferhat on 2026-10-13 (model: a paid design demo credited on order, three website
 * packages paid once, hosting optional per month). Webnova is not subject to VAT: the prices are final,
 * no MWST is added. The packages are the defaults of the admin calculator (src/lib/admin/calculator.ts):
 * change both together. Every price on the site (Preise page, service and industry pages, FAQ answers,
 * llms.txt) is built from this file.
 */

export type PackageId = "demo" | "starter" | "kmu" | "professional";

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
      de: ["Entwurf Ihrer Startseite", "Mit Ihrem Logo, Ihren Farben und Inhalten", "Als Bild zum Anschauen, noch keine fertige Webseite", "Bei Auftrag voll angerechnet", `${guaranteeDays} Tage Geld-zurück-Garantie`],
      fr: ["Maquette de votre page d'accueil", "Avec votre logo, vos couleurs et vos contenus", "En image, pas encore un site en ligne", "Entièrement déduite à la commande", `Garantie de remboursement de ${guaranteeDays} jours`],
    },
    cta: { de: "Demo anfragen", fr: "Demander la démo" },
  },
  {
    id: "starter",
    name: { de: "Starter", fr: "Starter" },
    price: 600,
    note: { de: "einmalig", fr: "paiement unique" },
    service: "webdesign",
    forWhom: {
      de: "Eine Seite mit allem Wichtigen: für neue Firmen, Einzelunternehmen und klare Angebote.",
      fr: "Une page avec l'essentiel : pour les nouvelles entreprises, les indépendants et les offres claires.",
    },
    features: {
      de: ["Onepager: eine Seite mit allen Infos", "Individuelles Design", "Für Handy und Computer gebaut", "Kontaktformular", "In der Regel in 1 bis 2 Wochen online"],
      fr: ["One-page : une page avec toutes les infos", "Design sur mesure", "Conçu pour mobile et ordinateur", "Formulaire de contact", "En ligne en général en 1 à 2 semaines"],
    },
    cta: { de: "Paket anfragen", fr: "Demander cette formule" },
  },
  {
    id: "kmu",
    name: { de: "KMU", fr: "PME" },
    price: 1390,
    note: { de: "einmalig", fr: "paiement unique" },
    service: "webdesign",
    recommended: true,
    forWhom: {
      de: "Der komplette Auftritt für Ihren Betrieb, gemacht für mehr Anfragen.",
      fr: "La présence complète de votre entreprise, faite pour plus de demandes.",
    },
    features: {
      de: [
        "2 bis 5 Seiten, jede individuell gestaltet",
        "Individuelles Design mit feinen Animationen",
        "Kontaktformular und Terminbuchung",
        "SEO-Grundlagen und Besucherstatistik ohne Cookies",
        "In der Regel in rund 3 Wochen online",
        `Hosting mit SEO ${kmuFreeMonths} Monate gratis, danach CHF 59 pro Monat`,
      ],
      fr: [
        "2 à 5 pages, chacune conçue sur mesure",
        "Design sur mesure avec animations discrètes",
        "Formulaire de contact et prise de rendez-vous",
        "Bases SEO et statistiques de visites sans cookies",
        "En ligne en général en 3 semaines environ",
        `Hébergement avec SEO offert ${kmuFreeMonths} mois, ensuite CHF 59 par mois`,
      ],
    },
    cta: { de: "Paket anfragen", fr: "Demander cette formule" },
  },
  {
    id: "professional",
    name: { de: "Professional", fr: "Professional" },
    price: 2500,
    from: true,
    note: { de: "individuell offeriert", fr: "sur devis" },
    service: "webdesign",
    forWhom: {
      de: "Wenn Ihr Betrieb mehr braucht: viele Seiten, einen Onlineshop oder besondere Funktionen.",
      fr: "Quand votre entreprise a besoin de plus : beaucoup de pages, une boutique en ligne ou des fonctions spéciales.",
    },
    features: {
      de: ["Ab 6 Seiten", "Onlineshop, Buchungssystem oder Kundenbereich", "Zahlung mit TWINT und Karte", "Anbindung an Kasse und andere Systeme", "Zeitplan nach Umfang", "Offerte nach einem kurzen Gespräch"],
      fr: ["Dès 6 pages", "Boutique en ligne, système de réservation ou espace client", "Paiement par TWINT et carte", "Liaison avec la caisse et d'autres systèmes", "Calendrier selon l'ampleur", "Devis après un court entretien"],
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
      de: ["Alles aus Hosting", "Laufende Suchmaschinenoptimierung", "Damit Sie bei Google besser gefunden werden"],
      fr: ["Tout l'hébergement", "Optimisation continue pour les moteurs de recherche", "Pour être mieux trouvé sur Google"],
    },
  },
  {
    id: "rundum",
    name: { de: "Rundum", fr: "Tout compris" },
    price: 89,
    items: {
      de: ["Alles aus Hosting + SEO", "Laufende kleine Änderungen inbegriffen", "Ausführlichere SEO-Betreuung"],
      fr: ["Tout l'hébergement + SEO", "Petites modifications courantes comprises", "Suivi SEO plus poussé"],
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
  de: `Geld-zurück-Garantie: Die Design-Demo verrechnen wir, sobald sie fertig ist. Erteilen Sie innert ${guaranteeDays} Tagen nach Erhalt der Demo keinen Auftrag für die Webseite, erstatten wir Ihnen die ${chf(packagePrice("demo"))} auf Wunsch vollständig zurück, eine kurze Nachricht genügt. Kostenlos testen: Das Hosting testen Sie ab der Aufschaltung Ihrer Webseite ${hostingTrialDays} Tage gratis, ohne automatische Verlängerung. Wählen Sie danach kein Hosting-Paket, endet der Test einfach, und es entstehen keine Kosten.`,
  fr: `Garantie de remboursement : nous facturons la démo design une fois terminée. Si vous ne commandez pas le site dans les ${guaranteeDays} jours qui suivent la remise de la démo, nous vous remboursons entièrement les ${chf(packagePrice("demo"))} sur demande, un court message suffit. Essai gratuit : vous testez l'hébergement gratuitement pendant ${hostingTrialDays} jours dès la mise en ligne de votre site, sans renouvellement automatique. Si vous ne choisissez ensuite aucune formule d'hébergement, l'essai prend simplement fin, sans frais.`,
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
      return de ? `Onlineshops ${fromPrice(locale, packagePrice("professional"))}` : `Boutiques en ligne ${fromPrice(locale, packagePrice("professional"))}`;
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
  hosting: chf(carePrice("hosting")),
  hostingSeo: chf(carePrice("seo")),
  rundum: chf(carePrice("rundum")),
  gbpSetup: chf(gbpPrice.setup),
  gbpMonthly: chf(gbpPrice.monthly),
};

/** Answer to "Was kostet ...?" in FAQs, built from the prices above. */
export function costAnswer(locale: Locale, topic: PriceTopic): string {
  const { demo, starter, kmu, professional, hosting, hostingSeo, rundum } = prices;
  if (locale === "de") {
    const hostingLine = `Hosting gibt es ab ${hosting} pro Monat, monatlich kündbar.`;
    switch (topic) {
      case "website":
        return `Bei Webnova kostet ein Onepager (Starter) ${starter} und eine Webseite mit 2 bis 5 Seiten (KMU) ${kmu}, jeweils einmalig. Grössere Projekte mit mehr Seiten, Onlineshop oder besonderen Funktionen (Professional) offerieren wir individuell ab ${professional}. ${hostingLine} Möchten Sie Ihre Startseite zuerst sehen, erhalten Sie für ${demo} eine Design-Demo, die bei Auftrag angerechnet wird.`;
      case "redesign":
        return `Für eine erneuerte Webseite gelten dieselben Pakete wie für eine neue: Starter ${starter}, KMU ${kmu} und Professional ab ${professional}. Die Übernahme Ihrer bisherigen Inhalte und Weiterleitungen der alten Adressen stehen als eigene Position in der Offerte. ${hostingLine}`;
      case "shop":
        return `Onlineshops gehören bei Webnova zum Paket Professional und beginnen bei ${professional}. Der genaue Preis hängt von Sortiment, Zahlungsarten wie TWINT und Karte, Versand und Anbindungen ab. Sie erhalten ihn nach einem kostenlosen Erstgespräch in einer schriftlichen Offerte. ${hostingLine}`;
      case "care":
        return `Für Webseiten von Webnova gibt es drei Hosting-Pakete, monatlich und jederzeit kündbar: Hosting ${hosting} pro Monat mit SSL, täglichen Backups und Updates, Hosting + SEO ${hostingSeo} und Rundum ${rundum} mit laufenden kleinen Änderungen. Ab der Aufschaltung testen Sie das Hosting ${hostingTrialDays} Tage gratis, beim Paket KMU sind Hosting und SEO ${kmuFreeMonths} Monate gratis. Die Domain steht separat in der Offerte. Für Webseiten anderer Anbieter richtet sich der Preis nach System und Umfang, Sie erhalten nach dem kostenlosen Erstgespräch eine Offerte.`;
      case "gbp":
        return `Bei Google ist das Profil kostenlos. Die Einrichtung durch uns kostet ${chf(gbpPrice.setup)} einmalig, die freiwillige Betreuung ${chf(gbpPrice.monthly)} pro Monat.`;
    }
  }
  const hostingLine = `L'hébergement commence à ${hosting} par mois, résiliable chaque mois.`;
  switch (topic) {
    case "website":
      return `Chez Webnova, un site d'une page (Starter) coûte ${starter} et un site de 2 à 5 pages (PME) ${kmu}, en paiement unique. Les projets plus grands avec davantage de pages, une boutique en ligne ou des fonctions spéciales (Professional) sont proposés sur devis dès ${professional}. ${hostingLine} Si vous voulez d'abord voir votre page d'accueil, une démo design coûte ${demo} et elle est déduite à la commande.`;
    case "redesign":
      return `Une refonte suit les mêmes formules qu'un nouveau site : Starter ${starter}, PME ${kmu} et Professional dès ${professional}. La reprise de vos contenus actuels et les redirections des anciennes adresses figurent comme poste séparé dans le devis. ${hostingLine}`;
    case "shop":
      return `Chez Webnova, les boutiques en ligne font partie de la formule Professional et commencent à ${professional}. Le prix exact dépend de l'assortiment, des moyens de paiement comme TWINT et carte, de la livraison et des interfaces. Vous le recevez dans un devis écrit après un premier entretien gratuit. ${hostingLine}`;
    case "care":
      return `Pour les sites créés par Webnova, il existe trois formules d'hébergement, mensuelles et résiliables en tout temps : Hébergement ${hosting} par mois avec SSL, sauvegardes quotidiennes et mises à jour, Hébergement + SEO ${hostingSeo} et Tout compris ${rundum} avec les petites modifications courantes. Dès la mise en ligne, vous testez l'hébergement gratuitement pendant ${hostingTrialDays} jours, avec la formule PME l'hébergement avec SEO est offert ${kmuFreeMonths} mois. Le nom de domaine figure séparément dans le devis. Pour les sites d'autres prestataires, le prix dépend du système et de l'ampleur : vous recevez un devis après le premier entretien gratuit.`;
    case "gbp":
      return `Chez Google, la fiche est gratuite. La mise en place par nos soins coûte ${chf(gbpPrice.setup)} une fois, le suivi facultatif ${chf(gbpPrice.monthly)} par mois.`;
  }
}
