-- Update invoice_status check to include 'cancelled'
alter table public.orders
  drop constraint if exists orders_invoice_status_check;

alter table public.orders
  add constraint orders_invoice_status_check
  check (invoice_status in ('pending', 'sent', 'paid', 'overdue', 'cancelled'));

-- Update class counters trigger function to exclude cancelled orders
create or replace function public.update_class_counters()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_class_id uuid;
begin
  if TG_OP = 'DELETE' then
    target_class_id := old.class_id;
  else
    target_class_id := new.class_id;
  end if;

  update public.class_registrations
  set
    total_sold_gold = coalesce((
      select sum(qty_gold) from public.orders
      where class_id = target_class_id
        and invoice_status != 'cancelled'
    ), 0),
    total_sold_crema = coalesce((
      select sum(qty_crema) from public.orders
      where class_id = target_class_id
        and invoice_status != 'cancelled'
    ), 0),
    total_to_class = coalesce((
      select sum(total_to_class) from public.orders
      where class_id = target_class_id
        and invoice_status != 'cancelled'
    ), 0)
  where id = target_class_id;

  return coalesce(new, old);
end;
$$;