import type { Problem } from "../types";

export const nichtGefunden: Problem = {
  key: "nicht-gefunden",
  icon: "search",
  services: ["seo", "website-redesign", "online-marketing"],
  guides: ["google-unternehmensprofil", "lokales-seo-kmu", "website-relaunch-checkliste"],
  industries: ["handwerk", "coiffeur-beauty", "gastronomie", "autogewerbe"],
  preset: ["seo"],
  content: {
    de: {
      slug: "bei-google-nicht-gefunden",
      navLabel: "Bei Google nicht gefunden",
      meta: {
        title: "Bei Google nicht gefunden? So ändern Sie das",
        description:
          "Ihre Firma erscheint bei Google nicht oder erst auf Seite drei? Wir finden die Ursachen und sorgen für Sichtbarkeit, lokal und schweizweit. Jetzt anfragen.",
      },
      eyebrow: "Lösung: Sichtbarkeit bei Google",
      h1: "Ihre Kundschaft sucht. Und findet die Konkurrenz.",
      lead:
        "Wer bei Google nicht auf der ersten Seite steht, existiert für viele Suchende nicht. Die gute Nachricht: Die Ursachen sind meist klar erkennbar und lassen sich beheben. Wir zeigen Ihnen, wo es hakt, und bringen Ihre Webseite nach vorne.",
      symptomsTitle: "Daran erkennen Sie das Problem",
      symptoms: [
        "Sie finden Ihre Firma nur, wenn Sie den Namen eingeben",
        "In Google Maps erscheinen andere Betriebe zuerst",
        "Für Ihre wichtigste Leistung stehen Sie nicht auf Seite eins",
        "Ihr Google-Unternehmensprofil ist unvollständig oder fehlt",
        "Die Besucherzahlen stagnieren seit Jahren",
      ],
      causesTitle: "Warum Google Sie nicht zeigt",
      causes: [
        {
          title: "Eine Seite für alles",
          text: "Alle Leistungen stehen auf einer Seite. Google kann nicht erkennen, wofür genau Sie die beste Antwort sind.",
        },
        {
          title: "Technische Hürden",
          text: "Langsame Ladezeiten, fehlende Titel und Beschreibungen, schlechte mobile Darstellung oder Seiten, die Google gar nicht lesen kann.",
        },
        {
          title: "Lokale Signale fehlen",
          text: "Kein gepflegtes Google-Unternehmensprofil, uneinheitliche Adressangaben in Verzeichnissen und wenige Bewertungen.",
        },
        {
          title: "Zu wenig hilfreicher Inhalt",
          text: "Kurze, allgemeine Texte beantworten nicht, was Suchende wirklich wissen wollen. Andere Seiten tun es besser.",
        },
      ],
      solutionTitle: "So bringen wir Sie bei Google nach vorne",
      solutionLead:
        "Suchmaschinenoptimierung ist kein Trick, sondern saubere Arbeit an Technik, Inhalt und lokalen Signalen. Wir gehen strukturiert vor.",
      steps: [
        {
          title: "SEO-Analyse",
          text: "Wir prüfen Technik, Inhalte, Konkurrenz und Ihr Google-Profil und zeigen, für welche Suchbegriffe Sie realistisch gewinnen können.",
        },
        {
          title: "Technik und Struktur",
          text: "Schnelle Ladezeiten, saubere Titel, strukturierte Daten und eine eigene Seite pro Leistung und Zielgruppe.",
        },
        {
          title: "Inhalte, die antworten",
          text: "Texte, die die Fragen Ihrer Kundschaft beantworten, ergänzt durch Ratgeber und häufige Fragen.",
        },
        {
          title: "Lokal stark",
          text: "Google-Unternehmensprofil vollständig, einheitliche Einträge in Verzeichnissen und ein einfacher Ablauf für Bewertungen.",
        },
      ],
      sections: [
        {
          h2: "Ehrliche Erwartungen an SEO",
          paragraphs: [
            "Seriöse Suchmaschinenoptimierung verspricht keine Platzierungen in einer bestimmten Zeit. Google entscheidet selbst, und die Konkurrenz schläft nicht. Was wir versprechen können: eine technisch saubere Webseite, Inhalte, die besser sind als die der Mitbewerber, und eine transparente Auswertung, damit Sie sehen, was sich bewegt.",
            "Erfahrungsgemäss zeigen sich erste Verbesserungen nach einigen Wochen, stabile Ergebnisse brauchen meist einige Monate. Bei lokalen Suchen geht es oft schneller, weil das Google-Unternehmensprofil direkt wirkt.",
          ],
        },
      ],
      faq: [
        {
          q: "Warum wird meine Webseite bei Google nicht gefunden?",
          a: "Häufige Gründe sind fehlende Seiten pro Leistung, technische Fehler, ein unvollständiges Google-Unternehmensprofil und zu wenig hilfreicher Inhalt. Eine SEO-Analyse zeigt, was bei Ihnen zutrifft.",
        },
        {
          q: "Wie lange dauert es, bis ich bei Google besser stehe?",
          a: "Erste Verbesserungen sind oft nach einigen Wochen sichtbar, stabile Ergebnisse brauchen meist einige Monate. Lokale Suchen reagieren in der Regel schneller.",
        },
        {
          q: "Reicht ein Google-Unternehmensprofil nicht aus?",
          a: "Es ist für lokale Suchen sehr wichtig, ersetzt aber keine gute Webseite. Google bewertet beides zusammen, und die Webseite entscheidet, ob aus einem Klick eine Anfrage wird.",
        },
        {
          q: "Sind Google Ads eine Alternative zu SEO?",
          a: "Anzeigen bringen sofort Sichtbarkeit, kosten aber für jeden Klick. SEO wirkt langsamer, dafür nachhaltig. Oft ist eine Kombination sinnvoll, besonders am Anfang.",
        },
        {
          q: "Können Sie Platz eins garantieren?",
          a: "Nein, und niemand Seriöses kann das. Wir garantieren saubere Arbeit, klare Prioritäten und eine transparente Auswertung der Ergebnisse.",
        },
      ],
      ctaTitle: "Finden wir heraus, warum Google Sie nicht zeigt",
      ctaText: "Nennen Sie uns Ihre Webseite und Ihre wichtigsten Leistungen. Sie erhalten eine ehrliche Einschätzung.",
    },
    fr: {
      slug: "introuvable-sur-google",
      navLabel: "Introuvable sur Google",
      meta: {
        title: "Introuvable sur Google ? Voici la solution",
        description:
          "Votre entreprise n'apparaît pas sur Google ou seulement en page trois ? Nous trouvons les causes et assurons votre visibilité, locale et en Suisse.",
      },
      eyebrow: "Solution : visibilité sur Google",
      h1: "Vos clients cherchent. Et trouvent la concurrence.",
      lead:
        "Qui n'est pas en première page de Google n'existe pas pour beaucoup d'internautes. La bonne nouvelle : les causes sont généralement identifiables et se corrigent. Nous vous montrons ce qui bloque et faisons progresser votre site.",
      symptomsTitle: "Les signes qui ne trompent pas",
      symptoms: [
        "Vous ne trouvez votre entreprise qu'en tapant son nom",
        "Sur Google Maps, d'autres entreprises apparaissent avant vous",
        "Pour votre prestation principale, vous n'êtes pas en première page",
        "Votre profil d'établissement Google est incomplet ou absent",
        "Le nombre de visiteurs stagne depuis des années",
      ],
      causesTitle: "Pourquoi Google ne vous montre pas",
      causes: [
        {
          title: "Une seule page pour tout",
          text: "Toutes les prestations sont sur une page. Google ne peut pas savoir pour quoi exactement vous êtes la meilleure réponse.",
        },
        {
          title: "Obstacles techniques",
          text: "Chargement lent, titres et descriptions manquants, mauvais affichage mobile ou pages que Google ne peut pas lire.",
        },
        {
          title: "Il manque des signaux locaux",
          text: "Pas de profil d'établissement Google soigné, des adresses incohérentes dans les annuaires et peu d'avis.",
        },
        {
          title: "Pas assez de contenu utile",
          text: "Des textes courts et généraux ne répondent pas à ce que les internautes veulent savoir. D'autres pages le font mieux.",
        },
      ],
      solutionTitle: "Comment nous vous faisons progresser sur Google",
      solutionLead:
        "Le référencement n'est pas une astuce, mais un travail soigné sur la technique, le contenu et les signaux locaux. Nous procédons de façon structurée.",
      steps: [
        {
          title: "Analyse SEO",
          text: "Nous examinons technique, contenus, concurrence et profil Google et montrons sur quels mots-clés vous pouvez gagner de façon réaliste.",
        },
        {
          title: "Technique et structure",
          text: "Chargement rapide, titres soignés, données structurées et une page par prestation et par public cible.",
        },
        {
          title: "Des contenus qui répondent",
          text: "Des textes qui répondent aux questions de vos clients, complétés par des conseils et des questions fréquentes.",
        },
        {
          title: "Fort localement",
          text: "Profil d'établissement Google complet, inscriptions cohérentes dans les annuaires et une démarche simple pour les avis.",
        },
      ],
      sections: [
        {
          h2: "Des attentes honnêtes envers le SEO",
          paragraphs: [
            "Un référencement sérieux ne promet pas de positions dans un délai donné. Google décide seul, et la concurrence ne dort pas. Ce que nous pouvons promettre : un site techniquement propre, des contenus meilleurs que ceux des concurrents et une analyse transparente pour voir ce qui évolue.",
            "Selon notre expérience, les premières améliorations apparaissent après quelques semaines, des résultats stables demandent généralement quelques mois. Pour les recherches locales, c'est souvent plus rapide, car le profil d'établissement Google agit directement.",
          ],
        },
      ],
      faq: [
        {
          q: "Pourquoi mon site n'est-il pas trouvé sur Google ?",
          a: "Les raisons fréquentes sont l'absence de pages par prestation, des erreurs techniques, un profil d'établissement Google incomplet et trop peu de contenu utile. Une analyse SEO montre ce qui vous concerne.",
        },
        {
          q: "Combien de temps pour mieux se positionner sur Google ?",
          a: "Les premières améliorations sont souvent visibles après quelques semaines, des résultats stables demandent généralement quelques mois. Les recherches locales réagissent en règle générale plus vite.",
        },
        {
          q: "Un profil d'établissement Google ne suffit-il pas ?",
          a: "Il est très important pour les recherches locales, mais ne remplace pas un bon site. Google évalue les deux ensemble, et c'est le site qui transforme un clic en demande.",
        },
        {
          q: "Google Ads est-il une alternative au SEO ?",
          a: "Les annonces donnent une visibilité immédiate mais coûtent à chaque clic. Le SEO agit plus lentement, mais durablement. Une combinaison est souvent judicieuse, surtout au début.",
        },
        {
          q: "Pouvez-vous garantir la première place ?",
          a: "Non, et aucun prestataire sérieux ne le peut. Nous garantissons un travail soigné, des priorités claires et une analyse transparente des résultats.",
        },
      ],
      ctaTitle: "Découvrons pourquoi Google ne vous montre pas",
      ctaText: "Indiquez-nous votre site et vos prestations principales. Vous recevez une évaluation honnête.",
    },
  },
};
