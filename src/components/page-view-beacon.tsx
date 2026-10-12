"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type Payload = { p: string; r?: string; s?: string; t?: boolean; c?: "phone" | "whatsapp" | "email" };

function send(payload: Payload) {
  const body = JSON.stringify(payload);
  if (!navigator.sendBeacon?.("/api/p", body)) {
    fetch("/api/p", { method: "POST", body, keepalive: true }).catch(() => {});
  }
}

/** Contact channel of a link, if it is one: call, WhatsApp or e-mail. */
function channelOf(href: string): Payload["c"] {
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("https://wa.me/")) return "whatsapp";
  return undefined;
}

/**
 * Counts page views for the visitor statistics in the admin (/admin/besucher, see src/app/api/p).
 * Sets no cookies and stores nothing in the browser. Sends the path and, on the first page of a visit,
 * where the visitor came from (referrer or utm_source). Taps on call, WhatsApp and e-mail links are sent
 * as contacts with the page they were tapped on.
 */
export function PageViewBeacon() {
  const path = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (last.current === path || navigator.webdriver) return;
    const first = last.current === null;
    last.current = path;
    const payload: Payload = { p: path };
    if (first) {
      if (document.referrer) payload.r = document.referrer;
      const utm = new URLSearchParams(location.search).get("utm_source");
      if (utm) payload.s = utm;
    }
    // iPads report a desktop Safari user agent
    if (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1) payload.t = true;
    send(payload);
  }, [path]);

  // One listener for the whole page (capture phase), so links in the menu and the mobile action bar count too.
  useEffect(() => {
    if (navigator.webdriver) return;
    const onClick = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      const c = channelOf(link?.getAttribute("href") ?? "");
      if (c) send({ p: location.pathname, c });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
