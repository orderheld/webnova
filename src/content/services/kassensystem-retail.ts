import type { Service } from "../types";

export const kassensystemRetail: Service = {
  key: "kassensystem-retail",
  group: "pos",
  icon: "bag",
  related: ["kassensystem", "onlineshop", "kassensystem-gastro"],
  content: {
    de: {
      slug: "kassensystem-detailhandel",
      navLabel: "Kasse Detailhandel",
      meta: {
        title: "Kassensystem Detailhandel & Laden",
        description:
          "Kassensystem für Laden und Boutique: Barcode, Lager, Karte und TWINT, Berichte. Mit Einrichtung vor Ort. Jetzt unverbindliche Offerte anfragen.",
      },
      eyebrow: "Kassensystem Detailhandel",
      h1: "Kassensystem für Laden und Boutique",
      lead:
        "Schnell kassieren, Bestände im Griff, klare Zahlen zum Tagesende. Wir richten Ihr Kassensystem ein und begleiten Sie beim Start.",
      features: [
        {
          title: "Schnelles Kassieren",
          text: "Artikel per Barcode-Scanner oder Touchscreen erfassen. Auch bei viel Betrieb geht es zügig voran.",
        },
        {
          title: "Artikel und Varianten",
          text: "Grössen, Farben und Ausführungen lassen sich sauber abbilden. Preise und Aktionen ändern Sie zentral.",
        },
        {
          title: "Lagerverwaltung",
          text: "Bestände werden bei jedem Verkauf aktualisiert. So sehen Sie früh, was nachbestellt werden muss.",
        },
        {
          title: "Karte und TWINT",
          text: "Kundinnen und Kunden zahlen mit Karte, TWINT oder bar. Belege werden gedruckt oder auf Wunsch digital angeboten.",
        },
        {
          title: "Berichte und Export",
          text: "Tagesabschluss, Umsätze und Bestseller auf einen Blick. Daten lassen sich für die Buchhaltung exportieren.",
        },
        {
          title: "Laden und Onlineshop",
          text: "Auf Wunsch verbinden wir Kasse und Onlineshop, damit Sortiment und Bestände zusammenpassen.",
        },
      ],
      sections: [
        {
          h2: "Mehr Überblick im Laden",
          paragraphs: [
            "Im Detailhandel entscheidet der Überblick. Welche Artikel laufen gut, welche liegen lange im Regal, was muss nachbestellt werden? Ein modernes Kassensystem beantwortet diese Fragen nebenbei. Jeder Verkauf aktualisiert den Bestand, und am Abend sehen Sie auf einen Blick, wie der Tag gelaufen ist.",
            "An der Kasse selbst geht es um Tempo und Einfachheit. Artikel werden per Barcode oder Touchscreen erfasst, Rabatte und Gutscheine mit wenigen Klicks abgezogen. Auch neue Mitarbeitende finden sich nach kurzer Einführung zurecht. Das entlastet Sie besonders an Samstagen und in der Weihnachtszeit, wenn es an der Kasse schnell gehen muss.",
          ],
        },
        {
          h2: "Für Fachgeschäfte, Boutiquen und Läden",
          paragraphs: [
            "Ob Modeboutique mit vielen Grössen und Farben, Buchhandlung, Blumenladen oder Fachgeschäft mit Beratung: Jeder Laden funktioniert etwas anders. Darum stellen wir das Kassensystem passend zu Ihrem Sortiment und Ihren Abläufen zusammen, vom einzelnen Kassenplatz bis zur Lösung für mehrere Filialen.",
            "Wenn Sie zusätzlich online verkaufen oder das planen, lässt sich die Ladenkasse mit einem Onlineshop verbinden. Sortiment und Bestand bleiben so an einem Ort aktuell, und Sie vermeiden doppelte Arbeit. Was im Laden verkauft wird, ist online automatisch nicht mehr verfügbar und umgekehrt.",
          ],
          bullets: [
            "Mode, Schuhe und Accessoires",
            "Fachgeschäfte und Concept Stores",
            "Bäckereien, Metzgereien und Hofläden",
            "Blumenläden, Buchhandlungen und Geschenkläden",
            "Filialbetriebe mit mehreren Standorten",
          ],
        },
        {
          h2: "Einrichtung, Schulung und Support aus der Region",
          paragraphs: [
            "Wir übernehmen die Einrichtung: Artikel importieren oder erfassen, Geräte wie Scanner, Belegdrucker und Kassenschublade installieren und das Zahlungsterminal einbinden. Danach schulen wir Sie und Ihr Team direkt im Laden, damit der Start reibungslos gelingt. Auf Wunsch begleiten wir Sie auch am ersten Verkaufstag.",
            "Für Installation und Schulung kommen wir persönlich zu Ihnen. Auch nach dem Start erreichen Sie uns direkt, wenn Fragen auftauchen oder Sie Ihr System erweitern möchten. Und wenn Ihr Geschäft wächst, wächst die Kasse mit: um weitere Kassenplätze, Geräte oder Filialen.",
          ],
        },
      ],
      faq: [
        {
          q: "Kann ich bestehende Artikeldaten übernehmen?",
          a: "Oft ja. Artikellisten aus Excel oder einem anderen System lassen sich in der Regel importieren. Wir prüfen Ihre Daten und übernehmen den Import.",
        },
        {
          q: "Funktioniert das System mit Barcode-Scanner?",
          a: "Ja. Artikel können per Scanner erfasst werden. Für Artikel ohne Barcode lassen sich eigene Etiketten erstellen oder Schnelltasten einrichten.",
        },
        {
          q: "Kann ich mehrere Filialen verwalten?",
          a: "Ja. Mehrere Standorte lassen sich in einem System verwalten. Umsätze und Bestände sehen Sie pro Filiale und gesamt.",
        },
        {
          q: "Lässt sich die Kasse mit einem Onlineshop verbinden?",
          a: "Das ist möglich. Wir erstellen auch Onlineshops und klären gerne, wie sich Laden und Webshop für Ihren Betrieb am besten verbinden lassen.",
        },
        {
          q: "Was kostet ein Kassensystem für den Detailhandel?",
          a: "Das hängt von Anzahl Kassenplätzen, Geräten und Funktionen ab. Nach einer kostenlosen Beratung erhalten Sie eine unverbindliche Offerte für Ihr Geschäft.",
        },
      ],
      ctaTitle: "Mehr Überblick für Ihr Geschäft",
      ctaText:
        "Erzählen Sie uns von Ihrem Laden. Wir beraten Sie kostenlos und erstellen Ihnen eine unverbindliche Offerte.",
    },
    fr: {
      slug: "caisse-commerce",
      navLabel: "Caisse commerce",
      meta: {
        title: "Caisse enregistreuse pour commerce",
        description:
          "Caisse pour magasin et boutique : code-barres, stock, carte et TWINT, rapports. Installation sur place. Demandez une offre sans engagement.",
      },
      eyebrow: "Caisse pour le commerce",
      h1: "Caisse enregistreuse pour magasin et boutique",
      lead:
        "Encaisser vite, maîtriser le stock, des chiffres clairs en fin de journée. Nous installons votre caisse et vous accompagnons au démarrage.",
      features: [
        {
          title: "Encaissement rapide",
          text: "Scannez les articles au code-barres ou sélectionnez-les à l'écran. Même en période d'affluence, tout va vite.",
        },
        {
          title: "Articles et déclinaisons",
          text: "Tailles, couleurs et modèles sont gérés proprement. Prix et promotions se modifient de façon centralisée.",
        },
        {
          title: "Gestion du stock",
          text: "Le stock se met à jour à chaque vente. Vous voyez tôt ce qu'il faut réapprovisionner.",
        },
        {
          title: "Carte et TWINT",
          text: "Vos clients paient par carte, TWINT ou en espèces. Le ticket est imprimé ou, sur demande, proposé en version numérique.",
        },
        {
          title: "Rapports et export",
          text: "Clôture journalière, chiffre d'affaires et meilleures ventes en un coup d'œil, avec export pour la comptabilité.",
        },
        {
          title: "Magasin et boutique en ligne",
          text: "Sur demande, nous relions caisse et boutique en ligne pour un assortiment et un stock cohérents.",
        },
      ],
      sections: [
        {
          h2: "Une vision claire de votre magasin",
          paragraphs: [
            "Dans le commerce, tout est une question de vue d'ensemble. Quels articles se vendent bien, lesquels restent en rayon, que faut-il réapprovisionner ? Une caisse moderne répond à ces questions sans effort supplémentaire. Chaque vente met le stock à jour, et le soir vous voyez immédiatement comment s'est passée la journée.",
            "À la caisse, ce qui compte, c'est la rapidité et la simplicité. Les articles sont saisis au code-barres ou sur l'écran tactile, remises et bons cadeaux se déduisent en quelques gestes. Même un nouveau collaborateur s'y retrouve après une courte formation.",
          ],
        },
        {
          h2: "Pour boutiques, commerces spécialisés et magasins",
          paragraphs: [
            "Boutique de mode avec de nombreuses tailles et couleurs, librairie, fleuriste ou commerce spécialisé avec conseil : chaque magasin a ses habitudes. Nous composons donc la caisse selon votre assortiment et votre organisation, d'un seul poste à une solution pour plusieurs succursales.",
            "Si vous vendez déjà en ligne ou envisagez de le faire, la caisse du magasin peut être reliée à une boutique en ligne. Assortiment et stock restent à jour au même endroit, sans double saisie. Ce qui est vendu en magasin n'est plus disponible en ligne, et inversement.",
          ],
          bullets: [
            "Mode, chaussures et accessoires",
            "Commerces spécialisés et concept stores",
            "Boulangeries, boucheries et magasins à la ferme",
            "Fleuristes, librairies et boutiques cadeaux",
            "Enseignes avec plusieurs points de vente",
          ],
        },
        {
          h2: "Installation, formation et support de proximité",
          paragraphs: [
            "Nous nous chargeons de la mise en place : import ou saisie des articles, installation du scanner, de l'imprimante de tickets et du tiroir-caisse, intégration du terminal de paiement. Nous formons ensuite votre équipe directement dans votre magasin pour un démarrage sans accroc.",
            "Pour l'installation et la formation, nous venons en personne chez vous. Après la mise en service, vous nous joignez directement pour toute question ou extension de votre système. Et si votre commerce se développe, la caisse suit : postes, appareils ou succursales supplémentaires s'ajoutent sans difficulté. Sur demande, nous vous accompagnons aussi lors de votre première journée de vente.",
          ],
        },
      ],
      faq: [
        {
          q: "Puis-je reprendre mes données d'articles existantes ?",
          a: "Souvent, oui. Les listes d'articles issues d'Excel ou d'un autre système peuvent généralement être importées. Nous vérifions vos données et nous occupons de l'import.",
        },
        {
          q: "Le système fonctionne-t-il avec un lecteur de codes-barres ?",
          a: "Oui. Les articles se scannent directement. Pour ceux sans code-barres, vous pouvez créer vos propres étiquettes ou des touches rapides.",
        },
        {
          q: "Puis-je gérer plusieurs succursales ?",
          a: "Oui. Plusieurs points de vente se gèrent dans un même système, avec chiffres d'affaires et stocks par magasin et au total.",
        },
        {
          q: "La caisse peut-elle être reliée à une boutique en ligne ?",
          a: "C'est possible. Nous créons aussi des boutiques en ligne et examinons avec vous la meilleure façon de relier magasin et vente en ligne.",
        },
        {
          q: "Combien coûte une caisse pour commerce ?",
          a: "Cela dépend du nombre de postes, d'appareils et des fonctions souhaitées. Après un conseil gratuit, vous recevez une offre sans engagement pour votre commerce.",
        },
      ],
      ctaTitle: "Plus de clarté pour votre commerce",
      ctaText:
        "Parlez-nous de votre magasin. Nous vous conseillons gratuitement et vous remettons une offre sans engagement.",
    },
  },
};
