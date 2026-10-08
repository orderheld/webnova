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

const two = (n: number) => String(n).padStart(2, "0");

export function Header({ nav, logo, logoLight, tone = "dark" }: { nav: NavData; logo: React.ReactNode; logoLight?: React.ReactNode; tone?: "dark" | "light" }) {
  const dk = tone === "dark";
  const pathname = usePathname();
  // The menu stays open only for the path it was opened on, so navigating closes it.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  // Desktop dropdowns, keyed by the path they were opened on for the same reason.
  const [menu, setMenu] = useState<{ key: MenuKey; path: string } | null>(null);
  const openMenu = menu && menu.path === pathname ? menu.key : null;
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
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

  // Fullscreen menu: lock the page, focus the close button, Escape closes and focus returns to "Menü".
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenFor(null);
        menuButtonRef.current?.focus();
      }
    };
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
  // Running numbers across the service columns (01, 02, ... continue from column to column).
  const serviceStarts = nav.serviceGroups.map((_, i) => nav.serviceGroups.slice(0, i).reduce((sum, g) => sum + g.items.length, 0));

  // Numbered entries of the fullscreen menu; the first three open their sub-lists in place.
  const overlayLinks: { label: string; href: string; sub?: { label: string; href: string }[] }[] = [
    { label: nav.servicesLabel, href: nav.servicesHref, sub: nav.serviceGroups.flatMap((g) => g.items) },
    { label: nav.industriesLabel, href: nav.industriesHref, sub: nav.industries },
    { label: nav.resourcesLabel, href: nav.resourcesHref, sub: nav.resourceGroups.filter((g) => g.key !== "agency").flatMap((g) => g.items) },
    { label: nav.problemsLabel, href: nav.problemsHref },
    ...nav.links,
  ];

  return (
    <>
      <header
        id="top"
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
          dk
            ? `text-white ${scrolled || openMenu ? "border-white/10 bg-night/95 backdrop-blur-xl" : "border-transparent bg-night"}`
            : `text-ink ${scrolled || openMenu ? "border-line bg-bg/95 backdrop-blur-xl" : "border-transparent bg-bg"}`
        }`}
      >
        <div className="container-x relative flex h-[72px] items-center justify-between gap-6">
          <Link href={nav.home} aria-label="Webnova" className="shrink-0">
            {dk ? (logoLight ?? logo) : logo}
          </Link>

          <nav ref={navRef} className={`${minimal ? "hidden" : "hidden lg:flex"} items-center gap-1 self-stretch`} aria-label={de ? "Hauptnavigation" : "Navigation principale"}>
            <Dropdown label={nav.servicesLabel} active={pathname.startsWith(nav.servicesHref)} dark={dk} {...menuProps("services")}>
              <div className="grid gap-x-10 gap-y-8 px-8 pb-8 pt-7 lg:grid-cols-3">
                {nav.serviceGroups.map((g, i) => (
                  <MenuGroup key={g.key} group={g} start={serviceStarts[i]} detailed />
                ))}
              </div>
              <MenuFooter>
                <Link href={nav.servicesHref} className="link-arrow">
                  {nav.allServicesLabel}
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
                <span className="flex items-center gap-6 text-[14px] text-ink-soft">
                  <a href={nav.phone.href} className="inline-flex items-center gap-2 hover:text-accent">
                    <Icon name="phone" className="h-4 w-4 text-bright" /> {nav.phone.label}
                  </a>
                  <a href={`mailto:${nav.email}`} className="hover:text-accent">
                    {nav.email}
                  </a>
                </span>
              </MenuFooter>
            </Dropdown>

            <Dropdown label={nav.industriesLabel} active={pathname.startsWith(nav.industriesHref)} dark={dk} {...menuProps("industries")}>
              <div className="grid gap-10 px-8 pb-8 pt-7 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <p className="label mb-3">{nav.industriesLabel}</p>
                  <ul className="grid grid-cols-2 gap-x-8 border-t border-line">
                    {nav.industries.map((s, i) => (
                      <li key={s.href}>
                        <MenuLink item={s} n={i + 1} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-2 border-l border-line pl-8 lg:col-span-4">
                  <p className="label mb-2">{nav.problemsLabel}</p>
                  <p className="font-display text-[22px] font-semibold leading-tight tracking-[-0.01em]">{de ? "Lieber beim Problem starten?" : "Plutôt partir du problème ?"}</p>
                  <p className="text-[14.5px] leading-relaxed text-ink-soft">
                    {de ? "Keine Anfragen, nicht gefunden, veraltet oder zu langsam: die häufigsten Anliegen und wie wir sie lösen." : "Pas de demandes, introuvable, dépassé ou trop lent : les cas les plus fréquents et nos solutions."}
                  </p>
                  <Link href={nav.problemsHref} className="link-arrow mt-auto pt-3">
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

            <Dropdown label={nav.resourcesLabel} active={pathname.startsWith(nav.resourcesHref)} dark={dk} {...menuProps("resources")}>
              <div className={`grid gap-x-10 gap-y-8 px-8 pb-8 pt-7 ${nav.resourceGroups.length >= 3 ? "lg:grid-cols-12" : "lg:grid-cols-2"}`}>
                {nav.resourceGroups.map((g, i) => (
                  <div key={g.key} className={nav.resourceGroups.length >= 3 ? (i === 0 ? "lg:col-span-6" : "lg:col-span-3") : ""}>
                    <MenuGroup group={g} start={0} />
                  </div>
                ))}
              </div>
            </Dropdown>

            {nav.links.map((l, n) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`whitespace-nowrap px-2.5 py-2 text-[15px] transition-colors hover:text-accent xl:px-3.5 ${
                  n >= nav.links.length - 1 ? "hidden xl:block" : ""
                } ${
                  pathname === l.href
                    ? dk
                      ? "font-medium text-white underline decoration-accent-light decoration-[1.5px] underline-offset-[10px]"
                      : "font-medium text-accent underline decoration-accent decoration-[1.5px] underline-offset-[10px]"
                    : dk
                      ? "text-white/75 hover:!text-white"
                      : "text-ink-soft"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Language switch: both languages always visible, the current one highlighted. */}
            <div className="flex items-center rounded-full bg-bg-2 p-1 text-[12.5px] font-semibold ring-1 ring-inset ring-line">
              {(["de", "fr"] as const).map((l) =>
                l === nav.locale ? (
                  <span key={l} aria-current="true" className="rounded-full bg-accent px-2.5 py-1.5 uppercase leading-none tracking-[0.08em] text-white">
                    {l}
                  </span>
                ) : (
                  <Link
                    key={l}
                    href={switchHref}
                    hrefLang={l}
                    lang={l}
                    aria-label={l === "fr" ? "Français" : "Deutsch"}
                    className="rounded-full px-2.5 py-1.5 uppercase leading-none tracking-[0.08em] text-ink-soft transition-colors hover:text-accent"
                  >
                    {l}
                  </Link>
                ),
              )}
            </div>
            <a
              href={nav.phone.href}
              className={`${minimal ? "hidden sm:flex" : "hidden 2xl:flex"} items-center gap-2 whitespace-nowrap px-3 py-2 text-[14px] transition-colors ${dk ? "text-white/75 hover:text-white" : "text-ink-soft hover:text-accent"}`}
            >
              <Icon name="phone" className="h-4 w-4 text-bright" />
              {nav.phone.label}
            </a>
            <Link
              href={minimal ? "#formular" : nav.cta.href}
              className={`group hidden items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors sm:inline-flex ${dk ? "bg-white text-accent hover:bg-bright-soft" : "bg-accent text-white hover:bg-night"}`}
            >
              {nav.cta.label}
              <Icon name="arrow" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpenFor(open ? null : pathname)}
              className={`${minimal ? "hidden" : "flex lg:hidden"} h-11 items-center gap-2.5 rounded-full border pl-4 pr-3.5 text-[14px] font-medium transition-colors max-[399px]:px-3.5 ${dk ? "border-white/20 bg-white/5 text-white hover:border-white/50" : "border-line bg-white text-ink hover:border-accent/40"}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="max-[399px]:sr-only">{nav.menuLabel}</span>
              <span aria-hidden="true" className="flex w-4 flex-col gap-[5px]">
                <span className="h-[1.5px] w-full bg-current" />
                <span className="h-[1.5px] w-2/3 self-end bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen menu with numbered entries. Outside the header: its backdrop-filter would make it the containing block. */}
      {open && !minimal && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={nav.menuLabel}
          className="stage-night fixed inset-0 z-[60] flex flex-col overflow-hidden text-white lg:hidden"
        >
          <div className="container-x flex h-[72px] shrink-0 items-center justify-between border-b border-white/10">
            <Link href={nav.home} aria-label="Webnova" className="shrink-0">
              {logoLight ?? logo}
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => {
                setOpenFor(null);
                menuButtonRef.current?.focus();
              }}
              className="flex h-11 items-center gap-2.5 rounded-full border border-white/20 pl-4 pr-3.5 text-[14px] font-medium"
            >
              {nav.closeLabel}
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="container-x pb-8 pt-4">
              <p className="label pb-2 pt-4 text-white/50">{de ? "Webnova · Webagentur Schweiz" : "Webnova · Agence web Suisse"}</p>
              <nav aria-label={de ? "Menü" : "Menu"}>
                <ul>
                  {overlayLinks.map((l, i) => (
                    <li key={l.href} className="border-b border-white/10">
                      {l.sub && l.sub.length > 0 ? (
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                          <summary className="flex cursor-pointer list-none items-center justify-between py-4">
                            <span className="flex items-baseline gap-4">
                              <span className="w-6 text-[12px] tabular-nums text-accent-light">{two(i + 1)}</span>
                              <span className="font-display text-[1.75rem] font-semibold tracking-[-0.012em]">{l.label}</span>
                            </span>
                            <Icon name="plus" className="h-5 w-5 text-white/60 transition-transform group-open:rotate-45" />
                          </summary>
                          <ul className="pb-5 pl-10">
                            {l.sub.map((s) => (
                              <li key={s.href}>
                                <Link href={s.href} className="block py-2 text-[16px] text-white/80 hover:text-white">
                                  {s.label}
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link href={l.href} className="mt-1 inline-flex items-center gap-1.5 py-2 text-[14px] font-medium text-accent-light">
                                {de ? "Übersicht" : "Vue d'ensemble"}
                                <Icon name="arrow" className="h-3.5 w-3.5" />
                              </Link>
                            </li>
                          </ul>
                        </details>
                      ) : (
                        <Link href={l.href} aria-current={pathname === l.href ? "page" : undefined} className="flex items-center justify-between py-4">
                          <span className="flex items-baseline gap-4">
                            <span className="w-6 text-[12px] tabular-nums text-accent-light">{two(i + 1)}</span>
                            <span className={`font-display text-[1.75rem] font-semibold tracking-[-0.012em] ${pathname === l.href ? "text-accent-light" : ""}`}>{l.label}</span>
                          </span>
                          <Icon name="arrow" className="h-5 w-5 -rotate-45 text-white/50" />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-8 grid gap-1 text-[15px] text-white/75">
                <a href={nav.phone.href} className="py-1 hover:text-white">
                  {nav.phone.label}
                </a>
                <a href={`mailto:${nav.email}`} className="py-1 hover:text-white">
                  {nav.email}
                </a>
                <Link href={switchHref} hrefLang={other} lang={other} className="py-1 font-medium uppercase tracking-[0.14em] text-white/60 hover:text-white">
                  {other === "fr" ? "Français" : "Deutsch"}
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            <div className="mx-auto grid max-w-md grid-cols-[1fr_auto] gap-2.5">
              <Link href={nav.cta.href} className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[16px] font-semibold text-accent">
                {nav.cta.label}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a
                href={nav.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid h-[52px] w-[52px] place-items-center rounded-full border border-white/20"
              >
                <Icon name="chat" className="h-5 w-5 text-accent-light" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile action bar: call, WhatsApp and the request, always one tap away. */}
      {showBar && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
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
 * returns focus to the trigger, and tabbing out of it closes it. The panel spans the full width under the header.
 */
function Dropdown({
  id,
  label,
  active,
  open,
  onOpen,
  onToggle,
  onClose,
  dark = false,
  children,
}: {
  dark?: boolean;
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
            window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus(), 60);
          }
        }}
        className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-[15px] transition-colors xl:px-3.5 ${
          dark ? (open || active ? "text-white" : "text-white/75 hover:text-white") : open || active ? "text-accent" : "text-ink-soft hover:text-accent"
        }`}
      >
        {label}
        <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        ref={panelRef}
        id={panelId}
        className={`absolute inset-x-5 top-full transition-[opacity,visibility,transform] duration-200 sm:inset-x-8 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-line bg-surface text-ink shadow-lift">{children}</div>
      </div>
    </div>
  );
}

function MenuGroup({ group, detailed = false, start }: { group: NavGroup; detailed?: boolean; start: number }) {
  return (
    <div>
      <p className="label mb-3">{group.label}</p>
      <ul className="border-t border-line">
        {group.items.map((s, i) => (
          <li key={s.href}>
            <MenuLink item={s} detailed={detailed} n={start + i + 1} />
          </li>
        ))}
      </ul>
      {group.more && (
        <Link href={group.more.href} className="link-arrow mt-3 text-[14px]">
          {group.more.label}
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function MenuLink({ item, detailed = false, n }: { item: NavItem; detailed?: boolean; n: number }) {
  return (
    <Link
      href={item.href}
      className="group/item grid grid-cols-[2rem_1fr] items-baseline gap-x-2 border-b border-line py-2.5 transition-colors hover:text-accent focus-visible:text-accent"
    >
      <span className="text-[12px] tabular-nums text-muted group-hover/item:text-accent">{two(n)}</span>
      <span className="min-w-0">
        <span className="block text-[15px] font-medium leading-snug text-ink group-hover/item:text-accent">{item.label}</span>
        {detailed && item.text && <span className="mt-0.5 line-clamp-1 text-[13px] leading-snug text-muted">{item.text}</span>}
      </span>
    </Link>
  );
}

function MenuFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-bg-2 px-8 py-4">{children}</div>;
}
