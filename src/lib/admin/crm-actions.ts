"use server";

import { flashDone } from "./flash";

import { asc, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, schema } from "@/db";
import { activityTypes, leadStatuses, type LeadStatus, type LineItem } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { insertTemplateTasks, logActivity } from "./billing";
import { parseForm, zBool, zId, zOptDate, zOptId, zOptNum, zOptText, zReq, zUrl, type FormState } from "./form";
import { leadStageLabels } from "./labels";
import { addDaysIso, computeTotals, todayIso } from "./money";
import { nextNumber } from "./numbering";
import { getSettings } from "./settings";


/* ───────────── Leads ───────────── */

const leadSchema = z.object({
  name: zReq(160),
  company: zOptText(200),
  email: z.union([z.literal(""), z.email().max(200)]).optional().transform((v) => v || null),
  phone: zOptText(60),
  websiteUrl: zUrl,
  industry: zOptText(120),
  street: zOptText(200),
  zip: zOptText(12),
  city: zOptText(120),
  source: z.string().max(40).default("akquise"),
  status: z.enum(leadStatuses).default("neu"),
  value: zOptNum,
  followUpAt: zOptDate,
  websiteRating: zOptNum,
  websiteNotes: zOptText(),
  notes: zOptText(),
  lostReason: zOptText(500),
  hasWebsite: z.enum(["", "ja", "nein"]).optional(),
});

export async function saveLeadAction(id: number | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(leadSchema, fd);
  if (!r.data) return { error: r.error };
  const { hasWebsite, websiteRating, ...v } = r.data;
  const values = {
    ...v,
    websiteRating: websiteRating ? Math.min(5, Math.max(1, Math.round(websiteRating))) : null,
    hasWebsite: hasWebsite === "ja" ? true : hasWebsite === "nein" ? false : v.websiteUrl ? true : null,
    updatedAt: new Date(),
  };
  if (id) {
    const [old] = await db().select({ status: schema.leads.status }).from(schema.leads).where(eq(schema.leads.id, id));
    await db().update(schema.leads).set(values).where(eq(schema.leads.id, id));
    if (old && old.status !== values.status) await logActivity(`Phase: ${leadStageLabels[old.status]} → ${leadStageLabels[values.status]}`, { leadId: id });
    await flashDone("Gespeichert");
    return { ok: true, message: "Gespeichert." };
  }
  const [lead] = await db().insert(schema.leads).values(values).returning({ id: schema.leads.id });
  await logActivity("Lead erfasst", { leadId: lead.id });
  await flashDone("Gespeichert");
  redirect(`/admin/anfragen/${lead.id}`);
}

export async function deleteLeadAction(id: number) {
  await requireAdmin();
  await db().delete(schema.leads).where(eq(schema.leads.id, id));
  await flashDone("Gelöscht");
  redirect("/admin/anfragen");
}

export async function setLeadStageAction(id: number, stage: LeadStatus) {
  await requireAdmin();
  if (!leadStatuses.includes(stage)) return;
  const [old] = await db().select({ status: schema.leads.status }).from(schema.leads).where(eq(schema.leads.id, id));
  if (!old || old.status === stage) return;
  await db().update(schema.leads).set({ status: stage, updatedAt: new Date() }).where(eq(schema.leads.id, id));
  await logActivity(`Phase: ${leadStageLabels[old.status]} → ${leadStageLabels[stage]}`, { leadId: id });
  await flashDone("Aktualisiert");
}

export async function setLeadFollowUpAction(id: number, date: string | null) {
  await requireAdmin();
  const d = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
  await db().update(schema.leads).set({ followUpAt: d, updatedAt: new Date() }).where(eq(schema.leads.id, id));
  await flashDone("Gespeichert");
}

/** Postpones a follow-up by n days from today (quick buttons on the dashboard). */
export async function snoozeFollowUpAction(id: number, days: number) {
  await requireAdmin();
  await db().update(schema.leads).set({ followUpAt: addDaysIso(todayIso(), days), updatedAt: new Date() }).where(eq(schema.leads.id, id));
  await flashDone("Aktualisiert");
}

async function customerFromLead(leadId: number) {
  const [lead] = await db().select().from(schema.leads).where(eq(schema.leads.id, leadId));
  if (!lead) return null;
  if (lead.customerId) return { lead, customerId: lead.customerId };
  const [first, ...rest] = lead.name.split(" ");
  const [c] = await db()
    .insert(schema.customers)
    .values({
      company: lead.company,
      firstName: lead.company ? first : first,
      lastName: rest.join(" ") || null,
      email: lead.email,
      phone: lead.phone,
      website: lead.websiteUrl,
      street: lead.street,
      zip: lead.zip,
      city: lead.city,
      industry: lead.industry,
      language: lead.locale,
      notes: lead.message ? `Aus Lead #${lead.id}: ${lead.message}` : `Aus Lead #${lead.id}`,
    })
    .returning({ id: schema.customers.id });
  await db().update(schema.leads).set({ customerId: c.id, updatedAt: new Date() }).where(eq(schema.leads.id, leadId));
  // the lead's activity history also shows on the customer
  await db().update(schema.activities).set({ customerId: c.id }).where(eq(schema.activities.leadId, leadId));
  await logActivity(`Kunde aus Lead «${lead.company || lead.name}» angelegt`, { leadId, customerId: c.id });
  return { lead, customerId: c.id };
}

export async function leadToCustomerAction(id: number) {
  await requireAdmin();
  const r = await customerFromLead(id);
  if (!r) redirect("/admin/anfragen");
  if (r.lead.status === "neu") await db().update(schema.leads).set({ status: "kontaktiert" }).where(eq(schema.leads.id, id));
  await flashDone("Gespeichert");
  redirect(`/admin/kunden/${r.customerId}`);
}

const convertSchema = z.object({
  customerMode: z.enum(["neu", "bestehend"]).default("neu"),
  customerId: zOptId,
  createProject: zBool,
  projectName: zOptText(200),
  templateId: zOptId,
  createQuote: zBool,
  quoteTitle: zOptText(200),
});

/** Lead → customer (+ project with template tasks) (+ quote prefilled from the template's services) in one step. */
export async function convertLeadAction(id: number, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(convertSchema, fd);
  if (!r.data) return { error: r.error };
  const v = r.data;
  const [lead] = await db().select().from(schema.leads).where(eq(schema.leads.id, id));
  if (!lead) return { error: "Lead nicht gefunden." };
  let customerId: number;
  if (v.customerMode === "bestehend") {
    if (!v.customerId) return { error: "Bitte einen bestehenden Kunden wählen." };
    customerId = v.customerId;
    await db().update(schema.leads).set({ customerId }).where(eq(schema.leads.id, id));
    await db().update(schema.activities).set({ customerId }).where(eq(schema.activities.leadId, id));
  } else {
    customerId = (await customerFromLead(id))!.customerId;
  }
  const s = await getSettings();
  const today = todayIso();
  const label = lead.company || lead.name;
  const tpl = v.templateId ? (await db().select().from(schema.projectTemplates).where(eq(schema.projectTemplates.id, v.templateId)))[0] : undefined;

  let projectId: number | null = null;
  if (v.createProject) {
    const [p] = await db()
      .insert(schema.projects)
      .values({ name: v.projectName || `${tpl?.name ?? "Projekt"} ${label}`, customerId, leadId: id, startDate: today, hourlyRate: s.hourlyRate })
      .returning({ id: schema.projects.id });
    projectId = p.id;
    if (tpl) await insertTemplateTasks(projectId, tpl.tasks, today);
    await logActivity(`Projekt angelegt${tpl ? ` (Vorlage ${tpl.name})` : ""}`, { leadId: id, customerId, projectId });
  }

  let quoteId: number | null = null;
  if (v.createQuote) {
    const prods = tpl?.productIds.length ? await db().select().from(schema.products).where(inArray(schema.products.id, tpl.productIds)).orderBy(asc(schema.products.sortOrder)) : [];
    const items: LineItem[] = prods.map((p) => ({
      title: p.name,
      description: p.description ?? "",
      quantity: 1,
      unit: p.unit,
      unitPrice: p.price,
      productId: p.id,
      ...(p.interval ? { recurring: p.interval, firstYearIncluded: p.interval === "jahr" } : {}),
    }));
    const vatRate = s.vatEnabled ? s.vatRate : 0;
    const number = await nextNumber("quote", s.quotePrefix);
    const [q] = await db()
      .insert(schema.quotes)
      .values({
        number,
        customerId,
        leadId: id,
        projectId,
        title: v.quoteTitle || v.projectName || `${tpl?.name ?? "Offerte"} ${label}`,
        intro: s.quoteIntro,
        outro: s.quoteOutro,
        items,
        vatRate,
        total: computeTotals(items, 0, vatRate).total,
        issueDate: today,
        validUntil: addDaysIso(today, s.quoteValidityDays),
      })
      .returning({ id: schema.quotes.id });
    quoteId = q.id;
    if (projectId) await db().update(schema.projects).set({ quoteId }).where(eq(schema.projects.id, projectId));
    await logActivity(`Offerte ${number} als Entwurf erstellt`, { leadId: id, customerId, projectId });
  }

  await db()
    .update(schema.leads)
    .set({ status: quoteId ? "offerte" : projectId ? "gewonnen" : lead.status === "neu" ? "kontaktiert" : lead.status, updatedAt: new Date() })
    .where(eq(schema.leads.id, id));
  await flashDone("Erstellt");
  redirect(quoteId ? `/admin/offerten/${quoteId}` : projectId ? `/admin/projekte/${projectId}` : `/admin/kunden/${customerId}`);
}

/* ───────────── Activities ───────────── */

const activitySchema = z.object({
  type: z.enum(activityTypes).default("notiz"),
  body: zReq(4000),
  occurredAt: z.string().optional(),
  followUpAt: zOptDate,
});

export async function addActivityAction(
  ref: { leadId?: number; customerId?: number; projectId?: number },
  _: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(activitySchema, fd);
  if (!r.data) return { error: "Bitte einen Text eingeben." };
  const v = r.data;
  const at = v.occurredAt && !Number.isNaN(Date.parse(v.occurredAt)) ? new Date(v.occurredAt) : new Date();
  let customerId = ref.customerId ?? null;
  if (ref.leadId && !customerId) {
    const [l] = await db().select({ c: schema.leads.customerId }).from(schema.leads).where(eq(schema.leads.id, ref.leadId));
    customerId = l?.c ?? null;
  }
  if (ref.projectId && !customerId) {
    const [p] = await db().select({ c: schema.projects.customerId }).from(schema.projects).where(eq(schema.projects.id, ref.projectId));
    customerId = p?.c ?? null;
  }
  await db()
    .insert(schema.activities)
    .values({ type: v.type, body: v.body, occurredAt: at, leadId: ref.leadId ?? null, customerId, projectId: ref.projectId ?? null });
  if (ref.leadId) {
    const patch: { updatedAt: Date; followUpAt?: string | null; status?: LeadStatus } = { updatedAt: new Date() };
    if (v.followUpAt) patch.followUpAt = v.followUpAt;
    const [l] = await db().select({ s: schema.leads.status }).from(schema.leads).where(eq(schema.leads.id, ref.leadId));
    if (l?.s === "neu" && v.type !== "notiz") patch.status = "kontaktiert";
    await db().update(schema.leads).set(patch).where(eq(schema.leads.id, ref.leadId));
  }
  await flashDone("Erstellt");
  return { ok: true };
}

export async function deleteActivityAction(id: number) {
  await requireAdmin();
  await db().delete(schema.activities).where(eq(schema.activities.id, id));
  await flashDone("Gelöscht");
}

/* ───────────── Contacts ───────────── */

const contactSchema = z.object({
  firstName: zOptText(120),
  lastName: zOptText(120),
  role: zOptText(120),
  email: z.union([z.literal(""), z.email().max(200)]).optional().transform((v) => v || null),
  phone: zOptText(60),
  isPrimary: zBool,
  notes: zOptText(1000),
});

export async function saveContactAction(customerId: number, contactId: number | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(contactSchema, fd);
  if (!r.data) return { error: r.error };
  if (!r.data.firstName && !r.data.lastName) return { error: "Bitte Vor- oder Nachname angeben." };
  if (r.data.isPrimary) await db().update(schema.contacts).set({ isPrimary: false }).where(eq(schema.contacts.customerId, customerId));
  if (contactId) await db().update(schema.contacts).set(r.data).where(eq(schema.contacts.id, contactId));
  else await db().insert(schema.contacts).values({ ...r.data, customerId });
  await flashDone("Gespeichert");
  return { ok: true };
}

export async function deleteContactAction(id: number) {
  await requireAdmin();
  await db().delete(schema.contacts).where(eq(schema.contacts.id, id));
  await flashDone("Gelöscht");
}

/* ───────────── Quick helpers used by several pages ───────────── */

export async function createQuoteForLeadAction(leadId: number) {
  await requireAdmin();
  const r = await customerFromLead(zId.parse(leadId));
  if (!r) redirect("/admin/anfragen");
  await flashDone("Erstellt");
  redirect(`/admin/offerten/neu?kunde=${r.customerId}&lead=${leadId}`);
}
