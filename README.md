# webnova.ch

Agentur-Website und Admin-Panel von Webnova (Grenchen). Next.js 16 (App Router), Tailwind CSS 4,
Neon Postgres (Drizzle ORM), Resend, Deployment auf Vercel.

## Was drin ist

**Öffentliche Website (DE `/de`, FR `/fr`)**
- Startseite, 10 Leistungsseiten (inkl. Kassensystem Gastro/Retail), Leistungsübersicht
- 14 Standortseiten (`/de/webdesign-biel`, `/fr/creation-site-internet-bienne`, …) und 4 lokale SEO-Seiten
- Ratgeber (3 Artikel), Über uns, Kontakt, Impressum, Datenschutz
- Mehrstufiger Anfrage-Funnel (`/de/anfrage`) ohne Preisrechner, Danke-Seite
- Landingpages für Ads ohne Navigation (`/de/lp/neue-webseite`, `/de/lp/kassensystem`), `noindex`
- SEO: hreflang, Canonicals, Sitemap, robots, Schema.org (ProfessionalService, Service, FAQ, Breadcrumb, Article),
  OG-Bilder, 301-Weiterleitungen der alten WordPress-URLs
- SEO-Strategie und Keyword-Plan: [`docs/seo-strategie.md`](docs/seo-strategie.md)

**Admin-Panel (`/admin`)**
- Anfragen-Inbox mit Status, Notizen, «Als Kunde anlegen»
- Kundenverwaltung
- Offerten und Rechnungen mit Positionen, Rabatt, MWST, PDF-Export und Versand per E-Mail (Resend)
- Rechnungen mit Schweizer QR-Einzahlungsschein, manuell «bezahlt» markieren, stornieren
- Interner Kostenrechner mit Checkliste (Stundensatz, Reserve), daraus direkt eine Offerte erstellen
- Einstellungen: Firmendaten, IBAN, MWST, Nummernkreise, Textvorlagen

Texte bearbeiten: `src/content/` (Leistungen, Städte, Ratgeber, Rechtliches) und `src/i18n/dict.ts` (UI-Texte).
Rechner-Checkliste anpassen: `src/lib/admin/calculator.ts`.

## Einrichtung

1. Vercel-Projekt mit diesem Repo verbinden.
2. Neon-Datenbank anlegen (Vercel → Storage → Neon), `DATABASE_URL` wird gesetzt.
3. Resend: Domain `webnova.ch` verifizieren (DNS-Einträge), API-Key erstellen.
4. Umgebungsvariablen aus `.env.example` in Vercel eintragen.
5. Die Datenbank-Tabellen werden bei jedem Deploy automatisch angelegt bzw. aktualisiert
   (`scripts/migrate.mjs` läuft vor `next build`, sobald `DATABASE_URL` gesetzt ist).
6. Logo: die aktuelle Logo-Datei als `public/logo.png` ablegen (wird automatisch statt der Wortmarke verwendet).
7. In `/admin/einstellungen` IBAN, MWST-Status und Texte prüfen.

## Entwicklung

```bash
npm install
cp .env.example .env.local   # Werte ausfüllen
npm run db:migrate
npm run dev
```

Schema ändern: `src/db/schema.ts` anpassen, dann `npm run db:generate` und `npm run db:migrate`.
