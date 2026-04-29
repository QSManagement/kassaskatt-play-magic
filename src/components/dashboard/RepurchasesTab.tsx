import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Coffee } from "lucide-react";

interface Props {
  klass: any;
}

export default function RepurchasesTab({ klass }: Props) {
  const [repurchases, setRepurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("repurchases")
      .select("*")
      .eq("class_id", klass.id)
      .order("purchased_at", { ascending: false })
      .then(({ data }) => {
        setRepurchases(data || []);
        setLoading(false);
      });
  }, [klass.id]);

  const total = repurchases.reduce((s, r) => s + Number(r.bonus_to_class), 0);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-amber-900 uppercase tracking-wide">Återköpsbonus</p>
              <p className="text-3xl font-bold text-amber-950 mt-1">
                +{total.toLocaleString("sv-SE")} kr
              </p>
              <p className="text-sm text-amber-800 mt-1">
                Tjänat passivt — utan att klassen lyfter ett finger
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-950 text-lg">Hur det funkar</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-stone-700 space-y-2">
          <p>
            Varje gång en av era kunder återköper kaffe på{" "}
            <a href="https://scandinaviancoffee.se" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:underline">scandinaviancoffee.se</a>{" "}
            inom 6 månader får er klass <strong>15 kr per påse</strong> — automatiskt.
          </p>
          <p>Vi mejlar er en månadsrapport så ni kan följa utvecklingen.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-950 text-lg">Återköp ({repurchases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-stone-500">Laddar...</p>
          ) : repurchases.length === 0 ? (
            <div className="text-center py-8 text-stone-500">
              <Coffee className="h-8 w-8 mx-auto mb-3 text-stone-300" aria-hidden="true" />
              <p className="text-sm">Inga återköp registrerade ännu.</p>
              <p className="text-xs mt-1">Återköp dyker upp här när era kunder börjar handla på scandinaviancoffee.se</p>
            </div>
          ) : (
            <div className="space-y-2">
              {repurchases.map((r) => (
                <div key={r.id} className="flex items-center justify-between border-b border-stone-100 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-emerald-950">
                      {r.quantity}× {r.product === "gold" ? "Gold malet" : "Crema bönor"}
                    </p>
                    <p className="text-xs text-stone-500">
                      {new Date(r.purchased_at).toLocaleDateString("sv-SE")}
                    </p>
                  </div>
                  <p className="font-semibold text-amber-700">
                    +{Number(r.bonus_to_class).toLocaleString("sv-SE")} kr
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}