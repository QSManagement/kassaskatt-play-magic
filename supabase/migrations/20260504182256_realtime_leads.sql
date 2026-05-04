ALTER TABLE public.class_registrations REPLICA IDENTITY FULL;
ALTER TABLE public.qlasskassan_leads REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.class_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.qlasskassan_leads;
