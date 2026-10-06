"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { logoutAction } from "@/lib/admin/actions";

const items = [
  { href: "/admin", label: "Übersicht", icon: "home" },
  { href: "/admin/anfragen", label: "Anfragen", icon: "inbox", badge: "leads" },
  { href: "/admin/kunden", label: "Kunden", icon: "users" },
  { href: "/admin/offerten", label: "Offerten", icon: "file" },
  { href: "/admin/rechnungen", label: "Rechnungen", icon: "receipt" },
  { href: "/admin/rechner", label: "Kostenrechner", icon: "calc" },
  { href: "/admin/einstellungen", label: "Einstellungen", icon: "settings" },
];

export function Sidebar({ newLeads, user }: { newLeads: number; user: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (h: string) => (h === "/admin" ? path === h : path.startsWith(h));
  const nav = (
    <nav className="flex flex-col gap-1">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-colors ${
            active(it.href) ? "bg-ink text-white" : "text-ink-soft hover:bg-bg"
          }`}
        >
          <Icon name={it.icon} className="h-[18px] w-[18px]" />
          <span className="flex-1">{it.label}</span>
          {it.badge && newLeads > 0 && (
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${active(it.href) ? "bg-white text-ink" : "bg-accent text-white"}`}>{newLeads}</span>
          )}
        </Link>
      ))}
    </nav>
  );
  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden">
        <Logo tone="dark" className="h-6" />
        <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-line" aria-label="Menü">
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      {open && <div className="border-b border-line bg-surface p-3 lg:hidden">{nav}</div>}
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col justify-between border-r border-line bg-surface p-4 lg:flex">
        <div>
          <Link href="/admin" className="mb-8 flex items-end gap-2 px-3 pt-2">
            <Logo tone="dark" className="h-6" /> <span className="text-[13px] text-muted">admin</span>
          </Link>
          {nav}
        </div>
        <div className="space-y-1 border-t border-line pt-4">
          <a href="/de" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] text-muted hover:text-ink">
            <Icon name="globe" className="h-4 w-4" /> Website ansehen
          </a>
          <p className="truncate px-3 text-[12px] text-muted">{user}</p>
          <form action={logoutAction}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] text-muted hover:text-ink">
              <Icon name="logout" className="h-4 w-4" /> Abmelden
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
