import type { Guide } from "../types";

export const onlineshopSchweiz: Guide = {
  key: "onlineshop-schweiz",
  date: "2026-10-07",
  readingMinutes: 9,
  related: ["onlineshop", "kassensystem-retail", "seo"],
  relatedGuides: ["barrierefreie-website", "zweisprachige-webseite", "webseite-kosten"],
  cities: ["biel", "solothurn", "bern", "grenchen"],
  content: {
    de: {
      slug: "onlineshop-schweiz-twint-mwst-recht",
      meta: {
        title: "Onlineshop Schweiz: TWINT, MWST und Recht",
        description:
          "Onlineshop in der Schweiz eröffnen: Zahlungsarten mit TWINT, Mehrwertsteuer, Preisangaben, Informationspflichten, Datenschutz und Versand im Überblick.",
      },
      h1: "Onlineshop in der Schweiz: TWINT, Mehrwertsteuer und Recht im Überblick",
      lead: "Ein Onlineshop für die Schweiz funktioniert anders als einer für Deutschland. Kundinnen und Kunden erwarten TWINT, Preise in Franken inklusive MWST und eine Lieferung mit der Post. Dazu kommen Schweizer Regeln zu Preisangaben, Informationspflichten und Datenschutz.",
      keyTakeaways: [
        "TWINT gehört in der Schweiz zu den wichtigsten Zahlungsarten, ergänzt durch Karten, Apple Pay, Google Pay und Rechnung.",
        "Preise gegenüber Konsumentinnen und Konsumenten sind in Franken inklusive MWST anzugeben, Versandkosten vor dem Bestellabschluss.",
        "Das UWG verlangt Angaben zu Identität und Kontakt, die Erklärung der Bestellschritte, eine Korrekturmöglichkeit und eine sofortige Bestätigung.",
        "Ein gesetzliches Widerrufsrecht wie in der EU gibt es in der Schweiz nicht. Klare AGB und eine Datenschutzerklärung sind trotzdem nötig.",
        "Eigene Produkttexte, gute Fotos und strukturierte Daten helfen, bei Google gefunden zu werden.",
      ],
      sections: [
        {
          h2: "Zahlungsarten: TWINT gehört dazu",
          paragraphs: [
            "TWINT ist in der Schweiz eines der beliebtesten Zahlungsmittel, besonders auf dem Smartphone. Ein Shop ohne TWINT verliert Bestellungen an der Kasse. Ergänzen Sie Kredit- und Debitkarten, Apple Pay und Google Pay sowie für Firmenkunden den Kauf auf Rechnung. Wichtig ist eine Auswahl, die zu Ihrer Kundschaft passt, nicht möglichst viele Logos.",
            "Die Zahlungen laufen über einen Payment-Anbieter, der die Mittel einzieht und auszahlt. In der Schweiz verbreitet sind zum Beispiel Datatrans, Payrexx, Wallee, Worldline (Saferpay) und Stripe. Vergleichen Sie Gebühren, unterstützte Zahlungsarten, Auszahlungsrhythmus und die Anbindung an Ihr Shopsystem. Beim Kauf auf Rechnung lohnt sich ein Anbieter, der das Ausfallrisiko übernimmt.",
          ],
          bullets: [
            "TWINT, Kredit- und Debitkarten",
            "Apple Pay und Google Pay für mobile Käufe",
            "Rechnung für Firmenkunden, idealerweise mit Risikoübernahme",
            "Payment-Anbieter mit Schweizer Auszahlung in CHF",
          ],
        },
        {
          h2: "Mehrwertsteuer im Onlineshop",
          paragraphs: [
            "Mehrwertsteuerpflichtig wird ein Unternehmen in der Schweiz grundsätzlich ab einem weltweiten Jahresumsatz von 100 000 Franken aus steuerbaren Leistungen. Seit 2024 gelten der Normalsatz von 8,1 Prozent, der reduzierte Satz von 2,6 Prozent, etwa für Lebensmittel und Bücher, sowie 3,8 Prozent für Beherbergung. Ihr Shop muss jedem Produkt den richtigen Satz zuordnen können.",
            "Exportieren Sie ins Ausland, ist die Lieferung in der Regel von der Schweizer MWST befreit, sofern der Export nachgewiesen ist. Im Zielland fallen dafür Einfuhrabgaben an, die Ihre Kundschaft kennen sollte. Klären Sie steuerliche Fragen vor dem Start mit Ihrer Treuhand oder der Eidgenössischen Steuerverwaltung. Dieser Ratgeber ersetzt keine Steuerberatung.",
          ],
        },
        {
          h2: "Preisangaben und Informationspflichten",
          paragraphs: [
            "Gegenüber Konsumentinnen und Konsumenten müssen Preise nach der Preisbekanntgabeverordnung als tatsächlich zu bezahlende Preise in Franken angegeben werden, inklusive MWST und nicht frei wählbarer Zuschläge. Versandkosten sollten vor dem Bestellabschluss klar ersichtlich sein. Streichpreise und Rabatte müssen ehrlich sein und sich auf echte frühere Preise beziehen.",
            "Das Gesetz gegen den unlauteren Wettbewerb verlangt von Onlineshops zudem klare Angaben zu Ihrer Identität und Kontaktadresse inklusive E-Mail, einen Hinweis auf die einzelnen Schritte bis zum Vertragsabschluss, die Möglichkeit, Eingabefehler vor der Bestellung zu korrigieren, und eine sofortige elektronische Bestellbestätigung.",
          ],
          bullets: [
            "Preise in CHF inklusive MWST",
            "Versandkosten vor dem Bestellabschluss sichtbar",
            "Impressum mit Firmenname, Adresse und E-Mail",
            "Korrekturmöglichkeit vor dem Absenden und Bestätigung per E-Mail",
          ],
        },
        {
          h2: "AGB, Rückgabe und Datenschutz",
          paragraphs: [
            "Anders als in der EU gibt es in der Schweiz kein allgemeines gesetzliches Widerrufsrecht für Online-Käufe. Viele Shops bieten trotzdem ein freiwilliges Rückgaberecht an, weil Kundinnen und Kunden es erwarten. Halten Sie Ihre Regeln zu Rückgabe, Garantie, Lieferfristen und Zahlung in klaren AGB fest, die vor der Bestellung abrufbar sind. Verkaufen Sie gezielt in die EU, kann zusätzlich EU-Verbraucherrecht gelten.",
            "Seit September 2023 gilt das revidierte Datenschutzgesetz. Ihr Shop braucht eine Datenschutzerklärung, die beschreibt, welche Daten Sie für Bestellung, Versand, Zahlung, Newsletter und Analyse bearbeiten und an welche Dienstleister sie gehen. Setzen Sie Tracking- und Marketing-Tools bewusst ein und informieren Sie transparent darüber.",
          ],
        },
        {
          h2: "Versand, Lager und Abholung",
          paragraphs: [
            "Die meisten Schweizer Shops versenden mit der Post, bei grösseren Waren auch mit Spediteuren. Viele Shopsysteme drucken Etiketten direkt aus der Bestellung und senden die Sendungsverfolgung automatisch an die Kundschaft. Legen Sie klare Versandregeln fest, zum Beispiel nach Gewicht oder ab einem bestimmten Bestellwert kostenlos.",
            "Haben Sie ein Ladengeschäft, ist Click & Collect eine starke Ergänzung: online bestellen, im Laden abholen. Damit der Lagerbestand stimmt, sollten Shop und Kasse verbunden sein. Wie das mit einem modernen [Kassensystem für den Detailhandel](service:kassensystem-retail) funktioniert, zeigen wir Ihnen gerne.",
          ],
        },
        {
          h2: "Gefunden werden: SEO für Onlineshops",
          paragraphs: [
            "Ein Shop ohne Besucher verkauft nichts. Jede Kategorie und jedes Produkt braucht einen eigenen, aussagekräftigen Text statt der Herstellerbeschreibung, die zig andere Shops auch verwenden. Gute Produktfotos, strukturierte Daten für Preis und Verfügbarkeit und schnelle Ladezeiten helfen bei Google und in der Bildersuche.",
            "Für lokale Händler lohnt sich die Verbindung von Shop und Laden in der Suche: Google-Unternehmensprofil, Standortseite und Hinweis auf Abholung vor Ort. Wenn Sie in die Romandie verkaufen, gehört eine französische Version dazu, siehe [Zweisprachige Webseite](guide:zweisprachige-webseite). Unsere [SEO-Betreuung](service:seo) kümmert sich um diese Punkte.",
          ],
        },
        {
          h2: "Der Weg zum eigenen Shop",
          paragraphs: [
            "Am Anfang steht die Frage, was Sie verkaufen, an wen und wie viele Produkte es sind. Danach richten sich Shopsystem, Zahlungsanbieter und Gestaltung. Starten Sie mit einem sauberen Kernsortiment und erweitern Sie schrittweise, statt mit Hunderten halbfertigen Produktseiten online zu gehen.",
            "Wir begleiten Schweizer KMU von der Planung bis zum ersten Verkauf, siehe [Onlineshop erstellen](service:onlineshop). Für Händler mit Laden bieten wir lokale Beratung, zum Beispiel für einen [Onlineshop in Biel/Bienne](local:onlineshop:biel), in [Solothurn](local:onlineshop:solothurn) oder in [Bern](local:onlineshop:bern).",
          ],
        },
      ],
      faq: [
        {
          q: "Muss mein Onlineshop TWINT anbieten?",
          a: "Gesetzlich nicht, praktisch ist es für Schweizer Konsumentinnen und Konsumenten aber eine der wichtigsten Zahlungsarten. Die meisten Payment-Anbieter für die Schweiz unterstützen TWINT.",
        },
        {
          q: "Gibt es in der Schweiz ein 14-tägiges Widerrufsrecht?",
          a: "Nein, für Online-Käufe gibt es in der Schweiz kein allgemeines gesetzliches Widerrufsrecht. Ein freiwilliges Rückgaberecht ist aber verbreitet und sollte in den AGB klar geregelt sein.",
        },
        {
          q: "Muss ich als kleiner Shop MWST abrechnen?",
          a: "Erst ab der gesetzlichen Umsatzgrenze. Darunter sind Sie grundsätzlich befreit, können sich aber freiwillig unterstellen. Lassen Sie Ihre Situation von einer Treuhand oder der Steuerverwaltung prüfen.",
        },
        {
          q: "Kann ich Shop und Ladenkasse verbinden?",
          a: "Ja. Mit einem passenden Kassensystem werden Produkte, Preise und Lagerbestand zwischen Laden und Onlineshop abgeglichen. So vermeiden Sie doppelte Pflege und Verkäufe von Ware, die nicht mehr da ist.",
        },
      ],
    },
    fr: {
      slug: "boutique-en-ligne-suisse-twint-tva",
      meta: {
        title: "Boutique en ligne en Suisse : TWINT, TVA, droit",
        description:
          "Ouvrir une boutique en ligne en Suisse : paiement avec TWINT, TVA, indication des prix, obligations d'information, protection des données et livraison.",
      },
      h1: "Boutique en ligne en Suisse : TWINT, TVA et cadre juridique",
      lead: "Une boutique en ligne pour la Suisse ne fonctionne pas comme une boutique pour la France. Les clients attendent TWINT, des prix en francs TVA comprise et une livraison par la Poste. S'y ajoutent des règles suisses sur l'indication des prix, l'information et la protection des données.",
      keyTakeaways: [
        "En Suisse, TWINT fait partie des moyens de paiement essentiels, complété par les cartes, Apple Pay, Google Pay et la facture.",
        "Les prix destinés aux consommateurs s'indiquent en francs TVA comprise, les frais de port avant la conclusion de la commande.",
        "La LCD exige identité et contact, l'explication des étapes de commande, une possibilité de correction et une confirmation immédiate.",
        "Il n'existe pas en Suisse de droit de rétractation légal comme dans l'UE. Des CG claires et une déclaration de confidentialité restent nécessaires.",
        "Des textes produits propres, de bonnes photos et des données structurées aident à être trouvé sur Google.",
      ],
      sections: [
        {
          h2: "Moyens de paiement : TWINT est incontournable",
          paragraphs: [
            "TWINT est l'un des moyens de paiement préférés en Suisse, surtout sur smartphone. Une boutique sans TWINT perd des commandes au moment de payer. Complétez avec les cartes de crédit et de débit, Apple Pay et Google Pay, et pour les clients professionnels l'achat sur facture. L'important est un choix adapté à votre clientèle, pas un maximum de logos.",
            "Les paiements passent par un prestataire qui encaisse et verse les montants. En Suisse, on trouve par exemple Datatrans, Payrexx, Wallee, Worldline (Saferpay) et Stripe. Comparez frais, moyens de paiement, rythme des versements et intégration à votre système de boutique. Pour l'achat sur facture, un prestataire qui assume le risque de défaut est intéressant.",
          ],
          bullets: [
            "TWINT, cartes de crédit et de débit",
            "Apple Pay et Google Pay pour les achats mobiles",
            "Facture pour les clients professionnels, idéalement avec prise en charge du risque",
            "Prestataire avec versement en CHF",
          ],
        },
        {
          h2: "La TVA dans une boutique en ligne",
          paragraphs: [
            "En Suisse, une entreprise est en principe assujettie à la TVA à partir d'un chiffre d'affaires annuel mondial de 100 000 francs provenant de prestations imposables. Depuis 2024, les taux sont de 8,1 % (taux normal), 2,6 % (taux réduit, par exemple pour l'alimentation et les livres) et 3,8 % pour l'hébergement. Votre boutique doit attribuer le bon taux à chaque produit.",
            "Pour les exportations, la livraison est en règle générale exonérée de la TVA suisse, à condition de prouver l'exportation. Des droits d'importation s'appliquent alors dans le pays de destination, ce que vos clients doivent savoir. Clarifiez les questions fiscales avec votre fiduciaire ou l'Administration fédérale des contributions. Cet article ne remplace pas un conseil fiscal.",
          ],
        },
        {
          h2: "Indication des prix et obligations d'information",
          paragraphs: [
            "Selon l'ordonnance sur l'indication des prix, les prix destinés aux consommateurs doivent être indiqués en francs comme prix effectivement à payer, TVA et suppléments obligatoires compris. Les frais de livraison doivent être visibles avant la conclusion de la commande. Les prix barrés et rabais doivent être honnêtes et se référer à de vrais prix antérieurs.",
            "La loi contre la concurrence déloyale exige en outre des boutiques en ligne des indications claires sur votre identité et une adresse de contact avec e-mail, l'explication des étapes menant au contrat, la possibilité de corriger les erreurs de saisie avant la commande et une confirmation électronique immédiate.",
          ],
          bullets: [
            "Prix en CHF TVA comprise",
            "Frais de livraison visibles avant la commande",
            "Mentions légales avec raison sociale, adresse et e-mail",
            "Correction possible avant l'envoi et confirmation par e-mail",
          ],
        },
        {
          h2: "CG, retours et protection des données",
          paragraphs: [
            "Contrairement à l'UE, la Suisse ne connaît pas de droit de rétractation légal général pour les achats en ligne. Beaucoup de boutiques offrent néanmoins un droit de retour volontaire, car les clients l'attendent. Fixez vos règles de retour, garantie, délais de livraison et paiement dans des conditions générales claires, accessibles avant la commande. Si vous vendez activement dans l'UE, le droit européen de la consommation peut aussi s'appliquer.",
            "Depuis septembre 2023, la loi révisée sur la protection des données est en vigueur. Votre boutique a besoin d'une déclaration de protection des données qui décrit quelles données vous traitez pour la commande, la livraison, le paiement, la newsletter et l'analyse, et à quels prestataires elles sont transmises.",
          ],
        },
        {
          h2: "Livraison, stock et retrait en magasin",
          paragraphs: [
            "La plupart des boutiques suisses expédient par la Poste, les articles volumineux aussi par transporteur. De nombreux systèmes impriment les étiquettes directement depuis la commande et envoient automatiquement le suivi au client. Définissez des règles claires, par exemple selon le poids ou la gratuité à partir d'un certain montant de commande.",
            "Si vous avez un magasin, le click & collect est un complément efficace : commander en ligne, retirer en magasin. Pour que le stock soit juste, boutique et caisse doivent être connectées. Nous vous montrons volontiers comment cela fonctionne avec un [système de caisse pour le commerce](service:kassensystem-retail).",
          ],
        },
        {
          h2: "Être trouvé : le SEO pour boutiques en ligne",
          paragraphs: [
            "Une boutique sans visiteurs ne vend rien. Chaque catégorie et chaque produit méritent un texte propre plutôt que la description du fabricant reprise par des dizaines d'autres boutiques. De bonnes photos, des données structurées pour le prix et la disponibilité et des temps de chargement courts aident sur Google et dans la recherche d'images.",
            "Pour les commerçants locaux, il vaut la peine de relier boutique et magasin dans la recherche : fiche Google, page de localité et mention du retrait sur place. Si vous vendez aussi en Suisse alémanique, une version allemande est nécessaire, voir [Site internet bilingue](guide:zweisprachige-webseite). Notre [accompagnement SEO](service:seo) s'en occupe.",
          ],
        },
        {
          h2: "Le chemin vers votre boutique",
          paragraphs: [
            "Tout commence par la question de ce que vous vendez, à qui et en quelle quantité. Le système de boutique, le prestataire de paiement et le design en découlent. Commencez avec un assortiment de base soigné et élargissez progressivement, plutôt que de mettre en ligne des centaines de fiches produits inachevées.",
            "Nous accompagnons les PME suisses de la planification à la première vente, voir [Créer une boutique en ligne](service:onlineshop). Pour les commerçants avec magasin, nous proposons un conseil local, par exemple pour une [boutique en ligne à Bienne](local:onlineshop:biel), à [Soleure](local:onlineshop:solothurn) ou à [Berne](local:onlineshop:bern).",
          ],
        },
      ],
      faq: [
        {
          q: "Ma boutique doit-elle proposer TWINT ?",
          a: "Ce n'est pas une obligation légale, mais c'est en pratique l'un des moyens de paiement les plus importants pour les consommateurs suisses. La plupart des prestataires de paiement pour la Suisse prennent TWINT en charge.",
        },
        {
          q: "Existe-t-il un droit de rétractation de 14 jours en Suisse ?",
          a: "Non, il n'existe pas de droit de rétractation légal général pour les achats en ligne en Suisse. Un droit de retour volontaire est toutefois courant et doit être clairement réglé dans les conditions générales.",
        },
        {
          q: "Une petite boutique doit-elle décompter la TVA ?",
          a: "Seulement à partir du seuil de chiffre d'affaires légal. En dessous, vous êtes en principe exonéré, mais pouvez vous assujettir volontairement. Faites vérifier votre situation par une fiduciaire ou l'administration fiscale.",
        },
        {
          q: "Puis-je connecter boutique en ligne et caisse du magasin ?",
          a: "Oui. Avec un système de caisse adapté, produits, prix et stock sont synchronisés entre magasin et boutique. Vous évitez la double saisie et la vente d'articles qui ne sont plus disponibles.",
        },
      ],
    },
  },
};
