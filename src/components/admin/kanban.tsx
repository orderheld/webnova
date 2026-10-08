"use client";

import Link from "next/link";
import { useOptimistic, useState, startTransition } from "react";
import type { LeadStatus } from "@/db/schema";
import { setLeadStageAction } from "@/lib/admin/crm-actions";
import { leadStageBar, leadStageLabels } from "@/lib/admin/labels";
import { chf0, fmtDate } from "@/lib/admin/money";
import { Icon } from "./icons";

export interface KanbanCard {
  id: number;
  title: string;
  sub: string;
  status: LeadStatus;
  value: number | null;
  followUpAt: string | null;
  rating: number | null;
  source: string;
}

export function LeadKanban({ cards, stages, today }: { cards: KanbanCard[]; stages: readonly LeadStatus[]; today: string }) {
  const [items, move] = useOptimistic(cards, (state, { id, to }: { id: number; to: LeadStatus }) => state.map((c) => (c.id === id ? { ...c, status: to } : c)));
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<LeadStatus | null>(null);

  const moveTo = (id: number, to: LeadStatus) =>
    startTransition(async () => {
      move({ id, to });
      await setLeadStageAction(id, to);
    });

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
      <div className="grid min-w-[1100px] grid-cols-6 gap-3">
        {stages.map((s) => {
          const col = items.filter((c) => c.status === s);
          const sum = col.reduce((a, c) => a + (c.value ?? 0), 0);
          return (
            <section
              key={s}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(s);
              }}
              onDragLeave={() => setOver((o) => (o === s ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                const id = Number(e.dataTransfer.getData("text/plain"));
                if (id) moveTo(id, s);
              }}
              className={`flex min-h-[420px] flex-col rounded-2xl border p-2 transition-colors ${over === s ? "border-accent bg-accent-soft/60" : "border-line bg-bg/70"}`}
              aria-label={leadStageLabels[s]}
            >
              <header className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 px-2 pb-2 pt-1">
                <h2 className="flex items-center gap-2 text-[13px] font-semibold">
                  <span className={`h-2 w-2 rounded-full ${leadStageBar[s]}`} aria-hidden="true" />
                  {leadStageLabels[s]} <span className="font-normal text-muted">{col.length}</span>
                </h2>
                {sum > 0 && <span className="whitespace-nowrap text-[12px] tabular-nums text-muted">CHF {chf0(sum)}</span>}
              </header>
              <div className="flex flex-1 flex-col gap-2">
                {col.map((c) => {
                  const due = c.followUpAt && c.followUpAt <= today && s !== "gewonnen" && s !== "verloren";
                  return (
                    <article
                      key={c.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", String(c.id));
                        setDrag(c.id);
                      }}
                      onDragEnd={() => setDrag(null)}
                      className={`cursor-grab rounded-xl border border-line bg-surface p-3 shadow-xs transition-[border-color,box-shadow] hover:border-accent/30 hover:shadow-card active:cursor-grabbing ${drag === c.id ? "opacity-50" : ""}`}
                    >
                      <Link href={`/admin/anfragen/${c.id}`} className="block text-[14px] font-medium leading-snug hover:text-accent">
                        {c.title}
                      </Link>
                      {c.sub && <p className="mt-0.5 truncate text-[12px] text-muted">{c.sub}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
                        {c.value ? <span className="tabular-nums text-ink-soft">CHF {chf0(c.value)}</span> : null}
                        {c.rating ? (
                          <span className="inline-flex items-center gap-0.5">
                            <Icon name="star" className="h-3 w-3 fill-current text-bright" />
                            {c.rating}
                          </span>
                        ) : null}
                        {c.followUpAt && (
                          <span className={`inline-flex items-center gap-1 ${due ? "font-medium text-danger" : ""}`}>
                            <Icon name="bell" className="h-3 w-3" />
                            {fmtDate(c.followUpAt)}
                          </span>
                        )}
                        {c.source === "anfrage" && <span className="rounded-md bg-bright-soft px-1.5 font-medium text-bright">Web</span>}
                      </div>
                      {/* touch fallback: move with a select */}
                      <select
                        aria-label="Phase ändern"
                        value={s}
                        onChange={(e) => moveTo(c.id, e.target.value as LeadStatus)}
                        className="mt-2 w-full rounded-lg border border-line bg-bg px-2 py-1 text-[12px] lg:hidden"
                      >
                        {stages.map((x) => (
                          <option key={x} value={x}>
                            {leadStageLabels[x]}
                          </option>
                        ))}
                      </select>
                    </article>
                  );
                })}
                {col.length === 0 && <p className="px-2 py-6 text-center text-[12px] text-muted">Hierher ziehen</p>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
