import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Send, Package } from "lucide-react";

interface Props {
  klass: any;
}

function orderStatusLabel(o: any): string {
  if (o.delivery_status === "delivered") return "Levererad";
  if (o.delivery_status === "shipped") return "Skickad";
  if (o.delivery_status === "preparing") return "Förbereds";
  if (o.invoice_status === "paid") return "Betald, väntar leverans";
  if (o.invoice_status === "sent") return "Faktura skickad";
  return "Behandlas";
}

export default function OrderTab({ klass }: Props) {
  const [qtyGold, setQtyGold] = useState(0);
  const [qtyCrema, setQtyCrema] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  async function loadOrders() {
    setLoadingOrders(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("class_id", klass.id)
      .order("created_at", { ascending: false });
    if (!error) setOrders(data || []);
    setLoadingOrders(false);
  }

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [klass.id]);

  const totalToClass = qtyGold * 50 + qtyCrema * 70;
  const totalToInvoice = qtyGold * 119 + qtyCrema * 179;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (qtyGold === 0 && qtyCrema === 0) {
      toast.error("Lägg till minst en påse innan du skickar");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      class_id: klass.id,
      qty_gold: qtyGold,
      qty_crema: qtyCrema,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Kunde inte skicka beställningen — försök igen");
      return;
    }
    toast.success("Beställning skickad! Vi hör av oss inom 24 timmar.");
    setQtyGold(0);
    setQtyCrema(0);
    loadOrders();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-950">Skicka in beställning</CardTitle>
          <p className="text-sm text-stone-600">
            Räkna ihop hur mycket klassen sålt totalt och skicka in beställningen.
            Vi fakturerar föreningen och levererar till skolan inom 5 arbetsdagar.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qty_gold">Gold malet 500g</Label>
                <Input
                  id="qty_gold"
                  type="number"
                  min={0}
                  value={qtyGold}
                  onChange={(e) => setQtyGold(Math.max(0, parseInt(e.target.value) || 0))}
                />
                <p className="text-xs text-stone-500">169 kr/påse · 50 kr till klassen</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qty_crema">Crema bönor 1kg</Label>
                <Input
                  id="qty_crema"
                  type="number"
                  min={0}
                  value={qtyCrema}
                  onChange={(e) => setQtyCrema(Math.max(0, parseInt(e.target.value) || 0))}
                />
                <p className="text-xs text-stone-500">249 kr/påse · 70 kr till klassen</p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-700">Klassen tjänar:</span>
                <span className="font-semibold text-emerald-900">{totalToClass.toLocaleString("sv-SE")} kr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-700">Vår faktura till föreningen:</span>
                <span className="font-semibold text-stone-900">{totalToInvoice.toLocaleString("sv-SE")} kr</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500 pt-2 border-t border-emerald-200">
                <span>Totalt klassen sålt för:</span>
                <span>{(totalToClass + totalToInvoice).toLocaleString("sv-SE")} kr</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting || (qtyGold === 0 && qtyCrema === 0)}
              className="w-full bg-emerald-900 hover:bg-emerald-800"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Skicka in beställning
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-950 text-lg flex items-center gap-2">
            <Package className="h-5 w-5" aria-hidden="true" />
            Tidigare beställningar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingOrders ? (
            <p className="text-stone-500">Laddar...</p>
          ) : orders.length === 0 ? (
            <p className="text-stone-500 text-sm">Inga beställningar än.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between border border-stone-200 rounded-lg p-4">
                  <div>
                    <p className="font-medium text-emerald-950">
                      {o.qty_gold} Gold + {o.qty_crema} Crema
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      {new Date(o.created_at).toLocaleDateString("sv-SE")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-900">
                      {Number(o.total_to_class).toLocaleString("sv-SE")} kr
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {orderStatusLabel(o)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}