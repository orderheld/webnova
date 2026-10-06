"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "@/components/icons";
import type { LineItem } from "@/db/schema";
import { saveInvoiceAction, saveQuoteAction } from "@/lib/admin/actions";
import { chf, computeTotals } from "@/lib/admin/money";
import { Field, btn } from "./ui";

export interface DocInitial {
  customerId: number | null;
  title: string;
  intro: string;
  outro: string;
  items: LineItem[];
  discountPercent: number;
  vatRate: number;
  issueDate: string;
  secondDate: string;
  quoteId?: number | null;
}

const units = ["Pauschal", "Std.", "Stk.", "Monat", "Jahr", "Seiten", "Tag"];
const emptyItem = (): LineItem => ({ title: "", description: "", quantity: 1, unit: "Pauschal", unitPrice: 0 });

export function DocumentEditor({
  kind,
  id,
  initial,
  customers,
  locked = false,
}: {
  kind: "quote" | "invoice";
  id: number | null;
  initial: DocInitial;
  customers: { id: number; name: string }[];
  locked?: boolean;
}) {
  const router = useRouter();
  const [v, setV] = useState<DocInitial>({ ...initial, items: initial.items.length ? initial.items : [emptyItem()] });
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const set = <K extends keyof DocInitial>(k: K, val: DocInitial[K]) => setV((p) => ({ ...p, [k]: val }));
  const setItem = (i: number, patch: Partial<LineItem>) => set("items", v.items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= v.items.length) return;
    const items = [...v.items];
    [items[i], items[j]] = [items[j], items[i]];
    set("items", items);
  };
  const t = computeTotals(v.items, v.discountPercent, v.vatRate);

  function save() {
    setMsg(null);
    start(async () => {
      const payload = {
        ...v,
        customerId: v.customerId ?? 0,
        items: v.items.filter((it) => it.title.trim()),
      };
      const res = kind === "quote" ? await saveQuoteAction(id, payload) : await saveInvoiceAction(id, payload);
      if (res.error) return setMsg({ type: "err", text: res.error });
      setMsg({ type: "ok", text: "Gespeichert." });
      if (!id && res.id) router.push(`/admin/${kind === "quote" ? "offerten" : "rechnungen"}/${res.id}`);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-[20px] border border-line bg-surface p-5 md:grid-cols-4">
        <Field label="Kunde" className="md:col-span-2">
          <select
            className="input"
            value={v.customerId ?? ""}
            disabled={locked}
            onChange={(e) => set("customerId", e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Kunde wählen …</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Datum">
          <input type="date" className="input" value={v.issueDate} disabled={locked} onChange={(e) => set("issueDate", e.target.value)} />
        </Field>
        <Field label={kind === "quote" ? "Gültig bis" : "Zahlbar bis"}>
          <input type="date" className="input" value={v.secondDate} disabled={locked} onChange={(e) => set("secondDate", e.target.value)} />
        </Field>
        <Field label="Titel / Projekt" className="md:col-span-4">
          <input className="input" value={v.title} disabled={locked} placeholder="z. B. Neue Webseite Muster AG" onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Einleitung" className="md:col-span-4">
          <textarea className="input" rows={2} value={v.intro} disabled={locked} onChange={(e) => set("intro", e.target.value)} />
        </Field>
      </div>

      <div className="rounded-[20px] border border-line bg-surface">
        <div className="hidden grid-cols-[1fr_90px_110px_120px_110px_72px] gap-3 border-b border-line px-5 py-3 text-[12px] uppercase tracking-wider text-muted md:grid">
          <span>Position</span>
          <span className="text-right">Menge</span>
          <span>Einheit</span>
          <span className="text-right">Preis CHF</span>
          <span className="text-right">Total</span>
          <span />
        </div>
        <div className="divide-y divide-line">
          {v.items.map((it, i) => (
            <div key={i} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_90px_110px_120px_110px_72px] md:items-start">
              <div className="space-y-2">
                <input className="input font-medium" placeholder="Leistung" value={it.title} disabled={locked} onChange={(e) => setItem(i, { title: e.target.value })} />
                <textarea
                  className="input text-[14px]"
                  rows={1}
                  placeholder="Beschreibung (optional)"
                  value={it.description ?? ""}
                  disabled={locked}
                  onChange={(e) => setItem(i, { description: e.target.value })}
                />
              </div>
              <input
                type="number"
                step="0.25"
                className="input text-right tabular-nums"
                value={it.quantity}
                disabled={locked}
                onChange={(e) => setItem(i, { quantity: Number(e.target.value) })}
                aria-label="Menge"
              />
              <select className="input" value={it.unit} disabled={locked} onChange={(e) => setItem(i, { unit: e.target.value })} aria-label="Einheit">
                {[...new Set([it.unit, ...units])].map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.05"
                className="input text-right tabular-nums"
                value={it.unitPrice}
                disabled={locked}
                onChange={(e) => setItem(i, { unitPrice: Number(e.target.value) })}
                aria-label="Preis"
              />
              <p className="py-3.5 text-right text-[15px] font-medium tabular-nums">{chf((it.quantity || 0) * (it.unitPrice || 0))}</p>
              {!locked && (
                <div className="flex items-center justify-end gap-1 py-2">
                  <button type="button" onClick={() => move(i, -1)} className="grid h-8 w-6 place-items-center text-muted hover:text-ink" aria-label="Nach oben">
                    ↑
                  </button>
                  <button type="button" onClick={() => move(i, 1)} className="grid h-8 w-6 place-items-center text-muted hover:text-ink" aria-label="Nach unten">
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => set("items", v.items.filter((_, j) => j !== i))}
                    className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-danger/10 hover:text-danger"
                    aria-label="Position entfernen"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {!locked && (
          <div className="border-t border-line px-5 py-3">
            <button type="button" onClick={() => set("items", [...v.items, emptyItem()])} className="inline-flex items-center gap-2 text-[14px] font-medium text-accent">
              <Icon name="plus" className="h-4 w-4" /> Position hinzufügen
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-[20px] border border-line bg-surface p-5">
          <Field label="Schlusstext">
            <textarea className="input" rows={3} value={v.outro} disabled={locked} onChange={(e) => set("outro", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rabatt %">
              <input type="number" step="0.5" min={0} className="input" value={v.discountPercent} disabled={locked} onChange={(e) => set("discountPercent", Number(e.target.value))} />
            </Field>
            <Field label="MWST %">
              <input type="number" step="0.1" min={0} className="input" value={v.vatRate} disabled={locked} onChange={(e) => set("vatRate", Number(e.target.value))} />
            </Field>
          </div>
        </div>
        <div className="rounded-[20px] bg-night p-6 text-white">
          <dl className="space-y-2 text-[15px]">
            <Row k="Zwischentotal" v={chf(t.subtotal)} />
            {v.discountPercent > 0 && <Row k={`Rabatt ${v.discountPercent}%`} v={`– ${chf(t.discount)}`} />}
            {v.vatRate > 0 && <Row k={`MWST ${v.vatRate}%`} v={chf(t.vat)} />}
          </dl>
          <div className="mt-4 flex items-end justify-between border-t border-white/15 pt-4">
            <span className="text-white/60">Total CHF</span>
            <span className="text-[34px] font-medium tracking-tight tabular-nums">{chf(t.total)}</span>
          </div>
          {!locked && (
            <button type="button" onClick={save} disabled={pending} className={`${btn.accent} mt-6 w-full`}>
              {pending ? "Speichern …" : id ? "Änderungen speichern" : kind === "quote" ? "Offerte erstellen" : "Rechnung erstellen"}
            </button>
          )}
          {locked && <p className="mt-6 text-[13px] text-white/60">Bezahlte oder stornierte Rechnungen können nicht mehr bearbeitet werden.</p>}
          {msg && <p className={`mt-3 text-[13px] ${msg.type === "ok" ? "text-emerald-300" : "text-red-300"}`}>{msg.text}</p>}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-white/60">{k}</dt>
      <dd className="tabular-nums">{v}</dd>
    </div>
  );
}
