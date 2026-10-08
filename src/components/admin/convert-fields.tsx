"use client";

import { useState } from "react";
import type { Option } from "@/lib/admin/queries";

export function ConvertModeFields({ customers, hasCustomer }: { customers: Option[]; hasCustomer: boolean }) {
  const [mode, setMode] = useState<"neu" | "bestehend">("neu");
  if (hasCustomer) return <input type="hidden" name="customerMode" value="neu" />;
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {(["neu", "bestehend"] as const).map((m) => (
          <label key={m} className={`flex-1 cursor-pointer rounded-xl border px-3 py-2 text-center text-[13px] ${mode === m ? "border-accent bg-accent-soft text-accent" : "border-line"}`}>
            <input type="radio" name="customerMode" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
            {m === "neu" ? "Neuer Kunde aus Lead" : "Bestehender Kunde"}
          </label>
        ))}
      </div>
      {mode === "bestehend" && (
        <select name="customerId" className="input" defaultValue="">
          <option value="">Kunde wählen …</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
