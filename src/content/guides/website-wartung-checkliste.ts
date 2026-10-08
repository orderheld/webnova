import type { Guide } from "../types";

export const websiteWartungCheckliste: Guide = {
  key: "website-wartung-checkliste",
  date: "2026-10-09",
  readingMinutes: 8,
  related: ["wartung", "website-redesign", "seo"],
  relatedGuides: ["webseite-erneuern", "core-web-vitals", "kmu-webseite-checkliste"],
  content: {
    de: {
      slug: "website-wartung-checkliste",
      meta: {
        title: "Website-Wartung: was dazugehört, mit Checkliste",
        description:
          "Updates, Backups, Sicherheit, Ladezeit und Inhalte: was zur Website-Wartung gehört, wie oft was fällig ist und woran Sie eine gute Betreuung erkennen.",
      },
      h1: "Website-Wartung: was dazugehört und warum sie sich lohnt",
      lead: "Eine Webseite ist nach dem Launch nicht fertig. Software veraltet, Sicherheitslücken werden bekannt, und Inhalte ändern sich. Dieser Ratgeber zeigt, was zu einer guten Wartung gehört, wie oft was fällig ist und wann sich ein Wartungsvertrag lohnt.",
      keyTakeaways: [
        "Sicherheitsupdates für Redaktionssystem, Erweiterungen und Server gehören zu den wichtigsten Aufgaben, denn veraltete Software wird automatisiert angegriffen.",
        "Ein Backup ist nur so gut wie seine Wiederherstellung: Es gehört an einen zweiten Ort und sollte gelegentlich getestet werden.",
        "Testen Sie Ihre Kontaktformulare regelmässig. Ein Formular, das still versagt, kostet Anfragen, ohne dass es jemand merkt.",
        "Zur Wartung gehören auch Inhalte, Ladezeit und Datenschutzerklärung, nicht nur die Technik.",
      ],
      sources: [
        { label: "Bundesamt für Cybersicherheit (BACS): Massnahmen zum Schutz von CMS", url: "https://www.ncsc.admin.ch/ncsc/de/home/infos-fuer/infos-unternehmen/aktuelle-themen/massnahmen-schutz-cms.html" },
        { label: "Search Console-Hilfe: Core Web Vitals-Bericht", url: "https://support.google.com/webmasters/answer/9205520?hl=de" },
        { label: "Fedlex: Bundesgesetz über den Datenschutz (DSG, SR 235.1)", url: "https://www.fedlex.admin.ch/eli/cc/2022/491/de" },
      ],
      sections: [
        {
          h2: "Warum eine Webseite Wartung braucht",
          paragraphs: [
            "Eine Webseite besteht aus Software: einem Redaktionssystem, Erweiterungen, Programmbibliotheken und dem Server, auf dem alles läuft. Für all diese Bausteine erscheinen laufend Updates, oft weil Sicherheitslücken geschlossen werden. Angreifer suchen automatisiert nach Webseiten mit bekannten Lücken. Dabei spielt es keine Rolle, ob Ihr Unternehmen gross oder klein ist.",
            "Dazu kommt der normale Wandel: Browser und Smartphones entwickeln sich weiter, Google passt seine Anforderungen an, und in Ihrem Unternehmen ändern sich Angebote, Öffnungszeiten und Ansprechpersonen. Eine Webseite, die niemand betreut, wird deshalb mit der Zeit langsamer, unsicherer und ungenauer, ohne dass es sofort auffällt.",
          ],
        },
        {
          h2: "Technische Wartung: Updates, Sicherheit und Backups",
          paragraphs: [
            "Kern der Wartung sind Updates. Sicherheitsupdates sollten zeitnah eingespielt werden, grössere Versionssprünge besser zuerst auf einer Testversion, damit nichts unerwartet kaputtgeht. Erweiterungen, die nicht mehr weiterentwickelt werden, ersetzen Sie durch gepflegte Alternativen oder entfernen sie ganz. Jede Erweiterung, die Sie nicht brauchen, ist ein Baustein weniger, der veralten kann.",
            "Genauso wichtig sind Backups. Ein gutes Backup wird automatisch erstellt, an einem zweiten Ort gespeichert und umfasst Dateien und Datenbank. Entscheidend ist, dass sich die Webseite daraus auch wirklich wiederherstellen lässt. Testen Sie das gelegentlich, bevor Sie es im Ernstfall brauchen. Dazu kommen ein gültiges SSL-Zertifikat, starke Passwörter mit Zwei-Faktor-Anmeldung und eine Überwachung, die meldet, wenn die Webseite nicht erreichbar ist.",
          ],
          bullets: [
            "Sicherheitsupdates für Redaktionssystem, Erweiterungen und Server",
            "Automatische Backups an einem zweiten Ort, Wiederherstellung getestet",
            "Gültiges SSL-Zertifikat mit automatischer Erneuerung",
            "Starke Passwörter und Zwei-Faktor-Anmeldung für alle Zugänge",
            "Überwachung der Erreichbarkeit mit Benachrichtigung",
          ],
        },
        {
          h2: "Funktion und Ladezeit regelmässig prüfen",
          paragraphs: [
            "Eine Webseite kann laufen und trotzdem Anfragen verlieren. Der Klassiker ist das Kontaktformular, das nach einem Update oder einer Änderung beim E-Mail-Anbieter keine Nachrichten mehr zustellt. Niemand bemerkt es, denn es kommen ja auch keine Anfragen mehr. Senden Sie deshalb regelmässig eine Testanfrage über jedes Formular.",
            "Prüfen Sie ausserdem defekte Links, Fehlerseiten und die Ladezeit. Die Google Search Console meldet kostenlos, welche Seiten Probleme haben, und zeigt die [Core Web Vitals](guide:core-web-vitals) aus echten Besuchen. Werden die Werte schlechter, sind oft neue, zu grosse Bilder oder zusätzliche Skripte der Grund.",
          ],
        },
        {
          h2: "Inhalte aktuell halten",
          paragraphs: [
            "Wartung betrifft nicht nur die Technik. Stimmen Öffnungszeiten, Telefonnummern, Team und Leistungen noch? Sind die Betriebsferien eingetragen? Veraltete Angaben verärgern Kunden und kosten Vertrauen. Gleichen Sie die Daten auch mit Ihrem [Google-Unternehmensprofil](guide:google-unternehmensprofil) ab, denn widersprüchliche Angaben verunsichern Kunden und Suchmaschinen.",
            "Neue Inhalte sind ausserdem eine Chance: Eine zusätzliche Leistung, ein neues Angebot oder Antworten auf häufige Kundenfragen machen Ihre Webseite für Besucher und für Google wertvoller. Planen Sie dafür feste Zeitpunkte ein, zum Beispiel einmal pro Quartal.",
          ],
        },
        {
          h2: "Rechtliches und Datenschutz im Blick behalten",
          paragraphs: [
            "Bauen Sie neue Funktionen ein, etwa eine Karte, ein Buchungstool, ein Video oder ein Statistikprogramm, werden oft zusätzliche Personendaten bearbeitet. Dann muss auch die Datenschutzerklärung angepasst werden. Das Datenschutzgesetz verlangt, dass Sie transparent informieren, wofür Sie Personendaten bearbeiten und an wen sie weitergegeben werden.",
            "Prüfen Sie mindestens einmal im Jahr, ob Impressum und Datenschutzerklärung noch zur Webseite passen. Einen Entwurf für das Impressum erstellen Sie schnell mit unserem [Impressum-Generator](page:impressum-generator). Bei komplexeren Fragen zum Datenschutz lohnt sich eine juristische Beratung.",
          ],
        },
        {
          h2: "Checkliste: was wann fällig ist",
          paragraphs: [
            "Wie oft welche Aufgabe nötig ist, hängt von Technik und Umfang Ihrer Webseite ab. Diese Übersicht ist ein guter Ausgangspunkt für eine KMU-Webseite.",
          ],
          bullets: [
            "Laufend: Sicherheitsupdates, Überwachung der Erreichbarkeit, automatische Backups",
            "Monatlich: Testanfrage über jedes Formular, Backups und Fehlermeldungen prüfen",
            "Vierteljährlich: Inhalte, Öffnungszeiten und Team prüfen, Ladezeit und Search Console ansehen",
            "Jährlich: Datenschutzerklärung und Impressum, Zugänge und Passwörter, Verträge für Domain und Hosting",
            "Alle paar Jahre: Design, Struktur und Technik grundsätzlich prüfen, mehr dazu unter [Webseite erneuern](guide:webseite-erneuern)",
          ],
        },
        {
          h2: "Selbst machen oder Wartungsvertrag?",
          paragraphs: [
            "Mit etwas technischem Verständnis können Sie vieles selbst erledigen. Der Aufwand wird aber gerne unterschätzt: Updates müssen getestet, Backups kontrolliert und Fehler schnell behoben werden, auch wenn gerade das Tagesgeschäft drängt. Viele KMU übergeben die Wartung deshalb einer Agentur und behalten nur die Inhalte selbst in der Hand.",
            "Achten Sie bei einem Wartungsvertrag darauf, was genau enthalten ist, und stellen Sie die folgenden Fragen. Wichtig ist auch, dass Domain, Hosting und Zugänge auf Ihr Unternehmen laufen. Wie wir das lösen, sehen Sie unter [Wartung & Hosting](service:wartung). Fehlt Ihnen schlicht die Zeit, lesen Sie [Keine Zeit für die Webseite](problem:keine-zeit).",
          ],
          bullets: [
            "Welche Updates sind enthalten, und wie werden sie getestet?",
            "Wie oft werden Backups erstellt, und wo werden sie gespeichert?",
            "Wie schnell wird bei einem Ausfall reagiert?",
            "Sind kleine Anpassungen an Inhalten inbegriffen?",
            "Laufen Domain, Hosting und Zugänge auf Ihr Unternehmen?",
          ],
        },
      ],
      faq: [
        {
          q: "Was passiert, wenn ich meine Webseite nicht warte?",
          a: "Kurzfristig oft nichts Sichtbares. Mit der Zeit steigt aber das Risiko, dass Sicherheitslücken ausgenutzt werden, Funktionen ausfallen oder die Webseite langsamer wird. Eine gehackte Webseite kann Spam verbreiten und von Google in den Suchergebnissen mit einer Warnung versehen werden.",
        },
        {
          q: "Wie oft sollte eine Webseite aktualisiert werden?",
          a: "Sicherheitsupdates so bald wie möglich, grössere Updates nach einem Test. Inhalte sollten Sie mindestens einmal pro Quartal überprüfen und bei jeder Änderung im Unternehmen sofort anpassen.",
        },
        {
          q: "Braucht auch eine neue Webseite Wartung?",
          a: "Ja. Auch eine neue Webseite basiert auf Software, für die laufend Updates erscheinen. Je moderner und schlanker die Technik, desto geringer ist der Aufwand. Ganz entfällt er aber nie.",
        },
        {
          q: "Gehört das Hosting zur Wartung?",
          a: "Nicht automatisch. Hosting ist der Speicherplatz, auf dem die Webseite läuft, Wartung ist die Pflege der Webseite selbst. Viele Agenturen bieten beides zusammen an. Klären Sie, was in Ihrem Angebot enthalten ist.",
        },
        {
          q: "Kann ich die Inhalte selbst pflegen und nur die Technik abgeben?",
          a: "Ja, das ist eine häufige und sinnvolle Aufteilung. Sie ändern Texte, Bilder und Öffnungszeiten selbst, die Agentur kümmert sich um Updates, Backups, Sicherheit und Ladezeit.",
        },
      ],
    },
    fr: {
      slug: "maintenance-site-internet-checklist",
      meta: {
        title: "Maintenance de site internet : la checklist",
        description:
          "Mises à jour, sauvegardes, sécurité, vitesse et contenus : ce que comprend la maintenance d'un site, à quel rythme et comment reconnaître un bon suivi.",
      },
      h1: "Maintenance de site internet : ce qu'elle comprend et pourquoi elle compte",
      lead: "Un site internet n'est pas terminé le jour de sa mise en ligne. Les logiciels vieillissent, des failles de sécurité sont découvertes et les contenus évoluent. Cet article montre ce que comprend une bonne maintenance, à quel rythme et quand un contrat de maintenance vaut la peine.",
      keyTakeaways: [
        "Les mises à jour de sécurité du système de gestion de contenu, des extensions et du serveur sont essentielles, car les logiciels obsolètes sont attaqués de manière automatisée.",
        "Une sauvegarde ne vaut que par sa restauration : elle doit être stockée à un second endroit et testée de temps en temps.",
        "Testez régulièrement vos formulaires de contact. Un formulaire qui tombe en panne sans bruit coûte des demandes sans que personne ne s'en aperçoive.",
        "La maintenance concerne aussi les contenus, la vitesse et la déclaration de protection des données, pas seulement la technique.",
      ],
      sources: [
        { label: "Office fédéral de la cybersécurité (OFCS) : mesures de protection pour les CMS", url: "https://www.ncsc.admin.ch/ncsc/fr/home/infos-fuer/infos-unternehmen/aktuelle-themen/massnahmen-schutz-cms.html" },
        { label: "Aide Search Console : rapport Core Web Vitals", url: "https://support.google.com/webmasters/answer/9205520?hl=fr" },
        { label: "Fedlex : loi fédérale sur la protection des données (LPD, RS 235.1)", url: "https://www.fedlex.admin.ch/eli/cc/2022/491/fr" },
      ],
      sections: [
        {
          h2: "Pourquoi un site internet a besoin de maintenance",
          paragraphs: [
            "Un site internet est fait de logiciels : un système de gestion de contenu, des extensions, des bibliothèques de programmes et le serveur sur lequel tout tourne. Pour tous ces éléments, des mises à jour paraissent en continu, souvent pour corriger des failles de sécurité. Des attaquants recherchent de manière automatisée les sites présentant des failles connues. La taille de votre entreprise n'y change rien.",
            "S'y ajoute l'évolution normale : les navigateurs et les smartphones changent, Google adapte ses exigences, et dans votre entreprise les offres, les horaires et les interlocuteurs évoluent. Un site dont personne ne s'occupe devient donc avec le temps plus lent, moins sûr et moins exact, sans que cela saute aux yeux.",
          ],
        },
        {
          h2: "Maintenance technique : mises à jour, sécurité et sauvegardes",
          paragraphs: [
            "Les mises à jour sont au cœur de la maintenance. Les mises à jour de sécurité doivent être installées rapidement, les mises à niveau importantes plutôt d'abord sur une version de test, pour que rien ne casse de manière inattendue. Les extensions qui ne sont plus développées sont remplacées par des alternatives maintenues ou supprimées. Chaque extension inutile est un élément de moins qui peut vieillir.",
            "Les sauvegardes sont tout aussi importantes. Une bonne sauvegarde est créée automatiquement, stockée à un second endroit et comprend les fichiers et la base de données. L'essentiel est de pouvoir réellement restaurer le site à partir d'elle. Testez-le de temps en temps, avant d'en avoir besoin en urgence. S'y ajoutent un certificat SSL valide, des mots de passe robustes avec authentification à deux facteurs et une surveillance qui signale quand le site n'est plus accessible.",
          ],
          bullets: [
            "Mises à jour de sécurité du système de gestion de contenu, des extensions et du serveur",
            "Sauvegardes automatiques à un second endroit, restauration testée",
            "Certificat SSL valide avec renouvellement automatique",
            "Mots de passe robustes et authentification à deux facteurs pour tous les accès",
            "Surveillance de la disponibilité avec notification",
          ],
        },
        {
          h2: "Contrôler régulièrement le fonctionnement et la vitesse",
          paragraphs: [
            "Un site peut fonctionner et pourtant perdre des demandes. Le cas classique est le formulaire de contact qui, après une mise à jour ou un changement chez le fournisseur e-mail, ne transmet plus de messages. Personne ne s'en rend compte, puisqu'il n'y a justement plus de demandes. Envoyez donc régulièrement une demande test via chaque formulaire.",
            "Contrôlez aussi les liens cassés, les pages d'erreur et la vitesse. La Google Search Console signale gratuitement les pages qui posent problème et affiche les [Core Web Vitals](guide:core-web-vitals) issus de visites réelles. Si les valeurs se dégradent, la cause est souvent de nouvelles images trop lourdes ou des scripts supplémentaires.",
          ],
        },
        {
          h2: "Garder les contenus à jour",
          paragraphs: [
            "La maintenance ne concerne pas que la technique. Les horaires, les numéros de téléphone, l'équipe et les prestations sont-ils encore exacts ? Les vacances annuelles sont-elles indiquées ? Des informations dépassées agacent les clients et coûtent de la confiance. Comparez aussi les données avec votre [fiche Google Business Profile](guide:google-unternehmensprofil), car des informations contradictoires déroutent les clients comme les moteurs de recherche.",
            "Les nouveaux contenus sont en outre une opportunité : une prestation supplémentaire, une nouvelle offre ou des réponses aux questions fréquentes de vos clients rendent votre site plus utile pour les visiteurs et pour Google. Prévoyez pour cela des moments fixes, par exemple une fois par trimestre.",
          ],
        },
        {
          h2: "Garder un œil sur le droit et la protection des données",
          paragraphs: [
            "Lorsque vous ajoutez de nouvelles fonctions, comme une carte, un outil de réservation, une vidéo ou un outil de statistiques, des données personnelles supplémentaires sont souvent traitées. La déclaration de protection des données doit alors être adaptée. La loi sur la protection des données exige d'informer de manière transparente sur les finalités du traitement des données personnelles et sur leurs destinataires.",
            "Vérifiez au moins une fois par an que les mentions légales et la déclaration de protection des données correspondent encore au site. Notre [générateur de mentions légales](page:impressum-generator) vous aide à rédiger rapidement un premier jet. Pour des questions plus complexes de protection des données, un conseil juridique vaut la peine.",
          ],
        },
        {
          h2: "Checklist : quoi faire et quand",
          paragraphs: [
            "La fréquence de chaque tâche dépend de la technique et de la taille de votre site. Cet aperçu est un bon point de départ pour un site de PME.",
          ],
          bullets: [
            "En continu : mises à jour de sécurité, surveillance de la disponibilité, sauvegardes automatiques",
            "Chaque mois : demande test via chaque formulaire, contrôle des sauvegardes et des messages d'erreur",
            "Chaque trimestre : vérifier les contenus, les horaires et l'équipe, regarder la vitesse et la Search Console",
            "Chaque année : déclaration de protection des données et mentions légales, accès et mots de passe, contrats de domaine et d'hébergement",
            "Tous les quelques années : revoir en profondeur le design, la structure et la technique, voir [Moderniser son site internet](guide:webseite-erneuern)",
          ],
        },
        {
          h2: "Le faire soi-même ou signer un contrat de maintenance ?",
          paragraphs: [
            "Avec quelques connaissances techniques, vous pouvez faire beaucoup vous-même. L'effort est toutefois souvent sous-estimé : les mises à jour doivent être testées, les sauvegardes contrôlées et les erreurs corrigées rapidement, même quand les affaires courantes pressent. Beaucoup de PME confient donc la maintenance à une agence et ne gardent que les contenus en main.",
            "Pour un contrat de maintenance, vérifiez précisément ce qui est inclus et posez les questions suivantes. Il est aussi important que le domaine, l'hébergement et les accès soient au nom de votre entreprise. Notre approche est décrite sur la page [maintenance et hébergement](service:wartung). Si vous manquez tout simplement de temps, lisez [Pas le temps pour le site](problem:keine-zeit).",
          ],
          bullets: [
            "Quelles mises à jour sont incluses, et comment sont-elles testées ?",
            "À quelle fréquence les sauvegardes sont-elles faites, et où sont-elles stockées ?",
            "En combien de temps l'agence réagit-elle en cas de panne ?",
            "Les petites modifications de contenu sont-elles comprises ?",
            "Le domaine, l'hébergement et les accès sont-ils au nom de votre entreprise ?",
          ],
        },
      ],
      faq: [
        {
          q: "Que se passe-t-il si je n'entretiens pas mon site ?",
          a: "À court terme, souvent rien de visible. Avec le temps, le risque augmente toutefois que des failles soient exploitées, que des fonctions tombent en panne ou que le site ralentisse. Un site piraté peut diffuser du spam et être signalé par un avertissement dans les résultats de Google.",
        },
        {
          q: "À quelle fréquence faut-il mettre à jour un site internet ?",
          a: "Les mises à jour de sécurité dès que possible, les mises à jour importantes après un test. Vérifiez les contenus au moins une fois par trimestre et adaptez-les immédiatement à chaque changement dans l'entreprise.",
        },
        {
          q: "Un nouveau site a-t-il aussi besoin de maintenance ?",
          a: "Oui. Un nouveau site repose lui aussi sur des logiciels pour lesquels des mises à jour paraissent en continu. Plus la technique est moderne et légère, plus l'effort est réduit, mais il ne disparaît jamais complètement.",
        },
        {
          q: "L'hébergement fait-il partie de la maintenance ?",
          a: "Pas automatiquement. L'hébergement est l'espace sur lequel le site fonctionne, la maintenance est l'entretien du site lui-même. Beaucoup d'agences proposent les deux ensemble. Clarifiez ce qui est compris dans votre offre.",
        },
        {
          q: "Puis-je gérer les contenus moi-même et ne confier que la technique ?",
          a: "Oui, c'est une répartition courante et judicieuse. Vous modifiez vous-même textes, images et horaires, l'agence s'occupe des mises à jour, des sauvegardes, de la sécurité et de la vitesse.",
        },
      ],
    },
  },
};
