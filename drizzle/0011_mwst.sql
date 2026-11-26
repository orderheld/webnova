-- Webnova is MWST-registered since 2026-11: switch MWST on in the stored company settings.
-- Only the settings change; quotes and invoices keep their own vat_rate, so issued documents stay as they are.
UPDATE "settings" SET "value" = "value" || '{"vatEnabled": true, "vatRate": 8.1, "vatNumber": "CHE-439.891.660 MWST"}'::jsonb WHERE "key" = 'company';
