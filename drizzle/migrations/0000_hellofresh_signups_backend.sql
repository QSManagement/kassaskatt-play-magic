-- a) price column
ALTER TABLE pricing_settings ADD COLUMN margin_hellofresh numeric NOT NULL DEFAULT 200;

-- d) class counters
ALTER TABLE class_registrations ADD COLUMN total_sold_hellofresh integer NOT NULL DEFAULT 0;
ALTER TABLE class_registrations ADD COLUMN total_hellofresh_to_class numeric(10,2) NOT NULL DEFAULT 0;

-- b) signups table
CREATE TABLE public.hellofresh_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  class_id uuid NOT NULL REFERENCES public.class_registrations(id) ON DELETE RESTRICT,
  student_id uuid NULL REFERENCES public.students(id) ON DELETE SET NULL,
  student_name text NULL,
  customer_first_name text NOT NULL,
  customer_last_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  street_address text NOT NULL,
  postal_code text NOT NULL,
  city text NOT NULL,
  delivery_notes text NULL,
  extra jsonb NOT NULL DEFAULT '{}',
  consent_at timestamptz NOT NULL,
  consent_text text NOT NULL,
  source text NOT NULL DEFAULT 'customer_link' CHECK (source IN ('customer_link','student_report','teacher','admin')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','paid_out')),
  commission_to_class numeric(10,2) NOT NULL DEFAULT 0,
  approved_at timestamptz NULL,
  rejected_at timestamptz NULL,
  paid_out_at timestamptz NULL,
  rejection_reason text NULL,
  admin_notes text NULL,
  hellofresh_reference text NULL
);
CREATE INDEX hellofresh_signups_class_id_idx ON public.hellofresh_signups(class_id);
CREATE INDEX hellofresh_signups_status_idx ON public.hellofresh_signups(status);
CREATE INDEX hellofresh_signups_created_at_idx ON public.hellofresh_signups(created_at DESC);
CREATE UNIQUE INDEX hellofresh_signups_email_unique ON public.hellofresh_signups(lower(customer_email)) WHERE status <> 'rejected';

GRANT SELECT, INSERT, UPDATE, DELETE ON public.hellofresh_signups TO authenticated;
GRANT ALL ON public.hellofresh_signups TO service_role;

ALTER TABLE public.hellofresh_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage hellofresh signups" ON public.hellofresh_signups FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- c) phone normalizer
CREATE OR REPLACE FUNCTION public.normalize_se_phone(p text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE
    WHEN d LIKE '00%' THEN substr(d, 3)
    WHEN d LIKE '46%' AND length(d) = 11 THEN '0' || substr(d, 3)
    WHEN d LIKE '46%' AND length(d) > 11 THEN substr(d, 3)
    ELSE d
  END
  FROM (SELECT regexp_replace(coalesce(p,''), '[^0-9]', '', 'g') AS d) t
$$;

-- trigger 1: normalize
CREATE OR REPLACE FUNCTION public.hellofresh_signups_normalize()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.customer_first_name := trim(NEW.customer_first_name);
  NEW.customer_last_name := trim(NEW.customer_last_name);
  NEW.customer_email := lower(trim(NEW.customer_email));
  NEW.street_address := trim(NEW.street_address);
  NEW.city := trim(NEW.city);
  NEW.student_name := NULLIF(trim(coalesce(NEW.student_name,'')), '');
  NEW.delivery_notes := NULLIF(trim(coalesce(NEW.delivery_notes,'')), '');
  NEW.postal_code := regexp_replace(coalesce(NEW.postal_code,''), '[^0-9]', '', 'g');
  IF length(NEW.postal_code) <> 5 THEN
    RAISE EXCEPTION 'Postnumret måste vara 5 siffror.';
  END IF;
  NEW.postal_code := substr(NEW.postal_code,1,3) || ' ' || substr(NEW.postal_code,4,2);
  NEW.customer_phone := public.normalize_se_phone(NEW.customer_phone);
  IF length(NEW.customer_phone) < 8 OR length(NEW.customer_phone) > 15 THEN
    RAISE EXCEPTION 'Mobilnumret ser inte korrekt ut.';
  END IF;
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER hellofresh_signups_normalize BEFORE INSERT OR UPDATE ON public.hellofresh_signups FOR EACH ROW EXECUTE FUNCTION public.hellofresh_signups_normalize();

-- trigger 2: lock commission on insert
CREATE OR REPLACE FUNCTION public.hellofresh_signups_before_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.commission_to_class := COALESCE((SELECT margin_hellofresh FROM public.pricing_settings WHERE id = 1), 200);
  RETURN NEW;
END;
$$;
CREATE TRIGGER hellofresh_signups_before_insert BEFORE INSERT ON public.hellofresh_signups FOR EACH ROW EXECUTE FUNCTION public.hellofresh_signups_before_insert();

-- trigger 3: status transitions
CREATE OR REPLACE FUNCTION public.hellofresh_signups_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'paid_out' AND OLD.status <> 'approved' THEN
      RAISE EXCEPTION 'Endast godkända anmälningar kan markeras som utbetalda.';
    END IF;
    IF NEW.status = 'approved' THEN NEW.approved_at := now(); END IF;
    IF NEW.status = 'rejected' THEN NEW.rejected_at := now(); END IF;
    IF NEW.status = 'paid_out' THEN NEW.paid_out_at := now(); END IF;
    IF NEW.status = 'pending' THEN
      NEW.approved_at := NULL;
      NEW.rejected_at := NULL;
      NEW.paid_out_at := NULL;
      NEW.rejection_reason := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER hellofresh_signups_status BEFORE UPDATE ON public.hellofresh_signups FOR EACH ROW EXECUTE FUNCTION public.hellofresh_signups_status();

-- trigger 4: recalc class counters
CREATE OR REPLACE FUNCTION public.hellofresh_recalc_class()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  old_class uuid;
  new_class uuid;
BEGIN
  old_class := CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN OLD.class_id ELSE NULL END;
  new_class := CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN NEW.class_id ELSE NULL END;

  IF old_class IS NOT NULL THEN
    UPDATE public.class_registrations c SET
      total_sold_hellofresh = (SELECT count(*) FROM public.hellofresh_signups s WHERE s.class_id = old_class AND s.status <> 'rejected'),
      total_hellofresh_to_class = (SELECT COALESCE(sum(s.commission_to_class),0) FROM public.hellofresh_signups s WHERE s.class_id = old_class AND s.status <> 'rejected')
    WHERE c.id = old_class;
  END IF;
  IF new_class IS NOT NULL AND new_class IS DISTINCT FROM old_class THEN
    UPDATE public.class_registrations c SET
      total_sold_hellofresh = (SELECT count(*) FROM public.hellofresh_signups s WHERE s.class_id = new_class AND s.status <> 'rejected'),
      total_hellofresh_to_class = (SELECT COALESCE(sum(s.commission_to_class),0) FROM public.hellofresh_signups s WHERE s.class_id = new_class AND s.status <> 'rejected')
    WHERE c.id = new_class;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;
CREATE TRIGGER hellofresh_recalc_class AFTER INSERT OR UPDATE OR DELETE ON public.hellofresh_signups FOR EACH ROW EXECUTE FUNCTION public.hellofresh_recalc_class();

-- f) public signup RPC
CREATE OR REPLACE FUNCTION public.public_create_hellofresh_signup(
  _code text, _student_name text, _first_name text, _last_name text,
  _email text, _phone text, _street text, _postal_code text, _city text,
  _delivery_notes text DEFAULT NULL, _source text DEFAULT 'customer_link',
  _consent boolean DEFAULT false, _extra jsonb DEFAULT '{}'
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_class_id uuid;
  v_student_id uuid;
  v_student_name text := NULLIF(trim(coalesce(_student_name,'')), '');
  v_source text;
  v_consent_text text;
  v_id uuid;
BEGIN
  SELECT c.id INTO v_class_id FROM public.class_registrations c
  WHERE upper(c.class_code) = upper(trim(_code)) AND c.status IN ('active','completed') LIMIT 1;
  IF v_class_id IS NULL THEN
    RAISE EXCEPTION 'Klasskoden är ogiltig eller klassen är inte aktiv.';
  END IF;

  IF NULLIF(trim(coalesce(_first_name,'')),'') IS NULL OR NULLIF(trim(coalesce(_last_name,'')),'') IS NULL
     OR NULLIF(trim(coalesce(_email,'')),'') IS NULL OR NULLIF(trim(coalesce(_phone,'')),'') IS NULL
     OR NULLIF(trim(coalesce(_street,'')),'') IS NULL OR NULLIF(trim(coalesce(_postal_code,'')),'') IS NULL
     OR NULLIF(trim(coalesce(_city,'')),'') IS NULL THEN
    RAISE EXCEPTION 'Alla obligatoriska fält måste fyllas i.';
  END IF;
  IF length(_first_name) > 100 OR length(_last_name) > 100 THEN RAISE EXCEPTION 'Namnet är för långt.'; END IF;
  IF length(_email) > 254 OR _email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN RAISE EXCEPTION 'E-postadressen ser inte korrekt ut.'; END IF;
  IF length(_street) > 200 THEN RAISE EXCEPTION 'Adressen är för lång.'; END IF;
  IF length(_city) > 100 THEN RAISE EXCEPTION 'Ortsnamnet är för långt.'; END IF;
  IF coalesce(_delivery_notes,'') <> '' AND length(_delivery_notes) > 300 THEN RAISE EXCEPTION 'Leveransinformationen är för lång.'; END IF;
  IF NOT COALESCE(_consent, false) THEN RAISE EXCEPTION 'Du måste godkänna att uppgifterna delas med HelloFresh.'; END IF;
  IF jsonb_typeof(COALESCE(_extra,'{}'::jsonb)) IS DISTINCT FROM 'object' OR length(_extra::text) > 2048 THEN
    RAISE EXCEPTION 'Ogiltig extradata.';
  END IF;

  v_source := CASE
    WHEN _source = 'teacher' AND public.get_user_class_id(auth.uid()) = v_class_id THEN 'teacher'
    WHEN _source = 'student_report' THEN 'student_report'
    ELSE 'customer_link'
  END;

  IF v_student_name IS NOT NULL THEN
    IF v_source = 'customer_link' THEN
      SELECT s.id INTO v_student_id FROM public.students s
      WHERE s.class_id = v_class_id AND lower(s.name) = lower(v_student_name) LIMIT 1;
    ELSE
      SELECT s.id INTO v_student_id FROM public.students s
      WHERE s.class_id = v_class_id AND lower(s.name) = lower(v_student_name) LIMIT 1;
      IF v_student_id IS NULL THEN
        INSERT INTO public.students (class_id, name) VALUES (v_class_id, v_student_name) RETURNING id INTO v_student_id;
      END IF;
    END IF;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.hellofresh_signups s
    WHERE s.status <> 'rejected'
      AND (lower(s.customer_email) = lower(trim(_email))
           OR s.customer_phone = public.normalize_se_phone(_phone))
  ) THEN
    RAISE EXCEPTION 'Den här kunden är redan anmäld till HelloFresh via Qlasskassan.';
  END IF;

  v_consent_text := CASE WHEN v_source = 'teacher'
    THEN 'Kundens samtycke inhämtat och registrerat av lärare.'
    ELSE 'Jag godkänner att Qlasskassan delar mina uppgifter med HelloFresh så att de kan kontakta mig och starta min leverans.'
  END;

  BEGIN
    INSERT INTO public.hellofresh_signups (
      class_id, student_id, student_name,
      customer_first_name, customer_last_name, customer_email, customer_phone,
      street_address, postal_code, city, delivery_notes, extra,
      consent_at, consent_text, source
    ) VALUES (
      v_class_id, v_student_id, v_student_name,
      _first_name, _last_name, _email, _phone,
      _street, _postal_code, _city, _delivery_notes, COALESCE(_extra,'{}'::jsonb),
      now(), v_consent_text, v_source
    ) RETURNING id INTO v_id;
  EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'Den här kunden är redan anmäld till HelloFresh via Qlasskassan.';
  END;

  RETURN v_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.public_create_hellofresh_signup(text,text,text,text,text,text,text,text,text,text,text,boolean,jsonb) TO anon, authenticated;

-- g) teacher-safe list RPC
CREATE OR REPLACE FUNCTION public.get_class_hellofresh_signups(_class_id uuid)
RETURNS TABLE(id uuid, created_at timestamptz, student_id uuid, student_name text, customer_display_name text, city text, status text, commission_to_class numeric)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT (public.has_role(auth.uid(),'admin') OR COALESCE(_class_id = public.get_user_class_id(auth.uid()), false)) THEN
    RAISE EXCEPTION 'Ingen behörighet.';
  END IF;
  RETURN QUERY
  SELECT s.id, s.created_at, s.student_id, s.student_name,
         s.customer_first_name || ' ' || left(s.customer_last_name, 1) || '.' AS customer_display_name,
         s.city, s.status, s.commission_to_class
  FROM public.hellofresh_signups s
  WHERE s.class_id = _class_id
  ORDER BY s.created_at DESC;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_class_hellofresh_signups(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_class_hellofresh_signups(uuid) TO authenticated;
