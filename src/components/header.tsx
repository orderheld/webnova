"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/types";
import { Icon, WhatsAppGlyph } from "./icons";

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
  links: { label: string; href: string; bar?: "lg" | "xl" }[];
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
  const dialogRef = useRef<HTMLDivElement>(null);
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
  // While the action bar is shown, its WhatsApp button stands in for the floating one (phones only).
  const barShown = showBar && deep && !open;
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
  // It is a modal dialog, so Tab and Shift+Tab cycle inside it instead of reaching the page behind.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenFor(null);
        menuButtonRef.current?.focus();
        return;
      }
      const dialog = dialogRef.current;
      if (e.key !== "Tab" || !dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), summary")].filter((el) => el.getClientRects().length > 0);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const inside = dialog.contains(document.activeElement);
      if (e.shiftKey && (!inside || document.activeElement === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close an open dropdown on a click outside the navigation, and with Escape also when it was opened by hover.
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeMenu();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu, closeMenu]);

  const menuProps = (key: MenuKey) => ({
    id: key,
    open: openMenu === key,
    onOpen: () => setMenu({ key, path: pathname }),
    onToggle: () => setMenu(openMenu === key ? null : { key, path: pathname }),
    onClose: closeMenu,
  });
  const de = nav.locale === "de";
  const whatsappLabel = de ? "Auf WhatsApp schreiben" : "Écrire sur WhatsApp";
  // Entries of the fullscreen menu; the first three open their sub-lists in place.
  const overlayLinks: { label: string; href: string; sub?: { label: string; href: string; icon?: string }[] }[] = [
    { label: nav.servicesLabel, href: nav.servicesHref, sub: nav.serviceGroups.flatMap((g) => g.items) },
    { label: nav.industriesLabel, href: nav.industriesHref, sub: nav.industries },
    { label: nav.resourcesLabel, href: nav.resourcesHref, sub: nav.resourceGroups.filter((g) => g.key !== "agency").flatMap((g) => g.items) },
    { label: nav.problemsLabel, href: nav.problemsHref },
    ...nav.links,
  ];

  return (
    <>
      {/* Floating bar: a rounded pill with a little air around it, it gets a soft shadow once the page scrolls. */}
      <header id="top" className={`sticky top-0 z-50 px-3 pb-2 pt-3 sm:px-5 lg:pt-4 ${dk ? "text-white" : "text-ink"}`}>
        <div
          className={`relative mx-auto flex h-[60px] max-w-[1240px] items-center justify-between gap-4 rounded-full pl-5 pr-2 ring-1 transition-[background-color,box-shadow] duration-300 sm:h-16 sm:pl-6 ${
            dk
              ? `bg-night/85 ring-white/10 backdrop-blur-xl ${scrolled || openMenu ? "shadow-[0_18px_40px_-20px_rgb(0_0_0/0.6)]" : ""}`
              : `ring-line/80 backdrop-blur-xl ${scrolled || openMenu ? "bg-white/85 shadow-[0_18px_40px_-22px_rgb(27_45_62/0.45)]" : "bg-white/70"}`
          }`}
        >
          <Link href={nav.home} aria-label="Webnova" className="shrink-0" onClick={() => setOpenFor(null)}>
            {dk ? (logoLight ?? logo) : logo}
          </Link>

          <nav ref={navRef} className={`${minimal ? "hidden" : "hidden lg:flex"} items-center gap-0.5 self-stretch`} aria-label={de ? "Hauptnavigation" : "Navigation principale"}>
            <Dropdown label={nav.servicesLabel} active={pathname.startsWith(nav.servicesHref)} dark={dk} {...menuProps("services")}>
              <div className="grid gap-x-6 gap-y-6 p-5 lg:grid-cols-3">
                {nav.serviceGroups.map((g) => (
                  <MenuGroup key={g.key} group={g} detailed />
                ))}
              </div>
              <MenuFooter>
                <Link href={nav.servicesHref} className="link-arrow">
                  {nav.allServicesLabel}
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
                <span className="flex items-center gap-2 text-[14px] text-ink-soft">
                  <a href={nav.phone.href} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-white hover:text-accent">
                    <Icon name="phone" className="h-4 w-4 text-bright" /> {nav.phone.label}
                  </a>
                  <a href={`mailto:${nav.email}`} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-white hover:text-accent">
                    <Icon name="mail" className="h-4 w-4 text-bright" /> {nav.email}
                  </a>
                </span>
              </MenuFooter>
            </Dropdown>

            <Dropdown label={nav.industriesLabel} active={pathname.startsWith(nav.industriesHref)} dark={dk} {...menuProps("industries")}>
              <div className="grid gap-5 p-5 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <p className="label mb-2 px-2.5">{nav.industriesLabel}</p>
                  <ul className="grid grid-cols-2 gap-x-2">
                    {nav.industries.map((s) => (
                      <li key={s.href}>
                        <MenuLink item={s} />
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={nav.problemsHref}
                  className="stage-night group/card flex flex-col gap-3 rounded-2xl p-6 text-white lg:col-span-4"
                >
                  <span className="icon-tile-dark">
                    <Icon name="spark" className="h-5 w-5" />
                  </span>
                  <span className="font-display text-[21px] font-semibold leading-tight tracking-[-0.01em]">{de ? "Lieber beim Problem starten?" : "Plutôt partir du problème ?"}</span>
                  <span className="text-[14.5px] leading-relaxed text-white/70">
                    {de ? "Keine Anfragen, nicht gefunden, veraltet oder zu langsam: die häufigsten Anliegen und wie wir sie lösen." : "Pas de demandes, introuvable, dépassé ou trop lent : les cas les plus fréquents et nos solutions."}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[15px] font-semibold text-accent-light">
                    {nav.problemsLabel}
                    <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover/card:translate-x-0.5" />
                  </span>
                </Link>
              </div>
              <MenuFooter>
                <Link href={nav.industriesHref} className="link-arrow">
                  {nav.allIndustriesLabel}
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </MenuFooter>
            </Dropdown>

            <Dropdown label={nav.resourcesLabel} active={pathname.startsWith(nav.resourcesHref)} dark={dk} {...menuProps("resources")}>
              <div className={`grid gap-x-6 gap-y-6 p-5 ${nav.resourceGroups.length >= 3 ? "lg:grid-cols-12" : "lg:grid-cols-2"}`}>
                {nav.resourceGroups.map((g, i) => (
                  <div key={g.key} className={nav.resourceGroups.length >= 3 ? (i === 0 ? "lg:col-span-6" : "lg:col-span-3") : ""}>
                    <MenuGroup group={g} />
                  </div>
                ))}
              </div>
            </Dropdown>

            {/* Only as many plain links as fit next to the three menus (1240px bar): one from lg,
                three from xl (see `bar` in buildNav). The others stay one click away in the "Ratgeber"
                menu, the fullscreen menu and the footer. */}
            {nav.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`items-center whitespace-nowrap rounded-full px-3 py-2 text-[15px] transition-colors xl:px-3.5 ${
                  l.bar === "lg" ? "flex" : l.bar === "xl" ? "hidden xl:flex" : "hidden"
                } ${
                  pathname === l.href
                    ? dk
                      ? "bg-white/10 font-medium text-white"
                      : "bg-bright-soft font-medium text-accent"
                    : dk
                      ? "text-white/75 hover:bg-white/10 hover:text-white"
                      : "text-ink-soft hover:bg-bg-2 hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Language switch: both languages always visible, the current one highlighted. */}
            <div className={`flex items-center rounded-full p-1 text-[12.5px] font-semibold ${dk ? "bg-white/10" : "bg-bg-2"}`}>
              {(["de", "fr"] as const).map((l) =>
                l === nav.locale ? (
                  <span key={l} aria-current="true" className={`rounded-full px-2.5 py-1.5 uppercase leading-none tracking-[0.08em] shadow-xs ${dk ? "bg-white text-accent" : "bg-white text-accent ring-1 ring-line"}`}>
                    {l}
                  </span>
                ) : (
                  <Link
                    key={l}
                    href={switchHref}
                    // Few visitors switch language: no prefetch of the other language's page on every page view.
                    prefetch={false}
                    hrefLang={l}
                    lang={l}
                    aria-label={l === "fr" ? "FR, Français" : "DE, Deutsch"}
                    className={`rounded-full px-2.5 py-1.5 uppercase leading-none tracking-[0.08em] transition-colors ${dk ? "text-white/70 hover:text-white" : "text-muted hover:text-accent"}`}
                  >
                    {l}
                  </Link>
                ),
              )}
            </div>
            {/* Phone only in the reduced landing-page header: next to the full navigation it no longer fits the bar. */}
            <a
              href={nav.phone.href}
              className={`${minimal ? "hidden sm:flex" : "hidden"} items-center gap-2 whitespace-nowrap px-3 py-2 text-[14px] transition-colors ${dk ? "text-white/75 hover:text-white" : "text-ink-soft hover:text-accent"}`}
            >
              <Icon name="phone" className="h-4 w-4 text-bright" />
              {nav.phone.label}
            </a>
            <Link
              href={minimal ? "#formular" : nav.cta.href}
              className={`group hidden h-11 items-center gap-2.5 whitespace-nowrap rounded-full pl-5 pr-1.5 text-[14.5px] font-medium transition-colors sm:inline-flex sm:h-12 ${dk ? "bg-white text-accent hover:bg-bright-soft" : "bg-accent text-white hover:bg-night"}`}
            >
              {nav.cta.label}
              <span className={`grid h-8 w-8 place-items-center rounded-full sm:h-9 sm:w-9 ${dk ? "bg-accent text-white" : "bg-white/15"}`}>
                <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpenFor(open ? null : pathname)}
              className={`${minimal ? "hidden" : "flex lg:hidden"} h-11 items-center gap-2.5 rounded-full pl-4 pr-3.5 text-[14px] font-medium transition-colors max-[399px]:w-11 max-[399px]:justify-center max-[399px]:px-0 ${dk ? "bg-white text-accent" : "bg-accent text-white hover:bg-night"}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="max-[399px]:sr-only">{nav.menuLabel}</span>
              <span aria-hidden="true" className="flex w-4 flex-col gap-[5px]">
                <span className="h-[1.5px] w-full rounded-full bg-current" />
                <span className="h-[1.5px] w-2/3 self-end rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen menu, light: big entries that open their lists in place, contact and the request at the bottom.
          Outside the header: its backdrop-filter would make it the containing block. */}
      {open && !minimal && (
        <div
          ref={dialogRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={nav.menuLabel}
          className="animate-menu-in fixed inset-0 z-[60] flex flex-col overflow-hidden bg-bg text-ink lg:hidden"
          onClick={(e) => {
            // any link in the menu closes it, also when it points to the page that is already open
            if ((e.target as HTMLElement).closest("a")) setOpenFor(null);
          }}
        >
          <div className="shrink-0 px-3 pt-3 sm:px-5">
            <div className="flex h-[60px] items-center justify-between rounded-full bg-bg-2 pl-5 pr-2 sm:h-16 sm:pl-6">
              <Link href={nav.home} aria-label="Webnova" className="shrink-0" onClick={() => setOpenFor(null)}>
                {logo}
              </Link>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label={nav.closeLabel}
                onClick={() => {
                  setOpenFor(null);
                  menuButtonRef.current?.focus();
                }}
                className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-xs ring-1 ring-line transition-colors hover:text-accent"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="mx-auto max-w-xl px-5 pb-8 pt-5 sm:px-8">
              <nav aria-label={de ? "Menü" : "Menu"}>
                <ul className="space-y-1">
                  {overlayLinks.map((l, i) => (
                    <li key={l.href} className="animate-menu-item" style={{ animationDelay: `${60 + i * 35}ms` }}>
                      {l.sub && l.sub.length > 0 ? (
                        <details className="group rounded-2xl transition-colors open:bg-bg-2 [&_summary::-webkit-details-marker]:hidden">
                          <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl px-3 py-3.5">
                            <span className="font-display text-[1.5rem] font-semibold tracking-[-0.012em]">{l.label}</span>
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-bg-2 text-accent transition-[transform,background-color] duration-300 group-open:rotate-180 group-open:bg-white">
                              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </span>
                          </summary>
                          <ul className="grid gap-0.5 px-1.5 pb-3">
                            {l.sub.map((s) => (
                              <li key={s.href}>
                                <Link href={s.href} className="flex items-center gap-3 rounded-xl px-1.5 py-2 text-[15.5px] text-ink-soft transition-colors hover:bg-white hover:text-ink">
                                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-bright ring-1 ring-line">
                                    <Icon name={s.icon ?? "arrow"} className="h-4 w-4" />
                                  </span>
                                  {s.label}
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link href={l.href} className="ml-1.5 mt-1 inline-flex items-center gap-1.5 py-2 text-[14.5px] font-semibold text-bright">
                                {de ? "Übersicht" : "Vue d'ensemble"}
                                <Icon name="arrow" className="h-3.5 w-3.5" />
                              </Link>
                            </li>
                          </ul>
                        </details>
                      ) : (
                        <Link
                          href={l.href}
                          aria-current={pathname === l.href ? "page" : undefined}
                          className={`flex items-center justify-between rounded-2xl px-3 py-3.5 transition-colors hover:bg-bg-2 ${pathname === l.href ? "bg-bright-soft text-accent" : ""}`}
                        >
                          <span className="font-display text-[1.5rem] font-semibold tracking-[-0.012em]">{l.label}</span>
                          <Icon name="arrow" className="h-5 w-5 text-muted" />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="animate-menu-item mt-6 grid gap-2 rounded-3xl bg-bg-2 p-3" style={{ animationDelay: `${80 + overlayLinks.length * 35}ms` }}>
                <a href={nav.phone.href} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[15.5px] font-medium shadow-xs ring-1 ring-line">
                  <Icon name="phone" className="h-5 w-5 text-bright" />
                  {nav.phone.label}
                </a>
                <a href={`mailto:${nav.email}`} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[15.5px] font-medium shadow-xs ring-1 ring-line">
                  <Icon name="mail" className="h-5 w-5 text-bright" />
                  {nav.email}
                </a>
                <Link href={switchHref} prefetch={false} hrefLang={other} lang={other} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] text-ink-soft">
                  <Icon name="globe" className="h-5 w-5 text-bright" />
                  {other === "fr" ? "Version française" : "Deutsche Version"}
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-line bg-white/90 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl">
            <div className="mx-auto grid max-w-md grid-cols-[1fr_auto] gap-2.5">
              <Link href={nav.cta.href} className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[16px] font-semibold text-white">
                {nav.cta.label}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a
                href={nav.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={whatsappLabel}
                className="grid h-[52px] w-[52px] place-items-center rounded-full bg-whatsapp text-white"
              >
                <WhatsAppGlyph className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile action bar: call, the request and WhatsApp, always one tap away. */}
      {showBar && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
            barShown ? "translate-y-0" : "pointer-events-none translate-y-full"
          }`}
          aria-hidden={!barShown}
        >
          <div className="mx-auto flex max-w-md items-center gap-2">
            <a
              href={nav.phone.href}
              tabIndex={barShown ? 0 : -1}
              aria-label={de ? "Anrufen" : "Appeler"}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line text-accent"
            >
              <Icon name="phone" className="h-5 w-5" />
            </a>
            <Link
              href={nav.cta.href}
              tabIndex={barShown ? 0 : -1}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-4 text-[15px] font-semibold text-white"
            >
              {nav.cta.label}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <a
              href={nav.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={barShown ? 0 : -1}
              aria-label={whatsappLabel}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-whatsapp text-white"
            >
              <WhatsAppGlyph className="h-6 w-6" />
            </a>
          </div>
        </div>
      )}

      {/* WhatsApp at the bottom right of every page. On phones the action bar takes it over while the bar is shown. */}
      <a
        href={nav.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={whatsappLabel}
        className={`group fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_28px_-10px_rgb(27_45_62/0.55)] transition-[opacity,scale,visibility] duration-300 hover:scale-105 print:hidden lg:bottom-6 lg:right-6 ${
          barShown ? "max-lg:invisible max-lg:scale-75 max-lg:opacity-0" : ""
        }`}
      >
        <WhatsAppGlyph className="h-7 w-7" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-2 text-[14px] font-medium text-white opacity-0 shadow-lift transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 lg:block"
        >
          {whatsappLabel}
        </span>
      </a>
    </>
  );
}

/**
 * Desktop mega dropdown. Opens on hover, on click and with the arrow-down key; Escape closes it and
 * returns focus to the trigger, and tabbing out of it closes it. The panel spans the width of the floating bar.
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
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[15px] transition-colors xl:px-3.5 ${
          dark
            ? open || active
              ? "bg-white/10 text-white"
              : "text-white/75 hover:bg-white/10 hover:text-white"
            : open || active
              ? "bg-bright-soft text-accent"
              : "text-ink-soft hover:bg-bg-2 hover:text-ink"
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
        // pt-3 instead of a margin: the gap under the bar belongs to the panel, so the pointer can cross it.
        className={`absolute inset-x-0 top-full pt-3 transition-[opacity,visibility,transform] duration-200 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1.5 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-[28px] bg-white text-ink shadow-[0_30px_60px_-30px_rgb(27_45_62/0.4)] ring-1 ring-line">{children}</div>
      </div>
    </div>
  );
}

function MenuGroup({ group, detailed = false }: { group: NavGroup; detailed?: boolean }) {
  return (
    <div>
      <p className="label mb-2 px-2.5">{group.label}</p>
      <ul className="grid gap-0.5">
        {group.items.map((s) => (
          <li key={s.href}>
            <MenuLink item={s} detailed={detailed} />
          </li>
        ))}
      </ul>
      {group.more && (
        <Link href={group.more.href} className="link-arrow mt-2 px-2.5 text-[14px]">
          {group.more.label}
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

/** Menu entry with its icon; the tile turns Schieferblau on hover. */
function MenuLink({ item, detailed = false }: { item: NavItem; detailed?: boolean }) {
  return (
    <Link href={item.href} className="group/item flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-bg-2 focus-visible:bg-bg-2">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-bright-soft text-bright transition-colors group-hover/item:bg-accent group-hover/item:text-white">
        <Icon name={item.icon} className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 self-center">
        <span className="block text-[14.5px] font-medium leading-snug text-ink">{item.label}</span>
        {detailed && item.text && <span className="mt-0.5 line-clamp-1 text-[13px] leading-snug text-muted">{item.text}</span>}
      </span>
    </Link>
  );
}

function MenuFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-bg-2 px-7 py-3.5">{children}</div>;
}
