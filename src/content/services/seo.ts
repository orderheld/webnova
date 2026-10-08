import type { Service } from "../types";

export const seo: Service = {
  key: "seo",
  group: "marketing",
  icon: "search",
  related: ["local-seo", "ki-sichtbarkeit", "webdesign"],
  content: {
    de: {
      slug: "seo-agentur",
      navLabel: "SEO",
      meta: {
        title: "SEO-Agentur: Suchmaschinenoptimierung",
        description:
          "Besser gefunden werden bei Google: Suchmaschinenoptimierung und lokales SEO für Schweizer KMU. Jetzt kostenlose Erstberatung bei Webnova anfragen.",
      },
      eyebrow: "Suchmaschinenoptimierung",
      h1: "SEO-Agentur für Schweizer KMU",
      lead:
        "Wir sorgen dafür, dass Ihre Webseite bei Google dort erscheint, wo Ihre Kunden suchen. Mit sauberer Technik, guten Inhalten und lokalem SEO.",
      features: [
        {
          title: "SEO-Analyse",
          text: "Wir prüfen Technik, Inhalte und Konkurrenz und zeigen Ihnen klar, wo das grösste Potenzial liegt.",
        },
        {
          title: "Keyword-Strategie",
          text: "Wir finden heraus, wonach Ihre Kunden tatsächlich suchen, auf Deutsch und auf Französisch.",
        },
        {
          title: "Technisches SEO",
          text: "Ladezeiten, Indexierung, strukturierte Daten und mobile Darstellung bringen wir auf einen soliden Stand.",
        },
        {
          title: "Lokales SEO",
          text: "Google Unternehmensprofil, Verzeichniseinträge und Standortseiten machen Sie in Ihrer Region sichtbar.",
        },
        {
          title: "Inhalte, die ranken",
          text: "Wir optimieren bestehende Texte und erstellen neue Inhalte, die Fragen beantworten und überzeugen.",
        },
        {
          title: "Transparente Auswertung",
          text: "Sie sehen, wie sich Sichtbarkeit, Besuche und Anfragen entwickeln. Verständlich erklärt, ohne Fachchinesisch.",
        },
      ],
      sections: [
        {
          h2: "Suchmaschinenoptimierung, die zu Anfragen führt",
          paragraphs: [
            "Wer heute einen Handwerker, eine Praxis oder einen Dienstleister sucht, beginnt meist bei Google. Erscheint Ihr Unternehmen dort nicht auf der ersten Seite, gehen diese Kunden zur Konkurrenz. Suchmaschinenoptimierung sorgt dafür, dass Ihre Webseite für die relevanten Suchbegriffe sichtbar wird, und zwar dauerhaft, ohne für jeden Klick zu bezahlen.",
            "Dabei geht es uns nicht um Rankings um ihrer selbst willen. Ziel ist, dass die richtigen Menschen Ihre Website finden und Sie kontaktieren. Darum verbinden wir Technik, Inhalte und Nutzerfreundlichkeit zu einer Strategie, die zu Ihrem Geschäft passt. Messbar, nachvollziehbar und ohne Tricks, die Google abstraft.",
          ],
        },
        {
          h2: "Lokales SEO: In Ihrer Region gefunden werden",
          paragraphs: [
            "Für die meisten KMU zählt vor allem die eigene Region. Suchanfragen wie „Elektriker Solothurn“ oder „Coiffeur Biel“ zeigen bei Google oft eine Karte mit lokalen Anbietern. Wer dort erscheint, erhält besonders viele Anrufe und Anfragen. Das wichtigste Werkzeug dafür ist ein gepflegtes Google Unternehmensprofil.",
            "Wir optimieren Ihr Profil, sorgen für einheitliche Einträge in Verzeichnissen wie local.ch und search.ch und erstellen bei Bedarf Seiten für Ihre wichtigsten Standorte. Als Schweizer Agentur kennen wir den Markt und die Zweisprachigkeit des Marktes. Alle Details zu Profil, Verzeichnissen und Bewertungen finden Sie auf unserer Seite [Local SEO](service:local-seo).",
          ],
          bullets: [
            "Google Unternehmensprofil einrichten und optimieren",
            "Einheitliche Firmendaten in Verzeichnissen",
            "Standortseiten für Ihre Einzugsgebiete",
            "Bewertungen gezielt fördern",
          ],
        },
        {
          h2: "Wie wir bei der SEO-Betreuung vorgehen",
          paragraphs: [
            "Wir starten mit einem Erstgespräch und einer Analyse Ihrer Website und Ihres Marktes. Daraus leiten wir die wichtigsten Massnahmen ab und priorisieren sie nach Aufwand und Wirkung. Zuerst beheben wir technische Hürden, dann stärken wir Inhalte und lokale Signale. Sie wissen dabei immer, woran wir gerade arbeiten und warum.",
            "Suchmaschinenoptimierung braucht Geduld. Erste Verbesserungen sind oft nach einigen Wochen sichtbar, nachhaltige Ergebnisse entstehen über Monate. Wir berichten regelmässig, was wir umgesetzt haben und wie sich Ihre Sichtbarkeit entwickelt. Seriöse SEO-Arbeit verspricht keine Platz-1-Garantie, sondern setzt auf saubere, nachvollziehbare Arbeit. Wie Sie zusätzlich in ChatGPT und den Google AI Overviews sichtbar werden, erklären wir unter [KI-Sichtbarkeit](service:ki-sichtbarkeit).",
          ],
        },
      ],
      faq: [
        {
          q: "Wie schnell sehe ich Ergebnisse mit SEO?",
          a: "Technische Verbesserungen wirken oft innert weniger Wochen. Bis sich Rankings bei umkämpften Begriffen deutlich verbessern, dauert es meist mehrere Monate. Wir zeigen Ihnen den Fortschritt regelmässig auf.",
        },
        {
          q: "Garantieren Sie einen Platz auf der ersten Seite?",
          a: "Nein. Seriöse SEO-Agenturen können Rankings nicht garantieren, da Google allein über die Reihenfolge entscheidet. Wir stehen aber für saubere, transparente Arbeit nach anerkannten Methoden.",
        },
        {
          q: "Was ist der Unterschied zwischen SEO und Google Ads?",
          a: "Mit Google Ads bezahlen Sie für Anzeigen und jeden Klick. SEO verbessert Ihre unbezahlte Sichtbarkeit in den normalen Suchergebnissen. Beides lässt sich sinnvoll kombinieren.",
        },
        {
          q: "Bieten Sie SEO auch auf Französisch an?",
          a: "Ja. Gerade in der Region Biel/Bienne lohnt es sich, in beiden Sprachen gefunden zu werden. Wir optimieren deutsch- und französischsprachige Inhalte.",
        },
        {
          q: "Was kostet Suchmaschinenoptimierung?",
          a: "Der Aufwand hängt von Ihrer Ausgangslage, Ihrer Konkurrenz und Ihren Zielen ab. Nach einer kostenlosen Erstberatung erhalten Sie eine unverbindliche Offerte.",
        },
      ],
      ctaTitle: "Wie sichtbar ist Ihre Webseite?",
      ctaText:
        "Senden Sie uns Ihre Website-Adresse. Wir melden uns für eine kostenlose Erstberatung und zeigen Ihnen, wo das grösste Potenzial liegt.",
    },
    fr: {
      slug: "agence-seo",
      navLabel: "Référencement",
      meta: {
        title: "Agence SEO: référencement naturel",
        description:
          "Référencement naturel et SEO local pour les PME suisses: soyez trouvé sur Google par vos clients. Demandez votre premier conseil gratuit.",
      },
      eyebrow: "Référencement naturel",
      h1: "Agence SEO pour les PME suisses",
      lead:
        "Nous faisons en sorte que votre site apparaisse sur Google là où vos clients cherchent. Avec une technique solide, des contenus utiles et un référencement local efficace.",
      features: [
        {
          title: "Audit SEO",
          text: "Technique, contenus, concurrence: nous identifions clairement où se trouve votre plus grand potentiel.",
        },
        {
          title: "Stratégie de mots-clés",
          text: "Nous déterminons ce que vos clients recherchent vraiment, en français comme en allemand.",
        },
        {
          title: "SEO technique",
          text: "Vitesse, indexation, données structurées et affichage mobile: nous posons des bases solides.",
        },
        {
          title: "Référencement local",
          text: "Fiche Google Business Profile, annuaires et pages par région vous rendent visible près de chez vous.",
        },
        {
          title: "Des contenus qui se positionnent",
          text: "Nous optimisons vos textes existants et créons de nouveaux contenus qui répondent aux questions de vos clients.",
        },
        {
          title: "Suivi transparent",
          text: "Visibilité, visites et demandes: vous suivez l'évolution, expliquée simplement, sans jargon.",
        },
      ],
      sections: [
        {
          h2: "Un référencement qui génère des demandes",
          paragraphs: [
            "Aujourd'hui, pour trouver un artisan, un cabinet ou un prestataire, on commence presque toujours par Google. Si votre entreprise n'apparaît pas en première page, ces clients partent chez la concurrence. Le référencement naturel rend votre site visible sur les recherches qui comptent, durablement et sans payer chaque clic.",
            "Pour nous, le classement n'est pas une fin en soi. L'objectif, c'est que les bonnes personnes trouvent votre site et prennent contact avec vous. Nous combinons donc technique, contenus et confort d'utilisation dans une stratégie adaptée à votre activité. Mesurable, compréhensible et sans astuces que Google pénalise.",
          ],
        },
        {
          h2: "SEO local: être visible dans votre région",
          paragraphs: [
            "Pour la plupart des PME, c'est la clientèle de proximité qui compte. Une recherche comme « électricien Neuchâtel » ou « coiffeur Bienne » affiche souvent une carte avec des entreprises locales. Y figurer apporte de nombreux appels et demandes. L'outil clé, c'est une fiche Google Business Profile bien tenue.",
            "Nous optimisons votre fiche, harmonisons vos données dans les annuaires comme local.ch et search.ch et créons au besoin des pages pour vos zones d'activité. Tous les détails sur notre page [Référencement local](service:local-seo). Ancrés dans la région de Bienne, nous connaissons bien le marché bilingue et les habitudes de recherche des Romands.",
          ],
          bullets: [
            "Création et optimisation de votre fiche Google",
            "Coordonnées cohérentes dans les annuaires",
            "Pages dédiées à vos zones d'activité",
            "Encouragement ciblé des avis clients",
          ],
        },
        {
          h2: "Notre méthode de travail",
          paragraphs: [
            "Nous commençons par un premier entretien et une analyse de votre site et de votre marché. Nous en déduisons les actions prioritaires, classées selon l'effort et l'impact. On corrige d'abord les freins techniques, puis on renforce les contenus et les signaux locaux.",
            "Le référencement demande de la patience. Les premières améliorations se voient souvent après quelques semaines, les résultats durables se construisent sur plusieurs mois. Nous vous informons régulièrement de ce qui a été fait et de l'évolution de votre visibilité. Pas de promesse de première place, mais un travail sérieux et transparent. Pour apparaître aussi dans les réponses de ChatGPT ou des aperçus IA de Google, voyez notre page [Visibilité IA](service:ki-sichtbarkeit).",
          ],
        },
      ],
      faq: [
        {
          q: "Combien de temps avant de voir des résultats?",
          a: "Les corrections techniques produisent souvent un effet en quelques semaines. Pour des mots-clés concurrentiels, une nette progression prend généralement plusieurs mois. Nous vous montrons régulièrement l'évolution.",
        },
        {
          q: "Garantissez-vous la première page de Google?",
          a: "Non. Aucune agence sérieuse ne peut garantir un classement, car c'est Google qui décide. Nous nous engageons en revanche à un travail rigoureux et transparent, selon des méthodes reconnues.",
        },
        {
          q: "Quelle différence entre SEO et Google Ads?",
          a: "Avec Google Ads, vous payez pour des annonces et pour chaque clic. Le SEO améliore votre visibilité gratuite dans les résultats naturels. Les deux se combinent très bien.",
        },
        {
          q: "Travaillez-vous le référencement en français et en allemand?",
          a: "Oui. Dans une région bilingue comme Bienne, il est souvent utile d'être trouvé dans les deux langues. Nous optimisons vos contenus en français et en allemand.",
        },
        {
          q: "Combien coûte le référencement?",
          a: "L'effort dépend de votre situation de départ, de la concurrence et de vos objectifs. Après un premier conseil gratuit, vous recevez une offre sans engagement.",
        },
      ],
      ctaTitle: "Votre site est-il bien visible?",
      ctaText:
        "Envoyez-nous l'adresse de votre site. Nous vous recontactons pour un premier conseil gratuit et vous montrons votre potentiel.",
    },
  },
};
