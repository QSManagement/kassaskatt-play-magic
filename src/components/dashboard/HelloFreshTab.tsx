import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Check, Download, Printer, UserPlus, Share2 } from "lucide-react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { usePricing } from "@/hooks/usePricing";
import HelloFreshSignupForm from "@/components/matkassar/HelloFreshSignupForm";
import boxImg from "@/assets/matkassar/meal-kit.jpg";

interface SignupRow {
  id: string;
  created_at: string;
  student_id: string | null;
  student_name: string | null;
  customer_display_name: string;
  city: string;
  status: string;
  commission_to_class: number;
}

const STATUS_FILTERS = [
  { value: "all", label: "Alla" },
  { value: "pending", label: "Väntar" },
  { value: "approved", label: "Godkänd" },
  { value: "paid_out", label: "Utbetald" },
  { value: "rejected", label: "Avvisad" },
];

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Väntar</Badge>;
    case "approved":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Godkänd</Badge>;
    case "paid_out":
      return <Badge className="bg-green-700 text-white border-green-700">Utbetald</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-stone-100 text-stone-400 border-stone-200 line-through">Avvisad</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function HelloFreshTab({ klass }: { klass: any }) {
  const pricing = usePricing();
  const [signups, setSignups] = useState<SignupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const customerLink = `https://qlasskassan.se/matkassar/anmal/${klass.class_code}`;
  const posterUrl = `/matkassar/affisch/${klass.class_code}`;

  async function load() {
    const { data, error } = await supabase.rpc("get_class_hellofresh_signups", { _class_id: klass.id });
    if (error) toast.error("Kunde inte ladda Matkasseanmälningar");
    else setSignups((data ?? []) as SignupRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [klass.id]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(customerLink);
      setCopied(true);
      toast.success("Länk kopierad");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Kunde inte kopiera");
    }
  }

  function downloadQr() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `matkassar-qr-${klass.class_code}.png`;
    a.click();
  }

  const active = signups.filter((s) => s.status !== "rejected");
  const pending = signups.filter((s) => s.status === "pending");
  const approved = signups.filter((s) => s.status === "approved" || s.status === "paid_out");
  const paidOut = signups.filter((s) => s.status === "paid_out");
  const sum = (rows: SignupRow[]) => rows.reduce((s, r) => s + Number(r.commission_to_class || 0), 0);

  const filtered = filter === "all" ? signups : signups.filter((s) => s.status === filter);

  return (
    <div className="space-y-6">
      <Card className="border-brand-300 border-2 bg-brand-50">
        <CardContent className="pt-6 flex items-center gap-4 flex-wrap">
          
          <p className="text-sm text-brand-950">
            <strong>{pricing.margin_hellofresh} kr per kund</strong> · ingen faktura · ingen återköpsbonus
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><p className="text-sm text-stone-600">Anmälda kunder</p></CardHeader>
          <CardContent><p className="text-3xl font-bold text-brand-950">{active.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><p className="text-sm text-stone-600">Väntar</p></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-700">{pending.length}</p>
            <p className="text-xs text-stone-500 mt-1">{sum(pending).toLocaleString("sv-SE")} kr</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><p className="text-sm text-stone-600">Godkänt</p></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-700">{approved.length}</p>
            <p className="text-xs text-stone-500 mt-1">{sum(approved).toLocaleString("sv-SE")} kr</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><p className="text-sm text-stone-600">Utbetalt</p></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-950">{sum(paidOut).toLocaleString("sv-SE")}</p>
            <p className="text-xs text-stone-500 mt-1">kr</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-brand-950 flex items-center gap-2">
            <Share2 className="h-5 w-5" aria-hidden="true" />
            Dela och samla in kunder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input value={customerLink} readOnly className="font-mono text-sm" />
            <Button onClick={copyLink} variant="outline" size="sm" className="shrink-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div ref={qrRef} className="bg-white p-3 rounded-lg border border-stone-200">
              <QRCodeCanvas value={customerLink} size={140} />
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={downloadQr}>
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                Ladda ner QR-kod (PNG)
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={posterUrl} target="_blank" rel="noopener noreferrer">
                  <Printer className="h-4 w-4 mr-2" aria-hidden="true" />
                  Skriv ut affisch
                </a>
              </Button>
              <Button size="sm" className="bg-brand-900 hover:bg-brand-800" onClick={() => setRegisterOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
                Registrera kund åt någon
              </Button>
            </div>
          </div>
          <p className="text-xs text-stone-500">
            Tips: Eleverna kan också anmäla kunder via elevlänken (fliken Elever).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <CardTitle className="text-brand-950">Anmälningar</CardTitle>
            <div className="flex gap-2 flex-wrap">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                    filter === f.value
                      ? "bg-brand-900 text-white border-brand-900"
                      : "bg-white text-stone-600 border-stone-200 hover:border-brand-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-stone-500">Laddar...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <img src={boxImg} alt="Matkassar-låda full av grönsaker" className="w-40 mx-auto rounded-2xl" loading="lazy" />
              <p className="text-stone-500 text-sm">
                {signups.length === 0 ? "Inga kunder än — dela länken med klassen!" : "Inga anmälningar med den statusen."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((s) => (
                <div key={s.id} className="border border-stone-200 rounded-lg p-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-brand-950">{s.customer_display_name}</span>
                      <StatusBadge status={s.status} />
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {new Date(s.created_at).toLocaleDateString("sv-SE")} · {s.city}
                      {s.student_name && <> · via {s.student_name}</>}
                    </p>
                  </div>
                  <span className="font-bold text-brand-900 shrink-0">
                    {Number(s.commission_to_class).toLocaleString("sv-SE")} kr
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-stone-500 mt-4">
            Fel på en anmälan? Mejla <a href="mailto:kontakt@scandinaviancoffee.se" className="text-brand-700 underline">kontakt@scandinaviancoffee.se</a>
          </p>
        </CardContent>
      </Card>

      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-950">Registrera kund åt någon</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-600 -mt-2">
            För pappersbeställningar — kunden måste ha godkänt att uppgifterna delas med HelloFresh.
          </p>
          <HelloFreshSignupForm
            classCode={klass.class_code}
            className={klass.class_name}
            source="teacher"
            onSuccess={() => {
              load();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
