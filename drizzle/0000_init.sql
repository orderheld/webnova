CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"company" text,
	"first_name" text,
	"last_name" text,
	"email" text,
	"phone" text,
	"street" text,
	"zip" text,
	"city" text,
	"country" text DEFAULT 'CH' NOT NULL,
	"language" text DEFAULT 'de' NOT NULL,
	"website" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "estimates" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"customer_id" integer,
	"lead_id" integer,
	"data" jsonb NOT NULL,
	"total_hours" numeric(8, 2) DEFAULT 0 NOT NULL,
	"total" numeric(12, 2) DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"customer_id" integer NOT NULL,
	"quote_id" integer,
	"title" text NOT NULL,
	"intro" text,
	"outro" text,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"discount_percent" numeric(5, 2) DEFAULT 0 NOT NULL,
	"vat_rate" numeric(5, 2) DEFAULT 0 NOT NULL,
	"total" numeric(12, 2) DEFAULT 0 NOT NULL,
	"issue_date" date NOT NULL,
	"due_date" date NOT NULL,
	"status" text DEFAULT 'entwurf' NOT NULL,
	"sent_at" timestamp with time zone,
	"paid_at" date,
	CONSTRAINT "invoices_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"source" text DEFAULT 'anfrage' NOT NULL,
	"locale" text DEFAULT 'de' NOT NULL,
	"name" text NOT NULL,
	"company" text,
	"email" text NOT NULL,
	"phone" text,
	"preferred_contact" text,
	"services" text[] DEFAULT '{}' NOT NULL,
	"has_website" boolean,
	"website_url" text,
	"company_size" text,
	"industry" text,
	"budget" text,
	"timeline" text,
	"message" text,
	"page_url" text,
	"status" text DEFAULT 'neu' NOT NULL,
	"notes" text,
	"customer_id" integer
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"customer_id" integer NOT NULL,
	"title" text NOT NULL,
	"intro" text,
	"outro" text,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"discount_percent" numeric(5, 2) DEFAULT 0 NOT NULL,
	"vat_rate" numeric(5, 2) DEFAULT 0 NOT NULL,
	"total" numeric(12, 2) DEFAULT 0 NOT NULL,
	"issue_date" date NOT NULL,
	"valid_until" date,
	"status" text DEFAULT 'entwurf' NOT NULL,
	"sent_at" timestamp with time zone,
	CONSTRAINT "quotes_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;