
ALTER TABLE public.startguide_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view qlasskassan leads"
  ON public.qlasskassan_leads FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view startguide leads"
  ON public.startguide_leads FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
