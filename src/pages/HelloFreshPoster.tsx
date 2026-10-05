import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";
import { HelloFreshLockup } from "./HelloFresh";
import { usePricing } from "@/hooks/usePricing";
import boxImg from "@/assets/matkassar/meal-kit.jpg";

interface ClassInfo {
  id: string;
  school_name: string;
  class_name: string;
  class_code: string;
}

export default function HelloFreshPoster() {
  const { code } = useParams<{ code: string }>();
  const pricing = usePricing();
  const [klass, setKlass] = useState<ClassInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Matkassar – affisch – Qlasskassan";
    if (!code) return;
    (async () => {
      const { data, error } = await supabase.rpc("lookup_class_by_code", { _code: code });
      if (error || !data || data.length === 0) setNotFound(true);
      else setKlass(data[0] as ClassInfo);
      setLoading(false);
    })();
  }, [code]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-stone-600">Laddar...</div>;
  }

  if (notFound || !klass) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-brand-950">Klassen hittades inte</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-600 mb-4">Kontrollera klasskoden och försök igen.</p>
            <Link to="/" className="text-brand-700 underline">Till startsidan</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const url = `https://qlasskassan.se/matkassar/anmal/${klass.class_code}`;

  return (
    <div className="min-h-screen bg-stone-100 print:bg-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          @page { size: A4; margin: 12mm; }
          body { background: white; }
        }
      `}</style>

      <div className="no-print max-w-3xl mx-auto px-4 pt-6 flex justify-end">
        <Button onClick={() => window.print()} className="bg-brand-900 hover:bg-brand-800 rounded-full">
          <Printer className="h-4 w-4 mr-2" aria-hidden="true" />
          Skriv ut
        </Button>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 md:p-12 print:shadow-none print:border-0 print:rounded-none">
          <div className="flex justify-center mb-8">
            <HelloFreshLockup />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-brand-950 leading-tight mb-3">
              Stötta {klass.class_name} — bli matkassekund
            </h1>
            <p className="text-xl text-brand-900/80">
              Klassen får{" "}
              <span className="bg-brand-300 px-2 py-0.5 rounded font-bold text-brand-950">
                {pricing.margin_hellofresh} kr
              </span>{" "}
              när du anmäler dig
            </p>
          </div>

          <img
            src={boxImg}
            alt="Matkasse med färska råvaror – exempelbild"
            className="rounded-3xl w-full max-w-md mx-auto object-cover mb-8"
          />

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-2xl border-2 border-brand-900">
                <QRCodeSVG value={url} size={220} />
              </div>
            </div>
            <div className="text-center md:text-left space-y-4">
              <p className="text-lg text-brand-950 font-semibold">
                Skanna QR-koden eller gå till:
              </p>
              <p className="font-mono text-brand-900 break-all bg-brand-50 border border-brand-300 rounded-xl p-3">
                {url}
              </p>
              <ul className="text-brand-900/80 space-y-2 text-left">
                <li>✓ Matkassar med recept och färska råvaror</li>
                <li>✓ Levereras hem till dörren</li>
                <li>✓ Du stöttar {klass.class_name} på {klass.school_name}</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-stone-500 mt-10">
            Qlasskassan · qlasskassan.se · Klasskod: {klass.class_code}
          </p>
        </div>
      </main>
    </div>
  );
}
