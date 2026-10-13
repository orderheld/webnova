import type { Service } from "../types";
import { costAnswer } from "../pricing";

// Setup and care of the Google Business Profile as a service of its own (Ferhat, 2026-10-12:
// "google business einträge aufsetzen, günstig und schnell mit betreuung"). Local SEO stays the broader service.
export const googleProfil: Service = {
  key: "google-profil",
  group: "marketing",
  icon: "pin",
  related: ["local-seo", "webdesign", "seo"],
  content: {
    de: {
      slug: "google-unternehmensprofil",
      navLabel: "Google-Unternehmensprofil",
      meta: {
        title: "Google-Unternehmensprofil einrichten lassen",
        description:
          "Wir richten Ihr Google-Unternehmensprofil ein: rasch, günstig und auf Wunsch mit Betreuung. In Google Maps gefunden und angerufen werden. Jetzt anfragen.",
      },
      eyebrow: "Rasch eingerichtet, günstig und betreut",
      h1: "Google-Unternehmensprofil einrichten lassen",
      lead:
        "Wer Ihren Betrieb sucht, sieht zuerst Ihr Google-Profil: Öffnungszeiten, Telefonnummer, Route und Bewertungen. Wir richten es vollständig für Sie ein, begleiten die Bestätigung bei Google und halten es auf Wunsch laufend aktuell.",
      features: [
        {
          title: "Profil einrichten oder übernehmen",
          text: "Wir legen ein neues Profil an oder übernehmen ein bestehendes, auch wenn es jemand anders erstellt hat. Doppelte Einträge bereinigen wir.",
        },
        {
          title: "Bestätigung bei Google",
          text: "Wir begleiten die Verifizierung Schritt für Schritt, bis Ihr Profil öffentlich in Google Maps und in der Suche erscheint.",
        },
        {
          title: "Vollständige Angaben",
          text: "Kategorien, Leistungen, Beschreibung, Öffnungszeiten mit Feiertagen, Einzugsgebiet und ein Link auf die passende Seite Ihrer Webseite.",
        },
        {
          title: "Logo und Fotos",
          text: "Logo, Titelbild und Fotos Ihres Betriebs in der richtigen Grösse. Auf Wunsch helfen wir bei der Auswahl.",
        },
        {
          title: "Bewertungen mit System",
          text: "Ein Kurzlink zu Ihrem Bewertungsformular und fertige Texte, mit denen Sie Kundschaft um eine Bewertung bitten, dazu Vorlagen für Antworten.",
        },
        {
          title: "Betreuung auf Wunsch",
          text: "Regelmässige Beiträge, Antworten auf Bewertungen, Pflege der Öffnungszeiten und eine kurze Auswertung jeden Monat.",
        },
      ],
      problemsTitle: "Kennen Sie das?",
      problems: [
        {
          title: "Nicht in Google Maps zu finden",
          text: "Wer nach Ihrer Leistung in Ihrer Region sucht, sieht in der Karte drei Mitbewerber, aber nicht Ihren Betrieb.",
        },
        {
          title: "Ein Profil, auf das niemand Zugriff hat",
          text: "Ein früherer Mitarbeiter, eine Agentur oder Google selbst hat das Profil angelegt. Telefonnummer oder Öffnungszeiten stimmen nicht, und niemand kann sie ändern.",
        },
        {
          title: "Im Alltag bleibt es liegen",
          text: "Das Profil wäre schnell gepflegt, aber es fehlt die Zeit. Fotos sind veraltet, Bewertungen bleiben unbeantwortet.",
        },
        {
          title: "Die Firma ist neu gegründet",
          text: "Sie sind frisch im Handelsregister eingetragen. Jetzt entscheidet sich, ob die ersten Kundinnen und Kunden Sie online finden.",
        },
      ],
      benefitsTitle: "Was Ihnen ein gepflegtes Profil bringt",
      benefits: [
        {
          title: "Gefunden, wo gesucht wird",
          text: "Bei Suchen mit Ortsbezug zeigt Google die Karte mit lokalen Betrieben ganz oben, noch vor den übrigen Ergebnissen.",
        },
        {
          title: "Kontakt mit einem Tipp",
          text: "Anrufen, Route planen oder die Webseite öffnen: Interessierte erreichen Sie direkt aus dem Profil, ohne Umweg über Anzeigen.",
        },
        {
          title: "Vertrauen durch echte Bewertungen",
          text: "Bewertungen und sachliche Antworten zeigen, wie Sie arbeiten. Das gibt bei der Wahl zwischen mehreren Anbietern oft den Ausschlag.",
        },
        {
          title: "Bei Google kostenlos",
          text: "Das Profil selbst kostet nichts. Sie bezahlen nur die Einrichtung durch uns und, falls gewünscht, die Betreuung.",
        },
      ],
      process: [
        {
          title: "Kurzes Gespräch",
          text: "Wir klären am Telefon, was Sie anbieten, wo Sie tätig sind und ob es schon ein Profil gibt.",
        },
        {
          title: "Angaben und Fotos",
          text: "Sie schicken uns Logo, Fotos und Öffnungszeiten, gerne per WhatsApp. Den Rest erledigen wir.",
        },
        {
          title: "Einrichtung",
          text: "Wir legen das Profil an oder übernehmen es und füllen alle Felder vollständig und einheitlich aus.",
        },
        {
          title: "Bestätigung",
          text: "Wir begleiten die Verifizierung bei Google, bis Ihr Profil öffentlich sichtbar ist.",
        },
        {
          title: "Betreuung",
          text: "Auf Wunsch halten wir das Profil aktuell, veröffentlichen Beiträge und beantworten Bewertungen in Ihrem Namen.",
        },
      ],
      fit: {
        yes: [
          "Sie haben Kundschaft in Ihrer Region, zum Beispiel als Geschäft, Praxis, Restaurant, Handwerksbetrieb oder Dienstleister.",
          "Ihre Firma ist neu gegründet oder hat noch kein gepflegtes Profil.",
          "Sie möchten, dass jemand das Profil aktuell hält, ohne dass Sie sich darum kümmern müssen.",
        ],
        no: [
          "Sie verkaufen nur online, ohne Kundschaft vor Ort und ohne Einzugsgebiet. Dann sieht Google kein Profil vor.",
          "Sie möchten Bewertungen kaufen oder Standorte eintragen, die es nicht gibt. Das verstösst gegen die Google-Richtlinien.",
          "Sie erwarten einen garantierten ersten Platz in Google Maps. Das kann niemand seriös versprechen.",
        ],
      },
      sections: [
        {
          h2: "Was ein Google-Unternehmensprofil ist",
          paragraphs: [
            "Das Google-Unternehmensprofil, früher Google My Business, ist Ihr Eintrag in Google Maps und im Kartenbereich der Google-Suche. Es zeigt Name, Adresse oder Einzugsgebiet, Telefonnummer, Öffnungszeiten, Fotos, Leistungen und Bewertungen. Für viele Interessierte ist es der erste Kontakt mit Ihrem Betrieb, noch bevor sie Ihre Webseite besuchen.",
            "Bei Google ist das Profil kostenlos. Aufwand entsteht beim Einrichten, bei der Bestätigung und bei der laufenden Pflege. Genau das übernehmen wir, damit Ihr Profil von Anfang an vollständig ist und es auch bleibt.",
          ],
        },
        {
          h2: "So läuft die Bestätigung bei Google ab",
          paragraphs: [
            "Bevor ein neues Profil öffentlich erscheint, will Google sicher sein, dass es Ihren Betrieb wirklich gibt. Je nach Fall verlangt Google dafür ein kurzes Video von Ihrem Standort, einen Code per Telefon oder E-Mail oder eine Postkarte an Ihre Adresse. Welches Verfahren angeboten wird, entscheidet Google.",
            "Wir bereiten alles so vor, dass die Bestätigung beim ersten Versuch klappt: einheitliche Firmendaten, die richtige Kategorie und eine Adresse, die mit Ihrer Beschriftung vor Ort übereinstimmt. Bei einem Video sagen wir Ihnen genau, was darauf zu sehen sein muss.",
          ],
        },
        {
          h2: "Einrichten ist der Anfang: warum sich Pflege lohnt",
          paragraphs: [
            "Ein Profil ist nie ganz fertig. Feiertage ändern die Öffnungszeiten, neue Leistungen kommen dazu, Kundschaft hinterlässt Bewertungen, und Google übernimmt manchmal Änderungsvorschläge von Dritten. Wer das Profil regelmässig prüft und mit Beiträgen aktiv hält, wirkt verlässlich und bleibt sichtbar.",
            "Mit unserer Betreuung kümmern wir uns darum: Beiträge zu Angeboten und Neuigkeiten, Antworten auf Bewertungen, Kontrolle der Angaben und eine kurze Auswertung mit Anrufen, Routenanfragen und Webseiten-Klicks. Wie Sie das Profil selbst optimieren, zeigt unser Ratgeber [Google-Unternehmensprofil optimieren](guide:google-unternehmensprofil). Für die ganze lokale Sichtbarkeit mit Verzeichnissen und Standortseiten gibt es [Local SEO](service:local-seo).",
          ],
        },
        {
          h2: "Ideal für neu gegründete Firmen",
          paragraphs: [
            "Gleich nach der Gründung lohnt sich das Profil besonders: Es ist rasch eingerichtet, kostet bei Google nichts und macht Ihren Betrieb in Google Maps auffindbar, auch wenn die eigene Webseite noch fehlt.",
            "Zusammen mit einer schlanken, professionellen Webseite entsteht ein Auftritt, dem neue Kundschaft vertraut. Beides bekommen Sie bei uns aus einer Hand, mit einem festen Ansprechpartner. Mehr dazu unter [Webdesign](service:webdesign).",
          ],
        },
      ],
      faq: [
        {
          q: "Was kostet ein Google-Unternehmensprofil?",
          a: costAnswer("de", "gbp"),
        },
        {
          q: "Wie lange dauert die Einrichtung?",
          a: "Sobald wir Ihre Angaben und Fotos haben, richten wir das Profil in der Regel innert weniger Arbeitstage ein. Wie lange die Bestätigung durch Google dauert, hängt vom Verfahren ab, das Google wählt.",
        },
        {
          q: "Brauche ich dafür eine Webseite?",
          a: "Nein, ein Profil funktioniert auch ohne Webseite. Mit einer Webseite wirkt es aber vertrauenswürdiger, und Google kann Ihr Angebot besser einordnen. Beides bekommen Sie bei uns aus einer Hand.",
        },
        {
          q: "Es gibt schon ein Profil, aber niemand hat Zugriff. Was nun?",
          a: "Bei Google lässt sich der Zugriff auf ein bestehendes Profil anfordern. Wir begleiten Sie durch diesen Ablauf und bereinigen danach doppelte oder falsche Einträge.",
        },
        {
          q: "Gehört das Profil danach mir?",
          a: "Ja. Das Profil läuft auf Ihr Google-Konto, und Sie behalten die volle Kontrolle. Wir erhalten nur eine Verwaltungsrolle, die Sie jederzeit entfernen können.",
        },
        {
          q: "Was gehört zur Betreuung?",
          a: "Regelmässige Beiträge zu Angeboten und Neuigkeiten, Antworten auf Bewertungen, die Pflege von Öffnungszeiten und Feiertagen, die Kontrolle von Änderungsvorschlägen sowie eine kurze monatliche Auswertung.",
        },
        {
          q: "Arbeiten Sie auch auf Französisch?",
          a: "Ja. Wir richten Profile auf Deutsch und auf Französisch ein und betreuen sie in beiden Sprachen.",
        },
      ],
      ctaTitle: "Ihr Google-Profil, rasch eingerichtet",
      ctaText:
        "Schreiben Sie uns Ihren Firmennamen und Ihren Ort. Wir prüfen, ob es schon ein Profil gibt, und melden uns mit einem klaren Angebot.",
    },
    fr: {
      slug: "fiche-google-business-profile",
      navLabel: "Fiche Google Business Profile",
      meta: {
        title: "Créer votre fiche Google Business Profile",
        description:
          "Nous créons votre fiche Google Business Profile : rapidement, à prix avantageux et avec suivi sur demande. Soyez trouvé et appelé via Google Maps.",
      },
      eyebrow: "Rapide, avantageux et suivi",
      h1: "Créer votre fiche Google Business Profile",
      lead:
        "Quand on cherche votre entreprise, on voit d'abord votre fiche Google : horaires, téléphone, itinéraire et avis. Nous la créons entièrement pour vous, accompagnons la validation par Google et la tenons à jour sur demande.",
      features: [
        {
          title: "Créer ou reprendre la fiche",
          text: "Nous créons une nouvelle fiche ou reprenons une fiche existante, même si quelqu'un d'autre l'a créée. Nous supprimons les doublons.",
        },
        {
          title: "Validation par Google",
          text: "Nous accompagnons la validation pas à pas, jusqu'à ce que votre fiche apparaisse publiquement dans Google Maps et la recherche.",
        },
        {
          title: "Informations complètes",
          text: "Catégories, prestations, description, horaires avec jours fériés, zone desservie et un lien vers la bonne page de votre site.",
        },
        {
          title: "Logo et photos",
          text: "Logo, photo de couverture et photos de votre entreprise au bon format. Sur demande, nous vous aidons à les choisir.",
        },
        {
          title: "Des avis avec méthode",
          text: "Un lien court vers votre formulaire d'avis et des textes prêts à l'emploi pour demander un avis, avec des modèles de réponse.",
        },
        {
          title: "Suivi sur demande",
          text: "Publications régulières, réponses aux avis, mise à jour des horaires et un bref rapport chaque mois.",
        },
      ],
      problemsTitle: "Cela vous parle ?",
      problems: [
        {
          title: "Introuvable dans Google Maps",
          text: "Quand on cherche votre prestation dans votre région, la carte montre trois concurrents, mais pas votre entreprise.",
        },
        {
          title: "Une fiche à laquelle personne n'a accès",
          text: "Un ancien employé, une agence ou Google lui-même a créé la fiche. Le téléphone ou les horaires sont faux, et personne ne peut les modifier.",
        },
        {
          title: "Au quotidien, cela passe après",
          text: "La fiche serait vite à jour, mais le temps manque. Les photos sont anciennes, les avis restent sans réponse.",
        },
        {
          title: "Votre entreprise vient d'être créée",
          text: "Vous venez d'être inscrit au registre du commerce. C'est maintenant que vos premiers clients doivent pouvoir vous trouver en ligne.",
        },
      ],
      benefitsTitle: "Ce qu'une fiche soignée vous apporte",
      benefits: [
        {
          title: "Trouvé là où l'on cherche",
          text: "Pour les recherches locales, Google affiche d'abord la carte avec les entreprises du coin, avant les autres résultats.",
        },
        {
          title: "Le contact en un geste",
          text: "Appeler, planifier un itinéraire ou ouvrir le site : on vous joint directement depuis la fiche, sans passer par la publicité.",
        },
        {
          title: "La confiance par de vrais avis",
          text: "Des avis et des réponses factuelles montrent comment vous travaillez. Cela fait souvent la différence entre plusieurs prestataires.",
        },
        {
          title: "Gratuite chez Google",
          text: "La fiche elle-même ne coûte rien. Vous payez seulement la mise en place par nos soins et, si vous le souhaitez, le suivi.",
        },
      ],
      process: [
        {
          title: "Bref entretien",
          text: "Par téléphone, nous clarifions ce que vous proposez, où vous travaillez et si une fiche existe déjà.",
        },
        {
          title: "Informations et photos",
          text: "Vous nous envoyez logo, photos et horaires, volontiers par WhatsApp. Nous nous occupons du reste.",
        },
        {
          title: "Mise en place",
          text: "Nous créons ou reprenons la fiche et remplissons tous les champs de façon complète et cohérente.",
        },
        {
          title: "Validation",
          text: "Nous accompagnons la validation par Google jusqu'à ce que votre fiche soit visible publiquement.",
        },
        {
          title: "Suivi",
          text: "Sur demande, nous tenons la fiche à jour, publions des actualités et répondons aux avis en votre nom.",
        },
      ],
      fit: {
        yes: [
          "Vous avez une clientèle dans votre région, par exemple comme commerce, cabinet, restaurant, artisan ou prestataire de services.",
          "Votre entreprise vient d'être créée ou n'a pas encore de fiche soignée.",
          "Vous souhaitez que quelqu'un tienne la fiche à jour sans devoir vous en occuper.",
        ],
        no: [
          "Vous vendez uniquement en ligne, sans clientèle sur place ni zone desservie. Google ne prévoit alors pas de fiche.",
          "Vous voulez acheter des avis ou inscrire des adresses qui n'existent pas. C'est contraire aux règles de Google.",
          "Vous attendez une première place garantie dans Google Maps. Personne ne peut le promettre sérieusement.",
        ],
      },
      sections: [
        {
          h2: "Qu'est-ce qu'une fiche Google Business Profile ?",
          paragraphs: [
            "La fiche Google Business Profile, autrefois Google My Business, est votre présence dans Google Maps et dans la carte de la recherche Google. Elle montre nom, adresse ou zone desservie, téléphone, horaires, photos, prestations et avis. Pour beaucoup de clients potentiels, c'est le premier contact avec votre entreprise, avant même votre site.",
            "Chez Google, la fiche est gratuite. Le travail se situe dans la mise en place, la validation et l'entretien régulier. C'est exactement ce dont nous nous chargeons, pour que votre fiche soit complète dès le départ et le reste.",
          ],
        },
        {
          h2: "Comment se passe la validation par Google",
          paragraphs: [
            "Avant qu'une nouvelle fiche soit publique, Google veut s'assurer que votre entreprise existe vraiment. Selon le cas, Google demande une courte vidéo de vos locaux, un code par téléphone ou par e-mail, ou une carte postale envoyée à votre adresse. C'est Google qui décide de la méthode proposée.",
            "Nous préparons tout pour que la validation réussisse du premier coup : des données cohérentes, la bonne catégorie et une adresse qui correspond à l'enseigne sur place. Pour une vidéo, nous vous indiquons précisément ce qu'elle doit montrer.",
          ],
        },
        {
          h2: "La mise en place n'est qu'un début : pourquoi l'entretien compte",
          paragraphs: [
            "Une fiche n'est jamais tout à fait terminée. Les jours fériés modifient les horaires, de nouvelles prestations s'ajoutent, les clients laissent des avis, et Google reprend parfois des suggestions de modification de tiers. Une fiche contrôlée régulièrement et animée par des publications inspire confiance et reste visible.",
            "Avec notre suivi, nous nous en chargeons : publications sur vos offres et nouveautés, réponses aux avis, contrôle des informations et un bref rapport avec appels, demandes d'itinéraire et clics vers le site. Pour optimiser la fiche vous-même, lisez notre guide [Optimiser sa fiche Google Business Profile](guide:google-unternehmensprofil). Pour toute la visibilité locale, avec annuaires et pages locales, voyez le [référencement local](service:local-seo).",
          ],
        },
        {
          h2: "Idéal pour les entreprises nouvellement créées",
          paragraphs: [
            "Juste après la création, la fiche vaut particulièrement la peine : elle est vite en place, ne coûte rien chez Google et rend votre entreprise trouvable dans Google Maps, même si votre site n'existe pas encore.",
            "Avec un site simple et professionnel, vous obtenez une présence à laquelle les nouveaux clients font confiance. Nous réalisons les deux pour vous, avec un seul interlocuteur. Plus d'informations sur notre page [Création de site internet](service:webdesign).",
          ],
        },
      ],
      faq: [
        {
          q: "Combien coûte une fiche Google Business Profile ?",
          a: costAnswer("fr", "gbp"),
        },
        {
          q: "Combien de temps dure la mise en place ?",
          a: "Dès que nous avons vos informations et vos photos, nous créons la fiche en général en quelques jours ouvrables. La durée de la validation par Google dépend de la méthode choisie par Google.",
        },
        {
          q: "Ai-je besoin d'un site internet ?",
          a: "Non, une fiche fonctionne aussi sans site. Avec un site, elle inspire toutefois plus confiance et Google comprend mieux votre offre. Nous réalisons les deux pour vous, avec un seul interlocuteur.",
        },
        {
          q: "Une fiche existe déjà, mais personne n'y a accès. Que faire ?",
          a: "Google permet de demander l'accès à une fiche existante. Nous vous accompagnons dans cette démarche puis supprimons les doublons et les informations erronées.",
        },
        {
          q: "La fiche m'appartient-elle ensuite ?",
          a: "Oui. La fiche est liée à votre compte Google et vous en gardez le contrôle total. Nous recevons seulement un rôle de gestion que vous pouvez retirer à tout moment.",
        },
        {
          q: "Que comprend le suivi ?",
          a: "Des publications régulières sur vos offres et nouveautés, les réponses aux avis, la mise à jour des horaires et jours fériés, le contrôle des suggestions de modification et un bref rapport mensuel.",
        },
        {
          q: "Travaillez-vous aussi en allemand ?",
          a: "Oui. Nous créons des fiches en français et en allemand et les suivons dans les deux langues.",
        },
      ],
      ctaTitle: "Votre fiche Google, vite en place",
      ctaText:
        "Indiquez-nous le nom et la localité de votre entreprise. Nous vérifions si une fiche existe déjà et revenons vers vous avec une offre claire.",
    },
  },
};
