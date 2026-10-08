import type { Guide } from "../types";

export const geoKiSuche: Guide = {
  key: "geo-ki-suche",
  date: "2026-10-08",
  readingMinutes: 10,
  related: ["ki-sichtbarkeit", "seo", "local-seo"],
  relatedGuides: ["lokales-seo-kmu", "google-unternehmensprofil", "kmu-webseite-checkliste"],
  content: {
    de: {
      slug: "sichtbar-in-chatgpt-ki-suche-geo",
      meta: {
        title: "Sichtbar in ChatGPT und KI-Suche (GEO) für KMU",
        description:
          "Wie KMU in ChatGPT, Perplexity und Google AI Overviews sichtbar werden: klare Fakten, strukturierte Daten, FAQ und einheitliche Firmendaten.",
      },
      h1: "Sichtbar in ChatGPT und KI-Suche: GEO für KMU ehrlich erklärt",
      lead: "Immer mehr Menschen fragen nicht mehr nur Google, sondern auch ChatGPT, Perplexity oder die KI-Übersichten in der Google-Suche. Was bedeutet das für Ihr Unternehmen? Dieser Ratgeber erklärt, wie KI-Suchen Quellen auswählen, was Sie wirklich beeinflussen können und welche Versprechen Sie ignorieren sollten.",
      keyTakeaways: [
        "GEO (Generative Engine Optimization) baut auf gutem SEO auf. Google sagt selbst, dass es für die AI Overviews keine zusätzlichen Anforderungen gibt.",
        "KI-Suchen brauchen klare, überprüfbare Fakten: was Sie anbieten, wo, für wen und wie man Sie erreicht.",
        "Einheitliche Firmendaten auf Website, Google-Profil und Verzeichnissen senken das Risiko falscher Antworten.",
        "Strukturierte Daten, eine echte FAQ und technischer Zugang für Such-Crawler sind sinnvolle Grundlagen.",
        "Niemand kann eine Nennung in ChatGPT oder einen Platz in den AI Overviews garantieren.",
      ],
      sources: [
        { label: "Google Search Central: KI-Funktionen und Ihre Website", url: "https://developers.google.com/search/docs/appearance/ai-features" },
        { label: "OpenAI: Übersicht der Crawler (OAI-SearchBot, GPTBot)", url: "https://platform.openai.com/docs/bots" },
        { label: "Perplexity: Perplexity Crawlers", url: "https://docs.perplexity.ai/guides/bots" },
        { label: "llms.txt: Vorschlag für eine Datei für Sprachmodelle", url: "https://llmstxt.org/" },
        { label: "Google Business Profile Hilfe: Lokales Ranking verbessern", url: "https://support.google.com/business/answer/7091" },
      ],
      sections: [
        {
          h2: "Was sich durch KI-Suchen verändert",
          paragraphs: [
            "Bei einer klassischen Google-Suche erhalten Sie eine Liste von Links und entscheiden selbst, welchen Sie öffnen. KI-Suchen funktionieren anders: Sie lesen mehrere Quellen, fassen die Informationen zu einer Antwort zusammen und verweisen teilweise auf die verwendeten Seiten. Beispiele sind die AI Overviews und der KI-Modus von Google, die Suche in ChatGPT, Perplexity und Microsoft Copilot.",
            "Für KMU hat das zwei Folgen. Erstens beantworten KI-Systeme einfache Fragen oft direkt, ohne dass jemand eine Website besucht. Zweitens werden Unternehmen in Antworten genannt oder nicht genannt, und die genannten Angaben stimmen nicht immer. Wer dafür sorgt, dass klare und korrekte Informationen über das eigene Unternehmen verfügbar sind, verbessert seine Chancen, richtig dargestellt zu werden.",
          ],
        },
        {
          h2: "Wie KI-Suchen ihre Quellen auswählen",
          paragraphs: [
            "Die genauen Verfahren legen die Anbieter nicht offen. Bekannt ist aber, dass KI-Suchen auf Suchindizes und eigene Crawler zurückgreifen. Google verwendet für die AI Overviews den normalen Google-Index und schreibt in seiner Dokumentation, dass es keine zusätzlichen Anforderungen und keine speziellen Optimierungen braucht. Eine Seite muss indexiert und für ein Snippet in der Suche geeignet sein.",
            "OpenAI betreibt für die ChatGPT-Suche den Crawler OAI-SearchBot, Perplexity den PerplexityBot. Daneben gibt es Crawler für das Training von Sprachmodellen, etwa GPTBot. Diese Unterscheidung ist wichtig: Wer Such-Crawler in der robots.txt sperrt, kann in der jeweiligen KI-Suche nicht als Quelle erscheinen. Trainings-Crawler lassen sich bei diesen Anbietern separat steuern.",
          ],
          bullets: [
            "Die Website muss für Suchmaschinen indexierbar sein",
            "Wichtige Inhalte stehen im HTML und nicht nur in Bildern oder nachgeladenen Skripten",
            "Die robots.txt sperrt keine Such-Crawler, die Sie zulassen möchten",
            "Die Seite lädt schnell und ist technisch fehlerfrei erreichbar",
          ],
        },
        {
          h2: "Klare Fakten: die wichtigste Grundlage",
          paragraphs: [
            "KI-Systeme arbeiten mit Textabschnitten. Ein Abschnitt, der eine Frage direkt und vollständig beantwortet, ist für sie wertvoller als ein Absatz voller allgemeiner Werbesprache. Formulieren Sie deshalb auf Ihren wichtigsten Seiten eindeutige Aussagen: welche Leistungen Sie anbieten, in welchen Orten und Sprachen, für welche Kundschaft, wie ein Auftrag abläuft und wie man Sie erreicht.",
            "Hilfreich ist eine Struktur, bei der jeder Abschnitt für sich verständlich bleibt. Die Überschrift benennt das Thema, der erste Satz beantwortet die Frage, danach folgen Details und Beispiele. Diese Arbeitsweise hilft nicht nur KI-Suchen, sondern auch Ihren Besucherinnen und Besuchern und der klassischen Google-Suche. Was eine gute KMU-Website grundsätzlich enthalten sollte, lesen Sie im Ratgeber [Was eine KMU-Webseite wirklich braucht](guide:kmu-webseite-checkliste).",
          ],
        },
        {
          h2: "FAQ und strukturierte Daten",
          paragraphs: [
            "Eine gute FAQ sammelt die Fragen, die Ihre Kundschaft tatsächlich stellt, und beantwortet sie kurz und konkret. Diese Form passt besonders gut zu KI-Antworten, die ja selbst auf Fragen reagieren. Erfinden Sie keine Fragen nur für Suchbegriffe, sondern fragen Sie im Team, was am Telefon und per E-Mail immer wieder gefragt wird.",
            "Strukturierte Daten nach schema.org beschreiben Inhalte maschinenlesbar, zum Beispiel Ihr Unternehmen mit Name, Adresse, Telefon und Öffnungszeiten, Ihre Leistungen oder Ihre Fragen und Antworten. Google zeigt FAQ-Ergebnisse in der Suche nur noch für wenige Websites an, die Auszeichnung schadet aber nicht und macht Inhalte eindeutig. Wichtig ist, dass die strukturierten Daten mit dem sichtbaren Inhalt übereinstimmen. Wie stark KI-Systeme strukturierte Daten nutzen, legen die Anbieter nicht offen.",
          ],
        },
        {
          h2: "Einheitliche Firmendaten und Erwähnungen",
          paragraphs: [
            "KI-Antworten stützen sich nicht nur auf Ihre Website. Sie nutzen auch Kartendienste, Verzeichnisse wie local.ch und search.ch, Branchenportale, Bewertungen und Berichte. Stehen dort unterschiedliche Adressen, alte Telefonnummern oder frühere Firmennamen, steigt das Risiko, dass eine Antwort falsche Angaben enthält. Die Bereinigung dieser Daten ist deshalb einer der wirksamsten Schritte.",
            "Das deckt sich weitgehend mit lokalem SEO: ein gepflegtes Google-Unternehmensprofil, einheitliche Einträge und echte Bewertungen. Eine Schritt-für-Schritt-Anleitung finden Sie in den Ratgebern [Google-Unternehmensprofil optimieren](guide:google-unternehmensprofil) und [Lokales SEO für KMU](guide:lokales-seo-kmu). Erwähnungen auf glaubwürdigen Websites, etwa bei Verbänden, Partnern oder in lokalen Medien, stärken zusätzlich das Vertrauen. Gekaufte Links gehören nicht dazu.",
          ],
        },
        {
          h2: "Was Sie ignorieren sollten",
          paragraphs: [
            "Rund um GEO kursieren viele Versprechen. Seien Sie vorsichtig bei Angeboten, die garantierte Nennungen in ChatGPT oder feste Plätze in den AI Overviews zusagen. Welche Quellen eine KI-Antwort nutzt, entscheidet allein der Anbieter, und die Antworten ändern sich je nach Formulierung, Ort und Zeitpunkt. Ebenso wenig hilfreich sind massenhaft automatisch erzeugte Texte, die keinen eigenen Mehrwert bieten.",
            "Auch die Datei llms.txt wird oft als Lösung angepriesen. Es handelt sich um einen Vorschlag, Sprachmodellen eine Übersicht über eine Website zu geben. Ein verbindlicher Standard ist das nicht, und die grossen Anbieter haben nicht bestätigt, dass sie die Datei auswerten. Sie können sie ergänzen, sie ersetzt aber keine klaren Inhalte auf der Website selbst.",
          ],
        },
        {
          h2: "Ein realistischer Plan für KMU",
          paragraphs: [
            "Beginnen Sie mit einer Bestandsaufnahme: Fragen Sie ChatGPT, Perplexity und Google nach Ihrer Leistung in Ihrer Region und nach Ihrem Unternehmen selbst. Notieren Sie, wer genannt wird, welche Angaben über Sie erscheinen und welche Quellen verlinkt sind. Wiederholen Sie diese Abfragen später mit denselben Formulierungen, um Veränderungen zu erkennen.",
            "Danach bereinigen Sie Ihre Firmendaten, schärfen Startseite, Leistungsseiten und Über-uns-Seite mit klaren Fakten, ergänzen eine FAQ und prüfen Technik und strukturierte Daten. Wenn Sie dabei Unterstützung möchten, übernehmen wir diese Schritte im Rahmen unserer Leistung [Sichtbarkeit in KI-Suchen](service:ki-sichtbarkeit), kombiniert mit [Local SEO](service:local-seo) und [Suchmaschinenoptimierung](service:seo).",
          ],
          bullets: [
            "Abfragen dokumentieren: wer wird genannt, welche Angaben erscheinen",
            "Firmendaten überall vereinheitlichen",
            "Wichtigste Seiten mit klaren Fakten und FAQ ergänzen",
            "Technik, robots.txt und strukturierte Daten prüfen",
            "Abfragen regelmässig wiederholen und Inhalte nachschärfen",
          ],
        },
      ],
      faq: [
        {
          q: "Was ist der Unterschied zwischen SEO und GEO?",
          a: "SEO optimiert für die klassische Suche, GEO für KI-gestützte Antworten. GEO baut auf SEO auf: Indexierung, Technik und hilfreiche Inhalte sind für beides nötig. GEO legt zusätzlich Wert auf eindeutige Fakten und einheitliche Firmendaten im ganzen Netz.",
        },
        {
          q: "Kann ich prüfen, ob ChatGPT meine Website kennt?",
          a: "Sie können ChatGPT mit aktivierter Suche nach Ihrem Unternehmen und Ihrer Leistung fragen und schauen, welche Quellen angezeigt werden. Die Antworten schwanken jedoch, deshalb lohnt es sich, mehrere Formulierungen zu testen und die Ergebnisse zu notieren.",
        },
        {
          q: "Soll ich GPTBot in der robots.txt sperren?",
          a: "Das hängt davon ab, ob Ihre Inhalte für das Training von Sprachmodellen verwendet werden dürfen. GPTBot ist laut OpenAI für das Training zuständig, OAI-SearchBot für die Suche. Wer nur GPTBot sperrt, schliesst die ChatGPT-Suche damit nicht aus.",
        },
        {
          q: "Wirken sich Bewertungen auf KI-Antworten aus?",
          a: "Bewertungen sind öffentliche Informationen über Ihr Unternehmen und können in Antworten einfliessen. Wie stark, legen die Anbieter nicht offen. Echte, aktuelle Bewertungen und sachliche Antworten sind ohnehin für lokales SEO und das Vertrauen von Interessenten wichtig.",
        },
        {
          q: "Lohnt sich GEO auch für kleine Betriebe?",
          a: "Ja, weil die wichtigsten Schritte gleichzeitig Ihre Website, Ihr Google-Profil und Ihre lokale Sichtbarkeit verbessern. Der Aufwand lässt sich auf die wenigen Seiten und Einträge konzentrieren, die für Ihr Geschäft zählen.",
        },
      ],
    },
    fr: {
      slug: "visible-chatgpt-recherche-ia-geo",
      meta: {
        title: "Visible dans ChatGPT et la recherche IA (GEO)",
        description:
          "Comment une PME devient visible dans ChatGPT, Perplexity et les aperçus IA de Google : faits clairs, données structurées, FAQ et données cohérentes.",
      },
      h1: "Visible dans ChatGPT et la recherche IA : le GEO pour les PME expliqué honnêtement",
      lead: "De plus en plus de personnes ne posent plus leurs questions seulement à Google, mais aussi à ChatGPT, Perplexity ou aux aperçus IA de la recherche Google. Qu'est-ce que cela change pour votre entreprise ? Ce guide explique comment les recherches IA choisissent leurs sources, ce que vous pouvez vraiment influencer et quelles promesses ignorer.",
      keyTakeaways: [
        "Le GEO (Generative Engine Optimization) s'appuie sur un bon SEO. Google indique lui-même qu'il n'y a pas d'exigence supplémentaire pour les aperçus IA.",
        "Les recherches IA ont besoin de faits clairs et vérifiables : ce que vous proposez, où, pour qui et comment vous joindre.",
        "Des données cohérentes sur le site, la fiche Google et les annuaires réduisent le risque de réponses fausses.",
        "Données structurées, une vraie FAQ et l'accès technique pour les robots de recherche sont des bases utiles.",
        "Personne ne peut garantir une mention dans ChatGPT ou une place dans les aperçus IA.",
      ],
      sources: [
        { label: "Google Search Central : fonctionnalités d'IA et votre site", url: "https://developers.google.com/search/docs/appearance/ai-features" },
        { label: "OpenAI : aperçu des robots (OAI-SearchBot, GPTBot)", url: "https://platform.openai.com/docs/bots" },
        { label: "Perplexity : Perplexity Crawlers", url: "https://docs.perplexity.ai/guides/bots" },
        { label: "llms.txt : proposition de fichier pour les modèles de langage", url: "https://llmstxt.org/" },
        { label: "Aide Google Business Profile : améliorer son classement local", url: "https://support.google.com/business/answer/7091" },
      ],
      sections: [
        {
          h2: "Ce que les recherches IA changent",
          paragraphs: [
            "Dans une recherche Google classique, vous obtenez une liste de liens et choisissez vous-même lequel ouvrir. Les recherches IA fonctionnent autrement : elles lisent plusieurs sources, résument les informations en une réponse et renvoient parfois aux pages utilisées. Exemples : les aperçus IA et le mode IA de Google, la recherche de ChatGPT, Perplexity et Microsoft Copilot.",
            "Pour les PME, cela a deux conséquences. D'abord, les systèmes IA répondent souvent directement aux questions simples, sans que personne ne visite un site. Ensuite, des entreprises sont citées ou non dans les réponses, et les informations données ne sont pas toujours exactes. En rendant disponibles des informations claires et correctes sur votre entreprise, vous augmentez vos chances d'être bien présenté.",
          ],
        },
        {
          h2: "Comment les recherches IA choisissent leurs sources",
          paragraphs: [
            "Les fournisseurs ne publient pas leurs procédés exacts. On sait toutefois que les recherches IA s'appuient sur des index de recherche et sur leurs propres robots. Google utilise l'index habituel pour les aperçus IA et écrit dans sa documentation qu'aucune exigence supplémentaire ni optimisation particulière n'est nécessaire. Une page doit être indexée et pouvoir s'afficher avec un extrait dans la recherche.",
            "OpenAI exploite le robot OAI-SearchBot pour la recherche ChatGPT, Perplexity le PerplexityBot. Il existe aussi des robots destinés à l'entraînement des modèles, comme GPTBot. La distinction compte : bloquer un robot de recherche dans le robots.txt empêche d'apparaître comme source dans la recherche IA correspondante. Chez ces fournisseurs, les robots d'entraînement se règlent séparément.",
          ],
          bullets: [
            "Le site doit être indexable par les moteurs de recherche",
            "Les contenus importants figurent dans le HTML, pas seulement dans des images ou des scripts chargés après coup",
            "Le robots.txt ne bloque pas les robots de recherche que vous voulez autoriser",
            "La page se charge vite et reste techniquement accessible",
          ],
        },
        {
          h2: "Des faits clairs : la base essentielle",
          paragraphs: [
            "Les systèmes IA travaillent avec des passages de texte. Un passage qui répond directement et complètement à une question a plus de valeur qu'un paragraphe de langage publicitaire. Formulez donc sur vos pages principales des affirmations univoques : quelles prestations, dans quelles localités et langues, pour quels clients, comment se déroule une commande et comment vous joindre.",
            "Une structure où chaque passage reste compréhensible seul est utile. Le titre nomme le sujet, la première phrase répond, puis viennent détails et exemples. Cette méthode aide les recherches IA, mais aussi vos visiteurs et la recherche Google classique. Ce qu'un bon site de PME doit contenir est expliqué dans le guide [Ce dont un site de PME a vraiment besoin](guide:kmu-webseite-checkliste).",
          ],
        },
        {
          h2: "FAQ et données structurées",
          paragraphs: [
            "Une bonne FAQ rassemble les questions que vos clients posent vraiment et y répond brièvement et concrètement. Ce format convient particulièrement aux réponses IA, qui réagissent elles-mêmes à des questions. N'inventez pas de questions pour des mots-clés : demandez à votre équipe ce qui revient sans cesse au téléphone et par e-mail.",
            "Les données structurées selon schema.org décrivent les contenus de façon lisible par les machines, par exemple votre entreprise avec nom, adresse, téléphone et horaires, vos prestations ou vos questions-réponses. Google n'affiche plus les résultats FAQ que pour peu de sites, mais le balisage ne nuit pas et rend les contenus univoques. Il doit correspondre au contenu visible. Les fournisseurs ne précisent pas dans quelle mesure leurs systèmes IA l'utilisent.",
          ],
        },
        {
          h2: "Des données cohérentes et des mentions",
          paragraphs: [
            "Les réponses IA ne s'appuient pas seulement sur votre site. Elles utilisent aussi les services de cartes, des annuaires comme local.ch et search.ch, des portails sectoriels, des avis et des articles. Si on y trouve des adresses différentes, d'anciens numéros ou une ancienne raison sociale, le risque de réponse erronée augmente. Nettoyer ces données est donc l'une des mesures les plus efficaces.",
            "Cela recoupe largement le référencement local : une fiche Google soignée, des entrées cohérentes et de vrais avis. Vous trouverez un guide pas à pas dans [Optimiser sa fiche Google Business Profile](guide:google-unternehmensprofil) et [Référencement local pour PME](guide:lokales-seo-kmu). Des mentions sur des sites crédibles, comme des associations, des partenaires ou des médias locaux, renforcent encore la confiance. Les liens achetés n'en font pas partie.",
          ],
        },
        {
          h2: "Ce que vous pouvez ignorer",
          paragraphs: [
            "Beaucoup de promesses circulent autour du GEO. Méfiez-vous des offres qui garantissent des mentions dans ChatGPT ou des places fixes dans les aperçus IA. Le choix des sources d'une réponse IA appartient au seul fournisseur, et les réponses varient selon la formulation, le lieu et le moment. Les textes générés en masse sans valeur propre n'aident pas davantage.",
            "Le fichier llms.txt est aussi souvent présenté comme une solution. Il s'agit d'une proposition visant à donner aux modèles de langage un aperçu d'un site. Ce n'est pas un standard contraignant, et les grands fournisseurs n'ont pas confirmé l'exploiter. Vous pouvez l'ajouter, mais il ne remplace pas des contenus clairs sur le site lui-même.",
          ],
        },
        {
          h2: "Un plan réaliste pour les PME",
          paragraphs: [
            "Commencez par un état des lieux : demandez à ChatGPT, Perplexity et Google votre prestation dans votre région et votre entreprise elle-même. Notez qui est cité, quelles informations apparaissent sur vous et quelles sources sont liées. Répétez plus tard ces questions avec les mêmes formulations pour repérer les changements.",
            "Ensuite, nettoyez vos données d'entreprise, précisez l'accueil, les pages de prestations et la page « À propos » avec des faits clairs, ajoutez une FAQ et vérifiez technique et données structurées. Si vous souhaitez de l'aide, nous prenons ces étapes en charge dans notre prestation [Visibilité dans les recherches IA](service:ki-sichtbarkeit), combinée au [référencement local](service:local-seo) et au [SEO](service:seo).",
          ],
          bullets: [
            "Documenter les questions : qui est cité, quelles informations apparaissent",
            "Harmoniser partout les données d'entreprise",
            "Compléter les pages principales avec des faits clairs et une FAQ",
            "Vérifier technique, robots.txt et données structurées",
            "Répéter régulièrement les questions et ajuster les contenus",
          ],
        },
      ],
      faq: [
        {
          q: "Quelle différence entre SEO et GEO ?",
          a: "Le SEO optimise pour la recherche classique, le GEO pour les réponses générées par l'IA. Le GEO s'appuie sur le SEO : indexation, technique et contenus utiles sont nécessaires aux deux. Le GEO insiste en plus sur des faits univoques et des données cohérentes sur tout le web.",
        },
        {
          q: "Puis-je vérifier si ChatGPT connaît mon site ?",
          a: "Vous pouvez interroger ChatGPT avec la recherche activée sur votre entreprise et votre prestation et regarder quelles sources s'affichent. Les réponses varient, il vaut donc la peine de tester plusieurs formulations et de noter les résultats.",
        },
        {
          q: "Dois-je bloquer GPTBot dans le robots.txt ?",
          a: "Cela dépend si vos contenus peuvent servir à entraîner des modèles de langage. Selon OpenAI, GPTBot sert à l'entraînement et OAI-SearchBot à la recherche. Bloquer seulement GPTBot n'exclut pas la recherche ChatGPT.",
        },
        {
          q: "Les avis influencent-ils les réponses IA ?",
          a: "Les avis sont des informations publiques sur votre entreprise et peuvent entrer dans les réponses. Dans quelle mesure, les fournisseurs ne le disent pas. De vrais avis récents et des réponses factuelles sont de toute façon importants pour le référencement local et la confiance.",
        },
        {
          q: "Le GEO vaut-il la peine pour une petite entreprise ?",
          a: "Oui, car les principales étapes améliorent en même temps votre site, votre fiche Google et votre visibilité locale. L'effort peut se concentrer sur les quelques pages et entrées qui comptent pour votre activité.",
        },
      ],
    },
  },
};
