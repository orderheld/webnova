CREATE TABLE "preview_chunks" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_id" integer NOT NULL,
	"seq" integer NOT NULL,
	"data" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preview_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"preview_id" integer NOT NULL,
	"kind" text DEFAULT 'site' NOT NULL,
	"version" integer NOT NULL,
	"path" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"chunk_count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "previews" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"token" text NOT NULL,
	"title" text NOT NULL,
	"customer_id" integer,
	"contact_name" text DEFAULT '' NOT NULL,
	"contact_email" text DEFAULT '' NOT NULL,
	"contact_phone" text DEFAULT '' NOT NULL,
	"language" text DEFAULT 'de' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"file_count" integer DEFAULT 0 NOT NULL,
	"total_bytes" integer DEFAULT 0 NOT NULL,
	"pdf_file_id" integer,
	"views" integer DEFAULT 0 NOT NULL,
	"first_viewed_at" timestamp with time zone,
	"last_viewed_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"sent_to" text,
	CONSTRAINT "previews_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "preview_chunks" ADD CONSTRAINT "preview_chunks_file_id_preview_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."preview_files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preview_files" ADD CONSTRAINT "preview_files_preview_id_previews_id_fk" FOREIGN KEY ("preview_id") REFERENCES "public"."previews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "previews" ADD CONSTRAINT "previews_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "preview_chunks_seq_idx" ON "preview_chunks" USING btree ("file_id","seq");--> statement-breakpoint
CREATE UNIQUE INDEX "preview_files_path_idx" ON "preview_files" USING btree ("preview_id","kind","version","path");