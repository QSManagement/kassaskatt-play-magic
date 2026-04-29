-- 1. Roll-system
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  class_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role, class_id)
);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_user_roles_class_id ON public.user_roles(class_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_class_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT class_id FROM public.user_roles
  WHERE user_id = _user_id AND role = 'teacher'
  LIMIT 1;
$$;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

-- 2. Utöka class_registrations
ALTER TABLE public.class_registrations
  ADD COLUMN IF NOT EXISTS goal_amount integer,
  ADD COLUMN IF NOT EXISTS campaign_start date,
  ADD COLUMN IF NOT EXISTS campaign_end date,
  ADD COLUMN IF NOT EXISTS tracking_mode text NOT NULL DEFAULT 'aggregate',
  ADD COLUMN IF NOT EXISTS total_sold_gold integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_sold_crema integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_to_class numeric(10,2) NOT NULL DEFAULT 0;

ALTER TABLE public.class_registrations
  DROP CONSTRAINT IF EXISTS class_registrations_tracking_mode_check;
ALTER TABLE public.class_registrations
  ADD CONSTRAINT class_registrations_tracking_mode_check
  CHECK (tracking_mode IN ('aggregate', 'per_student'));

ALTER TABLE public.class_registrations
  DROP CONSTRAINT IF EXISTS class_registrations_status_check;
ALTER TABLE public.class_registrations
  ADD CONSTRAINT class_registrations_status_check
  CHECK (status IN ('pending', 'lead', 'active', 'completed', 'cancelled'));

CREATE INDEX IF NOT EXISTS idx_class_registrations_status ON public.class_registrations(status);
CREATE INDEX IF NOT EXISTS idx_class_registrations_created_at ON public.class_registrations(created_at DESC);

DROP TRIGGER IF EXISTS class_registrations_updated_at ON public.class_registrations;
CREATE TRIGGER class_registrations_updated_at
  BEFORE UPDATE ON public.class_registrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE POLICY "Admins can view all registrations" ON public.class_registrations
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all registrations" ON public.class_registrations
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete registrations" ON public.class_registrations
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers see their assigned class" ON public.class_registrations
  FOR SELECT USING (id = public.get_user_class_id(auth.uid()));

CREATE POLICY "Teachers update their assigned class" ON public.class_registrations
  FOR UPDATE USING (id = public.get_user_class_id(auth.uid()));

-- 3. students
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  class_id uuid REFERENCES public.class_registrations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  sold_gold integer NOT NULL DEFAULT 0,
  sold_crema integer NOT NULL DEFAULT 0,
  notes text
);

CREATE INDEX idx_students_class_id ON public.students(class_id);

CREATE TRIGGER students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all students" ON public.students
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers manage their class students" ON public.students
  FOR ALL USING (class_id = public.get_user_class_id(auth.uid()))
  WITH CHECK (class_id = public.get_user_class_id(auth.uid()));

-- 4. orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  class_id uuid REFERENCES public.class_registrations(id) ON DELETE CASCADE NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  qty_gold integer NOT NULL DEFAULT 0,
  qty_crema integer NOT NULL DEFAULT 0,
  total_to_class numeric(10,2) NOT NULL DEFAULT 0,
  total_to_invoice numeric(10,2) NOT NULL DEFAULT 0,
  invoice_status text NOT NULL DEFAULT 'pending'
    CHECK (invoice_status IN ('pending', 'sent', 'paid', 'overdue')),
  invoice_number text,
  invoice_sent_at timestamptz,
  invoice_paid_at timestamptz,
  invoice_due_date date,
  delivery_status text NOT NULL DEFAULT 'pending'
    CHECK (delivery_status IN ('pending', 'preparing', 'shipped', 'delivered')),
  delivery_address text,
  tracking_number text,
  delivered_at timestamptz,
  notes text
);

CREATE INDEX idx_orders_class_id ON public.orders(class_id);
CREATE INDEX idx_orders_invoice_status ON public.orders(invoice_status);
CREATE INDEX idx_orders_delivery_status ON public.orders(delivery_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all orders" ON public.orders
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers see their class orders" ON public.orders
  FOR SELECT USING (class_id = public.get_user_class_id(auth.uid()));

CREATE POLICY "Teachers create orders for their class" ON public.orders
  FOR INSERT WITH CHECK (class_id = public.get_user_class_id(auth.uid()));

CREATE POLICY "Teachers update own pending orders" ON public.orders
  FOR UPDATE USING (
    class_id = public.get_user_class_id(auth.uid())
    AND invoice_status = 'pending'
  );

-- 5. repurchases
CREATE TABLE public.repurchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  class_id uuid REFERENCES public.class_registrations(id) ON DELETE CASCADE NOT NULL,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  product text NOT NULL CHECK (product IN ('gold', 'crema')),
  quantity integer NOT NULL CHECK (quantity > 0),
  bonus_to_class numeric(10,2) NOT NULL DEFAULT 0,
  source_order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_email text,
  notes text
);

CREATE INDEX idx_repurchases_class_id ON public.repurchases(class_id);
CREATE INDEX idx_repurchases_purchased_at ON public.repurchases(purchased_at DESC);

ALTER TABLE public.repurchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all repurchases" ON public.repurchases
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers see their class repurchases" ON public.repurchases
  FOR SELECT USING (class_id = public.get_user_class_id(auth.uid()));

-- 6. Triggers / beräkningsfunktioner
CREATE OR REPLACE FUNCTION public.calculate_order_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.total_to_class := (NEW.qty_gold * 50) + (NEW.qty_crema * 70);
  NEW.total_to_invoice := (NEW.qty_gold * 119) + (NEW.qty_crema * 179);
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_calculate_totals
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.calculate_order_totals();

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
    total_sold_gold = COALESCE((SELECT SUM(qty_gold) FROM public.orders WHERE class_id = target_class_id), 0),
    total_sold_crema = COALESCE((SELECT SUM(qty_crema) FROM public.orders WHERE class_id = target_class_id), 0),
    total_to_class = COALESCE((SELECT SUM(total_to_class) FROM public.orders WHERE class_id = target_class_id), 0)
  WHERE id = target_class_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER orders_update_class_counters
  AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_class_counters();

CREATE OR REPLACE FUNCTION public.calculate_repurchase_bonus()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.bonus_to_class IS NULL OR NEW.bonus_to_class = 0 THEN
    NEW.bonus_to_class := NEW.quantity * 15;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER repurchases_calculate_bonus
  BEFORE INSERT ON public.repurchases
  FOR EACH ROW EXECUTE FUNCTION public.calculate_repurchase_bonus();