import Link from "next/link";
import type { Invoice, Project, Quote, Subscription } from "@/db/schema";
import { creditStatusLabels, intervalLabels, invoiceStatusLabels, projectStatusLabels, quoteStatusLabels, subscriptionStatusLabels } from "@/lib/admin/labels";
import { chf, fmtDate, todayIso } from "@/lib/admin/money";
import { Badge } from "./ui";

const row = "flex items-center justify-between gap-3 py-2.5 hover:opacity-80";

export const invoiceDisplayStatus = (i: Pick<Invoice, "status" | "dueDate" | "kind">, today = todayIso()) =>
  i.kind === "rechnung" && (i.status === "gesendet" || i.status === "teilbezahlt") && i.dueDate < today ? "ueberfaellig" : i.status;

export function InvoiceBadge({ inv }: { inv: Pick<Invoice, "status" | "dueDate" | "kind"> }) {
  const st = invoiceDisplayStatus(inv);
  return <Badge status={st} label={(inv.kind === "gutschrift" ? creditStatusLabels : invoiceStatusLabels)[st]} />;
}

export function QuoteRows({ quotes }: { quotes: Quote[] }) {
  if (!quotes.length) return <p className="text-[14px] text-muted">Keine Offerten.</p>;
  return (
    <ul className="-my-2 divide-y divide-line">
      {quotes.map((q) => (
        <li key={q.id}>
          <Link href={`/admin/offerten/${q.id}`} className={row}>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium">{q.number}</p>
              <p className="truncate text-[12px] text-muted">
                {fmtDate(q.issueDate)} · {q.title}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-[13px] tabular-nums">{chf(q.total)}</span>
              <Badge status={q.status} label={quoteStatusLabels[q.status]} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function InvoiceRows({ invoices }: { invoices: Invoice[] }) {
  if (!invoices.length) return <p className="text-[14px] text-muted">Keine Rechnungen.</p>;
  return (
    <ul className="-my-2 divide-y divide-line">
      {invoices.map((i) => (
        <li key={i.id}>
          <Link href={`/admin/rechnungen/${i.id}`} className={row}>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium">
                {i.number}
                {i.kind === "gutschrift" && <span className="ml-1.5 text-[12px] font-normal text-muted">Gutschrift</span>}
              </p>
              <p className="truncate text-[12px] text-muted">
                {fmtDate(i.issueDate)} · {i.title}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-[13px] tabular-nums">{i.kind === "gutschrift" ? "– " : ""}{chf(i.total)}</span>
              <InvoiceBadge inv={i} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ProjectRows({ projects }: { projects: Project[] }) {
  if (!projects.length) return <p className="text-[14px] text-muted">Keine Projekte.</p>;
  return (
    <ul className="-my-2 divide-y divide-line">
      {projects.map((p) => (
        <li key={p.id}>
          <Link href={`/admin/projekte/${p.id}`} className={row}>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium">{p.name}</p>
              <p className="truncate text-[12px] text-muted">
                Start {fmtDate(p.startDate)}
                {p.dueDate ? ` · Termin ${fmtDate(p.dueDate)}` : ""}
              </p>
            </div>
            <Badge status={p.status} label={projectStatusLabels[p.status]} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SubscriptionRows({ subs }: { subs: Subscription[] }) {
  if (!subs.length) return <p className="text-[14px] text-muted">Keine Abos.</p>;
  return (
    <ul className="-my-2 divide-y divide-line">
      {subs.map((s) => (
        <li key={s.id}>
          <Link href={`/admin/abos/${s.id}`} className={row}>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium">{s.title}</p>
              <p className="truncate text-[12px] text-muted">
                CHF {chf(s.amount)} {intervalLabels[s.interval]} · nächste Verrechnung {fmtDate(s.nextBillingDate)}
              </p>
            </div>
            <Badge status={s.status} label={subscriptionStatusLabels[s.status]} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
