import type { Localized } from "./types";

export interface ReferenceContent {
  industry: string;
  /** Field and scope without any name, for the blurred card while references are shown on request. */
  teaser?: string;
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
  /** Pre-blurred screenshot for the on-request card. Neutral file name, so no client name shows up in the page. */
  teaserImage?: string;
  /** Brand colours for the typographic card and accents. */
  colors: { bg: string; fg: string; accent: string };
  /** Hidden projects keep their content but appear nowhere on the site. */
  hidden?: boolean;
  content: Localized<ReferenceContent>;
}

const allReferences: Reference[] = [
  {
    key: "gyan-hair-salon",
    name: "GYAN Hair Salon",
    domain: "gyanhairsalon.ch",
    image: "/referenzen/gyan-hair-salon-live.jpg",
    teaserImage: "/referenzen/vorschau/coiffeur.webp",
    colors: { bg: "#fbf8f3", fg: "#141210", accent: "#6b5b4b" },
    content: {
      de: {
        industry: "Herren-Coiffeur & Barbier",
        teaser: "Coiffeur · Webseite mit Online-Buchung & Kasse",
        place: "Biel/Bienne",
        summary:
          "Dreisprachiger Webauftritt für einen Herren-Coiffeur in Biel, mit eigener Online-Buchung, Kundenkonto und digitaler Stempelkarte. Dahinter ein Admin mit Kalender, Kasse und Gutscheinverwaltung, das sich am Handy wie eine App bedienen lässt.",
        scope: ["Webdesign DE/FR/EN", "Online-Buchung & Kundenkonto", "Kasse, Gutscheine & Stempelkarte", "Admin, E-Mails & Push", "Lokale SEO & Journal"],
        challenge:
          "Ein neuer Herrensalon, 2025 eröffnet, mit Kunden, die spontan vorbeikommen oder lieber fix reservieren, und mit eigenen Preisen für beides. In Biel spricht man Deutsch, Französisch und oft auch Englisch. Gesucht war ein Auftritt mit der Ruhe des Salons, eine Online-Buchung ohne Doppelbelegungen und Werkzeuge für den Alltag hinter dem Empfang: Termine, Kasse, Gutscheine und Stammkunden an einem Ort.",
        solution: [
          "Wir haben einen hellen, ruhigen Auftritt in Elfenbein, Beige und dunklem Braun gestaltet, mit echten Bildern aus dem Salon, einem animierten Intro und der Unterschrift des Inhabers, die sich wie von Hand zeichnet. Jede Leistung hat eine eigene Seite mit Preisen mit und ohne Termin. Die Startseite zeigt live, ob der Salon offen ist und wann der nächste freie Online-Termin ist. Dazu kommen ein Journal mit Ratgeber-Artikeln, eine FAQ sowie Themen- und Ortsseiten für Biel und 19 Gemeinden rundherum, alles auf Deutsch, Französisch und Englisch.",
          "Herzstück ist die eigene Online-Buchung: Leistung und Zeit wählen, die E-Mail einmal per Code bestätigen, und der Termin ist sofort bestätigt. Doppelbuchungen schliesst die Datenbank aus. Bestätigung mit Kalendereintrag, Erinnerung und Dankeschön mit Link zur Google-Bewertung gehen per E-Mail und auf Wunsch als Push-Nachricht raus, in der Sprache des Kunden. Unter «Meine Termine» sehen Kunden ohne Passwort ihre Termine, stornieren selbst und finden ihre digitale Stempelkarte mit QR-Code. Gutscheine lassen sich online bestellen und beim Abholen im Salon bezahlen.",
          "Im Admin pflegt der Salon Kalender, Kundenkarten, Leistungen und Preise, Zeiten, Buchungsregeln und E-Mail-Texte selbst. Dazu gehören eine Kasse mit PIN, fortlaufend nummerierten und verketteten Belegen, Auswertung pro Mitarbeiter und Zahlungsart sowie CSV-Export für die Buchhaltung, die Gutscheinverwaltung von der Online-Bestellung bis zur Einlösung und ein QR-Scanner zum Stempeln.",
        ],
        highlights: [
          { title: "Online-Buchung", text: "Freie Zeiten direkt aus Arbeitszeiten und Terminen, sofort bestätigt, mit Puffer, Storno-Frist und Kundenkonto ohne Passwort." },
          { title: "Kasse & Belege", text: "Kassieren mit PIN, bar, mit Karte, TWINT oder Gutschein. Belege fortlaufend nummeriert und verkettet, Korrekturen nur per Storno." },
          { title: "Gutscheine & Stempelkarte", text: "Gutscheine online bestellen und im Salon bezahlen, digitale Stempelkarte mit QR-Code, Geburtstagsgeschenk und Bonus fürs Einladen." },
          { title: "Drei Sprachen, lokal gefunden", text: "Deutsch, Französisch und Englisch mit eigenen Adressen, dazu Themen- und Ortsseiten für Biel und Umgebung." },
        ],
      },
      fr: {
        industry: "Coiffeur hommes & barbier",
        teaser: "Coiffure · Site avec réservation en ligne & caisse",
        place: "Bienne",
        summary:
          "Site trilingue pour un coiffeur hommes à Bienne, avec réservation en ligne, espace client et carte de fidélité numérique. En coulisses, un admin avec calendrier, caisse et gestion des bons cadeaux, qui s'utilise comme une app sur le smartphone.",
        scope: ["Webdesign DE/FR/EN", "Réservation en ligne & espace client", "Caisse, bons cadeaux & fidélité", "Admin, e-mails & push", "SEO local & journal"],
        challenge:
          "Un nouveau salon pour hommes, ouvert en 2025, avec des clients qui passent spontanément ou préfèrent réserver, et des prix différents pour chacun des deux cas. À Bienne, on parle allemand, français et souvent anglais. Il fallait une présence à l'image du calme du salon, une réservation en ligne sans doubles réservations et des outils pour le quotidien derrière le comptoir : rendez-vous, caisse, bons cadeaux et clients fidèles, au même endroit.",
        solution: [
          "Nous avons créé une présence claire et calme en ivoire, beige et brun foncé, avec de vraies photos du salon, une intro animée et la signature du propriétaire qui se trace comme à la main. Chaque prestation a sa page avec les prix avec et sans rendez-vous. La page d'accueil indique en direct si le salon est ouvert et quel est le prochain créneau libre en ligne. S'y ajoutent un journal avec des articles conseils, une FAQ et des pages thématiques et par commune pour Bienne et 19 localités alentour, le tout en allemand, français et anglais.",
          "Au cœur du projet : la réservation en ligne. Le client choisit prestation et horaire, confirme une fois son e-mail par code, et le rendez-vous est confirmé immédiatement. La base de données exclut les doubles réservations. Confirmation avec entrée d'agenda, rappel et remerciement avec lien vers l'avis Google partent par e-mail et, sur demande, en notification push, dans la langue du client. Sous « Mes rendez-vous », le client voit ses rendez-vous sans mot de passe, annule lui-même et retrouve sa carte de fidélité numérique avec code QR. Les bons cadeaux se commandent en ligne et se paient au retrait au salon.",
          "Dans l'admin, le salon gère lui-même calendrier, fiches clients, prestations et prix, horaires, règles de réservation et textes des e-mails. S'y ajoutent une caisse avec code PIN, tickets numérotés en continu et chaînés, évaluation par collaborateur et moyen de paiement et export CSV pour la comptabilité, la gestion des bons cadeaux de la commande en ligne jusqu'à l'encaissement, et un scanner QR pour tamponner la carte de fidélité.",
        ],
        highlights: [
          { title: "Réservation en ligne", text: "Créneaux libres calculés à partir des horaires et des rendez-vous, confirmés immédiatement, avec battement, délai d'annulation et espace client sans mot de passe." },
          { title: "Caisse & tickets", text: "Encaisser avec PIN, en espèces, par carte, TWINT ou bon cadeau. Tickets numérotés et chaînés, corrections uniquement par annulation." },
          { title: "Bons cadeaux & fidélité", text: "Bons cadeaux commandés en ligne et payés au salon, carte de fidélité avec code QR, cadeau d'anniversaire et bonus de parrainage." },
          { title: "Trois langues, trouvé localement", text: "Allemand, français et anglais avec leurs propres adresses, plus des pages thématiques et par commune pour Bienne et les environs." },
        ],
      },
    },
  },
  {
    key: "dersut",
    name: "Dersut",
    domain: "dersut.ch",
    image: "/referenzen/dersut-kaffee-live.jpg",
    teaserImage: "/referenzen/vorschau/kaffee.webp",
    colors: { bg: "#002856", fg: "#ffffff", accent: "#82754f" },
    content: {
      de: {
        industry: "Onlineshop für italienischen Espresso",
        teaser: "Kaffee · Onlineshop in vier Sprachen",
        place: "Basel",
        summary:
          "Webseite und Onlineshop für den offiziellen Schweizer Vertrieb einer italienischen Kaffeerösterei: in vier Sprachen, mit Vorauskasse per Swiss QR-Code, eigenen Angeboten für Gastronomie und Firmen und einem Admin, der neue Bestellungen aufs Handy meldet.",
        scope: ["Webdesign DE/FR/IT/EN", "Onlineshop mit QR-Vorauskasse", "Admin-App & E-Mails", "Gastro- & Firmenangebote", "SEO: Ratgeber & Regionen"],
        challenge:
          "Ein Basler Unternehmen hat den offiziellen Schweizer Vertrieb einer traditionsreichen italienischen Familienrösterei übernommen. Gefragt war ein Auftritt, der die Marke würdig zeigt, Privatkundschaft in allen Sprachregionen anspricht und Gastronomie wie Büros den Weg zu einem Angebot zeigt. Der Shop sollte ohne Kartenzahlung und ohne grossen Aufwand im Alltag funktionieren.",
        solution: [
          "Wir haben die Markenwelt mit Marineblau, Gold und klassischer Serifenschrift in einen ruhigen, hochwertigen Auftritt in Deutsch, Französisch, Italienisch und Englisch übersetzt: Geschichte, Qualität und Röstung, Zertifizierungen und Nachhaltigkeit, dazu eigene Seiten für Gastronomie sowie für Firmen und Büros mit einem Anfrageformular nach Betriebsart, Monatsbedarf und Kaffeemaschine.",
          "Der Shop rechnet in Franken, bezahlt wird per Vorauskasse: Nach der Bestellung erscheinen Bestellnummer, IBAN und Swiss QR-Code auf der Bestätigungsseite und in der E-Mail, alle Kunden-E-Mails gehen in der Sprache der Bestellung raus. Produktseiten zeigen, ab wie vielen Packungen der Versand gratis ist, und im Warenkorb lässt sich eine weitere Sorte mit einem Klick dazulegen.",
          "Im Admin markiert das Team Bestellungen als bezahlt, versendet oder storniert, erfasst die Sendungsnummer, pflegt Produkte samt Übersetzungen, Bildern und Lager und bearbeitet Anfragen. Auf dem Handy lässt sich der Admin als eigene App installieren und meldet neue Bestellungen und Nachrichten per Push. Für die Sichtbarkeit sorgen ein Ratgeber mit vier Artikeln, Seiten für fünf Regionen und ein Produktfeed für Google Shopping.",
        ],
        highlights: [
          { title: "Vorauskasse mit QR", text: "Bestellnummer, IBAN und Swiss QR-Code direkt nach dem Kauf, ganz ohne Kartenanbieter." },
          { title: "Admin als App", text: "Bestellungen, Lager und Anfragen verwalten, neue Bestellungen kommen als Push-Mitteilung aufs Handy." },
          { title: "Gastro & Firmen", text: "Eigene Seiten mit Anfrageformular nach Betriebsart, Monatsbedarf und Kaffeemaschine." },
          { title: "Ratgeber & Regionen", text: "Vier Ratgeber-Artikel und Regionalseiten in vier Sprachen, dazu ein Produktfeed für Google Shopping." },
        ],
      },
      fr: {
        industry: "Boutique en ligne d'espresso italien",
        teaser: "Café · Boutique en ligne en quatre langues",
        place: "Bâle",
        summary:
          "Site et boutique en ligne du distributeur officiel en Suisse d'une torréfaction italienne : en quatre langues, avec paiement anticipé par code QR suisse, des offres pour la restauration et les entreprises et un admin qui signale les nouvelles commandes sur le smartphone.",
        scope: ["Webdesign DE/FR/IT/EN", "Boutique avec paiement QR anticipé", "App admin & e-mails", "Offres restauration & entreprises", "SEO : guide & régions"],
        challenge:
          "Une entreprise bâloise a repris la distribution officielle en Suisse d'une torréfaction familiale italienne de tradition. Il fallait une présence à la hauteur de la marque, qui parle aux particuliers de toutes les régions linguistiques et montre à la restauration comme aux bureaux le chemin vers une offre. La boutique devait fonctionner au quotidien sans paiement par carte ni charge administrative.",
        solution: [
          "Nous avons traduit l'univers de la marque, bleu marine, or et typographie à empattements classique, en une présence calme et haut de gamme en allemand, français, italien et anglais : histoire, qualité et torréfaction, certifications et durabilité, ainsi que des pages dédiées à la restauration et aux entreprises, avec un formulaire de demande selon le type d'établissement, le besoin mensuel et la machine à café.",
          "La boutique calcule en francs, le paiement se fait d'avance : après la commande, numéro de commande, IBAN et code QR suisse s'affichent sur la page de confirmation et dans l'e-mail, et tous les e-mails clients partent dans la langue de la commande. Les pages produit indiquent à partir de combien de paquets la livraison est offerte, et le panier propose d'ajouter une autre sorte en un clic.",
          "Dans l'admin, l'équipe marque les commandes comme payées, expédiées ou annulées, saisit le numéro de suivi, gère produits, traductions, images et stock et traite les demandes. Sur le smartphone, l'admin s'installe comme une app et signale nouvelles commandes et messages par notification push. Pour la visibilité : un guide de quatre articles, des pages pour cinq régions et un flux produits pour Google Shopping.",
        ],
        highlights: [
          { title: "Paiement anticipé QR", text: "Numéro de commande, IBAN et code QR suisse juste après l'achat, sans prestataire de carte." },
          { title: "Admin en app", text: "Gérer commandes, stock et demandes, les nouvelles commandes arrivent en notification push sur le smartphone." },
          { title: "Restauration & entreprises", text: "Pages dédiées avec formulaire de demande selon le type d'établissement, le besoin mensuel et la machine à café." },
          { title: "Guide & régions", text: "Quatre articles de guide et des pages régionales en quatre langues, plus un flux produits pour Google Shopping." },
        ],
      },
    },
  },
  {
    key: "ava-catering",
    name: "AVA Catering",
    domain: "avacatering.ch",
    image: "/referenzen/ava-catering.jpg",
    teaserImage: "/referenzen/vorschau/catering.webp",
    colors: { bg: "#fbf7f0", fg: "#4a5822", accent: "#e8650a" },
    content: {
      de: {
        industry: "Catering & Buffets",
        teaser: "Catering · Webseite mit Anfrage-Assistent",
        place: "Pfaffnau LU",
        summary:
          "Webauftritt für ein Catering mit hausgemachten Buffets: Angebot in fünf Kapiteln, eigene Seiten für Firmen und Feste, ein Mengenrechner und ein Anfrage-Assistent, der jede Auswahl vorausgefüllt übernimmt. Dazu ein Admin, das sich als App aufs Handy installieren lässt.",
        scope: ["Webdesign & Logo-Varianten", "Anfrage-Assistent & Mengenrechner", "Admin-App mit Kalender & Mitteilungen", "E-Mails mit Antwortvorlagen", "Lokale SEO"],
        challenge:
          "Ein kleines Catering bereitet Buffets von Hand zu, vom Apéro bis zur Themen-Party, für Firmen ebenso wie für private Feste. Das Angebot war vielfältig, aber online kaum greifbar, und Anfragen kamen unvollständig per Telefon oder Nachricht. Gesucht war ein Auftritt, der Lust macht, Firmen und Private gezielt anspricht und Anfragen gleich mit allen Angaben liefert, dazu ein Werkzeug, das sich neben der Küche einfach bedienen lässt.",
        solution: [
          "Wir haben das Angebot in fünf Kapitel gegliedert, vom Apéro über Mezze und Lunch bis zum Süssen, jedes mit eigener Detailseite. Eine feine Linie aus dem Logo zieht sich als roter Faden durch alle Seiten, Farben und Schriften stammen aus dem Logo, das wir in mehreren Varianten aufbereitet haben. Eigene Seiten sprechen Firmen und private Feste an, mit Paketen vom kurzen Apéro bis zur Kaffeepause und einem Mengenrechner, der je nach Anlass und Gästezahl die passende Menge zeigt.",
          "Jedes Buffet, jedes Paket und der Mengenrechner führen direkt in einen Anfrage-Assistenten in vier Schritten, der die Auswahl vorausfüllt. Kundinnen und Kunden erhalten sofort eine Bestätigung per E-Mail, auf dem Handy bleibt eine Leiste zum Anrufen, Schreiben und Anfragen immer sichtbar. Eigene Titel pro Seite, strukturierte Daten, Vorschaubilder zum Teilen und eine Übersicht der belieferten Orte helfen, in der Region gefunden zu werden.",
          "Im Admin sieht das Catering alle Anfragen, beantwortet sie mit Vorlagen, pflegt Angebot, Galerie und Texte selbst und blockiert ausgebuchte Tage im Kalender. Das Admin lässt sich als App aufs Handy installieren und meldet neue Anfragen per Mitteilung, jeden Morgen kommt eine Erinnerung an anstehende Anlässe und offene Antworten. Ein Verlauf zeigt jede Änderung an den Inhalten und macht sie bei Bedarf rückgängig.",
        ],
        highlights: [
          { title: "Anfrage-Assistent", text: "Vier Schritte, vorausgefüllt aus Buffet, Paket oder Mengenrechner: Anlass, Buffet, Details und Kontakt." },
          { title: "Mengenrechner", text: "Format wählen, Gästezahl einstellen und sofort sehen, mit wie vielen Häppchen oder Portionen zu rechnen ist." },
          { title: "Admin als App", text: "Mitteilung bei jeder neuen Anfrage, Erinnerung am Morgen und Antworten mit Vorlagen direkt vom Handy." },
          { title: "Kalender & Verlauf", text: "Ausgebuchte Tage erscheinen automatisch im Formular, jede Änderung an Inhalten lässt sich zurücknehmen." },
        ],
      },
      fr: {
        industry: "Traiteur & buffets",
        teaser: "Traiteur · Site avec assistant de demande",
        place: "Pfaffnau LU",
        summary:
          "Site pour un traiteur aux buffets faits maison : offre en cinq chapitres, pages dédiées aux entreprises et aux fêtes, calculateur de quantités et assistant de demande qui reprend chaque sélection. Avec un admin qui s'installe comme une app sur le smartphone.",
        scope: ["Webdesign & déclinaisons du logo", "Assistant de demande & calculateur", "App admin avec calendrier & notifications", "E-mails avec modèles de réponse", "SEO local"],
        challenge:
          "Un petit traiteur prépare ses buffets à la main, de l'apéro à la soirée à thème, pour les entreprises comme pour les fêtes privées. L'offre était riche, mais difficile à saisir en ligne, et les demandes arrivaient incomplètes par téléphone ou message. Il fallait un site qui donne envie, qui s'adresse clairement aux entreprises et aux particuliers et qui livre des demandes complètes, ainsi qu'un outil simple à utiliser à côté de la cuisine.",
        solution: [
          "Nous avons structuré l'offre en cinq chapitres, de l'apéro aux douceurs, chacun avec sa propre page. Une fine ligne issue du logo sert de fil rouge sur toutes les pages, couleurs et typographies viennent du logo, que nous avons décliné en plusieurs variantes. Des pages dédiées s'adressent aux entreprises et aux fêtes privées, avec des formules de l'apéro court à la pause café et un calculateur qui indique la quantité adaptée selon l'occasion et le nombre d'invités.",
          "Chaque buffet, chaque formule et le calculateur mènent directement à un assistant de demande en quatre étapes, pré-rempli avec la sélection. Le client reçoit aussitôt une confirmation par e-mail, et sur le smartphone une barre fixe permet d'appeler, d'écrire ou de faire une demande à tout moment. Des titres propres à chaque page, des données structurées, des images d'aperçu pour le partage et la liste des localités desservies aident à être trouvé dans la région.",
          "Dans l'admin, le traiteur voit toutes les demandes, y répond avec des modèles, gère l'offre, la galerie et les textes et bloque les jours complets dans le calendrier. L'admin s'installe comme une app sur le smartphone et signale chaque nouvelle demande par notification. Chaque matin, un rappel liste les événements à venir et les réponses en attente. Un historique montre chaque modification des contenus et permet de l'annuler.",
        ],
        highlights: [
          { title: "Assistant de demande", text: "Quatre étapes, pré-remplies selon le buffet, la formule ou le calculateur : occasion, buffet, détails et contact." },
          { title: "Calculateur de quantités", text: "Choisir le format, régler le nombre d'invités et voir aussitôt combien de bouchées ou de portions prévoir." },
          { title: "Admin comme app", text: "Notification à chaque nouvelle demande, rappel le matin et réponses avec modèles directement depuis le smartphone." },
          { title: "Calendrier & historique", text: "Les jours complets s'affichent automatiquement dans le formulaire, chaque modification de contenu peut être annulée." },
        ],
      },
    },
  },
  {
    key: "anb-treuhand",
    name: "ANB Treuhand",
    domain: "anb-treuhand.ch",
    teaserImage: "/referenzen/vorschau/treuhand.webp",
    colors: { bg: "#f5f6f5", fg: "#1c382a", accent: "#2d6a4f" },
    content: {
      de: {
        industry: "Treuhand & Immobilien",
        teaser: "Treuhand · Webseite mit Preisrechnern",
        place: "Langenthal BE",
        summary:
          "Erscheinungsbild und Webauftritt für ein Treuhandbüro mit drei Online-Preisrechnern: Besucherinnen und Besucher sehen ihren Richtpreis für Buchhaltung, Firmengründung oder Liegenschaftsverwaltung sofort und fordern die Offerte direkt an.",
        scope: ["Corporate Design & Webseite", "Drei Preisrechner", "Offertanfrage & E-Mails", "Admin für Tarife & Anfragen"],
        challenge:
          "Ein junges Treuhandbüro bietet Buchhaltung, Steuern, Löhne, Firmengründungen, Beratung und Immobilien aus einer Hand an, für KMU, Selbstständige und Privatpersonen. Gefragt waren ein Erscheinungsbild und ein Webauftritt, die Vertrauen schaffen, das breite Angebot klar ordnen und eine Frage schon vor dem ersten Gespräch beantworten: Was kostet das?",
        solution: [
          "Wir haben das Corporate Design gestaltet, mit Logo in Haupt-, Quer- und Signetform, Farben und Schrift, und daraus einen hellen, ruhigen Auftritt gebaut: viel Weiss, Tannengrün für Logo und Buttons, eine Schrift für Text und Titel. Jede Leistung hat eine eigene Seite mit Angebot, Zielgruppen und häufigen Fragen, die Immobilien von der Verwaltung bis zur Sanierung eine eigene Rubrik.",
          "Herzstück sind drei Preisrechner für Treuhand, Firmengründung und Immobilien. Sie zeigen den Richtpreis sofort, schlüsseln jede Position auf und führen direkt zur Offertanfrage. Die Anfrage geht mit allen Angaben per E-Mail ans Büro, die anfragende Person erhält eine Bestätigung mit Zusammenfassung.",
          "Im Admin-Bereich mit Zwei-Faktor-Anmeldung pflegt das Büro alle Tarife selbst, blendet Leistungen im Rechner ein oder aus und führt die Anfragen mit Status. Dazu gehören E-Mail-Signaturen im neuen Design. Ein Kundenportal für Belege und Steuerunterlagen ist auf der Seite als «in Vorbereitung» angekündigt.",
        ],
        highlights: [
          { title: "Drei Preisrechner", text: "Buchhaltung, Gründung und Liegenschaften: Richtpreis mit Bandbreite, jede Position einzeln aufgeführt." },
          { title: "Offerte direkt anfragen", text: "Die Angaben aus dem Rechner gehen mit, die anfragende Person erhält eine Bestätigung mit Zusammenfassung." },
          { title: "Tarife im Admin", text: "Preise und Leistungen selbst anpassen, die Rechner rechnen sofort mit den neuen Werten." },
          { title: "Diskret und sicher", text: "Anmeldung mit Passwort und Authenticator-Code, keine Tracker und keine Cookies auf der öffentlichen Seite." },
        ],
      },
      fr: {
        industry: "Fiduciaire & immobilier",
        teaser: "Fiduciaire · Site avec calculateurs de prix",
        place: "Langenthal BE",
        summary:
          "Identité visuelle et site pour une fiduciaire avec trois calculateurs de prix en ligne : les visiteurs voient tout de suite leur prix indicatif pour la comptabilité, la création d'entreprise ou la gérance d'immeubles et demandent l'offre directement.",
        scope: ["Identité visuelle & site web", "Trois calculateurs de prix", "Demande d'offre & e-mails", "Admin tarifs & demandes"],
        challenge:
          "Une jeune fiduciaire propose comptabilité, impôts, salaires, création d'entreprise, conseil et immobilier sous un même toit, pour les PME, les indépendants et les particuliers. Il fallait une identité visuelle et un site qui inspirent confiance, structurent clairement une offre large et répondent avant même le premier entretien à une question : combien ça coûte ?",
        solution: [
          "Nous avons créé l'identité visuelle, avec le logo en version principale, horizontale et signet, les couleurs et la typographie, puis en avons tiré un site clair et calme : beaucoup de blanc, un vert sapin pour le logo et les boutons, une seule police pour les textes et les titres. Chaque prestation a sa page avec l'offre, les publics cibles et les questions fréquentes, l'immobilier a sa propre rubrique, de la gérance à la rénovation.",
          "Au cœur du projet : trois calculateurs de prix pour la fiduciaire, la création d'entreprise et l'immobilier. Ils affichent le prix indicatif immédiatement, détaillent chaque poste et mènent directement à la demande d'offre. La demande arrive par e-mail au bureau avec toutes les indications, la personne reçoit une confirmation avec un récapitulatif.",
          "Dans l'espace admin avec connexion à deux facteurs, le bureau gère lui-même tous les tarifs, affiche ou masque des prestations dans les calculateurs et suit les demandes par statut. Des signatures e-mail au nouveau design complètent le tout. Un portail client pour les justificatifs et les documents fiscaux est annoncé sur le site comme « en préparation ».",
        ],
        highlights: [
          { title: "Trois calculateurs", text: "Comptabilité, création et immeubles : prix indicatif avec fourchette, chaque poste détaillé." },
          { title: "Demande d'offre directe", text: "Les indications du calculateur sont transmises, la personne reçoit une confirmation avec récapitulatif." },
          { title: "Tarifs dans l'admin", text: "Adapter soi-même prix et prestations, les calculateurs utilisent aussitôt les nouvelles valeurs." },
          { title: "Discret et sûr", text: "Connexion avec mot de passe et code d'authentification, ni traceurs ni cookies sur le site public." },
        ],
      },
    },
  },
  {
    key: "orderheld",
    name: "orderheld",
    domain: "orderheld.ch",
    image: "/referenzen/orderheld.jpg",
    teaserImage: "/referenzen/vorschau/gastronomie.webp",
    colors: { bg: "#f2f3f1", fg: "#1d2421", accent: "#00a651" },
    content: {
      de: {
        industry: "Bestellplattform für Restaurants",
        teaser: "Gastronomie · Bestellplattform mit Apps",
        place: "Region Biel, Grenchen und Solothurn",
        summary:
          "Eine eigene Bestellplattform für Schweizer Restaurants, inzwischen live: Gäste bestellen online, die Bestellung klingelt auf dem Gerät in der Küche, der Bon wird gedruckt und die Fahrer übernehmen per App. Dazu gehören ein Portal für die Betriebe, eine Kasse und ein Kiosk.",
        scope: ["Gäste-Portal & Bestellseiten", "Partner-Portal & Admin", "Apps für Küche, Fahrer, Kasse & Kiosk", "E-Mails, Verträge & Rechnungen", "Regionale SEO-Seiten"],
        challenge:
          "Restaurants und Take-aways zahlen bei grossen Lieferplattformen hohe Provisionen und haben kaum Kontakt zu ihren Gästen. Gesucht war eine eigene Lösung, mit der Betriebe Bestellungen direkt annehmen, ohne den Ablauf in der Küche zu verkomplizieren. Vom Bestelleingang über die Lieferung mit eigenen Fahrern bis zum Abschluss für die Treuhand sollte alles in einem System laufen.",
        solution: [
          "Wir haben die Plattform von Grund auf konzipiert und entwickelt. Gäste geben ihre Adresse ein und sehen nur Restaurants, die zu ihnen liefern oder zum Abholen in der Nähe sind. Jedes Restaurant hat eine eigene Bestellseite mit Menü, Optionen, Allergen-Filter, Abholung, Lieferung und Vorbestellung, auf Wunsch mit Online-Zahlung und Geschenkgutscheinen. Nach der Bestellung verfolgen Gäste Status und Fahrer live, die Gästeseiten gibt es auf Deutsch, Französisch und Englisch.",
          "Für die Betriebe gibt es ein Partner-Portal und eigene Apps: ein Bestellgerät für die Küche, das bei jeder Bestellung klingelt und den Bon automatisch druckt, eine Fahrer-App mit Tourenreihenfolge und Navigation, eine Kasse mit Offline-Betrieb und einen Kiosk zur Selbstbedienung mit derselben Speisekarte. Telefonbestellungen erfasst das Personal direkt am Gerät, Nachrichten an Stammgäste gehen nur mit deren Einwilligung raus.",
          "Im Hintergrund laufen Tages- und Monatsabschlüsse mit MWST, Verträge mit elektronischer Unterschrift und Monatsrechnungen als QR-Rechnung. Eine separate Partner-Website erklärt Gastronomen Funktionen, Preise und Apps. Regionale Seiten pro Ort und Küche machen die Bestellseiten bei Suchmaschinen auffindbar und werden nur indexiert, wenn dort echte Restaurants erscheinen.",
        ],
        highlights: [
          { title: "Bestellgerät für die Küche", text: "Neue Bestellungen klingeln, bis sie angenommen sind. Zeit antippen, der Bon druckt sofort, auch auf Handgeräten mit eingebautem Drucker." },
          { title: "Live-Verfolgung", text: "Gäste sehen den Fahrer auf der Karte und wie viele Lieferungen noch vor ihnen sind, mit Chat und Push-Nachrichten pro Bestellung." },
          { title: "Kasse & Kiosk", text: "Kasse mit Offline-Betrieb, lückenlosen Belegnummern und Z-Bericht, dazu ein Kiosk zur Selbstbedienung, beide mit der Speisekarte aus dem Portal." },
          { title: "Abschlüsse & Abrechnung", text: "Tag, Monat oder frei gewählter Zeitraum mit MWST je Satz und Zahlarten, als PDF, per E-Mail oder als CSV für die Treuhand." },
        ],
      },
      fr: {
        industry: "Plateforme de commande pour restaurants",
        teaser: "Restauration · Plateforme de commande avec apps",
        place: "Région de Bienne, Granges et Soleure",
        summary:
          "Une plateforme de commande pour les restaurants suisses, désormais en ligne : les clients commandent sur le web, la commande sonne sur l'appareil en cuisine, le ticket s'imprime et les livreurs prennent le relais via leur app. Un portail pour les établissements, une caisse et une borne complètent l'ensemble.",
        scope: ["Portail clients & pages de commande", "Portail partenaires & admin", "Apps cuisine, livreur, caisse & borne", "E-mails, contrats & factures", "Pages SEO régionales"],
        challenge:
          "Les restaurants et take-aways paient des commissions élevées aux grandes plateformes de livraison et n'ont guère de lien avec leurs clients. Il fallait leur propre solution pour recevoir les commandes en direct, sans compliquer le travail en cuisine. De la réception de la commande à la clôture pour la fiduciaire, en passant par la livraison avec leurs propres livreurs, tout devait tenir dans un seul système.",
        solution: [
          "Nous avons conçu et développé la plateforme de A à Z. Les clients saisissent leur adresse et ne voient que les restaurants qui livrent chez eux ou qui sont proches pour un retrait. Chaque restaurant dispose de sa propre page de commande avec menu, options, filtre allergènes, retrait, livraison et précommande, avec paiement en ligne et bons cadeaux en option. Après la commande, les clients suivent l'état et le livreur en direct ; les pages clients existent en allemand, en français et en anglais.",
          "Pour les établissements, il y a un portail partenaires et des apps dédiées : un appareil de commande en cuisine qui sonne à chaque commande et imprime le ticket automatiquement, une app livreur avec ordre de tournée et navigation, une caisse qui fonctionne hors ligne et une borne en libre-service avec la même carte. Le personnel saisit les commandes téléphoniques directement sur l'appareil, et les messages aux habitués ne partent qu'avec leur accord.",
          "En arrière-plan tournent les clôtures journalières et mensuelles avec TVA, les contrats avec signature électronique et les factures mensuelles en QR-facture. Un site partenaires séparé présente aux restaurateurs les fonctions, les prix et les apps. Des pages régionales par localité et par cuisine rendent les pages de commande visibles dans les moteurs de recherche et ne sont indexées que lorsqu'elles affichent de vrais restaurants.",
        ],
        highlights: [
          { title: "Appareil de commande en cuisine", text: "Les nouvelles commandes sonnent jusqu'à leur acceptation. On choisit le délai, le ticket s'imprime aussitôt, aussi sur les terminaux avec imprimante intégrée." },
          { title: "Suivi en direct", text: "Les clients voient le livreur sur la carte et combien de livraisons passent avant la leur, avec chat et notifications push pour chaque commande." },
          { title: "Caisse & borne", text: "Caisse utilisable hors ligne, avec numéros de ticket continus et rapport Z, plus une borne en libre-service, toutes deux avec la carte du portail." },
          { title: "Clôtures & décomptes", text: "Jour, mois ou période libre avec TVA par taux et moyens de paiement, en PDF, par e-mail ou en CSV pour la fiduciaire." },
        ],
      },
    },
  },
  {
    key: "kovali",
    name: "KOVALI",
    domain: "kovali.ch",
    teaserImage: "/referenzen/vorschau/beratung.webp",
    colors: { bg: "#060b18", fg: "#ffffff", accent: "#35a9ff" },
    content: {
      de: {
        industry: "IT-Beratung für Business Analysis und Test",
        teaser: "IT-Beratung · Webseite mit Logo und Anfrageformular",
        place: "Schweiz",
        summary:
          "Logo und Webauftritt für eine IT-Beratung in Business Analysis, Requirements Engineering und Test: klare Leistungsseiten, Fachartikel und ein Anfrageformular, das Aufgabe, Zeitraum und Pensum gleich mit erfasst.",
        scope: ["Logo & Markenauftritt", "Webdesign", "Leistungsseiten & Fachartikel", "Anfrageformular mit Upload", "SEO & strukturierte Daten"],
        challenge:
          "Business Analysis, Requirements Engineering und Test sind Leistungen, die sich schwer zeigen lassen: Es gibt kein Produkt, das man fotografieren kann. Das Angebot richtet sich an Unternehmen sowie an Beratungen und IT-Dienstleister, die eine offene Aufgabe in einem Projekt besetzen wollen. Gefragt war ein Auftritt, der verständlich macht, was die Arbeit konkret liefert, und Anfragen so aufnimmt, dass Aufgabe, Zeitraum und Pensum von Anfang an klar sind.",
        solution: [
          "Zum Projekt gehört das Logo: Aus drei Entwürfen wurde ein geometrisches Zeichen aus drei Teilen gewählt, mit einem Verlauf von Navy zu hellem Blau für den Weg von der Anforderung bis zum Betrieb. Farben und Schrift der Webseite stammen daraus, dunkle Flächen und feine Linien geben dem Auftritt einen ruhigen, technischen Charakter. Auf der Startseite erklären die drei Teile des Zeichens die Arbeitsweise.",
          "Jede der vier Leistungen hat eine eigene Seite mit Aufgaben, typischen Ergebnissen, Ausgangslagen, Methoden und häufigen Fragen. Ein durchgehendes, frei erfundenes Beispiel zeigt die Arbeit selbst: ein Prozessmodell, eine Priorisierung nach Nutzen und Aufwand und die Rückverfolgung von der Anforderung bis zum Testergebnis. Dazu kommen Branchenseiten, Fachartikel, Sitemap und strukturierte Daten für Suchmaschinen.",
          "Das Anfrageformular richtet sich an Unternehmen: Art der Anfrage, Leistungen, Beginn, Laufzeit, Pensum und Arbeitsmodell werden direkt abgefragt, ein Anforderungsprofil als PDF oder Word lässt sich anhängen. Jede Anfrage erhält eine Referenznummer und kommt per E-Mail an, mit Schutz vor Spam. Das Formular funktioniert auch ohne JavaScript, die Seiten sind statisch vorgerendert.",
        ],
        highlights: [
          { title: "Eigenes Logo", text: "Drei Entwürfe, ein gewähltes Zeichen in Navy und Blau, als Vektordatei für helle, dunkle und einfarbige Anwendungen." },
          { title: "Arbeit sichtbar gemacht", text: "Prozess, Priorisierung und Rückverfolgbarkeit an einem erfundenen Fall, als Grafiken direkt auf der Seite." },
          { title: "Anfrage mit Profil", text: "Zeitraum, Pensum und Arbeitsmodell im Formular, Upload bis 4 MB und Vorauswahl der Leistung per Link." },
          { title: "Schnell und zugänglich", text: "Statisch vorgerendert und nach WCAG 2.2 AA geprüft, auf dem Desktop wie auf dem Smartphone." },
        ],
      },
      fr: {
        industry: "Conseil IT en analyse métier et test",
        teaser: "Conseil IT · Site avec logo et formulaire de demande",
        place: "Suisse",
        summary:
          "Logo et site pour un conseil IT en analyse métier, ingénierie des exigences et test : pages de prestations claires, articles spécialisés et un formulaire qui saisit d'emblée la mission, la période et le taux d'activité.",
        scope: ["Logo & identité visuelle", "Webdesign", "Pages de prestations & articles", "Formulaire de demande avec upload", "SEO & données structurées"],
        challenge:
          "L'analyse métier, l'ingénierie des exigences et le test sont des prestations difficiles à montrer : il n'y a pas de produit à photographier. L'offre s'adresse aux entreprises ainsi qu'aux cabinets de conseil et prestataires IT qui doivent pourvoir une tâche ouverte dans un projet. Il fallait une présence qui rende concret ce que le travail apporte, et des demandes où mission, période et taux d'activité sont clairs dès le départ.",
        solution: [
          "Le projet comprend le logo : parmi trois pistes, un signe géométrique en trois parties a été retenu, avec un dégradé du bleu marine au bleu clair qui évoque le chemin de l'exigence jusqu'à l'exploitation. Couleurs et typographie du site en découlent, des surfaces sombres et des lignes fines lui donnent un caractère calme et technique. Sur la page d'accueil, les trois parties du signe expliquent la méthode de travail.",
          "Chacune des quatre prestations a sa propre page avec tâches, résultats typiques, situations de départ, méthodes et questions fréquentes. Un exemple fictif, suivi d'un bout à l'autre, montre le travail lui-même : un modèle de processus, une priorisation selon l'utilité et l'effort et la traçabilité de l'exigence jusqu'au résultat de test. S'y ajoutent des pages par secteur, des articles spécialisés, un sitemap et des données structurées pour les moteurs de recherche.",
          "Le formulaire de demande s'adresse aux entreprises : type de demande, prestations, début, durée, taux d'activité et mode de travail sont saisis directement, un profil de mission en PDF ou Word peut être joint. Chaque demande reçoit un numéro de référence et arrive par e-mail, avec protection contre le spam. Le formulaire fonctionne aussi sans JavaScript, les pages sont prégénérées de façon statique.",
        ],
        highlights: [
          { title: "Logo sur mesure", text: "Trois pistes, un signe retenu en bleu marine et bleu, en fichiers vectoriels pour fonds clairs, sombres et en monochrome." },
          { title: "Le travail rendu visible", text: "Processus, priorisation et traçabilité sur un cas fictif, sous forme de graphiques directement sur la page." },
          { title: "Demande avec profil", text: "Période, taux d'activité et mode de travail dans le formulaire, upload jusqu'à 4 Mo et présélection de la prestation par lien." },
          { title: "Rapide et accessible", text: "Prégénéré de façon statique et vérifié selon WCAG 2.2 AA, sur ordinateur comme sur smartphone." },
        ],
      },
    },
  },
  {
    key: "norela",
    name: "NORELA",
    domain: "norela.ch",
    colors: { bg: "#ffffff", fg: "#111111", accent: "#111111" },
    content: {
      de: {
        industry: "Onlineshop für einen Filter-Duschkopf",
        teaser: "Bad & Pflege · Onlineshop",
        place: "Grenchen SO",
        summary:
          "Onlineshop für einen Filter-Duschkopf gegen Kalk: Die Startseite erklärt das Produkt Schritt für Schritt, verkauft werden ein Komplett-Set in zwei Farben und Nachfüllfilter in Paketen. Bestellen ist schon vor der ersten Lieferung möglich, im Vorverkauf.",
        scope: ["Onlineshop auf Shopify", "Startseite & Produktseiten", "FAQ & Kontaktformular", "Vorverkauf", "Newsletter"],
        challenge:
          "Ein neuer Filter-Duschkopf aus der Schweiz sollte schon vor der ersten Lieferung online bestellt werden können. Das Produkt braucht Erklärung: Was bewirkt der Filter, passt er auf die eigene Dusche, wie oft wird er gewechselt und was kostet das auf Dauer? Gefragt war ein Auftritt, der diese Fragen klar beantwortet und Bestellungen bereits im Vorverkauf annimmt, mit offenen Angaben zu Versandstart, Testphase und Rückgabe.",
        solution: [
          "Wir haben den Shop auf Shopify umgesetzt. Die Startseite führt in wenigen Abschnitten vom Moment unter der Dusche über das Problem mit Kalk bis zur Lösung: Filterkartusche im Griff, Anschluss für gängige Schweizer Duschschläuche, Montage in rund 30 Sekunden ohne Werkzeug. Auf der Produktseite folgen ein Vergleich, der Set-Inhalt und Antworten zu Versand, Rückgabe und Technik.",
          "Das Komplett-Set gibt es in Weiss oder Anthrazit, den Nachfüllfilter einzeln, zu zweit oder zu viert, jeweils mit Preis pro Monat. Bezahlt wird im sicheren Checkout mit TWINT, Karte, Apple Pay, Google Pay oder Klarna. Versandstart, Lieferreihenfolge und die Möglichkeit, bis zum Versand zu stornieren, stehen gut sichtbar im Shop.",
          "Dazu kommen ein Kontaktformular mit Themenauswahl und Feld für die Bestellnummer, eine Newsletter-Anmeldung für Neuigkeiten zum Versandstart sowie Impressum, AGB, Datenschutz, Rückgabe- und Versandbedingungen.",
        ],
        highlights: [
          { title: "Vorverkauf", text: "Bestellen vor der ersten Lieferung: Versandstart, Reihenfolge und Storno bis zum Versand sind klar erklärt, die Testphase beginnt erst mit dem Paket." },
          { title: "Komplett-Set", text: "Duschkopf mit eingesetztem Filter, zweiter Filter und Zubehör in einem Set, wählbar in Weiss oder Anthrazit." },
          { title: "Filter im Paket", text: "Nachfüllfilter einzeln, zu zweit oder zu viert, jeweils mit Preis pro Monat und Ersparnis." },
          { title: "Fragen vor dem Kauf", text: "FAQ zu Montage, Wasserdruck, Filterwechsel, Rückgabe und Garantie, dazu ein Kontaktformular mit Themenauswahl." },
        ],
      },
      fr: {
        industry: "Boutique en ligne pour un pommeau de douche filtrant",
        teaser: "Bain & soins · Boutique en ligne",
        place: "Granges SO",
        summary:
          "Boutique en ligne pour un pommeau de douche filtrant anticalcaire : la page d'accueil explique le produit pas à pas, on y commande un set complet en deux couleurs et des filtres de rechange en lots. On peut commander avant même la première livraison, en prévente.",
        scope: ["Boutique sur Shopify", "Page d'accueil & pages produit", "FAQ & formulaire de contact", "Prévente", "Newsletter"],
        challenge:
          "Un nouveau pommeau de douche filtrant suisse devait pouvoir être commandé en ligne avant même la première livraison. Le produit demande des explications : que fait le filtre, s'adapte-t-il à sa propre douche, à quelle fréquence le changer et combien cela coûte-t-il dans la durée ? Il fallait une présence qui réponde clairement à ces questions et accepte les commandes dès la prévente, avec des informations transparentes sur le début des envois, la période d'essai et le retour.",
        solution: [
          "Nous avons réalisé la boutique sur Shopify. La page d'accueil mène en quelques sections du moment sous la douche au problème du calcaire, puis à la solution : cartouche filtrante dans la poignée, raccord pour les flexibles de douche suisses courants, montage en une trentaine de secondes sans outil. La page produit présente ensuite une comparaison, le contenu du set et des réponses sur la livraison, le retour et la technique.",
          "Le set complet existe en blanc ou anthracite, le filtre de rechange à l'unité, par deux ou par quatre, chaque fois avec le prix par mois. Le paiement passe par un checkout sécurisé avec TWINT, carte, Apple Pay, Google Pay ou Klarna. Le début des envois, l'ordre de livraison et la possibilité d'annuler jusqu'à l'expédition sont bien visibles dans la boutique.",
          "S'y ajoutent un formulaire de contact avec choix du sujet et champ pour le numéro de commande, une inscription à la newsletter pour les nouvelles sur le début des envois, ainsi que mentions légales, CG, protection des données, conditions de retour et de livraison.",
        ],
        highlights: [
          { title: "Prévente", text: "Commander avant la première livraison : début des envois, ordre de livraison et annulation jusqu'à l'expédition sont clairement expliqués, la période d'essai ne commence qu'à réception du colis." },
          { title: "Set complet", text: "Pommeau avec filtre installé, deuxième filtre et accessoires dans un seul set, en blanc ou anthracite." },
          { title: "Filtres en lots", text: "Filtres de rechange à l'unité, par deux ou par quatre, chacun avec prix par mois et économie." },
          { title: "Questions avant l'achat", text: "FAQ sur le montage, la pression de l'eau, le changement de filtre, le retour et la garantie, plus un formulaire de contact avec choix du sujet." },
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

/** Order on the site (Ferhat, 2026-10-21). */
const order = ["gyan-hair-salon", "dersut", "ava-catering", "anb-treuhand", "orderheld", "kovali", "norela"];

/** Projects shown on the site. Hidden ones (SS Express) stay in the file for later. */
export const references: Reference[] = allReferences
  .filter((r) => !r.hidden)
  .sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
