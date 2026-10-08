import type { Guide } from "../types";

export const coreWebVitals: Guide = {
  key: "core-web-vitals",
  date: "2026-10-06",
  readingMinutes: 8,
  related: ["seo", "website-redesign", "wartung"],
  relatedGuides: ["barrierefreie-website", "website-relaunch-checkliste", "kmu-webseite-checkliste"],
  content: {
    de: {
      slug: "core-web-vitals-erklaert",
      meta: {
        title: "Core Web Vitals verständlich erklärt",
        description:
          "LCP, INP und CLS einfach erklärt: was die Core Web Vitals messen, wie Sie Ihre Webseite prüfen und welche Massnahmen sie wirklich schneller machen.",
      },
      h1: "Core Web Vitals verständlich erklärt: so wird Ihre Webseite schneller",
      lead: "Google misst, wie schnell und stabil sich Webseiten für echte Besucherinnen und Besucher anfühlen. Diese Messwerte heissen Core Web Vitals. Sie beeinflussen das Ranking und vor allem, ob Interessierte bleiben oder zur Konkurrenz wechseln.",
      keyTakeaways: [
        "Die Core Web Vitals messen Ladezeit (LCP), Reaktionsfähigkeit (INP) und visuelle Stabilität (CLS) bei echten Besuchen.",
        "Gute Werte sind höchstens 2,5 Sekunden für LCP, 200 Millisekunden für INP und 0,1 für CLS.",
        "Grosse Bilder, viele Skripte und schwere Page-Builder sind die häufigsten Bremsen.",
        "PageSpeed Insights und die Google Search Console zeigen, wo Ihre Seiten stehen, vor allem auf dem Smartphone.",
        "Plugins lindern Symptome. Bei überladenen Systemen ist ein schlanker Neuaufbau oft nachhaltiger.",
      ],
      sources: [
        { label: "web.dev: Web Vitals", url: "https://web.dev/articles/vitals" },
      ],
      sections: [
        {
          h2: "Was die Core Web Vitals sind",
          paragraphs: [
            "Die Core Web Vitals sind drei Kennzahlen, mit denen Google die Nutzererfahrung einer Webseite bewertet: Ladezeit des Hauptinhalts, Reaktionsfähigkeit auf Eingaben und visuelle Stabilität. Gemessen wird nicht im Labor, sondern bei echten Chrome-Nutzerinnen und -Nutzern. Ausschlaggebend ist der Wert, den 75 Prozent der Besuche mindestens erreichen.",
            "Die Werte sind ein Rankingfaktor unter vielen. Guter Inhalt bleibt wichtiger. Bei vergleichbaren Seiten kann die bessere Nutzererfahrung aber den Ausschlag geben. Und unabhängig von Google gilt: Jede Sekunde Wartezeit auf dem Smartphone kostet Anfragen, gerade bei lokalen Suchen unterwegs.",
          ],
        },
        {
          h2: "LCP: wie schnell der Hauptinhalt erscheint",
          paragraphs: [
            "Largest Contentful Paint (LCP) misst, wann das grösste sichtbare Element geladen ist, meist das Titelbild oder die Hauptüberschrift. Gut sind höchstens 2,5 Sekunden. Häufige Ursachen für schlechte Werte sind riesige, unkomprimierte Bilder, langsame Server, zu viele Schriftarten und Skripte, die das Rendern blockieren.",
            "Abhilfe schaffen moderne Bildformate wie WebP oder AVIF in passender Grösse, ein Titelbild mit hoher Ladepriorität, wenige und vorab geladene Schriften sowie ein schnelles Hosting mit Caching. Statisch erzeugte Seiten, wie wir sie bauen, sind hier klar im Vorteil, weil der Server die fertige Seite sofort ausliefern kann.",
          ],
          bullets: [
            "Bilder in WebP oder AVIF und in der angezeigten Grösse",
            "Titelbild priorisiert, Bilder weiter unten verzögert laden",
            "Wenige Schriftschnitte, lokal gehostet",
            "Schnelles Hosting mit Caching oder statischen Seiten",
          ],
        },
        {
          h2: "INP: wie schnell die Seite auf Eingaben reagiert",
          paragraphs: [
            "Interaction to Next Paint (INP) hat im März 2024 den früheren Wert FID abgelöst. Er misst, wie lange es dauert, bis die Seite nach einem Klick, Tippen oder einer Tastatureingabe sichtbar reagiert. Gut sind höchstens 200 Millisekunden. Schlechte Werte entstehen vor allem durch viel JavaScript, das den Browser blockiert.",
            "Typische Bremsen sind schwere Page-Builder, viele Plugins, Chat-Widgets, Tracking-Skripte und Slider. Prüfen Sie kritisch, welche Skripte wirklich nötig sind. Jedes externe Tool kostet Rechenzeit auf dem Smartphone Ihrer Kundschaft, die oft deutlich langsamer ist als Ihr Büro-Computer.",
          ],
        },
        {
          h2: "CLS: ob die Seite beim Laden springt",
          paragraphs: [
            "Cumulative Layout Shift (CLS) misst, wie stark sich Inhalte während des Ladens verschieben. Sie kennen das: Man will auf einen Link tippen, und plötzlich rutscht alles nach unten, weil ein Bild oder ein Banner nachlädt. Gut ist ein Wert von höchstens 0,1.",
            "Die Lösung ist meist einfach: Bilder und Videos mit festen Abmessungen einbinden, Platz für Banner und eingebettete Inhalte reservieren und Schriften so laden, dass der Text beim Wechsel nicht springt. Cookie-Hinweise sollten über dem Inhalt erscheinen, statt ihn nach unten zu schieben.",
          ],
        },
        {
          h2: "So prüfen Sie Ihre Webseite",
          paragraphs: [
            "Der einfachste Einstieg ist PageSpeed Insights von Google. Geben Sie Ihre Adresse ein und schauen Sie zuerst auf den oberen Teil mit den Felddaten echter Besuche. Ist Ihre Seite dafür zu wenig besucht, zeigt das Tool nur Labordaten aus einer Simulation. Diese sind ein guter Hinweis, aber kein Urteil.",
            "In der Google Search Console finden Sie unter «Core Web Vitals» eine Übersicht aller Seiten, getrennt nach Mobilgerät und Desktop. Achten Sie vor allem auf die mobilen Werte. Testen Sie nicht nur die Startseite, sondern auch Leistungsseiten, Ratgeber und Kontaktseite, denn Besucher steigen oft über Unterseiten ein.",
          ],
          bullets: [
            "PageSpeed Insights: Felddaten zuerst, Labordaten als Hinweis",
            "Search Console: Bericht «Core Web Vitals», mobil zuerst",
            "Mehrere Seitentypen testen, nicht nur die Startseite",
          ],
        },
        {
          h2: "Was wirklich hilft und was nicht",
          paragraphs: [
            "Optimierungs-Plugins können einzelne Werte verbessern, lösen aber selten das Grundproblem eines überladenen Systems. Wenn eine Webseite mit Dutzenden Plugins und einem schweren Theme läuft, ist ein schlanker Neuaufbau oft nachhaltiger als endloses Nachbessern. Ob sich das lohnt, zeigt eine kurze Analyse im Rahmen eines [Website-Redesigns](service:website-redesign).",
            "Genauso wichtig ist die laufende Pflege: Neue Bilder müssen komprimiert, Plugins aktualisiert und überflüssige Skripte entfernt werden. Mit einem [Wartungsvertrag](service:wartung) bleibt Ihre Seite dauerhaft schnell. Und im Rahmen unserer [SEO-Betreuung](service:seo) behalten wir Core Web Vitals und Rankings gemeinsam im Blick. Wie Sie bei einem Relaunch keine Rankings verlieren, zeigt unsere [Relaunch-Checkliste](guide:website-relaunch-checkliste).",
          ],
        },
      ],
      faq: [
        {
          q: "Sind die Core Web Vitals wichtiger als guter Inhalt?",
          a: "Nein. Inhalt und Relevanz bleiben die wichtigsten Faktoren. Die Core Web Vitals entscheiden aber mit, wenn Seiten inhaltlich ähnlich gut sind, und beeinflussen stark, ob Besucher bleiben.",
        },
        {
          q: "Warum ist meine Seite auf dem Desktop schnell, auf dem Handy aber langsam?",
          a: "Smartphones haben weniger Rechenleistung und oft eine langsamere Verbindung. Grosse Bilder und viel JavaScript wirken sich dort viel stärker aus. Google bewertet primär die mobile Version.",
        },
        {
          q: "Muss ich 100 Punkte in PageSpeed Insights erreichen?",
          a: "Nein. Der Punktwert ist eine Laborschätzung. Entscheidend sind die Felddaten echter Besuche: LCP bis 2,5 Sekunden, INP bis 200 Millisekunden und CLS bis 0,1.",
        },
        {
          q: "Wie schnell sehe ich Verbesserungen in der Search Console?",
          a: "Die Felddaten beruhen auf den letzten 28 Tagen. Nach einer Optimierung dauert es deshalb einige Wochen, bis die Werte in der Search Console vollständig nachziehen.",
        },
      ],
    },
    fr: {
      slug: "core-web-vitals-explications",
      meta: {
        title: "Core Web Vitals expliqués simplement",
        description:
          "LCP, INP et CLS expliqués simplement : ce que mesurent les Core Web Vitals, comment tester votre site et quelles mesures le rendent vraiment plus rapide.",
      },
      h1: "Core Web Vitals expliqués simplement : rendre votre site plus rapide",
      lead: "Google mesure la rapidité et la stabilité perçues par les vrais visiteurs d'un site. Ces mesures s'appellent les Core Web Vitals. Elles influencent le classement et surtout la décision des internautes de rester ou de partir chez un concurrent.",
      keyTakeaways: [
        "Les Core Web Vitals mesurent la vitesse d'affichage (LCP), la réactivité (INP) et la stabilité visuelle (CLS) lors de vraies visites.",
        "Les bonnes valeurs sont au maximum 2,5 secondes pour le LCP, 200 millisecondes pour l'INP et 0,1 pour le CLS.",
        "Grandes images, nombreux scripts et constructeurs de pages lourds sont les freins les plus fréquents.",
        "PageSpeed Insights et Google Search Console montrent où en sont vos pages, surtout sur smartphone.",
        "Les plugins atténuent les symptômes. Pour un système surchargé, une reconstruction légère est souvent plus durable.",
      ],
      sources: [
        { label: "web.dev : Web Vitals", url: "https://web.dev/articles/vitals" },
      ],
      sections: [
        {
          h2: "Que sont les Core Web Vitals ?",
          paragraphs: [
            "Les Core Web Vitals sont trois indicateurs avec lesquels Google évalue l'expérience utilisateur : le temps d'affichage du contenu principal, la réactivité aux interactions et la stabilité visuelle. Ils sont mesurés auprès de vrais utilisateurs de Chrome, et non en laboratoire. La valeur retenue est celle atteinte par au moins 75 % des visites.",
            "C'est un facteur de classement parmi d'autres ; un bon contenu reste plus important. Mais à contenu comparable, la meilleure expérience peut faire la différence. Et indépendamment de Google, chaque seconde d'attente sur smartphone coûte des demandes, surtout pour les recherches locales en déplacement.",
          ],
        },
        {
          h2: "LCP : la vitesse d'affichage du contenu principal",
          paragraphs: [
            "Le Largest Contentful Paint (LCP) mesure le moment où le plus grand élément visible est chargé, souvent l'image principale ou le titre. Un bon résultat est de 2,5 secondes au maximum. Les causes fréquentes de mauvais résultats sont des images énormes et non compressées, un serveur lent, trop de polices et des scripts qui bloquent l'affichage.",
            "Les remèdes : des formats d'image modernes comme WebP ou AVIF à la bonne taille, une image principale chargée en priorité, peu de polices préchargées et un hébergement rapide avec mise en cache. Les pages générées de manière statique, comme celles que nous réalisons, ont ici un net avantage.",
          ],
          bullets: [
            "Images en WebP ou AVIF, à la taille affichée",
            "Image principale prioritaire, images plus bas chargées en différé",
            "Peu de variantes de police, hébergées localement",
            "Hébergement rapide avec cache ou pages statiques",
          ],
        },
        {
          h2: "INP : la réactivité aux interactions",
          paragraphs: [
            "L'Interaction to Next Paint (INP) a remplacé l'ancien FID en mars 2024. Il mesure le temps entre un clic, un toucher ou une saisie et la réaction visible de la page. Un bon résultat est de 200 millisecondes au maximum. Les mauvais résultats viennent surtout d'un excès de JavaScript qui bloque le navigateur.",
            "Les freins typiques sont les constructeurs de pages lourds, les nombreux plugins, les widgets de chat, les scripts de suivi et les carrousels. Vérifiez quels scripts sont vraiment nécessaires. Chaque outil externe consomme du temps de calcul sur le smartphone de vos clients, souvent bien moins puissant que votre ordinateur de bureau.",
          ],
        },
        {
          h2: "CLS : la page bouge-t-elle pendant le chargement ?",
          paragraphs: [
            "Le Cumulative Layout Shift (CLS) mesure à quel point les contenus se déplacent pendant le chargement. Vous connaissez la situation : on veut toucher un lien et tout glisse vers le bas parce qu'une image ou une bannière se charge. Un bon résultat est de 0,1 au maximum.",
            "La solution est souvent simple : intégrer images et vidéos avec des dimensions fixes, réserver l'espace des bannières et contenus intégrés et charger les polices de manière à ce que le texte ne saute pas. Les bandeaux cookies doivent s'afficher par-dessus le contenu plutôt que de le pousser.",
          ],
        },
        {
          h2: "Comment tester votre site",
          paragraphs: [
            "Le plus simple est d'utiliser PageSpeed Insights de Google. Saisissez votre adresse et regardez d'abord la partie supérieure avec les données réelles des visites. Si votre site n'a pas assez de trafic, l'outil n'affiche que des données de laboratoire issues d'une simulation : une bonne indication, mais pas un verdict.",
            "Dans la Google Search Console, le rapport « Signaux Web essentiels » donne une vue d'ensemble de toutes les pages, séparément pour mobile et ordinateur. Concentrez-vous d'abord sur le mobile. Testez aussi les pages de prestations, les articles et la page de contact, car les visiteurs arrivent souvent par ces pages.",
          ],
          bullets: [
            "PageSpeed Insights : données réelles d'abord, laboratoire en complément",
            "Search Console : rapport « Signaux Web essentiels », mobile d'abord",
            "Tester plusieurs types de pages, pas seulement l'accueil",
          ],
        },
        {
          h2: "Ce qui aide vraiment et ce qui n'aide pas",
          paragraphs: [
            "Les plugins d'optimisation améliorent parfois certaines valeurs, mais règlent rarement le problème de fond d'un système surchargé. Pour un site qui tourne avec des dizaines de plugins et un thème lourd, une reconstruction légère est souvent plus durable que des corrections sans fin. Une courte analyse dans le cadre d'une [refonte de site](service:website-redesign) montre si cela vaut la peine.",
            "L'entretien compte tout autant : compresser les nouvelles images, mettre à jour les plugins, supprimer les scripts superflus. Avec un [contrat de maintenance](service:wartung), votre site reste rapide durablement, et notre [accompagnement SEO](service:seo) suit Core Web Vitals et positions ensemble. Pour ne pas perdre de positions lors d'une refonte, consultez notre [checklist de refonte](guide:website-relaunch-checkliste).",
          ],
        },
      ],
      faq: [
        {
          q: "Les Core Web Vitals sont-ils plus importants que le contenu ?",
          a: "Non. Contenu et pertinence restent les facteurs principaux. Les Core Web Vitals départagent des pages de qualité comparable et influencent fortement le fait que les visiteurs restent.",
        },
        {
          q: "Pourquoi mon site est-il rapide sur ordinateur mais lent sur mobile ?",
          a: "Les smartphones ont moins de puissance et souvent une connexion plus lente. Les grandes images et le JavaScript y pèsent beaucoup plus. Google évalue en priorité la version mobile.",
        },
        {
          q: "Faut-il atteindre 100 points dans PageSpeed Insights ?",
          a: "Non. Le score est une estimation de laboratoire. Ce qui compte, ce sont les données réelles : LCP jusqu'à 2,5 secondes, INP jusqu'à 200 millisecondes et CLS jusqu'à 0,1.",
        },
        {
          q: "Quand verrai-je les améliorations dans la Search Console ?",
          a: "Les données réelles portent sur les 28 derniers jours. Après une optimisation, il faut donc quelques semaines pour que les valeurs se mettent entièrement à jour.",
        },
      ],
    },
  },
};
