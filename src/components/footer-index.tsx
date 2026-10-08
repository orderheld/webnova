"use client";

import Link from "next/link";
import { useState } from "react";
import type { FooterColumn } from "@/lib/nav";
import { Icon } from "./icons";

/**
 * The footer's full link index. On phones every column is a collapsed accordion (otherwise the index
 * alone is several screens long); from `sm` up all columns are open. The links are always rendered,
 * so crawlers see the same index on every device.
 */
export function FooterIndex({ columns }: { columns: FooterColumn[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="grid gap-x-8 border-t border-white/10 sm:grid-cols-2 sm:gap-y-10 sm:pt-8 md:grid-cols-3 lg:grid-cols-5">
      {columns.map((c, i) => {
        const isOpen = open === c.title;
        const id = `footer-index-${i}`;
        return (
          <div key={c.title} className="border-b border-white/10 sm:border-0">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : c.title)}
              className="flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left text-[15px] font-semibold text-white sm:hidden"
            >
              {c.title}
              <Icon name="plus" className={`h-4 w-4 shrink-0 text-white/60 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
            </button>
            <p className="mb-4 hidden text-[14px] font-semibold text-white sm:block">{c.title}</p>
            <ul id={id} className={`space-y-2 pb-5 sm:block sm:pb-0 ${isOpen ? "block" : "hidden"}`}>
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] leading-snug text-white/60 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
