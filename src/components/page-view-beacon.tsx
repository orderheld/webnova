"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Counts page views for the visitor statistics in the admin (/admin/besucher, see src/app/api/p).
 * Sets no cookies and stores nothing in the browser. Sends the path and, on the first page of a visit,
 * where the visitor came from (referrer or utm_source).
 */
export function PageViewBeacon() {
  const path = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (last.current === path || navigator.webdriver) return;
    const first = last.current === null;
    last.current = path;
    const payload: { p: string; r?: string; s?: string; t?: boolean } = { p: path };
    if (first) {
      if (document.referrer) payload.r = document.referrer;
      const utm = new URLSearchParams(location.search).get("utm_source");
      if (utm) payload.s = utm;
    }
    // iPads report a desktop Safari user agent
    if (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1) payload.t = true;
    const body = JSON.stringify(payload);
    if (!navigator.sendBeacon?.("/api/p", body)) {
      fetch("/api/p", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [path]);

  return null;
}
