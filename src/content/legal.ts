import type { Localized, Section } from "./types";

type LegalPage = { slug: string; title: string; sections: Section[] };

export const legal: Record<"impressum" | "datenschutz", Localized<LegalPage>> = {
  impressum: {
    de: {
      slug: "impressum",
      title: "Impressum",
      sections: [
        {
          h2: "Kontaktadresse",
          paragraphs: [
            "webnova solutions F. Demir (Einzelunternehmen)",
            "Bettlachstrasse 45",
            "2540 Grenchen",
            "Schweiz",
            "Telefon: +41 32 543 80 96",
            "E-Mail: kontakt@webnova.ch",
          ],
        },
        {
          h2: "Vertretungsberechtigte Person",
          paragraphs: ["Ferhat Demir, Inhaber"],
        },
        {
          h2: "Unternehmensidentifikation",
          paragraphs: ["UID: CHE-439.891.660"],
        },
        {
          h2: "Haftungsausschluss",
          paragraphs: [
            "Die Inhalte dieser Webseite wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr.",
            "Haftungsansprüche gegen Webnova wegen Schäden materieller oder immaterieller Art, die aus dem Zugriff auf oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen, soweit gesetzlich zulässig.",
            "Alle Angebote sind unverbindlich. Wir behalten uns ausdrücklich vor, Teile der Webseite oder das gesamte Angebot ohne besondere Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.",
          ],
        },
        {
          h2: "Haftung für Links",
          paragraphs: [
            "Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Für die Inhalte verlinkter Seiten sind ausschliesslich deren Betreiberinnen und Betreiber verantwortlich.",
            "Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar. Werden uns Rechtsverletzungen bekannt, entfernen wir die betreffenden Links umgehend. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr.",
          ],
        },
        {
          h2: "Urheberrechte",
          paragraphs: [
            "Die Urheber- und alle anderen Rechte an Inhalten, Texten, Bildern, Grafiken und anderen Dateien auf dieser Webseite gehören ausschliesslich Webnova oder den speziell genannten Rechteinhaberinnen und Rechteinhabern.",
            "Für die Reproduktion, Verbreitung oder sonstige Verwendung jeglicher Elemente ist die vorgängige schriftliche Zustimmung der Rechteinhaber einzuholen.",
          ],
        },
      ],
    },
    fr: {
      slug: "mentions-legales",
      title: "Mentions légales",
      sections: [
        {
          h2: "Adresse de contact",
          paragraphs: [
            "webnova solutions F. Demir (entreprise individuelle)",
            "Bettlachstrasse 45",
            "2540 Granges (Grenchen)",
            "Suisse",
            "Téléphone : +41 32 543 80 96",
            "E-mail : kontakt@webnova.ch",
          ],
        },
        {
          h2: "Personne habilitée à représenter l'entreprise",
          paragraphs: ["Ferhat Demir, propriétaire"],
        },
        {
          h2: "Identification de l'entreprise",
          paragraphs: ["IDE : CHE-439.891.660"],
        },
        {
          h2: "Exclusion de responsabilité",
          paragraphs: [
            "Les contenus de ce site ont été élaborés avec le plus grand soin. Nous ne garantissons toutefois pas l'exactitude, l'exhaustivité ni l'actualité des informations publiées.",
            "Dans la mesure permise par la loi, toute responsabilité de Webnova pour des dommages matériels ou immatériels résultant de l'accès aux informations publiées, de leur utilisation ou de leur non-utilisation, d'un usage abusif de la connexion ou de dérangements techniques est exclue.",
            "Toutes les offres sont sans engagement. Nous nous réservons expressément le droit de modifier, compléter ou supprimer tout ou partie du site sans préavis, ou d'en suspendre la publication temporairement ou définitivement.",
          ],
        },
        {
          h2: "Responsabilité pour les liens",
          paragraphs: [
            "Les renvois et liens vers des sites de tiers se situent en dehors de notre domaine de responsabilité. Seuls leurs exploitants sont responsables du contenu des pages liées.",
            "Au moment de la création des liens, aucun contenu illicite n'était identifiable. Si nous avons connaissance d'une violation du droit, nous supprimons immédiatement les liens concernés. L'accès à ces sites et leur utilisation se font à vos propres risques.",
          ],
        },
        {
          h2: "Droits d'auteur",
          paragraphs: [
            "Les droits d'auteur et tous les autres droits sur les contenus, textes, images, graphiques et autres fichiers de ce site appartiennent exclusivement à Webnova ou aux titulaires de droits expressément mentionnés.",
            "Toute reproduction, diffusion ou autre utilisation de ces éléments nécessite l'accord écrit préalable des titulaires des droits.",
          ],
        },
      ],
    },
  },
  datenschutz: {
    de: {
      slug: "datenschutz",
      title: "Datenschutzerklärung",
      sections: [
        {
          h2: "Hinweis",
          paragraphs: [
            "Stand: Oktober 2026.",
            "Diese Datenschutzerklärung wurde nach bestem Wissen erstellt, ersetzt aber keine Rechtsberatung. Sie ist zu prüfen und anzupassen, sobald sich eingesetzte Dienste oder Datenbearbeitungen ändern.",
          ],
        },
        {
          h2: "Verantwortliche Stelle",
          paragraphs: [
            "Verantwortlich für die Bearbeitung von Personendaten auf dieser Webseite ist: webnova solutions F. Demir, Bettlachstrasse 45, 2540 Grenchen, Schweiz, Telefon +41 32 543 80 96, E-Mail kontakt@webnova.ch.",
            "Für Fragen zum Datenschutz und zur Ausübung Ihrer Rechte erreichen Sie uns unter derselben Adresse oder per E-Mail an kontakt@webnova.ch.",
          ],
        },
        {
          h2: "Grundlagen",
          paragraphs: [
            "Wir bearbeiten Personendaten im Einklang mit dem Schweizer Bundesgesetz über den Datenschutz (Datenschutzgesetz, DSG) in der revidierten Fassung, die am 1. September 2023 in Kraft getreten ist (nDSG), sowie der zugehörigen Datenschutzverordnung (DSV).",
            "Soweit im Einzelfall die Datenschutz-Grundverordnung der EU (DSGVO) anwendbar ist, etwa bei Besucherinnen und Besuchern aus der EU, stützen wir die Bearbeitung zusätzlich auf die dort genannten Rechtsgrundlagen, insbesondere auf die Vertragsanbahnung (Art. 6 Abs. 1 lit. b DSGVO) und unser berechtigtes Interesse an einem sicheren und funktionsfähigen Webauftritt (Art. 6 Abs. 1 lit. f DSGVO).",
          ],
        },
        {
          h2: "Hosting und Server-Logfiles",
          paragraphs: [
            "Diese Webseite wird bei Vercel Inc., San Francisco, USA, gehostet. Vercel stellt die Webseite über ein weltweites Content Delivery Network (CDN) bereit. Inhalte können daher über Server in der Schweiz, der EU, den USA oder weiteren Ländern ausgeliefert werden.",
            "Beim Aufruf der Webseite werden automatisch technische Daten in Server-Logfiles erfasst, die Ihr Browser übermittelt. Dazu gehören IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Referrer-URL, Browsertyp und Betriebssystem. Diese Daten benötigen wir, um die Webseite sicher und stabil zu betreiben und Fehler oder Missbrauch zu erkennen. Sie werden nicht mit anderen Datenquellen zusammengeführt und nur kurzfristig gemäss den Vorgaben des Hosting-Anbieters gespeichert.",
          ],
        },
        {
          h2: "Kontakt- und Anfrageformular",
          paragraphs: [
            "Wenn Sie uns über das Kontakt- oder Anfrageformular kontaktieren, bearbeiten wir die von Ihnen angegebenen Daten, zum Beispiel Name, Firma, E-Mail-Adresse, Telefonnummer und Ihre Nachricht mit allfälligen Projektangaben. Wir verwenden diese Daten ausschliesslich, um Ihre Anfrage zu beantworten, eine Offerte zu erstellen und mit Ihnen in Kontakt zu bleiben.",
            "Die Anfragen werden in einer Datenbank gespeichert. Dafür nutzen wir den Dienst Neon (Neon Inc., USA) mit einer PostgreSQL-Datenbank, deren Hosting-Region in der EU liegt. Der Zugriff auf die gespeicherten Anfragen ist auf uns beschränkt und durch ein Login geschützt.",
          ],
        },
        {
          h2: "E-Mail-Versand über Resend",
          paragraphs: [
            "Für den Versand von E-Mails im Zusammenhang mit dem Kontaktformular, etwa Benachrichtigungen über neue Anfragen oder Eingangsbestätigungen, nutzen wir den Dienst Resend (Resend Inc., USA). Dabei werden insbesondere Ihre E-Mail-Adresse, Ihr Name und der Inhalt der Nachricht an Resend übermittelt und dort für den Versand bearbeitet.",
            "Die Übermittlung in die USA erfolgt auf Grundlage der Standardvertragsklauseln der Europäischen Kommission, die vom Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) anerkannt sind.",
          ],
        },
        {
          h2: "Cookies",
          paragraphs: [
            "Diese Webseite verwendet standardmässig keine Tracking- oder Marketing-Cookies und keine Analysedienste, die Ihr Verhalten über verschiedene Webseiten hinweg verfolgen.",
            "Gesetzt wird einzig ein technisch notwendiges Cookie für den geschützten Administrationsbereich. Es wird nur beim Login durch berechtigte Personen verwendet, um die Sitzung aufrechtzuerhalten, und betrifft normale Besucherinnen und Besucher nicht. Sollten wir künftig weitere Cookies oder Analysewerkzeuge einsetzen, passen wir diese Datenschutzerklärung an und holen, wo erforderlich, Ihre Einwilligung ein.",
          ],
        },
        {
          h2: "Schriftarten",
          paragraphs: [
            "Die auf dieser Webseite verwendeten Schriftarten (Google Fonts) werden lokal von unserem eigenen Server bzw. über unser Hosting ausgeliefert. Beim Aufruf der Webseite wird keine Verbindung zu Servern von Google hergestellt, und es werden keine Daten an Google übermittelt.",
          ],
        },
        {
          h2: "Bekanntgabe von Daten ins Ausland",
          paragraphs: [
            "Wie beschrieben setzen wir Dienstleister ein, die ihren Sitz in den USA haben oder Daten dort bearbeiten können (Vercel, Neon, Resend). Die USA gelten nicht in jedem Fall als Staat mit angemessenem Datenschutzniveau.",
            "Wir stellen einen angemessenen Schutz sicher, insbesondere durch Standardvertragsklauseln und – soweit der jeweilige Anbieter zertifiziert ist – durch das Swiss-U.S. Data Privacy Framework bzw. das EU-U.S. Data Privacy Framework. Eine Kopie der Garantien können Sie bei uns anfordern.",
          ],
        },
        {
          h2: "Aufbewahrungsdauer",
          paragraphs: [
            "Wir speichern Personendaten nur so lange, wie es für die genannten Zwecke erforderlich ist. Anfragen, aus denen kein Auftrag entsteht, löschen wir spätestens nach 24 Monaten.",
            "Führt eine Anfrage zu einem Auftrag, bewahren wir die geschäftsrelevanten Unterlagen gemäss den gesetzlichen Aufbewahrungspflichten auf, in der Schweiz in der Regel während zehn Jahren. Server-Logfiles werden nur kurzfristig gespeichert und anschliessend automatisch gelöscht.",
          ],
        },
        {
          h2: "Ihre Rechte",
          paragraphs: [
            "Sie haben im Rahmen des anwendbaren Datenschutzrechts das Recht, Auskunft darüber zu verlangen, ob und welche Personendaten wir über Sie bearbeiten. Sie können zudem die Berichtigung unrichtiger Daten, die Löschung Ihrer Daten sowie die Herausgabe Ihrer Daten in einem gängigen elektronischen Format verlangen und einer Bearbeitung widersprechen.",
            "Für die Ausübung Ihrer Rechte genügt eine E-Mail an kontakt@webnova.ch. Wir können einen Identitätsnachweis verlangen. Gesetzliche Aufbewahrungspflichten bleiben vorbehalten.",
            "Sie haben ausserdem das Recht, sich beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) oder, soweit die DSGVO anwendbar ist, bei einer zuständigen Aufsichtsbehörde in der EU zu beschweren.",
          ],
        },
        {
          h2: "Datensicherheit",
          paragraphs: [
            "Wir treffen angemessene technische und organisatorische Massnahmen, um Ihre Daten vor Verlust, Missbrauch und unbefugtem Zugriff zu schützen. Die Übertragung der Webseite erfolgt verschlüsselt (HTTPS), und der Zugang zu gespeicherten Anfragen ist passwortgeschützt.",
          ],
        },
        {
          h2: "Änderungen dieser Datenschutzerklärung",
          paragraphs: [
            "Wir können diese Datenschutzerklärung jederzeit anpassen, etwa wenn wir neue Dienste einsetzen oder sich rechtliche Vorgaben ändern. Massgeblich ist die jeweils auf dieser Webseite veröffentlichte Fassung.",
          ],
        },
      ],
    },
    fr: {
      slug: "protection-des-donnees",
      title: "Déclaration de protection des données",
      sections: [
        {
          h2: "Remarque",
          paragraphs: [
            "État : octobre 2026.",
            "Cette déclaration a été rédigée au mieux de nos connaissances, mais ne remplace pas un conseil juridique. Elle doit être vérifiée et adaptée dès que les services utilisés ou les traitements de données changent.",
          ],
        },
        {
          h2: "Responsable du traitement",
          paragraphs: [
            "Le responsable du traitement des données personnelles sur ce site est : webnova solutions F. Demir, Bettlachstrasse 45, 2540 Granges (Grenchen), Suisse, téléphone +41 32 543 80 96, e-mail kontakt@webnova.ch.",
            "Pour toute question relative à la protection des données ou pour exercer vos droits, vous pouvez nous joindre à la même adresse ou par e-mail à kontakt@webnova.ch.",
          ],
        },
        {
          h2: "Bases légales",
          paragraphs: [
            "Nous traitons les données personnelles conformément à la loi fédérale suisse sur la protection des données (LPD) dans sa version révisée, entrée en vigueur le 1er septembre 2023 (nLPD), ainsi qu'à l'ordonnance sur la protection des données (OPDo).",
            "Lorsque le règlement général sur la protection des données de l'UE (RGPD) s'applique, par exemple pour des visiteurs établis dans l'UE, nous fondons en outre le traitement sur les bases légales qui y sont prévues, notamment les mesures précontractuelles (art. 6, par. 1, let. b RGPD) et notre intérêt légitime à exploiter un site sûr et fonctionnel (art. 6, par. 1, let. f RGPD).",
          ],
        },
        {
          h2: "Hébergement et fichiers journaux du serveur",
          paragraphs: [
            "Ce site est hébergé par Vercel Inc., San Francisco, États-Unis. Vercel diffuse le site via un réseau de diffusion de contenu (CDN) mondial. Les contenus peuvent donc être servis depuis des serveurs situés en Suisse, dans l'UE, aux États-Unis ou dans d'autres pays.",
            "Lors de la consultation du site, des données techniques transmises par votre navigateur sont automatiquement enregistrées dans des fichiers journaux : adresse IP, date et heure de l'accès, page consultée, URL de provenance, type de navigateur et système d'exploitation. Ces données nous servent à exploiter le site de manière sûre et stable et à détecter les erreurs ou abus. Elles ne sont pas croisées avec d'autres sources et ne sont conservées que brièvement, selon les règles de l'hébergeur.",
          ],
        },
        {
          h2: "Formulaire de contact et de demande",
          paragraphs: [
            "Lorsque vous nous contactez via le formulaire de contact ou de demande, nous traitons les données que vous indiquez, par exemple nom, entreprise, adresse e-mail, numéro de téléphone et votre message avec d'éventuelles informations sur votre projet. Nous utilisons ces données uniquement pour répondre à votre demande, établir une offre et rester en contact avec vous.",
            "Les demandes sont enregistrées dans une base de données. Nous utilisons à cet effet le service Neon (Neon Inc., États-Unis) avec une base de données PostgreSQL hébergée dans une région de l'UE. L'accès aux demandes enregistrées nous est réservé et protégé par un identifiant.",
          ],
        },
        {
          h2: "Envoi d'e-mails via Resend",
          paragraphs: [
            "Pour l'envoi d'e-mails liés au formulaire de contact, comme les notifications de nouvelles demandes ou les confirmations de réception, nous utilisons le service Resend (Resend Inc., États-Unis). Votre adresse e-mail, votre nom et le contenu du message sont notamment transmis à Resend et traités pour l'envoi.",
            "Le transfert vers les États-Unis repose sur les clauses contractuelles types de la Commission européenne, reconnues par le Préposé fédéral à la protection des données et à la transparence (PFPDT).",
          ],
        },
        {
          h2: "Cookies",
          paragraphs: [
            "Par défaut, ce site n'utilise ni cookies de suivi ou de marketing, ni services d'analyse qui suivent votre comportement d'un site à l'autre.",
            "Seul un cookie techniquement nécessaire est utilisé pour l'espace d'administration protégé. Il sert uniquement à maintenir la session lors de la connexion de personnes autorisées et ne concerne pas les visiteurs ordinaires. Si nous devions à l'avenir utiliser d'autres cookies ou outils d'analyse, nous adapterions cette déclaration et recueillerions votre consentement lorsque cela est nécessaire.",
          ],
        },
        {
          h2: "Polices de caractères",
          paragraphs: [
            "Les polices utilisées sur ce site (Google Fonts) sont hébergées localement et servies par notre propre hébergement. Aucune connexion aux serveurs de Google n'est établie lors de la consultation du site et aucune donnée n'est transmise à Google.",
          ],
        },
        {
          h2: "Communication de données à l'étranger",
          paragraphs: [
            "Comme décrit ci-dessus, nous faisons appel à des prestataires dont le siège est aux États-Unis ou qui peuvent y traiter des données (Vercel, Neon, Resend). Les États-Unis ne sont pas dans tous les cas considérés comme un État offrant un niveau de protection adéquat.",
            "Nous garantissons une protection appropriée, notamment au moyen de clauses contractuelles types et, lorsque le prestataire est certifié, du Swiss-U.S. Data Privacy Framework ou de l'EU-U.S. Data Privacy Framework. Vous pouvez nous demander une copie de ces garanties.",
          ],
        },
        {
          h2: "Durée de conservation",
          paragraphs: [
            "Nous ne conservons les données personnelles que le temps nécessaire aux finalités indiquées. Les demandes qui n'aboutissent pas à un mandat sont supprimées au plus tard après 24 mois.",
            "Lorsqu'une demande débouche sur un mandat, nous conservons les documents commerciaux conformément aux obligations légales, en Suisse en règle générale pendant dix ans. Les fichiers journaux du serveur ne sont conservés que brièvement, puis supprimés automatiquement.",
          ],
        },
        {
          h2: "Vos droits",
          paragraphs: [
            "Dans le cadre du droit applicable, vous avez le droit de savoir si nous traitons des données personnelles vous concernant et lesquelles. Vous pouvez également demander la rectification de données inexactes, l'effacement de vos données ainsi que leur remise dans un format électronique courant, et vous opposer à un traitement.",
            "Pour exercer vos droits, un e-mail à kontakt@webnova.ch suffit. Nous pouvons demander une preuve d'identité. Les obligations légales de conservation demeurent réservées.",
            "Vous avez en outre le droit de déposer une plainte auprès du Préposé fédéral à la protection des données et à la transparence (PFPDT) ou, lorsque le RGPD s'applique, auprès d'une autorité de contrôle compétente de l'UE.",
          ],
        },
        {
          h2: "Sécurité des données",
          paragraphs: [
            "Nous prenons des mesures techniques et organisationnelles appropriées pour protéger vos données contre la perte, l'utilisation abusive et l'accès non autorisé. Le site est transmis de manière chiffrée (HTTPS) et l'accès aux demandes enregistrées est protégé par mot de passe.",
          ],
        },
        {
          h2: "Modifications de cette déclaration",
          paragraphs: [
            "Nous pouvons adapter cette déclaration à tout moment, par exemple si nous utilisons de nouveaux services ou si les exigences légales évoluent. La version publiée sur ce site fait foi.",
          ],
        },
      ],
    },
  },
};
