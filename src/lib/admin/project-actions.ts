"use server";

import { flashDone } from "./flash";

import { and, asc, eq, inArray, isNull, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, schema } from "@/db";
import { projectStatuses, type LineItem, type ProjectStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { insertTemplateTasks, logActivity } from "./billing";
import { parseForm, zBool, zDate, zId, zNum, zOptDate, zOptId, zOptNum, zOptText, zReq, zUrl, type FormState } from "./form";
import { projectStatusLabels } from "./labels";
import { addDaysIso, computeTotals, fmtDate, todayIso } from "./money";
import { nextNumber } from "./numbering";
import { getSettings } from "./settings";


/* ───────────── Projects ───────────── */

const projectSchema = z.object({
  name: zReq(200),
  customerId: zId,
  quoteId: zOptId,
  status: z.enum(projectStatuses).default("planung"),
  startDate: zOptDate,
  dueDate: zOptDate,
  liveDate: zOptDate,
  budget: zOptNum,
  hourlyRate: zOptNum,
  description: zOptText(),
  notes: zOptText(),
  templateId: zOptId,
});

export async function saveProjectAction(id: number | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(projectSchema, fd);
  if (!r.data) return { error: r.error };
  const { templateId, ...v } = r.data;
  if (id) {
    const [old] = await db().select({ status: schema.projects.status }).from(schema.projects).where(eq(schema.projects.id, id));
    await db()
      .update(schema.projects)
      .set({ ...v, liveDate: v.liveDate ?? (v.status === "live" && old?.status !== "live" ? todayIso() : v.liveDate), updatedAt: new Date() })
      .where(eq(schema.projects.id, id));
    if (old && old.status !== v.status) await logActivity(`Projektstatus: ${projectStatusLabels[old.status]} → ${projectStatusLabels[v.status]}`, { projectId: id, customerId: v.customerId });
    await flashDone("Gespeichert");
    return { ok: true, message: "Gespeichert." };
  }
  const s = await getSettings();
  const start = v.startDate ?? todayIso();
  const [p] = await db()
    .insert(schema.projects)
    .values({ ...v, startDate: start, hourlyRate: v.hourlyRate ?? s.hourlyRate })
    .returning({ id: schema.projects.id });
  if (templateId) {
    const [tpl] = await db().select().from(schema.projectTemplates).where(eq(schema.projectTemplates.id, templateId));
    if (tpl) {
      await insertTemplateTasks(p.id, tpl.tasks, start);
      const last = Math.max(0, ...tpl.tasks.map((t) => t.offsetDays));
      if (!v.dueDate && last > 0) await db().update(schema.projects).set({ dueDate: addDaysIso(start, last) }).where(eq(schema.projects.id, p.id));
    }
  }
  if (v.quoteId) await db().update(schema.quotes).set({ projectId: p.id }).where(eq(schema.quotes.id, v.quoteId));
  await logActivity("Projekt angelegt", { projectId: p.id, customerId: v.customerId });
  await flashDone("Gespeichert");
  redirect(`/admin/projekte/${p.id}`);
}

export async function setProjectStatusAction(id: number, status: ProjectStatus) {
  await requireAdmin();
  const [old] = await db().select().from(schema.projects).where(eq(schema.projects.id, id));
  if (!old || old.status === status || !projectStatuses.includes(status)) return;
  await db()
    .update(schema.projects)
    .set({ status, updatedAt: new Date(), ...(status === "live" && !old.liveDate ? { liveDate: todayIso() } : {}) })
    .where(eq(schema.projects.id, id));
  await logActivity(`Projektstatus: ${projectStatusLabels[old.status]} → ${projectStatusLabels[status]}`, { projectId: id, customerId: old.customerId });
  await flashDone("Aktualisiert");
}

export async function deleteProjectAction(id: number) {
  await requireAdmin();
  await db().delete(schema.projects).where(eq(schema.projects.id, id));
  await flashDone("Gelöscht");
  redirect("/admin/projekte");
}

export async function duplicateProjectAction(id: number) {
  await requireAdmin();
  const [p] = await db().select().from(schema.projects).where(eq(schema.projects.id, id));
  if (!p) redirect("/admin/projekte");
  const today = todayIso();
  const [n] = await db()
    .insert(schema.projects)
    .values({
      name: `${p.name} (Kopie)`,
      customerId: p.customerId,
      status: "planung",
      startDate: today,
      budget: p.budget,
      hourlyRate: p.hourlyRate,
      description: p.description,
      links: p.links,
    })
    .returning({ id: schema.projects.id });
  const tasks = await db().select().from(schema.projectTasks).where(eq(schema.projectTasks.projectId, id)).orderBy(asc(schema.projectTasks.sortOrder));
  const shift = p.startDate ? (d: string | null) => (d ? addDaysIso(today, Math.round((Date.parse(d) - Date.parse(p.startDate!)) / 86_400_000)) : null) : () => null;
  if (tasks.length)
    await db()
      .insert(schema.projectTasks)
      .values(tasks.map((t) => ({ projectId: n.id, title: t.title, notes: t.notes, milestone: t.milestone, sortOrder: t.sortOrder, dueDate: shift(t.dueDate) })));
  await flashDone("Dupliziert");
  redirect(`/admin/projekte/${n.id}`);
}

/** New project from a quote, optionally with template tasks. */
export async function projectFromQuoteAction(quoteId: number, fd: FormData) {
  await requireAdmin();
  const [q] = await db().select().from(schema.quotes).where(eq(schema.quotes.id, quoteId));
  if (!q) redirect("/admin/offerten");
  if (q.projectId) redirect(`/admin/projekte/${q.projectId}`);
  const templateId = Number(fd.get("templateId")) || null;
  const s = await getSettings();
  const start = todayIso();
  const [p] = await db()
    .insert(schema.projects)
    .values({ name: q.title, customerId: q.customerId, quoteId: q.id, leadId: q.leadId, startDate: start, hourlyRate: s.hourlyRate, budget: q.total })
    .returning({ id: schema.projects.id });
  if (templateId) {
    const [tpl] = await db().select().from(schema.projectTemplates).where(eq(schema.projectTemplates.id, templateId));
    if (tpl) await insertTemplateTasks(p.id, tpl.tasks, start);
  }
  await db().update(schema.quotes).set({ projectId: p.id }).where(eq(schema.quotes.id, q.id));
  await db().update(schema.invoices).set({ projectId: p.id }).where(and(eq(schema.invoices.quoteId, q.id), isNull(schema.invoices.projectId)));
  await db().update(schema.subscriptions).set({ projectId: p.id }).where(and(eq(schema.subscriptions.quoteId, q.id), isNull(schema.subscriptions.projectId)));
  await logActivity(`Projekt aus Offerte ${q.number} angelegt`, { projectId: p.id, customerId: q.customerId });
  await flashDone("Erstellt");
  redirect(`/admin/projekte/${p.id}`);
}

/* ───────────── Tasks ───────────── */

const taskSchema = z.object({
  title: zReq(300),
  dueDate: zOptDate,
  milestone: zBool,
  notes: zOptText(2000),
});

export async function addTaskAction(projectId: number, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(taskSchema, fd);
  if (!r.data) return { error: "Bitte einen Titel eingeben." };
  const [{ max }] = await db()
    .select({ max: sql<number>`coalesce(max(${schema.projectTasks.sortOrder}),0)::int` })
    .from(schema.projectTasks)
    .where(eq(schema.projectTasks.projectId, projectId));
  await db().insert(schema.projectTasks).values({ ...r.data, projectId, sortOrder: max + 10 });
  await touch(projectId);
  await flashDone("Erstellt");
  return { ok: true };
}

export async function updateTaskAction(taskId: number, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(taskSchema, fd);
  if (!r.data) return { error: "Bitte einen Titel eingeben." };
  await db().update(schema.projectTasks).set(r.data).where(eq(schema.projectTasks.id, taskId));
  await flashDone("Gespeichert");
  return { ok: true };
}

export async function toggleTaskAction(taskId: number) {
  await requireAdmin();
  const [t] = await db().select().from(schema.projectTasks).where(eq(schema.projectTasks.id, taskId));
  if (!t) return;
  await db()
    .update(schema.projectTasks)
    .set({ done: !t.done, doneAt: t.done ? null : new Date() })
    .where(eq(schema.projectTasks.id, taskId));
  if (!t.done && t.milestone) await logActivity(`Meilenstein erreicht: ${t.title}`, { projectId: t.projectId });
  await touch(t.projectId);
  await flashDone("Aktualisiert");
}

export async function deleteTaskAction(taskId: number) {
  await requireAdmin();
  await db().delete(schema.projectTasks).where(eq(schema.projectTasks.id, taskId));
  await flashDone("Gelöscht");
}

export async function moveTaskAction(taskId: number, dir: -1 | 1) {
  await requireAdmin();
  const [t] = await db().select().from(schema.projectTasks).where(eq(schema.projectTasks.id, taskId));
  if (!t) return;
  const list = await db().select().from(schema.projectTasks).where(eq(schema.projectTasks.projectId, t.projectId)).orderBy(asc(schema.projectTasks.sortOrder), asc(schema.projectTasks.id));
  const i = list.findIndex((x) => x.id === taskId);
  const j = i + dir;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  for (let k = 0; k < list.length; k++) {
    if (list[k].sortOrder !== (k + 1) * 10) await db().update(schema.projectTasks).set({ sortOrder: (k + 1) * 10 }).where(eq(schema.projectTasks.id, list[k].id));
  }
  await flashDone("Aktualisiert");
}

async function touch(projectId: number) {
  await db().update(schema.projects).set({ updatedAt: new Date() }).where(eq(schema.projects.id, projectId));
}

/* ───────────── Links (files) and notes ───────────── */

const linkSchema = z.object({ label: zReq(200), url: zUrl });

export async function addLinkAction(projectId: number, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(linkSchema, fd);
  if (!r.data || !r.data.url) return { error: "Bitte Bezeichnung und Link angeben." };
  const [p] = await db().select({ links: schema.projects.links }).from(schema.projects).where(eq(schema.projects.id, projectId));
  if (!p) return { error: "Projekt nicht gefunden." };
  await db()
    .update(schema.projects)
    .set({ links: [...p.links, { label: r.data.label, url: r.data.url }], updatedAt: new Date() })
    .where(eq(schema.projects.id, projectId));
  await flashDone("Erstellt");
  return { ok: true };
}

export async function deleteLinkAction(projectId: number, index: number) {
  await requireAdmin();
  const [p] = await db().select({ links: schema.projects.links }).from(schema.projects).where(eq(schema.projects.id, projectId));
  if (!p) return;
  await db()
    .update(schema.projects)
    .set({ links: p.links.filter((_, i) => i !== index) })
    .where(eq(schema.projects.id, projectId));
  await flashDone("Gelöscht");
}

/* ───────────── Time tracking ───────────── */

const timeSchema = z.object({
  projectId: zOptId,
  date: zDate,
  hours: zNum.refine((n) => n > 0 && n <= 24),
  rate: zOptNum,
  description: zReq(500),
  billable: zBool,
});

export async function saveTimeAction(projectId: number | null, entryId: number | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(timeSchema, fd);
  if (!r.data) return { error: r.error };
  const pid = projectId ?? r.data.projectId;
  if (!pid) return { error: "Bitte ein Projekt wählen." };
  const [p] = await db().select().from(schema.projects).where(eq(schema.projects.id, pid));
  if (!p) return { error: "Projekt nicht gefunden." };
  const rate = r.data.rate ?? p.hourlyRate ?? (await getSettings()).hourlyRate;
  const values = { projectId: pid, date: r.data.date, hours: r.data.hours, rate, description: r.data.description, billable: r.data.billable };
  if (entryId) {
    const [e] = await db().select().from(schema.timeEntries).where(eq(schema.timeEntries.id, entryId));
    if (e?.invoiceId) return { error: "Bereits verrechnete Einträge können nicht geändert werden." };
    await db().update(schema.timeEntries).set(values).where(eq(schema.timeEntries.id, entryId));
  } else await db().insert(schema.timeEntries).values(values);
  await touch(pid);
  await flashDone("Gespeichert");
  return { ok: true };
}

export async function deleteTimeAction(id: number) {
  await requireAdmin();
  await db().delete(schema.timeEntries).where(and(eq(schema.timeEntries.id, id), isNull(schema.timeEntries.invoiceId)));
  await flashDone("Gelöscht");
}

/** Bills all open, billable time entries of a project as a draft invoice (one line per rate). */
export async function billTimeAction(projectId: number) {
  await requireAdmin();
  const [p] = await db().select().from(schema.projects).where(eq(schema.projects.id, projectId));
  if (!p) redirect("/admin/projekte");
  const entries = await db()
    .select()
    .from(schema.timeEntries)
    .where(and(eq(schema.timeEntries.projectId, projectId), eq(schema.timeEntries.billable, true), isNull(schema.timeEntries.invoiceId)))
    .orderBy(asc(schema.timeEntries.date));
  if (entries.length === 0) redirect(`/admin/projekte/${projectId}?fehler=keine-stunden`);
  const byRate = new Map<number, typeof entries>();
  for (const e of entries) byRate.set(e.rate, [...(byRate.get(e.rate) ?? []), e]);
  const items: LineItem[] = [...byRate.entries()].map(([rate, list]) => ({
    title: `Aufwand ${p.name}`,
    description: list.map((e) => `${fmtDate(e.date)}: ${e.description} (${e.hours} h)`).join("\n"),
    quantity: Math.round(list.reduce((a, e) => a + e.hours, 0) * 100) / 100,
    unit: "Std.",
    unitPrice: rate,
  }));
  const s = await getSettings();
  const vatRate = s.vatEnabled ? s.vatRate : 0;
  const issueDate = todayIso();
  const number = await nextNumber("invoice", s.invoicePrefix);
  const [inv] = await db()
    .insert(schema.invoices)
    .values({
      number,
      customerId: p.customerId,
      projectId,
      quoteId: p.quoteId,
      title: `Aufwand ${p.name}`,
      intro: s.invoiceIntro,
      outro: s.invoiceOutro,
      items,
      vatRate,
      total: computeTotals(items, 0, vatRate).total,
      issueDate,
      dueDate: addDaysIso(issueDate, s.paymentTermDays),
    })
    .returning({ id: schema.invoices.id });
  await db()
    .update(schema.timeEntries)
    .set({ invoiceId: inv.id })
    .where(inArray(schema.timeEntries.id, entries.map((e) => e.id)));
  await logActivity(`Rechnung ${number} aus ${entries.length} Zeiteinträgen erstellt`, { projectId, customerId: p.customerId });
  await flashDone("Erstellt");
  redirect(`/admin/rechnungen/${inv.id}`);
}

/* ───────────── Templates ───────────── */

const templateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().max(1000).default(""),
  tasks: z.array(z.object({ title: z.string().trim().min(1).max(300), offsetDays: z.number().int().min(0).max(1000), milestone: z.boolean().optional() })).max(200),
  productIds: z.array(z.number().int().positive()).max(50),
});
export type TemplatePayload = z.input<typeof templateSchema>;

export async function saveTemplateAction(id: number | null, payload: TemplatePayload): Promise<{ error?: string; id?: number }> {
  await requireAdmin();
  const r = templateSchema.safeParse({ ...payload, tasks: payload.tasks.filter((t) => t.title.trim()) });
  if (!r.success) return { error: "Bitte Name und Aufgaben prüfen." };
  const v = { ...r.data, description: r.data.description || null };
  if (id) await db().update(schema.projectTemplates).set(v).where(eq(schema.projectTemplates.id, id));
  else id = (await db().insert(schema.projectTemplates).values(v).returning({ id: schema.projectTemplates.id }))[0].id;
  await flashDone("Gespeichert");
  return { id };
}

export async function deleteTemplateAction(id: number) {
  await requireAdmin();
  await db().delete(schema.projectTemplates).where(eq(schema.projectTemplates.id, id));
  await flashDone("Gelöscht");
  redirect("/admin/vorlagen");
}
