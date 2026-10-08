import type { Service } from "../types";

export const branding: Service = {
  key: "branding",
  group: "marketing",
  icon: "pen",
  related: ["webdesign", "online-marketing", "website-redesign"],
  content: {
    de: {
      slug: "branding-grafikdesign",
      navLabel: "Branding & Grafik",
      meta: {
        title: "Logo erstellen lassen & Corporate Design",
        description:
          "Logo erstellen lassen, Corporate Design und Grafikdesign für einen starken, einheitlichen Auftritt. Jetzt kostenlose Erstberatung anfragen.",
      },
      eyebrow: "Branding & Grafikdesign",
      h1: "Logo erstellen lassen und Corporate Design",
      lead:
        "Ein starkes Logo und ein durchdachtes Corporate Design machen Ihr Unternehmen auf einen Blick erkennbar. Online, auf Papier und am Fahrzeug.",
      features: [
        {
          title: "Logo-Design",
          text: "Ein eigenständiges Logo, das zu Ihrer Firma passt und in jeder Grösse funktioniert, vom Favicon bis zur Fassade.",
        },
        {
          title: "Corporate Design",
          text: "Farben, Schriften und Gestaltungsregeln, die Ihren Auftritt über alle Kanäle hinweg einheitlich machen.",
        },
        {
          title: "Styleguide",
          text: "Ein kompakter Leitfaden zeigt, wie Logo, Farben und Schriften richtig eingesetzt werden. Auch von Dritten.",
        },
        {
          title: "Geschäftsdrucksachen",
          text: "Visitenkarten, Briefpapier, Flyer und Broschüren im Look Ihrer Marke, druckfertig aufbereitet.",
        },
        {
          title: "Social-Media-Vorlagen",
          text: "Vorlagen für Beiträge und Stories, mit denen Sie selbst konsistent und professionell posten.",
        },
      ],
      sections: [
        {
          h2: "Logo erstellen lassen: Der erste Eindruck zählt",
          paragraphs: [
            "Ihr Logo begegnet Kunden überall: auf der Webseite, auf der Offerte, am Firmenwagen und im Google-Profil. Es soll auf Anhieb vermitteln, wofür Ihr Unternehmen steht, und auch in klein noch gut lesbar sein. Ein Logo aus dem Online-Generator erfüllt das selten.",
            "Wir beginnen mit einem Gespräch über Ihre Firma, Ihre Werte und Ihre Kunden. Daraus entwickeln wir mehrere Entwürfe, die wir mit Ihnen besprechen und verfeinern. Am Ende erhalten Sie Ihr Logo in allen gängigen Formaten für Bildschirm und Druck. Dazu gehören Varianten für helle und dunkle Hintergründe sowie eine einfarbige Version.",
          ],
        },
        {
          h2: "Corporate Design: Ein Auftritt aus einem Guss",
          paragraphs: [
            "Ein Logo allein macht noch keine Marke. Erst wenn Farben, Schriften, Bildsprache und Layouts zusammenpassen, entsteht ein Auftritt, den Kunden wiedererkennen. Ein klares Corporate Design wirkt professionell und schafft Vertrauen, besonders für KMU, die gegen grössere Anbieter antreten. Kunden erinnern sich an Sie, weil jeder Kontakt gleich wirkt.",
            "Wir definieren die Gestaltungsregeln und halten sie in einem verständlichen Styleguide fest. So bleibt Ihr Auftritt einheitlich, egal ob Ihre Mitarbeitenden eine Präsentation erstellen oder eine Druckerei einen Flyer produziert. Neue Drucksachen oder Werbemittel entstehen schneller, weil die Grundlagen bereits geklärt sind.",
          ],
          bullets: [
            "Logo in Varianten für hell, dunkel und klein",
            "Farbpalette für Bildschirm und Druck",
            "Schriften und Typografie-Regeln",
            "Gestaltungsbeispiele für typische Anwendungen",
          ],
        },
        {
          h2: "Vom Branding bis zur Webseite",
          paragraphs: [
            "Der grosse Vorteil, wenn Branding und Webdesign aus einer Hand kommen: Alles passt zusammen. Ihr neues Corporate Design fliesst direkt in die Gestaltung Ihrer Website, Ihrer Social-Media-Kanäle und Ihrer Werbung ein. Abstimmungen zwischen verschiedenen Dienstleistern entfallen. Das spart Zeit und sorgt für ein stimmiges Gesamtbild.",
            "Ob Neugründung, Rebranding oder Auffrischung eines bestehenden Logos: Wir begleiten Unternehmen in der ganzen Schweiz. Gespräche führen wir gerne persönlich bei Ihnen vor Ort oder per Video. Wir nehmen uns Zeit, Ihr Unternehmen zu verstehen, bevor wir gestalten.",
          ],
        },
      ],
      faq: [
        {
          q: "Wie läuft die Logo-Entwicklung ab?",
          a: "Nach einem Briefing-Gespräch erarbeiten wir erste Entwürfe. Diese besprechen wir mit Ihnen und verfeinern den bevorzugten Ansatz, bis das Logo passt.",
        },
        {
          q: "In welchen Formaten erhalte ich mein Logo?",
          a: "Sie erhalten Ihr Logo als Vektordatei für den Druck sowie als Bilddateien für Web und Social Media, jeweils in Farbe und einfarbig.",
        },
        {
          q: "Können Sie mein bestehendes Logo modernisieren?",
          a: "Ja. Oft lohnt es sich, ein bekanntes Logo behutsam aufzufrischen, statt es ganz zu ersetzen. So bleibt die Wiedererkennung erhalten.",
        },
        {
          q: "Brauche ich als kleines Unternehmen ein Corporate Design?",
          a: "Ein einfaches, klares Regelwerk lohnt sich schon für kleine Firmen. Es spart Zeit bei jeder neuen Drucksache und sorgt für einen professionellen Eindruck.",
        },
        {
          q: "Was kostet es, ein Logo erstellen zu lassen?",
          a: "Das hängt vom Umfang ab, etwa ob nur ein Logo oder ein komplettes Corporate Design entstehen soll. Nach einer kostenlosen Erstberatung erhalten Sie eine unverbindliche Offerte.",
        },
      ],
      ctaTitle: "Geben Sie Ihrer Marke ein Gesicht",
      ctaText:
        "Erzählen Sie uns von Ihrem Unternehmen. Wir beraten Sie kostenlos und erstellen Ihnen eine unverbindliche Offerte.",
    },
    fr: {
      slug: "branding-graphisme",
      navLabel: "Branding & graphisme",
      meta: {
        title: "Création de logo & identité visuelle",
        description:
          "Création de logo, identité visuelle et graphisme pour une image forte et cohérente. Demandez votre premier conseil gratuit chez Webnova.",
      },
      eyebrow: "Branding & graphisme",
      h1: "Création de logo et identité visuelle",
      lead:
        "Un logo fort et une identité visuelle cohérente rendent votre entreprise reconnaissable au premier coup d'œil. En ligne, sur papier et sur vos véhicules.",
      features: [
        {
          title: "Création de logo",
          text: "Un logo unique, fidèle à votre entreprise et lisible à toutes les tailles, de l'icône d'onglet à l'enseigne.",
        },
        {
          title: "Identité visuelle",
          text: "Couleurs, typographies et règles graphiques pour une image cohérente sur tous vos supports.",
        },
        {
          title: "Charte graphique",
          text: "Un guide compact explique comment utiliser logo, couleurs et polices, y compris par des tiers.",
        },
        {
          title: "Papeterie et imprimés",
          text: "Cartes de visite, papier à lettres, flyers et brochures aux couleurs de votre marque, prêts à imprimer.",
        },
        {
          title: "Modèles pour les réseaux sociaux",
          text: "Des gabarits de publications et de stories pour publier vous-même avec cohérence.",
        },
      ],
      sections: [
        {
          h2: "Création de logo : soigner la première impression",
          paragraphs: [
            "Votre logo est partout : sur votre site, vos offres, votre véhicule et votre fiche Google. Il doit exprimer d'emblée ce que représente votre entreprise et rester lisible en petit format. Un logo généré en ligne en quelques clics y parvient rarement.",
            "Nous commençons par un échange sur votre entreprise, vos valeurs et vos clients. Nous en tirons plusieurs pistes, que nous discutons et affinons avec vous. Vous recevez ensuite votre logo dans tous les formats utiles pour l'écran et l'impression, avec des variantes pour fonds clairs et foncés ainsi qu'une version monochrome.",
          ],
        },
        {
          h2: "Identité visuelle : une image cohérente",
          paragraphs: [
            "Un logo seul ne fait pas une marque. C'est l'harmonie entre couleurs, typographies, images et mises en page qui crée une identité que l'on reconnaît. Une identité visuelle claire inspire confiance et donne une image professionnelle, un vrai atout pour une PME face à de plus grands acteurs.",
            "Nous définissons les règles graphiques et les réunissons dans une charte simple à utiliser. Votre image reste ainsi cohérente, que vos collaborateurs préparent une présentation ou qu'un imprimeur réalise un flyer. Chaque nouvel imprimé ou support publicitaire se crée plus vite, car les bases sont posées.",
          ],
          bullets: [
            "Logo décliné pour fonds clairs, foncés et petits formats",
            "Palette de couleurs pour l'écran et l'impression",
            "Typographies et règles de mise en forme",
            "Exemples d'application pour vos supports courants",
          ],
        },
        {
          h2: "Du branding au site internet",
          paragraphs: [
            "Confier le branding et le site internet à la même agence a un grand avantage : tout s'accorde. Votre nouvelle identité visuelle s'intègre directement à votre site, à vos réseaux sociaux et à vos publicités, sans coordination fastidieuse entre plusieurs prestataires. Vous gagnez du temps et obtenez une image d'ensemble harmonieuse.",
            "Création d'entreprise, changement d'image ou modernisation d'un logo existant : nous accompagnons des entreprises dans toute la Suisse. Les rendez-vous ont lieu chez vous ou en visioconférence. Nous prenons le temps de comprendre votre entreprise avant de créer.",
          ],
        },
      ],
      faq: [
        {
          q: "Comment se déroule la création d'un logo ?",
          a: "Après un entretien de briefing, nous élaborons de premières propositions. Nous les discutons avec vous et affinons la piste retenue jusqu'au résultat final.",
        },
        {
          q: "Dans quels formats vais-je recevoir mon logo ?",
          a: "Vous recevez votre logo en fichier vectoriel pour l'impression et en images pour le web et les réseaux sociaux, en couleur et en monochrome.",
        },
        {
          q: "Pouvez-vous moderniser mon logo actuel ?",
          a: "Oui. Il est souvent judicieux de rafraîchir un logo connu plutôt que de le remplacer entièrement. Vous conservez ainsi la reconnaissance acquise.",
        },
        {
          q: "Une petite entreprise a-t-elle besoin d'une identité visuelle ?",
          a: "Un cadre simple et clair est utile dès les premiers pas. Il fait gagner du temps à chaque nouvel imprimé et renforce votre image professionnelle.",
        },
        {
          q: "Combien coûte la création d'un logo ?",
          a: "Cela dépend de l'ampleur du projet, d'un logo seul à une identité visuelle complète. Après un premier conseil gratuit, vous recevez une offre sans engagement.",
        },
      ],
      ctaTitle: "Donnez un visage à votre marque",
      ctaText:
        "Parlez-nous de votre entreprise. Nous vous conseillons gratuitement et vous remettons une offre sans engagement.",
    },
  },
};
