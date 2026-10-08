import type { Guide } from "../types";

export const webseiteErstellenAblauf: Guide = {
  key: "webseite-erstellen-ablauf",
  date: "2026-10-09",
  readingMinutes: 10,
  related: ["webdesign", "branding", "wartung"],
  relatedGuides: ["webseite-kosten", "webagentur-waehlen", "kmu-webseite-checkliste"],
  content: {
    de: {
      slug: "webseite-erstellen-lassen-ablauf",
      meta: {
        title: "Webseite erstellen lassen: Ablauf in 7 Schritten",
        description:
          "Wie läuft es ab, wenn Sie eine Webseite erstellen lassen? Die 7 Schritte vom Erstgespräch bis zum Go-live, was Sie vorbereiten und wovon die Dauer abhängt.",
      },
      h1: "Webseite erstellen lassen: der Ablauf in 7 Schritten",
      lead: "Sie planen eine neue Webseite und fragen sich, was auf Sie zukommt? Hier sehen Sie, wie ein Projekt mit einer Agentur abläuft, wo Sie mitentscheiden und was Sie vorbereiten können. So wissen Sie bei jedem Schritt, was als Nächstes kommt.",
      keyTakeaways: [
        "Am Anfang stehen Ziele und Zielgruppen, nicht das Design: Was soll die Webseite für Ihr Unternehmen leisten?",
        "Eine klare Offerte beschreibt Seiten, Funktionen, Inhalte, Zeitplan und was nach dem Launch geschieht.",
        "Struktur und Inhalte werden vor dem Design geplant, damit das Design zu Ihren Inhalten passt.",
        "Texte, Bilder und Zugänge sind die häufigsten Bremsen. Wer sie früh bereitstellt, ist schneller online.",
        "Vor dem Go-live wird alles auf einer Testversion geprüft. Danach braucht die Webseite laufend Pflege.",
      ],
      sources: [
        { label: "Google Search Central: Startleitfaden zur Suchmaschinenoptimierung", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=de" },
      ],
      sections: [
        {
          h2: "Schritt 1: Erstgespräch und Ziele klären",
          paragraphs: [
            "Ein gutes Webprojekt beginnt mit Fragen, nicht mit Farben. Was soll die neue Webseite für Ihr Unternehmen leisten? Mehr Anfragen, Terminbuchungen, Bewerbungen, Verkäufe oder einen professionellen ersten Eindruck? Wen wollen Sie erreichen, und in welchen Sprachen? Je klarer diese Antworten sind, desto gezielter lässt sich die Webseite planen.",
            "Im Erstgespräch klären Sie ausserdem die Rahmenbedingungen: Gibt es schon eine Domain und E-Mail-Adressen, ein Logo oder eine bestehende Webseite? Bis wann soll die neue Webseite online sein, und wer im Unternehmen ist Ansprechperson? Hilfreich ist, wenn Sie zwei oder drei Webseiten mitbringen, die Ihnen gefallen, und sagen können, warum. Das sagt oft mehr als lange Beschreibungen.",
          ],
          bullets: [
            "Ziel der Webseite: Anfragen, Termine, Bewerbungen oder Verkauf",
            "Zielgruppen und Sprachen, zum Beispiel Deutsch und Französisch",
            "Vorhandenes: Domain, E-Mail, Logo, Texte, Bilder, alte Webseite",
            "Wunschtermin und Ansprechperson im Unternehmen",
          ],
        },
        {
          h2: "Schritt 2: Offerte und Projektplan",
          paragraphs: [
            "Auf Basis des Gesprächs erhalten Sie eine Offerte. Eine gute Offerte nennt nicht nur einen Betrag, sondern beschreibt den Umfang: welche Seiten entstehen, welche Funktionen dazugehören, wer Texte und Bilder liefert, wie viele Korrekturrunden vorgesehen sind und was nach dem Launch passiert. Achten Sie besonders auf Hosting, Wartung und Einführung, denn diese Punkte werden in Offerten sehr unterschiedlich gehandhabt.",
            "Vergleichen Sie Offerten deshalb nicht nur über den Preis. Wovon der Preis einer Webseite abhängt, erklärt unser Ratgeber [Was kostet eine Webseite?](guide:webseite-kosten). Welche Fragen Sie einer Agentur vor der Vergabe stellen sollten, finden Sie unter [Webagentur wählen](guide:webagentur-waehlen). Mit dem Auftrag steht auch der Projektplan mit den wichtigsten Etappen fest.",
          ],
        },
        {
          h2: "Schritt 3: Struktur und Inhalte planen",
          paragraphs: [
            "Bevor gestaltet wird, entsteht die Struktur: Welche Seiten braucht es, wie heissen sie im Menü, und wie finden Besucherinnen und Besucher in wenigen Klicks zum Kontakt? Bewährt hat sich eine eigene Seite pro wichtiger Leistung. Das hilft Ihren Kunden bei der Orientierung und Google beim Verständnis, wofür Ihr Unternehmen gefunden werden soll.",
            "Gleichzeitig wird geklärt, woher die Inhalte kommen. Schreiben Sie die Texte selbst, liefern Sie Stichworte, oder übernimmt die Agentur das Texten? Gibt es eigene Fotos von Team, Räumen und Arbeiten? Echte Bilder wirken fast immer glaubwürdiger als Stockfotos. Fehlen Logo oder Farben, ist jetzt der richtige Moment für ein [Branding](service:branding), damit Webseite und Auftritt zusammenpassen.",
          ],
          bullets: [
            "Seitenstruktur (Sitemap) und Menü festlegen",
            "Eine Seite pro wichtiger Leistung planen",
            "Klären, wer Texte, Bilder und Übersetzungen liefert",
          ],
        },
        {
          h2: "Schritt 4: Design entwerfen und abstimmen",
          paragraphs: [
            "Nun entsteht das Design, meist zuerst für die Startseite und eine typische Unterseite. Weil viele Besucher mit dem Smartphone kommen, wird die mobile Ansicht von Anfang an mitgedacht und nicht erst am Schluss angepasst. Farben, Schriften und Bildsprache orientieren sich an Ihrer Marke, damit die Webseite unverwechselbar nach Ihrem Unternehmen aussieht.",
            "Sie geben Rückmeldung, und die Entwürfe werden angepasst, bis die Richtung stimmt. Am meisten bringen konkrete Rückmeldungen wie «Der Kontakt soll schneller sichtbar sein» statt «Es gefällt mir noch nicht ganz». Achten Sie auch auf Lesbarkeit und Kontraste: Eine gut lesbare Webseite hilft allen Besuchern, mehr dazu im Ratgeber [Barrierefreie Website](guide:barrierefreie-website).",
          ],
        },
        {
          h2: "Schritt 5: Umsetzung und Inhalte einpflegen",
          paragraphs: [
            "Ist das Design freigegeben, wird die Webseite technisch umgesetzt und mit Inhalten gefüllt. Dazu gehören Kontaktformulare, Karten, Öffnungszeiten, Sprachversionen und alles, was Ihre Kunden auf der Webseite tun sollen. Ein einfaches Redaktionssystem sorgt dafür, dass Sie Texte, Bilder und Öffnungszeiten später selbst anpassen können, ohne jedes Mal die Agentur zu brauchen.",
            "In diesem Schritt werden auch die Grundlagen für Google gelegt: sprechende Seitentitel und Beschreibungen, eine saubere Überschriftenstruktur, kurze Ladezeiten und strukturierte Daten. Dazu kommen ein Impressum und eine Datenschutzerklärung, die bei einer Firmenwebseite mit Kontaktformular praktisch immer nötig sind. Einen Entwurf für das Impressum erstellen Sie mit unserem [Impressum-Generator](page:impressum-generator).",
          ],
          bullets: [
            "Kontaktwege, Formulare und Sprachversionen",
            "Redaktionssystem, damit Sie Inhalte selbst pflegen können",
            "Seitentitel, Beschreibungen, Ladezeit und strukturierte Daten",
            "Impressum und Datenschutzerklärung",
          ],
        },
        {
          h2: "Schritt 6: Testen und Go-live",
          paragraphs: [
            "Vor dem Go-live wird die Webseite auf einer geschützten Testversion geprüft, die Google noch nicht sieht. Funktionieren alle Formulare, und kommen die Anfragen an? Sieht alles auf Smartphone, Tablet und Computer gut aus? Laden die Seiten schnell? Was dabei gemessen wird, erklärt der Ratgeber [Core Web Vitals](guide:core-web-vitals). Sie selbst prüfen die Inhalte ein letztes Mal auf Richtigkeit.",
            "Beim Go-live wird die Domain auf die neue Webseite umgestellt und das SSL-Zertifikat aktiviert, damit die Seite verschlüsselt über https erreichbar ist. Ersetzt die neue Webseite eine alte, braucht es Weiterleitungen von den alten Adressen, sonst gehen Google-Rankings verloren. Wie das geht, zeigt unsere [Relaunch-Checkliste](guide:website-relaunch-checkliste). Danach wird die Sitemap in der Google Search Console eingereicht und die Adresse im [Google-Unternehmensprofil](guide:google-unternehmensprofil) geprüft.",
          ],
        },
        {
          h2: "Schritt 7: Nach dem Launch weiterentwickeln",
          paragraphs: [
            "Mit dem Go-live ist die Webseite online, aber nicht abgeschlossen. Software braucht Sicherheitsupdates, Backups müssen laufen, und Inhalte wie Öffnungszeiten, Team oder Leistungen ändern sich. Was zu einer guten Wartung gehört, lesen Sie im Ratgeber [Website-Wartung](guide:website-wartung-checkliste). Wer dafür keine Zeit hat, übergibt die Betreuung mit einem [Wartungsvertrag](service:wartung).",
            "Ebenso wichtig ist der Blick auf die Ergebnisse: Kommen Anfragen über die Webseite, und über welche Seiten und Suchbegriffe finden die Besucher zu Ihnen? Nach einigen Wochen zeigt sich, welche Inhalte gut funktionieren und wo es Ergänzungen braucht. Eine Webseite, die regelmässig verbessert wird, wird mit der Zeit auch besser gefunden.",
          ],
        },
        {
          h2: "Wie lange dauert es, eine Webseite erstellen zu lassen?",
          paragraphs: [
            "Eine kleine Firmenwebseite ist oft in einigen Wochen online. Grössere Auftritte mit mehreren Sprachen, vielen Seiten oder einem Onlineshop brauchen entsprechend länger. Erstaunlich selten bremst dabei die Technik. Viel häufiger warten Projekte auf Texte, Bilder, Rückmeldungen oder Zugänge zur Domain.",
            "Sie können also selbst viel dazu beitragen, dass Ihre Webseite schnell online ist. Halten Sie die Unterlagen aus der folgenden Liste bereit und planen Sie für die Rückmelderunden feste Termine ein. Einen realistischen Zeitplan für Ihr Projekt erhalten Sie zusammen mit der Offerte.",
          ],
        },
        {
          h2: "Checkliste: Was Sie vorbereiten können",
          paragraphs: [
            "Mit diesen Unterlagen starten Sie gut vorbereitet ins Projekt. Nicht alles muss am ersten Tag vorliegen, aber je früher es bereitsteht, desto reibungsloser verläuft das Projekt.",
            "Gerne begleiten wir Sie durch alle sieben Schritte. Wie wir dabei vorgehen, sehen Sie auf der Seite [Webdesign](service:webdesign). Oder Sie schildern uns Ihr Vorhaben direkt in einer unverbindlichen Anfrage.",
          ],
          bullets: [
            "Logo als Vektordatei (zum Beispiel SVG oder PDF) und Ihre Farben",
            "Liste Ihrer Leistungen und was Sie von Mitbewerbern unterscheidet",
            "Texte oder Stichworte pro Leistung, Angaben zu Team und Unternehmen",
            "Eigene Fotos von Team, Räumen, Produkten und Arbeiten",
            "Zugangsdaten zur Domain und zum E-Mail-Anbieter",
            "Zugang zum Google-Unternehmensprofil",
            "Bei einer bestehenden Webseite: Zugänge zu Hosting, Redaktionssystem und Google Search Console",
            "Zwei oder drei Webseiten, die Ihnen gefallen, mit einer kurzen Begründung",
          ],
        },
      ],
      faq: [
        {
          q: "Wie lange dauert es, eine Webseite erstellen zu lassen?",
          a: "Eine kleine Firmenwebseite ist oft in einigen Wochen online. Mehrere Sprachen, viele Seiten oder ein Shop verlängern das Projekt. Am meisten Zeit sparen Sie, wenn Texte, Bilder und Zugänge früh bereitstehen.",
        },
        {
          q: "Muss ich die Texte für meine Webseite selbst schreiben?",
          a: "Nein. Sie können Texte selbst liefern, Stichworte geben oder das Texten der Agentur überlassen. Ihr Fachwissen braucht es trotzdem: Niemand kennt Ihre Leistungen und Ihre Kunden so gut wie Sie.",
        },
        {
          q: "Kann ich meine Webseite später selbst bearbeiten?",
          a: "Ja, wenn sie mit einem Redaktionssystem umgesetzt wird. Klären Sie vor der Vergabe, welche Inhalte Sie selbst ändern können und ob eine kurze Einführung dazugehört.",
        },
        {
          q: "Was brauche ich für den Start eines Webprojekts?",
          a: "Für das Erstgespräch reichen Ihre Ziele und eine Vorstellung davon, wen Sie erreichen wollen. Logo, Texte, Fotos und Zugänge zur Domain werden im Lauf des Projekts benötigt. Die Checkliste in diesem Ratgeber zeigt, was dazugehört.",
        },
        {
          q: "Gehört die Domain mir oder der Agentur?",
          a: "Die Domain sollte immer auf Ihr Unternehmen registriert sein, auch wenn die Agentur sie technisch verwaltet. So bleiben Sie unabhängig, falls Sie später einmal den Anbieter wechseln.",
        },
      ],
    },
    fr: {
      slug: "faire-creer-site-internet-etapes",
      meta: {
        title: "Faire créer un site internet : les 7 étapes",
        description:
          "Créer un site internet avec une agence : les 7 étapes du premier entretien à la mise en ligne, ce que vous pouvez préparer et de quoi dépend la durée.",
      },
      h1: "Faire créer son site internet : le déroulement en 7 étapes",
      lead: "Vous prévoyez un nouveau site et vous vous demandez ce qui vous attend ? Voici comment se déroule un projet avec une agence, à quels moments vous décidez et ce que vous pouvez préparer. Vous saurez ainsi, à chaque étape, ce qui vient ensuite.",
      keyTakeaways: [
        "Tout commence par les objectifs et les publics cibles, pas par le design : que doit apporter le site à votre entreprise ?",
        "Une offre claire décrit les pages, les fonctions, les contenus, le calendrier et ce qui se passe après la mise en ligne.",
        "La structure et les contenus sont planifiés avant le design, afin que le design serve vos contenus.",
        "Les textes, les images et les accès sont les freins les plus fréquents. Les fournir tôt, c'est être en ligne plus vite.",
        "Avant la mise en ligne, tout est vérifié sur une version de test. Ensuite, le site a besoin d'un suivi régulier.",
      ],
      sources: [
        { label: "Google Search Central : guide de démarrage du référencement (SEO)", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=fr" },
      ],
      sections: [
        {
          h2: "Étape 1 : premier entretien et objectifs",
          paragraphs: [
            "Un bon projet web commence par des questions, pas par des couleurs. Que doit apporter le nouveau site à votre entreprise ? Plus de demandes, des réservations, des candidatures, des ventes ou une première impression professionnelle ? Qui voulez-vous atteindre, et dans quelles langues ? Plus ces réponses sont claires, plus le site peut être planifié avec précision.",
            "Lors du premier entretien, vous clarifiez aussi le cadre : disposez-vous déjà d'un nom de domaine et d'adresses e-mail, d'un logo ou d'un site existant ? Pour quand le nouveau site doit-il être en ligne, et qui sera l'interlocuteur dans l'entreprise ? Il est utile d'apporter deux ou trois sites qui vous plaisent, en expliquant pourquoi. Cela en dit souvent plus que de longues descriptions.",
          ],
          bullets: [
            "Objectif du site : demandes, rendez-vous, candidatures ou ventes",
            "Publics cibles et langues, par exemple français et allemand",
            "Ce qui existe déjà : domaine, e-mail, logo, textes, images, ancien site",
            "Date souhaitée et interlocuteur dans l'entreprise",
          ],
        },
        {
          h2: "Étape 2 : offre et planning du projet",
          paragraphs: [
            "Sur la base de l'entretien, vous recevez une offre. Une bonne offre ne se limite pas à un montant : elle décrit le périmètre, c'est-à-dire les pages prévues, les fonctions incluses, qui fournit les textes et les images, combien de séries de corrections sont prévues et ce qui se passe après la mise en ligne. Soyez attentif à l'hébergement, à la maintenance et à la prise en main, car ces points sont traités de manière très différente d'une offre à l'autre.",
            "Ne comparez donc pas les offres uniquement sur le prix. Ce qui détermine le prix d'un site est expliqué dans notre article [Combien coûte un site internet ?](guide:webseite-kosten). Les questions à poser à une agence avant de signer se trouvent dans [Choisir une agence web](guide:webagentur-waehlen). Une fois le mandat confirmé, le planning fixe les principales étapes.",
          ],
        },
        {
          h2: "Étape 3 : planifier la structure et les contenus",
          paragraphs: [
            "Avant le design vient la structure : quelles pages sont nécessaires, comment s'appellent-elles dans le menu, et comment les visiteurs trouvent-ils le contact en quelques clics ? Une page par prestation importante a fait ses preuves. Elle aide vos clients à s'orienter et Google à comprendre pour quoi votre entreprise doit être trouvée.",
            "En parallèle, on clarifie d'où viennent les contenus. Rédigez-vous les textes vous-même, fournissez-vous des mots-clés, ou l'agence s'occupe-t-elle de la rédaction ? Avez-vous vos propres photos de l'équipe, des locaux et des réalisations ? De vraies images sont presque toujours plus crédibles que des photos de banque d'images. S'il manque un logo ou des couleurs, c'est le bon moment pour une [identité visuelle](service:branding), afin que le site et votre image forment un tout.",
          ],
          bullets: [
            "Définir l'arborescence (sitemap) et le menu",
            "Prévoir une page par prestation importante",
            "Clarifier qui fournit les textes, les images et les traductions",
          ],
        },
        {
          h2: "Étape 4 : concevoir et valider le design",
          paragraphs: [
            "Vient ensuite le design, généralement d'abord pour la page d'accueil et une page type. Comme de nombreux visiteurs arrivent sur smartphone, l'affichage mobile est pensé dès le départ et non adapté à la fin. Les couleurs, les polices et le style des images s'inspirent de votre marque, pour que le site ressemble clairement à votre entreprise.",
            "Vous donnez votre avis et les maquettes sont ajustées jusqu'à ce que la direction soit la bonne. Les retours concrets sont les plus utiles, par exemple « le contact doit être visible plus vite » plutôt que « ça ne me plaît pas encore tout à fait ». Pensez aussi à la lisibilité et aux contrastes : un site bien lisible aide tous les visiteurs, comme l'explique notre article [Site internet accessible](guide:barrierefreie-website).",
          ],
        },
        {
          h2: "Étape 5 : développement et intégration des contenus",
          paragraphs: [
            "Une fois le design validé, le site est développé et rempli de contenus. Cela comprend les formulaires de contact, les cartes, les horaires, les versions linguistiques et tout ce que vos clients doivent pouvoir faire sur le site. Un système de gestion de contenu simple vous permet ensuite de modifier vous-même textes, images et horaires, sans passer chaque fois par l'agence.",
            "C'est aussi à cette étape que l'on pose les bases pour Google : des titres de page et des descriptions parlants, une hiérarchie de titres propre, des temps de chargement courts et des données structurées. S'y ajoutent des mentions légales et une déclaration de protection des données, pratiquement toujours nécessaires pour un site d'entreprise avec formulaire de contact. Notre [générateur de mentions légales](page:impressum-generator) vous aide à en rédiger un premier jet.",
          ],
          bullets: [
            "Moyens de contact, formulaires et versions linguistiques",
            "Système de gestion de contenu pour gérer vous-même vos contenus",
            "Titres de page, descriptions, vitesse et données structurées",
            "Mentions légales et déclaration de protection des données",
          ],
        },
        {
          h2: "Étape 6 : tests et mise en ligne",
          paragraphs: [
            "Avant la mise en ligne, le site est contrôlé sur une version de test protégée que Google ne voit pas encore. Tous les formulaires fonctionnent-ils, et les demandes arrivent-elles ? L'affichage est-il soigné sur smartphone, tablette et ordinateur ? Les pages se chargent-elles rapidement ? Ce qui est mesuré est expliqué dans notre article sur les [Core Web Vitals](guide:core-web-vitals). De votre côté, vous relisez une dernière fois les contenus.",
            "Lors de la mise en ligne, le domaine est redirigé vers le nouveau site et le certificat SSL activé, pour que le site soit accessible de manière chiffrée en https. Si le nouveau site en remplace un ancien, il faut des redirections depuis les anciennes adresses, sinon les positions sur Google sont perdues. Notre [checklist de refonte](guide:website-relaunch-checkliste) explique comment faire. Ensuite, le sitemap est soumis dans la Google Search Console et l'adresse du site vérifiée dans votre [fiche Google Business Profile](guide:google-unternehmensprofil).",
          ],
        },
        {
          h2: "Étape 7 : faire vivre le site après le lancement",
          paragraphs: [
            "Avec la mise en ligne, le site est en ligne, mais pas terminé. Les logiciels ont besoin de mises à jour de sécurité, les sauvegardes doivent tourner, et les contenus comme les horaires, l'équipe ou les prestations évoluent. Ce que comprend une bonne maintenance est décrit dans notre article [Maintenance de site internet](guide:website-wartung-checkliste). Si vous manquez de temps, confiez le suivi avec un [contrat de maintenance](service:wartung).",
            "Il est tout aussi important de regarder les résultats : des demandes arrivent-elles par le site, et par quelles pages et quels mots-clés les visiteurs vous trouvent-ils ? Après quelques semaines, on voit quels contenus fonctionnent bien et où il faut compléter. Un site amélioré régulièrement est aussi mieux trouvé avec le temps.",
          ],
        },
        {
          h2: "Combien de temps faut-il pour créer un site internet ?",
          paragraphs: [
            "Un petit site d'entreprise est souvent en ligne en quelques semaines. Les projets plus importants, avec plusieurs langues, de nombreuses pages ou une boutique en ligne, prennent plus de temps. Étonnamment, la technique freine rarement. Bien plus souvent, les projets attendent des textes, des images, des retours ou les accès au nom de domaine.",
            "Vous pouvez donc beaucoup contribuer à une mise en ligne rapide. Préparez les documents de la liste ci-dessous et fixez des rendez-vous pour les séries de retours. Vous recevez un calendrier réaliste pour votre projet avec l'offre.",
          ],
        },
        {
          h2: "Checklist : ce que vous pouvez préparer",
          paragraphs: [
            "Avec ces éléments, vous démarrez le projet bien préparé. Tout ne doit pas être prêt le premier jour, mais plus tôt c'est disponible, plus le projet avance sans accroc.",
            "Nous vous accompagnons volontiers dans les sept étapes. Notre façon de travailler est décrite sur la page [création de site internet](service:webdesign). Vous pouvez aussi nous présenter directement votre projet dans une demande sans engagement.",
          ],
          bullets: [
            "Logo en format vectoriel (par exemple SVG ou PDF) et vos couleurs",
            "Liste de vos prestations et ce qui vous distingue de la concurrence",
            "Textes ou mots-clés par prestation, informations sur l'équipe et l'entreprise",
            "Vos propres photos de l'équipe, des locaux, des produits et des réalisations",
            "Accès au nom de domaine et au fournisseur e-mail",
            "Accès à votre fiche Google Business Profile",
            "Pour un site existant : accès à l'hébergement, au système de gestion de contenu et à la Google Search Console",
            "Deux ou trois sites qui vous plaisent, avec une brève explication",
          ],
        },
      ],
      faq: [
        {
          q: "Combien de temps faut-il pour faire créer un site internet ?",
          a: "Un petit site d'entreprise est souvent en ligne en quelques semaines. Plusieurs langues, de nombreuses pages ou une boutique prolongent le projet. Vous gagnez le plus de temps en fournissant tôt textes, images et accès.",
        },
        {
          q: "Dois-je rédiger moi-même les textes de mon site ?",
          a: "Non. Vous pouvez fournir les textes, donner des mots-clés ou confier la rédaction à l'agence. Votre savoir-faire reste indispensable : personne ne connaît vos prestations et vos clients aussi bien que vous.",
        },
        {
          q: "Pourrai-je modifier mon site moi-même ?",
          a: "Oui, s'il est réalisé avec un système de gestion de contenu. Clarifiez avant de signer quels contenus vous pourrez modifier vous-même et si une courte prise en main est incluse.",
        },
        {
          q: "De quoi ai-je besoin pour lancer un projet web ?",
          a: "Pour le premier entretien, vos objectifs et une idée des personnes que vous voulez atteindre suffisent. Le logo, les textes, les photos et les accès au domaine sont nécessaires au fil du projet. La checklist de cet article montre ce qu'il faut.",
        },
        {
          q: "Le nom de domaine m'appartient-il ou appartient-il à l'agence ?",
          a: "Le nom de domaine doit toujours être enregistré au nom de votre entreprise, même si l'agence le gère techniquement. Vous restez ainsi indépendant si vous changez un jour de prestataire.",
        },
      ],
    },
  },
};
