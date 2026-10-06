"use client";

import { useActionState } from "react";
import type { Customer } from "@/db/schema";
import { saveCustomerAction } from "@/lib/admin/actions";
import { Field, btn } from "./ui";

export function CustomerForm({ customer }: { customer?: Customer }) {
  const [state, action, pending] = useActionState(saveCustomerAction.bind(null, customer?.id ?? null), {});
  const c = customer;
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
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
          </select>
        </Field>
        <Field label="Webseite" className="sm:col-span-2">
          <input name="website" defaultValue={c?.website ?? ""} className="input" />
        </Field>
        <Field label="Notizen" className="sm:col-span-2">
          <textarea name="notes" rows={4} defaultValue={c?.notes ?? ""} className="input" />
        </Field>
      </div>
      {state?.error && <p className="text-[13px] text-danger">{state.error}</p>}
      {state?.ok && <p className="text-[13px] text-success">Gespeichert.</p>}
      <button disabled={pending} className={btn.dark}>
        {pending ? "Speichern …" : c ? "Änderungen speichern" : "Kunde anlegen"}
      </button>
    </form>
  );
}
