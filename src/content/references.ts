import type { Localized } from "./types";

export interface ReferenceContent {
  industry: string;
  place?: string;
  /** One or two sentences for cards. */
  summary: string;
  scope: string[];
  /** Detail page: the starting point, in one paragraph. */
  challenge: string;
  /** Detail page: what we built, one paragraph each. */
  solution: string[];
  /** Detail page: three to four concrete features. */
  highlights: { title: string; text: string }[];
}

export interface Reference {
  key: string;
  name: string;
  domain: string;
  /** Screenshot or key visual in /public/referenzen. Without one, a typographic card is shown. */
  image?: string;
  /** Brand colours for the typographic card and accents. */
  colors: { bg: string; fg: string; accent: string };
  content: Localized<ReferenceContent>;
}

export const references: Reference[] = [
  {
    key: "orderheld",
    name: "orderheld",
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
        challenge:
          "Restaurants und Take-aways zahlen bei grossen Lieferplattformen hohe Provisionen und haben kaum Kontakt zu ihren Gästen. Gesucht war eine eigene Lösung, mit der Betriebe Bestellungen direkt annehmen, ohne den Ablauf in der Küche zu verkomplizieren.",
        solution: [
          "Wir haben orderheld als komplette Plattform entwickelt: Jedes Geschäft erhält eigene Bestellseiten mit Menü, Warenkorb, Abholung, Lieferung und Vorbestellung. Gäste sehen den Status ihrer Bestellung live.",
          "Hinter den Kulissen arbeiten drei Werkzeuge zusammen: ein Cockpit für Inhaber und Personal, ein Küchen-Terminal mit Zubereitungszeiten und automatischem Bon sowie eine Fahrer-Ansicht fürs Handy. Tagesabschlüsse mit MWST, Zahlarten und Export erledigt das System selbst.",
        ],
        highlights: [
          { title: "Eigene Bestellseiten", text: "Menü, Optionen und Preise pflegt jedes Geschäft selbst, inklusive Öffnungszeiten, Ferien und Liefergebieten." },
          { title: "Küchen-Terminal", text: "Neue Bestellungen erscheinen mit Ton, laufen durch die Spalten Küche, Bereit und Unterwegs und drucken den Bon." },
          { title: "Fahrer-App", text: "Lieferungen übernehmen, navigieren, anrufen und am Abend die Bargeld-Abrechnung sehen." },
          { title: "Abschlüsse & Abrechnung", text: "Tages-, Wochen- und Monatsabschluss mit Topsellern, MWST und Excel-Export." },
        ],
      },
      fr: {
        industry: "Plateforme de commande pour restaurants",
        place: "Suisse",
        summary:
          "Une plateforme de commande pour les restaurants suisses : les clients commandent en ligne, la commande arrive directement sur l'appareil en cuisine et le ticket s'imprime.",
        scope: ["Site web & pages de commande", "Apps cuisine, livreur & admin", "Caisse & borne", "Pages SEO locales"],
        challenge:
          "Les restaurants et take-aways paient des commissions élevées aux grandes plateformes de livraison et n'ont guère de lien avec leurs clients. Il fallait leur propre solution pour recevoir les commandes en direct, sans compliquer le travail en cuisine.",
        solution: [
          "Nous avons développé orderheld comme une plateforme complète : chaque commerce reçoit ses propres pages de commande avec menu, panier, retrait, livraison et précommande. Les clients suivent l'état de leur commande en direct.",
          "En coulisses, trois outils travaillent ensemble : un cockpit pour le patron et l'équipe, un écran cuisine avec temps de préparation et ticket automatique, et une vue livreur pour le smartphone. Les clôtures journalières avec TVA, moyens de paiement et export sont générées automatiquement.",
        ],
        highlights: [
          { title: "Pages de commande dédiées", text: "Chaque commerce gère son menu, ses options et ses prix, ainsi que ses horaires, vacances et zones de livraison." },
          { title: "Écran cuisine", text: "Les nouvelles commandes arrivent avec un signal sonore, passent par cuisine, prêt et en route, et impriment le ticket." },
          { title: "App livreur", text: "Accepter les livraisons, naviguer, appeler et voir le décompte d'espèces en fin de journée." },
          { title: "Clôtures & décomptes", text: "Clôtures journalières, hebdomadaires et mensuelles avec meilleures ventes, TVA et export Excel." },
        ],
      },
    },
  },
  {
    key: "ava-catering",
    name: "AVA Catering",
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
        challenge:
          "AVA Catering bereitet Buffets von Hand zu, vom Apéro bis zur Themen-Party. Das Angebot war vielfältig, aber online kaum greifbar, und Anfragen kamen unvollständig per Telefon oder Nachricht. Gesucht war ein Auftritt, der Lust macht und Anfragen gleich mit allen Angaben liefert.",
        solution: [
          "Wir haben das Angebot in fünf klare Kapitel gegliedert, vom Apéro über Mezze und Lunch bis zum Süssen. Eine feine Linie aus dem Logo zieht sich als roter Faden durch alle Seiten, Farben und Schriften stammen aus dem Logo, das wir in mehreren Varianten aufbereitet haben.",
          "Jedes Buffet führt direkt in einen Anfrage-Assistenten in vier Schritten, der die Auswahl vorausfüllt. Im Admin sieht AVA alle Anfragen, beantwortet sie mit Vorlagen, pflegt Angebot und Galerie selbst und blockiert ausgebuchte Tage im Kalender.",
        ],
        highlights: [
          { title: "Anfrage-Assistent", text: "Vier Schritte, vorausgefüllt aus dem gewählten Buffet: Anlass, Personen, Datum und Kontakt." },
          { title: "Kalender", text: "Anlässe und ausgebuchte Tage auf einen Blick, das Formular zeigt sie automatisch an." },
          { title: "Antwortvorlagen", text: "Angebot, Rückfrage oder Bestätigung mit einem Klick per E-Mail versenden." },
          { title: "Mobil zuerst", text: "Feste Leiste mit «Anrufen» und «Unverbindlich anfragen» auf dem Smartphone." },
        ],
      },
      fr: {
        industry: "Traiteur",
        place: "Pfaffnau LU",
        summary:
          "Site pour un traiteur aux buffets faits maison : offre en chapitres, galerie et un assistant de demande qui pré-remplit chaque buffet.",
        scope: ["Déclinaisons du logo & design", "Site avec assistant de demande", "Admin avec calendrier & modèles de réponse", "Galerie avec upload d'images"],
        challenge:
          "AVA Catering prépare des buffets faits maison, de l'apéro à la soirée à thème. L'offre était riche, mais difficile à saisir en ligne, et les demandes arrivaient incomplètes par téléphone ou message. Il fallait un site qui donne envie et des demandes avec toutes les informations.",
        solution: [
          "Nous avons structuré l'offre en cinq chapitres clairs, de l'apéro aux douceurs. Une fine ligne issue du logo sert de fil rouge sur toutes les pages, couleurs et typographies viennent du logo, que nous avons décliné en plusieurs variantes.",
          "Chaque buffet mène directement à un assistant de demande en quatre étapes, pré-rempli avec la sélection. Dans l'admin, AVA voit toutes les demandes, y répond avec des modèles, gère l'offre et la galerie et bloque les jours complets dans le calendrier.",
        ],
        highlights: [
          { title: "Assistant de demande", text: "Quatre étapes, pré-remplies selon le buffet choisi : occasion, nombre de personnes, date et contact." },
          { title: "Calendrier", text: "Événements et jours complets en un coup d'œil, le formulaire les affiche automatiquement." },
          { title: "Modèles de réponse", text: "Envoyer une offre, une question ou une confirmation par e-mail en un clic." },
          { title: "Mobile d'abord", text: "Barre fixe « Appeler » et « Demande sans engagement » sur le smartphone." },
        ],
      },
    },
  },
  {
    key: "gyan-hair-salon",
    name: "GYAN Hair Salon",
    domain: "gyanhairsalon.ch",
    colors: { bg: "#151515", fg: "#f3eee6", accent: "#c9a46a" },
    content: {
      de: {
        industry: "Coiffeursalon",
        summary: "Moderner Webauftritt für einen Coiffeursalon: Leistungen, Stimmung und Kontakt auf einen Blick, optimiert fürs Smartphone.",
        scope: ["Webdesign", "Mobile first", "Lokale Sichtbarkeit"],
        challenge:
          "Ein Coiffeursalon lebt von Atmosphäre und Vertrauen. Neue Kundinnen und Kunden wollen vor dem ersten Termin sehen, was sie erwartet, und den Salon schnell erreichen, meistens vom Smartphone aus.",
        solution: [
          "Wir haben einen ruhigen, hochwertigen Auftritt gestaltet, der die Stimmung des Salons transportiert. Leistungen, Öffnungszeiten und Kontakt sind mit wenigen Klicks erreichbar, und die Seite ist für lokale Suchen vorbereitet.",
        ],
        highlights: [
          { title: "Stimmungsvolles Design", text: "Dunkle Töne und warme Akzente, passend zum Salon." },
          { title: "Mobil optimiert", text: "Alles Wichtige auf einen Blick, Anrufen mit einem Tipp." },
          { title: "Lokal auffindbar", text: "Saubere Struktur und Angaben für die Suche in der Region." },
        ],
      },
      fr: {
        industry: "Salon de coiffure",
        summary: "Site moderne pour un salon de coiffure : prestations, ambiance et contact en un coup d'œil, optimisé pour le smartphone.",
        scope: ["Webdesign", "Mobile first", "Visibilité locale"],
        challenge:
          "Un salon de coiffure vit de son ambiance et de la confiance. Avant un premier rendez-vous, les nouveaux clients veulent voir ce qui les attend et joindre le salon rapidement, le plus souvent depuis leur smartphone.",
        solution: [
          "Nous avons créé une présence calme et soignée qui transmet l'ambiance du salon. Prestations, horaires et contact sont accessibles en quelques clics, et le site est préparé pour les recherches locales.",
        ],
        highlights: [
          { title: "Design d'ambiance", text: "Tons sombres et touches chaudes, à l'image du salon." },
          { title: "Optimisé mobile", text: "L'essentiel en un coup d'œil, appel en un geste." },
          { title: "Visible localement", text: "Structure soignée et informations utiles pour la recherche dans la région." },
        ],
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
        challenge:
          "Für ein Dienstleistungsunternehmen zählt, dass Interessenten schnell verstehen, was angeboten wird, und ohne Umwege Kontakt aufnehmen können.",
        solution: [
          "Wir haben einen klaren, schnellen Webauftritt umgesetzt, der das Angebot auf den Punkt bringt und auf jeder Seite den direkten Weg zur Anfrage zeigt.",
        ],
        highlights: [
          { title: "Klare Struktur", text: "Angebot und Ablauf auf einen Blick." },
          { title: "Direkter Kontakt", text: "Anfrage und Telefon auf jeder Seite erreichbar." },
          { title: "Schnell und mobil", text: "Kurze Ladezeiten auf allen Geräten." },
        ],
      },
      fr: {
        industry: "Site d'entreprise",
        summary: "Un site clair et rapide avec un chemin direct vers la demande.",
        scope: ["Webdesign", "Mobile first"],
        challenge:
          "Pour une entreprise de services, il est essentiel que les prospects comprennent vite ce qui est proposé et puissent prendre contact sans détour.",
        solution: [
          "Nous avons réalisé un site clair et rapide qui résume l'offre et montre sur chaque page le chemin direct vers la demande.",
        ],
        highlights: [
          { title: "Structure claire", text: "Offre et déroulement en un coup d'œil." },
          { title: "Contact direct", text: "Demande et téléphone accessibles sur chaque page." },
          { title: "Rapide et mobile", text: "Temps de chargement courts sur tous les appareils." },
        ],
      },
    },
  },
];
