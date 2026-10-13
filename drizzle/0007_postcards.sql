CREATE TABLE "postcard_recipients" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"week" text NOT NULL,
	"shab_id" text NOT NULL,
	"uid" text NOT NULL,
	"name" text NOT NULL,
	"legal_form" text NOT NULL,
	"street" text NOT NULL,
	"zip" text NOT NULL,
	"town" text NOT NULL,
	"canton" text NOT NULL,
	"language" text NOT NULL,
	"purpose" text DEFAULT '' NOT NULL,
	"published_on" date NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'offen' NOT NULL,
	"label_printed_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	CONSTRAINT "postcard_recipients_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE INDEX "postcard_recipients_week_idx" ON "postcard_recipients" USING btree ("week","status");