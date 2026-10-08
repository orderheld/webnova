import type { Guide } from "../types";

export const barrierefreieWebsite: Guide = {
  key: "barrierefreie-website",
  date: "2026-10-08",
  readingMinutes: 9,
  related: ["webdesign", "website-redesign", "website-kmu"],
  relatedGuides: ["core-web-vitals", "kmu-webseite-checkliste", "website-relaunch-checkliste"],
  content: {
    de: {
      slug: "barrierefreie-website-kmu",
      meta: {
        title: "Barrierefreie Website: was KMU wissen müssen",
        description:
          "Barrierefreie Website für KMU: was WCAG bedeutet, welche Regeln in der Schweiz und der EU gelten und welche Punkte Sie mit wenig Aufwand verbessern können.",
      },
      h1: "Barrierefreie Website: was KMU in der Schweiz wissen müssen",
      lead: "Eine barrierefreie Website kann von allen Menschen genutzt werden, auch von Personen mit Seh-, Hör- oder motorischen Einschränkungen und von älteren Menschen. Dieser Ratgeber erklärt, welche Regeln für Schweizer KMU gelten, was die WCAG verlangen und welche Verbesserungen sich besonders lohnen.",
      keyTakeaways: [
        "Massstab für Barrierefreiheit im Web sind die Web Content Accessibility Guidelines (WCAG), aktuell in der Version 2.2. In der Praxis wird meist die Stufe AA angestrebt.",
        "In der Schweiz verpflichtet das Behindertengleichstellungsgesetz vor allem den Bund. Für private Websites gibt es heute keine allgemeine WCAG-Pflicht, Gesetzesvorhaben dazu sind aber in Arbeit.",
        "Wer Konsumentinnen und Konsumenten in der EU online beliefert, kann vom European Accessibility Act betroffen sein. Kleinstunternehmen, die Dienstleistungen erbringen, sind davon ausgenommen.",
        "Viele Verbesserungen sind mit wenig Aufwand möglich: Kontraste, Alternativtexte, Überschriften, Tastaturbedienung und beschriftete Formulare.",
        "Barrierefreiheit verbessert gleichzeitig Bedienbarkeit, mobile Nutzung und die Verständlichkeit für Suchmaschinen.",
      ],
      sources: [
        { label: "W3C: Web Content Accessibility Guidelines (WCAG) 2.2", url: "https://www.w3.org/TR/WCAG22/" },
        { label: "EU-Richtlinie 2019/882 über die Barrierefreiheitsanforderungen (European Accessibility Act)", url: "https://eur-lex.europa.eu/eli/dir/2019/882/oj" },
      ],
      sections: [
        {
          h2: "Was eine barrierefreie Website ausmacht",
          paragraphs: [
            "Barrierefrei ist eine Website, wenn Menschen sie unabhängig von ihren Fähigkeiten wahrnehmen, bedienen und verstehen können. Blinde Personen nutzen zum Beispiel einen Screenreader, der Inhalte vorliest. Menschen mit eingeschränkter Feinmotorik bedienen Websites oft nur mit der Tastatur. Personen mit Sehschwäche vergrössern Inhalte oder sind auf starke Kontraste angewiesen. Und viele ältere Menschen profitieren von klarer Sprache und grosszügigen Schaltflächen.",
            "Barrierefreiheit hilft aber nicht nur Menschen mit Behinderungen. Wer mit dem Smartphone in der Sonne steht, einen Arm voll hat oder in einer lauten Umgebung ein Video ansieht, profitiert von denselben Massnahmen: guter Kontrast, grosse Bedienelemente, Untertitel. Eine barrierefreie Website ist deshalb in der Regel einfach eine besser bedienbare Website.",
          ],
        },
        {
          h2: "Die WCAG: der internationale Massstab",
          paragraphs: [
            "Die Web Content Accessibility Guidelines des W3C sind der weltweit anerkannte Standard für barrierefreie Webinhalte. Die aktuelle Version 2.2 baut auf den Vorgängerversionen auf und ergänzt unter anderem Kriterien zur Sichtbarkeit des Tastaturfokus und zu Bedienelementen. Die Kriterien sind in drei Stufen eingeteilt: A, AA und AAA. Gesetze und Normen verweisen meist auf die Stufe AA.",
            "Die WCAG folgen vier Grundprinzipien. Inhalte müssen wahrnehmbar sein, etwa durch Alternativtexte für Bilder und ausreichende Kontraste. Sie müssen bedienbar sein, auch ohne Maus. Sie müssen verständlich sein, mit klarer Sprache und nachvollziehbarer Navigation. Und sie müssen robust sein, also mit unterschiedlichen Browsern und Hilfstechnologien funktionieren.",
          ],
          bullets: [
            "Wahrnehmbar: Alternativtexte, Untertitel, ausreichende Kontraste",
            "Bedienbar: Tastaturbedienung, sichtbarer Fokus, genug Zeit",
            "Verständlich: klare Sprache, verständliche Fehlermeldungen, konsistente Navigation",
            "Robust: sauberer Code, der mit Screenreadern funktioniert",
          ],
        },
        {
          h2: "Welche Regeln in der Schweiz gelten",
          paragraphs: [
            "In der Schweiz regelt das Behindertengleichstellungsgesetz (BehiG) die Gleichstellung von Menschen mit Behinderungen. Es verpflichtet vor allem den Bund: Dessen Internetangebote müssen für Menschen mit Behinderungen zugänglich sein. Für Behörden gibt es dazu den Standard eCH-0059, der sich an den WCAG orientiert. Viele Kantone und Gemeinden haben eigene Vorgaben.",
            "Für private Unternehmen enthält das BehiG heute vor allem ein Diskriminierungsverbot für Dienstleistungen, die öffentlich angeboten werden. Eine allgemeine Pflicht, die eigene Website nach WCAG zu gestalten, besteht für KMU derzeit nicht. Auf Bundesebene laufen jedoch Gesetzesvorhaben, unter anderem eine Teilrevision des BehiG und ein Inklusionsgesetz als indirekter Gegenvorschlag zur Inklusions-Initiative. Ob und in welchem Umfang private Anbieter künftig stärker verpflichtet werden, entscheidet das Parlament. Es lohnt sich, die Entwicklung zu verfolgen.",
          ],
        },
        {
          h2: "Kundschaft in der EU: der European Accessibility Act",
          paragraphs: [
            "In der EU gilt seit dem 28. Juni 2025 die Richtlinie über die Barrierefreiheitsanforderungen für Produkte und Dienstleistungen, bekannt als European Accessibility Act. Sie betrifft unter anderem Dienstleistungen im elektronischen Geschäftsverkehr gegenüber Verbraucherinnen und Verbrauchern, also zum Beispiel Onlineshops, sowie bestimmte Bank-, Telekommunikations- und Verkehrsdienstleistungen. Umgesetzt wird sie durch nationale Gesetze der einzelnen EU-Staaten.",
            "Auch Schweizer Unternehmen können betroffen sein, wenn sie gezielt Konsumentinnen und Konsumenten in der EU online beliefern. Kleinstunternehmen, die Dienstleistungen erbringen, sind von den Anforderungen ausgenommen. Als Kleinstunternehmen gelten Unternehmen mit weniger als zehn Beschäftigten und einem Jahresumsatz oder einer Jahresbilanzsumme von höchstens zwei Millionen Euro. Ob Ihr Angebot darunter fällt, sollten Sie im Einzelfall rechtlich prüfen lassen. Mehr zu den Schweizer Regeln für Onlineshops lesen Sie im Ratgeber [Onlineshop in der Schweiz](guide:onlineshop-schweiz).",
          ],
        },
        {
          h2: "Zehn Punkte, die sich für KMU besonders lohnen",
          paragraphs: [
            "Barrierefreiheit muss nicht mit einem grossen Projekt beginnen. Viele Verbesserungen lassen sich bei der nächsten Überarbeitung oder sogar im laufenden Betrieb umsetzen. Die folgenden Punkte decken einen grossen Teil der häufigsten Probleme ab und verbessern gleichzeitig die Bedienbarkeit für alle.",
          ],
          bullets: [
            "Ausreichender Kontrast zwischen Text und Hintergrund, bei normalem Text mindestens 4,5 zu 1",
            "Aussagekräftige Alternativtexte für Bilder mit Inhalt, leere Alternativtexte für reine Dekoration",
            "Eine logische Überschriftenstruktur mit genau einer Hauptüberschrift pro Seite",
            "Vollständige Bedienung mit der Tastatur und ein gut sichtbarer Fokus",
            "Beschriftete Formularfelder und verständliche Fehlermeldungen",
            "Linktexte, die das Ziel beschreiben, statt «hier klicken»",
            "Vergrösserung auf 200 Prozent ohne abgeschnittene Inhalte",
            "Untertitel für Videos und keine automatisch startenden Medien mit Ton",
            "Korrekte Sprachangabe im Code, bei zweisprachigen Websites pro Sprachversion",
            "Barrierearme PDF-Dokumente oder die wichtigsten Inhalte direkt als Webseite",
          ],
        },
        {
          h2: "So prüfen Sie Ihre Website",
          paragraphs: [
            "Ein erster Test dauert nur wenige Minuten: Legen Sie die Maus weg und versuchen Sie, Ihre Website nur mit der Tabulatortaste zu bedienen. Sehen Sie jederzeit, wo Sie sich befinden? Erreichen Sie das Menü, das Formular und den Absendeknopf? Vergrössern Sie danach die Ansicht im Browser auf 200 Prozent und prüfen Sie, ob alles lesbar bleibt.",
            "Automatische Prüfwerkzeuge, etwa in den Entwicklerwerkzeugen des Browsers, finden fehlende Alternativtexte oder zu schwache Kontraste. Sie erkennen aber nur einen Teil der Probleme. Ob ein Alternativtext sinnvoll ist oder ein Ablauf verständlich, kann nur ein Mensch beurteilen. Am aussagekräftigsten ist ein Test mit einem Screenreader oder, wenn möglich, mit betroffenen Personen. Vorsicht bei sogenannten Overlay-Werkzeugen, die Barrierefreiheit per Zusatzskript versprechen: Sie beheben die Ursachen im Code nicht.",
          ],
        },
        {
          h2: "Barrierefreiheit, SEO und Ladezeit",
          paragraphs: [
            "Viele Massnahmen für Barrierefreiheit helfen auch bei Google. Eine saubere Überschriftenstruktur, beschreibende Linktexte, Alternativtexte und semantischer Code machen Inhalte für Suchmaschinen verständlicher. Schnelle, stabile Seiten ohne springende Inhalte sind für alle angenehmer. Was hinter den Messwerten steckt, erklärt unser Ratgeber [Core Web Vitals](guide:core-web-vitals).",
            "Am einfachsten ist Barrierefreiheit, wenn sie von Anfang an eingeplant wird. Bei einem [Website-Relaunch](service:website-redesign) oder einer neuen [Website für KMU](service:website-kmu) achten wir auf Kontraste, Tastaturbedienung, Überschriften und beschriftete Formulare. Sie möchten wissen, wo Ihre bestehende Website steht? Unser [kostenloser Website-Check](page:website-check) gibt Ihnen eine erste Einschätzung.",
          ],
        },
      ],
      faq: [
        {
          q: "Muss meine KMU-Website in der Schweiz barrierefrei sein?",
          a: "Eine allgemeine gesetzliche Pflicht, die Website nach WCAG zu gestalten, besteht für private Unternehmen in der Schweiz derzeit nicht. Das BehiG enthält aber ein Diskriminierungsverbot für öffentlich angebotene Dienstleistungen, und Gesetzesvorhaben zur Stärkung der Inklusion sind in Arbeit.",
        },
        {
          q: "Was bedeutet WCAG AA?",
          a: "Die WCAG teilen ihre Kriterien in die Stufen A, AA und AAA ein. Stufe AA umfasst alle Kriterien der Stufen A und AA und ist der Massstab, auf den die meisten Gesetze und Normen verweisen.",
        },
        {
          q: "Gilt der European Accessibility Act für Schweizer Unternehmen?",
          a: "Er kann gelten, wenn ein Schweizer Unternehmen betroffene Produkte oder Dienstleistungen, etwa einen Onlineshop, gezielt Konsumentinnen und Konsumenten in der EU anbietet. Kleinstunternehmen, die Dienstleistungen erbringen, sind ausgenommen. Lassen Sie den Einzelfall rechtlich prüfen.",
        },
        {
          q: "Helfen Barrierefreiheits-Plugins oder Overlays?",
          a: "Sie können einzelne Anzeigeoptionen bieten, beheben aber die Ursachen im Code nicht. Fehlende Alternativtexte, falsche Überschriften oder nicht bedienbare Menüs müssen in der Website selbst korrigiert werden.",
        },
        {
          q: "Ist eine barrierefreie Website teurer?",
          a: "Wenn Barrierefreiheit von Anfang an eingeplant wird, ist der Mehraufwand meist gering, weil sie zu sauberem Design und Code gehört. Teurer wird es, wenn eine bestehende Website nachträglich umfassend angepasst werden muss.",
        },
      ],
    },
    fr: {
      slug: "site-internet-accessible-pme",
      meta: {
        title: "Site accessible : ce que les PME doivent savoir",
        description:
          "Site internet accessible pour PME : ce que signifient les WCAG, les règles en Suisse et dans l'UE et les points à améliorer avec peu d'effort.",
      },
      h1: "Site internet accessible : ce que les PME suisses doivent savoir",
      lead: "Un site accessible peut être utilisé par tous, y compris par les personnes avec un handicap visuel, auditif ou moteur et par les personnes âgées. Ce guide explique quelles règles s'appliquent aux PME suisses, ce que demandent les WCAG et quelles améliorations valent particulièrement la peine.",
      keyTakeaways: [
        "La référence pour l'accessibilité web, ce sont les Web Content Accessibility Guidelines (WCAG), actuellement en version 2.2. En pratique, on vise le plus souvent le niveau AA.",
        "En Suisse, la loi sur l'égalité pour les handicapés oblige surtout la Confédération. Il n'existe pas aujourd'hui d'obligation générale WCAG pour les sites privés, mais des projets législatifs sont en cours.",
        "Une entreprise qui sert en ligne des consommateurs dans l'UE peut être concernée par l'European Accessibility Act. Les microentreprises qui fournissent des services en sont exemptées.",
        "Beaucoup d'améliorations demandent peu d'effort : contrastes, textes alternatifs, titres, navigation au clavier et formulaires étiquetés.",
        "L'accessibilité améliore en même temps l'ergonomie, l'usage mobile et la compréhension par les moteurs de recherche.",
      ],
      sources: [
        { label: "W3C : Web Content Accessibility Guidelines (WCAG) 2.2", url: "https://www.w3.org/TR/WCAG22/" },
        { label: "Directive (UE) 2019/882 relative aux exigences en matière d'accessibilité (European Accessibility Act)", url: "https://eur-lex.europa.eu/eli/dir/2019/882/oj" },
      ],
      sections: [
        {
          h2: "Ce qui rend un site accessible",
          paragraphs: [
            "Un site est accessible quand chacun peut le percevoir, l'utiliser et le comprendre, quelles que soient ses capacités. Les personnes aveugles utilisent par exemple un lecteur d'écran qui lit les contenus à voix haute. Les personnes avec une motricité fine réduite naviguent souvent uniquement au clavier. Les personnes malvoyantes agrandissent les contenus ou ont besoin de contrastes forts. Et beaucoup de personnes âgées profitent d'un langage clair et de boutons généreux.",
            "L'accessibilité n'aide pas seulement les personnes en situation de handicap. Qui consulte son smartphone en plein soleil, a un bras occupé ou regarde une vidéo dans un endroit bruyant profite des mêmes mesures : bon contraste, grands éléments, sous-titres. Un site accessible est donc en général tout simplement un site plus facile à utiliser.",
          ],
        },
        {
          h2: "Les WCAG : la référence internationale",
          paragraphs: [
            "Les Web Content Accessibility Guidelines du W3C sont le standard reconnu dans le monde entier pour les contenus web accessibles. La version actuelle 2.2 s'appuie sur les précédentes et ajoute notamment des critères sur la visibilité du focus clavier et sur les éléments de commande. Les critères sont répartis en trois niveaux : A, AA et AAA. Lois et normes renvoient le plus souvent au niveau AA.",
            "Les WCAG reposent sur quatre principes. Les contenus doivent être perceptibles, grâce à des textes alternatifs et des contrastes suffisants. Ils doivent être utilisables, aussi sans souris. Ils doivent être compréhensibles, avec un langage clair et une navigation logique. Et ils doivent être robustes, c'est-à-dire fonctionner avec différents navigateurs et technologies d'assistance.",
          ],
          bullets: [
            "Perceptible : textes alternatifs, sous-titres, contrastes suffisants",
            "Utilisable : navigation au clavier, focus visible, temps suffisant",
            "Compréhensible : langage clair, messages d'erreur compréhensibles, navigation cohérente",
            "Robuste : code propre qui fonctionne avec les lecteurs d'écran",
          ],
        },
        {
          h2: "Les règles en Suisse",
          paragraphs: [
            "En Suisse, la loi sur l'égalité pour les handicapés (LHand) règle l'égalité des personnes en situation de handicap. Elle oblige surtout la Confédération : ses prestations en ligne doivent être accessibles aux personnes handicapées. Pour les autorités, le standard eCH-0059 s'appuie sur les WCAG. Beaucoup de cantons et de communes ont leurs propres règles.",
            "Pour les entreprises privées, la LHand contient aujourd'hui surtout une interdiction de discrimination pour les prestations proposées au public. Il n'existe actuellement pas d'obligation générale pour une PME de concevoir son site selon les WCAG. Au niveau fédéral, des projets législatifs sont toutefois en cours, notamment une révision partielle de la LHand et une loi sur l'inclusion en tant que contre-projet indirect à l'initiative pour l'inclusion. C'est le Parlement qui décidera si et dans quelle mesure les prestataires privés seront davantage obligés. Il vaut la peine de suivre l'évolution.",
          ],
        },
        {
          h2: "Clientèle dans l'UE : l'European Accessibility Act",
          paragraphs: [
            "Dans l'UE, la directive relative aux exigences en matière d'accessibilité applicables aux produits et services, connue sous le nom d'European Accessibility Act, s'applique depuis le 28 juin 2025. Elle concerne entre autres les services de commerce électronique destinés aux consommateurs, donc par exemple les boutiques en ligne, ainsi que certains services bancaires, de télécommunication et de transport. Elle est mise en œuvre par les lois nationales de chaque État membre.",
            "Des entreprises suisses peuvent aussi être concernées si elles servent spécifiquement en ligne des consommateurs dans l'UE. Les microentreprises qui fournissent des services sont exemptées. Sont considérées comme microentreprises celles qui occupent moins de dix personnes et dont le chiffre d'affaires annuel ou le total du bilan annuel ne dépasse pas deux millions d'euros. Faites vérifier juridiquement votre cas. Pour les règles suisses applicables aux boutiques en ligne, lisez le guide [Boutique en ligne en Suisse](guide:onlineshop-schweiz).",
          ],
        },
        {
          h2: "Dix points particulièrement rentables pour les PME",
          paragraphs: [
            "L'accessibilité n'a pas besoin de commencer par un grand projet. Beaucoup d'améliorations peuvent se faire lors de la prochaine refonte, voire en cours d'exploitation. Les points suivants couvrent une grande partie des problèmes les plus fréquents et améliorent en même temps l'ergonomie pour tous.",
          ],
          bullets: [
            "Contraste suffisant entre texte et fond, au moins 4,5 pour 1 pour un texte normal",
            "Textes alternatifs pertinents pour les images porteuses de sens, vides pour les images décoratives",
            "Une structure de titres logique avec un seul titre principal par page",
            "Navigation complète au clavier et focus bien visible",
            "Champs de formulaire étiquetés et messages d'erreur compréhensibles",
            "Des textes de lien qui décrivent la cible plutôt que « cliquez ici »",
            "Agrandissement à 200 pour cent sans contenu coupé",
            "Sous-titres pour les vidéos et pas de médias sonores en lecture automatique",
            "Langue correcte indiquée dans le code, pour chaque version linguistique d'un site bilingue",
            "Des PDF accessibles ou les contenus essentiels directement sous forme de page web",
          ],
        },
        {
          h2: "Comment tester votre site",
          paragraphs: [
            "Un premier test ne prend que quelques minutes : posez la souris et essayez d'utiliser votre site uniquement avec la touche de tabulation. Voyez-vous toujours où vous êtes ? Atteignez-vous le menu, le formulaire et le bouton d'envoi ? Agrandissez ensuite l'affichage à 200 pour cent et vérifiez que tout reste lisible.",
            "Les outils de contrôle automatiques, par exemple dans les outils de développement du navigateur, détectent des textes alternatifs manquants ou des contrastes trop faibles. Ils ne repèrent toutefois qu'une partie des problèmes. Seule une personne peut juger si un texte alternatif a du sens ou si un parcours est compréhensible. Le plus parlant reste un test avec un lecteur d'écran ou, si possible, avec des personnes concernées. Prudence avec les « overlays » qui promettent l'accessibilité par un script ajouté : ils ne corrigent pas les causes dans le code.",
          ],
        },
        {
          h2: "Accessibilité, SEO et vitesse",
          paragraphs: [
            "Beaucoup de mesures d'accessibilité sont aussi utiles pour Google. Une structure de titres propre, des liens descriptifs, des textes alternatifs et un code sémantique rendent les contenus plus compréhensibles pour les moteurs de recherche. Des pages rapides et stables, sans contenu qui saute, sont plus agréables pour tous. Notre guide [Core Web Vitals](guide:core-web-vitals) explique les valeurs.",
            "L'accessibilité est la plus simple quand elle est prévue dès le départ. Lors d'une [refonte de site](service:website-redesign) ou d'un nouveau [site pour PME](service:website-kmu), nous veillons aux contrastes, à la navigation au clavier, aux titres et aux formulaires étiquetés. Vous voulez savoir où en est votre site actuel ? Notre [analyse de site gratuite](page:website-check) vous donne une première appréciation.",
          ],
        },
      ],
      faq: [
        {
          q: "Mon site de PME doit-il être accessible en Suisse ?",
          a: "Il n'existe actuellement pas d'obligation légale générale pour les entreprises privées suisses de concevoir leur site selon les WCAG. La LHand contient cependant une interdiction de discrimination pour les prestations offertes au public, et des projets visant à renforcer l'inclusion sont en cours.",
        },
        {
          q: "Que signifie WCAG AA ?",
          a: "Les WCAG classent leurs critères en niveaux A, AA et AAA. Le niveau AA comprend tous les critères A et AA et c'est la référence de la plupart des lois et normes.",
        },
        {
          q: "L'European Accessibility Act s'applique-t-il aux entreprises suisses ?",
          a: "Il peut s'appliquer si une entreprise suisse propose spécifiquement des produits ou services concernés, comme une boutique en ligne, à des consommateurs dans l'UE. Les microentreprises qui fournissent des services sont exemptées. Faites vérifier votre cas juridiquement.",
        },
        {
          q: "Les plugins d'accessibilité ou overlays aident-ils ?",
          a: "Ils peuvent offrir quelques options d'affichage, mais ne corrigent pas les causes dans le code. Textes alternatifs manquants, mauvais titres ou menus inutilisables doivent être corrigés dans le site lui-même.",
        },
        {
          q: "Un site accessible coûte-t-il plus cher ?",
          a: "Si l'accessibilité est prévue dès le départ, le surcoût est en général faible, car elle fait partie d'un design et d'un code propres. Cela coûte plus cher lorsqu'un site existant doit être largement adapté après coup.",
        },
      ],
    },
  },
};
