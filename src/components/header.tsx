"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/types";
import { Icon } from "./icons";

export interface NavData {
  locale: Locale;
  home: string;
  links: { label: string; href: string }[];
  services: { label: string; href: string; icon: string }[];
  servicesLabel: string;
  servicesHref: string;
  allServicesLabel: string;
  cta: { label: string; href: string };
  menuLabel: string;
  closeLabel: string;
  phone: { label: string; href: string };
  whatsappHref: string;
  email: string;
  /** maps every localized path to its counterpart in the other language */
  switchMap: Record<string, string>;
}

export function Header({ nav, logo }: { nav: NavData; logo: React.ReactNode }) {
  const pathname = usePathname();
  // The menu stays open only for the path it was opened on, so navigating closes it.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const [scrolled, setScrolled] = useState(false);
  const other: Locale = nav.locale === "de" ? "fr" : "de";
  const switchHref = nav.switchMap[pathname] ?? `/${other}`;
  // Landing pages (Ads traffic) get a reduced header without navigation.
  const minimal = pathname.includes("/lp/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenFor(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 text-ink transition-all duration-300 ${
          scrolled && !open ? "border-b border-line bg-white/90 backdrop-blur-xl" : `border-b bg-white ${open ? "border-line" : "border-transparent"}`
        }`}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-6">
          <Link href={nav.home} aria-label="Webnova" className="shrink-0">
            {logo}
          </Link>

          <nav className={`${minimal ? "hidden" : "hidden lg:flex"} items-center gap-1`} aria-label={nav.locale === "de" ? "Hauptnavigation" : "Navigation principale"}>
            <div className="group relative">
              <Link
                href={nav.servicesHref}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-[15px] text-ink-soft transition-colors hover:text-ink"
              >
                {nav.servicesLabel}
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Link>
              <div className="invisible absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-1 rounded-3xl border border-line bg-white p-3 shadow-soft">
                  {nav.services.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="group/item flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] text-ink-soft transition-colors hover:bg-bg hover:text-ink"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-bg text-ink transition-colors group-hover/item:bg-night group-hover/item:text-white">
                        <Icon name={s.icon} className="h-[18px] w-[18px]" />
                      </span>
                      {s.label}
                    </Link>
                  ))}
                  <Link
                    href={nav.servicesHref}
                    className="col-span-2 mt-1 flex items-center justify-between rounded-2xl bg-bg px-4 py-3 text-[15px] font-semibold text-ink hover:bg-night hover:text-white"
                  >
                    {nav.allServicesLabel}
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            {nav.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-2 text-[15px] transition-colors hover:text-ink ${
                  pathname === l.href ? "text-ink" : "text-ink-soft"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={switchHref}
              hrefLang={other}
              lang={other}
              aria-label={other === "fr" ? "Français" : "Deutsch"}
              className="hidden rounded-full px-3 py-2 text-[13px] font-medium uppercase tracking-wider text-muted transition-colors hover:text-ink sm:block"
            >
              {other}
            </Link>
            {minimal && (
              <a href={nav.phone.href} className="hidden rounded-full px-4 py-2 text-[15px] text-ink-soft hover:text-ink sm:block">
                {nav.phone.label}
              </a>
            )}
            <Link
              href={minimal ? "#formular" : nav.cta.href}
              className="hidden rounded-full bg-night px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-ink-soft sm:inline-flex"
            >
              {nav.cta.label}
            </Link>
            <button
              type="button"
              onClick={() => setOpenFor(open ? null : pathname)}
              className={`${minimal ? "hidden" : "grid lg:hidden"} h-11 w-11 place-items-center rounded-full border border-line`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? nav.closeLabel : nav.menuLabel}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>

      {/* Outside the header: its backdrop-filter would make it the containing block of this fixed panel. */}
      {open && !minimal && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[72px] z-40 flex flex-col overflow-hidden bg-white text-ink lg:hidden">

          <div className="relative flex-1 overflow-y-auto">
            <div className="container-x pb-8 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{nav.servicesLabel}</span>
                <Link href={nav.servicesHref} className="flex items-center gap-1 text-[13px] font-medium text-ink">
                  {nav.allServicesLabel}
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {nav.services.map((s, i) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    style={{ animationDelay: `${i * 35}ms` }}
                    className="animate-pop group flex min-h-[92px] flex-col justify-between rounded-2xl border border-line bg-bg p-3.5 transition-colors active:border-ink/30"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-ink">
                      <Icon name={s.icon} className="h-[18px] w-[18px]" />
                    </span>
                    <span className="text-[15px] font-medium leading-tight text-ink">{s.label}</span>
                  </Link>
                ))}
              </div>

              <nav className="mt-8 border-t border-line" aria-label={nav.locale === "de" ? "Menü" : "Menu"}>
                {nav.links.map((l, i) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    style={{ animationDelay: `${200 + i * 50}ms` }}
                    className="animate-rise flex items-center justify-between border-b border-line py-4"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className={`font-display text-[1.75rem] font-bold tracking-[-0.03em] ${
                          pathname === l.href ? "text-ink" : "text-ink-soft"
                        }`}
                      >
                        {l.label}
                      </span>
                    </span>
                    <Icon name="arrow" className="h-5 w-5 -rotate-45 text-muted" />
                  </Link>
                ))}
              </nav>

              <div className="mt-6 flex items-center justify-between text-[13px] text-muted">
                <a href={`mailto:${nav.email}`} className="hover:text-ink">
                  {nav.email}
                </a>
                <Link
                  href={switchHref}
                  hrefLang={other}
                  className="rounded-full border border-line px-3 py-1.5 font-medium uppercase tracking-wider text-ink-soft"
                >
                  {other === "fr" ? "Français" : "Deutsch"}
                </Link>
              </div>
            </div>
          </div>

          <div className="relative border-t border-line bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl">
            <Link
              href={nav.cta.href}
              className="flex items-center justify-center gap-2 rounded-full bg-night px-6 py-4 text-[16px] font-semibold text-white"
            >
              {nav.cta.label}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <a
                href={nav.phone.href}
                className="flex items-center justify-center gap-2 rounded-full border border-line py-3 text-[14px] font-medium"
              >
                <Icon name="phone" className="h-4 w-4 text-ink" />
                {nav.locale === "fr" ? "Appeler" : "Anrufen"}
              </a>
              <a
                href={nav.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-line py-3 text-[14px] font-medium"
              >
                <Icon name="chat" className="h-4 w-4 text-ink" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
