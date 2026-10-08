CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"type" text DEFAULT 'notiz' NOT NULL,
	"body" text NOT NULL,
	"lead_id" integer,
	"customer_id" integer,
	"project_id" integer
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"customer_id" integer NOT NULL,
	"first_name" text,
	"last_name" text,
	"role" text,
	"email" text,
	"phone" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"date" date NOT NULL,
	"category" text DEFAULT 'diverses' NOT NULL,
	"description" text NOT NULL,
	"supplier" text,
	"amount" numeric(12, 2) NOT NULL,
	"vat_amount" numeric(12, 2) DEFAULT 0 NOT NULL,
	"customer_id" integer,
	"project_id" integer,
	"receipt_url" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "invoice_reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"invoice_id" integer NOT NULL,
	"level" integer NOT NULL,
	"date" date NOT NULL,
	"due_date" date NOT NULL,
	"fee" numeric(12, 2) DEFAULT 0 NOT NULL,
	"sent_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"invoice_id" integer NOT NULL,
	"date" date NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"method" text DEFAULT 'bank' NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text,
	"unit" text DEFAULT 'Pauschal' NOT NULL,
	"price" numeric(12, 2) DEFAULT 0 NOT NULL,
	"interval" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"project_id" integer NOT NULL,
	"title" text NOT NULL,
	"notes" text,
	"due_date" date,
	"milestone" boolean DEFAULT false NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"done_at" timestamp with time zone,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"tasks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"product_ids" integer[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"customer_id" integer NOT NULL,
	"quote_id" integer,
	"lead_id" integer,
	"status" text DEFAULT 'planung' NOT NULL,
	"start_date" date,
	"due_date" date,
	"live_date" date,
	"budget" numeric(12, 2),
	"hourly_rate" numeric(8, 2),
	"description" text,
	"notes" text,
	"links" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"customer_id" integer NOT NULL,
	"project_id" integer,
	"quote_id" integer,
	"product_id" integer,
	"category" text DEFAULT 'hosting' NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"amount" numeric(12, 2) NOT NULL,
	"interval" text DEFAULT 'jahr' NOT NULL,
	"start_date" date NOT NULL,
	"first_year_included" boolean DEFAULT false NOT NULL,
	"next_billing_date" date NOT NULL,
	"end_date" date,
	"status" text DEFAULT 'aktiv' NOT NULL,
	"last_invoice_id" integer,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "time_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"project_id" integer NOT NULL,
	"date" date NOT NULL,
	"hours" numeric(6, 2) NOT NULL,
	"rate" numeric(8, 2) DEFAULT 0 NOT NULL,
	"description" text NOT NULL,
	"billable" boolean DEFAULT true NOT NULL,
	"invoice_id" integer
);
--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "industry" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "vat_number" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "kind" text DEFAULT 'rechnung' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "credit_for_id" integer;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "project_id" integer;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "paid_amount" numeric(12, 2) DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "reminder_level" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "street" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "zip" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "website_rating" integer;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "website_notes" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "value" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "follow_up_at" date;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "lost_reason" text;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "lead_id" integer;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "project_id" integer;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_reminders" ADD CONSTRAINT "invoice_reminders_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_last_invoice_id_invoices_id_fk" FOREIGN KEY ("last_invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activities_lead_idx" ON "activities" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "activities_customer_idx" ON "activities" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "activities_project_idx" ON "activities" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "contacts_customer_idx" ON "contacts" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "expenses_date_idx" ON "expenses" USING btree ("date");--> statement-breakpoint
CREATE INDEX "invoice_reminders_invoice_idx" ON "invoice_reminders" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "payments_invoice_idx" ON "payments" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "payments_date_idx" ON "payments" USING btree ("date");--> statement-breakpoint
CREATE INDEX "project_tasks_project_idx" ON "project_tasks" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "subscriptions_customer_idx" ON "subscriptions" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "subscriptions_next_idx" ON "subscriptions" USING btree ("next_billing_date");--> statement-breakpoint
CREATE INDEX "time_entries_project_idx" ON "time_entries" USING btree ("project_id");--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_credit_for_id_invoices_id_fk" FOREIGN KEY ("credit_for_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
-- Backfill: invoices already marked as paid get one payment row so the payment ledger and paid_amount match.
INSERT INTO "payments" ("invoice_id", "date", "amount", "method", "note")
SELECT "id", COALESCE("paid_at", "issue_date"), "total", 'bank', 'Übernommen aus bisherigem Status'
FROM "invoices" WHERE "status" = 'bezahlt';--> statement-breakpoint
UPDATE "invoices" SET "paid_amount" = "total" WHERE "status" = 'bezahlt';--> statement-breakpoint
-- Starter catalogue (example prices, editable under Leistungen).
INSERT INTO "products" ("name", "description", "category", "unit", "price", "interval", "sort_order")
SELECT v.name, v.description, v.category, v.unit, v.price, v.interval, v.sort_order
FROM (VALUES
  ('Webseite KMU', 'Konzept, Design und Umsetzung inkl. Kontaktformular, Onpage-SEO und Go-live', 'Webdesign', 'Pauschal', 3900::numeric, NULL::text, 10),
  ('Onepager', 'Einseitige Webseite inkl. Kontaktformular', 'Webdesign', 'Pauschal', 1900::numeric, NULL::text, 20),
  ('Onlineshop Grundpaket', 'Shop-Setup, Design, Zahlungsarten (TWINT, Karte), Versand und Rechtstexte', 'Onlineshop', 'Pauschal', 6900::numeric, NULL::text, 30),
  ('Kassensystem Einrichtung', 'Einrichtung, Artikelstamm, Zahlungsterminal und Schulung', 'Kassensystem', 'Pauschal', 1500::numeric, NULL::text, 40),
  ('Logo & Branding', 'Logo, Farben, Schriften und Kurz-Styleguide', 'Branding', 'Pauschal', 1200::numeric, NULL::text, 50),
  ('Zusätzliche Unterseite', NULL, 'Webdesign', 'Stk.', 250::numeric, NULL::text, 60),
  ('Texte schreiben', 'Pro Seite', 'Inhalte', 'Seiten', 150::numeric, NULL::text, 70),
  ('Arbeitsstunde', 'Aufwand nach Stunden', 'Dienstleistung', 'Std.', 120::numeric, NULL::text, 80),
  ('Hosting & SSL', 'Schweizer Hosting, SSL-Zertifikat, tägliche Backups', 'Hosting', 'Jahr', 240::numeric, 'jahr', 100),
  ('Domain .ch', 'Registrierung und Verwaltung', 'Domain', 'Jahr', 25::numeric, 'jahr', 110),
  ('Wartung & Updates', 'Updates, Sicherheit, kleine Anpassungen', 'Wartung', 'Monat', 49::numeric, 'monat', 120),
  ('SEO-Betreuung', 'Laufende Optimierung und monatlicher Bericht', 'SEO', 'Monat', 290::numeric, 'monat', 130),
  ('E-Mail-Postfach', 'Pro Postfach', 'Hosting', 'Jahr', 60::numeric, 'jahr', 140),
  ('Kassensystem-Lizenz', 'Software-Lizenz und Support', 'Lizenz', 'Monat', 69::numeric, 'monat', 150)
) AS v(name, description, category, unit, price, interval, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM "products");--> statement-breakpoint
INSERT INTO "project_templates" ("name", "description", "tasks", "product_ids")
SELECT v.name, v.description, v.tasks::jsonb,
  ARRAY(SELECT p."id" FROM "products" p WHERE p."name" = ANY(v.products) ORDER BY p."sort_order")
FROM (VALUES
  ('Webseite KMU', 'Klassische KMU-Webseite mit 5 bis 10 Seiten', '[
    {"title":"Kick-off & Briefing","offsetDays":0},
    {"title":"Inhalte und Bilder beim Kunden einholen","offsetDays":3},
    {"title":"Sitemap & Wireframes","offsetDays":7},
    {"title":"Designentwurf Startseite","offsetDays":14},
    {"title":"Design-Freigabe durch Kunde","offsetDays":17,"milestone":true},
    {"title":"Unterseiten gestalten","offsetDays":21},
    {"title":"Entwicklung & CMS","offsetDays":28},
    {"title":"Inhalte einpflegen","offsetDays":35},
    {"title":"SEO-Grundlagen (Meta, Sitemap, Schema)","offsetDays":38},
    {"title":"Testing Browser & Mobile","offsetDays":40},
    {"title":"Review mit Kunde","offsetDays":42,"milestone":true},
    {"title":"Go-live & DNS","offsetDays":45,"milestone":true},
    {"title":"Google Unternehmensprofil & Search Console","offsetDays":47},
    {"title":"Schulung & Übergabe","offsetDays":49}
  ]', ARRAY['Webseite KMU','Hosting & SSL','Domain .ch','Wartung & Updates']),
  ('Onlineshop', 'Onlineshop mit Zahlungsarten und Versand', '[
    {"title":"Kick-off & Briefing","offsetDays":0},
    {"title":"Produktdaten und Bilder einholen","offsetDays":5},
    {"title":"Shop-Konzept, Zahlungsarten und Versand klären","offsetDays":7},
    {"title":"Design","offsetDays":14},
    {"title":"Design-Freigabe durch Kunde","offsetDays":18,"milestone":true},
    {"title":"Shop-Setup & Entwicklung","offsetDays":25},
    {"title":"Produkte erfassen","offsetDays":35},
    {"title":"Zahlungen (TWINT, Karte) einrichten","offsetDays":38},
    {"title":"Versand, MWST und Rechtstexte","offsetDays":40},
    {"title":"Testbestellungen","offsetDays":45},
    {"title":"Go-live","offsetDays":50,"milestone":true},
    {"title":"Schulung & Übergabe","offsetDays":52}
  ]', ARRAY['Onlineshop Grundpaket','Hosting & SSL','Domain .ch','Wartung & Updates']),
  ('Kassensystem', 'Einrichtung eines Kassensystems für Gastro oder Detailhandel', '[
    {"title":"Bedarfsanalyse vor Ort","offsetDays":0},
    {"title":"Hardware bestellen","offsetDays":2},
    {"title":"Artikel und Preise erfassen","offsetDays":7},
    {"title":"Kasse und Zahlungsterminal einrichten","offsetDays":10},
    {"title":"Schulung Personal","offsetDays":12},
    {"title":"Go-live Begleitung","offsetDays":14,"milestone":true}
  ]', ARRAY['Kassensystem Einrichtung','Kassensystem-Lizenz'])
) AS v(name, description, tasks, products)
WHERE NOT EXISTS (SELECT 1 FROM "project_templates");
