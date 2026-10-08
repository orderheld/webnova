CREATE TABLE "page_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"path" text NOT NULL,
	"source" text,
	"device" text NOT NULL,
	"country" text,
	"region" text,
	"visitor" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visitor_salts" (
	"day" date PRIMARY KEY NOT NULL,
	"salt" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "page_views_created_idx" ON "page_views" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "page_views_visitor_idx" ON "page_views" USING btree ("visitor","created_at");