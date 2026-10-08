import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/admin/login-form";
import { ADMIN_MANIFEST } from "@/lib/admin/app";

export const metadata = { title: "Login", manifest: ADMIN_MANIFEST };

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden bg-night p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="self-start">
          <Logo tone="light" className="h-7" />
        </div>
        <div className="max-w-md">
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-accent-light">Webnova Admin</p>
          <p className="mt-4 font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em]">Anfragen, Projekte und Finanzen an einem Ort.</p>
          <p className="mt-4 text-[15px] leading-relaxed text-white/65">Leads, Offerten, Rechnungen mit QR-Einzahlungsschein, Abos und Zeiterfassung für webnova solutions.</p>
        </div>
        <p className="text-[12.5px] text-white/45">Interner Bereich. Zugang nur für berechtigte Personen.</p>
      </aside>
      <main className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 lg:hidden">
            <Logo tone="dark" className="h-7" />
          </div>
          <h1 className="font-display text-[28px] font-semibold tracking-[-0.02em] text-ink">Anmelden</h1>
          <p className="mb-7 mt-1.5 text-[14.5px] text-muted">Melden Sie sich mit Ihrem Admin-Zugang an.</p>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
