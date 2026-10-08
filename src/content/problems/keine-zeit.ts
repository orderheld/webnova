import type { Problem } from "../types";

export const keineZeit: Problem = {
  key: "keine-zeit",
  icon: "shield",
  services: ["wartung", "website-redesign", "seo"],
  guides: ["website-relaunch-checkliste"],
  industries: ["handwerk", "praxis", "gastronomie", "autogewerbe"],
  preset: [],
  content: {
    de: {
      slug: "keine-zeit-fuer-die-webseite",
      navLabel: "Keine Zeit für die Webseite",
      meta: {
        title: "Keine Zeit für die Webseite? Wir übernehmen",
        description:
          "Updates, Sicherheit, Backups und Änderungen: Wir kümmern uns um Ihre Webseite, damit Sie sich um Ihr Geschäft kümmern können. Jetzt unverbindlich anfragen.",
      },
      eyebrow: "Lösung: Webseite in guten Händen",
      h1: "Sie führen Ihr Geschäft. Wir kümmern uns um die Webseite.",
      lead:
        "Updates, Sicherheitslücken, abgelaufene Zertifikate, veraltete Öffnungszeiten: Eine Webseite braucht regelmässig Aufmerksamkeit. Wenn Ihnen dafür die Zeit fehlt, übernehmen wir, mit festem Ansprechpartner und ohne komplizierte Tickets.",
      symptomsTitle: "Daran erkennen Sie das Problem",
      symptoms: [
        "Updates im Admin warten seit Monaten",
        "Sie wissen nicht, ob es ein aktuelles Backup gibt",
        "Kleine Änderungen bleiben wochenlang liegen",
        "Niemand merkt, wenn das Kontaktformular nicht mehr funktioniert",
        "Die Webseite war schon einmal gehackt oder offline",
      ],
      causesTitle: "Warum Webseiten vernachlässigt werden",
      causes: [
        {
          title: "Das Tagesgeschäft geht vor",
          text: "Kundschaft, Personal, Buchhaltung: Die Webseite rutscht verständlicherweise immer wieder nach hinten.",
        },
        {
          title: "Unsicherheit bei der Technik",
          text: "Ein Update könnte etwas kaputt machen. Also lässt man es lieber, bis es irgendwann wirklich ein Problem gibt.",
        },
        {
          title: "Kein fester Ansprechpartner",
          text: "Die Agentur von damals reagiert langsam oder existiert nicht mehr, und für jede Kleinigkeit jemanden zu suchen, ist mühsam.",
        },
        {
          title: "Probleme bleiben unbemerkt",
          text: "Ohne Überwachung fällt ein Ausfall oder ein defektes Formular erst auf, wenn sich Kundschaft beschwert, oder gar nicht.",
        },
      ],
      solutionTitle: "So nehmen wir Ihnen die Webseite ab",
      solutionLead:
        "Mit unserer Wartung bleibt Ihre Webseite sicher, schnell und aktuell. Sie melden Änderungen einfach per E-Mail oder WhatsApp, wir erledigen den Rest.",
      steps: [
        {
          title: "Übernahme und Check",
          text: "Wir prüfen Ihre bestehende Webseite, sichern sie und beheben dringende Punkte zuerst.",
        },
        {
          title: "Updates und Sicherheit",
          text: "Regelmässige Updates, Überwachung der Erreichbarkeit, SSL-Zertifikat und Schutz vor bekannten Angriffen.",
        },
        {
          title: "Backups",
          text: "Automatische Sicherungen an einem separaten Ort, damit im Ernstfall schnell alles wiederhergestellt ist.",
        },
        {
          title: "Änderungen auf Zuruf",
          text: "Neue Öffnungszeiten, Texte, Bilder oder Angebote: Sie schicken uns die Änderung, wir setzen sie zeitnah um.",
        },
      ],
      sections: [
        {
          h2: "Eine Webseite ist nie ganz fertig",
          paragraphs: [
            "Software entwickelt sich weiter, Browser ändern sich, neue Sicherheitslücken werden bekannt. Eine Webseite, die nicht gepflegt wird, wird mit der Zeit langsamer, unsicherer und irgendwann zum Risiko für Ihren Ruf. Regelmässige Wartung kostet deutlich weniger Aufwand als die Reparatur nach einem Ausfall.",
            "Dazu kommt der Inhalt: Aktuelle Angebote, Neuigkeiten und Bilder zeigen Besuchern und Google, dass Ihr Betrieb lebt. Mit einem festen Ansprechpartner bei uns wird das zur Routine statt zur Last.",
          ],
        },
      ],
      faq: [
        {
          q: "Übernehmen Sie auch Webseiten, die Sie nicht gebaut haben?",
          a: "Ja, in vielen Fällen. Wir prüfen die Seite vorab und sagen Ihnen ehrlich, ob sich Wartung lohnt oder ob ein Neuaufbau langfristig günstiger ist.",
        },
        {
          q: "Wie melde ich Änderungen?",
          a: "Ganz einfach per E-Mail, Telefon oder WhatsApp. Sie haben einen festen Ansprechpartner, der Ihre Webseite kennt.",
        },
        {
          q: "Was passiert, wenn die Webseite ausfällt?",
          a: "Wir überwachen die Erreichbarkeit und werden informiert, wenn die Seite nicht mehr erreichbar ist. Dank Backups lässt sich ein funktionierender Stand schnell wiederherstellen.",
        },
        {
          q: "Kann ich trotzdem selbst Änderungen machen?",
          a: "Natürlich. Viele Kundinnen und Kunden pflegen einfache Inhalte selbst und überlassen uns Technik, Sicherheit und grössere Anpassungen.",
        },
      ],
      ctaTitle: "Geben Sie die Webseite in gute Hände",
      ctaText: "Erzählen Sie uns, welche Webseite Sie haben und was Ihnen Sorgen macht. Wir melden uns mit einem Vorschlag.",
    },
    fr: {
      slug: "pas-le-temps-pour-son-site",
      navLabel: "Pas le temps pour le site",
      meta: {
        title: "Pas le temps pour votre site ? On s'en charge",
        description:
          "Mises à jour, sécurité, sauvegardes et modifications : nous prenons soin de votre site pour que vous puissiez vous consacrer à votre entreprise.",
      },
      eyebrow: "Solution : votre site entre de bonnes mains",
      h1: "Vous gérez votre entreprise. Nous gérons votre site.",
      lead:
        "Mises à jour, failles de sécurité, certificats expirés, horaires périmés : un site a régulièrement besoin d'attention. Si vous n'en avez pas le temps, nous prenons le relais, avec un interlocuteur fixe et sans tickets compliqués.",
      symptomsTitle: "Les signes qui ne trompent pas",
      symptoms: [
        "Des mises à jour attendent depuis des mois dans l'admin",
        "Vous ne savez pas s'il existe une sauvegarde récente",
        "Les petites modifications traînent pendant des semaines",
        "Personne ne remarque quand le formulaire ne fonctionne plus",
        "Le site a déjà été piraté ou hors ligne",
      ],
      causesTitle: "Pourquoi les sites sont négligés",
      causes: [
        {
          title: "Le quotidien passe avant",
          text: "Clients, personnel, comptabilité : le site passe logiquement toujours au second plan.",
        },
        {
          title: "Incertitude face à la technique",
          text: "Une mise à jour pourrait tout casser. On préfère attendre, jusqu'au jour où le problème devient réel.",
        },
        {
          title: "Pas d'interlocuteur fixe",
          text: "L'agence d'alors répond lentement ou n'existe plus, et chercher quelqu'un pour chaque détail est pénible.",
        },
        {
          title: "Les problèmes passent inaperçus",
          text: "Sans surveillance, une panne ou un formulaire défectueux n'est remarqué que lorsqu'un client se plaint, ou jamais.",
        },
      ],
      solutionTitle: "Comment nous vous déchargeons du site",
      solutionLead:
        "Avec notre maintenance, votre site reste sûr, rapide et à jour. Vous signalez les modifications par e-mail ou WhatsApp, nous nous occupons du reste.",
      steps: [
        {
          title: "Reprise et contrôle",
          text: "Nous examinons votre site, le sauvegardons et traitons d'abord les points urgents.",
        },
        {
          title: "Mises à jour et sécurité",
          text: "Mises à jour régulières, surveillance de la disponibilité, certificat SSL et protection contre les attaques connues.",
        },
        {
          title: "Sauvegardes",
          text: "Sauvegardes automatiques dans un lieu séparé, pour tout restaurer rapidement en cas de problème.",
        },
        {
          title: "Modifications sur demande",
          text: "Nouveaux horaires, textes, photos ou offres : vous nous envoyez la modification, nous la réalisons rapidement.",
        },
      ],
      sections: [
        {
          h2: "Un site n'est jamais tout à fait terminé",
          paragraphs: [
            "Les logiciels évoluent, les navigateurs changent, de nouvelles failles apparaissent. Un site non entretenu devient avec le temps plus lent, moins sûr et finit par menacer votre réputation. Une maintenance régulière demande nettement moins d'effort qu'une réparation après une panne.",
            "S'y ajoute le contenu : des offres, actualités et photos à jour montrent aux visiteurs et à Google que votre entreprise est active. Avec un interlocuteur fixe chez nous, cela devient une routine plutôt qu'une corvée.",
          ],
        },
      ],
      faq: [
        {
          q: "Reprenez-vous aussi des sites que vous n'avez pas créés ?",
          a: "Oui, dans de nombreux cas. Nous examinons le site au préalable et vous disons honnêtement si la maintenance vaut la peine ou si une reconstruction est plus avantageuse à long terme.",
        },
        {
          q: "Comment signaler des modifications ?",
          a: "Tout simplement par e-mail, téléphone ou WhatsApp. Vous avez un interlocuteur fixe qui connaît votre site.",
        },
        {
          q: "Que se passe-t-il si le site tombe en panne ?",
          a: "Nous surveillons la disponibilité et sommes avertis si le site n'est plus accessible. Grâce aux sauvegardes, une version fonctionnelle peut être restaurée rapidement.",
        },
        {
          q: "Puis-je quand même faire des modifications moi-même ?",
          a: "Bien sûr. Beaucoup de clients gèrent les contenus simples eux-mêmes et nous laissent la technique, la sécurité et les adaptations plus importantes.",
        },
      ],
      ctaTitle: "Confiez votre site à de bonnes mains",
      ctaText: "Dites-nous quel site vous avez et ce qui vous préoccupe. Nous revenons vers vous avec une proposition.",
    },
  },
};
