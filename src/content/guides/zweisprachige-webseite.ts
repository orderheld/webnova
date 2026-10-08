import type { Guide } from "../types";

export const zweisprachigeWebseite: Guide = {
  key: "zweisprachige-webseite",
  date: "2026-10-08",
  readingMinutes: 8,
  related: ["webdesign", "seo", "website-redesign"],
  cities: ["biel", "grenchen", "solothurn", "bern"],
  content: {
    de: {
      slug: "zweisprachige-webseite-deutsch-franzoesisch",
      meta: {
        title: "Zweisprachige Webseite Deutsch/Französisch",
        description:
          "Webseite auf Deutsch und Französisch: Struktur, URLs, hreflang, Übersetzung und lokales SEO für KMU in zweisprachigen Regionen der Schweiz.",
      },
      h1: "Zweisprachige Webseite auf Deutsch und Französisch: so gelingt sie",
      lead: "In der Schweiz endet die Kundschaft selten an der Sprachgrenze. Eine Webseite auf Deutsch und Französisch öffnet Ihnen einen zweiten Markt, aber nur, wenn beide Versionen technisch sauber umgesetzt und inhaltlich wirklich für ihr Publikum geschrieben sind.",
      sections: [
        {
          h2: "Wann sich eine zweite Sprache lohnt",
          paragraphs: [
            "Eine französische Version lohnt sich, wenn Sie Kundschaft aus der Romandie gewinnen möchten, in einer zweisprachigen Region wie Biel/Bienne oder Fribourg tätig sind oder Ihre Produkte schweizweit verkaufen. Auch Betriebe entlang der Sprachgrenze, etwa am Jurasüdfuss, im Seeland oder im Raum Bern, haben oft mehr französischsprachige Anfragen, als sie denken.",
            "Wichtig ist die Frage, ob Sie Anfragen in der zweiten Sprache auch bedienen können. Wer eine französische Webseite anbietet, sollte E-Mails, Telefonate und Offerten auf Französisch beantworten können. Sonst entsteht eine Erwartung, die im Kontakt enttäuscht wird.",
          ],
        },
        {
          h2: "Die richtige Struktur: eigene URLs pro Sprache",
          paragraphs: [
            "Für Google muss jede Sprachversion unter einer eigenen Adresse erreichbar sein. Bewährt haben sich Unterverzeichnisse wie /de/ und /fr/ auf derselben Domain. So profitieren beide Sprachen von der Stärke Ihrer Domain, und die Pflege bleibt einfach. Lösungen, bei denen die Sprache nur per Knopf im Browser umgeschaltet wird und die Adresse gleich bleibt, kann Google nicht korrekt indexieren.",
            "Übersetzen Sie auch die Adressen selbst. Eine französische Seite unter /fr/creation-site-internet ist für französischsprachige Suchende verständlicher als /fr/webdesign. Leiten Sie Besucherinnen und Besucher nicht automatisch anhand ihres Standorts um. Bieten Sie stattdessen einen gut sichtbaren Sprachwechsel an, der direkt auf die entsprechende Seite in der anderen Sprache führt, nicht auf die Startseite.",
          ],
          bullets: [
            "Unterverzeichnisse /de/ und /fr/ auf einer Domain",
            "Übersetzte URLs (Slugs) pro Sprache",
            "Sprachwechsel auf die gleichwertige Seite",
            "Keine automatische Umleitung nach IP-Adresse",
          ],
        },
        {
          h2: "hreflang und Canonical: technische Pflicht",
          paragraphs: [
            "Mit hreflang-Angaben teilen Sie Google mit, welche Seiten inhaltlich zusammengehören und für welche Sprache und Region sie bestimmt sind, zum Beispiel de-CH und fr-CH. Ergänzt um x-default für Besucher ohne passende Sprache. Jede Seite verweist dabei auf sich selbst und auf ihre Gegenstücke. Fehlen diese Angaben, zeigt Google unter Umständen die falsche Sprachversion an.",
            "Jede Sprachversion braucht zudem ein Canonical auf sich selbst, nicht auf die deutsche Version. Auch Sitemap, Titel, Meta-Beschreibungen, Bild-Alternativtexte, strukturierte Daten und Vorschaubilder für WhatsApp oder LinkedIn sollten pro Sprache vorhanden sein. Bei Webnova ist das in jedem [Webdesign-Projekt](service:webdesign) Standard.",
          ],
        },
        {
          h2: "Übersetzen oder neu schreiben?",
          paragraphs: [
            "Maschinelle Übersetzungen sind ein guter Startpunkt, ersetzen aber keine Überarbeitung. Französischsprachige Kundinnen und Kunden merken schnell, ob ein Text für sie geschrieben oder nur übertragen wurde. Achten Sie auf Schweizer Begriffe und Gepflogenheiten: In der Romandie sagt man «septante» und «nonante», spricht von «devis» statt «Offerte» und erwartet eine höfliche, eher formelle Ansprache.",
            "Auch die Suchbegriffe unterscheiden sich. Wer auf Deutsch «Webseite erstellen lassen» sucht, tippt auf Französisch eher «création site internet» oder «agence web». Eine kurze Keyword-Recherche pro Sprache zeigt, welche Begriffe Ihre Kundschaft tatsächlich verwendet. Diese gehören in Titel, Überschriften und Texte der jeweiligen Version.",
          ],
          bullets: [
            "Schweizer Französisch statt Frankreich-Französisch",
            "Eigene Keyword-Recherche pro Sprache",
            "Rechtstexte wie Impressum und Datenschutz in beiden Sprachen",
            "Formulare, Fehlermeldungen und E-Mails ebenfalls übersetzt",
          ],
        },
        {
          h2: "Lokales SEO in beiden Sprachen",
          paragraphs: [
            "Viele Orte haben zwei Namen: Biel und Bienne, Grenchen und Granges, Solothurn und Soleure, Bern und Berne. Verwenden Sie in jeder Sprachversion den Namen, den die jeweilige Kundschaft sucht. In Biel/Bienne lohnt es sich, beide Formen zu nennen, weil in der Stadt in beiden Sprachen gesucht wird.",
            "Ergänzen Sie Ihr Google-Unternehmensprofil um Beiträge in beiden Sprachen und beantworten Sie Bewertungen in der Sprache, in der sie verfasst wurden. Einträge in Verzeichnissen wie local.ch und search.ch sollten in beiden Sprachen korrekt sein. Mehr dazu im Ratgeber [Google-Unternehmensprofil optimieren](guide:google-unternehmensprofil).",
          ],
        },
        {
          h2: "Bestehende Webseite um Französisch erweitern",
          paragraphs: [
            "Haben Sie bereits eine deutschsprachige Webseite, lässt sich eine französische Version oft ergänzen, ohne alles neu zu bauen. Voraussetzung ist ein System, das mehrere Sprachen sauber verwaltet. Ist das nicht der Fall, ist die Erweiterung ein guter Anlass für ein [Website-Redesign](service:website-redesign). Beginnen Sie mit den wichtigsten Seiten: Startseite, Hauptleistungen, Kontakt und Rechtliches.",
            "Wir setzen zweisprachige Webseiten seit Jahren um und arbeiten selbst auf Deutsch und Französisch. Unternehmen in [Biel/Bienne](city:biel), [Grenchen](city:grenchen), [Solothurn](city:solothurn), [Bern](city:bern) und in der ganzen Schweiz beraten wir gerne in einem kostenlosen Erstgespräch, in der Sprache Ihrer Wahl.",
          ],
        },
      ],
      faq: [
        {
          q: "Reicht ein Übersetzungs-Plugin für eine zweisprachige Webseite?",
          a: "Für die Darstellung manchmal, für Google oft nicht. Entscheidend ist, dass jede Sprache eigene, indexierbare URLs mit hreflang-Angaben hat und die Texte von Menschen überarbeitet werden.",
        },
        {
          q: "Brauche ich zwei Domains wie .ch und eine französische Domain?",
          a: "Nein. Für KMU ist eine Domain mit Unterverzeichnissen wie /de/ und /fr/ meist die beste Lösung. Sie ist einfacher zu pflegen und bündelt die Stärke der Domain.",
        },
        {
          q: "Müssen alle Seiten in beiden Sprachen vorhanden sein?",
          a: "Idealerweise ja. Wenn Sie schrittweise vorgehen, starten Sie mit den wichtigsten Seiten und verlinken nur auf Übersetzungen, die tatsächlich existieren. Leere oder halb übersetzte Seiten schaden mehr, als sie nützen.",
        },
        {
          q: "Welche Sprache soll die Standardsprache sein?",
          a: "Die Sprache der Mehrheit Ihrer Kundschaft. Sie wird als x-default hinterlegt und dient Besucherinnen und Besuchern, für die keine passende Sprachversion existiert.",
        },
      ],
    },
    fr: {
      slug: "site-bilingue-francais-allemand",
      meta: {
        title: "Site internet bilingue français-allemand",
        description:
          "Site en français et en allemand : structure, URL, hreflang, traduction et référencement local pour les PME des régions bilingues de Suisse.",
      },
      h1: "Site internet bilingue français-allemand : les clés de la réussite",
      lead: "En Suisse, la clientèle s'arrête rarement à la frontière linguistique. Un site en français et en allemand vous ouvre un second marché, à condition que les deux versions soient techniquement propres et vraiment rédigées pour leur public.",
      sections: [
        {
          h2: "Quand une deuxième langue vaut la peine",
          paragraphs: [
            "Une version allemande est utile si vous souhaitez toucher une clientèle alémanique, si vous êtes actif dans une région bilingue comme Bienne ou Fribourg, ou si vous vendez dans toute la Suisse. Les entreprises proches de la frontière linguistique, par exemple au pied du Jura, dans le Seeland ou autour de Berne, reçoivent souvent plus de demandes en allemand qu'elles ne le pensent.",
            "Demandez-vous aussi si vous pouvez traiter les demandes dans la deuxième langue. Proposer un site en allemand crée l'attente de réponses, d'appels et de devis en allemand. Sans cela, la déception arrive au premier contact.",
          ],
        },
        {
          h2: "La bonne structure : une URL par langue",
          paragraphs: [
            "Pour Google, chaque version linguistique doit avoir sa propre adresse. Les sous-répertoires comme /fr/ et /de/ sur le même domaine ont fait leurs preuves : les deux langues profitent de la force du domaine et la maintenance reste simple. Les solutions où la langue change via un bouton sans que l'adresse change ne peuvent pas être indexées correctement.",
            "Traduisez aussi les adresses. Une page sous /fr/creation-site-internet est plus parlante pour un internaute francophone que /fr/webdesign. Ne redirigez pas automatiquement les visiteurs selon leur localisation. Proposez plutôt un sélecteur de langue bien visible qui mène directement à la page équivalente dans l'autre langue, pas à la page d'accueil.",
          ],
          bullets: [
            "Sous-répertoires /fr/ et /de/ sur un seul domaine",
            "URL (slugs) traduites pour chaque langue",
            "Sélecteur de langue vers la page équivalente",
            "Pas de redirection automatique selon l'adresse IP",
          ],
        },
        {
          h2: "hreflang et canonical : l'indispensable technique",
          paragraphs: [
            "Les balises hreflang indiquent à Google quelles pages vont ensemble et à quelle langue et région elles s'adressent, par exemple fr-CH et de-CH, complétées par x-default pour les autres visiteurs. Chaque page renvoie à elle-même et à ses équivalents. Sans ces indications, Google risque d'afficher la mauvaise version.",
            "Chaque version doit aussi avoir une balise canonical vers elle-même, et non vers la version allemande. Sitemap, titres, méta-descriptions, textes alternatifs des images, données structurées et images d'aperçu pour WhatsApp ou LinkedIn doivent exister dans chaque langue. Chez Webnova, c'est la norme dans chaque [projet de création de site](service:webdesign).",
          ],
        },
        {
          h2: "Traduire ou réécrire ?",
          paragraphs: [
            "La traduction automatique est un bon point de départ, mais ne remplace pas une relecture. Les lecteurs remarquent vite si un texte a été écrit pour eux ou simplement transposé. En Suisse romande, on attend « septante » et « nonante », un « devis » plutôt qu'une « offre » et un ton poli. Côté alémanique, on demande une « Offerte » et on écrit en allemand de Suisse.",
            "Les mots-clés diffèrent aussi. Qui cherche « création site internet » en français tape plutôt « Webseite erstellen lassen » en allemand. Une courte recherche de mots-clés par langue montre les termes réellement utilisés par votre clientèle. Ils doivent figurer dans les titres, intertitres et textes de chaque version.",
          ],
          bullets: [
            "Français de Suisse plutôt que de France",
            "Recherche de mots-clés propre à chaque langue",
            "Mentions légales et protection des données dans les deux langues",
            "Formulaires, messages d'erreur et e-mails traduits",
          ],
        },
        {
          h2: "Le référencement local dans les deux langues",
          paragraphs: [
            "Beaucoup de localités ont deux noms : Bienne et Biel, Granges et Grenchen, Soleure et Solothurn, Berne et Bern. Utilisez dans chaque version le nom que recherche la clientèle concernée. À Bienne, il est utile de mentionner les deux formes, car on y cherche dans les deux langues.",
            "Publiez dans votre fiche Google dans les deux langues et répondez aux avis dans la langue de leur auteur. Vos inscriptions sur local.ch et search.ch doivent être correctes dans les deux langues. Pour aller plus loin, lisez notre article [Optimiser sa fiche Google Business Profile](guide:google-unternehmensprofil).",
          ],
        },
        {
          h2: "Ajouter l'allemand à un site existant",
          paragraphs: [
            "Si vous avez déjà un site en français, une version allemande peut souvent être ajoutée sans tout reconstruire. Il faut pour cela un système qui gère proprement plusieurs langues. Si ce n'est pas le cas, c'est une bonne occasion pour une [refonte de site](service:website-redesign). Commencez par les pages essentielles : accueil, prestations principales, contact et mentions légales.",
            "Nous réalisons des sites bilingues depuis des années et travaillons nous-mêmes en français et en allemand. Nous conseillons volontiers les entreprises de [Bienne](city:biel), [Granges](city:grenchen), [Soleure](city:solothurn), [Berne](city:bern) et de toute la Suisse lors d'un premier entretien gratuit, dans la langue de votre choix.",
          ],
        },
      ],
      faq: [
        {
          q: "Un plugin de traduction suffit-il pour un site bilingue ?",
          a: "Pour l'affichage parfois, pour Google souvent pas. L'essentiel est que chaque langue ait ses propres URL indexables avec des balises hreflang et que les textes soient relus par des humains.",
        },
        {
          q: "Faut-il deux noms de domaine ?",
          a: "Non. Pour une PME, un seul domaine avec des sous-répertoires comme /fr/ et /de/ est généralement la meilleure solution, plus simple à entretenir et plus fort pour le référencement.",
        },
        {
          q: "Toutes les pages doivent-elles exister dans les deux langues ?",
          a: "Idéalement oui. Si vous avancez par étapes, commencez par les pages principales et ne liez que des traductions existantes. Des pages vides ou à moitié traduites nuisent plus qu'elles n'aident.",
        },
        {
          q: "Quelle langue choisir par défaut ?",
          a: "Celle de la majorité de votre clientèle. Elle est définie comme x-default et s'affiche aux visiteurs pour lesquels aucune version adaptée n'existe.",
        },
      ],
    },
  },
};
