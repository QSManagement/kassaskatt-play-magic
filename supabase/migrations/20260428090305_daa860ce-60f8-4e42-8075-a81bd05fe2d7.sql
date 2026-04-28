
CREATE TABLE public.qlasskassan_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  school_name TEXT,
  class_name TEXT,
  student_count INTEGER,
  association_name TEXT,
  organization_number TEXT,
  bank_account TEXT,
  fundraising_goal TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.qlasskassan_leads ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can submit a lead from the marketing site
CREATE POLICY "Anyone can submit leads"
ON public.qlasskassan_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only service role reads leads (no public read)
CREATE POLICY "Service role can read leads"
ON public.qlasskassan_leads
FOR SELECT
TO public
USING (auth.role() = 'service_role');

CREATE INDEX idx_qlasskassan_leads_source ON public.qlasskassan_leads(source);
CREATE INDEX idx_qlasskassan_leads_created_at ON public.qlasskassan_leads(created_at DESC);
