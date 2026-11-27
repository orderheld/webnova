-- Date or period of the service on invoices (Art. 26 MWSTG), e.g. «November 2026». Optional, printed on the PDF when set.
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "service_period" text;
