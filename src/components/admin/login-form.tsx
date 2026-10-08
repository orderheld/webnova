"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-line bg-surface p-7">
      <label className="block">
        <span className="mb-1.5 block text-[13px] text-muted">E-Mail</span>
        <input name="email" type="email" autoComplete="username" required className="input" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[13px] text-muted">Passwort</span>
        <input name="password" type="password" autoComplete="current-password" required className="input" />
      </label>
      {state?.error && <p className="text-[13px] text-danger">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-ink py-3.5 text-[15px] font-medium text-white hover:bg-accent disabled:opacity-60">
        {pending ? "Anmelden …" : "Anmelden"}
      </button>
    </form>
  );
}
