-- 1. Normalisera & validera klasskod
CREATE OR REPLACE FUNCTION public.normalize_class_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.class_code IS NOT NULL THEN
    NEW.class_code := upper(trim(NEW.class_code));
    IF NEW.class_code !~ '^[A-Z0-9-]{4,20}$' THEN
      RAISE EXCEPTION 'Klasskoden måste vara 4-20 tecken (A-Z, 0-9, bindestreck).';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_class_code ON public.class_registrations;
CREATE TRIGGER trg_normalize_class_code
  BEFORE INSERT OR UPDATE OF class_code ON public.class_registrations
  FOR EACH ROW EXECUTE FUNCTION public.normalize_class_code();

-- 2. 6-månaders återköpsfönster
CREATE OR REPLACE FUNCTION public.repurchase_window_active(_class_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  first_paid timestamptz;
BEGIN
  SELECT MIN(COALESCE(paid_at, submitted_at, created_at))
  INTO first_paid
  FROM public.orders
  WHERE class_id = _class_id
    AND order_type = 'class'
    AND invoice_status != 'cancelled';

  IF first_paid IS NULL THEN
    RETURN TRUE;
  END IF;

  RETURN now() < first_paid + interval '6 months';
END;
$$;

-- 3. Drop & recreate lookup-funktionen med nytt fält
DROP FUNCTION IF EXISTS public.lookup_class_by_code(text);

CREATE OR REPLACE FUNCTION public.lookup_class_by_code(_code text)
RETURNS TABLE(id uuid, school_name text, class_name text, class_code text, status text, window_active boolean)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id,
    c.school_name,
    c.class_name,
    c.class_code,
    c.status,
    public.repurchase_window_active(c.id) AS window_active
  FROM public.class_registrations c
  WHERE upper(c.class_code) = upper(_code)
    AND c.status IN ('active', 'completed')
  LIMIT 1;
$$;