"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { BillingInterval } from "@/db/schema";
import { saveCalculatorConfigAction } from "@/lib/admin/calculator-actions";
import { defaultCalculatorConfig, type CalculatorConfig } from "@/lib/admin/calculator";
import { intervalLabels } from "@/lib/admin/labels";
import { Icon } from "./icons";
import { Card, Field, btn, iconBtn } from "./ui";

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
const num = "input py-1.5 text-right tabular-nums";
const units = ["Pauschal", "Seiten", "Sprachen", "Produkte", "Stk.", "Std."];

export function CalculatorConfigForm({ initial }: { initial: CalculatorConfig }) {
  const router = useRouter();
  const [c, setC] = useState(initial);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();

  function update<K extends "packages" | "addons" | "recurring">(k: K, i: number, patch: Partial<CalculatorConfig[K][number]>) {
    setC((x) => ({ ...x, [k]: (x[k] as CalculatorConfig[K][number][]).map((row, j) => (j === i ? { ...row, ...patch } : row)) }));
  }
  function remove(k: "packages" | "addons" | "recurring", i: number) {
    setC((x) => ({ ...x, [k]: (x[k] as unknown[]).filter((_, j) => j !== i) }));
  }
  function move(k: "packages" | "addons" | "recurring", i: number, dir: -1 | 1) {
    setC((x) => {
      const list = [...(x[k] as unknown[])];
      const j = i + dir;
      if (j < 0 || j >= list.length) return x;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...x, [k]: list };
    });
  }
  function save() {
    setMsg(null);
    start(async () => {
      const r = await saveCalculatorConfigAction(c);
      if (r.error) return setMsg({ type: "err", text: r.error });
      setMsg({ type: "ok", text: "Preise gespeichert." });
      router.refresh();
    });
  }

  const tools = (k: "packages" | "addons" | "recurring", i: number) => (
    <div className="flex items-center">
      <button type="button" className={iconBtn} onClick={() => move(k, i, -1)} aria-label="Nach oben">
        <Icon name="up" className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={iconBtn} onClick={() => move(k, i, 1)} aria-label="Nach unten">
        <Icon name="down" className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={`${iconBtn} hover:text-danger`} onClick={() => remove(k, i)} aria-label="Entfernen">
        <Icon name="trash" className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      <Card title="Rahmen">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Üblicher Preis von CHF" hint="Orientierung im Rechner">
            <input type="number" className={num} value={c.minTotal} onChange={(e) => setC({ ...c, minTotal: Number(e.target.value) })} />
          </Field>
          <Field label="bis CHF">
            <input type="number" className={num} value={c.maxTotal} onChange={(e) => setC({ ...c, maxTotal: Number(e.target.value) })} />
          </Field>
          <Field label="Ziel-Stundensatz CHF (intern)" hint="Vergleich mit dem effektiven Stundensatz">
            <input type="number" className={num} value={c.targetRate} onChange={(e) => setC({ ...c, targetRate: Number(e.target.value) })} />
          </Field>
        </div>
      </Card>

      <Card title="Pakete" padded={false}>
        <ul className="divide-y divide-line">
          {c.packages.map((p, i) => (
            <li key={p.id} className="grid gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_120px_90px_auto] sm:items-start sm:px-5">
              <div className="space-y-2">
                <input className="input py-1.5 font-medium" value={p.name} onChange={(e) => update("packages", i, { name: e.target.value })} aria-label="Name" />
                <textarea className="input py-1.5 text-[13.5px]" rows={2} value={p.description} onChange={(e) => update("packages", i, { description: e.target.value })} aria-label="Beschreibung" />
              </div>
              <Field label="Preis CHF">
                <input type="number" className={num} value={p.price} onChange={(e) => update("packages", i, { price: Number(e.target.value) })} />
              </Field>
              <Field label="Aufwand h">
                <input type="number" step="0.5" className={num} value={p.hours} onChange={(e) => update("packages", i, { hours: Number(e.target.value) })} />
              </Field>
              {tools("packages", i)}
            </li>
          ))}
        </ul>
        <AddRow onClick={() => setC({ ...c, packages: [...c.packages, { id: uid("pkg"), name: "Neues Paket", description: "", price: 0, hours: 0 }] })} label="Paket hinzufügen" />
      </Card>

      <Card title="Zusatzleistungen" padded={false}>
        <ul className="divide-y divide-line">
          {c.addons.map((a, i) => (
            <li key={a.id} className="grid gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_110px_110px_90px_auto] sm:items-start sm:px-5">
              <div className="space-y-2">
                <input className="input py-1.5 font-medium" value={a.name} onChange={(e) => update("addons", i, { name: e.target.value })} aria-label="Name" />
                <input className="input py-1.5 text-[13.5px]" value={a.description} onChange={(e) => update("addons", i, { description: e.target.value })} aria-label="Beschreibung" />
              </div>
              <Field label="Einheit">
                <select className="input py-1.5" value={a.unit} onChange={(e) => update("addons", i, { unit: e.target.value })}>
                  {[...new Set([a.unit, ...units])].map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </Field>
              <Field label="Preis CHF">
                <input type="number" className={num} value={a.price} onChange={(e) => update("addons", i, { price: Number(e.target.value) })} />
              </Field>
              <Field label="Aufwand h">
                <input type="number" step="0.25" className={num} value={a.hours} onChange={(e) => update("addons", i, { hours: Number(e.target.value) })} />
              </Field>
              {tools("addons", i)}
            </li>
          ))}
        </ul>
        <AddRow onClick={() => setC({ ...c, addons: [...c.addons, { id: uid("add"), name: "Neue Leistung", description: "", price: 0, hours: 0, unit: "Pauschal" }] })} label="Zusatzleistung hinzufügen" />
      </Card>

      <Card title="Wiederkehrende Kosten" padded={false}>
        <ul className="divide-y divide-line">
          {c.recurring.map((r, i) => (
            <li key={r.id} className="grid gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_110px_140px_auto] sm:items-start sm:px-5">
              <div className="space-y-2">
                <input className="input py-1.5 font-medium" value={r.name} onChange={(e) => update("recurring", i, { name: e.target.value })} aria-label="Name" />
                <input className="input py-1.5 text-[13.5px]" value={r.description} onChange={(e) => update("recurring", i, { description: e.target.value })} aria-label="Beschreibung" />
                <label className="flex items-center gap-2 text-[13px] text-muted">
                  <input type="checkbox" checked={r.defaultOn} onChange={(e) => update("recurring", i, { defaultOn: e.target.checked })} /> in neuen Kalkulationen vorausgewählt
                </label>
              </div>
              <Field label="Preis CHF">
                <input type="number" className={num} value={r.price} onChange={(e) => update("recurring", i, { price: Number(e.target.value) })} />
              </Field>
              <Field label="Intervall">
                <select className="input py-1.5" value={r.interval} onChange={(e) => update("recurring", i, { interval: e.target.value as BillingInterval })}>
                  {Object.entries(intervalLabels).map(([k, l]) => (
                    <option key={k} value={k}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              {tools("recurring", i)}
            </li>
          ))}
        </ul>
        <AddRow onClick={() => setC({ ...c, recurring: [...c.recurring, { id: uid("rec"), name: "Neue Gebühr", description: "", price: 0, interval: "jahr", defaultOn: false }] })} label="Gebühr hinzufügen" />
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={pending} className={btn.dark}>
          {pending ? "Speichern …" : "Preise speichern"}
        </button>
        <button type="button" onClick={() => setC(defaultCalculatorConfig)} className={btn.ghost}>
          Standardwerte laden
        </button>
        {msg && <span className={`text-[14px] ${msg.type === "ok" ? "text-success" : "text-danger"}`}>{msg.text}</span>}
      </div>
    </div>
  );
}

function AddRow({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <div className="border-t border-line px-4 py-3 sm:px-5">
      <button type="button" onClick={onClick} className="inline-flex items-center gap-2 text-[14px] font-medium text-accent">
        <Icon name="plus" className="h-4 w-4" /> {label}
      </button>
    </div>
  );
}
