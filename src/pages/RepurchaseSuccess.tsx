import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { CheckCircle2, Sparkles, Loader2, Coffee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function RepurchaseSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<{
    qty_gold: number;
    qty_crema: number;
    total_to_invoice: number;
    payment_status: string;
    class_id: string;
    class_name?: string | null;
    school_name?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      attempts += 1;
      const { data } = await supabase
        .from("orders")
        .select(
          "qty_gold, qty_crema, total_to_invoice, payment_status, class_id, class_registrations:class_id ( school_name, class_name )",
        )
        .eq("stripe_session_id", sessionId!)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        const cls = (data as any).class_registrations;
        setOrder({
          qty_gold: data.qty_gold,
          qty_crema: data.qty_crema,
          total_to_invoice: Number(data.total_to_invoice),
          payment_status: data.payment_status,
          class_id: data.class_id,
          school_name: cls?.school_name,
          class_name: cls?.class_name,
        });
        if (data.payment_status === "paid" || attempts > 8) {
          setLoading(false);
          return;
        }
      }
      // Webhook may take a few seconds — poll until paid or give up
      if (attempts < 10) {
        setTimeout(poll, 1500);
      } else {
        setLoading(false);
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const totalBags = (order?.qty_gold ?? 0) + (order?.qty_crema ?? 0);
  const bonus = totalBags * 15;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link to="/">
            <Logo size="sm" variant="dark" />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="pt-10 pb-10 text-center space-y-6">
            {loading ? (
              <>
                <Loader2 className="h-10 w-10 mx-auto animate-spin text-emerald-700" />
                <p className="text-stone-600">Bekräftar betalning…</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-9 w-9 text-emerald-700" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-emerald-950 tracking-tight">
                    Tack för ditt köp!
                  </h1>
                  <p className="text-stone-600 max-w-md mx-auto">
                    Din beställning är registrerad. Vi packar och skickar inom 5 arbetsdagar.
                    Orderbekräftelse skickas till din e-post.
                  </p>
                </div>

                {order && totalBags > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 inline-flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-amber-700" />
                    <div className="text-left">
                      <p className="text-sm text-amber-900">
                        {order.school_name || "Klassen"}
                        {order.class_name ? ` (${order.class_name})` : ""} får
                      </p>
                      <p className="text-2xl font-bold text-amber-800">
                        +{bonus.toLocaleString("sv-SE")} kr
                      </p>
                    </div>
                  </div>
                )}

                {order && (
                  <div className="text-sm text-stone-600 space-y-1 max-w-xs mx-auto pt-2 border-t border-stone-100">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <Coffee className="h-3 w-3" /> Gold
                      </span>
                      <span>{order.qty_gold} st</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <Coffee className="h-3 w-3" /> Crema
                      </span>
                      <span>{order.qty_crema} st</span>
                    </div>
                    <div className="flex justify-between font-semibold text-emerald-950 pt-1">
                      <span>Totalt betalt</span>
                      <span>{order.total_to_invoice.toLocaleString("sv-SE")} kr</span>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button asChild className="bg-emerald-900 hover:bg-emerald-800">
                    <Link to="/">Tillbaka till startsidan</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}