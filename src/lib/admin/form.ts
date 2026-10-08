import { z } from "zod";

/** Result shape shared by all form actions used with <ActionForm>. */
export interface FormState {
  ok?: boolean;
  error?: string;
  message?: string;
}

/** FormData to a plain object; repeated keys become arrays, checkboxes become "on". */
export function formObject(fd: FormData): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v !== "string" || k.startsWith("$ACTION")) continue;
    const prev = out[k];
    if (prev === undefined) out[k] = v;
    else out[k] = Array.isArray(prev) ? [...prev, v] : [prev, v];
  }
  return out;
}

/** Parses FormData with a zod schema and returns either the data or a German error message. */
export function parseForm<T extends z.ZodType>(schema: T, fd: FormData): { data: z.infer<T>; error?: undefined } | { data?: undefined; error: string } {
  const r = schema.safeParse(formObject(fd));
  if (r.success) return { data: r.data };
  const issue = r.error.issues[0];
  const field = issue?.path.join(".");
  return { error: `Bitte Eingaben prüfen${field ? ` (${fieldLabels[field] ?? field})` : ""}.` };
}

const fieldLabels: Record<string, string> = {
  name: "Name",
  title: "Titel",
  body: "Text",
  email: "E-Mail",
  amount: "Betrag",
  date: "Datum",
  hours: "Stunden",
  description: "Beschreibung",
  customerId: "Kunde",
  projectId: "Projekt",
  startDate: "Startdatum",
  nextBillingDate: "Nächste Verrechnung",
  url: "Link",
  price: "Preis",
};

/* Reusable field schemas (FormData values are always strings). */
export const zText = (max = 4000) => z.string().trim().max(max).default("");
export const zReq = (max = 300) => z.string().trim().min(1).max(max);
export const zOptText = (max = 4000) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));
export const zDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const zOptDate = z
  .string()
  .optional()
  .transform((v) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null));
export const zNum = z.preprocess((v) => (typeof v === "string" ? v.replace(/['\s]/g, "").replace(",", ".") : v), z.coerce.number().finite());
export const zOptNum = z
  .string()
  .optional()
  .transform((v) => {
    const s = (v ?? "").replace(/['\s]/g, "").replace(",", ".");
    if (s === "") return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  });
export const zOptId = z
  .string()
  .optional()
  .transform((v) => {
    const n = Number(v);
    return v && Number.isInteger(n) && n > 0 ? n : null;
  });
export const zId = z.coerce.number().int().positive();
export const zBool = z
  .string()
  .optional()
  .transform((v) => v === "on" || v === "true" || v === "1");
export const zUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((v) => {
    if (!v) return null;
    return /^[a-z]+:\/\//i.test(v) || v.startsWith("mailto:") ? v : `https://${v}`;
  });

export const isId = (n: number) => Number.isInteger(n) && n > 0;
