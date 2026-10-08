import Link from "next/link";
import type { Customer } from "@/db/schema";
import { chf, fmtDate } from "@/lib/admin/money";
import { customerName } from "@/lib/admin/queries";
import { Badge, Empty, Table, td, tdNum, type SortSpec } from "./ui";

export interface DocRow {
  id: number;
  number: string;
  title: string;
  customer: Customer;
  date: string;
  second: string | null;
  total: number;
  open?: number;
  status: string;
  statusLabel: string;
  note?: string;
  negative?: boolean;
}

export function DocTable({
  base,
  rows,
  secondLabel,
  sort,
  href,
  showOpen = false,
  empty,
}: {
  base: string;
  rows: DocRow[];
  secondLabel: string;
  sort?: SortSpec;
  href?: (k: string, d: "asc" | "desc") => string;
  showOpen?: boolean;
  empty?: React.ReactNode;
}) {
  if (rows.length === 0) return <Empty>{empty ?? "Noch nichts vorhanden."}</Empty>;
  const head = [
    { label: "Nummer", key: "nummer" },
    { label: "Kunde", key: "kunde" },
    { label: "Titel" },
    { label: "Datum", key: "datum" },
    { label: secondLabel, key: "faellig" },
    { label: "Total CHF", key: "total", align: "right" as const },
    ...(showOpen ? [{ label: "Offen CHF", align: "right" as const }] : []),
    { label: "Status" },
  ];
  return (
    <Table minWidth={860} head={head} sort={sort} href={href}>
      {rows.map((r) => (
        <tr key={r.id} className="hover:bg-bg/60">
          <td className={`${td} whitespace-nowrap font-medium`}>
            <Link href={`${base}/${r.id}`} className="hover:text-accent">
              {r.number}
            </Link>
            {r.note && <p className="text-[11.5px] font-normal text-muted">{r.note}</p>}
          </td>
          <td className={td}>
            <Link href={`/admin/kunden/${r.customer.id}`} className="hover:text-accent">
              {customerName(r.customer)}
            </Link>
          </td>
          <td className={`${td} max-w-[260px] truncate text-ink-soft`}>{r.title}</td>
          <td className={`${td} whitespace-nowrap text-muted`}>{fmtDate(r.date)}</td>
          <td className={`${td} whitespace-nowrap ${r.status === "ueberfaellig" ? "font-medium text-danger" : "text-muted"}`}>{fmtDate(r.second)}</td>
          <td className={tdNum}>
            {r.negative ? "– " : ""}
            {chf(r.total)}
          </td>
          {showOpen && <td className={tdNum}>{r.open ? chf(r.open) : "–"}</td>}
          <td className={td}>
            <Badge status={r.status} label={r.statusLabel} />
          </td>
        </tr>
      ))}
    </Table>
  );
}
