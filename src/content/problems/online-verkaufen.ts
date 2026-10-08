import type { Problem } from "../types";

export const onlineVerkaufen: Problem = {
  key: "online-verkaufen",
  icon: "cart",
  services: ["onlineshop", "kassensystem-retail", "online-marketing", "seo"],
  guides: ["onlineshop-schweiz", "webseite-kosten"],
  industries: ["detailhandel", "cafe-baeckerei", "gastronomie"],
  preset: ["shop"],
  content: {
    de: {
      slug: "online-verkaufen-starten",
      navLabel: "Online verkaufen starten",
      meta: {
        title: "Online verkaufen starten: Shop für KMU",
        description:
          "Sie möchten Produkte online verkaufen, wissen aber nicht, wo anfangen? Wir planen und bauen Ihren Onlineshop mit Schweizer Zahlung und Versand.",
      },
      eyebrow: "Lösung: der Einstieg in den Onlineverkauf",
      h1: "Online verkaufen, ohne sich zu verzetteln.",
      lead:
        "Plattformen, Zahlungsanbieter, Versand, MWST, rechtliche Angaben: Wer einen Onlineshop starten will, steht vor vielen Fragen. Wir sortieren sie mit Ihnen, starten schlank und bauen einen Shop, der zu Ihrem Alltag passt.",
      symptomsTitle: "Kommt Ihnen das bekannt vor?",
      symptoms: [
        "Kundschaft fragt, ob man bei Ihnen auch online bestellen kann",
        "Sie verkaufen über Instagram-Nachrichten und Überweisungen",
        "Sie wissen nicht, welche Shop-Lösung zu Ihnen passt",
        "Zahlung, Versand und MWST wirken kompliziert",
        "Ein erster Versuch mit einem Baukasten ist eingeschlafen",
      ],
      causesTitle: "Warum der Start oft stockt",
      causes: [
        {
          title: "Zu gross geplant",
          text: "Das ganze Sortiment, alle Varianten, alle Zahlungsarten auf einmal. Der Aufwand wird riesig, der Start verschiebt sich.",
        },
        {
          title: "Die falsche Plattform",
          text: "Ein internationaler Baukasten passt nicht zu Schweizer Zahlung, Versand und MWST, oder die Gebühren fressen die Marge.",
        },
        {
          title: "Kein Ablauf im Betrieb",
          text: "Wer verpackt, wer verschickt, wie wird bezahlt? Ohne klaren Ablauf wird jede Bestellung zur Ausnahme.",
        },
        {
          title: "Shop ohne Besucher",
          text: "Ein Shop allein verkauft nicht. Ohne Sichtbarkeit bei Google und gezielte Werbung bleiben die Bestellungen aus.",
        },
      ],
      solutionTitle: "So starten wir Ihren Onlineverkauf",
      solutionLead:
        "Wir beginnen mit dem, was sich gut verkaufen lässt, und bauen den Shop so, dass Bestellung, Zahlung und Versand in Ihren Alltag passen.",
      steps: [
        {
          title: "Sortiment und Ablauf",
          text: "Gemeinsam wählen wir die Produkte für den Start und klären Versand, Abholung und Zahlung.",
        },
        {
          title: "Schweizer Zahlung",
          text: "Karte und TWINT oder Vorauskasse mit Swiss QR-Rechnung, Preise in Franken inklusive MWST.",
        },
        {
          title: "Shop und Verwaltung",
          text: "Ein schneller Shop mit einfacher Verwaltung für Produkte, Bestand und Bestellungen, auf Wunsch verbunden mit Ihrer Ladenkasse.",
        },
        {
          title: "Kundschaft finden",
          text: "Produktseiten, die bei Google gefunden werden, und gezielte Kampagnen für den Start.",
        },
      ],
      sections: [
        {
          h2: "Klein anfangen ist kein Kompromiss",
          paragraphs: [
            "Die erfolgreichsten Shops kleiner Unternehmen starten oft mit einer überschaubaren Auswahl: die Bestseller, Geschenke, Gutscheine oder Produkte, die man im Laden nicht immer vorrätig hat. So lernen Sie mit wenig Aufwand, was online funktioniert, und bauen gezielt aus.",
            "Für Dersut, den Schweizer Vertrieb von Dersut Caffè, haben wir zum Beispiel einen Shop mit Vorauskasse und Swiss QR-Rechnung umgesetzt, ohne Kartenanbieter und mit einem eigenen Admin für Bestellungen, Versand und Lager. Es muss nicht kompliziert sein, um professionell zu wirken.",
          ],
        },
      ],
      faq: [
        {
          q: "Welche Shop-Lösung passt zu meinem Geschäft?",
          a: "Das hängt von Sortiment, Menge und Abläufen ab. Wir beraten Sie unabhängig und empfehlen die Lösung, die zu Ihrem Betrieb passt, nicht die grösste.",
        },
        {
          q: "Welche Zahlungsarten brauche ich in der Schweiz?",
          a: "Karte und TWINT sind verbreitet, Vorauskasse mit Swiss QR-Rechnung ist ein einfacher Einstieg ohne Kartenanbieter. Wir besprechen, was für Sie sinnvoll ist.",
        },
        {
          q: "Wie viele Produkte brauche ich für den Start?",
          a: "Weniger als Sie denken. Eine gut präsentierte Auswahl ist besser als ein grosses, unvollständiges Sortiment. Ausbauen können Sie jederzeit.",
        },
        {
          q: "Kann der Shop mit meiner Ladenkasse verbunden werden?",
          a: "Ja. Mit unserem Kassensystem für den Detailhandel arbeiten Laden und Shop mit gemeinsamem Bestand.",
        },
        {
          q: "Wie kommen Kundinnen und Kunden in den Shop?",
          a: "Über Produktseiten, die bei Google gefunden werden, über Ihre bestehende Kundschaft und gezielte Kampagnen. Wir planen das von Anfang an mit.",
        },
      ],
      ctaTitle: "Starten Sie Ihren Onlineverkauf",
      ctaText: "Erzählen Sie uns, was Sie verkaufen möchten. Wir zeigen Ihnen einen schlanken Weg zum ersten Online-Umsatz.",
    },
    fr: {
      slug: "commencer-a-vendre-en-ligne",
      navLabel: "Commencer à vendre en ligne",
      meta: {
        title: "Commencer à vendre en ligne : boutique PME",
        description:
          "Vous voulez vendre en ligne sans savoir par où commencer ? Nous planifions et créons votre boutique avec paiement et livraison adaptés à la Suisse.",
      },
      eyebrow: "Solution : se lancer dans la vente en ligne",
      h1: "Vendre en ligne, sans se disperser.",
      lead:
        "Plateformes, prestataires de paiement, expédition, TVA, mentions légales : lancer une boutique en ligne soulève beaucoup de questions. Nous les trions avec vous, démarrons léger et créons une boutique adaptée à votre quotidien.",
      symptomsTitle: "Cela vous dit quelque chose ?",
      symptoms: [
        "Vos clients demandent s'ils peuvent commander en ligne",
        "Vous vendez par messages Instagram et virements",
        "Vous ne savez pas quelle solution de boutique vous convient",
        "Paiement, expédition et TVA semblent compliqués",
        "Un premier essai avec un éditeur en ligne s'est essoufflé",
      ],
      causesTitle: "Pourquoi le démarrage bloque souvent",
      causes: [
        {
          title: "Un projet trop grand",
          text: "Tout l'assortiment, toutes les variantes, tous les moyens de paiement d'un coup. L'effort devient énorme, le lancement est repoussé.",
        },
        {
          title: "La mauvaise plateforme",
          text: "Un éditeur international ne convient pas au paiement, à l'expédition et à la TVA suisses, ou les frais mangent la marge.",
        },
        {
          title: "Pas de processus interne",
          text: "Qui emballe, qui expédie, comment est-on payé ? Sans processus clair, chaque commande devient une exception.",
        },
        {
          title: "Une boutique sans visiteurs",
          text: "Une boutique seule ne vend pas. Sans visibilité sur Google et publicité ciblée, les commandes n'arrivent pas.",
        },
      ],
      solutionTitle: "Comment nous lançons votre vente en ligne",
      solutionLead:
        "Nous commençons par ce qui se vend bien et construisons la boutique pour que commande, paiement et expédition s'intègrent à votre quotidien.",
      steps: [
        {
          title: "Assortiment et processus",
          text: "Ensemble, nous choisissons les produits de départ et clarifions expédition, retrait et paiement.",
        },
        {
          title: "Paiement suisse",
          text: "Carte et TWINT ou paiement anticipé avec QR-facture, prix en francs TVA comprise.",
        },
        {
          title: "Boutique et gestion",
          text: "Une boutique rapide avec une gestion simple des produits, du stock et des commandes, reliée si souhaité à votre caisse.",
        },
        {
          title: "Trouver des clients",
          text: "Des pages produits trouvées sur Google et des campagnes ciblées pour le lancement.",
        },
      ],
      sections: [
        {
          h2: "Commencer petit n'est pas un compromis",
          paragraphs: [
            "Les boutiques les plus réussies des petites entreprises démarrent souvent avec une sélection limitée : les meilleures ventes, des cadeaux, des bons ou des produits pas toujours en stock au magasin. Vous apprenez ainsi avec peu d'effort ce qui fonctionne en ligne, puis vous développez de façon ciblée.",
            "Pour Dersut, le distributeur suisse de Dersut Caffè, nous avons par exemple réalisé une boutique avec paiement anticipé et QR-facture, sans prestataire de cartes et avec un admin dédié aux commandes, envois et stock. Pas besoin d'être compliqué pour paraître professionnel.",
          ],
        },
      ],
      faq: [
        {
          q: "Quelle solution de boutique convient à mon commerce ?",
          a: "Cela dépend de l'assortiment, des volumes et des processus. Nous vous conseillons de façon indépendante et recommandons la solution adaptée à votre entreprise, pas la plus grande.",
        },
        {
          q: "Quels moyens de paiement faut-il en Suisse ?",
          a: "Carte et TWINT sont répandus, le paiement anticipé avec QR-facture est un départ simple sans prestataire de cartes. Nous discutons de ce qui a du sens pour vous.",
        },
        {
          q: "Combien de produits faut-il pour démarrer ?",
          a: "Moins que vous ne le pensez. Une sélection bien présentée vaut mieux qu'un grand assortiment incomplet. Vous pouvez élargir à tout moment.",
        },
        {
          q: "La boutique peut-elle être reliée à ma caisse ?",
          a: "Oui. Avec notre système de caisse pour le commerce, magasin et boutique travaillent avec un stock commun.",
        },
        {
          q: "Comment les clients arrivent-ils dans la boutique ?",
          a: "Par des pages produits trouvées sur Google, par votre clientèle existante et par des campagnes ciblées. Nous le planifions dès le départ.",
        },
      ],
      ctaTitle: "Lancez votre vente en ligne",
      ctaText: "Dites-nous ce que vous souhaitez vendre. Nous vous montrons un chemin léger vers votre premier chiffre d'affaires en ligne.",
    },
  },
};
