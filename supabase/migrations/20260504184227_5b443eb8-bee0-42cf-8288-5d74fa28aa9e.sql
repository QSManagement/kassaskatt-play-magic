-- Public student sales reporting via class code
-- Allows students to report their own sales without logging in.

-- 1) Public lookup of class students by class code (only active/completed, per_student mode)
CREATE OR REPLACE FUNCTION public.public_list_class_students(_code text)
RETURNS TABLE(
  class_id uuid,
  school_name text,
  class_name text,
  tracking_mode text,
  student_id uuid,
  student_name text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id AS class_id,
    c.school_name,
    c.class_name,
    c.tracking_mode,
    s.id AS student_id,
    s.name AS student_name
  FROM public.class_registrations c
  LEFT JOIN public.students s ON s.class_id = c.id
  WHERE upper(c.class_code) = upper(trim(_code))
    AND c.status IN ('active', 'completed')
  ORDER BY s.name NULLS LAST;
$$;

-- 2) Report a sale: finds existing student by name (case-insensitive) or creates one,
--    then ADDS the reported quantities to that student's totals.
CREATE OR REPLACE FUNCTION public.public_report_student_sale(
  _code text,
  _student_name text,
  _add_gold integer,
  _add_crema integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_class_id uuid;
  v_tracking text;
  v_student_id uuid;
  v_name text;
  v_gold int := GREATEST(COALESCE(_add_gold, 0), 0);
  v_crema int := GREATEST(COALESCE(_add_crema, 0), 0);
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

  SELECT c.id, c.tracking_mode INTO v_class_id, v_tracking
  FROM public.class_registrations c
  WHERE upper(c.class_code) = upper(trim(_code))
    AND c.status IN ('active', 'completed')
  LIMIT 1;

  IF v_class_id IS NULL THEN
    RAISE EXCEPTION 'Klasskoden är ogiltig eller klassen är inte aktiv.';
  END IF;

  -- Find existing student (case-insensitive) or create
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

  RETURN v_student_id;
END;
$$;

-- Allow anonymous + authenticated to call these functions
GRANT EXECUTE ON FUNCTION public.public_list_class_students(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_report_student_sale(text, text, integer, integer) TO anon, authenticated;