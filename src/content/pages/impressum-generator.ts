import type { StandalonePage } from "../types";

export const impressumGenerator: StandalonePage = {
  key: "impressum-generator",
  icon: "file",
  services: ["firmenwebsite", "website-kmu", "webdesign"],
  guides: ["kmu-webseite-checkliste", "onlineshop-schweiz", "barrierefreie-website"],
  content: {
    de: {
      slug: "impressum-generator-schweiz",
      navLabel: "Impressum-Generator",
      meta: {
        title: "Impressum-Generator Schweiz: kostenlos",
        description:
          "Impressum für Ihre Schweizer Website kostenlos erstellen: Firma, Adresse, UID, MWST und Kontakt eingeben, Text auf Deutsch oder Französisch kopieren.",
      },
      eyebrow: "Kostenloses Tool",
      h1: "Impressum-Generator Schweiz",
      lead:
        "Erstellen Sie in wenigen Minuten einen Entwurf für das Impressum Ihrer Website, auf Deutsch oder Französisch. Ihre Eingaben bleiben in Ihrem Browser und werden nicht an uns übermittelt.",
      pointsTitle: "Was in ein Schweizer Impressum gehört",
      points: [
        {
          title: "Vollständiger Firmenname",
          text: "So, wie er im Handelsregister eingetragen ist, inklusive Rechtsform. Bei Einzelunternehmen der Name der Inhaberin oder des Inhabers.",
        },
        {
          title: "Postadresse",
          text: "Eine vollständige Adresse mit Strasse, Postleitzahl und Ort. Ein Postfach allein reicht in der Regel nicht.",
        },
        {
          title: "E-Mail-Adresse",
          text: "Ausdrücklich verlangt: eine elektronische Kontaktadresse, über die man Sie direkt erreicht.",
        },
        {
          title: "Empfohlen: weitere Angaben",
          text: "Telefonnummer, Unternehmens-Identifikationsnummer (UID), MWST-Nummer und vertretungsberechtigte Personen schaffen Klarheit und Vertrauen.",
        },
      ],
      stepsTitle: "So nutzen Sie den Generator",
      steps: [
        {
          title: "Angaben eingeben",
          text: "Firmenname, Rechtsform, Adresse, Kontakt und optionale Angaben wie UID, MWST-Nummer oder Hosting.",
        },
        {
          title: "Sprache wählen",
          text: "Der Text wird auf Deutsch oder Französisch erzeugt. Für zweisprachige Websites erstellen Sie beide Versionen.",
        },
        {
          title: "Prüfen und kopieren",
          text: "Kontrollieren Sie die Angaben, kopieren Sie den Text und fügen Sie ihn auf Ihrer Impressum-Seite ein.",
        },
      ],
      sections: [
        {
          h2: "Ist ein Impressum in der Schweiz Pflicht?",
          paragraphs: [
            "Für Unternehmen, die über ihre Website Waren, Werke oder Leistungen anbieten, ja. Grundlage ist das Bundesgesetz gegen den unlauteren Wettbewerb (UWG). Nach Art. 3 Abs. 1 lit. s UWG handelt unlauter, wer im elektronischen Geschäftsverkehr Waren, Werke oder Leistungen anbietet und es dabei unterlässt, klare und vollständige Angaben über seine Identität und seine Kontaktadresse einschliesslich derjenigen der elektronischen Post zu machen.",
            "Das Gesetz verwendet den Begriff «Impressum» nicht und schreibt auch keine bestimmte Form vor. In der Praxis hat sich aber eine eigene, von jeder Seite aus erreichbare Seite mit diesem Namen durchgesetzt, meist verlinkt im Fussbereich der Website. Rein private Websites ohne kommerzielles Angebot fallen nicht unter diese Bestimmung.",
            "Für im Handelsregister eingetragene Unternehmen kommt das Firmenrecht hinzu: Nach Art. 954a des Obligationenrechts (OR) ist die eingetragene Firma in der Korrespondenz, auf Bestellscheinen und Rechnungen sowie in Bekanntmachungen vollständig und unverändert anzugeben. Es ist üblich und empfehlenswert, das auch auf der Website so zu halten.",
          ],
        },
        {
          h2: "Pflichtangaben und empfohlene Angaben",
          paragraphs: [
            "Aus dem UWG ergeben sich als Minimum die Identität des Anbieters und eine Kontaktadresse inklusive E-Mail. Daneben gibt es Angaben, die nicht in jedem Fall ausdrücklich verlangt sind, aber Klarheit schaffen und in der Schweiz üblich sind. Der Generator berücksichtigt beides.",
          ],
          bullets: [
            "Firmenname inklusive Rechtsform, wie im Handelsregister eingetragen",
            "Vollständige Postadresse (Strasse, PLZ, Ort, Land)",
            "E-Mail-Adresse",
            "Telefonnummer (empfohlen)",
            "Vertretungsberechtigte Person(en), zum Beispiel Inhaber, Geschäftsführung oder Verwaltungsrat (empfohlen)",
            "Unternehmens-Identifikationsnummer (UID) im Format CHE-123.456.789 (empfohlen, falls vorhanden)",
            "MWST-Nummer, falls Sie mehrwertsteuerpflichtig sind: UID mit dem Zusatz MWST",
            "Handelsregistereintrag, zum Beispiel «Handelsregister des Kantons Bern» (falls eingetragen)",
          ],
        },
        {
          h2: "Impressum, Datenschutzerklärung und Haftungsausschluss",
          paragraphs: [
            "Das Impressum ersetzt keine Datenschutzerklärung. Sobald Ihre Website Personendaten bearbeitet, etwa über ein Kontaktformular, eingebettete Karten, Schriftarten von Drittanbietern oder eine Statistik, müssen Sie nach dem Datenschutzgesetz (DSG) darüber informieren. Diese Informationen gehören in eine eigene Datenschutzerklärung, die vom Impressum aus und im Fussbereich verlinkt ist.",
            "Viele Schweizer Impressen enthalten zudem einen Haftungsausschluss für Inhalte und Links sowie einen Hinweis zu Urheberrechten. Solche Klauseln sind nicht vorgeschrieben, und ihre rechtliche Wirkung ist begrenzt. Der Generator erzeugt deshalb bewusst nur die Angaben zu Anbieter und Kontakt. Wie wir das auf unserer eigenen Website lösen, sehen Sie in unserem [Impressum](legal:impressum).",
          ],
        },
        {
          h2: "Kundschaft in Deutschland oder der EU",
          paragraphs: [
            "Richtet sich Ihr Angebot gezielt auch an Kundschaft in Deutschland, können die dortigen, strengeren Vorgaben des Digitale-Dienste-Gesetzes (DDG, früher Telemediengesetz) relevant werden. Dazu gehören je nach Fall weitere Angaben wie Registergericht, Registernummer oder Aufsichtsbehörde. Verkaufen Sie online in die EU, kommen weitere Informationspflichten hinzu. In solchen Fällen empfehlen wir eine rechtliche Beratung.",
            "Für Onlineshops gelten in der Schweiz ebenfalls zusätzliche Pflichten, etwa zu den einzelnen Schritten bis zum Vertragsabschluss und zur Bestellbestätigung. Einen Überblick gibt unser Ratgeber [Onlineshop in der Schweiz](guide:onlineshop-schweiz).",
          ],
        },
        {
          h2: "Impressum richtig auf der Website einbinden",
          paragraphs: [
            "Das Impressum sollte von jeder Seite aus mit einem Klick erreichbar sein, üblicherweise über einen Link «Impressum» im Fussbereich. Auf zweisprachigen Websites gehört eine französische Version («Mentions légales») auf die französischsprachigen Seiten. Achten Sie darauf, dass die Angaben mit Ihrem Google-Unternehmensprofil und Ihren Verzeichniseinträgen übereinstimmen. Einheitliche Firmendaten helfen auch bei [Local SEO](service:local-seo).",
            "Sie erstellen gerade eine neue Website oder möchten Ihren Auftritt überarbeiten? Bei einer [Firmenwebsite von Webnova](service:firmenwebsite) sind Impressum und Datenschutzerklärung Teil des Projekts. Und mit dem [kostenlosen Website-Check](page:website-check) sehen wir uns Ihre bestehende Website an.",
          ],
        },
      ],
      faq: [
        {
          q: "Brauche ich als Einzelunternehmen ein Impressum?",
          a: "Ja, sobald Sie über Ihre Website Waren oder Dienstleistungen anbieten. Anzugeben sind Ihr Name beziehungsweise Ihre Firma, Ihre Postadresse und eine E-Mail-Adresse. Ist Ihr Einzelunternehmen im Handelsregister eingetragen, verwenden Sie die eingetragene Firma.",
        },
        {
          q: "Muss die UID im Impressum stehen?",
          a: "Das UWG verlangt die UID nicht ausdrücklich. Sie hilft aber, Ihr Unternehmen eindeutig zu identifizieren, und ist in der Schweiz üblich. Wenn Ihr Unternehmen eine UID hat, empfehlen wir, sie anzugeben.",
        },
        {
          q: "Wie gebe ich die MWST-Nummer an?",
          a: "Die Schweizer MWST-Nummer besteht aus der UID mit dem Zusatz MWST, zum Beispiel CHE-123.456.789 MWST. Auf Französisch lautet der Zusatz TVA.",
        },
        {
          q: "Reicht ein Postfach als Adresse?",
          a: "In der Regel nicht. Die Angaben sollen eine klare Identifikation ermöglichen. Geben Sie deshalb eine vollständige Adresse mit Strasse und Hausnummer an.",
        },
        {
          q: "Ist eine Telefonnummer Pflicht?",
          a: "Ausdrücklich verlangt ist eine E-Mail-Adresse. Eine Telefonnummer ist nicht zwingend, schafft aber Vertrauen und ist für Kundschaft oft der schnellste Weg.",
        },
        {
          q: "Muss der Hosting-Anbieter im Impressum stehen?",
          a: "Nein, das ist in der Schweiz nicht vorgeschrieben. Manche Unternehmen geben ihn trotzdem an. Wichtiger ist, dass Ihre Datenschutzerklärung erwähnt, wo und von wem Daten bearbeitet werden.",
        },
        {
          q: "Brauche ich auf Social Media ein Impressum?",
          a: "Wenn Sie ein Profil geschäftlich nutzen und darüber Leistungen anbieten, ist es sinnvoll, im Profil auf Ihr Impressum zu verlinken oder die wichtigsten Angaben zu nennen.",
        },
        {
          q: "Werden meine Eingaben gespeichert?",
          a: "Nein. Der Generator läuft vollständig in Ihrem Browser. Ihre Eingaben werden nicht an Webnova übermittelt und nicht gespeichert.",
        },
        {
          q: "Ist der erzeugte Text rechtlich geprüft?",
          a: "Nein. Der Generator erstellt einen Entwurf nach bestem Wissen, ersetzt aber keine Rechtsberatung. Prüfen Sie die Angaben und lassen Sie sich in Zweifelsfällen von einer Fachperson beraten.",
        },
      ],
      ctaTitle: "Neue Website mit sauberem Impressum?",
      ctaText: "Bei unseren Projekten gehören Impressum, Datenschutz und SEO dazu. Wir beraten Sie gerne kostenlos.",
    },
    fr: {
      slug: "generateur-mentions-legales-suisse",
      navLabel: "Générateur de mentions légales",
      meta: {
        title: "Générateur de mentions légales Suisse gratuit",
        description:
          "Créez gratuitement les mentions légales de votre site suisse : raison sociale, adresse, IDE, TVA et contact, texte à copier en français ou en allemand.",
      },
      eyebrow: "Outil gratuit",
      h1: "Générateur de mentions légales pour la Suisse",
      lead:
        "Préparez en quelques minutes un projet de mentions légales pour votre site, en français ou en allemand. Vos saisies restent dans votre navigateur et ne nous sont pas transmises.",
      pointsTitle: "Ce que doivent contenir les mentions légales en Suisse",
      points: [
        {
          title: "Raison sociale complète",
          text: "Telle qu'inscrite au registre du commerce, forme juridique comprise. Pour une entreprise individuelle, le nom du ou de la titulaire.",
        },
        {
          title: "Adresse postale",
          text: "Une adresse complète avec rue, NPA et localité. Une case postale seule ne suffit en général pas.",
        },
        {
          title: "Adresse e-mail",
          text: "Exigée expressément : une adresse électronique permettant de vous joindre directement.",
        },
        {
          title: "Recommandé : autres indications",
          text: "Téléphone, numéro IDE, numéro de TVA et personnes habilitées à représenter l'entreprise apportent clarté et confiance.",
        },
      ],
      stepsTitle: "Comment utiliser le générateur",
      steps: [
        {
          title: "Saisir les données",
          text: "Raison sociale, forme juridique, adresse, contact et indications facultatives comme IDE, TVA ou hébergeur.",
        },
        {
          title: "Choisir la langue",
          text: "Le texte est généré en français ou en allemand. Pour un site bilingue, créez les deux versions.",
        },
        {
          title: "Vérifier et copier",
          text: "Contrôlez les données, copiez le texte et collez-le sur votre page de mentions légales.",
        },
      ],
      sections: [
        {
          h2: "Les mentions légales sont-elles obligatoires en Suisse ?",
          paragraphs: [
            "Pour les entreprises qui proposent des marchandises, des œuvres ou des prestations sur leur site, oui. La base est la loi fédérale contre la concurrence déloyale (LCD). Selon l'art. 3, al. 1, let. s LCD, agit de façon déloyale celui qui offre des marchandises, des œuvres ou des prestations dans le commerce électronique sans indiquer de manière claire et complète son identité et son adresse de contact, y compris celle de courrier électronique.",
            "La loi n'emploie pas le terme « mentions légales » et n'impose pas de forme particulière. En pratique, une page dédiée accessible depuis chaque page, souvent liée dans le pied de page, s'est imposée. Les sites purement privés sans offre commerciale ne sont pas visés par cette disposition.",
            "Pour les entreprises inscrites au registre du commerce s'ajoute le droit des raisons de commerce : selon l'art. 954a du Code des obligations (CO), la raison inscrite doit figurer de manière complète et inchangée dans la correspondance, sur les bulletins de commande et les factures ainsi que dans les communications. Il est courant et recommandé de faire de même sur le site.",
          ],
        },
        {
          h2: "Indications obligatoires et recommandées",
          paragraphs: [
            "La LCD exige au minimum l'identité du fournisseur et une adresse de contact, e-mail compris. D'autres indications ne sont pas toujours exigées expressément, mais apportent de la clarté et sont usuelles en Suisse. Le générateur tient compte des deux.",
          ],
          bullets: [
            "Raison sociale avec forme juridique, telle qu'inscrite au registre du commerce",
            "Adresse postale complète (rue, NPA, localité, pays)",
            "Adresse e-mail",
            "Numéro de téléphone (recommandé)",
            "Personne(s) habilitée(s) à représenter l'entreprise, par exemple titulaire, gérance ou conseil d'administration (recommandé)",
            "Numéro d'identification des entreprises (IDE) au format CHE-123.456.789 (recommandé, s'il existe)",
            "Numéro de TVA si vous êtes assujetti : l'IDE suivi de la mention TVA",
            "Inscription au registre du commerce, par exemple « Registre du commerce du canton de Neuchâtel » (si inscrit)",
          ],
        },
        {
          h2: "Mentions légales, protection des données et clause de non-responsabilité",
          paragraphs: [
            "Les mentions légales ne remplacent pas une déclaration de confidentialité. Dès que votre site traite des données personnelles, par exemple via un formulaire de contact, des cartes intégrées, des polices de tiers ou des statistiques, la loi sur la protection des données (LPD) vous oblige à en informer. Ces informations figurent dans une déclaration de confidentialité distincte, liée depuis les mentions légales et le pied de page.",
            "Beaucoup de mentions légales suisses contiennent aussi une clause de non-responsabilité pour les contenus et les liens ainsi qu'une mention sur les droits d'auteur. Ces clauses ne sont pas obligatoires et leur effet juridique est limité. Le générateur se limite donc volontairement aux indications sur le fournisseur et le contact. Vous pouvez voir comment nous procédons dans nos propres [mentions légales](legal:impressum).",
          ],
        },
        {
          h2: "Clientèle en Allemagne, en France ou dans l'UE",
          paragraphs: [
            "Si votre offre vise aussi spécifiquement une clientèle à l'étranger, les règles plus strictes de ces pays peuvent s'appliquer, par exemple en Allemagne la loi sur les services numériques (DDG) ou en France la loi pour la confiance dans l'économie numérique (LCEN). Selon les cas, elles demandent d'autres indications comme le registre ou l'autorité de surveillance. Pour la vente en ligne dans l'UE, d'autres obligations d'information s'ajoutent. Dans ces cas, nous recommandons un conseil juridique.",
            "Pour les boutiques en ligne, d'autres obligations s'appliquent aussi en Suisse, par exemple sur les étapes menant à la conclusion du contrat et la confirmation de commande. Notre guide [Boutique en ligne en Suisse](guide:onlineshop-schweiz) donne une vue d'ensemble.",
          ],
        },
        {
          h2: "Bien intégrer les mentions légales au site",
          paragraphs: [
            "Les mentions légales doivent être accessibles en un clic depuis chaque page, généralement via un lien « Mentions légales » dans le pied de page. Sur un site bilingue, une version allemande (« Impressum ») accompagne les pages en allemand. Veillez à ce que les données correspondent à votre fiche Google et à vos annuaires. Des données cohérentes aident aussi le [référencement local](service:local-seo).",
            "Vous créez un nouveau site ou voulez revoir votre présence ? Avec un [site d'entreprise réalisé par Webnova](service:firmenwebsite), mentions légales et déclaration de confidentialité font partie du projet. Et avec l'[analyse de site gratuite](page:website-check), nous examinons votre site actuel.",
          ],
        },
      ],
      faq: [
        {
          q: "Une entreprise individuelle a-t-elle besoin de mentions légales ?",
          a: "Oui, dès que vous proposez des biens ou des services sur votre site. Il faut indiquer votre nom ou votre raison sociale, votre adresse postale et une adresse e-mail. Si l'entreprise est inscrite au registre du commerce, utilisez la raison inscrite.",
        },
        {
          q: "Le numéro IDE doit-il figurer dans les mentions légales ?",
          a: "La LCD ne l'exige pas expressément. Il permet toutefois d'identifier clairement votre entreprise et il est usuel en Suisse. Si votre entreprise a un IDE, nous recommandons de l'indiquer.",
        },
        {
          q: "Comment indiquer le numéro de TVA ?",
          a: "Le numéro de TVA suisse est l'IDE suivi de la mention TVA, par exemple CHE-123.456.789 TVA. En allemand, la mention est MWST.",
        },
        {
          q: "Une case postale suffit-elle comme adresse ?",
          a: "En général non. Les indications doivent permettre une identification claire. Indiquez donc une adresse complète avec rue et numéro.",
        },
        {
          q: "Le numéro de téléphone est-il obligatoire ?",
          a: "Seule l'adresse e-mail est exigée expressément. Un numéro de téléphone n'est pas obligatoire, mais inspire confiance et reste souvent le moyen le plus rapide pour vos clients.",
        },
        {
          q: "Faut-il indiquer l'hébergeur ?",
          a: "Non, ce n'est pas obligatoire en Suisse. Certaines entreprises le mentionnent malgré tout. Il est plus important que votre déclaration de confidentialité indique où et par qui les données sont traitées.",
        },
        {
          q: "Faut-il des mentions légales sur les réseaux sociaux ?",
          a: "Si vous utilisez un profil à titre professionnel pour proposer des prestations, il est judicieux de renvoyer à vos mentions légales ou d'y indiquer les données essentielles.",
        },
        {
          q: "Mes saisies sont-elles enregistrées ?",
          a: "Non. Le générateur fonctionne entièrement dans votre navigateur. Vos saisies ne sont ni transmises à Webnova ni enregistrées.",
        },
        {
          q: "Le texte généré est-il vérifié juridiquement ?",
          a: "Non. Le générateur crée un projet en toute bonne foi, mais ne remplace pas un conseil juridique. Vérifiez les indications et, en cas de doute, faites-vous conseiller par un spécialiste.",
        },
      ],
      ctaTitle: "Un nouveau site avec des mentions légales propres ?",
      ctaText: "Dans nos projets, mentions légales, protection des données et SEO sont compris. Nous vous conseillons volontiers gratuitement.",
    },
  },
};
