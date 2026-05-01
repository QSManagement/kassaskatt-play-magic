-- Set DEFAULT so generated TypeScript types treat class_code as optional on insert
ALTER TABLE public.class_registrations
  ALTER COLUMN class_code SET DEFAULT public.generate_class_code();