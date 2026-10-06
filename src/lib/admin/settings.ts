import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { site } from "@/lib/site";

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
};

export async function getSettings(): Promise<CompanySettings> {
  const [row] = await db().select().from(schema.settings).where(eq(schema.settings.key, "company"));
  return { ...defaultSettings, ...((row?.value as Partial<CompanySettings>) ?? {}) };
}

export async function saveSettings(value: CompanySettings) {
  await db()
    .insert(schema.settings)
    .values({ key: "company", value })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value } });
}
