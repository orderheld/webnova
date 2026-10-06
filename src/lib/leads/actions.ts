"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db, hasDb, schema } from "@/db";
import { adminInbox, escapeHtml, mailLayout, sendMail } from "@/lib/email";
import { site } from "@/lib/site";
import {
  budgetOptions,
  companySizeOptions,
  contactOptions,
  label,
  serviceOptions,
  timelineOptions,
} from "./options";

const leadSchema = z.object({
  locale: z.enum(["de", "fr"]),
  source: z.string().max(60).default("anfrage"),
  services: z.array(z.enum(serviceOptions)).min(1).max(8),
  hasWebsite: z.boolean().nullable(),
  websiteUrl: z.string().max(300).optional().default(""),
  companySize: z.enum(companySizeOptions).nullable(),
  industry: z.string().max(120).optional().default(""),
  budget: z.enum(budgetOptions).nullable(),
  timeline: z.enum(timelineOptions).nullable(),
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().default(""),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  preferredContact: z.enum(contactOptions).nullable(),
  message: z.string().max(4000).optional().default(""),
  pageUrl: z.string().max(300).optional().default(""),
  // spam protection
  website2: z.string().max(0).optional().default(""), // honeypot, must stay empty
  startedAt: z.number(),
});

export type LeadInput = z.input<typeof leadSchema>;

// naive in-memory rate limit per instance
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 5;
}

export async function submitLead(input: LeadInput): Promise<{ ok: boolean }> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const v = parsed.data;

  // Bots fill the honeypot or submit within 3 seconds: pretend success, store nothing.
  if (v.website2 || Date.now() - v.startedAt < 3000) return { ok: true };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return { ok: false };

  const row = {
    source: v.source,
    locale: v.locale,
    name: v.name,
    company: v.company || null,
    email: v.email,
    phone: v.phone || null,
    preferredContact: v.preferredContact,
    services: v.services,
    hasWebsite: v.hasWebsite,
    websiteUrl: v.websiteUrl || null,
    companySize: v.companySize,
    industry: v.industry || null,
    budget: v.budget,
    timeline: v.timeline,
    message: v.message || null,
    pageUrl: v.pageUrl || null,
  };

  let leadId: number | undefined;
  let stored = false;
  if (hasDb()) {
    try {
      const [created] = await db().insert(schema.leads).values(row).returning({ id: schema.leads.id });
      leadId = created?.id;
      stored = true;
    } catch (e) {
      console.error("[lead] db insert failed", e);
    }
  }

  const rows: [string, string][] = [
    ["Name", v.name],
    ["Firma", v.company || "–"],
    ["E-Mail", v.email],
    ["Telefon", v.phone || "–"],
    ["Bevorzugter Kontakt", label("preferredContact", v.preferredContact)],
    ["Leistungen", v.services.map((s) => label("services", s)).join(", ")],
    ["Webseite vorhanden", v.hasWebsite === null ? "–" : v.hasWebsite ? `Ja ${v.websiteUrl}` : "Nein"],
    ["Unternehmensgrösse", label("companySize", v.companySize)],
    ["Branche", v.industry || "–"],
    ["Budget (CHF)", label("budget", v.budget)],
    ["Zeitplan", label("timeline", v.timeline)],
    ["Sprache", v.locale.toUpperCase()],
    ["Quelle", `${v.source} ${v.pageUrl}`],
    ["Nachricht", v.message || "–"],
  ];
  const table = rows
    .map(
      ([k, val]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#66666d;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0">${escapeHtml(val).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  const adminUrl = leadId ? `${site.url}/admin/anfragen/${leadId}` : `${site.url}/admin/anfragen`;

  const notify = await sendMail({
    to: adminInbox(),
    replyTo: v.email,
    subject: `Neue Anfrage: ${v.company || v.name} (${v.services.map((s) => label("services", s)).join(", ")})`,
    html: mailLayout(
      `<h2 style="margin:0 0 16px;font-size:22px">Neue Anfrage über webnova.ch</h2><table cellpadding="0" cellspacing="0" style="font-size:14px">${table}</table>${
        stored ? `<p style="margin-top:24px"><a href="${adminUrl}" style="background:#0e0e10;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">Im Admin öffnen</a></p>` : `<p style="color:#c2261d">Achtung: Anfrage konnte nicht in der Datenbank gespeichert werden.</p>`
      }`,
      false,
    ),
  });

  const fr = v.locale === "fr";
  const firstName = v.name.split(" ")[0];
  await sendMail({
    to: v.email,
    replyTo: site.email,
    subject: fr ? "Votre demande chez Webnova" : "Ihre Anfrage bei Webnova",
    html: mailLayout(
      fr
        ? `<p>Bonjour ${escapeHtml(firstName)},</p><p>Merci pour votre demande. Nous avons bien reçu vos informations et vous contactons personnellement dans un délai d'un jour ouvrable.</p><p>Pour toute question urgente, vous pouvez nous joindre au <a href="${site.phoneHref}">${site.phone}</a>.</p><p>Meilleures salutations<br>Webnova</p>`
        : `<p>Guten Tag ${escapeHtml(firstName)}</p><p>Vielen Dank für Ihre Anfrage. Wir haben Ihre Angaben erhalten und melden uns innert eines Arbeitstages persönlich bei Ihnen.</p><p>Bei dringenden Fragen erreichen Sie uns unter <a href="${site.phoneHref}">${site.phone}</a>.</p><p>Freundliche Grüsse<br>Webnova</p>`,
    ),
  });

  // The lead counts as received if it reached either the database or the inbox.
  return { ok: stored || notify.ok };
}
