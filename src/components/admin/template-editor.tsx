"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { TemplateTask } from "@/db/schema";
import { saveTemplateAction } from "@/lib/admin/project-actions";
import { chf } from "@/lib/admin/money";
import { Icon } from "./icons";
import { Field, btn } from "./ui";

export function TemplateEditor({
  id,
  initial,
  products,
}: {
  id: number | null;
  initial: { name: string; description: string; tasks: TemplateTask[]; productIds: number[] };
  products: { id: number; name: string; price: number; interval: string | null }[];
}) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const setTask = (i: number, patch: Partial<TemplateTask>) => setV((p) => ({ ...p, tasks: p.tasks.map((t, j) => (j === i ? { ...t, ...patch } : t)) }));
  const move = (i: number, d: -1 | 1) =>
    setV((p) => {
      const j = i + d;
      if (j < 0 || j >= p.tasks.length) return p;
      const tasks = [...p.tasks];
      [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
      return { ...p, tasks };
    });

  function save() {
    setMsg(null);
    start(async () => {
      const r = await saveTemplateAction(id, v);
      if (r.error) return setMsg({ ok: false, text: r.error });
      setMsg({ ok: true, text: "Gespeichert." });
      if (!id && r.id) router.push(`/admin/vorlagen/${r.id}`);
      else router.refresh();
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4 rounded-2xl border border-line bg-surface shadow-xs p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <input className="input" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} placeholder="z. B. Webseite KMU" />
          </Field>
          <Field label="Beschreibung">
            <input className="input" value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} />
          </Field>
        </div>
        <div>
          <div className="mb-2 grid grid-cols-[1fr_92px_44px_84px] gap-2 text-[11.5px] uppercase tracking-wider text-muted">
            <span>Aufgabe</span>
            <span>Tag ab Start</span>
            <span title="Meilenstein">MS</span>
            <span />
          </div>
          <div className="space-y-2">
            {v.tasks.map((t, i) => (
              <div key={i} className="grid grid-cols-[1fr_92px_44px_84px] items-center gap-2">
                <input className="input" value={t.title} onChange={(e) => setTask(i, { title: e.target.value })} aria-label="Aufgabe" />
                <input type="number" min={0} className="input text-right" value={t.offsetDays} onChange={(e) => setTask(i, { offsetDays: Math.max(0, Number(e.target.value) || 0) })} aria-label="Tag ab Start" />
                <input type="checkbox" className="mx-auto h-4 w-4" checked={!!t.milestone} onChange={(e) => setTask(i, { milestone: e.target.checked })} aria-label="Meilenstein" />
                <div className="flex justify-end">
                  <button type="button" onClick={() => move(i, -1)} className="grid h-8 w-6 place-items-center text-muted hover:text-ink" aria-label="Nach oben">
                    <Icon name="up" className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} className="grid h-8 w-6 place-items-center text-muted hover:text-ink" aria-label="Nach unten">
                    <Icon name="down" className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => setV({ ...v, tasks: v.tasks.filter((_, j) => j !== i) })} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:text-danger" aria-label="Entfernen">
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setV({ ...v, tasks: [...v.tasks, { title: "", offsetDays: v.tasks.at(-1)?.offsetDays ?? 0 }] })}
            className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-accent"
          >
            <Icon name="plus" className="h-4 w-4" /> Aufgabe hinzufügen
          </button>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="rounded-2xl border border-line bg-surface shadow-xs p-4">
          <p className="mb-2 text-[14px] font-semibold">Leistungen für die Offerte</p>
          <p className="mb-3 text-[12.5px] text-muted">Beim Umwandeln eines Leads wird damit eine Offerte vorbereitet.</p>
          <ul className="max-h-[360px] space-y-1.5 overflow-y-auto">
            {products.map((p) => (
              <li key={p.id}>
                <label className="flex items-center gap-2 text-[13.5px]">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={v.productIds.includes(p.id)}
                    onChange={(e) => setV({ ...v, productIds: e.target.checked ? [...v.productIds, p.id] : v.productIds.filter((x) => x !== p.id) })}
                  />
                  <span className="flex-1">{p.name}</span>
                  <span className="text-[12px] tabular-nums text-muted">
                    {chf(p.price)}
                    {p.interval ? " ↻" : ""}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <button type="button" onClick={save} disabled={pending} className={`${btn.dark} w-full`}>
          {pending ? "Speichern …" : id ? "Vorlage speichern" : "Vorlage anlegen"}
        </button>
        {msg && <p className={`text-[13px] ${msg.ok ? "text-success" : "text-danger"}`}>{msg.text}</p>}
      </aside>
    </div>
  );
}
