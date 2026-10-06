import type { Localized } from "./types";

export interface Reference {
  key: string;
  name: string;
  /** Only set while the site is reachable, so we never link to a dead page. */
  url?: string;
  domain: string;
  /** Screenshot or key visual in /public/referenzen. Without one, a typographic card is shown. */
  image?: string;
  /** Brand colours for the typographic card and accents. */
  colors: { bg: string; fg: string; accent: string };
  content: Localized<{ industry: string; place?: string; summary: string; scope: string[] }>;
}

export const references: Reference[] = [
  {
    key: "orderheld",
    name: "orderheld",
    url: "https://orderheld.ch",
    domain: "orderheld.ch",
    image: "/referenzen/orderheld.jpg",
    colors: { bg: "#f6f7f7", fg: "#111515", accent: "#00a651" },
    content: {
      de: {
        industry: "Bestellplattform für Restaurants",
        place: "Schweiz",
        summary:
          "Eine eigene Bestellplattform für Schweizer Restaurants: Gäste bestellen online, die Bestellung landet direkt auf dem Gerät in der Küche und der Bon wird gedruckt.",
        scope: ["Webseite & Bestellseiten", "Küchen-, Fahrer- & Admin-App", "Kasse & Kiosk", "Lokale SEO-Seiten"],
      },
      fr: {
        industry: "Plateforme de commande pour restaurants",
        place: "Suisse",
        summary:
          "Une plateforme de commande pour les restaurants suisses : les clients commandent en ligne, la commande arrive directement sur l'appareil en cuisine et le ticket s'imprime.",
        scope: ["Site web & pages de commande", "Apps cuisine, livreur & admin", "Caisse & borne", "Pages SEO locales"],
      },
    },
  },
  {
    key: "ava-catering",
    name: "AVA Catering",
    url: "https://avacatering.ch",
    domain: "avacatering.ch",
    image: "/referenzen/ava-catering.jpg",
    colors: { bg: "#fbf7f0", fg: "#4a5822", accent: "#e8650a" },
    content: {
      de: {
        industry: "Catering",
        place: "Pfaffnau LU",
        summary:
          "Webauftritt für ein Catering mit hausgemachten Buffets: Angebot in Kapiteln, Galerie und ein Anfrage-Assistent, der jedes Buffet direkt vorausgefüllt anfragen lässt.",
        scope: ["Logo-Varianten & Design", "Webseite mit Anfrage-Assistent", "Admin mit Kalender & Antwortvorlagen", "Galerie mit Bild-Upload"],
      },
      fr: {
        industry: "Traiteur",
        place: "Pfaffnau LU",
        summary:
          "Site pour un traiteur aux buffets faits maison : offre en chapitres, galerie et un assistant de demande qui pré-remplit chaque buffet.",
        scope: ["Déclinaisons du logo & design", "Site avec assistant de demande", "Admin avec calendrier & modèles de réponse", "Galerie avec upload d'images"],
      },
    },
  },
  {
    key: "gyan-hair-salon",
    name: "GYAN Hair Salon",
    // gyanhairsalon.ch answered 404 on 2026-10-06; add url once the site is live.
    domain: "gyanhairsalon.ch",
    colors: { bg: "#151515", fg: "#f3eee6", accent: "#c9a46a" },
    content: {
      de: {
        industry: "Coiffeursalon",
        summary: "Moderner Webauftritt für einen Coiffeursalon: Leistungen, Stimmung und Kontakt auf einen Blick, optimiert fürs Smartphone.",
        scope: ["Webdesign", "Mobile first", "Lokale Sichtbarkeit"],
      },
      fr: {
        industry: "Salon de coiffure",
        summary: "Site moderne pour un salon de coiffure : prestations, ambiance et contact en un coup d'œil, optimisé pour le smartphone.",
        scope: ["Webdesign", "Mobile first", "Visibilité locale"],
      },
    },
  },
  {
    key: "ss-express",
    name: "SS Express",
    domain: "ssexpress.ch",
    colors: { bg: "#0f2a4a", fg: "#ffffff", accent: "#ffb400" },
    content: {
      de: {
        industry: "Unternehmenswebseite",
        summary: "Klarer, schneller Webauftritt mit direktem Weg zur Anfrage.",
        scope: ["Webdesign", "Mobile first"],
      },
      fr: {
        industry: "Site d'entreprise",
        summary: "Un site clair et rapide avec un chemin direct vers la demande.",
        scope: ["Webdesign", "Mobile first"],
      },
    },
  },
];
