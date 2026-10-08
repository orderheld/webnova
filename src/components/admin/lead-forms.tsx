import type { Lead, ProjectTemplate } from "@/db/schema";
import { leadStatuses } from "@/db/schema";
import { convertLeadAction, saveLeadAction } from "@/lib/admin/crm-actions";
import { leadSourceLabels, leadStageLabels, manualLeadSources } from "@/lib/admin/labels";
import type { Option } from "@/lib/admin/queries";
import { ActionForm, Submit } from "./action-form";
import { ConvertModeFields } from "./convert-fields";
import { Field } from "./ui";

export function LeadForm({ lead }: { lead?: Lead }) {
  const l = lead;
  const sources = l && !manualLeadSources.includes(l.source as (typeof manualLeadSources)[number]) ? [l.source, ...manualLeadSources] : [...manualLeadSources];
  return (
    <ActionForm action={saveLeadAction.bind(null, l?.id ?? null)} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Firma">
          <input name="company" defaultValue={l?.company ?? ""} className="input" placeholder="z. B. Bäckerei Muster GmbH" />
        </Field>
        <Field label="Kontaktperson *">
          <input name="name" required defaultValue={l?.name ?? ""} className="input" placeholder="Vorname Nachname" />
        </Field>
        <Field label="E-Mail">
          <input name="email" type="email" defaultValue={l?.email ?? ""} className="input" />
        </Field>
        <Field label="Telefon">
          <input name="phone" defaultValue={l?.phone ?? ""} className="input" />
        </Field>
        <Field label="Branche">
          <input name="industry" defaultValue={l?.industry ?? ""} className="input" placeholder="z. B. Gastronomie" />
        </Field>
        <Field label="Webseite">
          <input name="websiteUrl" defaultValue={l?.websiteUrl ?? ""} className="input" placeholder="www.beispiel.ch" />
        </Field>
        <Field label="Strasse & Nr.">
          <input name="street" defaultValue={l?.street ?? ""} className="input" />
        </Field>
        <div className="grid grid-cols-[100px_1fr] gap-3">
          <Field label="PLZ">
            <input name="zip" defaultValue={l?.zip ?? ""} className="input" />
          </Field>
          <Field label="Ort">
            <input name="city" defaultValue={l?.city ?? ""} className="input" />
          </Field>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Quelle">
          <select name="source" defaultValue={l?.source ?? "akquise"} className="input">
            {sources.map((s) => (
              <option key={s} value={s}>
                {leadSourceLabels[s] ?? s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Phase">
          <select name="status" defaultValue={l?.status ?? "neu"} className="input">
            {leadStatuses.map((s) => (
              <option key={s} value={s}>
                {leadStageLabels[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Potenzial CHF">
          <input name="value" inputMode="decimal" defaultValue={l?.value ?? ""} className="input" placeholder="z. B. 4500" />
        </Field>
        <Field label="Follow-up am">
          <input name="followUpAt" type="date" defaultValue={l?.followUpAt ?? ""} className="input" />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
        <Field label="Bewertung aktuelle Webseite">
          <select name="websiteRating" defaultValue={l?.websiteRating ?? ""} className="input">
            <option value="">Nicht bewertet</option>
            <option value="1">1 · sehr schlecht</option>
            <option value="2">2 · veraltet</option>
            <option value="3">3 · okay</option>
            <option value="4">4 · gut</option>
            <option value="5">5 · sehr gut</option>
          </select>
        </Field>
        <Field label="Notiz zur Webseite (Mängel, Chancen)">
          <input name="websiteNotes" defaultValue={l?.websiteNotes ?? ""} className="input" placeholder="z. B. nicht mobiltauglich, kein SSL, langsam" />
        </Field>
      </div>
      <Field label="Interne Notizen">
        <textarea name="notes" rows={3} defaultValue={l?.notes ?? ""} className="input" />
      </Field>
      {l?.status === "verloren" && (
        <Field label="Grund für Verlust">
          <input name="lostReason" defaultValue={l?.lostReason ?? ""} className="input" />
        </Field>
      )}
      <input type="hidden" name="hasWebsite" value={l?.hasWebsite === true ? "ja" : l?.hasWebsite === false ? "nein" : ""} />
      <Submit>{l ? "Änderungen speichern" : "Lead anlegen"}</Submit>
    </ActionForm>
  );
}

export function ConvertLeadForm({ lead, customers, templates }: { lead: Lead; customers: Option[]; templates: ProjectTemplate[] }) {
  const label = lead.company || lead.name;
  return (
    <ActionForm action={convertLeadAction.bind(null, lead.id)} className="space-y-4">
      <ConvertModeFields customers={customers} hasCustomer={!!lead.customerId} />
      <label className="flex items-start gap-3 rounded-xl border border-line p-3">
        <input type="checkbox" name="createProject" defaultChecked className="mt-1 h-4 w-4 accent-[var(--color-accent)]" />
        <span className="flex-1 space-y-2">
          <span className="block text-[14px] font-medium">Projekt anlegen</span>
          <input name="projectName" className="input" placeholder={`Projektname, z. B. Webseite ${label}`} />
          <select name="templateId" className="input" defaultValue={(templates.find((t) => /webseite/i.test(t.name)) ?? templates[0])?.id ?? ""}>
            <option value="">Ohne Vorlage</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                Vorlage: {t.name} ({t.tasks.length} Aufgaben)
              </option>
            ))}
          </select>
        </span>
      </label>
      <label className="flex items-start gap-3 rounded-xl border border-line p-3">
        <input type="checkbox" name="createQuote" defaultChecked className="mt-1 h-4 w-4 accent-[var(--color-accent)]" />
        <span className="flex-1 space-y-2">
          <span className="block text-[14px] font-medium">Offerte als Entwurf erstellen</span>
          <span className="block text-[12.5px] text-muted">Positionen kommen aus den Leistungen der gewählten Vorlage, wiederkehrende Kosten (Hosting, Wartung, Domain) inklusive.</span>
          <input name="quoteTitle" className="input" placeholder="Titel der Offerte (optional)" />
        </span>
      </label>
      <Submit>Jetzt umwandeln</Submit>
    </ActionForm>
  );
}
