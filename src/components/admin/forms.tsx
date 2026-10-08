import type { Contact, Expense, Product, Project, ProjectTask, ProjectTemplate, Subscription, TimeEntry } from "@/db/schema";
import { billingIntervals, projectStatuses, subscriptionStatuses } from "@/db/schema";
import { saveContactAction } from "@/lib/admin/crm-actions";
import { addPaymentAction, saveExpenseAction, saveProductAction, saveSubscriptionAction } from "@/lib/admin/finance-actions";
import {
  expenseCategoryLabels,
  intervalLabels,
  paymentMethodLabels,
  projectStatusLabels,
  subscriptionCategoryLabels,
  subscriptionStatusLabels,
  units,
} from "@/lib/admin/labels";
import { todayIso } from "@/lib/admin/money";
import { addLinkAction, addTaskAction, saveProjectAction, saveTimeAction, updateTaskAction } from "@/lib/admin/project-actions";
import type { Option } from "@/lib/admin/queries";
import { ActionForm, Submit } from "./action-form";
import { ProductPicker } from "./product-picker";
import { Field } from "./ui";

const Check = ({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) => (
  <label className="flex items-center gap-2.5 text-[14px]">
    <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[var(--color-accent)]" />
    {label}
  </label>
);

function Select({ name, options, value, empty }: { name: string; options: Option[]; value?: number | null; empty?: string }) {
  return (
    <select name={name} defaultValue={value ?? ""} className="input">
      {empty !== undefined && <option value="">{empty}</option>}
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
  );
}

/* ───────────── Contacts ───────────── */

export function ContactForm({ customerId, contact }: { customerId: number; contact?: Contact }) {
  const c = contact;
  return (
    <ActionForm action={saveContactAction.bind(null, customerId, c?.id ?? null)} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Vorname">
          <input name="firstName" defaultValue={c?.firstName ?? ""} className="input" />
        </Field>
        <Field label="Nachname">
          <input name="lastName" defaultValue={c?.lastName ?? ""} className="input" />
        </Field>
        <Field label="Funktion">
          <input name="role" defaultValue={c?.role ?? ""} className="input" placeholder="z. B. Geschäftsführer" />
        </Field>
        <Field label="Telefon">
          <input name="phone" defaultValue={c?.phone ?? ""} className="input" />
        </Field>
        <Field label="E-Mail" className="sm:col-span-2">
          <input name="email" type="email" defaultValue={c?.email ?? ""} className="input" />
        </Field>
        <Field label="Notiz" className="sm:col-span-2">
          <input name="notes" defaultValue={c?.notes ?? ""} className="input" />
        </Field>
      </div>
      <Check name="isPrimary" label="Hauptkontakt (Empfänger für Offerten und Rechnungen)" defaultChecked={c?.isPrimary} />
      <Submit>{c ? "Speichern" : "Kontakt hinzufügen"}</Submit>
    </ActionForm>
  );
}

/* ───────────── Projects ───────────── */

export function ProjectForm({
  project,
  customers,
  templates,
  quotes,
  defaults,
}: {
  project?: Project;
  customers: Option[];
  templates?: ProjectTemplate[];
  quotes?: Option[];
  defaults?: { customerId?: number | null; quoteId?: number | null; name?: string; hourlyRate?: number };
}) {
  const p = project;
  return (
    <ActionForm action={saveProjectAction.bind(null, p?.id ?? null)} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Projektname *" className="sm:col-span-2">
          <input name="name" required defaultValue={p?.name ?? defaults?.name ?? ""} className="input" placeholder="z. B. Webseite Bäckerei Muster" />
        </Field>
        <Field label="Kunde *">
          <Select name="customerId" options={customers} value={p?.customerId ?? defaults?.customerId} empty="Kunde wählen …" />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={p?.status ?? "planung"} className="input">
            {projectStatuses.map((s) => (
              <option key={s} value={s}>
                {projectStatusLabels[s]}
              </option>
            ))}
          </select>
        </Field>
        {!p && templates && (
          <Field label="Vorlage (erstellt Aufgaben)" className="sm:col-span-2">
            <select name="templateId" defaultValue="" className="input">
              <option value="">Ohne Vorlage</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.tasks.length} Aufgaben)
                </option>
              ))}
            </select>
          </Field>
        )}
        {quotes && (
          <Field label="Offerte" className="sm:col-span-2">
            <Select name="quoteId" options={quotes} value={p?.quoteId ?? defaults?.quoteId} empty="Keine" />
          </Field>
        )}
        <Field label="Start">
          <input type="date" name="startDate" defaultValue={p?.startDate ?? todayIso()} className="input" />
        </Field>
        <Field label="Termin / Deadline">
          <input type="date" name="dueDate" defaultValue={p?.dueDate ?? ""} className="input" />
        </Field>
        <Field label="Budget CHF">
          <input name="budget" inputMode="decimal" defaultValue={p?.budget ?? ""} className="input" />
        </Field>
        <Field label="Stundensatz CHF">
          <input name="hourlyRate" inputMode="decimal" defaultValue={p?.hourlyRate ?? defaults?.hourlyRate ?? ""} className="input" />
        </Field>
        {p && (
          <Field label="Live seit">
            <input type="date" name="liveDate" defaultValue={p.liveDate ?? ""} className="input" />
          </Field>
        )}
        <Field label="Beschreibung / Umfang" className="sm:col-span-2">
          <textarea name="description" rows={3} defaultValue={p?.description ?? ""} className="input" />
        </Field>
        <Field label="Notizen (Zugänge, Absprachen …)" className="sm:col-span-2">
          <textarea name="notes" rows={3} defaultValue={p?.notes ?? ""} className="input" />
        </Field>
      </div>
      <Submit>{p ? "Projekt speichern" : "Projekt anlegen"}</Submit>
    </ActionForm>
  );
}

export function TaskForm({ projectId, task }: { projectId: number; task?: ProjectTask }) {
  const t = task;
  return (
    <ActionForm action={t ? updateTaskAction.bind(null, t.id) : addTaskAction.bind(null, projectId)} reset={!t} className={t ? "space-y-3" : ""}>
      {t ? (
        <>
          <Field label="Aufgabe">
            <input name="title" required defaultValue={t.title} className="input" />
          </Field>
          <Field label="Fällig am">
            <input type="date" name="dueDate" defaultValue={t.dueDate ?? ""} className="input" />
          </Field>
          <Field label="Notiz">
            <textarea name="notes" rows={2} defaultValue={t.notes ?? ""} className="input" />
          </Field>
          <Check name="milestone" label="Meilenstein" defaultChecked={t.milestone} />
          <Submit>Speichern</Submit>
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <input name="title" required placeholder="Neue Aufgabe …" className="input min-w-[180px] flex-1" />
          <input type="date" name="dueDate" className="input w-auto" aria-label="Fällig am" />
          <label className="flex items-center gap-1.5 text-[13px] text-muted">
            <input type="checkbox" name="milestone" className="h-4 w-4" /> Meilenstein
          </label>
          <Submit size="sm">Hinzufügen</Submit>
        </div>
      )}
    </ActionForm>
  );
}

export function TimeForm({ projectId, projects, entry, defaultRate }: { projectId?: number; projects?: Option[]; entry?: TimeEntry; defaultRate?: number | null }) {
  const e = entry;
  return (
    <ActionForm action={saveTimeAction.bind(null, projectId ?? null, e?.id ?? null)} reset={!e} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_110px_120px]">
        {!projectId && projects && (
          <Field label="Projekt *" className="sm:col-span-3">
            <Select name="projectId" options={projects} value={e?.projectId} empty="Projekt wählen …" />
          </Field>
        )}
        <Field label="Tätigkeit *">
          <input name="description" required defaultValue={e?.description ?? ""} className="input" placeholder="z. B. Startseite umgesetzt" />
        </Field>
        <Field label="Stunden *">
          <input name="hours" required inputMode="decimal" defaultValue={e?.hours ?? ""} className="input" placeholder="1.5" />
        </Field>
        <Field label="Datum">
          <input type="date" name="date" defaultValue={e?.date ?? todayIso()} className="input" />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Field label="Satz CHF/h" className="w-32">
          <input name="rate" inputMode="decimal" defaultValue={e?.rate ?? defaultRate ?? ""} className="input" placeholder="Projekt" />
        </Field>
        <div className="pt-5">
          <Check name="billable" label="Verrechenbar" defaultChecked={e ? e.billable : true} />
        </div>
        <span className="flex-1" />
        <div className="pt-5">
          <Submit size="sm">{e ? "Speichern" : "Zeit erfassen"}</Submit>
        </div>
      </div>
    </ActionForm>
  );
}

export function LinkForm({ projectId }: { projectId: number }) {
  return (
    <ActionForm action={addLinkAction.bind(null, projectId)} reset>
      <div className="flex flex-wrap gap-2">
        <input name="label" required placeholder="Bezeichnung, z. B. Figma, Drive, Staging" className="input min-w-[140px] flex-1" />
        <input name="url" required placeholder="https://…" className="input min-w-[160px] flex-1" />
        <Submit size="sm">Link speichern</Submit>
      </div>
    </ActionForm>
  );
}

/* ───────────── Payments ───────────── */

export function PaymentForm({ invoiceId, open }: { invoiceId: number; open: number }) {
  return (
    <ActionForm action={addPaymentAction.bind(null, invoiceId)} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Datum">
          <input type="date" name="date" defaultValue={todayIso()} className="input" />
        </Field>
        <Field label="Betrag CHF">
          <input name="amount" inputMode="decimal" defaultValue={open > 0 ? open.toFixed(2) : ""} className="input" />
        </Field>
        <Field label="Zahlungsart">
          <select name="method" defaultValue="bank" className="input">
            {Object.entries(paymentMethodLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Notiz">
        <input name="note" className="input" />
      </Field>
      <Submit>Zahlung erfassen</Submit>
    </ActionForm>
  );
}

/* ───────────── Subscriptions ───────────── */

export function SubscriptionForm({
  sub,
  customers,
  projects,
  products,
  defaults,
}: {
  sub?: Subscription;
  customers: Option[];
  projects: (Option & { customerId: number })[];
  products: Product[];
  defaults?: { customerId?: number | null; projectId?: number | null };
}) {
  const s = sub;
  const recurringProducts = products.filter((p) => p.interval);
  return (
    <ActionForm action={saveSubscriptionAction.bind(null, s?.id ?? null)} className="space-y-4">
      {!s && recurringProducts.length > 0 && (
        <ProductPicker
          products={recurringProducts.map((p) => ({ id: p.id, name: p.name, price: p.price, interval: p.interval, description: p.description, category: p.category }))}
        />
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Kunde *">
          <Select name="customerId" options={customers} value={s?.customerId ?? defaults?.customerId} empty="Kunde wählen …" />
        </Field>
        <Field label="Projekt">
          <Select name="projectId" options={projects} value={s?.projectId ?? defaults?.projectId} empty="Keins" />
        </Field>
        <Field label="Bezeichnung *">
          <input name="title" required defaultValue={s?.title ?? ""} className="input" data-pick="name" placeholder="z. B. Hosting & SSL webnova.ch" />
        </Field>
        <Field label="Art">
          <select name="category" defaultValue={s?.category ?? "hosting"} className="input" data-pick="category">
            {Object.entries(subscriptionCategoryLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Betrag pro Intervall CHF (exkl. MWST) *">
          <input name="amount" required inputMode="decimal" defaultValue={s?.amount ?? ""} className="input" data-pick="price" />
        </Field>
        <Field label="Intervall">
          <select name="interval" defaultValue={s?.interval ?? "jahr"} className="input" data-pick="interval">
            {billingIntervals.map((i) => (
              <option key={i} value={i}>
                {intervalLabels[i]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Leistungsbeginn (z. B. Go-live) *">
          <input type="date" name="startDate" required defaultValue={s?.startDate ?? todayIso()} className="input" />
        </Field>
        <Field label="Nächste Verrechnung" hint="Leer lassen: wird aus Beginn und Option «1. Jahr inbegriffen» berechnet.">
          <input type="date" name="nextBillingDate" defaultValue={s?.nextBillingDate ?? ""} className="input" />
        </Field>
        <div className="sm:col-span-2">
          <Check name="firstYearIncluded" label="1. Jahr im Projektpreis inbegriffen (erste Verrechnung ab dem 2. Jahr)" defaultChecked={s ? s.firstYearIncluded : true} />
        </div>
        {s && (
          <>
            <Field label="Status">
              <select name="status" defaultValue={s.status} className="input">
                {subscriptionStatuses.map((x) => (
                  <option key={x} value={x}>
                    {subscriptionStatusLabels[x]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Läuft bis (Kündigung)">
              <input type="date" name="endDate" defaultValue={s.endDate ?? ""} className="input" />
            </Field>
          </>
        )}
        <Field label="Beschreibung auf Rechnung" className="sm:col-span-2">
          <input name="description" defaultValue={s?.description ?? ""} className="input" data-pick="description" />
        </Field>
        <Field label="Interne Notiz (Domain, Server, Zugänge …)" className="sm:col-span-2">
          <textarea name="notes" rows={2} defaultValue={s?.notes ?? ""} className="input" />
        </Field>
      </div>
      <input type="hidden" name="productId" defaultValue={s?.productId ?? ""} data-pick="id" />
      <Submit>{s ? "Abo speichern" : "Abo anlegen"}</Submit>
    </ActionForm>
  );
}

/* ───────────── Expenses ───────────── */

export function ExpenseForm({ expense, customers, projects }: { expense?: Expense; customers: Option[]; projects: Option[] }) {
  const e = expense;
  return (
    <ActionForm action={saveExpenseAction.bind(null, e?.id ?? null)} reset={!e} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Datum *">
          <input type="date" name="date" required defaultValue={e?.date ?? todayIso()} className="input" />
        </Field>
        <Field label="Beschreibung *" className="sm:col-span-2">
          <input name="description" required defaultValue={e?.description ?? ""} className="input" placeholder="z. B. Adobe Creative Cloud" />
        </Field>
        <Field label="Kategorie">
          <select name="category" defaultValue={e?.category ?? "software"} className="input">
            {Object.entries(expenseCategoryLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Betrag CHF (brutto) *">
          <input name="amount" required inputMode="decimal" defaultValue={e?.amount ?? ""} className="input" />
        </Field>
        <Field label="davon MWST (Vorsteuer)">
          <input name="vatAmount" inputMode="decimal" defaultValue={e?.vatAmount || ""} className="input" />
        </Field>
        <Field label="Lieferant">
          <input name="supplier" defaultValue={e?.supplier ?? ""} className="input" />
        </Field>
        <Field label="Beleg (Link)">
          <input name="receiptUrl" defaultValue={e?.receiptUrl ?? ""} className="input" placeholder="Drive, Dropbox …" />
        </Field>
        <Field label="Kunde (weiterverrechenbar)" className="sm:col-span-2">
          <Select name="customerId" options={customers} value={e?.customerId} empty="Keiner" />
        </Field>
        <Field label="Projekt" className="sm:col-span-2">
          <Select name="projectId" options={projects} value={e?.projectId} empty="Keins" />
        </Field>
        <Field label="Notiz" className="sm:col-span-4">
          <input name="notes" defaultValue={e?.notes ?? ""} className="input" />
        </Field>
      </div>
      <Submit>{e ? "Speichern" : "Ausgabe erfassen"}</Submit>
    </ActionForm>
  );
}

/* ───────────── Products ───────────── */

export function ProductForm({ product }: { product?: Product }) {
  const p = product;
  return (
    <ActionForm action={saveProductAction.bind(null, p?.id ?? null)} reset={!p} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Bezeichnung *" className="sm:col-span-2">
          <input name="name" required defaultValue={p?.name ?? ""} className="input" />
        </Field>
        <Field label="Beschreibung (erscheint auf Offerte/Rechnung)" className="sm:col-span-2">
          <textarea name="description" rows={2} defaultValue={p?.description ?? ""} className="input" />
        </Field>
        <Field label="Kategorie">
          <input name="category" defaultValue={p?.category ?? ""} className="input" placeholder="z. B. Webdesign, Hosting" />
        </Field>
        <Field label="Einheit">
          <select name="unit" defaultValue={p?.unit ?? "Pauschal"} className="input">
            {[...new Set([p?.unit ?? "Pauschal", ...units])].map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </Field>
        <Field label="Preis CHF (exkl. MWST) *">
          <input name="price" required inputMode="decimal" defaultValue={p?.price ?? ""} className="input" />
        </Field>
        <Field label="Wiederkehrend">
          <select name="interval" defaultValue={p?.interval ?? ""} className="input">
            <option value="">Nein, einmalig</option>
            {billingIntervals.map((i) => (
              <option key={i} value={i}>
                {intervalLabels[i]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sortierung">
          <input name="sortOrder" inputMode="numeric" defaultValue={p?.sortOrder ?? 0} className="input" />
        </Field>
        <div className="flex items-end pb-2">
          <Check name="active" label="Aktiv (in Auswahl sichtbar)" defaultChecked={p ? p.active : true} />
        </div>
      </div>
      <Submit>{p ? "Speichern" : "Leistung anlegen"}</Submit>
    </ActionForm>
  );
}
