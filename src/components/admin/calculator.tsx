"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { BillingInterval } from "@/db/schema";
import { estimateToQuoteAction, saveEstimateAction } from "@/lib/admin/calculator-actions";
import {
  addonLine,
  calcTotals,
  isPerUnit,
  packageLine,
  recurringLine,
  type CalcLine,
  type CalcState,
  type CalculatorConfig,
} from "@/lib/admin/calculator";
import { intervalLabels, intervalUnit } from "@/lib/admin/labels";
import { chf, chf0, todayIso } from "@/lib/admin/money";
import { Icon } from "./icons";
import { Field, btn } from "./ui";

export interface CalculatorInitial {
  name: string;
  customerId: number | null;
  leadId: number | null;
  calc: CalcState;
}

const numInput = "input py-1.5 text-right tabular-nums";
const singular: Record<string, string> = { Seiten: "Seite", Sprachen: "Sprache", Produkte: "Produkt", Stk: "Stk.", "Stk.": "Stk." };

export function Calculator({
  id,
  initial,
  config,
  customers,
  leadHint,
}: {
  id: number | null;
  initial: CalculatorInitial;
  config: CalculatorConfig;
  customers: { id: number; name: string }[];
  leadHint?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [customerId, setCustomerId] = useState<number | null>(initial.customerId);
  const [c, setC] = useState<CalcState>(initial.calc);
  const [showInternal, setShowInternal] = useState(true);
  const [withSubs, setWithSubs] = useState(false);
  const [startDate, setStartDate] = useState(todayIso());
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const t = calcTotals(c);

  const patch = (p: Partial<CalcState>) => setC((x) => ({ ...x, ...p }));
  const setAddon = (i: number, p: Partial<CalcLine>) => setC((x) => ({ ...x, addons: x.addons.map((a, j) => (j === i ? { ...a, ...p } : a)) }));
  const addonIndex = (aid: string) => c.addons.findIndex((a) => a.id === aid);
  const customLines = c.addons.map((a, i) => [a, i] as const).filter(([a]) => !config.addons.some((x) => x.id === a.id));

  const payload = () => ({ name, customerId, leadId: initial.leadId, calc: c });

  function save(then?: (newId: number) => Promise<{ error?: string } | void>) {
    setMsg(null);
    start(async () => {
      const res = await saveEstimateAction(id, payload());
      if (res.error || !res.id) return setMsg({ type: "err", text: res.error ?? "Speichern fehlgeschlagen." });
      if (then) {
        const r = await then(res.id);
        if (r && r.error) {
          setMsg({ type: "err", text: r.error });
          if (!id) router.push(`/admin/rechner/${res.id}`);
        }
        return;
      }
      setMsg({ type: "ok", text: "Gespeichert." });
      if (!id) router.push(`/admin/rechner/${res.id}`);
      else router.refresh();
    });
  }

  const pos = Math.max(0, Math.min(100, ((t.total - config.minTotal) / Math.max(1, config.maxTotal - config.minTotal)) * 100));
  const rateOk = t.effectiveRate >= c.targetRate;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-5">
        <section className="grid gap-4 rounded-2xl border border-line bg-surface shadow-xs p-4 sm:grid-cols-2 sm:p-5">
          <Field label="Bezeichnung (wird Titel der Offerte)" className="sm:col-span-2">
            <input className="input" value={name} placeholder="z. B. Neue Webseite Bäckerei Muster" onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Kunde (für die Offerte nötig)" className="sm:col-span-2">
            <select className="input" value={customerId ?? ""} onChange={(e) => setCustomerId(e.target.value ? Number(e.target.value) : null)}>
              <option value="">Noch kein Kunde</option>
              {customers.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </Field>
          {leadHint && <p className="rounded-xl bg-accent-soft px-3 py-2 text-[13px] text-accent sm:col-span-2">{leadHint}</p>}
        </section>

        <section className="rounded-2xl border border-line bg-surface shadow-xs">
          <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
            <h2 className="text-[15px] font-semibold">1. Paket</h2>
            <p className="text-[12.5px] text-muted">Grundpreis, danach mit Zusatzleistungen ergänzen</p>
          </header>
          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
            {config.packages.map((p) => {
              const on = c.package?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => patch({ package: on ? null : packageLine(p) })}
                  className={`rounded-xl border p-3.5 text-left transition-colors ${on ? "border-accent bg-accent-soft/60 ring-1 ring-accent" : "border-line hover:border-accent/50"}`}
                  aria-pressed={on}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-[14px] tabular-nums">ab CHF {chf0(p.price)}</span>
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-snug text-muted">{p.description}</span>
                </button>
              );
            })}
          </div>
          {c.package && (
            <div className="grid gap-3 border-t border-line px-4 py-3 sm:grid-cols-[1fr_130px_100px] sm:px-5">
              <Field label="Paket (Text auf der Offerte)">
                <input className="input py-1.5" value={c.package.name} onChange={(e) => patch({ package: { ...c.package!, name: e.target.value } })} />
              </Field>
              <Field label="Preis CHF">
                <input type="number" step="50" min={0} className={numInput} value={c.package.price} onChange={(e) => patch({ package: { ...c.package!, price: Number(e.target.value) } })} />
              </Field>
              <Field label="Aufwand h">
                <input type="number" step="0.5" min={0} className={numInput} value={c.package.hours} onChange={(e) => patch({ package: { ...c.package!, hours: Number(e.target.value) } })} />
              </Field>
              <Field label="Beschreibung" className="sm:col-span-3">
                <textarea className="input py-1.5 text-[13.5px]" rows={2} value={c.package.description} onChange={(e) => patch({ package: { ...c.package!, description: e.target.value } })} />
              </Field>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-surface shadow-xs">
          <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
            <h2 className="text-[15px] font-semibold">2. Zusatzleistungen</h2>
            <p className="text-[12.5px] text-muted">Preise pro Projekt anpassbar</p>
          </header>
          <div className="hidden grid-cols-[minmax(0,1fr)_76px_104px_96px] gap-3 px-4 pt-2.5 text-[11px] uppercase tracking-wider text-muted sm:grid sm:px-5">
            <span>Leistung</span>
            <span className="text-right">Menge</span>
            <span className="text-right">Preis CHF</span>
            <span className="text-right">Total</span>
          </div>
          <ul className="divide-y divide-line">
            {config.addons.map((a) => {
              const i = addonIndex(a.id);
              const line = i >= 0 ? c.addons[i] : null;
              const perUnit = isPerUnit(a.unit);
              return (
                <li key={a.id} className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-2.5 sm:grid-cols-[minmax(0,1fr)_76px_104px_96px] sm:px-5 ${line ? "bg-accent-soft/40" : ""}`}>
                  <label className="col-span-2 flex min-w-0 cursor-pointer items-start gap-3 sm:col-span-1">
                    <input
                      type="checkbox"
                      checked={!!line}
                      onChange={(e) => patch({ addons: e.target.checked ? [...c.addons, addonLine(a)] : c.addons.filter((x) => x.id !== a.id) })}
                      className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[var(--color-accent)]"
                    />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium">{a.name}</span>
                      <span className="block text-[12.5px] leading-snug text-muted">
                        {a.description}
                        {perUnit ? ` · CHF ${chf0(a.price)} pro ${singular[a.unit] ?? a.unit}` : ""}
                      </span>
                    </span>
                  </label>
                  {line ? (
                    <>
                      {perUnit ? (
                        <input type="number" min={0} step={1} className={numInput} value={line.qty} onChange={(e) => setAddon(i, { qty: Number(e.target.value) })} aria-label={`Anzahl ${a.unit}`} />
                      ) : (
                        <span className="hidden text-right text-[13px] text-muted sm:block">1</span>
                      )}
                      <input type="number" min={0} step={10} className={numInput} value={line.price} onChange={(e) => setAddon(i, { price: Number(e.target.value) })} aria-label={`Preis ${a.name}`} />
                      <span className="text-right text-[14px] font-medium tabular-nums">{chf(line.qty * line.price)}</span>
                    </>
                  ) : (
                    <span className="hidden text-right text-[13px] tabular-nums text-muted sm:col-span-3 sm:block">{perUnit ? `${chf0(a.price)} / ${a.unit}` : chf0(a.price)}</span>
                  )}
                </li>
              );
            })}
            {customLines.map(([a, i]) => (
              <li key={`custom-${i}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 bg-accent-soft/40 px-4 py-2.5 sm:grid-cols-[minmax(0,1fr)_76px_104px_96px] sm:px-5">
                <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                  <button type="button" className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-danger/10 hover:text-danger" onClick={() => patch({ addons: c.addons.filter((_, j) => j !== i) })} aria-label="Position entfernen">
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                  <input className="input py-1.5" placeholder="Eigene Position" value={a.name} onChange={(e) => setAddon(i, { name: e.target.value })} />
                </div>
                <input type="number" min={0} step={1} className={numInput} value={a.qty} onChange={(e) => setAddon(i, { qty: Number(e.target.value) })} aria-label="Menge" />
                <input type="number" min={0} step={10} className={numInput} value={a.price} onChange={(e) => setAddon(i, { price: Number(e.target.value) })} aria-label="Preis" />
                <span className="text-right text-[14px] font-medium tabular-nums">{chf(a.qty * a.price)}</span>
                {showInternal && (
                  <label className="col-span-2 flex items-center justify-end gap-2 text-[12.5px] text-muted sm:col-span-4">
                    Aufwand h
                    <input type="number" min={0} step={0.5} className="input w-20 py-1 text-right" value={a.hours} onChange={(e) => setAddon(i, { hours: Number(e.target.value) })} />
                  </label>
                )}
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-4 py-3 sm:px-5">
            <button
              type="button"
              onClick={() => patch({ addons: [...c.addons, { id: `custom-${Date.now()}`, name: "", description: "", qty: 1, unit: "Pauschal", price: 0, hours: 0 }] })}
              className="inline-flex items-center gap-2 text-[14px] font-medium text-accent"
            >
              <Icon name="plus" className="h-4 w-4" /> Eigene Position
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface shadow-xs">
          <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
            <h2 className="text-[15px] font-semibold">3. Wiederkehrende Kosten</h2>
            <p className="text-[12.5px] text-muted">Nicht im Projektpreis, Verrechnung als Abo</p>
          </header>
          <ul className="divide-y divide-line">
            {config.recurring.map((r) => {
              const i = c.recurring.findIndex((x) => x.id === r.id);
              const line = i >= 0 ? c.recurring[i] : null;
              const setR = (p: Partial<typeof r & { fromYear2: boolean }>) => patch({ recurring: c.recurring.map((x, j) => (j === i ? { ...x, ...p } : x)) });
              return (
                <li key={r.id} className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-5 ${line ? "bg-accent-soft/40" : ""}`}>
                  <label className="flex min-w-[200px] flex-1 cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={!!line}
                      onChange={(e) => patch({ recurring: e.target.checked ? [...c.recurring, recurringLine(r)] : c.recurring.filter((x) => x.id !== r.id) })}
                      className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[var(--color-accent)]"
                    />
                    <span>
                      <span className="block text-[14px] font-medium">{r.name}</span>
                      <span className="block text-[12.5px] text-muted">{r.description}</span>
                    </span>
                  </label>
                  {line ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <input type="number" min={0} step={5} className={`${numInput} w-24`} value={line.price} onChange={(e) => setR({ price: Number(e.target.value) })} aria-label={`Preis ${r.name}`} />
                      <select className="input w-auto py-1.5" value={line.interval} onChange={(e) => setR({ interval: e.target.value as BillingInterval })} aria-label="Intervall">
                        {Object.entries(intervalLabels).map(([k, l]) => (
                          <option key={k} value={k}>
                            {l}
                          </option>
                        ))}
                      </select>
                      <label className="flex items-center gap-1.5 text-[12.5px]">
                        <input type="checkbox" checked={line.fromYear2} onChange={(e) => setR({ fromYear2: e.target.checked })} /> ab Jahr 2
                      </label>
                    </div>
                  ) : (
                    <span className="text-[13px] tabular-nums text-muted">
                      CHF {chf0(r.price)} / {intervalUnit[r.interval]}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <Field label="Interne Notiz (Annahmen, Risiken; wird als interne Notiz in die Offerte übernommen)">
          <textarea className="input bg-surface" rows={3} value={c.marginNote ?? ""} onChange={(e) => patch({ marginNote: e.target.value })} />
        </Field>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl bg-night p-5 text-white sm:p-6">
          <p className="text-[12px] uppercase tracking-[0.12em] text-white/50">Projektpreis einmalig</p>
          <p className="mt-2 text-[38px] font-semibold leading-none tracking-tight tabular-nums">CHF {chf0(t.total)}</p>
          <p className="mt-1.5 text-[12.5px] text-white/55">exkl. MWST</p>

          <div className="mt-4">
            <div className="relative h-1.5 rounded-full bg-white/15">
              <span className="absolute -top-1 h-3.5 w-1 -translate-x-1/2 rounded bg-white" style={{ left: `${pos}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-white/50 tabular-nums">
              <span>{chf0(config.minTotal)}</span>
              <span>{chf0(config.maxTotal)}</span>
            </div>
            {t.total > 0 && (t.total < config.minTotal || t.total > config.maxTotal) && (
              <p className="mt-1 text-[12px] text-[#e6c98f]">Ausserhalb des üblichen Rahmens von CHF {chf0(config.minTotal)} bis {chf0(config.maxTotal)}.</p>
            )}
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-white/15 pt-4 text-[13.5px]">
            <div className="flex justify-between gap-3">
              <dt className="text-white/60">Positionen</dt>
              <dd className="tabular-nums">{chf(t.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-white/60">Rabatt %</dt>
              <dd>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={c.discountPercent}
                  onChange={(e) => patch({ discountPercent: Number(e.target.value) })}
                  className="w-16 rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-right tabular-nums text-white"
                  aria-label="Rabatt in Prozent"
                />
              </dd>
            </div>
            {t.discount > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-white/60">Rabatt</dt>
                <dd className="tabular-nums">-{chf(t.discount)}</dd>
              </div>
            )}
          </dl>

          <div className="mt-4 border-t border-white/15 pt-4 text-[13.5px]">
            <p className="flex justify-between gap-3">
              <span className="text-white/60">Wiederkehrend</span>
              <span className="tabular-nums">CHF {chf(t.yearly)} / Jahr</span>
            </p>
            <p className="mt-0.5 text-[12px] text-white/50">
              {c.recurring.length === 0 ? "Keine wiederkehrenden Kosten gewählt." : t.firstYear > 0 ? `davon CHF ${chf(t.firstYear)} bereits im 1. Jahr` : "Verrechnung ab dem 2. Jahr"}
            </p>
          </div>

          <div className="mt-4 border-t border-white/15 pt-4 text-[13.5px]">
            <button type="button" onClick={() => setShowInternal((x) => !x)} className="flex w-full items-center justify-between text-white/60 hover:text-white">
              <span>Intern: Aufwand</span>
              <Icon name={showInternal ? "up" : "down"} className="h-3.5 w-3.5" />
            </button>
            {showInternal && (
              <dl className="mt-2 space-y-1.5">
                <div className="flex justify-between gap-3">
                  <dt className="text-white/60">Geschätzte Stunden</dt>
                  <dd className="tabular-nums">{t.hours.toLocaleString("de-CH")} h</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/60">Effektiver Stundensatz</dt>
                  <dd className={`tabular-nums font-medium ${t.hours ? (rateOk ? "text-[#a8d1b5]" : "text-[#e6c98f]") : ""}`}>{t.hours ? `CHF ${chf0(t.effectiveRate)}` : "–"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-white/60">Ziel CHF/h</dt>
                  <dd>
                    <input
                      type="number"
                      min={0}
                      step={5}
                      value={c.targetRate}
                      onChange={(e) => patch({ targetRate: Number(e.target.value) })}
                      className="w-16 rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-right tabular-nums text-white"
                      aria-label="Ziel-Stundensatz"
                    />
                  </dd>
                </div>
              </dl>
            )}
          </div>

          <button type="button" onClick={() => save()} disabled={pending} className={`${btn.ghost} mt-5 w-full border-white/30 bg-transparent text-white hover:border-white hover:text-white`}>
            {pending ? "Speichern …" : "Kalkulation speichern"}
          </button>

          <div className="mt-3 rounded-xl bg-white/[0.07] p-3">
            <label className="flex items-start gap-2 text-[12.5px] text-white/80">
              <input type="checkbox" className="mt-0.5" checked={withSubs} onChange={(e) => setWithSubs(e.target.checked)} disabled={c.recurring.length === 0} />
              <span>Abos für wiederkehrende Kosten gleich anlegen</span>
            </label>
            {withSubs && c.recurring.length > 0 && (
              <label className="mt-2 flex items-center justify-between gap-2 text-[12.5px] text-white/70">
                Leistungsbeginn
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-white" />
              </label>
            )}
            <button
              type="button"
              disabled={pending || !customerId}
              onClick={() => save((newId) => estimateToQuoteAction(newId, { withSubscriptions: withSubs && c.recurring.length > 0, startDate }))}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-accent-soft disabled:opacity-50"
            >
              <Icon name="file" className="h-4 w-4" /> Offerte erstellen
            </button>
            {!customerId && <p className="mt-2 text-[12px] text-white/50">Für die Offerte zuerst einen Kunden wählen.</p>}
          </div>
          {msg && <p className={`mt-3 text-[13px] ${msg.type === "ok" ? "text-[#a8d1b5]" : "text-[#e7b9b9]"}`}>{msg.text}</p>}
        </div>
      </aside>
    </div>
  );
}
