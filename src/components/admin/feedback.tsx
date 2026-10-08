"use client";

import { useLinkStatus } from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Icon } from "./icons";

/*
 * Admin feedback: toasts ("Gespeichert", "Gelöscht"), spinners and pending buttons, so every click
 * visibly does something. Server actions leave a flash cookie (lib/admin/flash.ts); the toaster in
 * the panel layout shows it once and clears it.
 */

type ToastKind = "ok" | "error" | "info";
type ToastItem = { id: number; kind: ToastKind; text: string };

const EVENT = "wn-toast";

/** Show a toast from any client component. */
export function toast(text: string, kind: ToastKind = "ok") {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { text, kind } }));
}

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`animate-spin ${className}`}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Toast stack bottom right (bottom centre on phones). `flash` is the raw cookie value from the layout. */
export function Toaster({ flash }: { flash?: string }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seen = useRef<string | null>(null);

  useEffect(() => {
    const push = (text: string, kind: ToastKind) => {
      const id = Date.now() + Math.random();
      setItems((xs) => (xs.some((x) => x.text === text && x.kind === kind) ? xs : [...xs.slice(-3), { id, kind, text }]));
      window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), kind === "error" ? 6000 : 3200);
    };
    const onToast = (e: Event) => {
      const d = (e as CustomEvent<{ text: string; kind: ToastKind }>).detail;
      push(d.text, d.kind);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  useEffect(() => {
    if (!flash || flash === seen.current) return;
    seen.current = flash;
    const [kind, , text] = flash.split("|");
    document.cookie = "wn_flash=; Max-Age=0; path=/admin";
    if (text) toast(decodeURIComponent(text), kind === "error" ? "error" : "ok");
  }, [flash]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end">
      {items.map((t) => (
        <div
          key={t.id}
          role={t.kind === "error" ? "alert" : "status"}
          className="toast-in pointer-events-auto flex items-center gap-2.5 rounded-xl bg-ink px-4 py-3 text-[14px] font-medium text-white shadow-lift"
        >
          <span className={`grid h-5 w-5 place-items-center rounded-full ${t.kind === "error" ? "bg-danger" : "bg-success"}`}>
            <Icon name={t.kind === "error" ? "close" : "check"} className="h-3 w-3" />
          </span>
          {t.text}
        </div>
      ))}
    </div>
  );
}

/**
 * Submit button for server-action forms: shows a spinner and blocks double clicks while the
 * action runs. Optional `confirm` asks first (for deletes).
 */
export function PendingButton({
  children,
  className = "",
  confirm,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { confirm?: string }) {
  const { pending } = useFormStatus();
  const isSubmit = (rest.type ?? "submit") === "submit";
  const busy = isSubmit && pending;
  return (
    <button
      {...rest}
      disabled={rest.disabled || busy}
      aria-busy={busy || undefined}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) {
          e.preventDefault();
          return;
        }
        rest.onClick?.(e);
      }}
      className={`relative ${className}`}
    >
      {busy && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner className="h-4 w-4" />
        </span>
      )}
      <span className={`inline-flex items-center gap-2 ${busy ? "invisible" : ""}`}>{children}</span>
    </button>
  );
}

/** Small spinner shown next to a sidebar entry while its page loads. */
export function LinkPending({ className = "" }: { className?: string }) {
  const { pending } = useLinkStatus();
  return <Spinner className={`h-3.5 w-3.5 shrink-0 transition-opacity ${pending ? "opacity-70" : "opacity-0"} ${className}`} />;
}
