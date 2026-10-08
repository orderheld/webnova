"use client";

import { useActionState } from "react";
import { saveSettingsAction } from "@/lib/admin/actions";
import type { CompanySettings } from "@/lib/admin/settings";
import { Spinner } from "./feedback";
import { Card, Field, btn } from "./ui";

export function SettingsForm({ s }: { s: CompanySettings }) {
  const [state, action, pending] = useActionState(saveSettingsAction, {});
  const input = (name: keyof CompanySettings, label: string, type = "text", cls = "") => (
    <Field label={label} className={cls}>
      <input name={name} type={type} step={type === "number" ? "0.1" : undefined} defaultValue={String(s[name])} className="input" />
    </Field>
  );
  const area = (name: keyof CompanySettings, label: string, rows = 3) => (
    <Field label={label}>
      <textarea name={name} rows={rows} defaultValue={String(s[name])} className="input" />
    </Field>
  );
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-2">
      <Card title="Firma">
        <div className="grid gap-4 sm:grid-cols-2">
          {input("companyName", "Firmenname")}
          {input("owner", "Ihr Name (Unterschrift)")}
          {input("street", "Strasse & Nr.", "text", "sm:col-span-2")}
          {input("zip", "PLZ")}
          {input("city", "Ort")}
          {input("email", "E-Mail", "email")}
          {input("phone", "Telefon")}
          {input("website", "Webseite", "text", "sm:col-span-2")}
        </div>
      </Card>
      <Card title="Zahlung & Steuern">
        <div className="grid gap-4 sm:grid-cols-2">
          {input("iban", "IBAN (für QR-Rechnung)", "text", "sm:col-span-2")}
          {input("bankName", "Bank (Fusszeile)")}
          {input("uid", "UID (CHE-…)")}
          {input("hourlyRate", "Stundensatz CHF (Rechner)", "number")}
          {input("paymentTermDays", "Zahlungsfrist (Tage)", "number")}
          {input("quoteValidityDays", "Offerte gültig (Tage)", "number")}
          <label className="flex items-center gap-3 self-end py-3 text-[14px]">
            <input type="checkbox" name="vatEnabled" defaultChecked={s.vatEnabled} className="h-[18px] w-[18px]" /> MWST-pflichtig
          </label>
          {input("vatRate", "MWST-Satz %", "number")}
          {input("vatNumber", "MWST-Nr. (CHE-…)")}
          {input("quotePrefix", "Präfix Offerten")}
          {input("invoicePrefix", "Präfix Rechnungen")}
          {input("creditPrefix", "Präfix Gutschriften")}
        </div>
      </Card>
      <Card title="Texte Offerte">
        <div className="space-y-4">
          {area("quoteIntro", "Einleitung")}
          {area("quoteOutro", "Schlusstext")}
          {area("quoteEmailText", "E-Mail-Text ({name}, {nummer}, {absender})", 7)}
        </div>
      </Card>
      <Card title="Texte Rechnung">
        <div className="space-y-4">
          {area("invoiceIntro", "Einleitung")}
          {area("invoiceOutro", "Schlusstext")}
          {area("invoiceEmailText", "E-Mail-Text ({name}, {nummer}, {betrag}, {faellig}, {absender})", 7)}
        </div>
      </Card>
      <Card title="Mahnwesen">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {input("reminderDays", "Neue Frist (Tage)", "number")}
            {input("reminderFee1", "Gebühr 1. Mahnung CHF", "number")}
            {input("reminderFee2", "Gebühr 2. Mahnung CHF", "number")}
          </div>
          {area("reminderText1", "Text Zahlungserinnerung (1. Mahnung)", 4)}
          {area("reminderText2", "Text 2. Mahnung", 4)}
          {area("reminderEmailText", "E-Mail-Text ({name}, {nummer}, {betrag}, {faellig}, {absender})", 7)}
        </div>
      </Card>
      <Card title="Abos und Gutschriften">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {input("subscriptionLeadDays", "Abos verrechnen (Tage im Voraus)", "number")}
            {input("subscriptionInvoiceTitle", "Titel Abo-Rechnung")}
          </div>
          {area("subscriptionIntro", "Einleitung Abo-Rechnung")}
          {area("creditIntro", "Einleitung Gutschrift")}
          {area("creditOutro", "Schlusstext Gutschrift")}
        </div>
      </Card>
      <div className="flex items-center gap-4 lg:col-span-2">
        <button disabled={pending} aria-busy={pending || undefined} className={btn.dark}>
          {pending && <Spinner className="h-3.5 w-3.5" />}
          {pending ? "Speichern …" : "Einstellungen speichern"}
        </button>
        {state?.ok && <span className="text-[14px] text-success">Gespeichert.</span>}
        {state?.error && <span className="text-[14px] text-danger">{state.error}</span>}
      </div>
    </form>
  );
}
