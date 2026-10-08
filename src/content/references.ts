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
  /** Hidden projects keep their content but appear nowhere on the site. */
  hidden?: boolean;
  content: Localized<ReferenceContent>;
}

const allReferences: Reference[] = [
  {
    key: "orderheld",
    name: "orderheld",
    hidden: true,
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
    hidden: true,
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
    image: "/referenzen/gyan-hair-salon-live.jpg",
    colors: { bg: "#f7f3ec", fg: "#2b2722", accent: "#8a6f4e" },
    content: {
      de: {
        industry: "Herren-Coiffeur & Barbier",
        place: "Biel/Bienne",
        summary:
          "Dreisprachiger Webauftritt mit eigener Online-Terminbuchung für einen Herren-Coiffeur in Biel: freie Termine sind sofort bestätigt, Erinnerungen gehen automatisch raus.",
        scope: ["Webdesign DE/FR/EN", "Online-Terminbuchung", "Admin & E-Mails", "Lokale SEO Biel und Umgebung"],
        challenge:
          "Ein Salon lebt von Atmosphäre und vollen Terminbüchern. Termine kamen bisher per Telefon und Nachricht, oft während der Arbeit am Kunden. In Biel kommt dazu: Die Kundschaft spricht Deutsch, Französisch und Englisch.",
        solution: [
          "Wir haben einen hellen, ruhigen Auftritt in Weiss und Beige gestaltet, mit echten Bildern aus dem Salon. Leistungen haben eigene Seiten, die Startseite zeigt live, ob der Salon offen ist und wann der nächste freie Termin ist.",
          "Herzstück ist die eigene Online-Buchung: Kundinnen und Kunden wählen Leistung und Zeit, der Termin ist sofort bestätigt, Doppelbuchungen sind ausgeschlossen. Bestätigung mit Kalendereintrag, Erinnerung und Feedback-Mail laufen automatisch in der Sprache des Kunden. Im Admin pflegt der Salon Termine, Leistungen, Zeiten und Buchungsregeln selbst.",
        ],
        highlights: [
          { title: "Online-Buchung", text: "Freie Termine direkt aus Öffnungszeiten und Buchungen, sofort bestätigt, mit Puffer und Storno-Frist." },
          { title: "Drei Sprachen", text: "Deutsch, Französisch und Englisch mit eigenen Adressen, Buchung und E-Mails inklusive." },
          { title: "Automatische E-Mails", text: "Bestätigung, Erinnerung, Feedback mit Google-Bewertung und Absage, jeweils mit eigener Vorlage." },
          { title: "Lokal gefunden", text: "Themenseiten und Ortsseiten für Biel und die Gemeinden rundherum, sauber untereinander verlinkt." },
        ],
      },
      fr: {
        industry: "Coiffeur hommes & barbier",
        place: "Bienne",
        summary:
          "Site trilingue avec réservation en ligne pour un coiffeur hommes à Bienne : les créneaux libres sont confirmés immédiatement, les rappels partent automatiquement.",
        scope: ["Webdesign DE/FR/EN", "Réservation en ligne", "Admin & e-mails", "SEO local Bienne et environs"],
        challenge:
          "Un salon vit de son ambiance et d'un agenda bien rempli. Les rendez-vous arrivaient par téléphone et message, souvent pendant le travail sur un client. À Bienne s'ajoute la clientèle germanophone, francophone et anglophone.",
        solution: [
          "Nous avons créé une présence claire et calme en blanc et beige, avec de vraies photos du salon. Chaque prestation a sa page, la page d'accueil indique en direct si le salon est ouvert et quel est le prochain créneau libre.",
          "Au cœur du projet : la réservation en ligne. Les clients choisissent prestation et horaire, le rendez-vous est confirmé immédiatement et les doubles réservations sont exclues. Confirmation avec entrée d'agenda, rappel et e-mail de feedback partent automatiquement dans la langue du client. Dans l'admin, le salon gère lui-même rendez-vous, prestations, horaires et règles de réservation.",
        ],
        highlights: [
          { title: "Réservation en ligne", text: "Créneaux libres calculés à partir des horaires et réservations, confirmés immédiatement." },
          { title: "Trois langues", text: "Allemand, français et anglais avec leurs propres adresses, réservation et e-mails compris." },
          { title: "E-mails automatiques", text: "Confirmation, rappel, feedback avec avis Google et annulation, chacun avec son modèle." },
          { title: "Trouvé localement", text: "Pages thématiques et pages par commune pour Bienne et les environs, bien reliées entre elles." },
        ],
      },
    },
  },
  {
    key: "dersut-kaffee",
    name: "Dersut Kaffee Schweiz",
    domain: "dersutkaffee.ch",
    image: "/referenzen/dersut-kaffee-live.jpg",
    colors: { bg: "#002856", fg: "#ffffff", accent: "#82754f" },
    content: {
      de: {
        industry: "Onlineshop für italienischen Espresso",
        place: "Basel",
        summary:
          "Webseite und Onlineshop für den offiziellen Schweizer Vertrieb von Dersut Caffè: Espresso aus Conegliano bestellen, per Vorauskasse mit Swiss QR-Rechnung bezahlen, Versand in die ganze Schweiz.",
        scope: ["Webdesign & Onlineshop", "Vorauskasse mit QR-Rechnung", "Admin für Bestellungen & Lager", "Gastro-Angebote & Regionalseiten"],
        challenge:
          "Die Dersut Kaffee GmbH hat den Schweizer Vertrieb einer traditionsreichen italienischen Rösterei übernommen. Gefragt war ein Auftritt, der die Marke seit 1947 würdig zeigt, und ein Shop, der ohne Kartenzahlung und ohne grossen Aufwand im Alltag funktioniert.",
        solution: [
          "Wir haben die Markenwelt von Dersut mit Blu Dersut, Gold und klassischer Typografie in einen ruhigen, hochwertigen Auftritt übersetzt: Geschichte, Qualität und Röstung, Zertifizierungen, Nachhaltigkeit und ein eigenes Angebot für Gastronomie, Hotellerie und Büros.",
          "Der Shop rechnet in Franken inklusive MWST, bezahlt wird per Vorauskasse: Nach der Bestellung erhalten Kundinnen und Kunden Bestellnummer, IBAN und Swiss QR-Code auf der Bestätigungsseite und per E-Mail. Im Admin markiert Dersut Bestellungen als bezahlt oder versendet, erfasst die Post-Sendungsnummer, pflegt Produkte und Lager und exportiert alles als CSV.",
        ],
        highlights: [
          { title: "Vorauskasse mit QR", text: "Bestellnummer, IBAN und Swiss QR-Code direkt nach dem Kauf, ganz ohne Kartenanbieter." },
          { title: "Bestell-Admin", text: "Bezahlt, versendet mit Sendungsnummer oder storniert, mit automatischer Kunden-E-Mail." },
          { title: "Produkte & Lager", text: "Sortiment, Bilder und Bestand selbst pflegen, Sammelaktionen und CSV-Export inklusive." },
          { title: "Gastro & Regionen", text: "Eigene Seiten für Geschäftskunden und für Regionen in der ganzen Schweiz." },
        ],
      },
      fr: {
        industry: "Boutique en ligne d'espresso italien",
        place: "Bâle",
        summary:
          "Site et boutique en ligne du distributeur officiel de Dersut Caffè en Suisse : commander l'espresso de Conegliano, payer d'avance avec la facture QR suisse, livraison dans toute la Suisse.",
        scope: ["Webdesign & boutique", "Paiement anticipé avec QR", "Admin commandes & stock", "Offres gastro & pages régionales"],
        challenge:
          "Dersut Kaffee GmbH a repris la distribution suisse d'une torréfaction italienne de tradition. Il fallait une présence à la hauteur d'une marque fondée en 1947 et une boutique qui fonctionne au quotidien, sans paiement par carte ni charge administrative.",
        solution: [
          "Nous avons traduit l'univers Dersut, avec le Blu Dersut, l'or et une typographie classique, en une présence calme et haut de gamme : histoire, qualité et torréfaction, certifications, durabilité et une offre dédiée à la restauration, l'hôtellerie et aux bureaux.",
          "La boutique calcule en francs TVA comprise, le paiement se fait d'avance : après la commande, le client reçoit numéro de commande, IBAN et code QR suisse sur la page de confirmation et par e-mail. Dans l'admin, Dersut marque les commandes comme payées ou expédiées, saisit le numéro de suivi, gère produits et stock et exporte le tout en CSV.",
        ],
        highlights: [
          { title: "Paiement anticipé QR", text: "Numéro de commande, IBAN et code QR suisse juste après l'achat, sans prestataire de carte." },
          { title: "Admin des commandes", text: "Payée, expédiée avec numéro de suivi ou annulée, avec e-mail automatique au client." },
          { title: "Produits & stock", text: "Gérer assortiment, images et stock, actions groupées et export CSV compris." },
          { title: "Gastro & régions", text: "Pages dédiées aux clients professionnels et aux régions de toute la Suisse." },
        ],
      },
    },
  },
  {
    key: "ss-express",
    name: "SS Express",
    hidden: true,
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

/** Projects shown on the site: GYAN and Dersut. Hidden ones stay in the file for later. */
export const references: Reference[] = allReferences.filter((r) => !r.hidden);
