import "server-only";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { db, schema } from "@/db";
import { site } from "@/lib/site";
import { defaultCalculatorConfig, type CalculatorConfig } from "./calculator";

export interface CompanySettings {
  companyName: string;
  owner: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  website: string;
  iban: string;
  bankName: string;
  /** company UID, shown in the document footer */
  uid: string;
  vatNumber: string;
  vatEnabled: boolean;
  vatRate: number;
  hourlyRate: number;
  paymentTermDays: number;
  quoteValidityDays: number;
  quotePrefix: string;
  invoicePrefix: string;
  quoteIntro: string;
  quoteOutro: string;
  invoiceIntro: string;
  invoiceOutro: string;
  quoteEmailText: string;
  invoiceEmailText: string;
  // credit notes, reminders, recurring billing
  creditPrefix: string;
  creditIntro: string;
  creditOutro: string;
  reminderDays: number;
  reminderFee1: number;
  reminderFee2: number;
  reminderText1: string;
  reminderText2: string;
  reminderEmailText: string;
  subscriptionLeadDays: number;
  subscriptionInvoiceTitle: string;
  subscriptionIntro: string;
  // client previews (Admin > Vorschauen): {anrede}, {link}, {absender}; the chat text also {pdf}
  previewEmailText: string;
  previewEmailTextFr: string;
  previewChatText: string;
  previewChatTextFr: string;
}

export const defaultSettings: CompanySettings = {
  companyName: site.legalName,
  owner: "Ferhat Demir",
  street: site.address.street,
  zip: site.address.zip,
  city: site.address.city,
  country: "CH",
  email: site.email,
  phone: site.phone,
  website: "webnova.ch",
  iban: "",
  bankName: "",
  uid: "CHE-439.891.660",
  vatNumber: "",
  vatEnabled: false,
  vatRate: 8.1,
  hourlyRate: 120,
  paymentTermDays: 30,
  quoteValidityDays: 30,
  quotePrefix: "OF",
  invoicePrefix: "RE",
  quoteIntro: "Vielen Dank für Ihr Interesse. Gerne unterbreiten wir Ihnen folgende Offerte:",
  quoteOutro:
    "Diese Offerte ist 30 Tage gültig. Bei Fragen sind wir jederzeit gerne für Sie da. Wir freuen uns auf die Zusammenarbeit.",
  invoiceIntro: "Vielen Dank für Ihren Auftrag. Wir erlauben uns, folgende Leistungen in Rechnung zu stellen:",
  invoiceOutro: "Bitte begleichen Sie den Betrag innert der Zahlungsfrist mit dem beiliegenden QR-Einzahlungsschein.",
  quoteEmailText:
    "Guten Tag {name}\n\nVielen Dank für das angenehme Gespräch. Im Anhang finden Sie unsere Offerte {nummer}.\n\nBei Fragen melden Sie sich jederzeit.\n\nFreundliche Grüsse\n{absender}",
  invoiceEmailText:
    "Guten Tag {name}\n\nIm Anhang erhalten Sie die Rechnung {nummer} über CHF {betrag}, zahlbar bis {faellig}.\n\nVielen Dank für Ihr Vertrauen.\n\nFreundliche Grüsse\n{absender}",
  creditPrefix: "GS",
  creditIntro: "Wir schreiben Ihnen folgende Leistungen gut:",
  creditOutro: "Der Betrag wird mit offenen Rechnungen verrechnet oder Ihnen auf Wunsch zurückerstattet.",
  reminderDays: 10,
  reminderFee1: 0,
  reminderFee2: 20,
  reminderText1:
    "Sicher ist es Ihrer Aufmerksamkeit entgangen: Für die unten aufgeführte Rechnung konnten wir noch keinen Zahlungseingang feststellen. Wir bitten Sie, den offenen Betrag innert der neuen Frist zu begleichen. Sollte sich Ihre Zahlung mit diesem Schreiben gekreuzt haben, betrachten Sie diese Erinnerung als gegenstandslos.",
  reminderText2:
    "Trotz unserer Zahlungserinnerung ist der unten aufgeführte Betrag noch offen. Wir bitten Sie, die Zahlung innert der neuen Frist vorzunehmen. Bei Fragen oder Schwierigkeiten melden Sie sich bitte direkt bei uns.",
  reminderEmailText:
    "Guten Tag {name}\n\nFür die Rechnung {nummer} konnten wir noch keinen Zahlungseingang feststellen. Im Anhang finden Sie die Zahlungserinnerung über CHF {betrag}, zahlbar bis {faellig}.\n\nFalls Sie bereits bezahlt haben, betrachten Sie diese Nachricht als gegenstandslos.\n\nFreundliche Grüsse\n{absender}",
  subscriptionLeadDays: 14,
  subscriptionInvoiceTitle: "Wiederkehrende Leistungen",
  subscriptionIntro: "Gerne stellen wir Ihnen die wiederkehrenden Leistungen für die folgende Periode in Rechnung:",
  previewEmailText:
    "{anrede}\n\nVielen Dank für das angenehme Gespräch. Wie besprochen sende ich Ihnen meinen Vorschlag für Ihren neuen Webauftritt.\n\nHier sehen Sie die Vorschau der Startseite:\n{link}\n\nAm besten schauen Sie die Seite zuerst am Computer an und scrollen langsam durch. Auf dem Handy öffnen Sie einfach denselben Link.\n\nIm angehängten PDF finden Sie das Konzept, den Aufbau der Seiten, den Ablauf und den Preis.\n\nLogo, Bilder und Texte sind in der Vorschau noch Platzhalter und werden durch Ihre eigenen ersetzt.\n\nWenn Sie sich eine Zusammenarbeit vorstellen können, bespreche ich die nächsten Schritte gerne persönlich mit Ihnen. Wann würde es Ihnen passen?\n\nFreundliche Grüsse\n{absender}",
  previewEmailTextFr:
    "{anrede}\n\nMerci beaucoup pour notre agréable échange. Comme convenu, je vous envoie ma proposition pour votre nouveau site web.\n\nVoici l'aperçu de la page d'accueil :\n{link}\n\nLe mieux est de regarder la page d'abord sur un ordinateur et de la faire défiler lentement. Sur votre téléphone, il suffit d'ouvrir le même lien.\n\nDans le PDF ci-joint, vous trouverez le concept, la structure des pages, le déroulement et le prix.\n\nLe logo, les images et les textes de l'aperçu sont encore provisoires et seront remplacés par les vôtres.\n\nSi une collaboration vous intéresse, je serai heureux d'en discuter avec vous de vive voix. Quand cela vous conviendrait-il ?\n\nMeilleures salutations\n{absender}",
  previewChatText:
    "{anrede}\n\nVielen Dank nochmals für das angenehme Gespräch. Wie versprochen sende ich Ihnen meinen Vorschlag für Ihren Webauftritt.\n\nVorschau der Startseite:\n{link}\n\nAm besten schauen Sie die Seite zuerst am Computer an und scrollen langsam. Auf dem Handy öffnen Sie einfach denselben Link.\n\n{pdf}\n\nWenn Sie sich eine Zusammenarbeit vorstellen können, bespreche ich die nächsten Schritte gerne persönlich mit Ihnen. Wann würde es Ihnen passen?\n\nFreundliche Grüsse\n{absender}\nWebnova",
  previewChatTextFr:
    "{anrede}\n\nMerci encore pour notre agréable échange. Comme promis, je vous envoie ma proposition pour votre site web.\n\nAperçu de la page d'accueil :\n{link}\n\nLe mieux est de regarder la page d'abord sur un ordinateur et de la faire défiler lentement. Sur votre téléphone, il suffit d'ouvrir le même lien.\n\n{pdf}\n\nSi une collaboration vous intéresse, je serai heureux d'en discuter avec vous de vive voix. Quand cela vous conviendrait-il ?\n\nMeilleures salutations\n{absender}\nWebnova",
};

/** Company settings; cached per request, so layout and page share one query. */
export const getSettings = cache(async (): Promise<CompanySettings> => {
  const [row] = await db().select().from(schema.settings).where(eq(schema.settings.key, "company"));
  return { ...defaultSettings, ...((row?.value as Partial<CompanySettings>) ?? {}) };
});

export async function saveSettings(value: CompanySettings) {
  await db()
    .insert(schema.settings)
    .values({ key: "company", value })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value } });
}

/** Calculator prices (packages, add-ons, recurring fees), editable under Rechner > Preise. */
export async function getCalculatorConfig(): Promise<CalculatorConfig> {
  const [row] = await db().select().from(schema.settings).where(eq(schema.settings.key, "calculator"));
  const v = (row?.value as Partial<CalculatorConfig> | undefined) ?? {};
  return { ...defaultCalculatorConfig, ...v };
}

export async function saveCalculatorConfig(value: CalculatorConfig) {
  await db()
    .insert(schema.settings)
    .values({ key: "calculator", value })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value } });
}
