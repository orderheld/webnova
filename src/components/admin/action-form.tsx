"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef, useState } from "react";
import type { FormState } from "@/lib/admin/form";
import { Icon } from "./icons";
import { btn, btnSm } from "./ui";

const PendingCtx = createContext(false);
const ModalCtx = createContext<(() => void) | null>(null);

/**
 * Form for server actions that return { ok, error, message }.
 * Submits without React's automatic form reset, so input survives validation errors.
 * Closes a surrounding <Modal> on success; resets itself when `reset` is set.
 */
export function ActionForm({
  action,
  children,
  className = "",
  reset = false,
  id,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  className?: string;
  reset?: boolean;
  id?: string;
}) {
  const [state, dispatch, pending] = useActionState(action, {});
  const ref = useRef<HTMLFormElement>(null);
  const close = useContext(ModalCtx);
  useEffect(() => {
    if (!state.ok) return;
    if (reset) ref.current?.reset();
    close?.();
  }, [state, reset, close]);
  return (
    <PendingCtx.Provider value={pending}>
      <form
        id={id}
        ref={ref}
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => dispatch(fd));
        }}
      >
        {children}
        {state.error && <p className="mt-3 text-[13px] text-danger">{state.error}</p>}
        {state.ok && state.message && <p className="mt-3 text-[13px] text-success">{state.message}</p>}
      </form>
    </PendingCtx.Provider>
  );
}

export function Submit({ children, size = "md", variant = "dark", className = "" }: { children: React.ReactNode; size?: "sm" | "md"; variant?: "dark" | "ghost"; className?: string }) {
  const pending = useContext(PendingCtx);
  return (
    <button disabled={pending} className={`${size === "sm" ? btnSm[variant] : btn[variant]} ${className}`}>
      {pending ? "Speichern …" : children}
    </button>
  );
}

/** Button that opens a dialog. Children (often an <ActionForm>) close it on success. */
export function Modal({
  label,
  title,
  children,
  icon,
  variant = "ghost",
  size = "md",
  wide = false,
  triggerClassName,
}: {
  label: React.ReactNode;
  title: string;
  children: React.ReactNode;
  icon?: string;
  variant?: "dark" | "ghost" | "accent" | "danger";
  size?: "sm" | "md";
  wide?: boolean;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClassName ?? (size === "sm" ? btnSm[variant] : btn[variant])}>
        {icon && <Icon name={icon} className="h-4 w-4" />}
        {label}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
            className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-2xl sm:rounded-2xl ${wide ? "sm:max-w-3xl" : "sm:max-w-lg"}`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-[18px] font-semibold">{title}</h2>
              <button type="button" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-bg" aria-label="Schliessen">
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
            <ModalCtx.Provider value={() => setOpen(false)}>{children}</ModalCtx.Provider>
          </div>
        </div>
      )}
    </>
  );
}
