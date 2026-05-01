-- Add delivery address fields to orders
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS delivery_recipient text,
  ADD COLUMN IF NOT EXISTS delivery_postal_code text,
  ADD COLUMN IF NOT EXISTS delivery_city text;

-- Allow teachers to delete their own pending orders
CREATE POLICY "Teachers delete own pending orders"
ON public.orders
FOR DELETE
TO public
USING (
  class_id = get_user_class_id(auth.uid()) 
  AND invoice_status = 'pending'
);