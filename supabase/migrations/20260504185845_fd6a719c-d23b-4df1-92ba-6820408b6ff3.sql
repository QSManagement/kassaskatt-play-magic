-- 1) Sales log table
CREATE TABLE public.student_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL,
  student_id uuid,
  student_name text NOT NULL,
  qty_gold integer NOT NULL DEFAULT 0,
  qty_crema integer NOT NULL DEFAULT 0,
  customer_name text,
  customer_address text,
  customer_phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_student_sales_class ON public.student_sales(class_id, created_at DESC);
CREATE INDEX idx_student_sales_student ON public.student_sales(student_id);

ALTER TABLE public.student_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers see their class sales"
  ON public.student_sales FOR SELECT
  USING (class_id = public.get_user_class_id(auth.uid()));

CREATE POLICY "Admins manage all sales"
  ON public.student_sales FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Teachers can delete their class sales"
  ON public.student_sales FOR DELETE
  USING (class_id = public.get_user_class_id(auth.uid()));

-- 2) Updated reporting function with customer details
CREATE OR REPLACE FUNCTION public.public_report_student_sale(
  _code text,
  _student_name text,
  _add_gold integer,
  _add_crema integer,
  _customer_name text DEFAULT NULL,
  _customer_address text DEFAULT NULL,
  _customer_phone text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_class_id uuid;
  v_student_id uuid;
  v_name text;
  v_gold int := GREATEST(COALESCE(_add_gold, 0), 0);
  v_crema int := GREATEST(COALESCE(_add_crema, 0), 0);
  v_cname text := NULLIF(trim(COALESCE(_customer_name, '')), '');
  v_caddr text := NULLIF(trim(COALESCE(_customer_address, '')), '');
  v_cphone text := NULLIF(trim(COALESCE(_customer_phone, '')), '');
BEGIN
  v_name := trim(_student_name);
  IF v_name IS NULL OR length(v_name) = 0 THEN
    RAISE EXCEPTION 'Namn krävs.';
  END IF;
  IF length(v_name) > 100 THEN
    RAISE EXCEPTION 'Namnet är för långt.';
  END IF;
  IF v_gold = 0 AND v_crema = 0 THEN
    RAISE EXCEPTION 'Antal måste vara minst 1.';
  END IF;
  IF v_gold > 1000 OR v_crema > 1000 THEN
    RAISE EXCEPTION 'Antal är för högt.';
  END IF;
  IF v_cname IS NOT NULL AND length(v_cname) > 100 THEN
    RAISE EXCEPTION 'Kundens namn är för långt.';
  END IF;
  IF v_caddr IS NOT NULL AND length(v_caddr) > 300 THEN
    RAISE EXCEPTION 'Adressen är för lång.';
  END IF;
  IF v_cphone IS NOT NULL AND length(v_cphone) > 40 THEN
    RAISE EXCEPTION 'Telefonnumret är för långt.';
  END IF;

  SELECT c.id INTO v_class_id
  FROM public.class_registrations c
  WHERE upper(c.class_code) = upper(trim(_code))
    AND c.status IN ('active', 'completed')
  LIMIT 1;

  IF v_class_id IS NULL THEN
    RAISE EXCEPTION 'Klasskoden är ogiltig eller klassen är inte aktiv.';
  END IF;

  -- Find existing student or create
  SELECT id INTO v_student_id
  FROM public.students
  WHERE class_id = v_class_id AND lower(name) = lower(v_name)
  LIMIT 1;

  IF v_student_id IS NULL THEN
    INSERT INTO public.students (class_id, name, sold_gold, sold_crema)
    VALUES (v_class_id, v_name, v_gold, v_crema)
    RETURNING id INTO v_student_id;
  ELSE
    UPDATE public.students
    SET sold_gold = COALESCE(sold_gold, 0) + v_gold,
        sold_crema = COALESCE(sold_crema, 0) + v_crema,
        updated_at = now()
    WHERE id = v_student_id;
  END IF;

  -- Always log the sale
  INSERT INTO public.student_sales (
    class_id, student_id, student_name,
    qty_gold, qty_crema,
    customer_name, customer_address, customer_phone
  ) VALUES (
    v_class_id, v_student_id, v_name,
    v_gold, v_crema,
    v_cname, v_caddr, v_cphone
  );

  RETURN v_student_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.public_report_student_sale(text, text, integer, integer, text, text, text) TO anon, authenticated;

-- Enable realtime
ALTER TABLE public.student_sales REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_sales;