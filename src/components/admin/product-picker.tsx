"use client";

/** Select that copies a catalogue product into the surrounding form (fields marked with data-pick). */
export function ProductPicker({
  products,
}: {
  products: { id: number; name: string; price: number; interval: string | null; description: string | null; category: string | null }[];
}) {
  return (
    <label className="block rounded-xl bg-accent-soft/60 p-3">
      <span className="mb-1 block text-[12.5px] font-medium text-accent">Aus Leistungen übernehmen</span>
      <select
        className="input"
        defaultValue=""
        onChange={(e) => {
          const p = products.find((x) => x.id === Number(e.target.value));
          const form = e.currentTarget.form;
          if (!p || !form) return;
          const set = (key: string, value: string) => {
            const el = form.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-pick="${key}"]`);
            if (el) el.value = value;
          };
          const t = `${p.category ?? ""} ${p.name}`.toLowerCase();
          const cat = t.includes("domain")
            ? "domain"
            : t.includes("wartung")
              ? "wartung"
              : t.includes("seo")
                ? "seo"
                : t.includes("lizenz") || t.includes("kasse")
                  ? "lizenz"
                  : t.includes("host") || t.includes("mail")
                    ? "hosting"
                    : "andere";
          set("id", String(p.id));
          set("name", p.name);
          set("price", String(p.price));
          set("description", p.description ?? "");
          set("category", cat);
          if (p.interval) set("interval", p.interval);
        }}
      >
        <option value="">Leistung wählen …</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} · CHF {p.price}
          </option>
        ))}
      </select>
    </label>
  );
}
