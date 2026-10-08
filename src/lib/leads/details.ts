import type { LeadDetails } from "@/db/schema";
import type { serviceOptions } from "./options";

/**
 * Service-specific questions of the request form ("Erstberatung").
 * Shared by the client form, the server validation, the admin lead page and the notification mail.
 * Every question is optional: the form stays short and nobody gets stuck.
 */

type L = { de: string; fr: string };
type Opt = { v: string } & L;

export type Question =
  | { key: string; type: "single"; label: L; hint?: L; options: Opt[]; default?: string[] }
  | { key: string; type: "multi"; label: L; hint?: L; options: Opt[]; default?: string[] }
  /** url: bound to the lead's websiteUrl column (shared by all services), not stored in details. */
  | { key: string; type: "text"; label: L; hint?: L; placeholder?: L; url?: boolean }
  | { key: string; type: "textarea"; label: L; hint?: L; placeholder?: L; url?: boolean };

export type ServiceKey = (typeof serviceOptions)[number];

export interface ServiceQuestions {
  title: L;
  lead: L;
  questions: Question[];
}

const unknown: Opt = { v: "unknown", de: "Weiss nicht", fr: "Je ne sais pas" };

const urlQ = (key = "url"): Question => ({
  key,
  type: "text",
  url: true,
  label: { de: "Adresse der heutigen Webseite", fr: "Adresse du site actuel" },
  placeholder: { de: "www.ihre-firma.ch", fr: "www.votre-entreprise.ch" },
});

const pagesOptions: Opt[] = [
  { v: "1", de: "1 Seite (Onepager)", fr: "1 page (one-pager)" },
  { v: "2-5", de: "Bis 5 Seiten", fr: "Jusqu'à 5 pages" },
  { v: "5-10", de: "5 bis 10 Seiten", fr: "5 à 10 pages" },
  { v: "10+", de: "Mehr als 10", fr: "Plus de 10" },
  unknown,
];

export const serviceQuestions: Record<ServiceKey, ServiceQuestions> = {
  webdesign: {
    title: { de: "Neue Webseite", fr: "Nouveau site" },
    lead: { de: "Ein paar Eckdaten genügen. Die Details besprechen wir gemeinsam.", fr: "Quelques repères suffisent. Nous verrons les détails ensemble." },
    questions: [
      { key: "pages", type: "single", label: { de: "Wie viele Seiten ungefähr?", fr: "Combien de pages environ ?" }, options: pagesOptions },
      {
        key: "languages",
        type: "multi",
        label: { de: "In welchen Sprachen?", fr: "Dans quelles langues ?" },
        options: [
          { v: "de", de: "Deutsch", fr: "Allemand" },
          { v: "fr", de: "Französisch", fr: "Français" },
          { v: "en", de: "Englisch", fr: "Anglais" },
          { v: "it", de: "Italienisch", fr: "Italien" },
        ],
        default: ["$locale"],
      },
      {
        key: "features",
        type: "multi",
        label: { de: "Welche Funktionen brauchen Sie?", fr: "De quelles fonctions avez-vous besoin ?" },
        hint: { de: "Mehrfachauswahl möglich", fr: "Plusieurs choix possibles" },
        options: [
          { v: "contact", de: "Kontaktformular", fr: "Formulaire de contact" },
          { v: "booking", de: "Online-Termine", fr: "Prise de rendez-vous" },
          { v: "reservation", de: "Tischreservation", fr: "Réservation de table" },
          { v: "blog", de: "Blog / News", fr: "Blog / actualités" },
          { v: "members", de: "Mitgliederbereich", fr: "Espace membres" },
          { v: "shop", de: "Kleiner Shop", fr: "Petite boutique" },
        ],
      },
      {
        key: "content",
        type: "single",
        label: { de: "Sind Texte und Bilder vorhanden?", fr: "Les textes et images sont-ils prêts ?" },
        options: [
          { v: "yes", de: "Ja, alles da", fr: "Oui, tout est prêt" },
          { v: "partly", de: "Teilweise", fr: "En partie" },
          { v: "no", de: "Nein, brauche Hilfe", fr: "Non, j'ai besoin d'aide" },
        ],
      },
    ],
  },
  redesign: {
    title: { de: "Redesign / Relaunch", fr: "Refonte" },
    lead: { de: "Damit wir Ihre heutige Webseite vorab anschauen können.", fr: "Pour que nous puissions regarder votre site actuel à l'avance." },
    questions: [
      urlQ(),
      {
        key: "pains",
        type: "multi",
        label: { de: "Was stört Sie am meisten?", fr: "Qu'est-ce qui vous dérange le plus ?" },
        hint: { de: "Mehrfachauswahl möglich", fr: "Plusieurs choix possibles" },
        options: [
          { v: "outdated", de: "Wirkt veraltet", fr: "Paraît dépassé" },
          { v: "mobile", de: "Nicht gut auf dem Handy", fr: "Mal adapté au mobile" },
          { v: "slow", de: "Langsam", fr: "Lent" },
          { v: "leads", de: "Bringt keine Anfragen", fr: "N'apporte pas de demandes" },
          { v: "google", de: "Bei Google nicht sichtbar", fr: "Peu visible sur Google" },
          { v: "editing", de: "Schwer zu bearbeiten", fr: "Difficile à modifier" },
        ],
      },
      { key: "pages", type: "single", label: { de: "Wie viele Seiten hat sie heute?", fr: "Combien de pages compte-t-il aujourd'hui ?" }, options: pagesOptions },
      {
        key: "keepContent",
        type: "single",
        label: { de: "Sollen Inhalte übernommen werden?", fr: "Faut-il reprendre les contenus ?" },
        options: [
          { v: "all", de: "Ja, grösstenteils", fr: "Oui, en grande partie" },
          { v: "some", de: "Teilweise", fr: "En partie" },
          { v: "new", de: "Nein, alles neu", fr: "Non, tout refaire" },
          unknown,
        ],
      },
    ],
  },
  shop: {
    title: { de: "Onlineshop", fr: "Boutique en ligne" },
    lead: { de: "So können wir die passende Shop-Lösung einschätzen.", fr: "Pour évaluer la solution de boutique adaptée." },
    questions: [
      {
        key: "products",
        type: "single",
        label: { de: "Wie viele Produkte ungefähr?", fr: "Combien de produits environ ?" },
        options: [
          { v: "1-20", de: "Bis 20", fr: "Jusqu'à 20" },
          { v: "20-100", de: "20 bis 100", fr: "20 à 100" },
          { v: "100-500", de: "100 bis 500", fr: "100 à 500" },
          { v: "500+", de: "Mehr als 500", fr: "Plus de 500" },
          unknown,
        ],
      },
      {
        key: "platform",
        type: "single",
        label: { de: "Haben Sie bereits einen Shop?", fr: "Avez-vous déjà une boutique ?" },
        options: [
          { v: "none", de: "Nein, neu", fr: "Non, nouvelle" },
          { v: "shopify", de: "Ja, Shopify", fr: "Oui, Shopify" },
          { v: "woocommerce", de: "Ja, WooCommerce", fr: "Oui, WooCommerce" },
          { v: "wix", de: "Ja, Wix", fr: "Oui, Wix" },
          { v: "other", de: "Ja, anderes System", fr: "Oui, autre système" },
        ],
      },
      {
        key: "payments",
        type: "multi",
        label: { de: "Welche Zahlungsarten?", fr: "Quels moyens de paiement ?" },
        options: [
          { v: "twint", de: "TWINT", fr: "TWINT" },
          { v: "card", de: "Kreditkarte", fr: "Carte de crédit" },
          { v: "invoice", de: "Rechnung", fr: "Facture" },
          { v: "prepay", de: "Vorkasse (QR-Rechnung)", fr: "Paiement anticipé (QR-facture)" },
        ],
        default: ["twint", "card"],
      },
      {
        key: "delivery",
        type: "multi",
        label: { de: "Wie kommen die Produkte zum Kunden?", fr: "Comment les produits arrivent-ils au client ?" },
        options: [
          { v: "shipping", de: "Versand", fr: "Envoi postal" },
          { v: "pickup", de: "Abholung", fr: "Retrait sur place" },
          { v: "local", de: "Eigene Lieferung", fr: "Livraison propre" },
          { v: "digital", de: "Digital (Gutscheine, Downloads)", fr: "Numérique (bons, téléchargements)" },
        ],
      },
      {
        key: "extras",
        type: "multi",
        label: { de: "Was braucht der Shop sonst noch?", fr: "De quoi la boutique a-t-elle encore besoin ?" },
        options: [
          { v: "variants", de: "Varianten (Grösse, Farbe)", fr: "Variantes (taille, couleur)" },
          { v: "stock", de: "Lagerbestand", fr: "Gestion du stock" },
          { v: "pos", de: "Verbindung zur Kasse", fr: "Lien avec la caisse" },
          { v: "b2b", de: "Preise für Firmenkunden", fr: "Prix pour clients professionnels" },
        ],
      },
    ],
  },
  seo: {
    title: { de: "SEO / Google-Ranking", fr: "SEO / référencement" },
    lead: { de: "Wo und wofür möchten Sie bei Google gefunden werden?", fr: "Où et pour quoi souhaitez-vous être trouvé sur Google ?" },
    questions: [
      urlQ(),
      {
        key: "places",
        type: "text",
        label: { de: "In welchen Orten oder Regionen?", fr: "Dans quelles localités ou régions ?" },
        placeholder: { de: "z.B. Solothurn, Grenchen, Bern", fr: "p. ex. Bienne, Neuchâtel, Fribourg" },
      },
      {
        key: "keywords",
        type: "text",
        label: { de: "Für welche Leistungen oder Begriffe?", fr: "Pour quelles prestations ou quels mots-clés ?" },
        placeholder: { de: "z.B. Coiffeur, Badsanierung, Treuhand", fr: "p. ex. coiffeur, rénovation de salle de bain" },
      },
      {
        key: "gbp",
        type: "single",
        label: { de: "Haben Sie ein Google Unternehmensprofil?", fr: "Avez-vous une fiche Google Business Profile ?" },
        hint: { de: "Der Eintrag mit Karte und Bewertungen in der Google-Suche", fr: "La fiche avec carte et avis dans la recherche Google" },
        options: [
          { v: "yes", de: "Ja", fr: "Oui" },
          { v: "no", de: "Nein", fr: "Non" },
          unknown,
        ],
      },
    ],
  },
  ads: {
    title: { de: "Google & Social Ads", fr: "Google & Social Ads" },
    lead: { de: "Damit wir die passenden Kanäle vorschlagen können.", fr: "Pour vous proposer les bons canaux." },
    questions: [
      {
        key: "channels",
        type: "multi",
        label: { de: "Auf welchen Kanälen?", fr: "Sur quels canaux ?" },
        options: [
          { v: "google", de: "Google", fr: "Google" },
          { v: "meta", de: "Instagram / Facebook", fr: "Instagram / Facebook" },
          { v: "linkedin", de: "LinkedIn", fr: "LinkedIn" },
          { v: "advise", de: "Bitte beraten", fr: "Conseillez-moi" },
        ],
      },
      {
        key: "goal",
        type: "single",
        label: { de: "Was ist das Ziel?", fr: "Quel est l'objectif ?" },
        options: [
          { v: "leads", de: "Mehr Anfragen", fr: "Plus de demandes" },
          { v: "sales", de: "Mehr Verkäufe", fr: "Plus de ventes" },
          { v: "awareness", de: "Bekanntheit", fr: "Notoriété" },
          { v: "recruiting", de: "Personal finden", fr: "Recruter" },
        ],
      },
      {
        key: "adBudget",
        type: "single",
        label: { de: "Monatliches Werbebudget (Klickkosten)?", fr: "Budget publicitaire mensuel (coûts des clics) ?" },
        hint: { de: "Geht direkt an Google oder Meta", fr: "Versé directement à Google ou Meta" },
        options: [
          { v: "lt300", de: "Bis CHF 300", fr: "Jusqu'à CHF 300" },
          { v: "300-1000", de: "CHF 300 bis 1'000", fr: "CHF 300 à 1'000" },
          { v: "1000-3000", de: "CHF 1'000 bis 3'000", fr: "CHF 1'000 à 3'000" },
          { v: "gt3000", de: "Über CHF 3'000", fr: "Plus de CHF 3'000" },
          unknown,
        ],
      },
      {
        key: "experience",
        type: "single",
        label: { de: "Haben Sie schon Werbung geschaltet?", fr: "Avez-vous déjà fait de la publicité en ligne ?" },
        options: [
          { v: "yes", de: "Ja", fr: "Oui" },
          { v: "no", de: "Nein, zum ersten Mal", fr: "Non, première fois" },
        ],
      },
    ],
  },
  branding: {
    title: { de: "Logo & Branding", fr: "Logo & branding" },
    lead: { de: "Kurz zum Stand Ihres Auftritts.", fr: "Où en est votre image aujourd'hui ?" },
    questions: [
      {
        key: "logo",
        type: "single",
        label: { de: "Wie steht es um Ihr Logo?", fr: "Où en est votre logo ?" },
        options: [
          { v: "new", de: "Neues Logo gesucht", fr: "Nouveau logo" },
          { v: "refresh", de: "Bestehendes überarbeiten", fr: "Retravailler l'existant" },
          { v: "keep", de: "Logo bleibt, Rest neu", fr: "Le logo reste, le reste est nouveau" },
        ],
      },
      {
        key: "deliverables",
        type: "multi",
        label: { de: "Was brauchen Sie dazu?", fr: "De quoi avez-vous besoin en plus ?" },
        hint: { de: "Mehrfachauswahl möglich", fr: "Plusieurs choix possibles" },
        options: [
          { v: "cards", de: "Visitenkarten", fr: "Cartes de visite" },
          { v: "letterhead", de: "Briefpapier", fr: "Papier à lettres" },
          { v: "social", de: "Social-Media-Vorlagen", fr: "Modèles réseaux sociaux" },
          { v: "signage", de: "Beschriftung (Laden, Fahrzeug)", fr: "Signalétique (vitrine, véhicule)" },
          { v: "flyer", de: "Flyer / Prospekt", fr: "Flyer / brochure" },
          { v: "guide", de: "Styleguide", fr: "Charte graphique" },
        ],
      },
      {
        key: "style",
        type: "text",
        label: { de: "Vorlieben oder Vorbilder? (optional)", fr: "Préférences ou exemples ? (facultatif)" },
        placeholder: { de: "z.B. schlicht, edel, farbig", fr: "p. ex. sobre, élégant, coloré" },
      },
    ],
  },
  pos: {
    title: { de: "Kassensystem", fr: "Système de caisse" },
    lead: { de: "Damit wir die passende Kasse und Geräte vorschlagen können.", fr: "Pour vous proposer la caisse et le matériel adaptés." },
    questions: [
      {
        key: "type",
        type: "single",
        label: { de: "Für welchen Betrieb?", fr: "Pour quel type d'établissement ?" },
        options: [
          { v: "gastro", de: "Gastronomie", fr: "Restauration" },
          { v: "retail", de: "Detailhandel", fr: "Commerce de détail" },
          { v: "service", de: "Dienstleistung / Salon", fr: "Services / salon" },
          { v: "other", de: "Anderes", fr: "Autre" },
        ],
      },
      {
        key: "devices",
        type: "single",
        label: { de: "Wie viele Kassen oder Geräte?", fr: "Combien de caisses ou d'appareils ?" },
        options: [
          { v: "1", de: "1", fr: "1" },
          { v: "2-3", de: "2 bis 3", fr: "2 à 3" },
          { v: "4+", de: "4 oder mehr", fr: "4 ou plus" },
          unknown,
        ],
      },
      {
        key: "needs",
        type: "multi",
        label: { de: "Was soll dazugehören?", fr: "Que faut-il inclure ?" },
        hint: { de: "Mehrfachauswahl möglich", fr: "Plusieurs choix possibles" },
        options: [
          { v: "tables", de: "Tischplan", fr: "Plan de tables" },
          { v: "terminal", de: "Kartenterminal", fr: "Terminal de paiement" },
          { v: "printer", de: "Bon- / Küchendrucker", fr: "Imprimante tickets / cuisine" },
          { v: "handheld", de: "Mobile Bestellgeräte", fr: "Appareils de commande mobiles" },
          { v: "online", de: "Online-Bestellungen", fr: "Commandes en ligne" },
          { v: "stock", de: "Lagerverwaltung", fr: "Gestion du stock" },
        ],
      },
      {
        key: "current",
        type: "single",
        label: { de: "Haben Sie heute eine Kasse?", fr: "Avez-vous une caisse aujourd'hui ?" },
        options: [
          { v: "none", de: "Nein, Neueröffnung", fr: "Non, nouvelle ouverture" },
          { v: "replace", de: "Ja, soll ersetzt werden", fr: "Oui, à remplacer" },
        ],
      },
    ],
  },
  maintenance: {
    title: { de: "Wartung & Hosting", fr: "Maintenance & hébergement" },
    lead: { de: "Damit wir wissen, worum wir uns kümmern sollen.", fr: "Pour savoir de quoi nous devons nous occuper." },
    questions: [
      urlQ(),
      {
        key: "system",
        type: "single",
        label: { de: "Mit welchem System ist sie gebaut?", fr: "Avec quel système est-il construit ?" },
        options: [
          { v: "wordpress", de: "WordPress", fr: "WordPress" },
          { v: "wix", de: "Wix", fr: "Wix" },
          { v: "shopify", de: "Shopify", fr: "Shopify" },
          { v: "other", de: "Anderes", fr: "Autre" },
          unknown,
        ],
      },
      {
        key: "tasks",
        type: "multi",
        label: { de: "Was sollen wir übernehmen?", fr: "De quoi devons-nous nous charger ?" },
        hint: { de: "Mehrfachauswahl möglich", fr: "Plusieurs choix possibles" },
        options: [
          { v: "updates", de: "Updates & Sicherheit", fr: "Mises à jour & sécurité" },
          { v: "backups", de: "Backups", fr: "Sauvegardes" },
          { v: "content", de: "Inhalte ändern", fr: "Modifier les contenus" },
          { v: "hosting", de: "Hosting", fr: "Hébergement" },
          { v: "email", de: "Domain & E-Mail", fr: "Domaine & e-mail" },
        ],
      },
    ],
  },
  other: {
    title: { de: "Ihr Anliegen", fr: "Votre demande" },
    lead: { de: "Beschreiben Sie in ein paar Sätzen, worum es geht.", fr: "Décrivez en quelques phrases de quoi il s'agit." },
    questions: [
      {
        key: "description",
        type: "textarea",
        label: { de: "Worum geht es?", fr: "De quoi s'agit-il ?" },
        placeholder: { de: "z.B. Anbindung an unser Buchungssystem, Newsletter, Fotos", fr: "p. ex. lien avec notre système de réservation, newsletter, photos" },
      },
    ],
  },
};

/** Questions that are not tied to one service, stored under details.general. */
export const generalQuestions = {
  deadline: {
    key: "deadline",
    label: { de: "Gibt es einen fixen Termin? (optional)", fr: "Y a-t-il une date fixe ? (facultatif)" },
    placeholder: { de: "z.B. Eröffnung im März, Saisonstart", fr: "p. ex. ouverture en mars, début de saison" },
  },
} as const;

export const generalLabelsDe: Record<string, string> = { deadline: "Fixer Termin" };

/** Readable German rows per service for the admin page and the notification mail. */
export function describeDetails(details: LeadDetails | null | undefined): { service: string; title: string; rows: [string, string][] }[] {
  if (!details) return [];
  const groups: { service: string; title: string; rows: [string, string][] }[] = [];
  // catalogue order, "general" last
  const order = [...Object.keys(serviceQuestions), "general"];
  const entries = Object.entries(details).sort(([a], [b]) => order.indexOf(a) - order.indexOf(b));
  for (const [service, answers] of entries) {
    if (service === "general") {
      const rows = Object.entries(answers).map(([k, v]): [string, string] => [generalLabelsDe[k] ?? k, Array.isArray(v) ? v.join(", ") : v]);
      if (rows.length) groups.push({ service, title: "Allgemein", rows });
      continue;
    }
    const def = serviceQuestions[service as ServiceKey];
    if (!def) continue;
    const rows: [string, string][] = [];
    for (const q of def.questions) {
      const a = answers[q.key];
      if (a === undefined || a === "" || (Array.isArray(a) && !a.length)) continue;
      const optLabel = (v: string) => ("options" in q ? (q.options.find((o) => o.v === v)?.de ?? v) : v);
      rows.push([q.label.de.replace(/ \(optional\)$/, "").replace(/\?$/, ""), Array.isArray(a) ? a.map(optLabel).join(", ") : optLabel(a)]);
    }
    if (rows.length) groups.push({ service, title: def.title.de, rows });
  }
  return groups;
}
