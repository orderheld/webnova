CREATE TABLE "lead_spam" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"form" text NOT NULL,
	"score" integer NOT NULL,
	"reasons" text[] DEFAULT '{}' NOT NULL,
	"visitor" text,
	"name" text NOT NULL,
	"email" text,
	"message" text,
	"row" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "ip_hash" text;--> statement-breakpoint
CREATE INDEX "lead_spam_created_idx" ON "lead_spam" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "lead_spam_visitor_idx" ON "lead_spam" USING btree ("visitor");