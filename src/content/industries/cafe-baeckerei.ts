import type { Industry } from "../types";

export const cafeBaeckerei: Industry = {
  key: "cafe-baeckerei",
  icon: "coffee",
  services: ["webdesign", "onlineshop", "kassensystem-retail", "seo"],
  guides: ["lokales-seo-kmu", "webseite-kosten"],
  preset: ["webdesign"],
  content: {
    de: {
      slug: "webseite-cafe-baeckerei",
      navLabel: "Cafés & Bäckereien",
      formLabel: "Café / Bäckerei / Konditorei",
      meta: {
        title: "Webseite für Café, Bäckerei & Konditorei",
        description:
          "Webseite für Cafés, Bäckereien und Konditoreien: Torten online vorbestellen, Filialen und Öffnungszeiten, Apéro-Service. Jetzt unverbindlich anfragen.",
      },
      eyebrow: "Webseiten für Cafés, Bäckereien & Konditoreien",
      h1: "Frisch gebacken, auch online.",
      lead:
        "Ob Geburtstagstorte, Apéro-Platte oder Sonntagszopf: Ihre Kundschaft will online sehen, was es gibt, und vorbestellen, ohne anzurufen. Wir bauen Webseiten, die Ihren Laden genau so einladend zeigen wie Ihre Auslage.",
      promises: [
        "Torten und Platten online vorbestellen",
        "Alle Filialen mit eigenen Öffnungszeiten",
        "Saisonales Sortiment selbst pflegen",
        "Kasse und Webseite aus einer Hand",
      ],
      painTitle: "Typische Situationen im Café und in der Backstube",
      pains: [
        {
          title: "Tortenbestellungen per Telefon und Zettel",
          text: "Grösse, Füllung, Beschriftung und Abholtag werden am Telefon diktiert, während vorne die Schlange wächst. Fehler sind programmiert.",
        },
        {
          title: "Mehrere Filialen, eine unklare Webseite",
          text: "Welche Filiale hat am Sonntag offen, wo gibt es Sitzplätze? Wenn das nicht auf einen Blick klar ist, fährt die Kundschaft woanders hin.",
        },
        {
          title: "Das Sortiment wechselt, die Webseite nicht",
          text: "Fasnachtschüechli, Grittibänz, Ostergebäck: Ihr Angebot lebt von der Saison, die Webseite zeigt aber seit Jahren dieselben Bilder.",
        },
        {
          title: "Apéro und Catering bleiben unbekannt",
          text: "Firmen suchen online nach Apéro-Service und Gipfeli-Lieferungen. Ohne eigene Seite dafür bekommen andere den Auftrag.",
        },
      ],
      needsTitle: "Was eine Webseite für Café und Bäckerei können muss",
      needsLead:
        "Ihre Webseite soll Lust auf einen Besuch machen und gleichzeitig Arbeit abnehmen: weniger Telefon, klarere Bestellungen, mehr Geschäftskunden.",
      needs: [
        {
          title: "Vorbestellung mit Abholtag",
          text: "Torten, Zöpfe und Platten mit Varianten, Beschriftungswunsch und Abholdatum bestellen. Sie erhalten eine saubere Bestellung per E-Mail oder im Admin.",
        },
        {
          title: "Filialen und Öffnungszeiten",
          text: "Jede Filiale mit Adresse, Karte, Sitzplätzen und eigenen Zeiten, inklusive Feiertagen. Richtig ausgezeichnet, damit Google sie korrekt anzeigt.",
        },
        {
          title: "Saisonsortiment im Griff",
          text: "Saisonprodukte ein- und ausblenden, Bilder austauschen, Hinweise setzen. In wenigen Minuten, ohne Agentur anzurufen.",
        },
        {
          title: "Apéro und Geschäftskunden",
          text: "Eine eigene Seite für Firmenapéros, Sitzungsgipfeli und Lieferungen mit Anfrageformular. Damit sprechen Sie Firmen direkt an.",
        },
        {
          title: "Café-Atmosphäre zeigen",
          text: "Frühstück, Mittag, Terrasse: Echte Bilder und kurze Texte, die zeigen, warum man bei Ihnen gerne sitzen bleibt.",
        },
        {
          title: "Kasse für Theke und Café",
          text: "Auf Wunsch richten wir das Kassensystem für Verkauf über die Theke und Konsumation im Café ein, mit Artikeln, Karte und TWINT.",
        },
      ],
      sections: [
        {
          h2: "Vorbestellen statt Schlange stehen",
          paragraphs: [
            "Für viele Bäckereien und Konditoreien ist die Vorbestellung der wichtigste Grund für eine gute Webseite. Wer eine Torte für Samstag bestellen will, möchte Grösse, Füllung und Beschriftung in Ruhe auswählen, am liebsten abends auf dem Sofa. Mit einer strukturierten Vorbestellung erhalten Sie alle Angaben vollständig und lesbar, und Ihr Team am Telefon wird entlastet.",
            "Je nach Bedarf setzen wir das als einfaches Bestellformular oder als kleinen Shop mit Abholtag um. Bezahlt wird bei Abholung oder online, ganz wie es zu Ihrem Ablauf passt.",
          ],
          bullets: [
            "Vorlaufzeiten pro Produkt, zum Beispiel zwei Tage für Motivtorten",
            "Abholfiliale wählbar, Bestellung landet bei der richtigen Filiale",
            "Ruhetage und Feiertage werden automatisch berücksichtigt",
          ],
        },
      ],
      faq: [
        {
          q: "Können Kundinnen und Kunden Torten online bestellen?",
          a: "Ja. Wir richten eine Vorbestellung mit Varianten, Beschriftung und Abholtag ein. Vorlaufzeiten und Ruhetage legen Sie fest, die Bestellung kommt vollständig bei Ihnen an.",
        },
        {
          q: "Wir haben mehrere Filialen. Wie wird das gelöst?",
          a: "Jede Filiale erhält eigene Angaben zu Adresse, Öffnungszeiten und Angebot, auf Wunsch mit eigener Unterseite. So findet Google jede Filiale einzeln.",
        },
        {
          q: "Muss ich für Online-Zahlungen einen Kartenanbieter haben?",
          a: "Nein. Bezahlung bei Abholung ist oft die einfachste Lösung. Wenn Sie online kassieren möchten, beraten wir Sie zu passenden Zahlungsarten wie Karte und TWINT.",
        },
        {
          q: "Können wir das Saisonsortiment selbst ändern?",
          a: "Ja. Produkte, Bilder und Hinweise pflegen Sie selbst. Wir zeigen Ihnen bei der Übergabe, wie es geht, und sind danach erreichbar.",
        },
      ],
      ctaTitle: "Weniger Telefon, mehr Vorbestellungen",
      ctaText: "Sagen Sie uns, was Ihre Kundschaft online können soll. Wir schlagen Ihnen eine passende Lösung vor.",
    },
    fr: {
      slug: "site-internet-cafe-boulangerie",
      navLabel: "Cafés & boulangeries",
      formLabel: "Café / boulangerie / pâtisserie",
      meta: {
        title: "Site internet pour café et boulangerie",
        description:
          "Site internet pour cafés, boulangeries et pâtisseries : commande de gâteaux en ligne, succursales et horaires, service apéro. Demande sans engagement.",
      },
      eyebrow: "Sites internet pour cafés, boulangeries et pâtisseries",
      h1: "Tout frais sorti du four, aussi en ligne.",
      lead:
        "Gâteau d'anniversaire, plateau apéro ou tresse du dimanche : vos clients veulent voir l'offre en ligne et commander sans appeler. Nous créons des sites qui présentent votre commerce aussi joliment que votre vitrine.",
      promises: [
        "Commander gâteaux et plateaux en ligne",
        "Chaque succursale avec ses horaires",
        "Assortiment de saison géré par vous",
        "Caisse et site d'un seul interlocuteur",
      ],
      painTitle: "Situations typiques au café et au fournil",
      pains: [
        {
          title: "Commandes de gâteaux par téléphone et sur papier",
          text: "Taille, garniture, inscription et jour de retrait sont dictés au téléphone pendant que la file s'allonge. Les erreurs sont inévitables.",
        },
        {
          title: "Plusieurs succursales, un site confus",
          text: "Quelle succursale est ouverte le dimanche, où y a-t-il des places assises ? Si ce n'est pas clair d'un coup d'œil, les clients vont ailleurs.",
        },
        {
          title: "L'assortiment change, le site non",
          text: "Merveilles de carnaval, bonshommes de Saint-Nicolas, pâtisseries de Pâques : votre offre vit des saisons, mais le site montre les mêmes images depuis des années.",
        },
        {
          title: "Apéros et traiteur restent inconnus",
          text: "Les entreprises cherchent en ligne un service apéro ou une livraison de croissants. Sans page dédiée, d'autres décrochent la commande.",
        },
      ],
      needsTitle: "Ce que doit faire le site d'un café ou d'une boulangerie",
      needsLead:
        "Votre site doit donner envie de venir tout en vous faisant gagner du temps : moins de téléphone, des commandes plus claires, plus de clients professionnels.",
      needs: [
        {
          title: "Précommande avec jour de retrait",
          text: "Gâteaux, tresses et plateaux avec variantes, inscription souhaitée et date de retrait. Vous recevez une commande propre par e-mail ou dans l'admin.",
        },
        {
          title: "Succursales et horaires",
          text: "Chaque succursale avec adresse, plan, places assises et horaires propres, jours fériés compris. Correctement balisée pour que Google l'affiche juste.",
        },
        {
          title: "L'assortiment de saison en main",
          text: "Afficher ou masquer les produits de saison, changer les photos, ajouter des avis. En quelques minutes, sans appeler l'agence.",
        },
        {
          title: "Apéros et clients professionnels",
          text: "Une page dédiée aux apéros d'entreprise, croissants pour séances et livraisons, avec formulaire de demande. Vous parlez directement aux entreprises.",
        },
        {
          title: "Montrer l'ambiance du café",
          text: "Petit-déjeuner, midi, terrasse : de vraies photos et des textes courts qui montrent pourquoi on aime s'attarder chez vous.",
        },
        {
          title: "Caisse pour comptoir et café",
          text: "Si souhaité, nous installons la caisse pour la vente au comptoir et la consommation sur place, avec articles, carte et TWINT.",
        },
      ],
      sections: [
        {
          h2: "Précommander plutôt que faire la queue",
          paragraphs: [
            "Pour beaucoup de boulangeries et pâtisseries, la précommande est la principale raison d'avoir un bon site. Qui veut un gâteau pour samedi souhaite choisir taille, garniture et inscription tranquillement, idéalement le soir depuis son canapé. Avec une précommande structurée, vous recevez toutes les informations complètes et lisibles, et votre équipe au téléphone est soulagée.",
            "Selon vos besoins, nous réalisons un simple formulaire de commande ou une petite boutique avec jour de retrait. Le paiement se fait au retrait ou en ligne, selon ce qui convient à votre organisation.",
          ],
          bullets: [
            "Délais par produit, par exemple deux jours pour les gâteaux à motif",
            "Succursale de retrait au choix, la commande arrive au bon endroit",
            "Jours de fermeture et fériés pris en compte automatiquement",
          ],
        },
      ],
      faq: [
        {
          q: "Les clients peuvent-ils commander des gâteaux en ligne ?",
          a: "Oui. Nous mettons en place une précommande avec variantes, inscription et jour de retrait. Vous définissez délais et jours de fermeture, la commande vous arrive complète.",
        },
        {
          q: "Nous avons plusieurs succursales. Comment faire ?",
          a: "Chaque succursale reçoit ses propres informations d'adresse, d'horaires et d'offre, avec sa propre page si souhaité. Google trouve ainsi chaque succursale séparément.",
        },
        {
          q: "Faut-il un prestataire de paiement par carte ?",
          a: "Non. Le paiement au retrait est souvent la solution la plus simple. Si vous souhaitez encaisser en ligne, nous vous conseillons sur les moyens adaptés comme la carte et TWINT.",
        },
        {
          q: "Pouvons-nous modifier l'assortiment de saison nous-mêmes ?",
          a: "Oui. Produits, photos et avis se gèrent par vous. Nous vous montrons tout lors de la remise et restons joignables ensuite.",
        },
      ],
      ctaTitle: "Moins de téléphone, plus de précommandes",
      ctaText: "Dites-nous ce que vos clients devraient pouvoir faire en ligne. Nous vous proposons une solution adaptée.",
    },
  },
};
