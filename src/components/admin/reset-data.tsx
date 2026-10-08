"use client";

import { useActionState } from "react";
import { resetBusinessDataAction, type ResetState } from "@/lib/admin/reset-actions";
import { Card } from "./ui";

/** Danger zone: the owner deletes all customers, quotes and invoices himself. */
export function ResetData() {
  const [state, action, pending] = useActionState<ResetState, FormData>(resetBusinessDataAction, {});
  return (
    <Card title="Daten zurücksetzen" className="mt-6">
      <p className="text-[14px] leading-relaxed text-muted">
        Löscht unwiderruflich alle Kunden, Offerten, Rechnungen (mit Zahlungen, Mahnungen und Gutschriften), Projekte mit Aufgaben und Zeiterfassung sowie Abos.
        Anfragen, Ausgaben, Kalkulationen, Produkte, Vorlagen und Einstellungen bleiben erhalten.
      </p>
      {state.done ? (
        <p className="mt-4 rounded-lg bg-success/10 px-4 py-3 text-[14px] font-medium text-success">
          Gelöscht: {state.done.customers} Kunden, {state.done.quotes} Offerten, {state.done.invoices} Rechnungen, {state.done.projects} Projekte.
        </p>
      ) : (
        <form
          action={action}
          onSubmit={(e) => {
            if (!window.confirm("Wirklich alle Kunden, Offerten und Rechnungen unwiderruflich löschen?")) e.preventDefault();
          }}
          className="mt-4 flex flex-wrap items-center gap-3"
        >
          <input name="confirm" placeholder="LÖSCHEN eintippen" autoComplete="off" className="input max-w-[220px]" aria-label="Zur Bestätigung LÖSCHEN eintippen" />
          <button type="submit" disabled={pending} className="rounded-lg bg-danger px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
            {pending ? "Wird gelöscht ..." : "Alles löschen"}
          </button>
          {state.error && <p className="w-full text-[13.5px] text-danger">{state.error}</p>}
        </form>
      )}
    </Card>
  );
}
