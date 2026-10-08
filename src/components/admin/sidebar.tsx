"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { logoutAction } from "@/lib/admin/actions";
import { Icon } from "./icons";

export interface SidebarCounts {
  newLeads: number;
  followUps: number;
  openTasks: number;
  overdueInvoices: number;
  dueSubscriptions: number;
}

const groups: { label?: string; items: { href: string; label: string; icon: string; count?: keyof SidebarCounts; warn?: boolean }[] }[] = [
  { items: [{ href: "/admin", label: "Übersicht", icon: "home" }] },
  {
    label: "Verkauf",
    items: [
      { href: "/admin/anfragen", label: "Leads & Anfragen", icon: "inbox", count: "newLeads" },
      { href: "/admin/pipeline", label: "Pipeline", icon: "kanban", count: "followUps", warn: true },
      { href: "/admin/kunden", label: "Kunden", icon: "users" },
      { href: "/admin/offerten", label: "Offerten", icon: "file" },
      { href: "/admin/rechner", label: "Rechner", icon: "calc" },
    ],
  },
  {
    label: "Projekte",
    items: [
      { href: "/admin/projekte", label: "Projekte", icon: "folder" },
      { href: "/admin/aufgaben", label: "Aufgaben", icon: "checkSquare", count: "openTasks", warn: true },
      { href: "/admin/zeit", label: "Zeiterfassung", icon: "clock" },
    ],
  },
  {
    label: "Finanzen",
    items: [
      { href: "/admin/rechnungen", label: "Rechnungen", icon: "receipt", count: "overdueInvoices", warn: true },
      { href: "/admin/abos", label: "Abos", icon: "repeat", count: "dueSubscriptions" },
      { href: "/admin/ausgaben", label: "Ausgaben", icon: "wallet" },
      { href: "/admin/auswertung", label: "Auswertung", icon: "chart" },
    ],
  },
  {
    label: "Einstellungen",
    items: [
      { href: "/admin/leistungen", label: "Leistungen", icon: "tag" },
      { href: "/admin/vorlagen", label: "Projektvorlagen", icon: "layers" },
      { href: "/admin/einstellungen", label: "Firma & Texte", icon: "settings" },
    ],
  },
];

export function Sidebar({ counts, user }: { counts: SidebarCounts; user: string }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const active = (h: string) => (h === "/admin" ? path === h : path === h || path.startsWith(`${h}/`));

  const search = (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
        setOpen(false);
        router.push(q ? `/admin/suche?q=${encodeURIComponent(q)}` : "/admin/suche");
      }}
      className="relative"
    >
      <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input name="q" placeholder="Suchen …" aria-label="Globale Suche" className="w-full rounded-xl border border-line bg-bg py-2 pl-9 pr-3 text-[16px] outline-none focus:border-accent md:text-[14px]" />
    </form>
  );

  const nav = (
    <nav className="flex flex-col gap-4">
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.label && <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted/80">{g.label}</p>}
          <div className="flex flex-col gap-0.5">
            {g.items.map((it) => {
              const n = it.count ? counts[it.count] : 0;
              const on = active(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] transition-colors ${on ? "bg-accent text-white" : "text-ink-soft hover:bg-bg"}`}
                >
                  <Icon name={it.icon} className="h-[17px] w-[17px] shrink-0" />
                  <span className="flex-1 truncate">{it.label}</span>
                  {n > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-px text-[11px] font-semibold tabular-nums ${
                        on ? "bg-white text-accent" : it.warn ? "bg-red-100 text-red-700" : "bg-accent-soft text-accent"
                      }`}
                    >
                      {n}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const brand = (
    <Link href="/admin" className="flex items-end gap-2" onClick={() => setOpen(false)}>
      <Logo tone="dark" className="h-6" />
      <span className="text-[12px] text-muted">admin</span>
    </Link>
  );

  const footer = (
    <div className="space-y-0.5 border-t border-line pt-3">
      <a href="/de" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-muted hover:text-ink">
        <Icon name="globe" className="h-4 w-4" /> Website ansehen
      </a>
      <p className="truncate px-3 py-1 text-[12px] text-muted">{user}</p>
      <form action={logoutAction}>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-muted hover:text-ink">
          <Icon name="logout" className="h-4 w-4" /> Abmelden
        </button>
      </form>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5 lg:hidden">
        {brand}
        <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-line" aria-label="Menü" aria-expanded={open}>
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[61px] z-30 overflow-y-auto border-b border-line bg-surface p-4 lg:hidden">
          <div className="mb-4">{search}</div>
          {nav}
          <div className="mt-4">{footer}</div>
        </div>
      )}
      <aside className="sticky top-0 hidden h-screen w-[244px] shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="px-4 pb-3 pt-5">{brand}</div>
        <div className="px-3 pb-3">{search}</div>
        <div className="flex-1 overflow-y-auto px-2 pb-4">{nav}</div>
        <div className="px-2 pb-3">{footer}</div>
      </aside>
    </>
  );
}
