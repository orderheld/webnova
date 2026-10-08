"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/types";
import { Icon } from "./icons";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  text?: string;
}

export interface NavGroup {
  key: string;
  label: string;
  items: NavItem[];
  more?: { label: string; href: string };
}

export interface NavData {
  locale: Locale;
  home: string;
  links: { label: string; href: string }[];
  serviceGroups: NavGroup[];
  servicesLabel: string;
  servicesHref: string;
  allServicesLabel: string;
  industries: NavItem[];
  industriesLabel: string;
  industriesHref: string;
  allIndustriesLabel: string;
  problemsLabel: string;
  problemsHref: string;
  resourcesLabel: string;
  resourcesHref: string;
  resourceGroups: NavGroup[];
  cta: { label: string; href: string };
  menuLabel: string;
  closeLabel: string;
  phone: { label: string; href: string };
  whatsappHref: string;
  email: string;
  /** maps every localized path to its counterpart in the other language */
  switchMap: Record<string, string>;
}

type MenuKey = "services" | "industries" | "resources";

export function Header({ nav, logo }: { nav: NavData; logo: React.ReactNode }) {
  const pathname = usePathname();
  // The menu stays open only for the path it was opened on, so navigating closes it.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  // Desktop dropdowns, keyed by the path they were opened on for the same reason.
  const [menu, setMenu] = useState<{ key: MenuKey; path: string } | null>(null);
  const openMenu = menu && menu.path === pathname ? menu.key : null;
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  // Mobile action bar appears once the visitor has scrolled past the first screen.
  const [deep, setDeep] = useState(false);
  const other: Locale = nav.locale === "de" ? "fr" : "de";
  const switchHref = nav.switchMap[pathname] ?? `/${other}`;
  // Landing pages (Ads traffic) get a reduced header without navigation.
  const minimal = pathname.includes("/lp/");
  // No action bar where the form already is (request, contact, landing pages).
  const contactHref = nav.links.find((l) => /\/(kontakt|contact)$/.test(l.href))?.href;
  const showBar = !minimal && pathname !== nav.cta.href && pathname !== contactHref;
  const closeMenu = useCallback(() => setMenu(null), []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setDeep(window.scrollY > 560);
    };
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

  // Close an open dropdown on a click outside the navigation.
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [openMenu, closeMenu]);

  const menuProps = (key: MenuKey) => ({
    id: key,
    open: openMenu === key,
    onOpen: () => setMenu({ key, path: pathname }),
    onToggle: () => setMenu(openMenu === key ? null : { key, path: pathname }),
    onClose: closeMenu,
  });
  const de = nav.locale === "de";

  return (
    <>
      <header
        className={`sticky top-0 z-50 text-ink transition-all duration-300 ${
          scrolled && !open ? "border-b border-line bg-bg/95 shadow-xs backdrop-blur-xl" : `border-b bg-bg ${open ? "border-line" : "border-transparent"}`
        }`}
      >
        <div className="container-x relative flex h-[72px] items-center justify-between gap-6">
          <Link href={nav.home} aria-label="Webnova" className="shrink-0">
            {logo}
          </Link>

          <nav ref={navRef} className={`${minimal ? "hidden" : "hidden lg:flex"} items-center gap-0.5 self-stretch`} aria-label={de ? "Hauptnavigation" : "Navigation principale"}>
            <Dropdown label={nav.servicesLabel} active={false} {...menuProps("services")}>
              <div className="grid gap-x-6 gap-y-2 p-6 lg:grid-cols-3">
                {nav.serviceGroups.map((g) => (
                  <MenuGroup key={g.key} group={g} detailed />
                ))}
              </div>
              <MenuFooter>
                <Link href={nav.servicesHref} className="link-arrow">
                  {nav.allServicesLabel}
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
                <span className="flex items-center gap-5 text-[14px] text-ink-soft">
                  <a href={nav.phone.href} className="inline-flex items-center gap-2 hover:text-accent">
                    <Icon name="phone" className="h-4 w-4 text-bright" /> {nav.phone.label}
                  </a>
                  <Link href={nav.cta.href} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-medium text-white hover:bg-night">
                    {nav.cta.label}
                    <Icon name="arrow" className="h-3.5 w-3.5" />
                  </Link>
                </span>
              </MenuFooter>
            </Dropdown>

            <Dropdown label={nav.industriesLabel} active={pathname.startsWith(nav.industriesHref)} {...menuProps("industries")}>
              <div className="grid gap-6 p-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <p className="mb-3 px-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{nav.industriesLabel}</p>
                  <ul className="grid grid-cols-2 gap-1">
                    {nav.industries.map((s) => (
                      <li key={s.href}>
                        <MenuLink item={s} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-2 rounded-xl bg-bg-2 p-5 lg:col-span-4">
                  <p className="font-display text-[18px] font-semibold tracking-[-0.01em]">{de ? "Lieber beim Problem starten?" : "Plutôt partir du problème ?"}</p>
                  <p className="text-[14.5px] leading-relaxed text-ink-soft">
                    {de ? "Keine Anfragen, nicht gefunden, veraltet oder zu langsam: die häufigsten Anliegen und wie wir sie lösen." : "Pas de demandes, introuvable, dépassé ou trop lent : les cas les plus fréquents et nos solutions."}
                  </p>
                  <Link href={nav.problemsHref} className="link-arrow mt-auto pt-2">
                    {nav.problemsLabel}
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <MenuFooter>
                <Link href={nav.industriesHref} className="link-arrow">
                  {nav.allIndustriesLabel}
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </MenuFooter>
            </Dropdown>

            <Dropdown label={nav.resourcesLabel} active={pathname.startsWith(nav.resourcesHref)} {...menuProps("resources")}>
              <div className={`grid gap-x-6 gap-y-2 p-6 ${nav.resourceGroups.length >= 3 ? "lg:grid-cols-12" : "lg:grid-cols-2"}`}>
                {nav.resourceGroups.map((g, i) => (
                  <div key={g.key} className={nav.resourceGroups.length >= 3 ? (i === 0 ? "lg:col-span-6" : "lg:col-span-3") : ""}>
                    <MenuGroup group={g} />
                  </div>
                ))}
              </div>
            </Dropdown>

            {nav.links.map((l, n) => (
              <Link
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-[15px] transition-colors hover:bg-bg-2 hover:text-accent xl:px-4 ${
                  n >= nav.links.length - 2 ? "hidden 2xl:block" : ""
                } ${pathname === l.href ? "font-medium text-accent" : "text-ink-soft"}`}
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
              className="hidden rounded-full px-3 py-2 text-[13px] font-medium uppercase tracking-wider text-muted transition-colors hover:text-accent sm:block"
            >
              {other}
            </Link>
            <a
              href={nav.phone.href}
              className={`${minimal ? "hidden sm:flex" : "hidden 2xl:flex"} items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[14px] text-ink-soft transition-colors hover:text-accent`}
            >
              <Icon name="phone" className="h-4 w-4 text-bright" />
              {nav.phone.label}
            </a>
            <Link
              href={minimal ? "#formular" : nav.cta.href}
              className="group hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-white shadow-xs transition-colors hover:bg-night sm:inline-flex"
            >
              {nav.cta.label}
              <Icon name="arrow" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => setOpenFor(open ? null : pathname)}
              className={`${minimal ? "hidden" : "grid lg:hidden"} h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-accent/40`}
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
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[72px] z-40 flex flex-col overflow-hidden bg-night text-white lg:hidden">
          <div className="relative flex-1 overflow-y-auto">
            <div className="container-x pb-8 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">{nav.servicesLabel}</span>
                <Link href={nav.servicesHref} className="flex items-center gap-1 text-[13px] font-medium text-accent-light">
                  {nav.allServicesLabel}
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                </Link>
              </div>
              {nav.serviceGroups.map((g, gi) => (
                <div key={g.key} className="mt-5">
                  <p className="mb-2.5 text-[13px] font-medium text-white/75">{g.label}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {g.items.map((s, i) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        style={{ animationDelay: `${gi * 60 + i * 30}ms` }}
                        className="animate-pop group flex min-h-[84px] flex-col justify-between gap-2 rounded-2xl border border-white/10 bg-night-2 p-3.5 transition-colors active:border-accent-light/60 active:bg-white/[0.08]"
                      >
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.08] text-accent-light ring-1 ring-inset ring-white/10">
                          <Icon name={s.icon} className="h-4 w-4" />
                        </span>
                        <span className="text-[14.5px] font-medium leading-tight text-white/90">{s.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-8 flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">{nav.industriesLabel}</span>
                <Link href={nav.industriesHref} className="flex items-center gap-1 text-[13px] font-medium text-accent-light">
                  {nav.allIndustriesLabel}
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {nav.industries.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition-colors active:border-accent-light/60 active:bg-white/[0.08]"
                  >
                    <Icon name={s.icon} className="h-[18px] w-[18px] shrink-0 text-accent-light" />
                    <span className="text-[14px] font-medium leading-tight text-white/90">{s.label}</span>
                  </Link>
                ))}
              </div>

              {nav.resourceGroups
                .filter((g) => g.key !== "agency")
                .map((g) => (
                  <div key={g.key} className="mt-8">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">{g.label}</span>
                      {g.more && (
                        <Link href={g.more.href} className="flex items-center gap-1 text-[13px] font-medium text-accent-light">
                          {g.more.label}
                          <Icon name="arrow" className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                    <ul className="mt-3 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04]">
                      {g.items.map((s) => (
                        <li key={s.href}>
                          <Link href={s.href} className="flex items-center gap-3 px-4 py-3 text-[14.5px] text-white/90">
                            <Icon name={s.icon} className="h-4 w-4 shrink-0 text-accent-light" />
                            {s.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

              <nav className="mt-8 border-t border-white/10" aria-label={de ? "Menü" : "Menu"}>
                {[{ label: nav.problemsLabel, href: nav.problemsHref }, ...nav.links].map((l, i) => (
                  <Link key={l.href} href={l.href} className="flex items-center justify-between border-b border-white/10 py-4">
                    <span className="flex items-baseline gap-4">
                      <span className="text-[12px] tabular-nums text-accent-light">{String(i + 1).padStart(2, "0")}</span>
                      <span className={`font-display text-[1.6rem] font-semibold tracking-[-0.02em] ${pathname === l.href ? "text-accent-light" : ""}`}>{l.label}</span>
                    </span>
                    <Icon name="arrow" className="h-5 w-5 -rotate-45 text-white/50" />
                  </Link>
                ))}
              </nav>

              <div className="mt-6 flex items-center justify-between text-[13px] text-white/70">
                <a href={`mailto:${nav.email}`} className="hover:text-white">
                  {nav.email}
                </a>
                <Link href={switchHref} hrefLang={other} className="rounded-full border border-white/15 px-3 py-1.5 font-medium uppercase tracking-wider text-white/70">
                  {other === "fr" ? "Français" : "Deutsch"}
                </Link>
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/10 bg-night/90 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl">
            <Link href={nav.cta.href} className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-[16px] font-semibold text-accent">
              {nav.cta.label}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <a href={nav.phone.href} className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-[14px] font-medium">
                <Icon name="phone" className="h-4 w-4 text-accent-light" />
                {de ? "Anrufen" : "Appeler"}
              </a>
              <a
                href={nav.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-[14px] font-medium"
              >
                <Icon name="chat" className="h-4 w-4 text-accent-light" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile action bar: call, WhatsApp and the request, always one tap away. */}
      {showBar && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_24px_-12px_rgb(27_45_62/0.18)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${
            deep && !open ? "translate-y-0" : "pointer-events-none translate-y-full"
          }`}
          aria-hidden={!deep || open}
        >
          <div className="mx-auto flex max-w-md items-center gap-2">
            <a
              href={nav.phone.href}
              tabIndex={deep && !open ? 0 : -1}
              aria-label={de ? "Anrufen" : "Appeler"}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line text-accent"
            >
              <Icon name="phone" className="h-5 w-5" />
            </a>
            <a
              href={nav.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={deep && !open ? 0 : -1}
              aria-label="WhatsApp"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line text-accent"
            >
              <Icon name="chat" className="h-5 w-5" />
            </a>
            <Link
              href={nav.cta.href}
              tabIndex={deep && !open ? 0 : -1}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-4 text-[15px] font-semibold text-white"
            >
              {nav.cta.label}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Desktop mega dropdown. Opens on hover, on click and with the arrow-down key; Escape closes it and
 * returns focus to the trigger, and tabbing out of it closes it. The panel spans the header container.
 */
function Dropdown({
  id,
  label,
  active,
  open,
  onOpen,
  onToggle,
  onClose,
  children,
}: {
  id: string;
  label: string;
  active: boolean;
  open: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = `menu-${id}`;
  return (
    <div
      className="flex h-full items-center"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          onClose();
          triggerRef.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (open && !e.currentTarget.contains(e.relatedTarget as Node | null)) onClose();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            onOpen();
            requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus());
          }
        }}
        className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[15px] transition-colors hover:bg-bg-2 hover:text-accent xl:px-4 ${
          open || active ? "text-accent" : "text-ink-soft"
        } ${open ? "bg-bg-2" : ""}`}
      >
        {label}
        <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        ref={panelRef}
        id={panelId}
        className={`absolute inset-x-5 top-full pt-1 transition-[opacity,visibility,transform] duration-200 sm:inset-x-8 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">{children}</div>
      </div>
    </div>
  );
}

function MenuGroup({ group, detailed = false }: { group: NavGroup; detailed?: boolean }) {
  return (
    <div>
      <p className="mb-2 px-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{group.label}</p>
      <ul className="space-y-0.5">
        {group.items.map((s) => (
          <li key={s.href}>
            <MenuLink item={s} detailed={detailed} />
          </li>
        ))}
      </ul>
      {group.more && (
        <Link href={group.more.href} className="link-arrow mt-2 px-3 text-[14px]">
          {group.more.label}
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function MenuLink({ item, detailed = false }: { item: NavItem; detailed?: boolean }) {
  return (
    <Link
      href={item.href}
      className="group/item flex items-start gap-3 rounded-xl px-3 py-2.5 text-ink-soft transition-colors hover:bg-bg-2 hover:text-accent focus-visible:bg-bg-2"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-bright-soft text-bright transition-colors group-hover/item:bg-accent group-hover/item:text-white">
        <Icon name={item.icon} className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 pt-0.5">
        <span className="block text-[15px] font-medium leading-snug text-ink group-hover/item:text-accent">{item.label}</span>
        {detailed && item.text && <span className="mt-0.5 line-clamp-1 text-[13px] leading-snug text-muted">{item.text}</span>}
      </span>
    </Link>
  );
}

function MenuFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-bg-2 px-6 py-4">{children}</div>;
}
