import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Search, Download } from "lucide-react";

interface Sale {
  id: string;
  student_name: string;
  qty_gold: number;
  qty_crema: number;
  customer_name: string | null;
  customer_address: string | null;
  customer_phone: string | null;
  created_at: string;
}

interface Props {
  klass: any;
}

export default function SalesLogTab({ klass }: Props) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("student_sales")
      .select("*")
      .eq("class_id", klass.id)
      .order("created_at", { ascending: false });
    if (error) toast.error("Kunde inte ladda försäljningar");
    else setSales((data ?? []) as Sale[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`sales-${klass.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "student_sales", filter: `class_id=eq.${klass.id}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [klass.id]);

  async function remove(id: string) {
    if (!confirm("Ta bort denna försäljning? Elevens totalsumma uppdateras inte automatiskt — justera den vid behov i fliken Eleverna.")) return;
    const { error } = await supabase.from("student_sales").delete().eq("id", id);
    if (error) toast.error("Kunde inte ta bort");
    else toast.success("Försäljning borttagen");
  }

  function exportCsv() {
    const header = ["Datum", "Elev", "Gold", "Crema", "Kund", "Adress", "Telefon"];
    const rows = sales.map((s) => [
      new Date(s.created_at).toLocaleString("sv-SE"),
      s.student_name,
      String(s.qty_gold),
      String(s.qty_crema),
      s.customer_name ?? "",
      s.customer_address ?? "",
      s.customer_phone ?? "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `forsaljningar-${klass.class_code}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const f = filter.trim().toLowerCase();
  const filtered = !f
    ? sales
    : sales.filter(
        (s) =>
          s.student_name.toLowerCase().includes(f) ||
          (s.customer_name ?? "").toLowerCase().includes(f) ||
          (s.customer_address ?? "").toLowerCase().includes(f) ||
          (s.customer_phone ?? "").toLowerCase().includes(f),
      );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-emerald-950">Försäljningar</CardTitle>
            <p className="text-sm text-stone-600 mt-1">
              Varje gång en elev rapporterar via elevlänken hamnar det här — med kund, adress och datum.
            </p>
          </div>
          <Button onClick={exportCsv} variant="outline" size="sm" disabled={sales.length === 0}>
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Exportera CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Sök elev, kund, adress eller telefon..."
            className="pl-9"
          />
        </div>

        {loading ? (
          <p className="text-stone-500">Laddar...</p>
        ) : filtered.length === 0 ? (
          <p className="text-stone-500 text-sm py-6 text-center">
            {sales.length === 0
              ? "Inga försäljningar än. Dela elevlänken med klassen så börjar de dyka upp här."
              : "Inga träffar."}
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((s) => (
              <div key={s.id} className="border border-stone-200 rounded-lg p-3">
                <div className="flex justify-between items-start gap-2 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-emerald-950">{s.student_name}</span>
                      <span className="text-xs text-stone-500">
                        {new Date(s.created_at).toLocaleString("sv-SE", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-stone-700 mt-0.5">
                      {s.qty_gold > 0 && <>{s.qty_gold} Gold</>}
                      {s.qty_gold > 0 && s.qty_crema > 0 && " · "}
                      {s.qty_crema > 0 && <>{s.qty_crema} Crema</>}
                    </p>
                    {(s.customer_name || s.customer_address || s.customer_phone) ? (
                      <div className="mt-2 text-sm text-stone-600 space-y-0.5">
                        {s.customer_name && <div><strong>Kund:</strong> {s.customer_name}</div>}
                        {s.customer_address && <div><strong>Adress:</strong> {s.customer_address}</div>}
                        {s.customer_phone && (
                          <div>
                            <strong>Tel:</strong>{" "}
                            <a href={`tel:${s.customer_phone}`} className="text-emerald-700 underline">
                              {s.customer_phone}
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 mt-1 italic">Inga kunduppgifter angivna</p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => remove(s.id)} className="shrink-0">
                    <Trash2 className="h-4 w-4 text-stone-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}