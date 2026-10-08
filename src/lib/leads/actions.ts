"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db, hasDb, schema } from "@/db";
import { adminInbox, escapeHtml, mailColors, mailLayout, sendMail } from "@/lib/email";
import { site } from "@/lib/site";
import { describeDetails } from "./details";
import { parseDetails } from "./details-parse";
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
  services: z.array(z.enum(serviceOptions)).min(1).max(serviceOptions.length),
  /** service-specific answers, cleaned by parseDetails against the question catalogue */
  details: z.unknown().optional(),
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

/** A mail failure (network, missing key) must never lose a lead that is already stored. */
async function safeSend(args: Parameters<typeof sendMail>[0]) {
  try {
    return await sendMail(args);
  } catch (e) {
    console.error("[lead] mail failed", e);
    return { ok: false as const, error: String(e) };
  }
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

  const services = [...new Set(v.services)];
  const details = parseDetails(v.details, services);

  const row = {
    source: v.source,
    locale: v.locale,
    name: v.name,
    company: v.company || null,
    email: v.email || null,
    phone: v.phone || null,
    preferredContact: v.preferredContact,
    services,
    details,
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
    ["E-Mail", v.email || "–"],
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
  const cell = (val: string) => escapeHtml(val).replace(/\n/g, "<br>");
  const table = rows
    .map(
      ([k, val]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:${mailColors.muted};vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0;color:${mailColors.ink}">${cell(val)}</td></tr>`,
    )
    .join("");
  const detailHtml = describeDetails(details)
    .map(
      (g) =>
        `<h3 style="margin:24px 0 8px;font-size:16px;color:${mailColors.accent}">${escapeHtml(g.title)}</h3><table cellpadding="0" cellspacing="0" style="font-size:14px">${g.rows
          .map(([k, val]) => `<tr><td style="padding:4px 12px 4px 0;color:${mailColors.muted};vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0;color:${mailColors.ink}">${cell(val)}</td></tr>`)
          .join("")}</table>`,
    )
    .join("");
  const adminUrl = leadId ? `${site.url}/admin/anfragen/${leadId}` : `${site.url}/admin/anfragen`;

  const notify = await safeSend({
    to: adminInbox(),
    replyTo: v.email || undefined,
    subject: `Neue Anfrage: ${v.company || v.name} (${v.services.map((s) => label("services", s)).join(", ")})`,
    html: mailLayout(
      `<h2 style="margin:0 0 16px;font-size:22px;color:${mailColors.ink}">Neue Anfrage über webnova.ch</h2><table cellpadding="0" cellspacing="0" style="font-size:14px">${table}</table>${detailHtml}${
        stored ? `<p style="margin-top:24px"><a href="${adminUrl}" style="background:${mailColors.accent};color:#ffffff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;display:inline-block">Im Admin öffnen</a></p>` : `<p style="color:${mailColors.danger}">Achtung: Anfrage konnte nicht in der Datenbank gespeichert werden.</p>`
      }`,
      false,
    ),
  });

  const fr = v.locale === "fr";
  const firstName = v.name.split(" ")[0];
  // Phone-only leads get no confirmation mail; Ferhat calls back instead.
  if (v.email) await safeSend({
    to: v.email,
    replyTo: site.email,
    subject: fr ? "Votre demande chez Webnova" : "Ihre Anfrage bei Webnova",
    html: mailLayout(
      fr
        ? `<p>Bonjour ${escapeHtml(firstName)},</p><p>Merci pour votre demande. Nous avons bien reçu vos informations et vous contactons personnellement dans un délai d'un jour ouvrable.</p><p>Pour toute question urgente, vous pouvez nous joindre au <a href="${site.phoneHref}">${site.phone}</a>.</p><p>Meilleures salutations<br><strong style="color:${mailColors.ink}">Ferhat Demir</strong><br>Webnova</p>`
        : `<p>Guten Tag ${escapeHtml(firstName)}</p><p>Vielen Dank für Ihre Anfrage. Wir haben Ihre Angaben erhalten und melden uns innert eines Arbeitstages persönlich bei Ihnen.</p><p>Bei dringenden Fragen erreichen Sie uns unter <a href="${site.phoneHref}">${site.phone}</a>.</p><p>Freundliche Grüsse<br><strong style="color:${mailColors.ink}">Ferhat Demir</strong><br>Webnova</p>`,
    ),
  });

  // The lead counts as received if it reached either the database or the inbox.
  return { ok: stored || notify.ok };
}
