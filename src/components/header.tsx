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
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 text-white transition-all duration-300 ${
          scrolled ? "border-b border-white/10 bg-night/95 backdrop-blur-xl" : "border-b border-transparent bg-night"
        }`}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-6">
          <Link href={nav.home} aria-label="Webnova" className="shrink-0">
            {logo}
          </Link>

          <nav className={`${minimal ? "hidden" : "hidden lg:flex"} items-center gap-1`} aria-label="Hauptnavigation">
            <div className="group relative">
              <Link
                href={nav.servicesHref}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-[15px] text-white/70 transition-colors hover:text-white"
              >
                {nav.servicesLabel}
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Link>
              <div className="invisible absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-1 rounded-3xl border border-white/10 bg-night-2 p-3 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]">
                  {nav.services.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="group/item flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-accent transition-colors group-hover/item:bg-accent group-hover/item:text-night">
                        <Icon name={s.icon} className="h-[18px] w-[18px]" />
                      </span>
                      {s.label}
                    </Link>
                  ))}
                  <Link
                    href={nav.servicesHref}
                    className="col-span-2 mt-1 flex items-center justify-between rounded-2xl bg-accent px-4 py-3 text-[15px] font-semibold text-night"
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
                className={`rounded-full px-4 py-2 text-[15px] transition-colors hover:text-white ${
                  pathname === l.href ? "text-white" : "text-white/70"
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
              className="hidden rounded-full px-3 py-2 text-[13px] font-medium uppercase tracking-wider text-white/50 transition-colors hover:text-white sm:block"
            >
              {other}
            </Link>
            {minimal && (
              <a href={nav.phone.href} className="hidden rounded-full px-4 py-2 text-[15px] text-white/70 hover:text-white sm:block">
                {nav.phone.label}
              </a>
            )}
            <Link
              href={minimal ? "#formular" : nav.cta.href}
              className="hidden rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-night transition-all hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(210,255,40,0.45)] sm:inline-flex"
            >
              {nav.cta.label}
            </Link>
            <button
              type="button"
              onClick={() => setOpenFor(open ? null : pathname)}
              className={`${minimal ? "hidden" : "grid lg:hidden"} h-11 w-11 place-items-center rounded-full border border-white/15`}
              aria-expanded={open}
              aria-label={open ? nav.closeLabel : nav.menuLabel}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>

      {/* Outside the header: its backdrop-filter would make it the containing block of this fixed panel. */}
      {open && !minimal && (
        <div className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-night text-white lg:hidden">
          <div className="container-x flex flex-col gap-1 py-6">
            <Link href={nav.servicesHref} className="py-3 font-display text-3xl font-bold tracking-tight">
              {nav.servicesLabel}
            </Link>
            <div className="mb-4 grid grid-cols-1 gap-1 border-b border-white/10 pb-4">
              {nav.services.map((s) => (
                <Link key={s.href} href={s.href} className="flex items-center gap-3 py-2 text-lg text-white/75">
                  <Icon name={s.icon} className="h-5 w-5 text-accent" />
                  {s.label}
                </Link>
              ))}
            </div>
            {nav.links.map((l) => (
              <Link key={l.href} href={l.href} className="py-3 font-display text-3xl font-bold tracking-tight">
                {l.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Link href={nav.cta.href} className="rounded-full bg-accent px-6 py-4 text-center text-lg font-semibold text-night">
                {nav.cta.label}
              </Link>
              <a href={nav.phone.href} className="rounded-full border border-white/15 px-6 py-4 text-center text-lg">
                {nav.phone.label}
              </a>
              <Link href={switchHref} hrefLang={other} className="py-3 text-center text-sm uppercase tracking-wider text-white/50">
                {other === "fr" ? "Français" : "Deutsch"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
