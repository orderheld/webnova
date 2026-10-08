import type { Guide } from "../types";

export const webseiteErneuern: Guide = {
  key: "webseite-erneuern",
  date: "2026-10-09",
  readingMinutes: 8,
  related: ["website-redesign", "webdesign", "seo"],
  relatedGuides: ["website-relaunch-checkliste", "core-web-vitals", "webseite-kosten"],
  content: {
    de: {
      slug: "webseite-erneuern",
      meta: {
        title: "Webseite erneuern: 9 Anzeichen, dass es Zeit ist",
        description:
          "Ist Ihre Webseite noch zeitgemäss? 9 klare Anzeichen für eine Erneuerung und wie Sie zwischen Überarbeitung, Redesign und Neubau entscheiden.",
      },
      h1: "Webseite erneuern: 9 Anzeichen, dass es Zeit ist",
      lead: "Eine Webseite altert leise. Sie funktioniert noch, aber sie bringt weniger Anfragen, wirkt auf dem Smartphone umständlich oder zeigt Angebote von gestern. Mit diesen neun Anzeichen prüfen Sie in wenigen Minuten, ob sich eine Erneuerung lohnt und welcher Weg zu Ihnen passt.",
      keyTakeaways: [
        "Die deutlichsten Warnsignale sind eine mühsame Bedienung auf dem Smartphone, lange Ladezeiten und kaum Anfragen über die Webseite.",
        "Veraltete Technik ist ein Sicherheitsrisiko, auch wenn die Webseite äusserlich noch gut aussieht.",
        "Nicht jede Erneuerung ist ein Neubau: Oft genügt eine Überarbeitung oder ein Redesign auf bestehender Basis.",
        "Bei jeder Erneuerung gilt: bestehende Google-Rankings mit Weiterleitungen sichern.",
      ],
      sources: [
        { label: "Google Search Central: Best Practices für die Mobile-First-Indexierung", url: "https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing?hl=de" },
        { label: "Fedlex: Bundesgesetz über den Datenschutz (DSG, SR 235.1)", url: "https://www.fedlex.admin.ch/eli/cc/2022/491/de" },
      ],
      sections: [
        {
          h2: "Anzeichen 1 bis 3: was Ihre Kunden zuerst merken",
          paragraphs: [
            "1. Die Webseite ist auf dem Smartphone mühsam. Ein grosser Teil der Besucher kommt heute mit dem Handy. Muss man dort zoomen, seitlich scrollen oder winzige Links treffen, ist der Besuch schnell vorbei. Auch Google beurteilt Webseiten in erster Linie nach ihrer mobilen Version. Öffnen Sie Ihre Webseite auf dem eigenen Smartphone und versuchen Sie, mit wenigen Klicks eine Anfrage zu senden.",
            "2. Die Seiten laden langsam. Wer mehrere Sekunden auf eine Seite warten muss, springt eher ab. Ältere Webseiten sind oft mit grossen Bildern, vielen Erweiterungen und veralteten Skripten belastet. Ob Ihre Webseite schnell genug ist, zeigen die [Core Web Vitals](guide:core-web-vitals), die Sie kostenlos mit PageSpeed Insights von Google messen können.",
            "3. Über die Webseite kommen kaum Anfragen. Besucher sind da, aber sie melden sich nicht? Häufig fehlt ein klarer nächster Schritt: Telefonnummer und Kontaktformular sind versteckt, das Formular ist zu lang, oder es bleibt unklar, was Sie genau anbieten. Mehr dazu auf unserer Seite [Webseite bringt keine Anfragen](problem:keine-anfragen).",
          ],
          bullets: [
            "Lässt sich die Webseite auf dem Smartphone ohne Zoomen lesen und bedienen?",
            "Lädt die Startseite auch unterwegs zügig?",
            "Ist der Weg zur Anfrage auf jeder Seite sichtbar?",
          ],
        },
        {
          h2: "Anzeichen 4 bis 6: wenn die Webseite nicht mehr zu Ihnen passt",
          paragraphs: [
            "4. Die Inhalte sind veraltet. Leistungen, die Sie nicht mehr anbieten, ein Team, das sich verändert hat, oder die letzte Neuigkeit von vor drei Jahren: Veraltete Inhalte kosten Vertrauen. Besucher fragen sich, ob das Unternehmen überhaupt noch aktiv ist.",
            "5. Das Design passt nicht mehr zum Unternehmen. Ihr Unternehmen hat sich weiterentwickelt, mit neuen Leistungen, einem neuen Logo oder einer anderen Zielgruppe, aber die Webseite zeigt noch den Stand von damals. Wirkt der Auftritt im Vergleich mit Mitbewerbern altmodisch, entscheiden sich Interessenten im Zweifel für die Konkurrenz.",
            "6. Sie können die Webseite nicht selbst ändern. Jede kleine Anpassung braucht einen Anruf bei jemandem, der vielleicht gar nicht mehr erreichbar ist, oder niemand weiss mehr, wo die Zugangsdaten sind. Dann bleiben Inhalte veraltet, weil Änderungen zu umständlich sind. Eine moderne Webseite lässt sich in einem einfachen Redaktionssystem selbst pflegen.",
          ],
        },
        {
          h2: "Anzeichen 7 bis 9: Technik, Google und Recht",
          paragraphs: [
            "7. Die Technik ist veraltet. Seit Jahren keine Updates, ein Redaktionssystem in einer alten Version oder Erweiterungen, die nicht mehr weiterentwickelt werden: Solche Webseiten sind ein bekanntes Ziel automatisierter Angriffe. Fehlt das SSL-Zertifikat, warnen Browser sogar mit dem Hinweis «Nicht sicher». Veraltete Technik sieht man nicht, aber sie ist eines der grössten Risiken.",
            "8. Sie werden bei Google nicht gefunden. Suchen Sie nach Ihrer Leistung und Ihrem Ort, etwa «Schreinerei Bern», und Ihre Webseite taucht nicht auf? Dann fehlen oft eigene Seiten pro Leistung, aussagekräftige Seitentitel oder eine saubere technische Basis. Was dahintersteckt, erklärt der Ratgeber [Lokales SEO für KMU](guide:lokales-seo-kmu).",
            "9. Pflichtangaben und Datenschutz sind lückenhaft. Seit dem 1. September 2023 gilt in der Schweiz das revidierte Datenschutzgesetz. Eine Datenschutzerklärung, die nicht erwähnt, welche Daten über Formulare, Statistiken oder eingebettete Karten bearbeitet werden, ist ein Risiko. Auch ein vollständiges Impressum gehört zu einer seriösen Firmenwebseite.",
          ],
        },
        {
          h2: "Überarbeiten, Redesign oder Neubau?",
          paragraphs: [
            "Nicht jedes Anzeichen bedeutet, dass alles neu gemacht werden muss. Treffen nur einzelne Punkte zu, etwa veraltete Inhalte oder ein unklarer Kontaktweg, genügt oft eine gezielte Überarbeitung. Ist die technische Basis solide, aber Design und Struktur sind in die Jahre gekommen, ist ein [Redesign](service:website-redesign) der richtige Weg: neues Erscheinungsbild, bessere Nutzerführung, und bewährte Inhalte bleiben erhalten.",
            "Ein Neubau lohnt sich, wenn die Technik veraltet ist, die Webseite sich nicht mehr sinnvoll pflegen lässt oder sich Ihr Angebot grundlegend verändert hat. Dann ist es oft günstiger und sicherer, auf einer modernen Basis neu zu beginnen, als ein altes System immer wieder zu flicken. Als Faustregel gilt: Je mehr der neun Anzeichen zutreffen und je mehr davon die Technik betreffen, desto eher lohnt sich ein Neubau.",
          ],
          bullets: [
            "Überarbeitung: Inhalte, Bilder und Kontaktwege der bestehenden Webseite verbessern",
            "Redesign: neues Design und bessere Struktur auf solider technischer Basis",
            "Neubau: neue Technik und Struktur, bewährte Inhalte werden übernommen",
          ],
        },
        {
          h2: "So gehen Sie bei der Erneuerung vor",
          paragraphs: [
            "Am Anfang steht eine ehrliche Bestandsaufnahme: Welche Seiten werden besucht, über welche Suchbegriffe kommen Besucher, welche Inhalte sind wertvoll? Diese Stärken nehmen Sie in die neue Webseite mit. Danach folgen Ziele, Struktur, Inhalte und Design, ähnlich wie bei einer neuen Webseite. Den Ablauf beschreibt der Ratgeber [Webseite erstellen lassen](guide:webseite-erstellen-ablauf).",
            "Besonders wichtig ist der Schutz Ihrer Google-Rankings. Jede alte Adresse braucht eine Weiterleitung auf die passende neue Seite, sonst geht über Jahre aufgebaute Sichtbarkeit verloren. Unsere [Relaunch-Checkliste](guide:website-relaunch-checkliste) führt Schritt für Schritt durch das Projekt. Sind Sie unsicher, wo Ihre Webseite heute steht, hilft unser [kostenloser Website-Check](page:website-check).",
          ],
        },
      ],
      faq: [
        {
          q: "Wie oft sollte man eine Webseite erneuern?",
          a: "Eine feste Regel gibt es nicht. Die Technik braucht laufend Updates. Design und Inhalte sollten Sie überprüfen, sobald sich Ihr Angebot verändert oder die Webseite merklich weniger Anfragen bringt.",
        },
        {
          q: "Verliere ich beim Erneuern meine Google-Rankings?",
          a: "Nicht, wenn sauber gearbeitet wird. Bestehende Adressen werden per 301-Weiterleitung auf die passenden neuen Seiten umgeleitet, und gut rankende Inhalte bleiben erhalten. Leichte Schwankungen in den ersten Wochen sind normal.",
        },
        {
          q: "Kann ich nur das Design erneuern lassen?",
          a: "Ja, wenn die technische Basis solide und gepflegt ist. Ist das Redaktionssystem veraltet oder nicht mehr wartbar, ist ein Neubau meist die nachhaltigere Lösung.",
        },
        {
          q: "Werden meine bisherigen Inhalte übernommen?",
          a: "Gute Inhalte werden übernommen und dabei überarbeitet, veraltete Texte aktualisiert oder ersetzt. So profitieren Sie von dem, was bereits funktioniert, und schliessen gleichzeitig Lücken.",
        },
      ],
    },
    fr: {
      slug: "moderniser-site-internet",
      meta: {
        title: "Moderniser son site internet : 9 signes clés",
        description:
          "Votre site est-il encore actuel ? 9 signes qu'il est temps de le moderniser, et comment choisir entre retouches, refonte du design et nouveau site.",
      },
      h1: "Moderniser son site internet : 9 signes qu'il est temps",
      lead: "Un site internet vieillit sans bruit. Il fonctionne encore, mais il apporte moins de demandes, paraît laborieux sur smartphone ou présente des offres d'hier. Avec ces neuf signes, vous vérifiez en quelques minutes si une modernisation vaut la peine et quelle voie vous convient.",
      keyTakeaways: [
        "Les signaux les plus nets sont une utilisation laborieuse sur smartphone, des temps de chargement longs et peu de demandes via le site.",
        "Une technique obsolète est un risque de sécurité, même si le site a encore bonne allure.",
        "Moderniser ne veut pas toujours dire tout refaire : souvent, des retouches ou un nouveau design sur la base existante suffisent.",
        "Dans tous les cas : préserver les positions Google existantes grâce aux redirections.",
      ],
      sources: [
        { label: "Google Search Central : bonnes pratiques pour l'indexation mobile first", url: "https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing?hl=fr" },
        { label: "Fedlex : loi fédérale sur la protection des données (LPD, RS 235.1)", url: "https://www.fedlex.admin.ch/eli/cc/2022/491/fr" },
      ],
      sections: [
        {
          h2: "Signes 1 à 3 : ce que vos clients remarquent en premier",
          paragraphs: [
            "1. Le site est laborieux sur smartphone. Une grande partie des visiteurs arrive aujourd'hui avec un téléphone. S'il faut zoomer, faire défiler latéralement ou viser de minuscules liens, la visite s'arrête vite. Google évalue d'ailleurs les sites principalement d'après leur version mobile. Ouvrez votre site sur votre propre smartphone et essayez d'envoyer une demande en quelques clics.",
            "2. Les pages se chargent lentement. Qui doit attendre plusieurs secondes quitte plus facilement le site. Les sites anciens sont souvent alourdis par de grandes images, de nombreuses extensions et des scripts dépassés. Les [Core Web Vitals](guide:core-web-vitals), que vous pouvez mesurer gratuitement avec PageSpeed Insights de Google, montrent si votre site est assez rapide.",
            "3. Le site n'apporte presque pas de demandes. Les visiteurs sont là, mais ils ne vous contactent pas ? Il manque souvent une prochaine étape claire : le téléphone et le formulaire sont cachés, le formulaire est trop long, ou l'on ne comprend pas bien ce que vous proposez. Plus d'informations sur notre page [Le site n'apporte pas de demandes](problem:keine-anfragen).",
          ],
          bullets: [
            "Le site se lit-il et s'utilise-t-il sur smartphone sans zoomer ?",
            "La page d'accueil se charge-t-elle rapidement, même en déplacement ?",
            "Le chemin vers la demande est-il visible sur chaque page ?",
          ],
        },
        {
          h2: "Signes 4 à 6 : quand le site ne vous ressemble plus",
          paragraphs: [
            "4. Les contenus sont dépassés. Des prestations que vous ne proposez plus, une équipe qui a changé ou la dernière actualité datant de trois ans : des contenus dépassés coûtent de la confiance. Les visiteurs se demandent si l'entreprise est encore active.",
            "5. Le design ne correspond plus à l'entreprise. Votre entreprise a évolué, avec de nouvelles prestations, un nouveau logo ou une autre clientèle, mais le site montre encore l'état d'autrefois. Si votre présence paraît démodée face à la concurrence, les prospects choisissent dans le doute un concurrent.",
            "6. Vous ne pouvez pas modifier le site vous-même. Chaque petite modification demande un appel à quelqu'un qui n'est peut-être plus joignable, ou plus personne ne sait où se trouvent les accès. Les contenus restent alors dépassés, parce que les changements sont trop compliqués. Un site moderne se gère soi-même dans un système de gestion de contenu simple.",
          ],
        },
        {
          h2: "Signes 7 à 9 : technique, Google et droit",
          paragraphs: [
            "7. La technique est obsolète. Pas de mises à jour depuis des années, un système de gestion de contenu dans une ancienne version ou des extensions qui ne sont plus maintenues : ces sites sont une cible connue des attaques automatisées. Sans certificat SSL, les navigateurs affichent même l'avertissement « Non sécurisé ». Une technique obsolète ne se voit pas, mais c'est l'un des plus grands risques.",
            "8. Vous n'êtes pas trouvé sur Google. Vous cherchez votre prestation et votre localité, par exemple « menuiserie Lausanne », et votre site n'apparaît pas ? Il manque souvent une page par prestation, des titres de page parlants ou une base technique propre. Notre article [Référencement local pour PME](guide:lokales-seo-kmu) explique ce qui se cache derrière.",
            "9. Les mentions obligatoires et la protection des données sont incomplètes. Depuis le 1er septembre 2023, la loi révisée sur la protection des données s'applique en Suisse. Une déclaration de protection des données qui ne mentionne pas quelles données sont traitées via les formulaires, les statistiques ou les cartes intégrées est un risque. Des mentions légales complètes font aussi partie d'un site d'entreprise sérieux.",
          ],
        },
        {
          h2: "Retouches, nouveau design ou nouveau site ?",
          paragraphs: [
            "Tous les signes n'impliquent pas de tout refaire. Si seuls quelques points s'appliquent, comme des contenus dépassés ou un contact peu visible, des retouches ciblées suffisent souvent. Si la base technique est solide mais que le design et la structure ont vieilli, une [refonte du design](service:website-redesign) est la bonne voie : nouvelle image, meilleure navigation, et les contenus éprouvés sont conservés.",
            "Un nouveau site se justifie lorsque la technique est obsolète, que le site ne peut plus être maintenu raisonnablement ou que votre offre a profondément changé. Il est alors souvent plus avantageux et plus sûr de repartir sur une base moderne que de rafistoler sans cesse un ancien système. Règle générale : plus les signes sont nombreux, et plus ils concernent la technique, plus un nouveau site s'impose.",
          ],
          bullets: [
            "Retouches : améliorer les contenus, les images et les moyens de contact du site existant",
            "Refonte du design : nouveau design et meilleure structure sur une base technique solide",
            "Nouveau site : nouvelle technique et nouvelle structure, les contenus éprouvés sont repris",
          ],
        },
        {
          h2: "Comment procéder pour moderniser votre site",
          paragraphs: [
            "Tout commence par un état des lieux honnête : quelles pages sont visitées, par quels mots-clés les visiteurs arrivent-ils, quels contenus ont de la valeur ? Ces points forts, vous les emmenez dans le nouveau site. Suivent les objectifs, la structure, les contenus et le design, comme pour un nouveau site. Le déroulement est décrit dans notre article [Faire créer son site internet](guide:webseite-erstellen-ablauf).",
            "La protection de vos positions Google est particulièrement importante. Chaque ancienne adresse a besoin d'une redirection vers la nouvelle page correspondante, sinon la visibilité construite au fil des années se perd. Notre [checklist de refonte](guide:website-relaunch-checkliste) vous guide pas à pas. Si vous ne savez pas où en est votre site aujourd'hui, notre [analyse de site gratuite](page:website-check) vous aide.",
          ],
        },
      ],
      faq: [
        {
          q: "À quelle fréquence faut-il moderniser un site internet ?",
          a: "Il n'existe pas de règle fixe. La technique a besoin de mises à jour en continu. Le design et les contenus méritent d'être revus dès que votre offre change ou que le site apporte nettement moins de demandes.",
        },
        {
          q: "Vais-je perdre mes positions Google en modernisant mon site ?",
          a: "Non, si le travail est fait proprement. Les adresses existantes sont redirigées en 301 vers les nouvelles pages correspondantes, et les contenus bien positionnés sont conservés. De légères fluctuations les premières semaines sont normales.",
        },
        {
          q: "Puis-je ne faire refaire que le design ?",
          a: "Oui, si la base technique est solide et entretenue. Si le système de gestion de contenu est obsolète ou plus maintenable, un nouveau site est généralement la solution la plus durable.",
        },
        {
          q: "Mes contenus actuels seront-ils repris ?",
          a: "Les bons contenus sont repris et retravaillés, les textes dépassés actualisés ou remplacés. Vous profitez ainsi de ce qui fonctionne déjà, tout en comblant les lacunes.",
        },
      ],
    },
  },
};
