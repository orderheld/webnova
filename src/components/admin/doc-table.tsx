import Link from "next/link";
import type { Customer } from "@/db/schema";
import { chf, fmtDate } from "@/lib/admin/money";
import { customerName } from "@/lib/admin/queries";
import { Badge, Empty, Table } from "./ui";

export function DocTable({
  base,
  statuses,
  filter,
  rows,
  secondLabel,
}: {
  base: string;
  statuses: readonly string[];
  filter?: string;
  rows: { id: number; number: string; title: string; customer: Customer; date: string; second: string | null; total: number; status: string }[];
  secondLabel: string;
}) {
  const sum = rows.reduce((s, r) => s + r.total, 0);
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {[undefined, ...statuses].map((s) => (
          <Link
            key={s ?? "alle"}
            href={s ? `${base}?status=${s}` : base}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] capitalize ${filter === s ? "border-ink bg-ink text-white" : "border-line bg-surface hover:border-ink"}`}
          >
            {s ?? "Alle"}
          </Link>
        ))}
        <span className="ml-auto text-[13px] text-muted">
          {rows.length} Dokumente · CHF {chf(sum)}
        </span>
      </div>
      {rows.length === 0 ? (
        <Empty>Noch nichts vorhanden.</Empty>
      ) : (
        <Table head={["Nummer", "Kunde", "Titel", "Datum", secondLabel, "Total CHF", "Status"]}>
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-bg/60">
              <td className="whitespace-nowrap px-4 py-3 font-medium">
                <Link href={`${base}/${r.id}`} className="hover:text-accent">
                  {r.number}
                </Link>
              </td>
              <td className="px-4 py-3">{customerName(r.customer)}</td>
              <td className="max-w-[260px] truncate px-4 py-3 text-ink-soft">{r.title}</td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{fmtDate(r.date)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{fmtDate(r.second)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{chf(r.total)}</td>
              <td className="px-4 py-3">
                <Badge status={r.status} />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
