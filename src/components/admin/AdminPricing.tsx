import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { clearPricingCache, DEFAULT_PRICING, type Pricing } from "@/hooks/usePricing";
import { useAuth } from "@/lib/AuthContext";

const fields: { key: keyof Pricing; label: string; help?: string }[] = [
  { key: "price_gold_consumer", label: "Konsumentpris Gold (återköp)", help: "Kr per påse vid återköp via klasskod. OBS: matchas mot pris i Stripe." },
  { key: "price_crema_consumer", label: "Konsumentpris Crema (återköp)", help: "Kr per påse vid återköp via klasskod. OBS: matchas mot pris i Stripe." },
  { key: "price_gold_class", label: "Klassens inköpspris Gold", help: "Pris klassen faktureras per Gold-påse." },
  { key: "price_crema_class", label: "Klassens inköpspris Crema", help: "Pris klassen faktureras per Crema-påse." },
  { key: "margin_gold", label: "Klassens marginal Gold", help: "Belopp per Gold-påse som tillfaller klassen." },
  { key: "margin_crema", label: "Klassens marginal Crema", help: "Belopp per Crema-påse som tillfaller klassen." },
  { key: "repurchase_bonus", label: "Återköpsbonus per påse", help: "Bonus till klassen för varje återköpt påse i 6-månadersfönstret." },
];

export default function AdminPricing() {
  const { user } = useAuth();
  const [values, setValues] = useState<Pricing>(DEFAULT_PRICING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => { void load(); }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("pricing_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) toast.error(error.message);
    if (data) {
      const v: Pricing = {
        price_gold_consumer: Number(data.price_gold_consumer),
        price_crema_consumer: Number(data.price_crema_consumer),
        price_gold_class: Number(data.price_gold_class),
        price_crema_class: Number(data.price_crema_class),
        margin_gold: Number(data.margin_gold),
        margin_crema: Number(data.margin_crema),
        repurchase_bonus: Number(data.repurchase_bonus),
      };
      setValues(v);
      setUpdatedAt(data.updated_at as string);
    }
    setLoading(false);
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("pricing_settings")
      .update({ ...values, updated_by: user?.id ?? null, updated_at: new Date().toISOString() })
      .eq("id", 1);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    clearPricingCache();
    toast.success("Priser uppdaterade — gäller nya beställningar och webbsidans kalkylator direkt.");
    void load();
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-stone-400" /></div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-emerald-950">Priser</h1>
        <p className="text-sm text-stone-600 mt-1">Här ändrar du priser, klassens marginal och återköpsbonus. Ändringar gäller direkt för nya beställningar och uppdaterar texterna på hemsidan.</p>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-5 pb-5 flex gap-3 items-start">
          <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 space-y-1">
            <p><strong>Befintliga ordrar påverkas inte</strong> — totaler är låsta vid skapande.</p>
            <p><strong>Konsumentpriserna (återköp)</strong> måste även justeras i Stripe (lookup keys <code>kaffe_gold_169</code> / <code>kaffe_crema_249</code>) annars debiteras föräldrarna det gamla priset trots att hemsidan visar det nya.</p>
            <p><strong>PDF-säljbladen</strong> uppdateras inte automatiskt — be utvecklaren regenerera dem om du ändrar priser som syns där.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prislista</CardTitle>
          <CardDescription>{updatedAt ? `Senast uppdaterad: ${new Date(updatedAt).toLocaleString("sv-SE")}` : ""}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((f) => (
            <div key={f.key} className="grid md:grid-cols-2 gap-4 items-start">
              <div>
                <Label htmlFor={f.key} className="text-emerald-950">{f.label}</Label>
                {f.help && <p className="text-xs text-stone-500 mt-1">{f.help}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id={f.key}
                  type="number"
                  min={0}
                  step="1"
                  value={values[f.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: Number(e.target.value) || 0 }))}
                />
                <span className="text-sm text-stone-500">kr</span>
              </div>
            </div>
          ))}

          <div className="pt-4 flex gap-3">
            <Button onClick={save} disabled={saving} className="bg-emerald-900 hover:bg-emerald-800">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Spara priser
            </Button>
            <Button variant="outline" onClick={load} disabled={saving}>Återställ</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}