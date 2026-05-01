-- ============================================================
-- 1. CLASS_CODE: unique short code per class
-- ============================================================

-- Function to generate a readable class code (KAF-XXXXX, no O/0/I/1)
CREATE OR REPLACE FUNCTION public.generate_class_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text;
  i int;
  attempts int := 0;
  exists_already boolean;
BEGIN
  LOOP
    result := 'KAF-';
    FOR i IN 1..5 LOOP
      result := result || substr(alphabet, floor(random() * length(alphabet))::int + 1, 1);
    END LOOP;
    SELECT EXISTS(SELECT 1 FROM public.class_registrations WHERE class_code = result)
      INTO exists_already;
    EXIT WHEN NOT exists_already;
    attempts := attempts + 1;
    IF attempts > 50 THEN RAISE EXCEPTION 'Could not generate unique class code'; END IF;
  END LOOP;
  RETURN result;
END;
$$;

-- Add column (nullable first so we can backfill)
ALTER TABLE public.class_registrations
  ADD COLUMN IF NOT EXISTS class_code text;

-- Backfill existing rows
UPDATE public.class_registrations
SET class_code = public.generate_class_code()
WHERE class_code IS NULL;

-- Now enforce NOT NULL + UNIQUE
ALTER TABLE public.class_registrations
  ALTER COLUMN class_code SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS class_registrations_class_code_key
  ON public.class_registrations (class_code);

-- Trigger to auto-assign class_code on insert
CREATE OR REPLACE FUNCTION public.set_class_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.class_code IS NULL THEN
    NEW.class_code := public.generate_class_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS class_registrations_set_code ON public.class_registrations;
CREATE TRIGGER class_registrations_set_code
  BEFORE INSERT ON public.class_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_class_code();

-- Public RPC to look up a class by its code (anonymous-safe, returns minimal fields)
CREATE OR REPLACE FUNCTION public.lookup_class_by_code(_code text)
RETURNS TABLE(
  id uuid,
  school_name text,
  class_name text,
  class_code text,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, school_name, class_name, class_code, status
  FROM public.class_registrations
  WHERE upper(class_code) = upper(_code)
    AND status IN ('active', 'completed')
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_class_by_code(text) TO anon, authenticated;

-- ============================================================
-- 2. ORDERS: order_type + customer fields + Stripe fields
-- ============================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_type text NOT NULL DEFAULT 'class',
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'na',
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_session_id_key
  ON public.orders (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS orders_order_type_idx ON public.orders (order_type);

-- Validation trigger — keep it consistent (avoid CHECK constraints that block future flexibility)
CREATE OR REPLACE FUNCTION public.validate_order_type()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.order_type NOT IN ('class', 'repurchase') THEN
    RAISE EXCEPTION 'order_type must be class or repurchase';
  END IF;
  IF NEW.order_type = 'repurchase' AND NEW.customer_email IS NULL THEN
    RAISE EXCEPTION 'repurchase orders require customer_email';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_validate_type ON public.orders;
CREATE TRIGGER orders_validate_type
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_order_type();

-- ============================================================
-- 3. UPDATE class counters trigger — exclude repurchase orders
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_class_counters()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_class_id uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_class_id := OLD.class_id;
  ELSE
    target_class_id := NEW.class_id;
  END IF;

  UPDATE public.class_registrations
  SET
    total_sold_gold = COALESCE((
      SELECT SUM(qty_gold) FROM public.orders
      WHERE class_id = target_class_id
        AND invoice_status != 'cancelled'
        AND order_type = 'class'
    ), 0),
    total_sold_crema = COALESCE((
      SELECT SUM(qty_crema) FROM public.orders
      WHERE class_id = target_class_id
        AND invoice_status != 'cancelled'
        AND order_type = 'class'
    ), 0),
    total_to_class = COALESCE((
      SELECT SUM(total_to_class) FROM public.orders
      WHERE class_id = target_class_id
        AND invoice_status != 'cancelled'
        AND order_type = 'class'
    ), 0)
  WHERE id = target_class_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Recreate trigger to make sure it exists (some envs may have lost it)
DROP TRIGGER IF EXISTS orders_update_class_counters ON public.orders;
CREATE TRIGGER orders_update_class_counters
  AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_class_counters();

-- ============================================================
-- 4. AUTO-CREATE repurchase row when paid
-- ============================================================

CREATE OR REPLACE FUNCTION public.auto_create_repurchase_on_paid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_qty int;
BEGIN
  -- Only act when an order transitions to 'paid' and is a repurchase
  IF NEW.order_type = 'repurchase'
     AND NEW.payment_status = 'paid'
     AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid')
  THEN
    total_qty := COALESCE(NEW.qty_gold, 0) + COALESCE(NEW.qty_crema, 0);

    -- Avoid duplicates (e.g. webhook re-delivery)
    IF NOT EXISTS (
      SELECT 1 FROM public.repurchases WHERE source_order_id = NEW.id
    ) THEN
      -- Create one row per product type for cleaner reporting
      IF COALESCE(NEW.qty_gold, 0) > 0 THEN
        INSERT INTO public.repurchases (
          class_id, product, quantity, source_order_id, customer_email, purchased_at
        ) VALUES (
          NEW.class_id, 'gold', NEW.qty_gold, NEW.id, NEW.customer_email, NEW.paid_at
        );
      END IF;
      IF COALESCE(NEW.qty_crema, 0) > 0 THEN
        INSERT INTO public.repurchases (
          class_id, product, quantity, source_order_id, customer_email, purchased_at
        ) VALUES (
          NEW.class_id, 'crema', NEW.qty_crema, NEW.id, NEW.customer_email, NEW.paid_at
        );
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_auto_repurchase ON public.orders;
CREATE TRIGGER orders_auto_repurchase
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_repurchase_on_paid();

-- ============================================================
-- 5. RLS — allow public insert for pending repurchase orders
-- ============================================================

-- Anonymous users can create a pending repurchase order (so checkout works without login)
DROP POLICY IF EXISTS "Public can create pending repurchase orders" ON public.orders;
CREATE POLICY "Public can create pending repurchase orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  order_type = 'repurchase'
  AND payment_status = 'pending'
  AND class_id IS NOT NULL
);

-- ============================================================
-- 6. Make the repurchase order amount/totals match parent prices
--    The existing calculate_order_totals function uses 119/179 (class prices).
--    For repurchase we want 169/249 (consumer prices). Update the function
--    to branch on order_type.
-- ============================================================

CREATE OR REPLACE FUNCTION public.calculate_order_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.total_to_class := (NEW.qty_gold * 50) + (NEW.qty_crema * 70);

  IF NEW.order_type = 'repurchase' THEN
    -- Consumer prices on qlasskassan.se/aterkop
    NEW.total_to_invoice := (NEW.qty_gold * 169) + (NEW.qty_crema * 249);
  ELSE
    -- Class wholesale prices (existing behaviour)
    NEW.total_to_invoice := (NEW.qty_gold * 119) + (NEW.qty_crema * 179);
  END IF;
  RETURN NEW;
END;
$$;