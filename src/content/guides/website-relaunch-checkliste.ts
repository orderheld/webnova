import type { Guide } from "../types";

export const websiteRelaunchCheckliste: Guide = {
  key: "website-relaunch-checkliste",
  date: "2026-09-20",
  readingMinutes: 7,
  related: ["website-redesign", "seo"],
  content: {
    de: {
      slug: "website-relaunch-checkliste",
      meta: {
        title: "Website-Relaunch: Checkliste in 10 Schritten",
        description:
          "Website-Relaunch ohne Ranking-Verlust: Unsere Checkliste in 10 Schritten – von der Analyse über 301-Weiterleitungen bis zur Kontrolle nach dem Go-live.",
      },
      h1: "Website-Relaunch: Die Checkliste in 10 Schritten",
      lead: "Ein Relaunch ist die Chance, Ihre Webseite moderner, schneller und wirkungsvoller zu machen. Ohne saubere Planung riskieren Sie jedoch, über Jahre aufgebaute Google-Rankings zu verlieren. Diese Checkliste führt Sie Schritt für Schritt durch das Projekt.",
      sections: [
        {
          h2: "Schritt 1 und 2: Ziele festlegen und Ist-Zustand analysieren",
          paragraphs: [
            "Am Anfang steht die Frage, warum Sie relaunchen. Wollen Sie mehr Anfragen, ein zeitgemässes Design, eine bessere Darstellung auf dem Smartphone oder einfachere Pflege? Formulieren Sie zwei bis drei messbare Ziele. Sie dienen später als Massstab für alle Entscheidungen und helfen, das Projekt nicht mit Wünschen zu überladen, die wenig zum Erfolg beitragen.",
            "Danach analysieren Sie die bestehende Webseite. Welche Seiten werden oft besucht, über welche Suchbegriffe kommen Besucherinnen und Besucher, wo springen sie ab? Daten aus der Google Search Console und Ihrem Analysetool zeigen, was heute bereits funktioniert. Diese Stärken sollten beim Relaunch unbedingt erhalten bleiben. Dokumentieren Sie die Ausgangswerte, um den Erfolg später vergleichen zu können.",
          ],
          bullets: [
            "Schritt 1: Ziele und Zielgruppen definieren",
            "Schritt 2: Besucherzahlen, Rankings und Top-Seiten analysieren",
          ],
        },
        {
          h2: "Schritt 3: Alle bestehenden URLs erfassen",
          paragraphs: [
            "Bevor irgendetwas verändert wird, brauchen Sie eine vollständige Liste aller bestehenden URLs. Dazu gehören neben den normalen Seiten auch Blogartikel, PDF-Dateien, Bilder mit Rankings und alte Kampagnenseiten. Ein Crawling-Tool, die XML-Sitemap und die Search Console liefern zusammen ein gutes Gesamtbild. Notieren Sie zu jeder URL, wie wichtig sie für Besuche und Verlinkungen ist.",
            "Diese URL-Liste ist das wichtigste Dokument des ganzen Relaunchs. Auf ihrer Basis entsteht später der Weiterleitungsplan. Fehlt eine wichtige Seite in der Liste, landet deren Traffic nach dem Go-live auf einer Fehlerseite. Nehmen Sie sich für diesen Schritt deshalb genügend Zeit, auch wenn er wenig spektakulär wirkt. Er ist die beste Versicherung für Ihre Rankings.",
          ],
        },
        {
          h2: "Schritt 4 und 5: Struktur und Inhalte planen",
          paragraphs: [
            "Mit Zielen und Analyse im Rücken planen Sie die neue Seitenstruktur. Welche Seiten bleiben, welche werden zusammengelegt, welche kommen neu dazu? Eine klare Navigation mit wenigen Hauptpunkten hilft Besucherinnen und Besuchern ebenso wie Suchmaschinen. Planen Sie auch die URLs bewusst: kurz, sprechend und, falls möglich, möglichst nahe an den bisherigen Adressen.",
            "Anschliessend geht es um die Inhalte. Gut rankende Texte sollten nicht einfach gekürzt oder ersetzt werden, sondern höchstens verbessert. Veraltete Inhalte werden aktualisiert oder entfernt, Lücken mit neuen Texten geschlossen. Bei mehrsprachigen Webseiten gilt das für jede Sprachversion, damit Deutsch und Französisch inhaltlich gleichwertig bleiben und beide Sprachversionen gut gefunden werden.",
          ],
          bullets: [
            "Schritt 4: Sitemap und URL-Struktur festlegen",
            "Schritt 5: Inhalte prüfen, überarbeiten und ergänzen",
          ],
        },
        {
          h2: "Schritt 6 und 7: Design, Entwicklung und Testumgebung",
          paragraphs: [
            "Nun entstehen Design und technische Umsetzung. Achten Sie auf ein responsives Layout, schnelle Ladezeiten, barrierearme Gestaltung und saubere Überschriftenstrukturen. Titel, Meta-Beschreibungen und Bild-Alt-Texte werden für jede Seite gepflegt. Diese technischen Grundlagen sind kein Extra, sondern Voraussetzung dafür, dass die neue Webseite mindestens so gut gefunden wird wie die alte, idealerweise sogar besser.",
            "Entwickeln Sie die neue Webseite auf einer geschützten Testumgebung, die für Suchmaschinen gesperrt ist. So können Sie in Ruhe testen, ohne dass Google unfertige Seiten indexiert. Prüfen Sie Formulare, Darstellung auf verschiedenen Geräten, Ladezeiten und Sprachumschaltung. Kurz vor dem Go-live muss die Sperre für Suchmaschinen unbedingt wieder entfernt werden. Dieser Punkt wird in der Praxis erstaunlich oft vergessen.",
          ],
          bullets: [
            "Schritt 6: Design und Entwicklung mit SEO-Grundlagen",
            "Schritt 7: Ausführliche Tests auf einer gesperrten Testumgebung",
          ],
        },
        {
          h2: "Schritt 8: 301-Weiterleitungen einrichten",
          paragraphs: [
            "Ändert sich die Adresse einer Seite, braucht es eine permanente 301-Weiterleitung von der alten auf die neue URL. Sie signalisiert Google, dass der Inhalt umgezogen ist, und überträgt den Grossteil der bisherigen Signale auf die neue Seite. Ohne Weiterleitungen sehen Besucherinnen und Besucher Fehlerseiten, und die über Jahre aufgebauten Rankings gehen verloren.",
            "Ordnen Sie jeder alten URL aus Ihrer Liste die inhaltlich passendste neue Seite zu. Leiten Sie nicht pauschal alles auf die Startseite um, denn das wertet Google oft wie eine Fehlerseite. Vermeiden Sie Weiterleitungsketten über mehrere Stationen und testen Sie alle Regeln vor dem Go-live. Auch externe Links und Einträge in Verzeichnissen profitieren so weiterhin von der richtigen Zieladresse.",
          ],
          bullets: [
            "Jede alte URL einer passenden neuen URL zuordnen",
            "Keine Sammelweiterleitungen auf die Startseite",
            "Weiterleitungsketten vermeiden",
            "Alle Weiterleitungen vor und nach dem Launch testen",
          ],
        },
        {
          h2: "Schritt 9 und 10: Go-live und Kontrolle nach dem Launch",
          paragraphs: [
            "Wählen Sie für den Go-live einen ruhigen Zeitpunkt, an dem Ihr Team erreichbar ist. Nach der Umschaltung prüfen Sie sofort Weiterleitungen, Formulare, SSL-Zertifikat und die Erreichbarkeit für Suchmaschinen. Reichen Sie die neue XML-Sitemap in der Google Search Console ein und aktualisieren Sie die Webseiten-Adresse in Ihrem Google-Unternehmensprofil, falls sie sich geändert hat.",
            "In den Wochen nach dem Launch beobachten Sie Rankings, Besucherzahlen und gemeldete Fehler in der Search Console. Leichte Schwankungen sind normal, deutliche Einbrüche weisen auf fehlende Weiterleitungen oder technische Probleme hin. Je früher Sie reagieren, desto schneller erholen sich die Rankings. Gerne begleiten wir Sie bei Ihrem Relaunch – fragen Sie unverbindlich an.",
          ],
          bullets: [
            "Schritt 9: Go-live mit sofortiger technischer Kontrolle",
            "Schritt 10: Monitoring von Rankings und Fehlern in den Wochen danach",
          ],
        },
      ],
      faq: [
        {
          q: "Verliere ich bei einem Relaunch meine Google-Rankings?",
          a: "Nicht zwingend. Werden alle bisherigen URLs erfasst, sauber per 301 weitergeleitet und gut rankende Inhalte erhalten, lassen sich Verluste weitgehend vermeiden. Leichte Schwankungen in den ersten Wochen sind normal.",
        },
        {
          q: "Was ist eine 301-Weiterleitung?",
          a: "Eine 301-Weiterleitung leitet eine alte Adresse dauerhaft auf eine neue um. Besucher landen automatisch auf der richtigen Seite, und Google überträgt die Signale der alten URL weitgehend auf die neue.",
        },
        {
          q: "Wie lange dauert ein Website-Relaunch?",
          a: "Das hängt von Umfang, Inhalten und Funktionen ab. Eine kleine Firmenwebseite ist deutlich schneller umgesetzt als ein mehrsprachiger Auftritt mit Shop. Einen realistischen Zeitplan erhalten Sie zusammen mit unserer Offerte.",
        },
        {
          q: "Kann ich beim Relaunch die Domain wechseln?",
          a: "Ja, das ist möglich, erfordert aber besondere Sorgfalt. Alle Seiten der alten Domain müssen per 301 auf die neue weitergeleitet und der Domainwechsel in der Google Search Console gemeldet werden.",
        },
      ],
    },
    fr: {
      slug: "checklist-refonte-site-internet",
      meta: {
        title: "Refonte de site internet : checklist en 10 étapes",
        description:
          "Refonte de site sans perte de positionnement : notre checklist en 10 étapes, de l'analyse aux redirections 301 jusqu'au suivi après la mise en ligne.",
      },
      h1: "Refonte de site internet : la checklist en 10 étapes",
      lead: "Une refonte est l'occasion de rendre votre site plus moderne, plus rapide et plus efficace. Sans planification rigoureuse, vous risquez toutefois de perdre des positions Google acquises au fil des années. Cette checklist vous guide pas à pas.",
      sections: [
        {
          h2: "Étapes 1 et 2 : fixer les objectifs et analyser l'existant",
          paragraphs: [
            "Tout commence par une question : pourquoi refaire votre site ? Souhaitez-vous davantage de demandes, un design actuel, un meilleur affichage sur smartphone ou une gestion plus simple ? Formulez deux ou trois objectifs mesurables. Ils serviront de référence pour toutes les décisions et éviteront de surcharger le projet avec des souhaits qui contribuent peu au résultat.",
            "Analysez ensuite le site actuel. Quelles pages sont les plus visitées, par quels mots-clés les internautes arrivent-ils, où quittent-ils le site ? Les données de la Google Search Console et de votre outil de statistiques montrent ce qui fonctionne déjà. Ces points forts doivent absolument être préservés lors de la refonte.",
          ],
          bullets: [
            "Étape 1 : définir les objectifs et les publics cibles",
            "Étape 2 : analyser la fréquentation, les positions et les pages clés",
          ],
        },
        {
          h2: "Étape 3 : recenser toutes les URL existantes",
          paragraphs: [
            "Avant de modifier quoi que ce soit, il vous faut une liste complète de toutes les URL existantes. Outre les pages classiques, elle comprend les articles de blog, les fichiers PDF, les images bien positionnées et les anciennes pages de campagne. Un outil d'exploration, le sitemap XML et la Search Console donnent ensemble une bonne vue d'ensemble. Notez pour chaque URL son importance en visites et en liens.",
            "Cette liste est le document le plus important de toute la refonte. C'est sur elle que reposera le plan de redirections. Si une page importante y manque, son trafic aboutira sur une page d'erreur après la mise en ligne. Prenez donc le temps nécessaire pour cette étape, même si elle paraît peu spectaculaire.",
          ],
        },
        {
          h2: "Étapes 4 et 5 : planifier la structure et les contenus",
          paragraphs: [
            "Sur la base des objectifs et de l'analyse, vous planifiez la nouvelle arborescence. Quelles pages sont conservées, fusionnées ou ajoutées ? Une navigation claire avec peu de rubriques principales aide autant les visiteurs que les moteurs de recherche. Pensez aussi aux URL : courtes, parlantes et, si possible, proches des adresses actuelles.",
            "Viennent ensuite les contenus. Les textes bien positionnés ne doivent pas être simplement raccourcis ou remplacés, mais tout au plus améliorés. Les contenus obsolètes sont actualisés ou supprimés, les lacunes comblées par de nouveaux textes. Sur un site multilingue, cela vaut pour chaque version, afin que le français et l'allemand restent équivalents.",
          ],
          bullets: [
            "Étape 4 : définir l'arborescence et la structure des URL",
            "Étape 5 : vérifier, retravailler et compléter les contenus",
          ],
        },
        {
          h2: "Étapes 6 et 7 : design, développement et environnement de test",
          paragraphs: [
            "Place au design et au développement. Veillez à une mise en page responsive, à des temps de chargement rapides, à une bonne accessibilité et à une hiérarchie de titres propre. Titres, méta-descriptions et textes alternatifs des images sont renseignés pour chaque page. Ces bases techniques ne sont pas un bonus : elles conditionnent la visibilité du nouveau site.",
            "Développez le nouveau site sur un environnement de test protégé et bloqué pour les moteurs de recherche. Vous pouvez ainsi tester sereinement sans que Google indexe des pages inachevées. Contrôlez les formulaires, l'affichage sur différents appareils, la vitesse et le changement de langue. Juste avant la mise en ligne, ce blocage doit impérativement être levé.",
          ],
          bullets: [
            "Étape 6 : design et développement avec les bases du SEO",
            "Étape 7 : tests approfondis sur un environnement bloqué",
          ],
        },
        {
          h2: "Étape 8 : mettre en place les redirections 301",
          paragraphs: [
            "Lorsque l'adresse d'une page change, il faut une redirection permanente 301 de l'ancienne vers la nouvelle URL. Elle indique à Google que le contenu a déménagé et transfère l'essentiel des signaux acquis vers la nouvelle page. Sans redirections, les visiteurs tombent sur des pages d'erreur et les positions construites au fil des années disparaissent.",
            "Associez à chaque ancienne URL de votre liste la nouvelle page au contenu le plus proche. Ne redirigez pas tout vers la page d'accueil, car Google traite souvent ce cas comme une page d'erreur. Évitez les chaînes de redirections et testez toutes les règles avant la mise en ligne. Les liens externes et les inscriptions dans les annuaires continuent ainsi de pointer vers la bonne adresse.",
          ],
          bullets: [
            "Associer chaque ancienne URL à une nouvelle URL pertinente",
            "Pas de redirection globale vers la page d'accueil",
            "Éviter les chaînes de redirections",
            "Tester toutes les redirections avant et après la mise en ligne",
          ],
        },
        {
          h2: "Étapes 9 et 10 : mise en ligne et suivi",
          paragraphs: [
            "Choisissez pour la mise en ligne un moment calme où votre équipe est disponible. Juste après la bascule, vérifiez les redirections, les formulaires, le certificat SSL et l'accès pour les moteurs de recherche. Soumettez le nouveau sitemap XML dans la Google Search Console et mettez à jour l'adresse du site dans votre fiche d'établissement Google si elle a changé.",
            "Durant les semaines suivantes, surveillez les positions, la fréquentation et les erreurs signalées dans la Search Console. De légères fluctuations sont normales ; des chutes marquées indiquent des redirections manquantes ou des problèmes techniques. Plus vous réagissez tôt, plus vite les positions se rétablissent. Nous vous accompagnons volontiers dans votre refonte : demandez-nous une offre sans engagement.",
          ],
          bullets: [
            "Étape 9 : mise en ligne avec contrôle technique immédiat",
            "Étape 10 : suivi des positions et des erreurs dans les semaines suivantes",
          ],
        },
      ],
      faq: [
        {
          q: "Vais-je perdre mes positions Google lors d'une refonte ?",
          a: "Pas forcément. Si toutes les URL existantes sont recensées, redirigées proprement en 301 et que les contenus bien positionnés sont conservés, les pertes peuvent être largement évitées. De légères fluctuations les premières semaines sont normales.",
        },
        {
          q: "Qu'est-ce qu'une redirection 301 ?",
          a: "Une redirection 301 renvoie durablement une ancienne adresse vers une nouvelle. Les visiteurs arrivent automatiquement sur la bonne page et Google transfère l'essentiel des signaux de l'ancienne URL vers la nouvelle.",
        },
        {
          q: "Combien de temps dure une refonte de site ?",
          a: "Cela dépend de l'ampleur, des contenus et des fonctions. Un petit site d'entreprise se réalise bien plus vite qu'un site multilingue avec boutique. Vous recevez un calendrier réaliste avec notre offre.",
        },
        {
          q: "Puis-je changer de nom de domaine lors de la refonte ?",
          a: "Oui, mais cela demande un soin particulier. Toutes les pages de l'ancien domaine doivent être redirigées en 301 vers le nouveau et le changement d'adresse signalé dans la Google Search Console.",
        },
      ],
    },
  },
};
