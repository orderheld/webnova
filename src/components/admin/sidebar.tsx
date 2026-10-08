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
      <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-light/70" />
      <input
        name="q"
        placeholder="Suchen …"
        aria-label="Globale Suche"
        className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-2 pl-9 pr-3 text-[16px] text-white outline-none transition-colors placeholder:text-accent-light/60 focus:border-accent-light/50 focus:bg-white/[0.09] md:text-[14px]"
      />
    </form>
  );

  const nav = (
    <nav className="flex flex-col gap-4" aria-label="Admin">
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.label && <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-light/60">{g.label}</p>}
          <div className="flex flex-col gap-0.5">
            {g.items.map((it) => {
              const n = it.count ? counts[it.count] : 0;
              const on = active(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  aria-current={on ? "page" : undefined}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-[7px] text-[14px] transition-colors ${
                    on ? "bg-white/[0.1] font-medium text-white" : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {on && <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-accent-light" aria-hidden="true" />}
                  <Icon name={it.icon} className={`h-[17px] w-[17px] shrink-0 ${on ? "text-accent-light" : "text-white/55 group-hover:text-accent-light"}`} />
                  <span className="flex-1 truncate">{it.label}</span>
                  {n > 0 && (
                    <span
                      className={`min-w-[20px] rounded-full px-1.5 py-px text-center text-[11px] font-semibold tabular-nums ${
                        it.warn ? "bg-[#e7b9b9] text-[#5a1414]" : "bg-accent-light text-night"
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
    <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setOpen(false)} aria-label="Webnova Admin, Übersicht">
      <Logo tone="light" className="h-[22px]" />
      <span className="rounded-md border border-white/15 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-accent-light">Admin</span>
    </Link>
  );

  const initials = user.slice(0, 1).toUpperCase();
  const footer = (
    <div className="border-t border-white/10 pt-3">
      <div className="flex items-center gap-1 px-3 pb-1">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-light text-[12px] font-semibold text-night" aria-hidden="true">
          {initials}
        </span>
        <p className="ml-1.5 min-w-0 flex-1 truncate text-[12.5px] text-white/70">{user}</p>
        <a
          href="/de"
          target="_blank"
          className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
          aria-label="Website ansehen"
          title="Website ansehen"
        >
          <Icon name="globe" className="h-4 w-4" />
        </a>
        <form action={logoutAction}>
          <button className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white" aria-label="Abmelden" title="Abmelden">
            <Icon name="logout" className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex h-[60px] items-center justify-between gap-3 border-b border-white/10 bg-night px-4 lg:hidden">
        {brand}
        <button
          onClick={() => setOpen(!open)}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/[0.08]"
          aria-label={open ? "Menü schliessen" : "Menü öffnen"}
          aria-expanded={open}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[60px] z-30 overflow-y-auto bg-night px-4 pb-8 pt-4 lg:hidden">
          <div className="mb-5">{search}</div>
          {nav}
          <div className="mt-6">{footer}</div>
        </div>
      )}
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col bg-night lg:flex">
        <div className="px-5 pb-4 pt-5">{brand}</div>
        <div className="px-3 pb-4">{search}</div>
        <div className="flex-1 overflow-y-auto px-2 pb-4 [scrollbar-color:rgb(255_255_255/0.15)_transparent] [scrollbar-width:thin]">{nav}</div>
        <div className="px-2 pb-3">{footer}</div>
      </aside>
    </>
  );
}
