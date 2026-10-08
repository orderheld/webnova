"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isIBANValid } from "swissqrbill/utils";
import { z } from "zod";
import { db, schema } from "@/db";
import { billingIntervals, type InvoiceStatus, type LineItem, type QuoteStatus } from "@/db/schema";
import { checkCredentials, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { escapeHtml, mailLayout, sendMail } from "@/lib/email";
import { invoiceItemsFromQuote, logActivity, openAmount, subscriptionsFromQuote, syncInvoicePayments } from "./billing";
import { estimateTotals } from "./calculator";
import { quoteStatusLabels } from "./labels";
import { addDaysIso, chf, computeTotals, fmtDate, round2, todayIso } from "./money";
import { nextNumber } from "./numbering";
import { renderDocumentPdf, type PdfKind } from "./pdf";
import { getSettings, saveSettings, type CompanySettings } from "./settings";

const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
};
const orNull = (s: string) => (s === "" ? null : s);

/* ───────────────────────── Auth ───────────────────────── */

const attempts = new Map<string, number[]>();

export async function loginAction(_: unknown, fd: FormData): Promise<{ error?: string }> {
  const email = str(fd, "email");
  const password = String(fd.get("password") ?? "");
  const now = Date.now();
  const recent = (attempts.get(email) ?? []).filter((t) => now - t < 15 * 60_000);
  if (recent.length >= 8) return { error: "Zu viele Versuche. Bitte in 15 Minuten erneut versuchen." };
  if (!checkCredentials(email, password)) {
    attempts.set(email, [...recent, now]);
    return { error: "E-Mail oder Passwort ist falsch." };
  }
  attempts.delete(email);
  await createSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ───────────────────────── Customers ───────────────────────── */

function customerValues(fd: FormData) {
  return {
    company: orNull(str(fd, "company")),
    firstName: orNull(str(fd, "firstName")),
    lastName: orNull(str(fd, "lastName")),
    email: orNull(str(fd, "email")),
    phone: orNull(str(fd, "phone")),
    street: orNull(str(fd, "street")),
    zip: orNull(str(fd, "zip")),
    city: orNull(str(fd, "city")),
    country: (str(fd, "country") || "CH").toUpperCase().slice(0, 2),
    language: str(fd, "language") || "de",
    website: orNull(str(fd, "website")),
    industry: orNull(str(fd, "industry")),
    vatNumber: orNull(str(fd, "vatNumber")),
    notes: orNull(str(fd, "notes")),
  };
}

const customerSchema = z.object({
  email: z.union([z.literal(""), z.email()]),
  company: z.string().max(200),
  lastName: z.string().max(200),
});

export async function saveCustomerAction(id: number | null, _: unknown, fd: FormData): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();
  const v = customerValues(fd);
  if (!v.company && !v.lastName && !v.firstName) return { error: "Bitte Firma oder Name angeben." };
  if (!customerSchema.safeParse({ email: v.email ?? "", company: v.company ?? "", lastName: v.lastName ?? "" }).success)
    return { error: "Bitte eine gültige E-Mail-Adresse angeben." };
  if (id) {
    await db().update(schema.customers).set(v).where(eq(schema.customers.id, id));
    revalidatePath("/admin", "layout");
    return { ok: true };
  }
  const [c] = await db().insert(schema.customers).values(v).returning({ id: schema.customers.id });
  revalidatePath("/admin", "layout");
  redirect(`/admin/kunden/${c.id}`);
}

export async function deleteCustomerAction(id: number) {
  await requireAdmin();
  try {
    await db().delete(schema.customers).where(eq(schema.customers.id, id));
  } catch {
    redirect(`/admin/kunden/${id}?fehler=dokumente`);
  }
  revalidatePath("/admin", "layout");
  redirect("/admin/kunden");
}

export async function archiveCustomerAction(id: number, archived: boolean) {
  await requireAdmin();
  await db().update(schema.customers).set({ archived }).where(eq(schema.customers.id, id));
  revalidatePath("/admin", "layout");
}

/* ───────────────────────── Quotes & invoices ───────────────────────── */

const itemSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().optional().default(""),
  quantity: z.coerce.number().finite(),
  unit: z.string().default("Pauschal"),
  unitPrice: z.coerce.number().finite(),
  productId: z.number().int().positive().nullable().optional(),
  recurring: z.enum(billingIntervals).nullable().optional(),
  firstYearIncluded: z.boolean().optional(),
  subscriptionId: z.number().int().positive().nullable().optional(),
});

const docSchema = z.object({
  customerId: z.coerce.number().int().positive(),
  projectId: z.number().int().positive().nullable().optional(),
  title: z.string().trim().min(1),
  intro: z.string().default(""),
  outro: z.string().default(""),
  notes: z.string().default(""),
  items: z.array(itemSchema),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  vatRate: z.coerce.number().min(0).max(30).default(0),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  secondDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("")),
});

export type DocPayload = z.input<typeof docSchema>;

const cleanItems = (items: z.infer<typeof itemSchema>[], allowRecurring: boolean): LineItem[] =>
  items.map((it) => ({
    title: it.title,
    description: it.description || "",
    quantity: it.quantity,
    unit: it.unit,
    unitPrice: it.unitPrice,
    ...(it.productId ? { productId: it.productId } : {}),
    ...(allowRecurring && it.recurring ? { recurring: it.recurring, firstYearIncluded: !!it.firstYearIncluded } : {}),
    ...(it.subscriptionId ? { subscriptionId: it.subscriptionId } : {}),
  }));

export async function saveQuoteAction(id: number | null, payload: DocPayload & { leadId?: number | null }): Promise<{ error?: string; id?: number }> {
  await requireAdmin();
  const p = docSchema.safeParse(payload);
  if (!p.success) return { error: "Bitte Kunde, Titel und alle Positionen ausfüllen." };
  const v = p.data;
  const items = cleanItems(v.items, true);
  const { total } = computeTotals(items, v.discountPercent, v.vatRate);
  const values = {
    customerId: v.customerId,
    projectId: v.projectId ?? null,
    title: v.title,
    intro: v.intro,
    outro: v.outro,
    notes: v.notes || null,
    items,
    discountPercent: v.discountPercent,
    vatRate: v.vatRate,
    total,
    issueDate: v.issueDate,
    validUntil: v.secondDate || null,
  };
  if (id) {
    await db().update(schema.quotes).set(values).where(eq(schema.quotes.id, id));
  } else {
    const s = await getSettings();
    const number = await nextNumber("quote", s.quotePrefix);
    const leadId = typeof payload.leadId === "number" && payload.leadId > 0 ? payload.leadId : null;
    const [q] = await db().insert(schema.quotes).values({ ...values, number, leadId }).returning({ id: schema.quotes.id });
    id = q.id;
    if (leadId) {
      await db().update(schema.leads).set({ status: "offerte", updatedAt: new Date() }).where(eq(schema.leads.id, leadId));
      await logActivity(`Offerte ${number} erstellt`, { leadId });
    }
  }
  revalidatePath("/admin", "layout");
  return { id };
}

export async function saveInvoiceAction(id: number | null, payload: DocPayload & { quoteId?: number | null }): Promise<{ error?: string; id?: number }> {
  await requireAdmin();
  const p = docSchema.safeParse(payload);
  if (!p.success) return { error: "Bitte Kunde, Titel und alle Positionen ausfüllen." };
  const v = p.data;
  const items = cleanItems(v.items, false);
  const { total } = computeTotals(items, v.discountPercent, v.vatRate);
  const values = {
    customerId: v.customerId,
    projectId: v.projectId ?? null,
    title: v.title,
    intro: v.intro,
    outro: v.outro,
    notes: v.notes || null,
    items,
    discountPercent: v.discountPercent,
    vatRate: v.vatRate,
    total,
    issueDate: v.issueDate,
    dueDate: v.secondDate || addDaysIso(v.issueDate, 30),
  };
  if (id) {
    const [cur] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, id));
    if (!cur) return { error: "Rechnung nicht gefunden." };
    if (cur.status === "bezahlt" || cur.status === "storniert") return { error: "Bezahlte oder stornierte Rechnungen können nicht mehr bearbeitet werden." };
    await db().update(schema.invoices).set(values).where(eq(schema.invoices.id, id));
    if (cur.paidAmount > 0) await syncInvoicePayments(id);
  } else {
    const s = await getSettings();
    const number = await nextNumber("invoice", s.invoicePrefix);
    const [inv] = await db()
      .insert(schema.invoices)
      .values({ ...values, number, quoteId: payload.quoteId ?? null })
      .returning({ id: schema.invoices.id });
    id = inv.id;
  }
  revalidatePath("/admin", "layout");
  return { id };
}

export async function setQuoteStatusAction(id: number, status: QuoteStatus) {
  await requireAdmin();
  const [q] = await db().update(schema.quotes).set({ status }).where(eq(schema.quotes.id, id)).returning();
  if (q) {
    await logActivity(`Offerte ${q.number}: ${quoteStatusLabels[status]}`, { customerId: q.customerId, leadId: q.leadId, projectId: q.projectId });
    if (q.leadId && (status === "angenommen" || status === "abgelehnt"))
      await db()
        .update(schema.leads)
        .set({ status: status === "angenommen" ? "gewonnen" : "verloren", updatedAt: new Date() })
        .where(eq(schema.leads.id, q.leadId));
  }
  revalidatePath("/admin", "layout");
}

/** Status changes that are not payments (cancel / reopen). Paying goes through payments. */
export async function setInvoiceStatusAction(id: number, status: InvoiceStatus, paidAt?: string) {
  await requireAdmin();
  const [inv] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, id));
  if (!inv) return;
  if (status === "bezahlt") {
    const rest = openAmount({ ...inv, status: inv.status === "entwurf" ? "gesendet" : inv.status });
    if (rest > 0) await db().insert(schema.payments).values({ invoiceId: id, date: paidAt || todayIso(), amount: rest, method: "bank" });
    await syncInvoicePayments(id);
  } else if (status === "storniert") {
    await db().update(schema.invoices).set({ status: "storniert" }).where(eq(schema.invoices.id, id));
    await logActivity(`${inv.kind === "gutschrift" ? "Gutschrift" : "Rechnung"} ${inv.number} storniert`, { customerId: inv.customerId, projectId: inv.projectId });
  } else if (status === "gesendet") {
    // reopen: clears recorded payments
    await db().delete(schema.payments).where(eq(schema.payments.invoiceId, id));
    await db().update(schema.invoices).set({ status: "gesendet", paidAmount: 0, paidAt: null }).where(eq(schema.invoices.id, id));
  } else {
    await db().update(schema.invoices).set({ status }).where(eq(schema.invoices.id, id));
  }
  revalidatePath("/admin", "layout");
}

export async function deleteQuoteAction(id: number) {
  await requireAdmin();
  await db().delete(schema.quotes).where(eq(schema.quotes.id, id));
  revalidatePath("/admin", "layout");
  redirect("/admin/offerten");
}

export async function deleteInvoiceAction(id: number) {
  await requireAdmin();
  const [inv] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, id));
  // Sent invoices must stay in the books; they can only be cancelled.
  if (inv && inv.status !== "entwurf") redirect(`/admin/rechnungen/${id}?fehler=storno`);
  if (inv) {
    // subscriptions billed on this draft go back to their previous billing date
    const subIds = [...new Set(inv.items.map((it) => it.subscriptionId).filter((x): x is number => !!x))];
    for (const sid of subIds) {
      const first = inv.items.find((it) => it.subscriptionId === sid);
      const from = first?.description?.match(/(\d{2})\.(\d{2})\.(\d{4})/);
      if (from) await db().update(schema.subscriptions).set({ nextBillingDate: `${from[3]}-${from[2]}-${from[1]}` }).where(eq(schema.subscriptions.id, sid));
    }
  }
  await db().delete(schema.invoices).where(eq(schema.invoices.id, id));
  revalidatePath("/admin", "layout");
  redirect("/admin/rechnungen");
}

export async function quoteToInvoiceAction(quoteId: number) {
  await requireAdmin();
  const [q] = await db().select().from(schema.quotes).where(eq(schema.quotes.id, quoteId));
  if (!q) redirect("/admin/offerten");
  const s = await getSettings();
  const issueDate = todayIso();
  const number = await nextNumber("invoice", s.invoicePrefix);
  const items = invoiceItemsFromQuote(q.items);
  const [inv] = await db()
    .insert(schema.invoices)
    .values({
      number,
      customerId: q.customerId,
      quoteId: q.id,
      projectId: q.projectId,
      title: q.title,
      intro: s.invoiceIntro,
      outro: s.invoiceOutro,
      items,
      discountPercent: q.discountPercent,
      vatRate: q.vatRate,
      total: computeTotals(items, q.discountPercent, q.vatRate).total,
      issueDate,
      dueDate: addDaysIso(issueDate, s.paymentTermDays),
    })
    .returning({ id: schema.invoices.id });
  if (q.status !== "angenommen") await db().update(schema.quotes).set({ status: "angenommen" }).where(eq(schema.quotes.id, q.id));
  if (q.leadId) await db().update(schema.leads).set({ status: "gewonnen", updatedAt: new Date() }).where(eq(schema.leads.id, q.leadId));
  const subs = await subscriptionsFromQuote(q, issueDate);
  await logActivity(`Rechnung ${number} aus Offerte ${q.number} erstellt${subs ? `, ${subs} Abo${subs === 1 ? "" : "s"} angelegt` : ""}`, {
    customerId: q.customerId,
    projectId: q.projectId,
  });
  revalidatePath("/admin", "layout");
  redirect(`/admin/rechnungen/${inv.id}`);
}

function fillTemplate(tpl: string, vars: Record<string, string>) {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export async function sendDocumentAction(kind: PdfKind, id: number, fd: FormData): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();
  const to = str(fd, "to");
  const subject = str(fd, "subject");
  const text = str(fd, "text");
  const cc = str(fd, "cc");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return { error: "Bitte gültige E-Mail-Adresse angeben." };
  if (cc && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cc)) return { error: "Bitte gültige Kopie-Adresse angeben." };
  let pdf: Awaited<ReturnType<typeof renderDocumentPdf>>;
  try {
    pdf = await renderDocumentPdf(kind, id);
  } catch (e) {
    return { error: `PDF konnte nicht erstellt werden: ${e instanceof Error ? e.message : String(e)}` };
  }
  if (!pdf) return { error: "Dokument nicht gefunden." };
  const html = mailLayout(`<div style="white-space:pre-line">${escapeHtml(text)}</div>`);
  const res = await sendMail({
    to: cc ? [to, cc] : to,
    subject,
    html,
    text,
    replyTo: (await getSettings()).email,
    attachments: [{ filename: `${pdf.filename}.pdf`, content: pdf.buffer }],
  });
  if (!res.ok) return { error: `Versand fehlgeschlagen: ${res.error}` };
  const now = new Date();
  if (kind === "quote") {
    const [q] = await db().select().from(schema.quotes).where(eq(schema.quotes.id, id));
    await db()
      .update(schema.quotes)
      .set({ sentAt: now, status: q?.status === "entwurf" ? "gesendet" : q?.status })
      .where(eq(schema.quotes.id, id));
    if (q) {
      await logActivity(`Offerte ${q.number} an ${to} gesendet`, { customerId: q.customerId, leadId: q.leadId, projectId: q.projectId }, "email");
      if (q.leadId) await db().update(schema.leads).set({ status: "offerte", updatedAt: now }).where(eq(schema.leads.id, q.leadId));
    }
  } else if (kind === "invoice") {
    const [inv] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, id));
    await db()
      .update(schema.invoices)
      .set({ sentAt: now, status: inv?.status === "entwurf" ? "gesendet" : inv?.status })
      .where(eq(schema.invoices.id, id));
    if (inv) await logActivity(`${inv.kind === "gutschrift" ? "Gutschrift" : "Rechnung"} ${inv.number} an ${to} gesendet`, { customerId: inv.customerId, projectId: inv.projectId }, "email");
  } else {
    const [r] = await db().update(schema.invoiceReminders).set({ sentAt: now }).where(eq(schema.invoiceReminders.id, id)).returning();
    if (r) {
      const [inv] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, r.invoiceId));
      if (inv) await logActivity(`${r.level}. Mahnung zu ${inv.number} an ${to} gesendet`, { customerId: inv.customerId, projectId: inv.projectId }, "email");
    }
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

/** Prefilled mail for the send dialog */
export async function mailDraft(kind: PdfKind, id: number) {
  await requireAdmin();
  const s = await getSettings();
  let reminder: typeof schema.invoiceReminders.$inferSelect | undefined;
  if (kind === "reminder") {
    [reminder] = await db().select().from(schema.invoiceReminders).where(eq(schema.invoiceReminders.id, id));
    if (!reminder) return null;
  }
  const doc =
    kind === "quote"
      ? (await db().select().from(schema.quotes).where(eq(schema.quotes.id, id)))[0]
      : (await db().select().from(schema.invoices).where(eq(schema.invoices.id, reminder ? reminder.invoiceId : id)))[0];
  if (!doc) return null;
  const [c] = await db().select().from(schema.customers).where(eq(schema.customers.id, doc.customerId));
  const [primary] = await db().select().from(schema.contacts).where(eq(schema.contacts.customerId, doc.customerId)).orderBy(schema.contacts.id);
  const contactName = primary?.isPrimary ? [primary.firstName, primary.lastName].filter(Boolean).join(" ") : "";
  const name = contactName || [c?.firstName, c?.lastName].filter(Boolean).join(" ") || c?.company || "";
  const isCredit = "kind" in doc && doc.kind === "gutschrift";
  const amount = reminder && "paidAmount" in doc ? round2(doc.total - doc.paidAmount + reminder.fee) : doc.total;
  const vars = {
    name,
    nummer: doc.number,
    betrag: chf(amount),
    faellig: reminder ? fmtDate(reminder.dueDate) : "dueDate" in doc ? fmtDate(doc.dueDate) : "",
    absender: `${s.owner}\n${s.companyName}`,
  };
  const label = kind === "quote" ? "Offerte" : reminder ? `${reminder.level}. Mahnung zu Rechnung` : isCredit ? "Gutschrift" : "Rechnung";
  const tpl = kind === "quote" ? s.quoteEmailText : reminder ? s.reminderEmailText : s.invoiceEmailText;
  return {
    to: (primary?.isPrimary && primary.email) || c?.email || "",
    subject: `${label} ${doc.number}: ${doc.title}`,
    text: fillTemplate(isCredit ? tpl.replace(/zahlbar bis \{faellig\}/, "").replace("Rechnung", "Gutschrift") : tpl, vars),
  };
}

/* ───────────────────────── Calculator ───────────────────────── */

const estimateSchema = z.object({
  name: z.string().trim().min(1),
  customerId: z.number().int().positive().nullable(),
  leadId: z.number().int().positive().nullable(),
  hourlyRate: z.number().positive(),
  riskPercent: z.number().min(0).max(100),
  items: z.array(z.object({ id: z.string(), qty: z.number() })),
  custom: z.array(z.object({ title: z.string(), hours: z.number() })),
  marginNote: z.string().optional(),
});
export type EstimatePayload = z.infer<typeof estimateSchema>;

export async function saveEstimateAction(id: number | null, payload: EstimatePayload): Promise<{ error?: string; id?: number }> {
  await requireAdmin();
  const p = estimateSchema.safeParse(payload);
  if (!p.success) return { error: "Bitte einen Namen für die Schätzung angeben." };
  const v = p.data;
  const t = estimateTotals(v);
  const values = {
    name: v.name,
    customerId: v.customerId,
    leadId: v.leadId,
    data: { hourlyRate: v.hourlyRate, riskPercent: v.riskPercent, items: v.items, custom: v.custom, marginNote: v.marginNote },
    totalHours: t.totalHours,
    total: t.total,
    updatedAt: new Date(),
  };
  if (id) await db().update(schema.estimates).set(values).where(eq(schema.estimates.id, id));
  else id = (await db().insert(schema.estimates).values(values).returning({ id: schema.estimates.id }))[0].id;
  revalidatePath("/admin", "layout");
  return { id };
}

export async function deleteEstimateAction(id: number) {
  await requireAdmin();
  await db().delete(schema.estimates).where(eq(schema.estimates.id, id));
  revalidatePath("/admin", "layout");
  redirect("/admin/rechner");
}

/** Creates a quote draft from an estimate: one line per calculator group. */
export async function estimateToQuoteAction(id: number) {
  await requireAdmin();
  const [e] = await db().select().from(schema.estimates).where(eq(schema.estimates.id, id));
  if (!e) redirect("/admin/rechner");
  if (!e.customerId) redirect(`/admin/rechner/${id}?fehler=kunde`);
  const s = await getSettings();
  const t = estimateTotals(e.data);
  const factor = t.baseHours > 0 ? t.totalHours / t.baseHours : 1;
  const groups = new Map<string, { hours: number; labels: string[] }>();
  for (const l of t.lines) {
    const g = groups.get(l.group) ?? { hours: 0, labels: [] };
    g.hours += l.hours * factor;
    g.labels.push(l.label);
    groups.set(l.group, g);
  }
  const items: LineItem[] = [...groups.entries()].map(([group, g]) => ({
    title: group,
    description: g.labels.join(", "),
    quantity: Math.round(g.hours * 4) / 4,
    unit: "Std.",
    unitPrice: e.data.hourlyRate,
  }));
  const vatRate = s.vatEnabled ? s.vatRate : 0;
  const issueDate = todayIso();
  const number = await nextNumber("quote", s.quotePrefix);
  const [q] = await db()
    .insert(schema.quotes)
    .values({
      number,
      customerId: e.customerId,
      leadId: e.leadId,
      title: e.name,
      intro: s.quoteIntro,
      outro: s.quoteOutro,
      items,
      vatRate,
      total: computeTotals(items, 0, vatRate).total,
      issueDate,
      validUntil: addDaysIso(issueDate, s.quoteValidityDays),
    })
    .returning({ id: schema.quotes.id });
  revalidatePath("/admin", "layout");
  redirect(`/admin/offerten/${q.id}`);
}

/* ───────────────────────── Settings ───────────────────────── */

export async function saveSettingsAction(_: unknown, fd: FormData): Promise<{ ok?: boolean; error?: string }> {
  await requireAdmin();
  const cur = await getSettings();
  const next: CompanySettings = { ...cur };
  for (const k of Object.keys(cur) as (keyof CompanySettings)[]) {
    const raw = fd.get(k);
    if (typeof cur[k] === "boolean") (next as unknown as Record<string, unknown>)[k] = raw === "on";
    else if (typeof cur[k] === "number") {
      if (raw !== null) (next as unknown as Record<string, unknown>)[k] = Number(String(raw).replace(",", ".")) || 0;
    } else if (raw !== null) (next as unknown as Record<string, unknown>)[k] = String(raw);
  }
  next.iban = next.iban.replace(/\s+/g, "").toUpperCase();
  if (next.iban && (!/^(CH|LI)\d{19}$/.test(next.iban) || !isIBANValid(next.iban)))
    return { error: "Bitte eine gültige Schweizer IBAN eingeben (CH + 19 Ziffern)." };
  for (const k of ["quotePrefix", "invoicePrefix", "creditPrefix"] as const) {
    next[k] = next[k].replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6) || cur[k];
  }
  await saveSettings(next);
  revalidatePath("/admin", "layout");
  return { ok: true };
}
