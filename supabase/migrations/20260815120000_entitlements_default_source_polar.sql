-- Lemon Squeezy is gone: its webhook function and config entry were removed,
-- and polar-webhook is now the only writer to this table. The column default
-- still named the retired processor, so any insert that omitted `source`
-- would have mislabelled a Polar sale as a Lemon Squeezy one.
--
-- polar-webhook always sets `source` explicitly, so this default is a safety
-- net rather than the live path — but it should name the processor that is
-- actually in use.
--
-- Existing rows are deliberately left alone. The one row still recording
-- source = 'lemonsqueezy' is a July 2026 test purchase and is accurate
-- history; it should be deleted as test data, not rewritten as Polar.

ALTER TABLE public.entitlements
    ALTER COLUMN source SET DEFAULT 'polar';

COMMENT ON COLUMN public.entitlements.source IS
    'Payment processor that produced this entitlement. Currently always ''polar'' — ''lemonsqueezy'' appears only on pre-August-2026 test rows.';
