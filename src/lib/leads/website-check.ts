"use server";

import { after } from "next/server";
import { z } from "zod";
import { db, hasDb, schema } from "@/db";
import { pushNewLead } from "@/lib/admin/push";
import { adminInbox, escapeHtml, mailColors, mailLayout, sendMail } from "@/lib/email";
import { site } from "@/lib/site";
import { screenSubmission } from "./spam";

/**
 * The quick website check: one step (URL, name, e-mail, optional phone and note), stored as a
 * regular lead with source "website-check" and service "check", so it shows up in the admin
 * inbox and pipeline like every other request.
 */
const checkSchema = z.object({
  locale: z.enum(["de", "fr"]),
  websiteUrl: z
    .string()
    .trim()
    .min(4)
    .max(300)
    .regex(/^(https?:\/\/)?[^\s/]+\.[^\s]{2,}/i),
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  company: z.string().trim().max(160).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  note: z.string().trim().max(300).optional().default(""),
  pageUrl: z.string().max(300).optional().default(""),
  // spam protection
  website2: z.string().max(500).optional().default(""), // honeypot, must stay empty
  token: z.string().max(60).optional(),
});

export type WebsiteCheckInput = z.input<typeof checkSchema>;


async function safeSend(args: Parameters<typeof sendMail>[0]) {
  try {
    return await sendMail(args);
  } catch (e) {
    console.error("[website-check] mail failed", e);
    return { ok: false as const, error: String(e) };
  }
}

export async function submitWebsiteCheck(input: WebsiteCheckInput): Promise<{ ok: boolean; field?: string }> {
  const parsed = checkSchema.safeParse(input);
  if (!parsed.success) return { ok: false, field: String(parsed.error.issues[0]?.path[0] ?? "") };
  const v = parsed.data;


  const url = /^https?:\/\//i.test(v.websiteUrl) ? v.websiteUrl : `https://${v.websiteUrl}`;
  const message = v.note ? `Website-Check: ${v.note}` : "Website-Check angefragt";

  const row = {
    source: "website-check",
    locale: v.locale,
    name: v.name,
    company: v.company || null,
    email: v.email,
    phone: v.phone || null,
    preferredContact: v.phone ? "phone" : "email",
    services: ["check"],
    details: null,
    hasWebsite: true,
    websiteUrl: url,
    message,
    pageUrl: v.pageUrl || null,
  };

  // Spam: pretend success (bots learn nothing), no push, no mail; kept in Admin > Spam-Filter.
  const screen = await screenSubmission({
    form: "website-check",
    token: v.token,
    honeypot: v.website2,
    fields: { name: v.name, company: v.company, email: v.email, phone: v.phone, message: v.note },
    row,
  });
  if (screen.spam) return { ok: true };

  let leadId: number | undefined;
  let stored = false;
  if (hasDb()) {
    try {
      const [created] = await db()
        .insert(schema.leads)
        .values({ ...row, ipHash: screen.visitor })
        .returning({ id: schema.leads.id });
      leadId = created?.id;
      stored = true;
    } catch (e) {
      console.error("[website-check] db insert failed", e);
    }
  }

  // Push to the admin devices, after the response so the visitor does not wait for it.
  after(() =>
    pushNewLead({
      title: "Neuer Website-Check",
      body: `${url.replace(/^https?:\/\//, "")} · ${v.company ? `${v.name}, ${v.company}` : v.name}${v.locale === "fr" ? " (FR)" : ""}`,
      url: leadId ? `/admin/anfragen/${leadId}` : "/admin/anfragen",
      tag: leadId ? `lead-${leadId}` : undefined,
    }),
  );

  const rows: [string, string][] = [
    ["Website", url],
    ["Name", v.name],
    ["Firma", v.company || "–"],
    ["E-Mail", v.email],
    ["Telefon", v.phone || "–"],
    ["Notiz", v.note || "–"],
    ["Sprache", v.locale.toUpperCase()],
    ["Quelle", `website-check ${v.pageUrl}`],
  ];
  const table = rows
    .map(
      ([k, val]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:${mailColors.muted};vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0;color:${mailColors.ink}">${escapeHtml(val)}</td></tr>`,
    )
    .join("");
  const adminUrl = leadId ? `${site.url}/admin/anfragen/${leadId}` : `${site.url}/admin/anfragen`;

  const notify = await safeSend({
    to: adminInbox(),
    replyTo: v.email,
    subject: `Website-Check: ${url.replace(/^https?:\/\//, "")} (${v.name})`,
    html: mailLayout(
      `<h2 style="margin:0 0 16px;font-size:22px;color:${mailColors.ink}">Neuer Website-Check über webnova.ch</h2><table cellpadding="0" cellspacing="0" style="font-size:14px">${table}</table>${
        stored
          ? `<p style="margin-top:24px"><a href="${adminUrl}" style="background:${mailColors.accent};color:#ffffff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;display:inline-block">Im Admin öffnen</a></p>`
          : `<p style="color:${mailColors.danger}">Achtung: Anfrage konnte nicht in der Datenbank gespeichert werden.</p>`
      }`,
      false,
    ),
  });

  const fr = v.locale === "fr";
  // Full name: "Guten Tag Vorname" does not go with "Sie"; the gender is unknown, so no Herr/Frau.
  const fullName = escapeHtml(v.name.trim().replace(/\s+/g, " "));
  const site2 = escapeHtml(url.replace(/^https?:\/\//, ""));
  await safeSend({
    to: v.email,
    replyTo: site.email,
    subject: fr ? "Votre analyse de site chez Webnova" : "Ihr Website-Check bei Webnova",
    html: mailLayout(
      fr
        ? `<p>Bonjour ${fullName},</p><p>Merci, nous avons bien reçu votre demande d'analyse pour <strong>${site2}</strong>. Ferhat Demir examine votre site personnellement et vous contacte dans un délai d'un jour ouvrable.</p><p>Pour toute question, vous pouvez nous joindre au <a href="${site.phoneHref}">${site.phone}</a>.</p><p>Meilleures salutations<br><strong style="color:${mailColors.ink}">Ferhat Demir</strong><br>Webnova</p>`
        : `<p>Guten Tag ${fullName}</p><p>Vielen Dank, wir haben Ihren Website-Check für <strong>${site2}</strong> erhalten. Ferhat Demir sieht sich Ihre Webseite persönlich an und meldet sich innert eines Arbeitstages bei Ihnen.</p><p>Bei Fragen erreichen Sie uns unter <a href="${site.phoneHref}">${site.phone}</a>.</p><p>Freundliche Grüsse<br><strong style="color:${mailColors.ink}">Ferhat Demir</strong><br>Webnova</p>`,
    ),
  });

  return { ok: stored || notify.ok };
}
