import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { PendingButton } from "@/components/admin/feedback";
import { Icon } from "@/components/admin/icons";
import { Badge, Card, Empty, FilterChips, PageHeader, Stat, Table, btn, btnSm, qs, td } from "@/components/admin/ui";
import { db, schema } from "@/db";
import type { PostcardRecipient } from "@/db/schema";
import { fmtDate } from "@/lib/admin/money";
import { importPostcardsAction, markWeekSentAction, setPostcardStatusAction } from "@/lib/admin/postcard-actions";
import { lastWeek, legalForms, weekLabel } from "@/lib/admin/postcards";

export const metadata = { title: "Postkarten" };
/** «Liste jetzt laden» reads several hundred register entries. */
export const maxDuration = 300;

const langLabel: Record<string, string> = { de: "Deutsch", fr: "Französisch" };

export default async function PostcardsPage({
  searchParams,
}: {
  searchParams: Promise<{ woche?: string; sprache?: string; status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const t = schema.postcardRecipients;
  const weeks = await db()
    .select({
      week: t.week,
      total: sql<number>`count(*)::int`,
      open: sql<number>`count(*) filter (where ${t.status} = 'offen')::int`,
      sent: sql<number>`count(*) filter (where ${t.status} = 'versendet')::int`,
    })
    .from(t)
    .groupBy(t.week)
    .orderBy(desc(t.week));
  const [all] = await db()
    .select({ sent: sql<number>`count(*) filter (where ${t.status} = 'versendet')::int` })
    .from(t);

  const q = sp.q?.trim();
  const week = weeks.find((w) => w.week === sp.woche)?.week ?? weeks[0]?.week;
  const lang = sp.sprache === "de" || sp.sprache === "fr" ? sp.sprache : undefined;
  const status = sp.status === "offen" || sp.status === "versendet" || sp.status === "ausgelassen" ? sp.status : undefined;
  const base = "/admin/postkarten";
  const href = (patch: Record<string, string | undefined>) => qs(base, { woche: week, sprache: lang, status }, patch);

  const rows: PostcardRecipient[] = q
    ? await db()
        .select()
        .from(t)
        .where(or(ilike(t.name, `%${q}%`), ilike(t.town, `%${q}%`), ilike(t.uid, `%${q}%`)))
        .orderBy(desc(t.week), asc(t.name))
        .limit(100)
    : week
      ? await db()
          .select()
          .from(t)
          .where(and(eq(t.week, week), lang ? eq(t.language, lang) : undefined, status ? eq(t.status, status) : undefined))
          .orderBy(asc(t.language), asc(t.zip), asc(t.name))
      : [];

  const current = weeks.find((w) => w.week === week);
  const openByLang = week
    ? await db()
        .select({ language: t.language, n: sql<number>`count(*)::int` })
        .from(t)
        .where(and(eq(t.week, week), eq(t.status, "offen")))
        .groupBy(t.language)
    : [];
  const openCount = (l: string) => openByLang.find((o) => o.language === l)?.n ?? 0;
  const next = lastWeek();
  const hasNext = weeks.some((w) => w.week === next.week);

  return (
    <>
      <PageHeader
        eyebrow="Verkauf"
        title="Postkarten"
        sub="Jeden Montag 100 neu eingetragene Firmen aus dem Handelsamtsblatt, mit Etiketten zum Drucken"
        actions={
          !hasNext && (
            <form action={importPostcardsAction}>
              <PendingButton className={btn.dark}>
                <Icon name="download" className="h-4 w-4" /> Liste {weekLabel(next.week).split(" · ")[0]} laden
              </PendingButton>
            </form>
          )
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Diese Liste" value={String(current?.total ?? 0)} sub={week ? weekLabel(week) : "Noch keine Liste"} icon="list" />
        <Stat label="Noch zu versenden" value={String(current?.open ?? 0)} sub="Status offen" icon="postcard" />
        <Stat label="Versendet (Liste)" value={String(current?.sent ?? 0)} icon="send" tone="ok" />
        <Stat label="Versendet total" value={String(all?.sent ?? 0)} sub={`${weeks.length} ${weeks.length === 1 ? "Liste" : "Listen"}`} icon="check" />
      </div>

      <form action={base} className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Schon angeschrieben? Firma oder Ort"
            className="w-full rounded-full border border-line bg-surface py-2 pl-9 pr-3 text-[16px] outline-none focus:border-accent/50 md:text-[14px]"
          />
        </div>
        {q && (
          <a href={base} className={btnSm.ghost}>
            Suche löschen
          </a>
        )}
      </form>

      {!q && weeks.length > 1 && (
        <div className="mb-3">
          <FilterChips
            active={week}
            href={(v) => qs(base, {}, { woche: v })}
            items={weeks.slice(0, 8).map((w) => [w.week, weekLabel(w.week).split(" · ")[0], w.open] as [string, string, number])}
          />
        </div>
      )}

      {!q && week && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <FilterChips
              active={lang}
              href={(v) => href({ sprache: v })}
              items={[
                [undefined, "Alle Sprachen"],
                ["de", "Deutsch"],
                ["fr", "Französisch"],
              ]}
            />
            <FilterChips
              active={status}
              href={(v) => href({ status: v })}
              items={[
                [undefined, "Alle"],
                ["offen", "Offen"],
                ["versendet", "Versendet"],
                ["ausgelassen", "Ausgelassen"],
              ]}
            />
          </div>

          <Card title="Etiketten drucken" className="mb-5">
            <div className="grid gap-4 md:grid-cols-2">
              {(["de", "fr"] as const).map((l) => (
                <div key={l} className="rounded-xl border border-line p-4">
                  <p className="font-medium">
                    {l === "de" ? "Deutsche Karten" : "Französische Karten"}{" "}
                    <span className="text-muted">· {openCount(l)} offen</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a className={btnSm.dark} href={`/api/admin/postkarten/etiketten?woche=${week}&sprache=${l}&format=rolle`} target="_blank" rel="noopener">
                      <Icon name="printer" className="h-4 w-4" /> Etikettendrucker
                    </a>
                    <a className={btnSm.ghost} href={`/api/admin/postkarten/etiketten?woche=${week}&sprache=${l}&format=a4`} target="_blank" rel="noopener">
                      A4-Bogen
                    </a>
                    {openCount(l) > 0 && (
                      <form action={markWeekSentAction.bind(null, week, l)}>
                        <PendingButton className={btnSm.ghost} confirm={`Alle ${openCount(l)} offenen ${l === "de" ? "deutschen" : "französischen"} Karten als versendet markieren?`}>
                          <Icon name="check" className="h-4 w-4" /> Alle versendet
                        </PendingButton>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[13px] text-muted">
              Etikettendrucker: Brother DK-11209 (62 × 29 mm), im Druckdialog Papier «29 mm × 62 mm» und «Tatsächliche Grösse» wählen. A4-Bogen: 24
              Etiketten 70 × 36 mm (z. B. Avery Zweckform 3475). Gedruckt werden nur offene Firmen, in der Reihenfolge der Liste unten.
            </p>
          </Card>
        </>
      )}

      {rows.length === 0 ? (
        <Empty icon="postcard">
          {q ? "Keine Firma gefunden. Sie hat noch keine Postkarte bekommen." : "Noch keine Liste. Sie kommt jeden Montagmorgen automatisch, oder jetzt oben laden."}
        </Empty>
      ) : (
        <Table head={["Firma", "Adresse", "Sprache", q ? "Liste" : "Eingetragen", "Status", ""]} minWidth={860}>
          {rows.map((r) => (
            <tr key={r.id} className={r.status === "ausgelassen" ? "opacity-55" : ""}>
              <td className={td}>
                <p className="font-medium text-ink">{r.name}</p>
                <p className="line-clamp-1 max-w-[380px] text-[12px] text-muted" title={r.purpose}>
                  {legalForms[r.legalForm] ?? r.legalForm} · {r.purpose}
                </p>
              </td>
              <td className={`${td} whitespace-nowrap text-[13px]`}>
                {r.street}
                <br />
                {r.zip} {r.town}
              </td>
              <td className={`${td} text-[13px]`}>{langLabel[r.language] ?? r.language}</td>
              <td className={`${td} whitespace-nowrap text-[13px] text-muted`}>{q ? weekLabel(r.week).split(" · ")[0] : fmtDate(r.publishedOn)}</td>
              <td className={td}>
                <Badge status={r.status} />
                {r.sentAt && <p className="mt-1 text-[11.5px] text-muted">{fmtDate(r.sentAt)}</p>}
              </td>
              <td className={`${td} text-right`}>
                <div className="flex justify-end gap-1.5">
                  {r.status !== "versendet" && (
                    <form action={setPostcardStatusAction.bind(null, r.id, "versendet")}>
                      <PendingButton className={btnSm.ghost}>Versendet</PendingButton>
                    </form>
                  )}
                  {r.status === "offen" && (
                    <form action={setPostcardStatusAction.bind(null, r.id, "ausgelassen")}>
                      <PendingButton className={btnSm.ghost} title="Keine Karte schicken">
                        Auslassen
                      </PendingButton>
                    </form>
                  )}
                  {r.status !== "offen" && (
                    <form action={setPostcardStatusAction.bind(null, r.id, "offen")}>
                      <PendingButton className={btnSm.ghost}>Rückgängig</PendingButton>
                    </form>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
