import type { Guide } from "../types";

export const kmuWebseiteCheckliste: Guide = {
  key: "kmu-webseite-checkliste",
  date: "2026-10-07",
  readingMinutes: 8,
  related: ["webdesign", "seo", "wartung"],
  relatedGuides: ["webagentur-unterschied", "barrierefreie-website", "lokales-seo-kmu"],
  cities: ["bern", "biel", "solothurn", "grenchen"],
  content: {
    de: {
      slug: "was-eine-kmu-webseite-braucht",
      meta: {
        title: "Was eine KMU- und Handwerker-Webseite braucht",
        description:
          "Checkliste für KMU und Handwerksbetriebe: Inhalte, Kontaktwege, Vertrauen, Recht und Technik, die eine Webseite für mehr Anfragen braucht.",
      },
      h1: "Was eine Webseite für KMU und Handwerksbetriebe wirklich braucht",
      lead: "Eine gute KMU-Webseite muss nicht gross sein. Sie muss in wenigen Sekunden zeigen, was Sie anbieten, wo Sie arbeiten und wie man Sie erreicht. Diese Checkliste fasst zusammen, worauf es für mehr Anfragen ankommt.",
      keyTakeaways: [
        "Die Startseite beantwortet sofort: was Sie machen, für wen und in welcher Region.",
        "Jede wichtige Leistung verdient eine eigene Seite mit Ablauf, Fotos und häufigen Fragen.",
        "Telefon, E-Mail und WhatsApp sollten auf jeder Seite mit einem Klick erreichbar sein, das Formular kurz.",
        "Echte Personen, Fotos, Bewertungen und ein aktuelles Impressum schaffen Vertrauen.",
        "Datenschutzerklärung, HTTPS, schnelle Ladezeiten und regelmässige Updates gehören zur Pflicht.",
      ],
      sections: [
        {
          h2: "Klare Botschaft auf der Startseite",
          paragraphs: [
            "Besucherinnen und Besucher entscheiden in wenigen Sekunden, ob sie bleiben. Die Startseite sollte deshalb oben sofort beantworten: Was machen Sie, für wen und in welcher Region? «Sanitär und Heizung für Privatkunden und Verwaltungen» sagt mehr als «Willkommen auf unserer Webseite». Darunter gehört ein deutlicher nächster Schritt, etwa «Offerte anfragen» oder «Jetzt anrufen».",
            "Vermeiden Sie lange Firmengeschichten am Anfang. Sie sind wertvoll, gehören aber auf die Seite «Über uns». Auf der Startseite zählen Leistungen, Nutzen für die Kundschaft und Vertrauen. Eine ruhige Gestaltung mit viel Weissraum und gut lesbarer Schrift hilft, dass diese Punkte auch auf dem Smartphone ankommen.",
          ],
        },
        {
          h2: "Eine Seite pro Leistung",
          paragraphs: [
            "Statt alle Leistungen auf einer Seite aufzulisten, verdient jede wichtige Leistung eine eigene Unterseite. Ein Schreiner, der Küchen, Einbauschränke und Reparaturen anbietet, braucht drei Seiten mit eigener Überschrift, Beschreibung, Fotos und häufigen Fragen. So versteht Google, wofür Sie gefunden werden sollen, und Suchende landen direkt auf dem passenden Angebot.",
            "Beschreiben Sie auf jeder Leistungsseite konkret, was enthalten ist, wie der Ablauf aussieht und für wen die Leistung passt. Fotos eigener Arbeiten wirken stärker als jede Beschreibung. Ergänzen Sie, in welchen Orten Sie diese Leistung anbieten. Ein Einzugsgebiet mit Gemeindenamen ist für lokale Suchen sehr hilfreich.",
          ],
          bullets: [
            "Eigene Seite für jede Hauptleistung",
            "Konkrete Beschreibung, Ablauf und Zielgruppe",
            "Fotos eigener Arbeiten statt Stockbilder",
            "Einzugsgebiet mit Gemeinden und Regionen",
          ],
        },
        {
          h2: "Kontakt in einem Klick",
          paragraphs: [
            "Die meisten Besucherinnen und Besucher von Handwerker- und Dienstleisterseiten sind mit dem Smartphone unterwegs. Telefonnummer und E-Mail-Adresse sollten deshalb auf jeder Seite anklickbar sein, idealerweise auch ein WhatsApp-Link. Ein kurzes Anfrageformular mit wenigen Pflichtfeldern senkt die Hürde zusätzlich, besonders ausserhalb der Bürozeiten.",
            "Fragen Sie im Formular nur, was Sie für eine erste Einschätzung wirklich brauchen: Name, Kontakt, Ort, Art der Arbeit und eventuell ein Foto. Jedes zusätzliche Pflichtfeld kostet Anfragen. Nach dem Absenden sollte eine klare Bestätigung erscheinen, wann Sie sich melden.",
          ],
          bullets: [
            "Klickbare Telefonnummer und E-Mail auf jeder Seite",
            "WhatsApp-Link für schnelle Fragen",
            "Kurzes Formular mit Foto-Upload",
            "Öffnungszeiten und Adresse gut sichtbar",
          ],
        },
        {
          h2: "Vertrauen aufbauen",
          paragraphs: [
            "Bei Handwerks- und Dienstleistungsbetrieben kaufen Menschen Vertrauen. Zeigen Sie die Personen hinter dem Betrieb mit Namen und Foto, Ihre Ausbildung und Zertifizierungen, Verbandsmitgliedschaften und echte Projekte. Echte Kundenbewertungen, zum Beispiel aus Ihrem Google-Unternehmensprofil, sind ein starkes Argument, sofern sie nicht erfunden oder geschönt sind.",
            "Auch kleine Details schaffen Vertrauen: eine Schweizer Telefonnummer, eine vollständige Adresse, ein aktuelles Impressum und eine Webseite, die gepflegt aussieht. Eine veraltete Seite mit Hinweisen aus vergangenen Jahren wirkt dagegen schnell wie ein Betrieb, der nicht mehr aktiv ist.",
          ],
        },
        {
          h2: "Recht und Datenschutz",
          paragraphs: [
            "Jede geschäftliche Webseite in der Schweiz braucht ein Impressum mit Firmenname, Adresse und Kontakt. Seit dem revidierten Datenschutzgesetz ist zudem eine Datenschutzerklärung nötig, sobald Personendaten bearbeitet werden, etwa über ein Kontaktformular, eingebettete Karten oder Analyse-Tools. Sie muss beschreiben, welche Daten zu welchem Zweck bearbeitet werden und an wen sie gehen.",
            "Setzen Sie Analyse- und Werbe-Tools sparsam ein und prüfen Sie, ob ein Cookie-Hinweis nötig ist, besonders wenn Sie auch Kundschaft aus der EU ansprechen. Bilder und Texte müssen Ihnen gehören oder lizenziert sein. Übernommene Fotos aus dem Internet führen immer wieder zu teuren Lizenzforderungen.",
          ],
        },
        {
          h2: "Technik, die man nicht sieht",
          paragraphs: [
            "Eine Webseite muss auf dem Smartphone schnell laden, sicher per HTTPS erreichbar sein und regelmässig aktualisiert werden. Langsame Seiten verlieren Besucher und Rankings. Was hinter den Messwerten steckt, erklären wir im Ratgeber [Core Web Vitals verständlich erklärt](guide:core-web-vitals). Für Google sind ausserdem saubere Titel, Beschreibungen und strukturierte Daten wichtig.",
            "Planen Sie die Pflege von Anfang an ein: Updates, Backups und kleine Anpassungen. Mit einem [Wartungsvertrag](service:wartung) bleibt die Seite sicher und aktuell, ohne dass Sie sich darum kümmern müssen. Möchten Sie lokal besser gefunden werden, lesen Sie auch unseren Ratgeber [Lokales SEO für KMU](guide:lokales-seo-kmu).",
          ],
        },
        {
          h2: "Fachkräfte gewinnen über die Webseite",
          paragraphs: [
            "Viele KMU suchen nicht nur Kundschaft, sondern auch Mitarbeitende. Eine eigene Seite für offene Stellen und Lehrstellen mit Einblicken in Team, Werkstatt und Arbeitsalltag wirkt oft mehr als ein Inserat. Bewerbende sollten einfach und ohne lange Formulare Kontakt aufnehmen können.",
            "Wir erstellen Webseiten für KMU und Handwerksbetriebe in der ganzen Schweiz. Ob Neubau mit [Webdesign](service:webdesign) oder Auffrischung einer bestehenden Seite: Persönliche Gespräche führen wir gerne bei Ihnen vor Ort, bei uns im Büro oder per Videocall.",
          ],
        },
      ],
      faq: [
        {
          q: "Wie viele Seiten braucht eine KMU-Webseite?",
          a: "Meist reichen Startseite, eine Seite pro Hauptleistung, Über uns, Referenzen oder Projekte, Kontakt sowie Impressum und Datenschutz. Wichtiger als die Anzahl ist, dass jede Seite eine klare Aufgabe hat.",
        },
        {
          q: "Brauche ich als Handwerker wirklich eine eigene Webseite?",
          a: "Ja. Verzeichnisse und Social Media helfen, gehören Ihnen aber nicht. Die eigene Webseite ist der Ort, auf den Google-Profil, Inserate und Empfehlungen verweisen und auf dem Sie Ihre Leistungen vollständig zeigen.",
        },
        {
          q: "Ist ein Impressum in der Schweiz Pflicht?",
          a: "Für Webseiten, die Waren oder Dienstleistungen anbieten, verlangt das Gesetz gegen den unlauteren Wettbewerb klare Angaben zur Identität und eine Kontaktadresse. Ein Impressum ist deshalb für jede geschäftliche Webseite zu empfehlen.",
        },
        {
          q: "Kann ich die Inhalte später selbst ändern?",
          a: "Ja, mit einem passenden Redaktionssystem und einer kurzen Einführung. Alternativ übernimmt Ihre Agentur Änderungen im Rahmen eines Wartungsvertrags.",
        },
      ],
    },
    fr: {
      slug: "site-internet-pme-artisan",
      meta: {
        title: "Ce dont un site de PME ou d'artisan a besoin",
        description:
          "Checklist pour PME et artisans : contenus, contact, confiance, aspects juridiques et technique pour un site internet qui génère des demandes.",
      },
      h1: "Ce dont un site internet de PME ou d'artisan a vraiment besoin",
      lead: "Un bon site de PME n'a pas besoin d'être grand. Il doit montrer en quelques secondes ce que vous proposez, où vous travaillez et comment vous joindre. Cette checklist résume l'essentiel pour recevoir plus de demandes.",
      keyTakeaways: [
        "La page d'accueil répond immédiatement : ce que vous faites, pour qui et dans quelle région.",
        "Chaque prestation importante mérite sa propre page avec déroulement, photos et questions fréquentes.",
        "Téléphone, e-mail et WhatsApp doivent être accessibles en un clic sur chaque page, et le formulaire rester court.",
        "De vraies personnes, des photos, des avis et des mentions légales à jour inspirent confiance.",
        "Déclaration de confidentialité, HTTPS, chargement rapide et mises à jour régulières sont indispensables.",
      ],
      sections: [
        {
          h2: "Un message clair sur la page d'accueil",
          paragraphs: [
            "Les visiteurs décident en quelques secondes s'ils restent. Le haut de la page d'accueil doit donc répondre immédiatement : que faites-vous, pour qui et dans quelle région ? « Sanitaire et chauffage pour particuliers et gérances » en dit plus que « Bienvenue sur notre site ». Juste en dessous, prévoyez une action claire, comme « Demander un devis » ou « Appeler maintenant ».",
            "Évitez les longs historiques en ouverture. Ils ont leur valeur, mais leur place est sur la page « À propos ». Sur la page d'accueil comptent les prestations, les bénéfices pour le client et la confiance. Une mise en page aérée et une typographie lisible aident à faire passer ces messages, aussi sur smartphone.",
          ],
        },
        {
          h2: "Une page par prestation",
          paragraphs: [
            "Plutôt que de lister toutes les prestations sur une seule page, chaque prestation importante mérite sa propre page. Un menuisier qui propose cuisines, armoires encastrées et réparations a besoin de trois pages avec titre, description, photos et questions fréquentes. Google comprend ainsi pour quoi vous voulez être trouvé, et l'internaute arrive directement sur la bonne offre.",
            "Décrivez concrètement sur chaque page ce qui est inclus, comment se déroule le mandat et à qui la prestation s'adresse. Les photos de vos propres réalisations sont plus convaincantes que toute description. Indiquez aussi les localités où vous proposez cette prestation : une zone d'intervention avec des noms de communes aide beaucoup pour les recherches locales.",
          ],
          bullets: [
            "Une page pour chaque prestation principale",
            "Description concrète, déroulement et public cible",
            "Photos de vos réalisations plutôt que des images de banque",
            "Zone d'intervention avec communes et régions",
          ],
        },
        {
          h2: "Le contact en un clic",
          paragraphs: [
            "La plupart des visiteurs de sites d'artisans et de prestataires sont sur smartphone. Le numéro de téléphone et l'adresse e-mail doivent donc être cliquables sur chaque page, idéalement avec un lien WhatsApp. Un formulaire court avec peu de champs obligatoires abaisse encore la barrière, surtout en dehors des heures de bureau.",
            "Ne demandez que ce qui est nécessaire pour une première évaluation : nom, contact, localité, type de travaux et éventuellement une photo. Chaque champ obligatoire supplémentaire coûte des demandes. Après l'envoi, une confirmation claire doit indiquer quand vous répondrez.",
          ],
          bullets: [
            "Téléphone et e-mail cliquables sur chaque page",
            "Lien WhatsApp pour les questions rapides",
            "Formulaire court avec envoi de photo",
            "Horaires et adresse bien visibles",
          ],
        },
        {
          h2: "Inspirer confiance",
          paragraphs: [
            "Avec un artisan ou un prestataire, on achète de la confiance. Montrez les personnes derrière l'entreprise avec nom et photo, vos formations et certifications, vos associations professionnelles et de vrais projets. De vrais avis clients, par exemple issus de votre fiche Google, sont un argument fort, à condition qu'ils ne soient ni inventés ni embellis.",
            "Les détails comptent aussi : un numéro suisse, une adresse complète, des mentions légales à jour et un site visiblement entretenu. Un site obsolète avec des informations d'il y a plusieurs années donne vite l'impression d'une entreprise inactive.",
          ],
        },
        {
          h2: "Droit et protection des données",
          paragraphs: [
            "Tout site commercial en Suisse a besoin de mentions légales avec raison sociale, adresse et contact. Depuis la révision de la loi sur la protection des données, une déclaration de protection des données est aussi nécessaire dès que des données personnelles sont traitées, par exemple via un formulaire, une carte intégrée ou un outil d'analyse.",
            "Utilisez les outils d'analyse et de publicité avec mesure et vérifiez si un bandeau cookies est nécessaire, notamment si vous visez aussi une clientèle de l'UE. Les images et textes doivent vous appartenir ou être sous licence. Les photos reprises d'internet entraînent régulièrement des réclamations coûteuses.",
          ],
        },
        {
          h2: "La technique invisible",
          paragraphs: [
            "Un site doit charger vite sur smartphone, être sécurisé en HTTPS et mis à jour régulièrement. Les pages lentes perdent des visiteurs et des positions. Nous expliquons ces mesures dans l'article [Core Web Vitals expliqués simplement](guide:core-web-vitals). Pour Google, des titres, descriptions et données structurées soignés sont également importants.",
            "Prévoyez l'entretien dès le départ : mises à jour, sauvegardes et petites adaptations. Avec un [contrat de maintenance](service:wartung), votre site reste sûr et à jour sans que vous ayez à vous en occuper. Pour être mieux trouvé localement, lisez aussi [Référencement local pour PME](guide:lokales-seo-kmu).",
          ],
        },
        {
          h2: "Recruter grâce au site",
          paragraphs: [
            "Beaucoup de PME cherchent non seulement des clients, mais aussi du personnel. Une page dédiée aux postes et places d'apprentissage, avec un aperçu de l'équipe, de l'atelier et du quotidien, a souvent plus d'effet qu'une annonce. Les candidats doivent pouvoir prendre contact simplement, sans long formulaire.",
            "Nous créons des sites pour PME et artisans dans toute la Suisse. Nouveau site avec notre offre de [création de site internet](service:webdesign) ou rafraîchissement d'un site existant : nous vous rencontrons volontiers chez vous, dans nos locaux ou en visioconférence.",
          ],
        },
      ],
      faq: [
        {
          q: "Combien de pages un site de PME doit-il avoir ?",
          a: "En général : accueil, une page par prestation principale, à propos, références ou réalisations, contact ainsi que mentions légales et protection des données. Plus que le nombre, chaque page doit avoir un rôle clair.",
        },
        {
          q: "Un artisan a-t-il vraiment besoin de son propre site ?",
          a: "Oui. Annuaires et réseaux sociaux aident, mais ne vous appartiennent pas. Votre site est l'endroit vers lequel renvoient fiche Google, annonces et recommandations, et où vous présentez vos prestations en entier.",
        },
        {
          q: "Les mentions légales sont-elles obligatoires en Suisse ?",
          a: "Pour les sites qui proposent des biens ou des services, la loi contre la concurrence déloyale exige des indications claires sur l'identité et une adresse de contact. Des mentions légales sont donc recommandées pour tout site commercial.",
        },
        {
          q: "Pourrai-je modifier les contenus moi-même ?",
          a: "Oui, avec un système de gestion de contenu adapté et une courte formation. Votre agence peut aussi effectuer les modifications dans le cadre d'un contrat de maintenance.",
        },
      ],
    },
  },
};
