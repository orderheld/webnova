import type { Locale, Localized } from "./types";

/*
 * Public prices, set by Ferhat on 2026-10-13 (10:06: «immer "ab" preise nennen», the Starter package cheap; 14:00 the
 * price review: Google care in Rundum, no demo refund, domain amount; 14:41 «sicher ein paket unter 1000 franken haben
 * ... etwas höher als webxon sein ca 100 fr. jeweils»: Starter 890 up to 3 pages at 500 each, Individuell ab 6'600;
 * 16:29 «ok» to the price thread's gaps: Professional ab 4'950 (15:37 «wollen wir ab 4850.- machen professionell?», kept
 * above webxon), KMU up to 8 pages at 500 each, a second language at 140 per page, hosting 42): a paid design demo credited on order, website packages paid once and shown as starting prices, hosting optional per
 * month. Nothing is free for a period (13:17 «ich möchte alles verrechnen können»): hosting is billed from the launch.
 * The packages are the defaults of the admin calculator (src/lib/admin/calculator.ts): change both together.
 * Every price on the site (Preise page, service and industry pages, FAQ answers, llms.txt) is built from this file.
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

/** Each page beyond the package scope, e.g. a second or third page for Starter. */
export const extraPagePrice = 500;
/** Starter stops here; from one page more the package KMU applies. */
export const starterMaxPages = 3;
/** Pages in the KMU price; up to kmuMaxPages each further page costs extraPagePrice, from one more Professional applies. */
export const kmuPages = 5;
export const kmuMaxPages = 8;
/** Second language for Starter, KMU and Professional, per page, without the translation. Three or more languages: Individuell. */
export const secondLanguagePagePrice = 140;

/** Card line of Starter, KMU and Professional for the second language. */
export const secondLanguageLine: Localized<string> = {
  de: `Zweite Sprache (z. B. Französisch): ${chf(secondLanguagePagePrice)} pro Seite`,
  fr: `Deuxième langue (p. ex. allemand) : ${chf(secondLanguagePagePrice)} par page`,
};

/** Extra pages and the second language in two sentences, for FAQ answers, the cost guide and llms.txt. */
export const extrasNote: Localized<string> = {
  de: `Jede weitere Seite kostet ${chf(extraPagePrice)}: im Starter bis ${starterMaxPages} Seiten, im KMU bis ${kmuMaxPages} Seiten. Eine zweite Sprache kostet ${chf(secondLanguagePagePrice)} pro Seite, die Übersetzung liefern Sie oder wir offerieren sie separat.`,
  fr: `Chaque page supplémentaire coûte ${chf(extraPagePrice)} : avec Starter jusqu'à ${starterMaxPages} pages, avec PME jusqu'à ${kmuMaxPages} pages. Une deuxième langue coûte ${chf(secondLanguagePagePrice)} par page, vous fournissez la traduction ou nous la proposons séparément.`,
};
/** Approximate yearly cost of a .ch domain, billed separately. */
export const domainYearly = 20;

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
      de: ["Ihre künftige Startseite, gestaltet von uns", "In Ihren Farben und mit Ihrem Logo", "Zum Anschauen, programmiert wird erst nach Ihrem OK", "Wird bei Auftrag vom Preis abgezogen"],
      fr: ["Votre future page d'accueil, conçue par nous", "Dans vos couleurs et avec votre logo", "À regarder, le développement suit votre accord", "Déduite du prix à la commande"],
    },
    cta: { de: "Demo anfragen", fr: "Demander la démo" },
  },
  {
    id: "starter",
    name: { de: "Starter", fr: "Starter" },
    price: 890,
    from: true,
    note: { de: "einmalig", fr: "paiement unique" },
    service: "webdesign",
    forWhom: {
      de: "Eine Seite mit allem Wichtigen: für neue Firmen, Einzelunternehmen und klare Angebote.",
      fr: "Une page avec l'essentiel : pour les nouvelles entreprises, les indépendants et les offres claires.",
    },
    features: {
      de: ["Onepager: eine Seite mit allen Infos", "Individuelles Design für Handy und Computer", "Kontaktformular", "Google-Grundlagen", "In der Regel in 1 bis 2 Wochen online", `Bis ${starterMaxPages} Seiten: jede weitere Seite ${chf(extraPagePrice)}`, secondLanguageLine.de],
      fr: ["One-page : une page avec toutes les infos", "Design sur mesure pour mobile et ordinateur", "Formulaire de contact", "Bases Google", "En ligne en général en 1 à 2 semaines", `Jusqu'à ${starterMaxPages} pages : chaque page supplémentaire ${chf(extraPagePrice)}`, secondLanguageLine.fr],
    },
    cta: { de: "Paket anfragen", fr: "Demander cette formule" },
  },
  {
    id: "kmu",
    name: { de: "KMU", fr: "PME" },
    price: 2790,
    from: true,
    note: { de: "einmalig", fr: "paiement unique" },
    service: "webdesign",
    recommended: true,
    forWhom: {
      de: "Mehrere Seiten für Betriebe, die über ihre Webseite Anfragen gewinnen wollen.",
      fr: "Plusieurs pages pour les entreprises qui veulent obtenir des demandes par leur site.",
    },
    features: {
      de: [
        `Bis ${kmuPages} Seiten, jede weitere Seite ${chf(extraPagePrice)} bis ${kmuMaxPages} Seiten`,
        "Eigenes Design mit dezenten Bewegungen",
        "Kontaktformular und Online-Termine",
        "Google-Unternehmensprofil eingerichtet",
        "Google-Grundlagen und Besucherzahlen ohne Cookies",
        "In der Regel in rund 3 Wochen online",
        secondLanguageLine.de,
      ],
      fr: [
        `Jusqu'à ${kmuPages} pages, chaque page supplémentaire ${chf(extraPagePrice)} jusqu'à ${kmuMaxPages} pages`,
        "Design propre avec mouvements discrets",
        "Formulaire de contact et rendez-vous en ligne",
        "Fiche Google Business Profile créée",
        "Bases Google et visites mesurées sans cookies",
        "En ligne en général en 3 semaines environ",
        secondLanguageLine.fr,
      ],
    },
    cta: { de: "Paket anfragen", fr: "Demander cette formule" },
  },
  {
    id: "professional",
    name: { de: "Professional", fr: "Professional" },
    price: 4950,
    from: true,
    note: { de: "einmalig", fr: "paiement unique" },
    service: "webdesign",
    forWhom: {
      de: "Für Betriebe mit mehreren Angeboten, Standorten oder viel Inhalt.",
      fr: "Pour les entreprises avec plusieurs offres, sites ou beaucoup de contenu.",
    },
    features: {
      de: ["Bis 10 Seiten", "Designkonzept mit Animationen", "Inhalte selbst bearbeiten (CMS)", "Blog oder News", "Erweiterte Google-Grundlagen", "Google-Unternehmensprofil eingerichtet", "Schulung bei der Übergabe", secondLanguageLine.de],
      fr: ["Jusqu'à 10 pages", "Concept graphique avec animations", "Contenus modifiables vous-même (CMS)", "Blog ou actualités", "Bases Google avancées", "Fiche Google Business Profile créée", "Formation à la remise", secondLanguageLine.fr],
    },
    cta: { de: "Paket anfragen", fr: "Demander cette formule" },
  },
  {
    id: "individuell",
    name: { de: "Individuell", fr: "Sur mesure" },
    price: 6600,
    from: true,
    note: { de: "individuell offeriert", fr: "sur devis" },
    service: "webdesign",
    forWhom: {
      de: "Für Onlineshops, Web-Apps und Auftritte mit mehr als 10 Seiten.",
      fr: "Pour les boutiques en ligne, les applications web et les sites de plus de 10 pages.",
    },
    features: {
      de: ["Onlineshop mit TWINT und Karte", "Web-App, Buchungssystem oder Kundenbereich", "Mehr als 10 Seiten oder drei und mehr Sprachen", "Verbindung mit Ihrer Kasse und anderen Programmen", "Zeitplan nach Umfang", "Preis nach Aufwand, schriftlich offeriert"],
      fr: ["Boutique en ligne avec TWINT et carte", "Application web, réservations ou espace client", "Plus de 10 pages ou trois langues et plus", "Liaison avec votre caisse et d'autres logiciels", "Calendrier selon l'ampleur", "Prix selon le travail, devis écrit"],
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
    price: 42,
    items: {
      de: ["Hosting mit SSL-Zertifikat", "Tägliche Backups", "Technische Updates und Sicherheit", "Persönlicher Support"],
      fr: ["Hébergement avec certificat SSL", "Sauvegardes quotidiennes", "Mises à jour techniques et sécurité", "Support personnel"],
    },
  },
  {
    id: "seo",
    name: { de: "Hosting + SEO", fr: "Hébergement + SEO" },
    price: 65,
    items: {
      de: ["Alles aus Hosting", "Wir arbeiten laufend an Ihrer Sichtbarkeit bei Google"],
      fr: ["Tout l'hébergement", "Nous travaillons en continu à votre visibilité sur Google"],
    },
  },
  {
    id: "rundum",
    name: { de: "Rundum", fr: "Tout compris" },
    price: 95,
    items: {
      de: ["Alles aus Hosting + SEO", "Betreuung Ihres Google-Unternehmensprofils", "Kleine Änderungen machen wir laufend für Sie", "Ein Ansprechpartner für alles"],
      fr: ["Tout l'hébergement + SEO", "Suivi de votre fiche Google Business Profile", "Nous faisons les petites modifications pour vous", "Un seul interlocuteur pour tout"],
    },
  },
];

/** Google Business Profile: setup once, care optional per month (also part of the Rundum tier). The setup is a starting price, the care a fixed monthly price. */
export const gbpPrice = { setup: 390, monthly: 55 };

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

/**
 * The note shown next to the prices. Ferhat 2026-10-13 15:39: «Bitte nirgendwo erwähnen, dass ich nicht
 * mehrwertsteuerpflichtig bin»: no word on MWST anywhere (not «exkl.», not «inkl.»), only the currency.
 */
export const currencyNote: Localized<string> = {
  de: "Alle Preise in CHF.",
  fr: "Tous les prix en CHF.",
};

/** Domain line for price texts: amount per year, billed separately. */
export const domainNote: Localized<string> = {
  de: `Die Domain kostet ca. ${chf(domainYearly)} pro Jahr und wird separat verrechnet.`,
  fr: `Le nom de domaine coûte env. ${chf(domainYearly)} par an et est facturé séparément.`,
};

/** The fine print under the prices: when the demo and hosting are billed, and the domain. */
export const billingNote: Localized<string> = {
  de: `Zur Design-Demo: Sie erhalten die Rechnung, wenn die Demo fertig ist. Bestellen Sie danach die Webseite, ziehen wir die ${chf(packagePrice("demo"))} vom Preis ab. Zum Hosting: Es wird ab der Aufschaltung monatlich verrechnet und ist auf Ende Monat kündbar. ${domainNote.de}`,
  fr: `Démo design : vous recevez la facture quand la démo est prête. Si vous commandez ensuite le site, nous déduisons les ${chf(packagePrice("demo"))} du prix. Hébergement : il est facturé chaque mois dès la mise en ligne et résiliable pour la fin du mois. ${domainNote.fr}`,
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
      return de ? `Einrichtung ${fromPrice(locale, gbpPrice.setup)}, Betreuung ${chf(gbpPrice.monthly)} pro Monat` : `Mise en place ${fromPrice(locale, gbpPrice.setup)}, suivi ${chf(gbpPrice.monthly)} par mois`;
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

/** Formatted amounts for page texts, without "ab": the texts add "ab" / "dès" themselves, e.g. `ab ${prices.starter}`. */
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

/** The three standard packages in one phrase with their starting prices, for FAQ answers and guides. */
export function packageSummary(locale: Locale): string {
  const [starter, kmu, professional] = (["starter", "kmu", "professional"] as const).map((id) => packagePriceLabel(locale, pricePackages.find((p) => p.id === id)!));
  return locale === "de"
    ? `Starter (Onepager) ${starter}, KMU (bis ${kmuPages} Seiten, erweiterbar auf ${kmuMaxPages}) ${kmu} und Professional (bis 10 Seiten) ${professional}`
    : `Starter (une page) ${starter}, PME (jusqu'à ${kmuPages} pages, extensible à ${kmuMaxPages}) ${kmu} et Professional (jusqu'à 10 pages) ${professional}`;
}

/** Answer to "Was kostet ...?" in FAQs, built from the prices above. */
export function costAnswer(locale: Locale, topic: PriceTopic): string {
  const { demo, shop, hosting, hostingSeo, rundum } = prices;
  if (locale === "de") {
    const hostingLine = `Hosting gibt es ab ${hosting} pro Monat, monatlich kündbar.`;
    switch (topic) {
      case "website":
        return `Die Webseiten-Pakete bei Webnova kosten einmalig: ${packageSummary("de")}. ${extrasNote.de} Ab ${starterMaxPages + 1} Seiten gilt das Paket KMU, ab ${kmuMaxPages + 1} Seiten Professional. Onlineshops, Web-Apps, grössere Auftritte und Webseiten in drei und mehr Sprachen offerieren wir individuell ab ${shop}. ${hostingLine} Möchten Sie Ihre Startseite zuerst sehen, erhalten Sie für ${demo} eine Design-Demo, die bei Auftrag angerechnet wird.`;
      case "redesign":
        return `Für eine erneuerte Webseite gelten dieselben Pakete wie für eine neue: ${packageSummary("de")}, grössere Projekte ab ${shop}. Die Übernahme Ihrer bisherigen Inhalte und Weiterleitungen der alten Adressen stehen als eigene Position in der Offerte. ${hostingLine}`;
      case "shop":
        return `Onlineshops offerieren wir bei Webnova individuell ab ${shop}. Der genaue Preis hängt von Sortiment, Zahlungsarten wie TWINT und Karte, Versand und Anbindungen ab. Sie erhalten ihn nach einem kostenlosen Erstgespräch in einer schriftlichen Offerte. ${hostingLine}`;
      case "care":
        return `Für Webseiten von Webnova gibt es drei Hosting-Pakete, monatlich und jederzeit kündbar: Hosting ${hosting} pro Monat mit SSL, täglichen Backups und Updates, Hosting + SEO ${hostingSeo} und Rundum ${rundum} mit laufenden kleinen Änderungen und der Betreuung Ihres Google-Unternehmensprofils. Verrechnet wird ab der Aufschaltung. ${domainNote.de} Für Webseiten anderer Anbieter richtet sich der Preis nach System und Umfang, Sie erhalten nach dem kostenlosen Erstgespräch eine Offerte.`;
      case "gbp":
        return `Bei Google ist das Profil kostenlos. Die Einrichtung durch uns kostet einmalig ${fromPrice(locale, gbpPrice.setup)}, die freiwillige Betreuung ${chf(gbpPrice.monthly)} pro Monat. Im Hosting-Paket Rundum (${rundum} pro Monat) gehört die Betreuung dazu. Bei den Webseiten-Paketen KMU und Professional ist die Einrichtung Teil des Paketpreises.`;
    }
  }
  const hostingLine = `L'hébergement commence à ${hosting} par mois, résiliable chaque mois.`;
  switch (topic) {
    case "website":
      return `Les formules site internet de Webnova se paient une fois : ${packageSummary("fr")}. ${extrasNote.fr} Dès ${starterMaxPages + 1} pages, la formule PME s'applique, dès ${kmuMaxPages + 1} pages la formule Professional. Les boutiques en ligne, applications web, sites plus grands et sites en trois langues ou plus sont proposés sur devis dès ${shop}. ${hostingLine} Si vous voulez d'abord voir votre page d'accueil, une démo design coûte ${demo} et elle est déduite à la commande.`;
    case "redesign":
      return `Une refonte suit les mêmes formules qu'un nouveau site : ${packageSummary("fr")}, les projets plus grands dès ${shop}. La reprise de vos contenus actuels et les redirections des anciennes adresses figurent comme poste séparé dans le devis. ${hostingLine}`;
    case "shop":
      return `Chez Webnova, les boutiques en ligne sont proposées sur devis dès ${shop}. Le prix exact dépend de l'assortiment, des moyens de paiement comme TWINT et carte, de la livraison et des interfaces. Vous le recevez dans un devis écrit après un premier entretien gratuit. ${hostingLine}`;
    case "care":
      return `Pour les sites créés par Webnova, il existe trois formules d'hébergement, mensuelles et résiliables en tout temps : Hébergement ${hosting} par mois avec SSL, sauvegardes quotidiennes et mises à jour, Hébergement + SEO ${hostingSeo} et Tout compris ${rundum} avec les petites modifications courantes et le suivi de votre fiche Google Business Profile. La facturation commence à la mise en ligne. ${domainNote.fr} Pour les sites d'autres prestataires, le prix dépend du système et de l'ampleur : vous recevez un devis après le premier entretien gratuit.`;
    case "gbp":
      return `Chez Google, la fiche est gratuite. La mise en place par nos soins coûte à partir de ${chf(gbpPrice.setup)} en paiement unique, le suivi facultatif ${chf(gbpPrice.monthly)} par mois. La formule d'hébergement Tout compris (${rundum} par mois) comprend le suivi. Dans les formules PME et Professional pour les sites internet, la mise en place fait partie du prix de la formule.`;
  }
}
