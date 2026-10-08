"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { BillingInterval, LineItem } from "@/db/schema";
import { saveInvoiceAction, saveQuoteAction } from "@/lib/admin/actions";
import { intervalLabels, units } from "@/lib/admin/labels";
import { chf, computeTotals, isPriced, lineTotal } from "@/lib/admin/money";
import { Icon } from "./icons";
import { Field, btn } from "./ui";

export interface DocInitial {
  customerId: number | null;
  projectId?: number | null;
  title: string;
  intro: string;
  outro: string;
  notes?: string;
  items: LineItem[];
  discountPercent: number;
  vatRate: number;
  issueDate: string;
  secondDate: string;
  quoteId?: number | null;
  leadId?: number | null;
}

export interface CatalogItem {
  id: number;
  name: string;
  description: string | null;
  unit: string;
  price: number;
  interval: BillingInterval | null;
  category: string | null;
}

const emptyItem = (): LineItem => ({ title: "", description: "", quantity: 1, unit: "Pauschal", unitPrice: 0 });
const layoutRow = (type: "title" | "text"): LineItem => ({ type, title: "", description: "", quantity: 0, unit: "", unitPrice: 0 });

export function DocumentEditor({
  kind,
  id,
  initial,
  customers,
  projects = [],
  products = [],
  locked = false,
  credit = false,
}: {
  kind: "quote" | "invoice";
  id: number | null;
  initial: DocInitial;
  customers: { id: number; name: string }[];
  projects?: { id: number; name: string; customerId: number }[];
  products?: CatalogItem[];
  locked?: boolean;
  credit?: boolean;
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
  const addProduct = (pid: number) => {
    const p = products.find((x) => x.id === pid);
    if (!p) return;
    const item: LineItem = {
      title: p.name,
      description: p.description ?? "",
      quantity: 1,
      unit: p.unit,
      unitPrice: p.price,
      productId: p.id,
      ...(kind === "quote" && p.interval ? { recurring: p.interval, firstYearIncluded: p.interval === "jahr" } : {}),
    };
    // replace a single empty starter line
    const items = v.items.filter((it) => !isPriced(it) || it.title.trim() || it.unitPrice);
    set("items", [...items, item]);
  };
  const t = computeTotals(v.items, v.discountPercent, v.vatRate);
  const recurring = kind === "quote" ? v.items.filter((it) => it.recurring && isPriced(it) && it.title.trim()) : [];
  const customerProjects = projects.filter((p) => !v.customerId || p.customerId === v.customerId);

  function save() {
    setMsg(null);
    start(async () => {
      const payload = {
        ...v,
        customerId: v.customerId ?? 0,
        projectId: v.projectId || null,
        notes: v.notes ?? "",
        items: v.items
          .filter((it) => it.title.trim())
          .map((it) => ({ ...it, type: it.type ?? "item", discount: it.discount || 0, productId: it.productId ?? null, recurring: it.recurring ?? null, subscriptionId: it.subscriptionId ?? null })),
      };
      const res = kind === "quote" ? await saveQuoteAction(id, { ...payload, leadId: v.leadId ?? null }) : await saveInvoiceAction(id, payload);
      if (res.error) return setMsg({ type: "err", text: res.error });
      setMsg({ type: "ok", text: "Gespeichert." });
      if (!id && res.id) router.push(`/admin/${kind === "quote" ? "offerten" : "rechnungen"}/${res.id}`);
      else router.refresh();
    });
  }

  const grid = "md:grid-cols-[1fr_68px_116px_100px_68px_96px_76px]";

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-2xl border border-line bg-surface shadow-xs p-4 sm:p-5 md:grid-cols-4">
        <Field label="Kunde" className="md:col-span-2">
          <select className="input" value={v.customerId ?? ""} disabled={locked} onChange={(e) => setV((p) => ({ ...p, customerId: e.target.value ? Number(e.target.value) : null, projectId: null }))}>
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
        <Field label={kind === "quote" ? "Gültig bis" : credit ? "Datum Erstattung" : "Zahlbar bis"}>
          <input type="date" className="input" value={v.secondDate} disabled={locked} onChange={(e) => set("secondDate", e.target.value)} />
        </Field>
        <Field label="Titel / Projekt" className="md:col-span-3">
          <input className="input" value={v.title} disabled={locked} placeholder="z. B. Neue Webseite Muster AG" onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Projekt verknüpfen">
          <select className="input" value={v.projectId ?? ""} disabled={locked} onChange={(e) => set("projectId", e.target.value ? Number(e.target.value) : null)}>
            <option value="">Keins</option>
            {customerProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Einleitung" className="md:col-span-4">
          <textarea className="input" rows={2} value={v.intro} disabled={locked} onChange={(e) => set("intro", e.target.value)} />
        </Field>
      </div>

      <div className="rounded-2xl border border-line bg-surface shadow-xs">
        <div className={`hidden gap-3 border-b border-line px-5 py-2.5 text-[11.5px] uppercase tracking-wider text-muted md:grid ${grid}`}>
          <span>Position</span>
          <span className="text-right">Menge</span>
          <span>Einheit</span>
          <span className="text-right">Preis CHF</span>
          <span className="text-right">Rabatt %</span>
          <span className="text-right">Total</span>
          <span />
        </div>
        <div className="divide-y divide-line">
          {v.items.map((it, i) =>
            !isPriced(it) ? (
              <div key={i} className="flex items-start gap-2 bg-bg/50 px-4 py-3 sm:px-5">
                <span className="mt-2.5 w-12 shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted">{it.type === "title" ? "Titel" : "Text"}</span>
                {it.type === "title" ? (
                  <input className="input flex-1 font-semibold" placeholder="Zwischentitel" value={it.title} disabled={locked} onChange={(e) => setItem(i, { title: e.target.value })} />
                ) : (
                  <textarea className="input flex-1 text-[14px]" rows={2} placeholder="Freier Text" value={it.title} disabled={locked} onChange={(e) => setItem(i, { title: e.target.value })} />
                )}
                {!locked && <RowTools onUp={() => move(i, -1)} onDown={() => move(i, 1)} onRemove={() => set("items", v.items.filter((_, j) => j !== i))} />}
              </div>
            ) : (
            <div key={i} className={`grid gap-2 px-4 py-3 sm:px-5 md:items-start md:gap-3 ${grid} ${it.recurring ? "bg-accent-soft/40" : ""}`}>
              <div className="space-y-2">
                <input className="input font-medium" placeholder="Leistung" value={it.title} disabled={locked} onChange={(e) => setItem(i, { title: e.target.value })} />
                <textarea
                  className="input text-[14px]"
                  rows={it.description && it.description.split("\n").length > 1 ? Math.min(6, it.description.split("\n").length) : 1}
                  placeholder="Beschreibung (optional)"
                  value={it.description ?? ""}
                  disabled={locked}
                  onChange={(e) => setItem(i, { description: e.target.value })}
                />
                {kind === "quote" && (
                  <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-muted">
                    <label className="flex items-center gap-1.5">
                      <Icon name="repeat" className="h-3.5 w-3.5" />
                      <select
                        className="rounded-md border border-line bg-surface px-1.5 py-0.5 text-[12.5px]"
                        value={it.recurring ?? ""}
                        disabled={locked}
                        onChange={(e) => setItem(i, { recurring: (e.target.value || null) as BillingInterval | null, firstYearIncluded: e.target.value ? (it.firstYearIncluded ?? true) : undefined })}
                        aria-label="Wiederkehrend"
                      >
                        <option value="">einmalig</option>
                        {Object.entries(intervalLabels).map(([k, l]) => (
                          <option key={k} value={k}>
                            {l} wiederkehrend
                          </option>
                        ))}
                      </select>
                    </label>
                    {it.recurring && (
                      <label className="flex items-center gap-1.5">
                        <input type="checkbox" checked={!!it.firstYearIncluded} disabled={locked} onChange={(e) => setItem(i, { firstYearIncluded: e.target.checked })} />
                        1. Jahr inbegriffen, Verrechnung ab Jahr 2
                      </label>
                    )}
                  </div>
                )}
                {it.subscriptionId && <p className="text-[12px] text-accent">Aus Abo #{it.subscriptionId}</p>}
              </div>
              <div className="grid grid-cols-4 gap-2 md:contents">
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
                <input
                  type="number"
                  step="1"
                  min={0}
                  max={100}
                  className="input text-right tabular-nums"
                  value={it.discount || ""}
                  placeholder="0"
                  disabled={locked}
                  onChange={(e) => setItem(i, { discount: Number(e.target.value) || 0 })}
                  aria-label="Rabatt in Prozent"
                />
              </div>
              <p className="flex items-center justify-between py-1 text-[15px] font-medium tabular-nums md:block md:py-2.5 md:text-right">
                <span className="text-[12px] font-normal text-muted md:hidden">Total</span>
                {chf(lineTotal(it))}
                {it.recurring && <span className="block text-[11px] font-normal text-muted">{intervalLabels[it.recurring]}</span>}
              </p>
              {!locked && <RowTools onUp={() => move(i, -1)} onDown={() => move(i, 1)} onRemove={() => set("items", v.items.filter((_, j) => j !== i))} />}
            </div>
            ),
          )}
        </div>
        {!locked && (
          <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-3 sm:px-5">
            <button type="button" onClick={() => set("items", [...v.items, emptyItem()])} className="inline-flex items-center gap-2 text-[14px] font-medium text-accent">
              <Icon name="plus" className="h-4 w-4" /> Freie Position
            </button>
            <button type="button" onClick={() => set("items", [...v.items, layoutRow("title")])} className="inline-flex items-center gap-2 text-[14px] font-medium text-accent">
              <Icon name="plus" className="h-4 w-4" /> Titel
            </button>
            <button type="button" onClick={() => set("items", [...v.items, layoutRow("text")])} className="inline-flex items-center gap-2 text-[14px] font-medium text-accent">
              <Icon name="plus" className="h-4 w-4" /> Text
            </button>
            {products.length > 0 && (
              <select
                className="input w-auto max-w-full"
                value=""
                onChange={(e) => addProduct(Number(e.target.value))}
                aria-label="Leistung aus Katalog hinzufügen"
              >
                <option value="">+ Aus Leistungen hinzufügen …</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · CHF {chf(p.price)}
                    {p.interval ? ` ${intervalLabels[p.interval]}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-line bg-surface shadow-xs p-4 sm:p-5">
          <Field label="Schlusstext">
            <textarea className="input" rows={3} value={v.outro} disabled={locked} onChange={(e) => set("outro", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Rabatt %">
              <input type="number" step="0.5" min={0} className="input" value={v.discountPercent} disabled={locked} onChange={(e) => set("discountPercent", Number(e.target.value))} />
            </Field>
            <Field label="MWST %">
              <input type="number" step="0.1" min={0} className="input" value={v.vatRate} disabled={locked} onChange={(e) => set("vatRate", Number(e.target.value))} />
            </Field>
          </div>
          <Field label="Interne Notiz (nicht auf dem PDF)">
            <textarea className="input" rows={2} value={v.notes ?? ""} disabled={locked} onChange={(e) => set("notes", e.target.value)} />
          </Field>
        </div>
        <div className="rounded-2xl bg-night p-5 text-white sm:p-6">
          <dl className="space-y-2 text-[15px]">
            <Row k="Zwischentotal" v={chf(t.subtotal)} />
            {v.discountPercent > 0 && <Row k={`Rabatt ${v.discountPercent}%`} v={`– ${chf(t.discount)}`} />}
            {v.vatRate > 0 && <Row k={`MWST ${v.vatRate}%`} v={chf(t.vat)} />}
          </dl>
          <div className="mt-4 flex items-end justify-between border-t border-white/15 pt-4">
            <span className="text-white/60">{credit ? "Gutschrift CHF" : kind === "quote" ? "Einmalig CHF" : "Total CHF"}</span>
            <span className="text-[30px] font-semibold tracking-tight tabular-nums">{chf(t.total)}</span>
          </div>
          {recurring.length > 0 && (
            <div className="mt-4 space-y-1 border-t border-white/15 pt-3 text-[13px]">
              <p className="text-white/60">Wiederkehrend (nicht im Total)</p>
              {recurring.map((it, i) => (
                <div key={i} className="flex justify-between gap-3">
                  <span className="truncate">
                    {it.title}
                    {it.firstYearIncluded ? " · ab Jahr 2" : ""}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {chf(lineTotal(it))} {intervalLabels[it.recurring!]}
                  </span>
                </div>
              ))}
            </div>
          )}
          {!locked && (
            <button type="button" onClick={save} disabled={pending} className={`${btn.ghost} mt-6 w-full border-white bg-white text-ink hover:bg-accent-soft hover:text-ink`}>
              {pending ? "Speichern …" : id ? "Änderungen speichern" : kind === "quote" ? "Offerte erstellen" : credit ? "Gutschrift erstellen" : "Rechnung erstellen"}
            </button>
          )}
          {locked && <p className="mt-6 text-[13px] text-white/60">Bezahlte oder stornierte Dokumente können nicht mehr bearbeitet werden. Duplizieren oder Gutschrift erstellen.</p>}
          {msg && <p className={`mt-3 text-[13px] ${msg.type === "ok" ? "text-[#a8d1b5]" : "text-[#e7b9b9]"}`}>{msg.text}</p>}
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

function RowTools({ onUp, onDown, onRemove }: { onUp: () => void; onDown: () => void; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-end gap-0.5 md:py-1.5">
      <button type="button" onClick={onUp} className="grid h-8 w-6 place-items-center text-muted hover:text-ink" aria-label="Nach oben">
        <Icon name="up" className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={onDown} className="grid h-8 w-6 place-items-center text-muted hover:text-ink" aria-label="Nach unten">
        <Icon name="down" className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={onRemove} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-danger/10 hover:text-danger" aria-label="Position entfernen">
        <Icon name="trash" className="h-4 w-4" />
      </button>
    </div>
  );
}
