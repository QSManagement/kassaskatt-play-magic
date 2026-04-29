import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Send, Package, Info, Pencil, X } from "lucide-react";

interface Props {
  klass: any;
  onOrdersChanged?: () => void | Promise<void>;
}

function orderStatusLabel(o: any): string {
  if (o.invoice_status === "cancelled") return "Avbruten";
  if (o.delivery_status === "delivered") return "Levererad";
  if (o.delivery_status === "shipped") return "Skickad";
  if (o.delivery_status === "preparing") return "Förbereds";
  if (o.invoice_status === "paid") return "Betald, väntar leverans";
  if (o.invoice_status === "sent") return "Faktura skickad";
  return "Behandlas";
}

export default function OrderTab({ klass, onOrdersChanged }: Props) {
  const [qtyGoldStr, setQtyGoldStr] = useState("");
  const [qtyCremaStr, setQtyCremaStr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [studentTotals, setStudentTotals] = useState<{ gold: number; crema: number } | null>(null);
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [editGoldStr, setEditGoldStr] = useState("");
  const [editCremaStr, setEditCremaStr] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [cancelOrder, setCancelOrder] = useState<any | null>(null);
  const [cancelling, setCancelling] = useState(false);

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

  function openEdit(o: any) {
    setEditOrder(o);
    setEditGoldStr(String(o.qty_gold ?? 0));
    setEditCremaStr(String(o.qty_crema ?? 0));
  }

  async function saveEdit() {
    if (!editOrder) return;
    const g = Math.max(0, parseInt(editGoldStr) || 0);
    const c = Math.max(0, parseInt(editCremaStr) || 0);
    if (g === 0 && c === 0) {
      toast.error("Lägg till minst en påse");
      return;
    }
    setSavingEdit(true);
    const { error } = await supabase
      .from("orders")
      .update({ qty_gold: g, qty_crema: c })
      .eq("id", editOrder.id);
    setSavingEdit(false);
    if (error) {
      toast.error("Kunde inte spara ändringen");
      return;
    }
    toast.success("Beställning uppdaterad");
    setEditOrder(null);
    loadOrders();
    onOrdersChanged?.();
  }

  async function confirmCancel() {
    if (!cancelOrder) return;
    setCancelling(true);
    const { error } = await supabase
      .from("orders")
      .update({ invoice_status: "cancelled" })
      .eq("id", cancelOrder.id);
    setCancelling(false);
    if (error) {
      toast.error("Kunde inte avbryta beställningen");
      return;
    }
    toast.success("Beställning avbruten");
    setCancelOrder(null);
    loadOrders();
    onOrdersChanged?.();
  }

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [klass.id]);

  useEffect(() => {
    if (klass.tracking_mode !== "per_student") {
      setStudentTotals(null);
      return;
    }
    supabase
      .from("students")
      .select("sold_gold, sold_crema")
      .eq("class_id", klass.id)
      .then(({ data }) => {
        const gold = (data ?? []).reduce((s, r) => s + (r.sold_gold || 0), 0);
        const crema = (data ?? []).reduce((s, r) => s + (r.sold_crema || 0), 0);
        setStudentTotals({ gold, crema });
      });
  }, [klass.id, klass.tracking_mode]);

  const qtyGold = Math.max(0, parseInt(qtyGoldStr) || 0);
  const qtyCrema = Math.max(0, parseInt(qtyCremaStr) || 0);
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
    setQtyGoldStr("");
    setQtyCremaStr("");
    loadOrders();
    onOrdersChanged?.();
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
            {studentTotals && (studentTotals.gold > 0 || studentTotals.crema > 0) && (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
                <div className="text-emerald-900">
                  Eleverna har sålt totalt{" "}
                  <strong>{studentTotals.gold} Gold</strong> och{" "}
                  <strong>{studentTotals.crema} Crema</strong>.
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQtyGoldStr(String(studentTotals.gold));
                    setQtyCremaStr(String(studentTotals.crema));
                  }}
                >
                  Fyll i från eleverna
                </Button>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qty_gold">Gold malet 500g</Label>
                <Input
                  id="qty_gold"
                  type="number"
                  min={0}
                  value={qtyGoldStr}
                  placeholder="0"
                  onChange={(e) => setQtyGoldStr(e.target.value.replace(/[^0-9]/g, ""))}
                />
                <p className="text-xs text-stone-500">169 kr/påse · 50 kr till klassen</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qty_crema">Crema bönor 1kg</Label>
                <Input
                  id="qty_crema"
                  type="number"
                  min={0}
                  value={qtyCremaStr}
                  placeholder="0"
                  onChange={(e) => setQtyCremaStr(e.target.value.replace(/[^0-9]/g, ""))}
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
                <span className="text-right">
                  <span className="font-semibold text-stone-900">
                    {totalToInvoice.toLocaleString("sv-SE")} kr
                  </span>{" "}
                  <span className="italic text-xs text-stone-500">
                    (varav moms 6 %: {Math.round(totalToInvoice - totalToInvoice / 1.06).toLocaleString("sv-SE")} kr)
                  </span>
                </span>
              </div>
              <div className="flex justify-between text-xs text-stone-500 pt-2 border-t border-emerald-200">
                <span>Totalt klassen sålt för:</span>
                <span>{(totalToClass + totalToInvoice).toLocaleString("sv-SE")} kr</span>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-600 flex items-start gap-2 mb-4">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-stone-500" aria-hidden="true" />
              <p>
                <strong>Översikt uppdateras när ni skickat in beställningen.</strong>
                {' '}Använd Eleverna-fliken som arbetsverktyg under tiden — där sparas
                elevernas siffror automatiskt utan att påverka Översikt.
              </p>
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
              {orders.map((o) => {
                const isCancelled = o.invoice_status === "cancelled";
                const deliveryStarted =
                  o.delivery_status && o.delivery_status !== "pending";
                const isEditable =
                  o.invoice_status === "pending" && !deliveryStarted && !isCancelled;
                const isLocked = !isEditable && !isCancelled;
                return (
                  <div
                    key={o.id}
                    className={`flex items-center justify-between border rounded-lg p-4 gap-4 ${
                      isCancelled
                        ? "border-stone-200 bg-stone-50 opacity-60"
                        : "border-stone-200"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className={`font-medium ${isCancelled ? "text-stone-500 line-through" : "text-emerald-950"}`}>
                        {o.qty_gold} Gold + {o.qty_crema} Crema
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        {new Date(o.created_at).toLocaleDateString("sv-SE")}
                      </p>
                      {isLocked && (
                        <p className="text-xs text-stone-400 mt-1">
                          Låst — kontakta info@qlasskassan.se för ändringar
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`font-semibold ${isCancelled ? "text-stone-400" : "text-emerald-900"}`}>
                          {Number(o.total_to_class).toLocaleString("sv-SE")} kr
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {orderStatusLabel(o)}
                        </Badge>
                      </div>
                      {isEditable ? (
                        <div className="flex flex-col gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(o)}
                          >
                            <Pencil className="h-3 w-3 mr-1" aria-hidden="true" />
                            Redigera
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-700 hover:text-red-800"
                            onClick={() => setCancelOrder(o)}
                          >
                            <X className="h-3 w-3 mr-1" aria-hidden="true" />
                            Avbryt
                          </Button>
                        </div>
                      ) : isLocked ? (
                        <div className="flex flex-col gap-1 opacity-50">
                          <Button type="button" variant="outline" size="sm" disabled>
                            <Pencil className="h-3 w-3 mr-1" aria-hidden="true" />
                            Redigera
                          </Button>
                          <Button type="button" variant="outline" size="sm" disabled>
                            <X className="h-3 w-3 mr-1" aria-hidden="true" />
                            Avbryt
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editOrder} onOpenChange={(open) => !open && setEditOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redigera beställning</DialogTitle>
            <DialogDescription>
              Justera antalet påsar. Totalerna räknas om automatiskt.
            </DialogDescription>
          </DialogHeader>
          {editOrder && (() => {
            const g = Math.max(0, parseInt(editGoldStr) || 0);
            const c = Math.max(0, parseInt(editCremaStr) || 0);
            const tClass = g * 50 + c * 70;
            const tInvoice = g * 119 + c * 179;
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_gold">Gold malet 500g</Label>
                    <Input
                      id="edit_gold"
                      type="number"
                      min={0}
                      value={editGoldStr}
                      placeholder="0"
                      onChange={(e) => setEditGoldStr(e.target.value.replace(/[^0-9]/g, ""))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_crema">Crema bönor 1kg</Label>
                    <Input
                      id="edit_crema"
                      type="number"
                      min={0}
                      value={editCremaStr}
                      placeholder="0"
                      onChange={(e) => setEditCremaStr(e.target.value.replace(/[^0-9]/g, ""))}
                    />
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-700">Klassen tjänar:</span>
                    <span className="font-semibold text-emerald-900">{tClass.toLocaleString("sv-SE")} kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-700">Faktura till föreningen:</span>
                    <span className="font-semibold text-stone-900">{tInvoice.toLocaleString("sv-SE")} kr</span>
                  </div>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOrder(null)} disabled={savingEdit}>
              Avbryt
            </Button>
            <Button onClick={saveEdit} disabled={savingEdit} className="bg-emerald-900 hover:bg-emerald-800">
              {savingEdit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Spara ändringar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!cancelOrder} onOpenChange={(open) => !open && setCancelOrder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Avbryt beställning?</AlertDialogTitle>
            <AlertDialogDescription>
              Detta tar bort beställningen från klassens totaler. Kan inte ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Tillbaka</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmCancel();
              }}
              disabled={cancelling}
              className="bg-red-700 hover:bg-red-800"
            >
              {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ja, avbryt beställningen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}