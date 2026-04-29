import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Package } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select(
        `*, class_registrations:class_id ( school_name, class_name, association_name, organization_number, bank_account )`,
      )
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  async function updateInvoiceStatus(id: string, status: string) {
    const updates: any = { invoice_status: status };
    if (status === "sent") updates.invoice_sent_at = new Date().toISOString();
    if (status === "paid") updates.invoice_paid_at = new Date().toISOString();

    const { error } = await supabase.from("orders").update(updates).eq("id", id);
    if (error) toast.error("Kunde inte uppdatera");
    else {
      toast.success("Uppdaterad");
      load();
    }
  }

  async function updateDeliveryStatus(id: string, status: string) {
    const updates: any = { delivery_status: status };
    if (status === "delivered") updates.delivered_at = new Date().toISOString();

    const { error } = await supabase.from("orders").update(updates).eq("id", id);
    if (error) toast.error("Kunde inte uppdatera");
    else {
      toast.success("Uppdaterad");
      load();
    }
  }

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "pending_invoice") return o.invoice_status === "pending";
    if (filter === "unpaid") return o.invoice_status === "sent";
    if (filter === "pending_delivery")
      return o.invoice_status === "paid" && o.delivery_status !== "delivered";
    return true;
  });

  const totals = filtered.reduce(
    (acc, o) => ({
      revenue: acc.revenue + Number(o.total_to_invoice || 0),
      toClass: acc.toClass + Number(o.total_to_class || 0),
      gold: acc.gold + (o.qty_gold || 0),
      crema: acc.crema + (o.qty_crema || 0),
    }),
    { revenue: 0, toClass: 0, gold: 0, crema: 0 },
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-950 tracking-tight">Ordrar</h1>
        <p className="text-stone-600 mt-1">
          {filtered.length} ordrar · {totals.revenue.toLocaleString("sv-SE")} kr fakturerat
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-stone-600">Antal ordrar</p>
            <p className="text-2xl font-bold text-emerald-950">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-stone-600">Total fakturerat</p>
            <p className="text-2xl font-bold text-emerald-950">
              {totals.revenue.toLocaleString("sv-SE")} kr
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-stone-600">Till klasser</p>
            <p className="text-2xl font-bold text-emerald-950">
              {totals.toClass.toLocaleString("sv-SE")} kr
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-stone-600">Påsar</p>
            <p className="text-2xl font-bold text-emerald-950">{totals.gold + totals.crema}</p>
          </CardContent>
        </Card>
      </div>

      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="md:w-64">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alla ordrar</SelectItem>
          <SelectItem value="pending_invoice">Faktura ej skickad</SelectItem>
          <SelectItem value="unpaid">Skickad, ej betald</SelectItem>
          <SelectItem value="pending_delivery">Betald, väntar leverans</SelectItem>
        </SelectContent>
      </Select>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-stone-500">Laddar...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-stone-500">
              <Package className="h-8 w-8 mx-auto mb-3 text-stone-300" aria-hidden="true" />
              Inga ordrar matchar filtret.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Klass</TableHead>
                  <TableHead>Antal</TableHead>
                  <TableHead>Faktura</TableHead>
                  <TableHead>Faktura status</TableHead>
                  <TableHead>Leverans status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="text-sm text-stone-600">
                      {new Date(o.created_at).toLocaleDateString("sv-SE")}
                    </TableCell>
                    <TableCell>
                      <Link to={`/admin/klasser/${o.class_id}`} className="hover:underline">
                        <p className="font-medium text-emerald-950">
                          {o.class_registrations?.school_name}
                        </p>
                        {o.class_registrations?.class_name && (
                          <p className="text-xs text-stone-500">{o.class_registrations.class_name}</p>
                        )}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">
                      {o.qty_gold} G + {o.qty_crema} C
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-900">
                      {Number(o.total_to_invoice).toLocaleString("sv-SE")} kr
                      <span className="block italic text-xs font-normal text-stone-500">
                        varav moms 6 %: {Math.round(Number(o.total_to_invoice) - Number(o.total_to_invoice) / 1.06).toLocaleString("sv-SE")} kr
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={o.invoice_status}
                        onValueChange={(v) => updateInvoiceStatus(o.id, v)}
                      >
                        <SelectTrigger className="h-8 w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="sent">Skickad</SelectItem>
                          <SelectItem value="paid">Betald</SelectItem>
                          <SelectItem value="overdue">Förfallen</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={o.delivery_status}
                        onValueChange={(v) => updateDeliveryStatus(o.id, v)}
                      >
                        <SelectTrigger className="h-8 w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="preparing">Förbereds</SelectItem>
                          <SelectItem value="shipped">Skickad</SelectItem>
                          <SelectItem value="delivered">Levererad</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}