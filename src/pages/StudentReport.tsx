import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { CheckCircle2, Coffee } from "lucide-react";

interface StudentRow {
  class_id: string;
  school_name: string;
  class_name: string;
  tracking_mode: string;
  student_id: string | null;
  student_name: string | null;
}

export default function StudentReport() {
  const { code } = useParams<{ code: string }>();
  const [loading, setLoading] = useState(true);
  const [classInfo, setClassInfo] = useState<{ school_name: string; class_name: string } | null>(null);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [selectedName, setSelectedName] = useState<string>("");
  const [customName, setCustomName] = useState("");
  const [gold, setGold] = useState("");
  const [crema, setCrema] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ name: string; gold: number; crema: number } | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!code) return;
    (async () => {
      const { data, error } = await supabase.rpc("public_list_class_students", { _code: code });
      if (error || !data || data.length === 0) {
        setNotFound(true);
      } else {
        const rows = data as StudentRow[];
        setClassInfo({ school_name: rows[0].school_name, class_name: rows[0].class_name });
        setStudents(
          rows
            .filter((r) => r.student_id && r.student_name)
            .map((r) => ({ id: r.student_id!, name: r.student_name! })),
        );
      }
      setLoading(false);
    })();
  }, [code]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const finalName = (selectedName === "__new__" ? customName : selectedName).trim();
    if (!finalName) {
      toast.error("Välj ditt namn eller skriv in det.");
      return;
    }
    const g = parseInt(gold) || 0;
    const c = parseInt(crema) || 0;
    if (g === 0 && c === 0) {
      toast.error("Skriv in hur många du sålt.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.rpc("public_report_student_sale", {
      _code: code,
      _student_name: finalName,
      _add_gold: g,
      _add_crema: c,
      _customer_name: customerName.trim() || null,
      _customer_address: customerAddress.trim() || null,
      _customer_phone: customerPhone.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Något gick fel.");
      return;
    }
    setSuccess({ name: finalName, gold: g, crema: c });
  }

  function reportAnother() {
    setSuccess(null);
    setGold("");
    setCrema("");
    setCustomerName("");
    setCustomerAddress("");
    setCustomerPhone("");
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-stone-600">Laddar...</div>;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-emerald-950">Klassen hittades inte</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-600 mb-4">
              Klasskoden <strong>{code}</strong> finns inte eller så är klassen inte aktiv. Kontrollera länken med din lärare.
            </p>
            <Link to="/" className="text-emerald-700 underline">Till startsidan</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" variant="dark" />
          <span className="text-xs text-stone-500">Elevrapport</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-emerald-950">{classInfo?.school_name}</h1>
          <p className="text-stone-600">{classInfo?.class_name}</p>
        </div>

        {success ? (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold text-emerald-950">Tack {success.name}!</h2>
                <p className="text-stone-600 mt-1">
                  Du rapporterade <strong>{success.gold}</strong> Gold och <strong>{success.crema}</strong> Crema.
                </p>
                <p className="text-sm text-stone-500 mt-2">Din lärare ser uppdateringen direkt.</p>
              </div>
              <Button onClick={reportAnother} variant="outline" className="mt-4">
                Rapportera mer
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-950 flex items-center gap-2">
                <Coffee className="h-5 w-5" aria-hidden="true" />
                Rapportera din försäljning
              </CardTitle>
              <p className="text-sm text-stone-600">
                Antalet du skriver in läggs till på din totala försäljning.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Vem är du?</label>
                  <select
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="">Välj ditt namn...</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="__new__">+ Mitt namn finns inte i listan</option>
                  </select>
                </div>

                {selectedName === "__new__" && (
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Skriv ditt namn</label>
                    <Input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Förnamn Efternamn"
                      maxLength={100}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Gold</label>
                    <Input
                      type="number"
                      min={0}
                      max={1000}
                      inputMode="numeric"
                      value={gold}
                      onChange={(e) => setGold(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Crema</label>
                    <Input
                      type="number"
                      min={0}
                      max={1000}
                      inputMode="numeric"
                      value={crema}
                      onChange={(e) => setCrema(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-900 hover:bg-emerald-800"
                >
                  {submitting ? "Skickar..." : "Rapportera"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-stone-500 text-center mt-6">
          Kafferepet · qlasskassan.se
        </p>
      </main>
    </div>
  );
}