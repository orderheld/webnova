import { count, eq } from "drizzle-orm";
import { Sidebar } from "@/components/admin/sidebar";
import { db, hasDb, schema } from "@/db";
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
  const [{ n }] = await db().select({ n: count() }).from(schema.leads).where(eq(schema.leads.status, "neu"));
  return (
    <div className="lg:flex">
      <Sidebar newLeads={n} user={user} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-[1200px]">{children}</div>
      </main>
    </div>
  );
}
