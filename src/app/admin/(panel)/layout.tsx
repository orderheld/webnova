import { sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { Toaster } from "@/components/admin/feedback";
import { Sidebar } from "@/components/admin/sidebar";
import { db, hasDb } from "@/db";
import { addDaysIso, todayIso } from "@/lib/admin/money";
import { FLASH_COOKIE } from "@/lib/admin/flash";
import { getSettings } from "@/lib/admin/settings";
import { requireAdmin } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  if (!hasDb()) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-medium">Datenbank nicht verbunden</h1>
          <p className="mt-3 text-muted">
            Bitte <code>DATABASE_URL</code> (Neon) in Vercel setzen und <code>npm run db:migrate</code> ausführen.
          </p>
        </div>
      </div>
    );
  }
  const today = todayIso();
  const [s, jar] = await Promise.all([getSettings(), cookies()]);
  const horizon = addDaysIso(today, s.subscriptionLeadDays);
  const res = await db().execute<{ new_leads: number; follow_ups: number; open_tasks: number; overdue: number; due_subs: number }>(sql`
    select
      (select count(*)::int from leads where status = 'neu') as new_leads,
      (select count(*)::int from leads where follow_up_at <= ${today} and status not in ('gewonnen','verloren')) as follow_ups,
      (select count(*)::int from project_tasks t join projects p on p.id = t.project_id
         where not t.done and t.due_date <= ${today} and p.status <> 'abgeschlossen') as open_tasks,
      (select count(*)::int from invoices where kind = 'rechnung' and status in ('gesendet','teilbezahlt') and due_date < ${today}) as overdue,
      (select count(*)::int from subscriptions where status = 'aktiv' and next_billing_date <= ${horizon}
         and (end_date is null or next_billing_date <= end_date)) as due_subs
  `);
  const r = res.rows[0];
  return (
    <div className="lg:flex">
      <Sidebar
        user={user}
        counts={{ newLeads: r.new_leads, followUps: r.follow_ups, openTasks: r.open_tasks, overdueInvoices: r.overdue, dueSubscriptions: r.due_subs }}
      />
      <main className="min-w-0 flex-1 px-4 pb-12 pt-6 sm:px-6 lg:px-10 lg:pt-9">
        <div className="mx-auto max-w-[1280px]">{children}</div>
      </main>
      <Toaster flash={jar.get(FLASH_COOKIE)?.value} />
    </div>
  );
}
