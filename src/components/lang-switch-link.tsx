"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/content/types";

/** Link to the current page in the other language (the other language's home page if there is none). */
export function LangSwitchLink({ locale, switchMap, className }: { locale: Locale; switchMap: Record<string, string>; className?: string }) {
  const pathname = usePathname();
  const other: Locale = locale === "de" ? "fr" : "de";
  return (
    <Link href={switchMap[pathname] ?? `/${other}`} prefetch={false} hrefLang={other} lang={other} className={className}>
      {other.toUpperCase()}
    </Link>
  );
}
