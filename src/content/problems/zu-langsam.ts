import type { Problem } from "../types";

export const zuLangsam: Problem = {
  key: "zu-langsam",
  icon: "bolt",
  services: ["website-redesign", "wartung", "seo"],
  guides: ["website-relaunch-checkliste"],
  industries: ["gastronomie", "detailhandel", "immobilien"],
  preset: ["redesign"],
  content: {
    de: {
      slug: "webseite-zu-langsam",
      navLabel: "Webseite zu langsam",
      meta: {
        title: "Webseite zu langsam? Ursachen und Lösung",
        description:
          "Ihre Webseite lädt langsam und Besucher springen ab? Wir finden die Bremsen, optimieren Bilder, Technik und Hosting und machen Ihre Seite schneller.",
      },
      eyebrow: "Lösung: schnelle Ladezeiten",
      h1: "Jede Sekunde Ladezeit kostet Sie Kundschaft.",
      lead:
        "Niemand wartet gerne, schon gar nicht auf dem Handy unterwegs. Eine langsame Webseite verliert Besucher, bevor sie überhaupt etwas gesehen haben, und wird von Google schlechter bewertet. Wir machen Ihre Seite schnell.",
      symptomsTitle: "Daran erkennen Sie das Problem",
      symptoms: [
        "Auf dem Handy bleibt die Seite sekundenlang weiss",
        "Bilder bauen sich langsam von oben nach unten auf",
        "Inhalte springen beim Laden hin und her",
        "Google PageSpeed zeigt rote Werte",
        "Besucher verlassen die Seite, bevor sie scrollen",
      ],
      causesTitle: "Die typischen Bremsen",
      causes: [
        {
          title: "Riesige Bilder",
          text: "Fotos direkt aus der Kamera, mehrere Megabyte gross, in voller Auflösung auf jedem Bildschirm. Der häufigste Grund für langsame Seiten.",
        },
        {
          title: "Zu viele Plugins und Skripte",
          text: "Slider, Tracking, Chat, Schriften von fremden Servern: Jedes Element lädt zusätzlich und blockiert die Darstellung.",
        },
        {
          title: "Schwaches Hosting",
          text: "Günstige Server, weit entfernte Rechenzentren oder fehlendes Caching sorgen für lange Antwortzeiten.",
        },
        {
          title: "Veraltete Technik",
          text: "Alte Themes und Baukästen laden Code für Funktionen, die niemand nutzt, und lassen sich kaum optimieren.",
        },
      ],
      solutionTitle: "So machen wir Ihre Webseite schnell",
      solutionLead:
        "Wir messen, wo die Zeit verloren geht, und beheben die Ursachen statt nur Symptome. Bei veralteter Technik ist ein schlanker Neuaufbau oft der direkteste Weg.",
      steps: [
        {
          title: "Messung",
          text: "Analyse mit den Werten, die auch Google nutzt: Ladezeit des grössten Elements, Reaktionszeit und visuelle Stabilität.",
        },
        {
          title: "Bilder und Schriften",
          text: "Moderne Bildformate, passende Grössen für jedes Gerät, verzögertes Laden und lokal eingebundene Schriften.",
        },
        {
          title: "Ballast entfernen",
          text: "Unnötige Plugins und Skripte raus, Wichtiges zuerst laden. Weniger Code, schnellere Darstellung.",
        },
        {
          title: "Schnelle Technik",
          text: "Wo sinnvoll, ein Neuaufbau mit moderner Technik, die Seiten vorab erstellt und weltweit schnell ausliefert.",
        },
      ],
      sections: [
        {
          h2: "Geschwindigkeit ist ein Rankingfaktor",
          paragraphs: [
            "Google misst, wie schnell und stabil Webseiten für echte Nutzer laden, und berücksichtigt das bei der Platzierung. Eine schnelle Seite ist deshalb nicht nur angenehmer, sondern auch besser sichtbar. Vor allem aber bleiben Besucher länger und fragen häufiger an.",
            "Unsere eigenen Webseiten bauen wir mit moderner Technik, bei der Seiten vorab erzeugt und schlank ausgeliefert werden. Dieselben Prinzipien wenden wir bei Ihrer Seite an, ob mit gezielter Optimierung oder einem Neuaufbau.",
          ],
        },
      ],
      faq: [
        {
          q: "Wie schnell sollte eine Webseite laden?",
          a: "Der wichtigste Inhalt sollte auf dem Handy in rund zweieinhalb Sekunden sichtbar sein. Das entspricht dem Richtwert, den Google für eine gute Nutzererfahrung angibt.",
        },
        {
          q: "Kann man eine bestehende Webseite schneller machen?",
          a: "Oft ja, vor allem über Bilder, Plugins und Caching. Ist die Technik stark veraltet, bringt ein schlanker Neuaufbau meist mehr als viele Einzelkorrekturen.",
        },
        {
          q: "Hilft schnelleres Hosting allein?",
          a: "Es hilft, löst aber selten das ganze Problem. Meist liegen die grössten Bremsen in Bildern und Skripten auf der Seite selbst.",
        },
        {
          q: "Bleibt die Seite nach der Optimierung schnell?",
          a: "Mit unserer Wartung behalten wir Ladezeiten, Updates und neue Inhalte im Blick, damit sich nicht wieder Ballast ansammelt.",
        },
      ],
      ctaTitle: "Lassen Sie uns Ihre Ladezeiten prüfen",
      ctaText: "Nennen Sie uns Ihre Webseite. Wir zeigen Ihnen, wo die Bremsen liegen und was sich schnell verbessern lässt.",
    },
    fr: {
      slug: "site-internet-trop-lent",
      navLabel: "Site trop lent",
      meta: {
        title: "Site internet trop lent ? Causes et solution",
        description:
          "Votre site se charge lentement et les visiteurs partent ? Nous trouvons les freins, optimisons images, technique et hébergement et accélérons votre site.",
      },
      eyebrow: "Solution : des temps de chargement rapides",
      h1: "Chaque seconde de chargement vous coûte des clients.",
      lead:
        "Personne n'aime attendre, surtout en déplacement sur mobile. Un site lent perd des visiteurs avant même qu'ils aient vu quoi que ce soit, et Google le classe moins bien. Nous rendons votre site rapide.",
      symptomsTitle: "Les signes qui ne trompent pas",
      symptoms: [
        "Sur mobile, la page reste blanche plusieurs secondes",
        "Les images s'affichent lentement de haut en bas",
        "Le contenu saute pendant le chargement",
        "Google PageSpeed affiche des valeurs rouges",
        "Les visiteurs quittent la page avant de faire défiler",
      ],
      causesTitle: "Les freins typiques",
      causes: [
        {
          title: "Des images énormes",
          text: "Des photos tout droit de l'appareil, de plusieurs mégaoctets, en pleine résolution sur chaque écran. La cause la plus fréquente de lenteur.",
        },
        {
          title: "Trop de plugins et de scripts",
          text: "Carrousels, suivi, chat, polices de serveurs tiers : chaque élément se charge en plus et bloque l'affichage.",
        },
        {
          title: "Un hébergement faible",
          text: "Serveurs bon marché, centres de données éloignés ou absence de cache provoquent de longs temps de réponse.",
        },
        {
          title: "Une technique dépassée",
          text: "Anciens thèmes et éditeurs chargent du code pour des fonctions inutilisées et se laissent difficilement optimiser.",
        },
      ],
      solutionTitle: "Comment nous rendons votre site rapide",
      solutionLead:
        "Nous mesurons où le temps se perd et corrigeons les causes plutôt que les symptômes. Avec une technique dépassée, une reconstruction légère est souvent la voie la plus directe.",
      steps: [
        {
          title: "Mesure",
          text: "Analyse avec les valeurs qu'utilise aussi Google : chargement de l'élément principal, réactivité et stabilité visuelle.",
        },
        {
          title: "Images et polices",
          text: "Formats d'image modernes, tailles adaptées à chaque appareil, chargement différé et polices hébergées localement.",
        },
        {
          title: "Supprimer le superflu",
          text: "Plugins et scripts inutiles supprimés, l'essentiel chargé en premier. Moins de code, affichage plus rapide.",
        },
        {
          title: "Une technique rapide",
          text: "Si pertinent, une reconstruction avec une technique moderne qui génère les pages à l'avance et les livre rapidement.",
        },
      ],
      sections: [
        {
          h2: "La vitesse est un facteur de classement",
          paragraphs: [
            "Google mesure à quelle vitesse et avec quelle stabilité les pages se chargent pour de vrais utilisateurs, et en tient compte dans le classement. Un site rapide est donc non seulement plus agréable, mais aussi plus visible. Surtout, les visiteurs restent plus longtemps et vous contactent plus souvent.",
            "Nous construisons nos propres sites avec une technique moderne où les pages sont générées à l'avance et livrées de façon légère. Nous appliquons les mêmes principes à votre site, par une optimisation ciblée ou une reconstruction.",
          ],
        },
      ],
      faq: [
        {
          q: "À quelle vitesse un site doit-il se charger ?",
          a: "Le contenu principal devrait être visible sur mobile en deux secondes et demie environ. C'est la valeur indicative que Google donne pour une bonne expérience utilisateur.",
        },
        {
          q: "Peut-on accélérer un site existant ?",
          a: "Souvent oui, surtout grâce aux images, aux plugins et au cache. Si la technique est très dépassée, une reconstruction légère apporte généralement plus que de nombreuses corrections.",
        },
        {
          q: "Un hébergement plus rapide suffit-il ?",
          a: "Il aide, mais résout rarement tout. Les plus gros freins se trouvent généralement dans les images et les scripts de la page elle-même.",
        },
        {
          q: "Le site reste-t-il rapide après l'optimisation ?",
          a: "Avec notre maintenance, nous surveillons temps de chargement, mises à jour et nouveaux contenus pour éviter que le superflu ne s'accumule à nouveau.",
        },
      ],
      ctaTitle: "Vérifions vos temps de chargement",
      ctaText: "Indiquez-nous votre site. Nous vous montrons où sont les freins et ce qui peut être amélioré rapidement.",
    },
  },
};
