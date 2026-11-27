-- Higher number ranges (2026-11-27): customers 24316 + id, projects PR-(3482 + id), documents from 2417 per year.
-- Issued documents must stay unchanged (OR 957a/958f, GeBüV, MWSTG): they keep their number and the
-- customer number they were printed with. Only drafts move to the new range.
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "customer_number" text;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "customer_number" text;--> statement-breakpoint
UPDATE "invoices" SET "customer_number" = (10000 + "customer_id")::text
  WHERE "customer_number" IS NULL AND ("status" <> 'entwurf' OR "sent_at" IS NOT NULL);--> statement-breakpoint
UPDATE "quotes" SET "customer_number" = (10000 + "customer_id")::text
  WHERE "customer_number" IS NULL AND ("status" <> 'entwurf' OR "sent_at" IS NOT NULL);--> statement-breakpoint
WITH d AS (
  SELECT "id", substring("number" from '^(.*-)\d+$') AS base,
         row_number() OVER (PARTITION BY substring("number" from '^(.*-)\d+$') ORDER BY "id") AS rn
  FROM "invoices"
  WHERE "status" = 'entwurf' AND "sent_at" IS NULL AND "number" ~ '-\d+$' AND substring("number" from '(\d+)$')::int < 2417
)
UPDATE "invoices" i SET "number" = d.base || (
  GREATEST(2416, (SELECT max(substring(x."number" from '(\d+)$')::int) FROM "invoices" x WHERE x."number" LIKE d.base || '%')) + d.rn
)::text
FROM d WHERE i."id" = d."id";--> statement-breakpoint
WITH d AS (
  SELECT "id", substring("number" from '^(.*-)\d+$') AS base,
         row_number() OVER (PARTITION BY substring("number" from '^(.*-)\d+$') ORDER BY "id") AS rn
  FROM "quotes"
  WHERE "status" = 'entwurf' AND "sent_at" IS NULL AND "number" ~ '-\d+$' AND substring("number" from '(\d+)$')::int < 2417
)
UPDATE "quotes" q SET "number" = d.base || (
  GREATEST(2416, (SELECT max(substring(x."number" from '(\d+)$')::int) FROM "quotes" x WHERE x."number" LIKE d.base || '%')) + d.rn
)::text
FROM d WHERE q."id" = d."id";
