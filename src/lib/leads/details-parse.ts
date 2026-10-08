import { z } from "zod";
import type { LeadDetails } from "@/db/schema";
import { type ServiceKey, serviceQuestions } from "./details";

/** Server-side validation: only known services, questions and option values survive. */
export function parseDetails(raw: unknown, services: readonly string[]): LeadDetails | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Record<string, unknown>;
  const out: LeadDetails = {};
  for (const s of services) {
    const def = serviceQuestions[s as ServiceKey];
    const answers = input[s];
    if (!def || !answers || typeof answers !== "object") continue;
    const clean: Record<string, string | string[]> = {};
    for (const q of def.questions) {
      if ("url" in q && q.url) continue;
      const a = (answers as Record<string, unknown>)[q.key];
      if (q.type === "single") {
        const r = z.enum(q.options.map((o) => o.v) as [string, ...string[]]).safeParse(a);
        if (r.success) clean[q.key] = r.data;
      } else if (q.type === "multi") {
        const r = z.array(z.enum(q.options.map((o) => o.v) as [string, ...string[]])).max(q.options.length).safeParse(a);
        if (r.success && r.data.length) clean[q.key] = [...new Set(r.data)];
      } else {
        const r = z.string().trim().max(q.type === "textarea" ? 2000 : 300).safeParse(a);
        if (r.success && r.data) clean[q.key] = r.data;
      }
    }
    if (Object.keys(clean).length) out[s] = clean;
  }
  const g = input.general as Record<string, unknown> | undefined;
  const deadline = z.string().trim().max(200).safeParse(g?.deadline);
  if (deadline.success && deadline.data) out.general = { deadline: deadline.data };
  return Object.keys(out).length ? out : null;
}
