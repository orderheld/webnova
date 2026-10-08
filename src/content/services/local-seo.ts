import type { Service } from "../types";

export const localSeo: Service = {
  key: "local-seo",
  group: "marketing",
  icon: "pin",
  related: ["seo", "ki-sichtbarkeit", "website-kmu"],
  content: {
    de: {
      slug: "local-seo",
      navLabel: "Local SEO",
      meta: {
        title: "Local SEO: Google Maps und Unternehmensprofil",
        description:
          "Local SEO für Schweizer KMU: Google-Unternehmensprofil, Google Maps, Verzeichnisse, Bewertungen und Standortseiten. In Ihrer Region gefunden werden.",
      },
      eyebrow: "Local SEO",
      h1: "Local SEO: in Google Maps und in Ihrer Region gefunden werden",
      lead:
        "Wenn jemand «Elektriker in der Nähe» oder «Treuhand Solothurn» sucht, zeigt Google zuerst die Karte mit lokalen Anbietern. Wir sorgen dafür, dass Ihr Unternehmen dort mit vollständigen, korrekten Angaben erscheint und Ihre Website diese Sichtbarkeit unterstützt.",
      features: [
        {
          title: "Google-Unternehmensprofil",
          text: "Einrichten oder übernehmen, verifizieren, Kategorien, Leistungen, Öffnungszeiten, Fotos und Beschreibung vollständig pflegen.",
        },
        {
          title: "Einheitliche Firmendaten (NAP)",
          text: "Name, Adresse und Telefonnummer stimmen auf Website, Google, local.ch, search.ch, Apple Maps und weiteren Einträgen überein.",
        },
        {
          title: "Lokale Seiten auf der Website",
          text: "Seiten für Ihre wichtigsten Orte und Leistungen mit echtem, lokalem Inhalt statt kopierter Texte mit ausgetauschtem Ortsnamen.",
        },
        {
          title: "Bewertungen mit System",
          text: "Ein einfacher Ablauf, damit zufriedene Kundschaft eine Bewertung hinterlässt, und Vorlagen für sachliche Antworten.",
        },
        {
          title: "Strukturierte Daten",
          text: "Ihre Firmendaten werden auf der Website maschinenlesbar ausgezeichnet, damit Suchmaschinen sie eindeutig zuordnen.",
        },
        {
          title: "Verständliche Auswertung",
          text: "Anrufe, Routenanfragen und Website-Klicks aus dem Profil sowie Suchanfragen aus der Search Console, einfach erklärt.",
        },
      ],
      problemsTitle: "Kennen Sie das?",
      problems: [
        {
          title: "In Google Maps nicht zu sehen",
          text: "Bei der Suche nach Ihrer Leistung erscheinen drei Mitbewerber in der Karte, Ihr Betrieb erst nach mehrmaligem Scrollen oder gar nicht.",
        },
        {
          title: "Falsche oder alte Angaben im Netz",
          text: "Eine alte Telefonnummer auf local.ch, falsche Öffnungszeiten bei Google, ein früherer Firmenname in einem Verzeichnis: Das kostet Anrufe und Vertrauen.",
        },
        {
          title: "Kaum Bewertungen",
          text: "Zufriedene Kundschaft gibt es, aber nur wenige hinterlassen eine Bewertung. Mitbewerber mit mehr Rezensionen wirken vertrauenswürdiger.",
        },
        {
          title: "Profil und Website passen nicht zusammen",
          text: "Das Profil verlinkt auf die Startseite, die Leistungen fehlen, und die Website nennt die Orte nicht, in denen Sie tätig sind.",
        },
      ],
      benefitsTitle: "Was Local SEO Ihnen bringt",
      benefits: [
        {
          title: "Sichtbar, wenn es zählt",
          text: "Lokale Suchen haben oft eine konkrete Absicht: anrufen, vorbeikommen, Termin buchen. Genau dort erscheinen Sie.",
        },
        {
          title: "Direkte Kontakte",
          text: "Aus dem Profil heraus wird angerufen, eine Route geplant oder die Website besucht. Ohne Umweg über Anzeigen.",
        },
        {
          title: "Vertrauen durch Bewertungen",
          text: "Echte Bewertungen und sachliche Antworten zeigen, wie Sie arbeiten. Das hilft bei der Entscheidung für Sie.",
        },
        {
          title: "Grundlage für KI-Suchen",
          text: "Einheitliche, klare Firmendaten helfen auch Assistenten wie ChatGPT oder den Google AI Overviews, Ihr Unternehmen korrekt einzuordnen.",
        },
      ],
      process: [
        {
          title: "Bestandsaufnahme",
          text: "Wir prüfen Ihr Google-Profil, die wichtigsten Verzeichnisse, die Website und die lokale Konkurrenz für Ihre Kernsuchbegriffe.",
        },
        {
          title: "Daten bereinigen",
          text: "Wir legen die eine korrekte Schreibweise Ihrer Firmendaten fest und korrigieren abweichende Einträge, soweit das möglich ist.",
        },
        {
          title: "Profil optimieren",
          text: "Kategorien, Leistungen, Beschreibung, Öffnungszeiten, Fotos und Verlinkung werden vollständig und sinnvoll gepflegt.",
        },
        {
          title: "Website stärken",
          text: "Kontaktseite, strukturierte Daten und bei Bedarf lokale Seiten für Ihre wichtigsten Orte und Leistungen.",
        },
        {
          title: "Bewertungen und Pflege",
          text: "Ein Ablauf für Bewertungen, regelmässige Beiträge und eine Kontrolle, ob alle Angaben aktuell bleiben.",
        },
      ],
      fit: {
        yes: [
          "Ihre Kundschaft kommt überwiegend aus Ihrer Region, etwa als Handwerksbetrieb, Praxis, Restaurant, Geschäft oder Dienstleister.",
          "Sie haben eine feste Adresse oder ein klares Einzugsgebiet, in dem Sie Kundschaft besuchen.",
          "Sie sind bereit, Kundschaft aktiv um Bewertungen zu bitten und Fotos aus Ihrem Alltag zu liefern.",
        ],
        no: [
          "Sie verkaufen ausschliesslich online in der ganzen Schweiz ohne lokalen Bezug. Dann ist klassisches SEO wichtiger.",
          "Sie möchten Bewertungen kaufen oder Einträge mit erfundenen Standorten anlegen. Das widerspricht den Google-Richtlinien und schadet langfristig.",
          "Sie erwarten einen garantierten Platz in den ersten drei Kartenergebnissen. Das kann niemand seriös versprechen.",
        ],
      },
      sections: [
        {
          h2: "Wie Google lokale Ergebnisse auswählt",
          paragraphs: [
            "Google nennt drei Hauptfaktoren für lokale Ergebnisse: Relevanz, Entfernung und Bekanntheit. Relevanz bedeutet, wie gut Ihr Profil und Ihre Website zur Suche passen. Die Entfernung ergibt sich aus dem Standort der suchenden Person und Ihrer Adresse oder Ihrem Einzugsgebiet. Die Bekanntheit leitet Google unter anderem aus Bewertungen, Erwähnungen im Netz und der Stärke Ihrer Website ab.",
            "Die Entfernung können Sie nicht beeinflussen, die beiden anderen Faktoren schon. Ein vollständiges Profil mit passenden Kategorien, eine Website mit klaren Leistungsseiten und echte Bewertungen sind die wirksamsten Hebel. Tricks wie Keywords im Firmennamen oder Scheinadressen verstossen gegen die Richtlinien und können zur Sperrung des Profils führen.",
          ],
        },
        {
          h2: "Das Google-Unternehmensprofil richtig pflegen",
          paragraphs: [
            "Das Profil ist das Herzstück von Local SEO. Wichtig sind die richtige Hauptkategorie, sinnvolle Zusatzkategorien, eine Beschreibung in Ihren eigenen Worten, die Leistungen mit kurzen Erklärungen, aktuelle Öffnungszeiten inklusive Feiertagen und Fotos, die Ihren Betrieb wirklich zeigen. Der Link zur Website sollte auf die passendste Seite führen, nicht zwingend auf die Startseite.",
            "Eine Schritt-für-Schritt-Anleitung finden Sie im Ratgeber [Google-Unternehmensprofil optimieren](guide:google-unternehmensprofil). Wenn Ihnen dafür die Zeit fehlt, übernehmen wir die Einrichtung und die laufende Pflege.",
          ],
        },
        {
          h2: "NAP-Konsistenz: überall dieselben Firmendaten",
          paragraphs: [
            "NAP steht für Name, Adresse und Telefonnummer. Stehen diese Angaben auf Website, Google, local.ch, search.ch, Apple Maps, Bing, Branchenverzeichnissen und Social Media unterschiedlich, entstehen Zweifel, welche Angabe stimmt. Für Menschen ist das ärgerlich, für Suchmaschinen und KI-Assistenten ein Signal mangelnder Verlässlichkeit.",
            "Wir legen eine verbindliche Schreibweise fest, zum Beispiel ob «Strasse» oder «Str.» und ob die Telefonnummer mit Ländervorwahl erscheint, und gleichen die wichtigsten Einträge daran an. Auf Ihrer Website zeichnen wir diese Angaben zusätzlich mit strukturierten Daten aus.",
          ],
          bullets: [
            "Firmenname genau wie im Handelsregister oder wie im Alltag verwendet, aber überall gleich",
            "Adresse in einheitlicher Schreibweise",
            "Eine Haupttelefonnummer, die überall gleich formatiert ist",
            "Öffnungszeiten auf Website und Profil identisch",
          ],
        },
        {
          h2: "Lokale Seiten, die wirklich helfen",
          paragraphs: [
            "Wer in mehreren Orten tätig ist, profitiert von Seiten pro Ort oder Region. Entscheidend ist, dass jede Seite eigenständigen Inhalt hat: welche Leistungen Sie dort anbieten, welche Projekte Sie dort umgesetzt haben, welche Besonderheiten der Ort hat, etwa die Zweisprachigkeit in Biel/Bienne. Seiten, die sich nur im Ortsnamen unterscheiden, bringen wenig und können der Website schaden.",
            "Wie wir das für uns selbst umsetzen, sehen Sie auf unseren Seiten zu [SEO in Biel/Bienne](citySeo:biel), [SEO in Solothurn](citySeo:solothurn) und [SEO in Bern](citySeo:bern). Mehr Hintergrund und einen Plan für die ersten acht Wochen finden Sie im Ratgeber [Lokales SEO für KMU](guide:lokales-seo-kmu).",
          ],
        },
        {
          h2: "Local SEO und klassisches SEO zusammen denken",
          paragraphs: [
            "Local SEO ist kein Ersatz für eine gute Website, sondern baut auf ihr auf. Ein starkes Profil, das auf eine langsame, unklare Website verlinkt, verschenkt Potenzial. Umgekehrt nützt die beste Website wenig, wenn das Profil unvollständig ist. Darum betrachten wir beides gemeinsam. Für überregionale Suchbegriffe und technische Optimierung bieten wir [Suchmaschinenoptimierung](service:seo) als eigene Leistung an.",
            "Sie möchten wissen, wo Sie heute stehen? Mit unserem [kostenlosen Website-Check](page:website-check) sehen wir uns Website und Google-Profil an und sagen Ihnen, welche drei Massnahmen sich zuerst lohnen.",
          ],
        },
      ],
      faq: [
        {
          q: "Was ist Local SEO?",
          a: "Local SEO umfasst alle Massnahmen, mit denen ein Unternehmen bei Suchen mit lokalem Bezug gefunden wird, etwa in Google Maps und im lokalen Kartenbereich der Suchergebnisse. Dazu gehören Unternehmensprofil, einheitliche Firmendaten, Bewertungen und lokale Inhalte auf der Website.",
        },
        {
          q: "Was kostet Local SEO?",
          a: "Der Aufwand hängt vom Zustand Ihres Profils, der Anzahl Standorte und der Konkurrenz ab. Nach einem kostenlosen Erstgespräch erhalten Sie eine unverbindliche Offerte, einmalig oder als laufende Betreuung.",
        },
        {
          q: "Wie schnell wirkt Local SEO?",
          a: "Korrekturen im Profil sind oft nach wenigen Tagen sichtbar. Bis sich bessere Positionen in der Karte zeigen, vergehen meist einige Wochen bis Monate, je nach Konkurrenz und Ausgangslage.",
        },
        {
          q: "Brauche ich für Local SEO eine Adresse?",
          a: "Für ein Google-Unternehmensprofil braucht es eine echte Adresse oder ein Einzugsgebiet. Betriebe, die Kundschaft vor Ort besuchen, können die Adresse ausblenden und stattdessen Einzugsgebiete angeben.",
        },
        {
          q: "Kann ich mehrere Standorte eintragen?",
          a: "Ja, wenn es sich um echte Standorte mit Personal und Öffnungszeiten handelt. Für jeden Standort braucht es ein eigenes Profil und idealerweise eine eigene Seite auf der Website.",
        },
        {
          q: "Darf ich Kunden um Bewertungen bitten?",
          a: "Ja, das ist erlaubt und sinnvoll. Nicht erlaubt sind gekaufte Bewertungen, Bewertungen gegen Belohnung oder das gezielte Filtern nach zufriedenen Kunden. Wir helfen Ihnen, einen einfachen und fairen Ablauf aufzubauen.",
        },
        {
          q: "Wie gehe ich mit einer negativen Bewertung um?",
          a: "Sachlich, freundlich und zeitnah antworten, das Anliegen ernst nehmen und eine Lösung anbieten. Eine gute Antwort wirkt oft stärker als die Bewertung selbst. Verstösst eine Bewertung gegen die Richtlinien, kann sie bei Google gemeldet werden.",
        },
        {
          q: "Was ist der Unterschied zwischen Local SEO und SEO?",
          a: "Klassisches SEO verbessert die Sichtbarkeit der Website in den normalen Suchergebnissen, auch überregional. Local SEO konzentriert sich auf Suchen mit Ortsbezug und auf die Karte. Für die meisten KMU lohnt sich die Kombination.",
        },
        {
          q: "Hilft Local SEO auch bei ChatGPT und KI-Suchen?",
          a: "Indirekt ja. KI-Suchen stützen sich auf Informationen aus dem Netz. Einheitliche Firmendaten, ein gepflegtes Profil und eine klare Website erhöhen die Chance, dass Ihr Unternehmen korrekt beschrieben wird. Eine Garantie gibt es nicht.",
        },
        {
          q: "Arbeiten Sie auch auf Französisch?",
          a: "Ja. Wir pflegen Profile und lokale Inhalte auf Deutsch und Französisch, was gerade in zweisprachigen Regionen wichtig ist.",
        },
      ],
      ctaTitle: "Wie sichtbar sind Sie in Google Maps?",
      ctaText:
        "Senden Sie uns Ihren Firmennamen und Ihre Website. Wir sehen uns Profil und Einträge an und melden uns für eine kostenlose Erstberatung.",
    },
    fr: {
      slug: "referencement-local",
      navLabel: "Référencement local",
      meta: {
        title: "Référencement local : Google Maps, fiche Google",
        description:
          "Référencement local pour PME suisses : fiche Google Business Profile, Google Maps, annuaires, avis et pages locales. Soyez trouvé dans votre région.",
      },
      eyebrow: "Référencement local",
      h1: "Référencement local : être trouvé sur Google Maps et dans votre région",
      lead:
        "Quand quelqu'un cherche « électricien près de moi » ou « fiduciaire Neuchâtel », Google affiche d'abord une carte avec des entreprises locales. Nous faisons en sorte que votre entreprise y figure avec des données complètes et correctes, et que votre site soutienne cette visibilité.",
      features: [
        {
          title: "Fiche Google Business Profile",
          text: "Créer ou reprendre, valider, puis soigner catégories, prestations, horaires, photos et description.",
        },
        {
          title: "Données cohérentes (NAP)",
          text: "Nom, adresse et téléphone identiques sur le site, Google, local.ch, search.ch, Apple Plans et les autres annuaires.",
        },
        {
          title: "Pages locales sur le site",
          text: "Des pages pour vos principales localités et prestations, avec un vrai contenu local plutôt que des textes copiés.",
        },
        {
          title: "Des avis avec méthode",
          text: "Un déroulement simple pour que les clients satisfaits laissent un avis, et des modèles de réponses factuelles.",
        },
        {
          title: "Données structurées",
          text: "Vos données d'entreprise sont balisées sur le site pour que les moteurs de recherche les attribuent sans ambiguïté.",
        },
        {
          title: "Suivi compréhensible",
          text: "Appels, itinéraires et clics depuis la fiche, recherches depuis la Search Console, expliqués simplement.",
        },
      ],
      problemsTitle: "Vous reconnaissez-vous ?",
      problems: [
        {
          title: "Invisible sur Google Maps",
          text: "Pour votre prestation, trois concurrents apparaissent sur la carte, votre entreprise seulement après plusieurs défilements, voire pas du tout.",
        },
        {
          title: "Des données fausses ou anciennes",
          text: "Un ancien numéro sur local.ch, des horaires erronés sur Google, une ancienne raison sociale dans un annuaire : cela coûte des appels et de la confiance.",
        },
        {
          title: "Peu d'avis",
          text: "Les clients satisfaits existent, mais peu laissent un avis. Les concurrents avec plus d'avis paraissent plus fiables.",
        },
        {
          title: "Fiche et site ne vont pas ensemble",
          text: "La fiche renvoie à la page d'accueil, les prestations manquent et le site ne mentionne pas les localités où vous intervenez.",
        },
      ],
      benefitsTitle: "Ce que le référencement local vous apporte",
      benefits: [
        {
          title: "Visible au bon moment",
          text: "Les recherches locales ont souvent une intention concrète : appeler, passer, prendre rendez-vous. C'est là que vous apparaissez.",
        },
        {
          title: "Des contacts directs",
          text: "Depuis la fiche, on appelle, on planifie un itinéraire ou on visite le site. Sans passer par la publicité.",
        },
        {
          title: "La confiance par les avis",
          text: "De vrais avis et des réponses factuelles montrent comment vous travaillez. Cela aide à vous choisir.",
        },
        {
          title: "Une base pour les recherches IA",
          text: "Des données claires et cohérentes aident aussi ChatGPT ou les aperçus IA de Google à décrire correctement votre entreprise.",
        },
      ],
      process: [
        {
          title: "État des lieux",
          text: "Nous examinons votre fiche Google, les principaux annuaires, le site et la concurrence locale pour vos recherches clés.",
        },
        {
          title: "Nettoyer les données",
          text: "Nous fixons une seule écriture correcte de vos données et corrigeons les entrées divergentes dans la mesure du possible.",
        },
        {
          title: "Optimiser la fiche",
          text: "Catégories, prestations, description, horaires, photos et liens sont renseignés de manière complète et pertinente.",
        },
        {
          title: "Renforcer le site",
          text: "Page de contact, données structurées et, si utile, pages locales pour vos principales localités et prestations.",
        },
        {
          title: "Avis et entretien",
          text: "Un processus pour les avis, des publications régulières et un contrôle que toutes les données restent à jour.",
        },
      ],
      fit: {
        yes: [
          "Votre clientèle vient surtout de votre région : artisan, cabinet, restaurant, commerce ou prestataire de services.",
          "Vous avez une adresse fixe ou une zone d'intervention claire où vous rendez visite à vos clients.",
          "Vous êtes prêt à demander activement des avis et à fournir des photos de votre quotidien.",
        ],
        no: [
          "Vous vendez uniquement en ligne dans toute la Suisse sans ancrage local. Le SEO classique est alors plus important.",
          "Vous voulez acheter des avis ou créer des fiches avec des adresses fictives. C'est contraire aux règles de Google et nuit à long terme.",
          "Vous attendez une place garantie parmi les trois premiers résultats de la carte. Personne ne peut le promettre sérieusement.",
        ],
      },
      sections: [
        {
          h2: "Comment Google choisit les résultats locaux",
          paragraphs: [
            "Google cite trois facteurs principaux pour les résultats locaux : la pertinence, la distance et la notoriété. La pertinence mesure à quel point votre fiche et votre site correspondent à la recherche. La distance dépend de la position de la personne qui cherche et de votre adresse ou zone desservie. La notoriété est déduite entre autres des avis, des mentions sur le web et de la qualité de votre site.",
            "Vous ne pouvez pas influencer la distance, mais bien les deux autres facteurs. Une fiche complète avec les bonnes catégories, un site avec des pages de prestations claires et de vrais avis sont les leviers les plus efficaces. Les astuces comme des mots-clés dans le nom ou de fausses adresses enfreignent les règles et peuvent entraîner la suspension de la fiche.",
          ],
        },
        {
          h2: "Bien entretenir sa fiche Google",
          paragraphs: [
            "La fiche est le cœur du référencement local. Il faut la bonne catégorie principale, des catégories secondaires pertinentes, une description avec vos propres mots, les prestations avec de courtes explications, des horaires à jour y compris les jours fériés et des photos qui montrent vraiment votre entreprise. Le lien vers le site doit mener à la page la plus pertinente, pas forcément à l'accueil.",
            "Vous trouverez un guide pas à pas dans [Optimiser sa fiche Google Business Profile](guide:google-unternehmensprofil). Si le temps vous manque, nous prenons en charge la configuration et l'entretien.",
          ],
        },
        {
          h2: "Cohérence NAP : partout les mêmes données",
          paragraphs: [
            "NAP signifie Name, Address, Phone : nom, adresse et téléphone. Si ces données diffèrent entre le site, Google, local.ch, search.ch, Apple Plans, Bing, les annuaires sectoriels et les réseaux sociaux, un doute naît sur la bonne information. Pour les personnes, c'est agaçant. Pour les moteurs de recherche et les assistants IA, c'est un signal de manque de fiabilité.",
            "Nous fixons une écriture de référence, par exemple « rue » ou « r. » et le format du numéro avec ou sans indicatif, puis alignons les principales entrées. Sur votre site, nous balisons en plus ces données avec des données structurées.",
          ],
          bullets: [
            "Raison sociale comme au registre du commerce ou comme utilisée au quotidien, mais partout identique",
            "Adresse dans une écriture uniforme",
            "Un numéro principal, partout au même format",
            "Horaires identiques sur le site et sur la fiche",
          ],
        },
        {
          h2: "Des pages locales vraiment utiles",
          paragraphs: [
            "Si vous intervenez dans plusieurs localités, des pages par localité ou région peuvent aider. L'essentiel est que chaque page ait un contenu propre : les prestations proposées sur place, les projets réalisés, les particularités du lieu, comme le bilinguisme à Bienne. Des pages qui ne diffèrent que par le nom de la ville apportent peu et peuvent nuire au site.",
            "Voyez comment nous l'appliquons pour nous-mêmes sur nos pages [SEO à Bienne](citySeo:biel), [SEO à Soleure](citySeo:solothurn) et [SEO à Berne](citySeo:bern). Plus de contexte et un plan pour les huit premières semaines dans le guide [Référencement local pour PME](guide:lokales-seo-kmu).",
          ],
        },
        {
          h2: "Référencement local et SEO classique ensemble",
          paragraphs: [
            "Le référencement local ne remplace pas un bon site, il s'appuie sur lui. Une fiche solide qui renvoie vers un site lent et confus gaspille son potentiel. À l'inverse, le meilleur site sert peu si la fiche est incomplète. Nous considérons donc les deux ensemble. Pour les recherches suprarégionales et l'optimisation technique, nous proposons le [référencement naturel](service:seo) comme prestation à part.",
            "Vous voulez savoir où vous en êtes ? Avec notre [analyse de site gratuite](page:website-check), nous examinons votre site et votre fiche Google et vous indiquons les trois mesures à prendre en premier.",
          ],
        },
      ],
      faq: [
        {
          q: "Qu'est-ce que le référencement local ?",
          a: "Le référencement local regroupe les mesures qui permettent à une entreprise d'être trouvée lors de recherches avec une dimension locale, par exemple sur Google Maps et dans la zone carte des résultats. Il comprend la fiche Google, des données cohérentes, les avis et des contenus locaux sur le site.",
        },
        {
          q: "Combien coûte le référencement local ?",
          a: "L'effort dépend de l'état de votre fiche, du nombre de sites et de la concurrence. Après un premier entretien gratuit, vous recevez un devis sans engagement, ponctuel ou pour un suivi régulier.",
        },
        {
          q: "En combien de temps le référencement local agit-il ?",
          a: "Les corrections de la fiche sont souvent visibles en quelques jours. De meilleures positions sur la carte prennent généralement quelques semaines à quelques mois, selon la concurrence et le point de départ.",
        },
        {
          q: "Faut-il une adresse pour le référencement local ?",
          a: "Une fiche Google demande une adresse réelle ou une zone desservie. Les entreprises qui se déplacent chez leurs clients peuvent masquer l'adresse et indiquer des zones desservies.",
        },
        {
          q: "Puis-je inscrire plusieurs sites ?",
          a: "Oui, s'il s'agit de vrais sites avec du personnel et des horaires. Chaque site a besoin de sa propre fiche et idéalement de sa propre page sur le site internet.",
        },
        {
          q: "Ai-je le droit de demander des avis à mes clients ?",
          a: "Oui, c'est autorisé et utile. Ce qui est interdit : acheter des avis, offrir une récompense ou ne solliciter que les clients satisfaits. Nous vous aidons à mettre en place un processus simple et loyal.",
        },
        {
          q: "Comment réagir à un avis négatif ?",
          a: "Répondre de manière factuelle, aimable et rapide, prendre la remarque au sérieux et proposer une solution. Une bonne réponse pèse souvent plus que l'avis lui-même. Un avis contraire aux règles peut être signalé à Google.",
        },
        {
          q: "Quelle différence entre référencement local et SEO ?",
          a: "Le SEO classique améliore la visibilité du site dans les résultats habituels, aussi au-delà de la région. Le référencement local se concentre sur les recherches avec un lieu et sur la carte. Pour la plupart des PME, la combinaison est idéale.",
        },
        {
          q: "Le référencement local aide-t-il pour ChatGPT et les recherches IA ?",
          a: "Indirectement, oui. Les recherches IA s'appuient sur les informations du web. Des données cohérentes, une fiche soignée et un site clair augmentent les chances que votre entreprise soit correctement décrite. Il n'y a cependant aucune garantie.",
        },
        {
          q: "Travaillez-vous aussi en allemand ?",
          a: "Oui. Nous gérons fiches et contenus locaux en français et en allemand, ce qui est essentiel dans les régions bilingues.",
        },
      ],
      ctaTitle: "Êtes-vous visible sur Google Maps ?",
      ctaText:
        "Envoyez-nous le nom de votre entreprise et votre site. Nous examinons fiche et annuaires et vous recontactons pour un premier conseil gratuit.",
    },
  },
};
