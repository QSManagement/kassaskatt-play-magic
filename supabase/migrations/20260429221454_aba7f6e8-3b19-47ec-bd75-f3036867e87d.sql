drop policy if exists "Teachers update own pending orders" on public.orders;

create policy "Teachers update own pending orders"
on public.orders
for update
using (
  class_id = get_user_class_id(auth.uid())
  and invoice_status = 'pending'
)
with check (
  class_id = get_user_class_id(auth.uid())
  and invoice_status in ('pending', 'cancelled')
);