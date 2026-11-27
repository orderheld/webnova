-- Optional department / address addition for customers (e.g. «Buchhaltung»), printed below the company name on PDFs.
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "address_addition" text;
