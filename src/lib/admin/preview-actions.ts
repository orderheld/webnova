"use server";

import { flashDone } from "./flash";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { escapeHtml, mailColors, mailLayout, sendMail } from "@/lib/email";
import { logActivity } from "./billing";
import { type FormState, parseForm, zOptId, zText } from "./form";
import { newPreviewToken, previewFileBuffer, previewPdf, previewUrl } from "./previews";
import { type Proposal, proposalSchema } from "./proposal";
import { getSettings } from "./settings";

const previewSchema = z.object({
  title: z.string().trim().min(1).max(120),
  customerId: zOptId,
  contactName: zText(120),
  contactEmail: z.union([z.literal(""), z.email().max(200)]).default(""),
  contactPhone: zText(60),
  language: z.enum(["de", "fr"]).default("de"),
  note: zText(2000),
});

/** New preview without files; the upload form sends the ZIP right after and then opens the preview. */
export async function createPreviewAction(fd: FormData): Promise<{ id?: number; error?: string }> {
  await requireAdmin();
  const r = parseForm(previewSchema, fd);
  if (!r.data) return { error: r.error };
  for (let attempt = 0; attempt < 3; attempt++) {
    const [row] = await db()
      .insert(schema.previews)
      .values({ ...r.data, token: newPreviewToken() })
      .onConflictDoNothing({ target: schema.previews.token })
      .returning({ id: schema.previews.id });
    if (row) return { id: row.id };
  }
  return { error: "Link konnte nicht erstellt werden, bitte nochmals versuchen." };
}

export async function savePreviewAction(id: number, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(previewSchema, fd);
  if (!r.data) return { error: r.error };
  await db()
    .update(schema.previews)
    .set({ ...r.data, updatedAt: new Date() })
    .where(eq(schema.previews.id, id));
  await flashDone("Gespeichert");
  return { ok: true };
}

/** Switched off, the link shows «nicht mehr verfügbar»; switched on again, it works as before. */
export async function setPreviewActiveAction(id: number, active: boolean) {
  await requireAdmin();
  await db().update(schema.previews).set({ active, updatedAt: new Date() }).where(eq(schema.previews.id, id));
  await flashDone(active ? "Link ist wieder aktiv" : "Link ist ausgeschaltet");
}

/** Deletes the preview with all files and the PDF; the link stops working for good. */
export async function deletePreviewAction(id: number) {
  await requireAdmin();
  await db().delete(schema.previews).where(eq(schema.previews.id, id));
  await flashDone("Vorschau gelöscht");
  redirect("/admin/vorschauen");
}

export async function deletePreviewPdfAction(id: number) {
  await requireAdmin();
  const f = schema.previewFiles;
  await db().transaction(async (tx) => {
    await tx.update(schema.previews).set({ pdfFileId: null, updatedAt: new Date() }).where(eq(schema.previews.id, id));
    await tx.delete(f).where(and(eq(f.previewId, id), eq(f.kind, "pdf")));
  });
  await flashDone("PDF entfernt");
}

/** Ferhat sent the link himself (WhatsApp, phone): noted like an e-mail, so the list shows it as sent. */
export async function markPreviewSentAction(id: number, channel: string) {
  await requireAdmin();
  const [p] = await db()
    .update(schema.previews)
    .set({ sentAt: new Date(), sentTo: channel, updatedAt: new Date() })
    .where(eq(schema.previews.id, id))
    .returning();
  if (p?.customerId) await logActivity(`Vorschau «${p.title}» per ${channel} gesendet`, { customerId: p.customerId });
  await flashDone("Als gesendet vermerkt");
}

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/**
 * Sends the preview link (and the proposal PDF, if ticked) to the client, only when Ferhat clicks «Jetzt senden».
 * The link also gets a button, so it works in mail apps that do not turn text into links.
 */
export async function sendPreviewAction(id: number, fd: FormData): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();
  const str = (k: string) => String(fd.get(k) ?? "").trim();
  const to = str("to");
  const cc = str("cc");
  const subject = str("subject");
  const text = str("text");
  if (!isEmail(to)) return { error: "Bitte gültige E-Mail-Adresse angeben." };
  if (cc && !isEmail(cc)) return { error: "Bitte gültige Kopie-Adresse angeben." };
  if (!subject || !text) return { error: "Betreff und Nachricht dürfen nicht leer sein." };
  const [p] = await db().select().from(schema.previews).where(eq(schema.previews.id, id));
  if (!p) return { error: "Vorschau nicht gefunden." };
  if (!p.active || p.version === 0) return { error: "Der Link ist nicht aktiv. Bitte zuerst die Vorschau hochladen oder einschalten." };

  const attachments: { filename: string; content: Buffer }[] = [];
  if (fd.get("pdf") === "on") {
    const file = await previewPdf(p);
    if (!file) return { error: "Es ist kein PDF hinterlegt." };
    attachments.push({ filename: file.path, content: await previewFileBuffer(file.id) });
  }

  const url = previewUrl(p.token);
  const button = `<p style="margin:22px 0"><a href="${url}" style="background:${mailColors.accent};color:#ffffff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;display:inline-block">${p.language === "fr" ? "Ouvrir l’aperçu" : "Vorschau öffnen"}</a></p>`;
  const paragraphs = text.split(/\n{2,}/).map((para) => {
    const html = `<p style="margin:0 0 14px;white-space:pre-line">${escapeHtml(para).replace(escapeHtml(url), `<a href="${url}">${escapeHtml(url)}</a>`)}</p>`;
    return para.includes(url) ? html + button : html;
  });
  const res = await sendMail({
    to: cc ? [to, cc] : to,
    subject,
    html: mailLayout(paragraphs.join("")),
    text,
    replyTo: (await getSettings()).email,
    attachments,
  });
  if (!res.ok) return { error: `Versand fehlgeschlagen: ${res.error}` };
  await db().update(schema.previews).set({ sentAt: new Date(), sentTo: to, updatedAt: new Date() }).where(eq(schema.previews.id, id));
  if (p.customerId) await logActivity(`Vorschau «${p.title}» an ${to} gesendet`, { customerId: p.customerId }, "email");
  await flashDone("Gesendet");
  return { ok: true };
}

const proposalSections: Record<string, string> = {
  date: "Datum",
  validDays: "Gültigkeit",
  recipient: "Für",
  accent: "Akzentfarbe",
  cover: "Titelseite",
  situation: "Ausgangslage",
  concept: "Konzept",
  desktop: "Screenshots Computer",
  mobile: "Screenshots Handy",
  gallery: "Bildwelt",
  structure: "Aufbau",
  plan: "Vorgehen",
  after: "Nach Ihrer Zusage",
  price: "Investition",
  next: "Nächste Schritte",
};

/** Saves the texts, pictures and price of the PDF proposal (Admin > Vorschauen > PDF-Vorschlag). */
export async function saveProposalAction(id: number, input: Proposal): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();
  const r = proposalSchema.safeParse(input);
  if (!r.success) {
    const issue = r.error.issues[0];
    const section = proposalSections[String(issue?.path[0])] ?? "Eingabe";
    return { error: `${section}: ${issue?.code === "too_big" ? "zu lang oder zu viele Einträge" : "ungültige Angabe"}.` };
  }
  const [row] = await db()
    .update(schema.previews)
    .set({ proposal: r.data, updatedAt: new Date() })
    .where(eq(schema.previews.id, id))
    .returning({ id: schema.previews.id });
  if (!row) return { error: "Vorschau nicht gefunden." };
  return { ok: true };
}
