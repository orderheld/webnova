import type { StandalonePage } from "../types";

export const websiteCheck: StandalonePage = {
  key: "website-check",
  icon: "activity",
  services: ["website-redesign", "seo", "local-seo"],
  guides: ["kmu-webseite-checkliste", "core-web-vitals", "lokales-seo-kmu"],
  content: {
    de: {
      slug: "kostenloser-website-check",
      navLabel: "Kostenloser Website-Check",
      meta: {
        title: "Kostenloser Website-Check für KMU",
        description:
          "Kostenloser Website-Check: Ferhat Demir sieht sich Ihre Website persönlich an und sagt Ihnen, was sich zuerst lohnt. Unverbindlich, ohne Verkaufsdruck.",
      },
      eyebrow: "Kostenlos und unverbindlich",
      h1: "Kostenloser Website-Check: ehrliches Feedback zu Ihrer Website",
      lead:
        "Sie sind unsicher, ob Ihre Website noch zeitgemäss ist, warum keine Anfragen kommen oder ob sich ein Neubau lohnt? Senden Sie uns Ihre Adresse. Ferhat Demir sieht sich Ihre Website persönlich an und gibt Ihnen eine klare Rückmeldung mit den wichtigsten nächsten Schritten.",
      pointsTitle: "Was wir uns ansehen",
      points: [
        {
          title: "Erster Eindruck und Botschaft",
          text: "Versteht man in wenigen Sekunden, was Sie anbieten, für wen und wo? Ist der nächste Schritt klar?",
        },
        {
          title: "Smartphone",
          text: "Lesbarkeit, Bedienung und Kontaktwege auf dem Handy, dort, wo viele Besuche stattfinden.",
        },
        {
          title: "Ladezeit und Technik",
          text: "Wie schnell lädt die Seite? Gibt es offensichtliche technische Bremsen oder veraltete Komponenten?",
        },
        {
          title: "Google-Sichtbarkeit",
          text: "Titel, Beschreibungen, Seitenstruktur und ob die wichtigsten Seiten bei Google überhaupt auffindbar sind.",
        },
        {
          title: "Lokale Präsenz",
          text: "Google-Unternehmensprofil, einheitliche Firmendaten und ob Ihre Region auf der Website vorkommt.",
        },
        {
          title: "Recht und Vertrauen",
          text: "Impressum, Datenschutzerklärung, echte Fotos, Referenzen und Kontaktangaben.",
        },
      ],
      stepsTitle: "So funktioniert der Website-Check",
      steps: [
        {
          title: "Adresse senden",
          text: "Füllen Sie das kurze Formular aus und geben Sie Ihre Website-Adresse an. Unter «Nachricht» können Sie schreiben, was Sie besonders interessiert.",
        },
        {
          title: "Persönliche Durchsicht",
          text: "Ferhat Demir sieht sich Ihre Website selbst an, auf dem Computer und auf dem Smartphone, und prüft die wichtigsten Punkte.",
        },
        {
          title: "Klare Rückmeldung",
          text: "Sie erhalten eine verständliche Rückmeldung per Telefon oder E-Mail, je nach Wunsch: was gut ist, was bremst und was sich zuerst lohnt.",
        },
        {
          title: "Sie entscheiden",
          text: "Ob Sie die Punkte selbst umsetzen, mit Ihrem bisherigen Anbieter oder mit uns: Der Check ist kostenlos und verpflichtet zu nichts.",
        },
      ],
      sections: [
        {
          h2: "Für wen sich der Website-Check lohnt",
          paragraphs: [
            "Der Check richtet sich an kleine und mittlere Unternehmen, Selbständige, Praxen, Handwerksbetriebe und Vereine in der ganzen Schweiz, die bereits eine Website haben. Typische Anlässe sind wenige oder keine Anfragen über die Website, sinkende Sichtbarkeit bei Google, ein Auftritt, der nicht mehr zum Unternehmen passt, oder die Frage, ob eine Überarbeitung reicht oder ein [Relaunch](service:website-redesign) sinnvoller ist.",
            "Auch wenn Sie gerade Offerten für eine neue Website vergleichen, hilft eine unabhängige Einschätzung. Sie wissen danach besser, welche Punkte wichtig sind und worauf Sie bei Angeboten achten sollten. Ergänzend empfehlen wir unseren Ratgeber [Webagentur wählen](guide:webagentur-waehlen).",
          ],
        },
        {
          h2: "Was der Check ist und was nicht",
          paragraphs: [
            "Der kostenlose Website-Check ist eine persönliche, fachliche Einschätzung durch einen Menschen, kein automatisch erzeugter Bericht mit Dutzenden Warnungen ohne Gewichtung. Wir konzentrieren uns auf die Punkte, die für Ihr Geschäft den grössten Unterschied machen, und erklären sie ohne Fachjargon.",
            "Er ersetzt kein vollständiges SEO-Audit, keine rechtliche Prüfung und keinen Sicherheitstest. Wenn wir dabei auf grössere Baustellen stossen, etwa bei Datenschutz, Sicherheit oder Indexierung, sagen wir Ihnen das offen und erklären, welche vertiefte Prüfung sinnvoll wäre.",
          ],
          bullets: [
            "Persönlich von Ferhat Demir, Inhaber von Webnova",
            "Fokus auf die wichtigsten Hebel statt langer Fehlerlisten",
            "Auf Deutsch oder Französisch",
            "Kostenlos, unverbindlich und ohne Verkaufsdruck",
          ],
        },
        {
          h2: "Selbst prüfen: drei schnelle Tests",
          paragraphs: [
            "Einige Dinge können Sie sofort selbst testen. Öffnen Sie Ihre Website auf dem Smartphone und versuchen Sie, Sie selbst anzurufen: Wie viele Schritte braucht es? Suchen Sie bei Google nach Ihrer wichtigsten Leistung und Ihrem Ort: Erscheinen Sie auf der ersten Seite oder in der Karte? Und prüfen Sie Ihre Seite mit PageSpeed Insights von Google, um einen Eindruck der Ladezeit zu erhalten. Was die Werte bedeuten, erklärt unser Ratgeber [Core Web Vitals](guide:core-web-vitals).",
            "Eine ausführliche Liste, was eine KMU-Website enthalten sollte, finden Sie im Ratgeber [Was eine KMU-Webseite wirklich braucht](guide:kmu-webseite-checkliste). Für das Impressum steht Ihnen unser kostenloser [Impressum-Generator](page:impressum-generator) zur Verfügung.",
          ],
        },
      ],
      faq: [
        {
          q: "Ist der Website-Check wirklich kostenlos?",
          a: "Ja. Der Check ist kostenlos und unverbindlich. Sie gehen keine Verpflichtung ein und müssen keine weiteren Leistungen beziehen.",
        },
        {
          q: "Wer sieht sich meine Website an?",
          a: "Ferhat Demir, Inhaber von Webnova, sieht sich Ihre Website persönlich an. Es gibt keinen automatisch erzeugten Bericht und keine Weitergabe an Dritte.",
        },
        {
          q: "Wie erhalte ich die Rückmeldung?",
          a: "Per Telefon oder E-Mail, je nachdem, was Sie im Formular angeben. Wir melden uns innert eines Arbeitstages bei Ihnen.",
        },
        {
          q: "Was brauche ich für den Check?",
          a: "Nur die Adresse Ihrer Website und Ihre Kontaktdaten. Wenn Sie ein konkretes Anliegen haben, etwa wenige Anfragen oder schlechte Sichtbarkeit bei Google, schreiben Sie es in die Nachricht.",
        },
        {
          q: "Müssen Sie Zugang zu meiner Website haben?",
          a: "Nein. Für den Check schauen wir uns nur die öffentlich sichtbare Website an. Zugänge zu Ihrem Redaktionssystem oder Ihren Statistiken brauchen wir dafür nicht.",
        },
        {
          q: "Prüfen Sie auch das Google-Unternehmensprofil?",
          a: "Ja, wenn Ihre Kundschaft vor allem aus der Region kommt, schauen wir uns auch Ihr Profil und die Einheitlichkeit Ihrer Firmendaten an.",
        },
        {
          q: "Ist der Check eine Rechtsberatung?",
          a: "Nein. Wir weisen auf fehlende oder auffällige Angaben bei Impressum und Datenschutz hin, eine rechtliche Prüfung ersetzt das aber nicht.",
        },
        {
          q: "Was passiert nach dem Check?",
          a: "Sie entscheiden. Viele Punkte lassen sich selbst oder mit dem bisherigen Anbieter umsetzen. Wenn Sie Unterstützung wünschen, erstellen wir Ihnen gerne eine unverbindliche Offerte.",
        },
      ],
      ctaTitle: "Website prüfen lassen",
      ctaText: "Senden Sie uns Ihre Website-Adresse. Ferhat Demir prüft Ihre Website persönlich und meldet sich innert eines Arbeitstages bei Ihnen.",
    },
    fr: {
      slug: "analyse-site-gratuite",
      navLabel: "Analyse de site gratuite",
      meta: {
        title: "Analyse de site internet gratuite pour PME",
        description:
          "Analyse de site gratuite : Ferhat Demir examine personnellement votre site et vous dit ce qui vaut la peine en premier. Sans engagement, sans pression.",
      },
      eyebrow: "Gratuit et sans engagement",
      h1: "Analyse de site gratuite : un avis franc sur votre site internet",
      lead:
        "Vous doutez que votre site soit encore à jour, ne savez pas pourquoi les demandes n'arrivent pas ou si une refonte vaut la peine ? Envoyez-nous son adresse. Ferhat Demir examine personnellement votre site et vous donne un retour clair avec les prochaines étapes essentielles.",
      pointsTitle: "Ce que nous examinons",
      points: [
        {
          title: "Première impression et message",
          text: "Comprend-on en quelques secondes ce que vous proposez, pour qui et où ? La prochaine étape est-elle claire ?",
        },
        {
          title: "Smartphone",
          text: "Lisibilité, navigation et contacts sur mobile, là où ont lieu beaucoup de visites.",
        },
        {
          title: "Vitesse et technique",
          text: "La page se charge-t-elle vite ? Y a-t-il des freins techniques évidents ou des composants dépassés ?",
        },
        {
          title: "Visibilité sur Google",
          text: "Titres, descriptions, structure et présence des pages importantes dans Google.",
        },
        {
          title: "Présence locale",
          text: "Fiche Google, cohérence des données d'entreprise et présence de votre région sur le site.",
        },
        {
          title: "Droit et confiance",
          text: "Mentions légales, déclaration de confidentialité, vraies photos, références et coordonnées.",
        },
      ],
      stepsTitle: "Comment fonctionne l'analyse",
      steps: [
        {
          title: "Envoyer l'adresse",
          text: "Remplissez le court formulaire avec l'adresse de votre site. Dans le message, indiquez ce qui vous intéresse particulièrement.",
        },
        {
          title: "Examen personnel",
          text: "Ferhat Demir examine lui-même votre site, sur ordinateur et sur smartphone, et vérifie les points essentiels.",
        },
        {
          title: "Un retour clair",
          text: "Vous recevez un retour compréhensible par téléphone ou e-mail, selon votre choix : ce qui fonctionne, ce qui freine et ce qui vaut la peine en premier.",
        },
        {
          title: "Vous décidez",
          text: "Que vous appliquiez les conseils vous-même, avec votre prestataire actuel ou avec nous : l'analyse est gratuite et sans engagement.",
        },
      ],
      sections: [
        {
          h2: "À qui s'adresse l'analyse",
          paragraphs: [
            "L'analyse s'adresse aux petites et moyennes entreprises, indépendants, cabinets, artisans et associations de toute la Suisse qui ont déjà un site. Les raisons typiques : peu ou pas de demandes via le site, une visibilité Google en baisse, une présentation qui ne correspond plus à l'entreprise, ou la question de savoir si une amélioration suffit ou si une [refonte](service:website-redesign) est plus judicieuse.",
            "Même si vous comparez des devis pour un nouveau site, un avis indépendant aide. Vous savez ensuite mieux quels points comptent et à quoi faire attention dans les offres. Notre guide [Choisir une agence web](guide:webagentur-waehlen) complète cette démarche.",
          ],
        },
        {
          h2: "Ce que l'analyse est, et ce qu'elle n'est pas",
          paragraphs: [
            "L'analyse gratuite est une appréciation personnelle et professionnelle faite par une personne, pas un rapport automatique avec des dizaines d'alertes sans priorité. Nous nous concentrons sur les points qui font la plus grande différence pour votre activité et les expliquons sans jargon.",
            "Elle ne remplace ni un audit SEO complet, ni un examen juridique, ni un test de sécurité. Si nous découvrons des chantiers importants, par exemple en matière de protection des données, de sécurité ou d'indexation, nous vous le disons franchement et expliquons quel examen approfondi serait utile.",
          ],
          bullets: [
            "Personnellement par Ferhat Demir, propriétaire de Webnova",
            "Les leviers essentiels plutôt que de longues listes d'erreurs",
            "En français ou en allemand",
            "Gratuit, sans engagement et sans pression commerciale",
          ],
        },
        {
          h2: "Vérifier soi-même : trois tests rapides",
          paragraphs: [
            "Certains points se testent tout de suite. Ouvrez votre site sur smartphone et essayez de vous appeler : combien d'étapes faut-il ? Cherchez sur Google votre prestation principale et votre localité : apparaissez-vous en première page ou sur la carte ? Et testez votre page avec PageSpeed Insights de Google pour avoir une idée de la vitesse. Notre guide [Core Web Vitals](guide:core-web-vitals) explique les valeurs.",
            "Une liste détaillée de ce qu'un site de PME doit contenir se trouve dans le guide [Ce dont un site de PME a vraiment besoin](guide:kmu-webseite-checkliste). Pour les mentions légales, utilisez notre [générateur gratuit](page:impressum-generator).",
          ],
        },
      ],
      faq: [
        {
          q: "L'analyse est-elle vraiment gratuite ?",
          a: "Oui. L'analyse est gratuite et sans engagement. Vous ne vous engagez à rien et n'avez aucune autre prestation à acheter.",
        },
        {
          q: "Qui examine mon site ?",
          a: "Ferhat Demir, propriétaire de Webnova, examine votre site personnellement. Pas de rapport automatique, pas de transmission à des tiers.",
        },
        {
          q: "Comment est-ce que je reçois le retour ?",
          a: "Par téléphone ou e-mail, selon ce que vous indiquez dans le formulaire. Nous vous répondons en un jour ouvrable.",
        },
        {
          q: "De quoi avez-vous besoin ?",
          a: "Seulement de l'adresse de votre site et de vos coordonnées. Si vous avez une préoccupation précise, comme peu de demandes ou une faible visibilité sur Google, indiquez-la dans le message.",
        },
        {
          q: "Devez-vous avoir accès à mon site ?",
          a: "Non. Nous examinons uniquement le site public. Aucun accès à votre système de gestion ou à vos statistiques n'est nécessaire.",
        },
        {
          q: "Vérifiez-vous aussi la fiche Google ?",
          a: "Oui, si votre clientèle est surtout régionale, nous examinons aussi votre fiche et la cohérence de vos données d'entreprise.",
        },
        {
          q: "L'analyse est-elle un conseil juridique ?",
          a: "Non. Nous signalons les informations manquantes ou douteuses dans les mentions légales et la protection des données, mais cela ne remplace pas un examen juridique.",
        },
        {
          q: "Que se passe-t-il après l'analyse ?",
          a: "Vous décidez. Beaucoup de points peuvent être réglés vous-même ou avec votre prestataire actuel. Si vous souhaitez de l'aide, nous vous faisons volontiers un devis sans engagement.",
        },
      ],
      ctaTitle: "Faire analyser votre site",
      ctaText: "Envoyez-nous l'adresse de votre site. Ferhat Demir l'examine personnellement et vous contacte en un jour ouvrable.",
    },
  },
};
