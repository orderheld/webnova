import type { Customer } from "@/db/schema";
import { saveCustomerAction } from "@/lib/admin/actions";
import { ActionForm, Submit } from "./action-form";
import { Field } from "./ui";

export function CustomerForm({ customer }: { customer?: Customer }) {
  const c = customer;
  return (
    <ActionForm action={saveCustomerAction.bind(null, c?.id ?? null)} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Firma" className="sm:col-span-2">
          <input name="company" defaultValue={c?.company ?? ""} className="input" />
        </Field>
        <Field label="Vorname">
          <input name="firstName" defaultValue={c?.firstName ?? ""} className="input" />
        </Field>
        <Field label="Nachname">
          <input name="lastName" defaultValue={c?.lastName ?? ""} className="input" />
        </Field>
        <Field label="E-Mail">
          <input name="email" type="email" defaultValue={c?.email ?? ""} className="input" />
        </Field>
        <Field label="Telefon">
          <input name="phone" defaultValue={c?.phone ?? ""} className="input" />
        </Field>
        <Field label="Strasse & Nr." className="sm:col-span-2">
          <input name="street" defaultValue={c?.street ?? ""} className="input" />
        </Field>
        <Field label="PLZ">
          <input name="zip" defaultValue={c?.zip ?? ""} className="input" />
        </Field>
        <Field label="Ort">
          <input name="city" defaultValue={c?.city ?? ""} className="input" />
        </Field>
        <Field label="Land">
          <input name="country" defaultValue={c?.country ?? "CH"} className="input" />
        </Field>
        <Field label="Sprache">
          <select name="language" defaultValue={c?.language ?? "de"} className="input">
            <option value="de">Deutsch</option>
            <option value="fr">Französisch</option>
            <option value="it">Italienisch</option>
            <option value="en">Englisch</option>
          </select>
        </Field>
        <Field label="Webseite">
          <input name="website" defaultValue={c?.website ?? ""} className="input" />
        </Field>
        <Field label="Branche">
          <input name="industry" defaultValue={c?.industry ?? ""} className="input" />
        </Field>
        <Field label="UID / MWST-Nr.">
          <input name="vatNumber" defaultValue={c?.vatNumber ?? ""} className="input" placeholder="CHE-123.456.789" />
        </Field>
        <Field label="Notizen" className="sm:col-span-2">
          <textarea name="notes" rows={4} defaultValue={c?.notes ?? ""} className="input" />
        </Field>
      </div>
      <Submit>{c ? "Änderungen speichern" : "Kunde anlegen"}</Submit>
    </ActionForm>
  );
}
