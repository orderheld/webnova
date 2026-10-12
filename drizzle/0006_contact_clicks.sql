CREATE TABLE "contact_clicks" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"path" text NOT NULL,
	"channel" text NOT NULL,
	"visitor" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "contact_clicks_created_idx" ON "contact_clicks" USING btree ("created_at");