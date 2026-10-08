import type { Guide } from "../types";

export const webseiteKosten: Guide = {
  key: "webseite-kosten",
  date: "2026-10-01",
  updated: "2026-10-08",
  readingMinutes: 8,
  related: ["webdesign", "website-redesign", "onlineshop"],
  relatedGuides: ["webagentur-waehlen", "webagentur-unterschied", "kmu-webseite-checkliste"],
  cities: ["grenchen", "biel", "solothurn", "bern"],
  content: {
    de: {
      slug: "was-kostet-eine-webseite",
      meta: {
        title: "Was kostet eine Webseite? Die 7 Preisfaktoren",
        description:
          "Was kostet eine Webseite in der Schweiz? Wir erklären die 7 Faktoren, die den Preis bestimmen, und wie Sie zu einer passenden Offerte kommen.",
      },
      h1: "Was kostet eine Webseite? Die 7 Faktoren, die den Preis bestimmen",
      lead: "Auf die Frage nach den Kosten einer Webseite gibt es keine seriöse Pauschalantwort. Wer versteht, welche Faktoren den Aufwand bestimmen, kann Offerten besser vergleichen und sein Budget gezielt einsetzen.",
      keyTakeaways: [
        "Den Aufwand bestimmen vor allem Umfang, Design, Inhalte, Funktionen, SEO, das Redaktionssystem und die laufende Wartung.",
        "Inhalte wie Texte und Fotos werden bei der Planung am häufigsten unterschätzt.",
        "Mehrsprachigkeit braucht neben Übersetzungen auch eine saubere technische Umsetzung mit eigenen URLs.",
        "Vergleichen Sie Offerten Punkt für Punkt und achten Sie auf laufende Kosten nach dem Launch.",
        "Eine verlässliche Offerte entsteht erst, wenn Ziele, Funktionen und vorhandene Inhalte klar sind.",
      ],
      sections: [
        {
          h2: "Faktor 1: Umfang und Anzahl Seiten",
          paragraphs: [
            "Der offensichtlichste Kostentreiber ist der Umfang. Eine kompakte Webseite mit Startseite, Angebot, Über uns und Kontakt ist schneller umgesetzt als ein Auftritt mit Dutzenden Unterseiten, Standortseiten und einem Blog. Jede Seite braucht eine Struktur, ein Layout, Inhalte und eine saubere technische Umsetzung. Entscheidend ist dabei weniger die reine Seitenzahl als die Frage, wie viele unterschiedliche Seitentypen gestaltet und entwickelt werden müssen.",
            "Bevor Sie Offerten einholen, lohnt sich eine einfache Sitemap: Welche Seiten braucht Ihr Unternehmen wirklich, welche sind nur «nice to have»? Oft ist es sinnvoll, mit einem schlanken Kern zu starten und den Auftritt später schrittweise zu erweitern. So investieren Sie zuerst dort, wo Ihre Kundinnen und Kunden tatsächlich suchen, und vermeiden Seiten, die kaum jemand besucht.",
          ],
          bullets: [
            "Anzahl Seiten und Unterseiten",
            "Anzahl unterschiedlicher Seitentypen (z. B. Leistung, Projekt, Blogartikel)",
            "Geplante Erweiterungen in den nächsten ein bis zwei Jahren",
          ],
        },
        {
          h2: "Faktor 2: Vorlage oder individuelles Design",
          paragraphs: [
            "Ein fertiges Template ist schnell eingerichtet, wirkt aber oft austauschbar und lässt sich nur begrenzt an Ihre Marke anpassen. Ein individuelles Webdesign wird dagegen von Grund auf für Ihr Unternehmen entwickelt: Farben, Typografie, Bildsprache und Seitenaufbau orientieren sich an Ihrer Zielgruppe und Ihrem Corporate Design. Das braucht mehr Konzeptions- und Gestaltungsarbeit, hebt Sie aber klar von der Konkurrenz ab.",
            "Auch der Detailgrad spielt mit: Animationen, eigens gestaltete Illustrationen oder ein komplett neues Logo erhöhen den Aufwand. Besteht bereits ein klares Corporate Design mit Logo, Farben und Schriften, kann die Gestaltung darauf aufbauen. Fehlt es noch, empfiehlt es sich, Branding und Webdesign gemeinsam zu planen, damit der ganze Auftritt aus einem Guss entsteht.",
          ],
        },
        {
          h2: "Faktor 3: Inhalte wie Texte, Fotos und Videos",
          paragraphs: [
            "Inhalte werden bei der Budgetplanung am häufigsten unterschätzt. Liefern Sie fertige Texte und gute Bilder, reduziert das den Aufwand der Agentur deutlich. Sollen die Texte hingegen professionell und suchmaschinenoptimiert geschrieben werden, kommen Konzeption und Redaktion dazu. Gute Texte sind kein Detail: Sie entscheiden, ob Besucherinnen und Besucher Ihr Angebot verstehen und Kontakt aufnehmen.",
            "Ähnlich ist es bei Bildern. Stockfotos sind rasch verfügbar, wirken aber selten authentisch. Eigene Fotos von Team, Räumlichkeiten und Produkten schaffen Vertrauen, setzen aber ein Fotoshooting voraus. Klären Sie deshalb früh, welche Inhalte bereits vorhanden sind, was überarbeitet werden muss und was komplett neu entstehen soll. Eine solche Inhaltsübersicht macht Offerten vergleichbarer.",
          ],
          bullets: [
            "Texte selbst liefern oder schreiben lassen",
            "Eigene Fotos, Fotoshooting oder Stockbilder",
            "Videos, Grafiken und Downloads wie PDF-Broschüren",
          ],
        },
        {
          h2: "Faktor 4: Funktionen wie Buchung, Shop und Mehrsprachigkeit",
          paragraphs: [
            "Jede Funktion, die über reine Informationsseiten hinausgeht, beeinflusst den Aufwand. Ein einfaches Kontaktformular ist schnell eingebaut. Ein Online-Buchungssystem, ein Kundenbereich, eine Anbindung an Ihre bestehende Software oder ein [Onlineshop](service:onlineshop) mit Zahlungsabwicklung erfordern dagegen deutlich mehr Planung, Entwicklung und Tests. Bei Shops kommen zusätzlich Produktdaten, Versandregeln und Zahlungsarten wie TWINT dazu.",
            "In der Schweiz ist zudem die Mehrsprachigkeit ein wichtiger Faktor. Ein Auftritt auf Deutsch und Französisch braucht nicht nur Übersetzungen, sondern auch eine saubere technische Umsetzung mit eigenen URLs pro Sprache, damit Google beide Versionen korrekt einordnet. Besonders in zweisprachigen Regionen wie Biel/Bienne zahlt sich dieser Aufwand aus, weil Sie beide Sprachgruppen direkt ansprechen. Worauf es dabei ankommt, lesen Sie im Ratgeber [Zweisprachige Webseite](guide:zweisprachige-webseite).",
          ],
        },
        {
          h2: "Faktor 5: Suchmaschinenoptimierung (SEO)",
          paragraphs: [
            "Eine Webseite, die niemand findet, bringt kaum Anfragen. Grundlegendes technisches SEO gehört deshalb zu jeder professionellen Webseite: schnelle Ladezeiten, eine klare Seitenstruktur, sinnvolle Titel und Beschreibungen, mobile Optimierung und eine korrekte Indexierung. Diese Basis entsteht am besten gleich beim Aufbau, weil nachträgliche Korrekturen meist aufwendiger sind und bestehende Inhalte oft nochmals angepasst werden müssen.",
            "Darüber hinaus gibt es weiterführende Massnahmen: Keyword-Recherche, eigene Seiten für Regionen oder Leistungen, die Optimierung Ihres [Google-Unternehmensprofils](guide:google-unternehmensprofil) oder regelmässige Ratgeberinhalte. Wie viel davon sinnvoll ist, hängt von Ihrer Konkurrenz und Ihren Zielen ab. Ein lokales Gewerbe braucht eine andere Strategie als ein Unternehmen, das schweizweit Kundschaft sucht. Wir empfehlen nur Massnahmen, die zu Ihren Zielen passen.",
          ],
        },
        {
          h2: "Faktor 6 und 7: CMS und laufende Wartung",
          paragraphs: [
            "Möchten Sie Inhalte selbst anpassen, braucht Ihre Webseite ein Content-Management-System (CMS). Wie komfortabel die Bearbeitung sein soll, beeinflusst den Aufwand: Ein paar editierbare Textfelder sind einfacher umzusetzen als ein flexibles System, in dem Sie neue Seiten, Blogartikel oder Teammitglieder selbst anlegen. Eine kurze Einführung gehört idealerweise ebenfalls dazu, damit Sie Ihre Webseite nach dem Go-live sicher selbst bearbeiten können.",
            "Nach dem Go-live ist die Arbeit nicht vorbei. Hosting, Domain, Sicherheitsupdates, Backups und kleinere Anpassungen verursachen laufende Kosten. Planen Sie diese von Anfang an ein, statt nur die einmalige Erstellung zu betrachten. Eine gepflegte Webseite bleibt sicher, schnell und aktuell und schützt so Ihre Investition über Jahre. Ein [Wartungsvertrag](service:wartung) schafft hier klare Verhältnisse.",
          ],
          bullets: [
            "Hosting und Domain",
            "Sicherheitsupdates und Backups",
            "Inhaltliche Anpassungen und Support",
          ],
        },
        {
          h2: "Offerten richtig vergleichen",
          paragraphs: [
            "Zwei Offerten mit ähnlichem Endbetrag können sehr Unterschiedliches enthalten. Legen Sie die Angebote nebeneinander und prüfen Sie Punkt für Punkt: Sind Texte, Bilder, Sprachen, SEO-Grundlagen, Datenschutzerklärung, Schulung und Projektleitung enthalten? Wie viele Korrekturrunden sind vorgesehen? Wem gehören Domain und Inhalte nach dem Projekt? Eine Offerte, die hier vage bleibt, wird später oft teurer.",
            "Achten Sie auch auf das, was nach dem Launch passiert: Hosting, Updates, Backups und Support. Eine günstige Erstellung mit teurer oder unklarer Betreuung ist über einige Jahre selten die bessere Wahl. Zwölf konkrete Fragen für dieses Gespräch haben wir im Ratgeber [Webagentur wählen](guide:webagentur-waehlen) zusammengestellt. Welche Inhalte eine KMU-Webseite überhaupt braucht, zeigt unsere [Checkliste für KMU-Webseiten](guide:kmu-webseite-checkliste).",
          ],
          bullets: [
            "Leistungen einzeln aufgeführt statt Pauschalposten",
            "Laufende Kosten separat ausgewiesen",
            "Anzahl Korrekturrunden und Vorgehen bei Zusatzwünschen",
            "Eigentum an Domain, Code und Inhalten geregelt",
          ],
        },
        {
          h2: "So erhalten Sie eine verlässliche Offerte",
          paragraphs: [
            "Weil jedes Projekt anders ist, veröffentlichen wir keine Pauschalpreise. Eine seriöse Offerte entsteht erst, wenn klar ist, was Ihre Webseite leisten soll. Je besser Sie Ziele, gewünschte Funktionen und vorhandene Inhalte beschreiben, desto genauer lässt sich der Aufwand einschätzen. Achten Sie beim Vergleich mehrerer Offerten darauf, dass tatsächlich dieselben Leistungen enthalten sind.",
            "Bei Webnova besprechen wir Ihr Vorhaben zuerst in einem unverbindlichen Gespräch. Danach erhalten Sie eine individuelle Offerte, die transparent aufzeigt, welche Leistungen enthalten sind und welche laufenden Kosten anfallen. Fragen Sie jetzt Ihre unverbindliche Offerte an. Wir melden uns persönlich bei Ihnen und beantworten gerne alle offenen Fragen.",
          ],
        },
      ],
      faq: [
        {
          q: "Warum veröffentlicht Webnova keine Preise?",
          a: "Weil sich Webseiten in Umfang, Design, Inhalten und Funktionen stark unterscheiden. Ein Pauschalpreis wäre für einfache Projekte zu hoch oder würde bei grösseren Projekten wichtige Leistungen weglassen. Mit einer individuellen Offerte bezahlen Sie genau das, was Sie brauchen.",
        },
        {
          q: "Welche Angaben braucht es für eine Offerte?",
          a: "Hilfreich sind Ihre Ziele, eine grobe Liste der gewünschten Seiten, benötigte Funktionen wie Buchung oder Shop, die Sprachen und die Information, ob Texte und Bilder bereits vorhanden sind. Was noch offen ist, klären wir gemeinsam im Erstgespräch.",
        },
        {
          q: "Gibt es neben der Erstellung laufende Kosten?",
          a: "Ja. Hosting, Domain, Updates, Backups und allfällige Anpassungen verursachen laufende Kosten. Wir weisen diese in der Offerte separat aus, damit Sie Ihr Budget realistisch planen können.",
        },
        {
          q: "Kann ich klein starten und die Webseite später erweitern?",
          a: "Ja, das ist oft sinnvoll. Mit einer sauberen technischen Basis lassen sich zusätzliche Seiten, Sprachen oder Funktionen später ergänzen, ohne die Webseite neu bauen zu müssen.",
        },
      ],
    },
    fr: {
      slug: "combien-coute-un-site-internet",
      meta: {
        title: "Combien coûte un site internet ? Les 7 facteurs",
        description:
          "Combien coûte un site internet en Suisse ? Découvrez les 7 facteurs qui déterminent le prix et comment obtenir une offre adaptée à votre projet.",
      },
      h1: "Combien coûte un site internet ? Les 7 facteurs qui déterminent le prix",
      lead: "Il n'existe pas de réponse forfaitaire sérieuse à la question du prix d'un site internet. En comprenant les facteurs qui influencent le travail, vous comparez mieux les offres et investissez votre budget là où il compte.",
      keyTakeaways: [
        "L'effort dépend surtout de l'ampleur, du design, des contenus, des fonctions, du SEO, du système de gestion et de la maintenance.",
        "Les contenus comme les textes et les photos sont le plus souvent sous-estimés lors de la planification.",
        "Le multilinguisme demande, en plus des traductions, une réalisation technique propre avec des URL distinctes.",
        "Comparez les devis point par point et tenez compte des coûts courants après la mise en ligne.",
        "Un devis fiable n'est possible que lorsque objectifs, fonctions et contenus disponibles sont clairs.",
      ],
      sections: [
        {
          h2: "Facteur 1 : l'ampleur et le nombre de pages",
          paragraphs: [
            "Le premier facteur de coût est l'ampleur du projet. Un site compact avec une page d'accueil, vos prestations, une présentation et un formulaire de contact se réalise plus rapidement qu'un site avec des dizaines de sous-pages, des pages par localité et un blog. Chaque page demande une structure, une mise en page, des contenus et une intégration technique soignée. Ce qui compte surtout, c'est le nombre de types de pages différents à concevoir.",
            "Avant de demander des offres, établissez une arborescence simple : quelles pages sont vraiment nécessaires pour votre entreprise, lesquelles sont seulement « un plus » ? Il est souvent judicieux de démarrer avec un noyau solide, puis d'étoffer le site par étapes. Vous investissez ainsi d'abord là où vos clients cherchent réellement et évitez des pages que personne ne consulte.",
          ],
          bullets: [
            "Nombre de pages et de sous-pages",
            "Nombre de types de pages différents (prestation, projet, article de blog…)",
            "Extensions prévues dans les un à deux ans",
          ],
        },
        {
          h2: "Facteur 2 : le design, modèle ou sur mesure",
          paragraphs: [
            "Un thème prêt à l'emploi s'installe rapidement, mais paraît souvent interchangeable et ne s'adapte que partiellement à votre marque. Un webdesign sur mesure est en revanche conçu spécialement pour votre entreprise : couleurs, typographie, images et structure des pages sont pensées pour votre public cible et votre identité visuelle. Cela demande davantage de conception et de création, mais vous distingue clairement de la concurrence.",
            "Le niveau de détail joue aussi un rôle : animations, illustrations créées sur mesure ou nouveau logo augmentent le travail. Si vous disposez déjà d'une identité visuelle claire avec logo, couleurs et polices, le design peut s'appuyer dessus. Sinon, il vaut la peine de planifier branding et webdesign ensemble, afin que toute votre présence soit cohérente.",
          ],
        },
        {
          h2: "Facteur 3 : les contenus, textes, photos et vidéos",
          paragraphs: [
            "Les contenus sont le poste le plus souvent sous-estimé. Si vous fournissez des textes finalisés et de bonnes images, le travail de l'agence diminue nettement. Si les textes doivent être rédigés de manière professionnelle et optimisés pour le référencement, il faut ajouter la conception et la rédaction. De bons textes ne sont pas un détail : ils décident si vos visiteurs comprennent votre offre et vous contactent.",
            "Il en va de même pour les images. Les photos de banque d'images sont vite disponibles, mais rarement authentiques. Des photos de votre équipe, de vos locaux et de vos produits inspirent confiance, mais nécessitent une séance photo. Clarifiez donc tôt quels contenus existent déjà, lesquels doivent être retravaillés et lesquels sont à créer.",
          ],
          bullets: [
            "Textes fournis par vous ou rédigés par l'agence",
            "Photos existantes, séance photo ou banque d'images",
            "Vidéos, graphiques et documents à télécharger (brochures PDF, etc.)",
          ],
        },
        {
          h2: "Facteur 4 : les fonctions, réservation, boutique et multilinguisme",
          paragraphs: [
            "Chaque fonction qui va au-delà de simples pages d'information influence le travail. Un formulaire de contact s'intègre rapidement. Un système de réservation en ligne, un espace client, une connexion à votre logiciel ou une boutique en ligne avec paiement demandent en revanche bien plus de planification, de développement et de tests. Pour une boutique s'ajoutent les fiches produits, les règles d'expédition et des moyens de paiement comme TWINT.",
            "En Suisse, le multilinguisme est un autre facteur important. Un site en français et en allemand ne se résume pas à une traduction : il faut une mise en œuvre technique propre, avec des URL distinctes par langue, pour que Google classe correctement chaque version. Dans une région bilingue comme Bienne, cet investissement est particulièrement payant.",
          ],
        },
        {
          h2: "Facteur 5 : le référencement naturel (SEO)",
          paragraphs: [
            "Un site que personne ne trouve génère peu de demandes. Les bases du référencement technique font donc partie de tout site professionnel : temps de chargement rapides, structure claire, titres et descriptions pertinents, optimisation mobile et indexation correcte. Ces fondations se posent idéalement dès la création, car les corrections ultérieures sont généralement plus coûteuses en temps.",
            "D'autres mesures vont plus loin : recherche de mots-clés, pages dédiées à vos régions ou prestations, optimisation de votre fiche d'établissement Google ou publication régulière de guides. Leur pertinence dépend de votre concurrence et de vos objectifs. Un artisan local n'a pas besoin de la même stratégie qu'une entreprise qui cherche des clients dans toute la Suisse.",
          ],
        },
        {
          h2: "Facteurs 6 et 7 : le CMS et la maintenance",
          paragraphs: [
            "Si vous souhaitez modifier vous-même vos contenus, votre site a besoin d'un système de gestion de contenu (CMS). Le confort d'édition souhaité influence le travail : quelques champs de texte modifiables sont plus simples à mettre en place qu'un système flexible permettant de créer de nouvelles pages, des articles ou des fiches d'équipe. Une courte prise en main fait idéalement partie du projet.",
            "Le travail ne s'arrête pas à la mise en ligne. Hébergement, nom de domaine, mises à jour de sécurité, sauvegardes et petites adaptations entraînent des coûts récurrents. Prévoyez-les dès le départ plutôt que de considérer uniquement la création. Un site bien entretenu reste sûr, rapide et à jour, et protège votre investissement sur la durée.",
          ],
          bullets: [
            "Hébergement et nom de domaine",
            "Mises à jour de sécurité et sauvegardes",
            "Adaptations de contenu et support",
          ],
        },
        {
          h2: "Bien comparer les devis",
          paragraphs: [
            "Deux devis au montant similaire peuvent contenir des prestations très différentes. Placez les offres côte à côte et vérifiez point par point : textes, images, langues, bases SEO, déclaration de protection des données, formation et gestion de projet sont-ils compris ? Combien de tours de corrections sont prévus ? À qui appartiennent le domaine et les contenus après le projet ? Un devis vague sur ces points revient souvent plus cher par la suite.",
            "Regardez aussi ce qui se passe après la mise en ligne : hébergement, mises à jour, sauvegardes et support. Une création bon marché avec un suivi coûteux ou flou est rarement le meilleur choix sur plusieurs années. Nous avons réuni douze questions concrètes dans l'article [Choisir une agence web](guide:webagentur-waehlen). Les contenus indispensables d'un site de PME sont détaillés dans notre [checklist pour PME et artisans](guide:kmu-webseite-checkliste).",
          ],
          bullets: [
            "Prestations détaillées plutôt que des forfaits globaux",
            "Coûts récurrents indiqués séparément",
            "Nombre de tours de corrections et gestion des demandes supplémentaires",
            "Propriété du domaine, du code et des contenus réglée",
          ],
        },
        {
          h2: "Comment obtenir une offre fiable",
          paragraphs: [
            "Comme chaque projet est différent, nous ne publions pas de prix forfaitaires. Une offre sérieuse n'est possible que lorsque l'on sait ce que votre site doit accomplir. Plus vous décrivez précisément vos objectifs, les fonctions souhaitées et les contenus existants, plus l'estimation sera juste. Lorsque vous comparez plusieurs offres, vérifiez qu'elles comprennent bien les mêmes prestations.",
            "Chez Webnova, nous discutons d'abord de votre projet lors d'un entretien sans engagement. Vous recevez ensuite une offre individuelle qui indique clairement les prestations comprises et les coûts récurrents. Demandez dès maintenant votre offre sans engagement : nous vous recontactons personnellement et répondons volontiers à toutes vos questions.",
          ],
        },
      ],
      faq: [
        {
          q: "Pourquoi Webnova ne publie-t-elle pas de prix ?",
          a: "Parce que les sites internet varient fortement en ampleur, en design, en contenus et en fonctions. Un prix forfaitaire serait trop élevé pour un projet simple ou omettrait des prestations importantes pour un projet plus vaste. Avec une offre individuelle, vous payez exactement ce dont vous avez besoin.",
        },
        {
          q: "De quelles informations avez-vous besoin pour une offre ?",
          a: "Vos objectifs, une liste approximative des pages souhaitées, les fonctions nécessaires comme une réservation ou une boutique, les langues et le fait que les textes et images existent déjà ou non. Ce qui reste ouvert, nous le clarifions ensemble lors du premier entretien.",
        },
        {
          q: "Y a-t-il des coûts récurrents en plus de la création ?",
          a: "Oui. Hébergement, nom de domaine, mises à jour, sauvegardes et éventuelles adaptations entraînent des coûts récurrents. Nous les indiquons séparément dans l'offre pour que vous puissiez planifier votre budget de manière réaliste.",
        },
        {
          q: "Puis-je commencer petit et agrandir mon site plus tard ?",
          a: "Oui, c'est souvent judicieux. Avec une base technique solide, des pages, des langues ou des fonctions supplémentaires peuvent être ajoutées plus tard sans reconstruire le site.",
        },
      ],
    },
  },
};
