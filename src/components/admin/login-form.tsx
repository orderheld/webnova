"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-7">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-ink-soft">E-Mail</span>
        <input name="email" type="email" autoComplete="username" required className="input" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-ink-soft">Passwort</span>
        <input name="password" type="password" autoComplete="current-password" required className="input" />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-xl bg-danger-soft px-3 py-2 text-[13px] text-danger">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="w-full rounded-full bg-accent py-3 text-[15px] font-medium text-white shadow-xs transition-colors hover:bg-night disabled:opacity-60"
      >
        {pending ? "Anmelden …" : "Anmelden"}
      </button>
    </form>
  );
}
