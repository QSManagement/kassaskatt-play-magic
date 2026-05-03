
-- Pricing settings (singleton)
CREATE TABLE public.pricing_settings (
  id integer PRIMARY KEY DEFAULT 1,
  price_gold_consumer numeric NOT NULL DEFAULT 169,
  price_crema_consumer numeric NOT NULL DEFAULT 249,
  price_gold_class numeric NOT NULL DEFAULT 119,
  price_crema_class numeric NOT NULL DEFAULT 179,
  margin_gold numeric NOT NULL DEFAULT 50,
  margin_crema numeric NOT NULL DEFAULT 70,
  repurchase_bonus numeric NOT NULL DEFAULT 15,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  CONSTRAINT pricing_settings_singleton CHECK (id = 1)
);

ALTER TABLE public.pricing_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read pricing"
  ON public.pricing_settings FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can update pricing"
  ON public.pricing_settings FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert pricing"
  ON public.pricing_settings FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed singleton row with current values
INSERT INTO public.pricing_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Rewrite calculate_order_totals to read from pricing_settings
CREATE OR REPLACE FUNCTION public.calculate_order_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  p RECORD;
BEGIN
  SELECT * INTO p FROM public.pricing_settings WHERE id = 1;

  NEW.total_to_class := (NEW.qty_gold * p.margin_gold) + (NEW.qty_crema * p.margin_crema);

  IF NEW.order_type = 'repurchase' THEN
    NEW.total_to_invoice := (NEW.qty_gold * p.price_gold_consumer) + (NEW.qty_crema * p.price_crema_consumer);
  ELSE
    NEW.total_to_invoice := (NEW.qty_gold * p.price_gold_class) + (NEW.qty_crema * p.price_crema_class);
  END IF;
  RETURN NEW;
END;
$function$;

-- Rewrite calculate_repurchase_bonus to read from pricing_settings
CREATE OR REPLACE FUNCTION public.calculate_repurchase_bonus()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  bonus numeric;
BEGIN
  IF NEW.bonus_to_class IS NULL OR NEW.bonus_to_class = 0 THEN
    SELECT repurchase_bonus INTO bonus FROM public.pricing_settings WHERE id = 1;
    NEW.bonus_to_class := NEW.quantity * COALESCE(bonus, 15);
  END IF;
  RETURN NEW;
END;
$function$;
