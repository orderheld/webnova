"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Icon } from "@/components/icons";
import { saveEstimateAction, type EstimatePayload } from "@/lib/admin/actions";
import { calcCatalog, estimateTotals } from "@/lib/admin/calculator";
import { chf } from "@/lib/admin/money";
import { Field, btn } from "./ui";

const singular: Record<string, string> = { Seiten: "Seite", Templates: "Template", Sprachen: "Sprache", Produkte: "Produkt" };

export function Calculator({
  id,
  initial,
  customers,
  leadHint,
}: {
  id: number | null;
  initial: EstimatePayload;
  customers: { id: number; name: string }[];
  leadHint?: string;
}) {
  const router = useRouter();
  const [v, setV] = useState<EstimatePayload>(initial);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const qty = useMemo(() => new Map(v.items.map((i) => [i.id, i.qty])), [v.items]);
  const t = estimateTotals(v);

  const toggle = (itemId: string, on: boolean, defaultQty = 1) =>
    setV((p) => ({ ...p, items: on ? [...p.items.filter((i) => i.id !== itemId), { id: itemId, qty: defaultQty }] : p.items.filter((i) => i.id !== itemId) }));
  const setQty = (itemId: string, q: number) => setV((p) => ({ ...p, items: p.items.map((i) => (i.id === itemId ? { ...i, qty: q } : i)) }));

  function save() {
    setMsg(null);
    start(async () => {
      const res = await saveEstimateAction(id, v);
      if (res.error) return setMsg({ type: "err", text: res.error });
      setMsg({ type: "ok", text: "Gespeichert." });
      if (!id && res.id) router.push(`/admin/rechner/${res.id}`);
      else router.refresh();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <div className="grid gap-4 rounded-[20px] border border-line bg-surface p-5 sm:grid-cols-2">
          <Field label="Projektname" className="sm:col-span-2">
            <input className="input" value={v.name} placeholder="z. B. Webseite Bäckerei Muster" onChange={(e) => setV({ ...v, name: e.target.value })} />
          </Field>
          <Field label="Kunde (für Offerte nötig)">
            <select className="input" value={v.customerId ?? ""} onChange={(e) => setV({ ...v, customerId: e.target.value ? Number(e.target.value) : null })}>
              <option value="">–</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stundensatz CHF">
              <input type="number" className="input" value={v.hourlyRate} onChange={(e) => setV({ ...v, hourlyRate: Number(e.target.value) })} />
            </Field>
            <Field label="Reserve %">
              <input type="number" className="input" value={v.riskPercent} onChange={(e) => setV({ ...v, riskPercent: Number(e.target.value) })} />
            </Field>
          </div>
          {leadHint && <p className="rounded-xl bg-accent-soft px-3 py-2 text-[13px] text-accent sm:col-span-2">{leadHint}</p>}
        </div>

        {calcCatalog.map((g) => (
          <div key={g.id} className="rounded-[20px] border border-line bg-surface">
            <h3 className="border-b border-line px-5 py-3 text-[15px] font-medium">{g.label}</h3>
            <ul className="divide-y divide-line">
              {g.items.map((it) => {
                const on = qty.has(it.id);
                return (
                  <li key={it.id} className={`flex items-center gap-4 px-5 py-3 ${on ? "bg-accent-soft/40" : ""}`}>
                    <label className="flex flex-1 cursor-pointer items-center gap-3 text-[14px]">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={(e) => toggle(it.id, e.target.checked, it.unit ? 1 : 1)}
                        className="h-[18px] w-[18px] accent-[var(--color-accent)]"
                      />
                      <span>{it.label}</span>
                    </label>
                    {it.unit && on && (
                      <input
                        type="number"
                        min={0}
                        step={it.unit === "Std." ? 0.5 : 1}
                        value={qty.get(it.id) ?? 1}
                        onChange={(e) => setQty(it.id, Number(e.target.value))}
                        className="input w-20 py-1.5 text-right"
                        aria-label={`Anzahl ${it.unit}`}
                      />
                    )}
                    <span className="w-28 text-right text-[13px] tabular-nums text-muted">
                      {it.hours} h{it.unit ? ` / ${singular[it.unit] ?? it.unit}` : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="rounded-[20px] border border-line bg-surface p-5">
          <h3 className="mb-3 text-[15px] font-medium">Eigene Positionen</h3>
          <div className="space-y-2">
            {v.custom.map((c, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Beschreibung"
                  value={c.title}
                  onChange={(e) => setV({ ...v, custom: v.custom.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })}
                />
                <input
                  type="number"
                  step={0.5}
                  className="input w-24 text-right"
                  value={c.hours}
                  onChange={(e) => setV({ ...v, custom: v.custom.map((x, j) => (j === i ? { ...x, hours: Number(e.target.value) } : x)) })}
                  aria-label="Stunden"
                />
                <button type="button" className="grid w-10 place-items-center text-muted hover:text-danger" onClick={() => setV({ ...v, custom: v.custom.filter((_, j) => j !== i) })} aria-label="Entfernen">
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setV({ ...v, custom: [...v.custom, { title: "", hours: 1 }] })} className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-accent">
            <Icon name="plus" className="h-4 w-4" /> Position hinzufügen
          </button>
        </div>

        <Field label="Interne Notiz (Marge, Annahmen, Risiken)">
          <textarea className="input bg-surface" rows={3} value={v.marginNote ?? ""} onChange={(e) => setV({ ...v, marginNote: e.target.value })} />
        </Field>
      </div>

      <aside>
        <div className="sticky top-6 rounded-[20px] bg-night p-6 text-white">
          <p className="text-[13px] uppercase tracking-[0.12em] text-white/50">Interne Schätzung</p>
          <p className="mt-4 text-[40px] font-medium leading-none tracking-tight tabular-nums">CHF {chf(t.total)}</p>
          <p className="mt-2 text-[14px] text-white/60">
            {t.totalHours} Std. à CHF {v.hourlyRate}
          </p>
          <dl className="mt-6 space-y-1.5 border-t border-white/15 pt-4 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-white/60">Basis</dt>
              <dd className="tabular-nums">{t.baseHours.toFixed(2)} h</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/60">Reserve {v.riskPercent}%</dt>
              <dd className="tabular-nums">{t.riskHours.toFixed(2)} h</dd>
            </div>
          </dl>
          <ul className="mt-4 max-h-[260px] space-y-1 overflow-y-auto border-t border-white/15 pt-4 text-[12px] text-white/70">
            {t.lines.map((l, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span className="truncate">{l.label}</span>
                <span className="shrink-0 tabular-nums">{l.hours} h</span>
              </li>
            ))}
            {t.lines.length === 0 && <li>Positionen in der Checkliste ankreuzen.</li>}
          </ul>
          <button type="button" onClick={save} disabled={pending} className={`${btn.accent} mt-6 w-full`}>
            {pending ? "Speichern …" : "Schätzung speichern"}
          </button>
          {msg && <p className={`mt-3 text-[13px] ${msg.type === "ok" ? "text-emerald-300" : "text-red-300"}`}>{msg.text}</p>}
        </div>
      </aside>
    </div>
  );
}
