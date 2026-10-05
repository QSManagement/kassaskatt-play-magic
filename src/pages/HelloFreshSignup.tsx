import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelloFreshLockup } from "./HelloFresh";
import HelloFreshSignupForm from "@/components/matkassar/HelloFreshSignupForm";
import { usePricing } from "@/hooks/usePricing";
import dishesBlue from "@/assets/matkassar/meal-kit.jpg";

interface ClassInfo {
  id: string;
  school_name: string;
  class_name: string;
  class_code: string;
}

export default function HelloFreshSignup() {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pricing = usePricing();
  const [loading, setLoading] = useState(!!code);
  const [klass, setKlass] = useState<ClassInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [codeInput, setCodeInput] = useState("");

  const elevParam = searchParams.get("elev") ?? undefined;

  useEffect(() => {
    document.title = "Anmäl dig till Matkassar – Qlasskassan";
  }, []);

  useEffect(() => {
    if (!code) return;
    (async () => {
      const { data, error } = await supabase.rpc("lookup_class_by_code", { _code: code });
      if (error || !data || data.length === 0) {
        setNotFound(true);
      } else {
        setKlass(data[0] as ClassInfo);
      }
      setLoading(false);
    })();
  }, [code]);

  // Steg 1: fråga efter klasskod
  if (!code) {
    return (
      <div className="min-h-screen bg-stone-50">
        <header className="border-b border-stone-200 bg-white">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <HelloFreshLockup />
          </div>
        </header>
        <main className="max-w-md mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-brand-950">Ange klasskod</CardTitle>
              <p className="text-sm text-stone-600">
                Skriv klasskoden du fått av eleven eller läraren, t.ex. <code className="font-mono">KAF-AB12C</code>.
              </p>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const c = codeInput.trim();
                  if (c) navigate(`/matkassar/anmal/${encodeURIComponent(c)}`);
                }}
                className="space-y-4"
              >
                <Input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  placeholder="KLASSKOD"
                  className="font-mono uppercase tracking-wider text-lg"
                  maxLength={20}
                  autoFocus
                />
                <Button type="submit" className="w-full bg-brand-900 hover:bg-brand-800 rounded-full">
                  Fortsätt
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
            <p className="text-stone-600 mb-4">
              Klasskoden <strong>{code}</strong> finns inte eller så är klassen inte aktiv. Kontrollera länken med din lärare.
            </p>
            <Link to="/matkassar/anmal" className="text-brand-700 underline">Försök med en annan kod</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <HelloFreshLockup />
        </div>
      </header>

      <img
        src={dishesBlue}
        alt="Matkassar-rätter på turkos bakgrund"
        className="w-full h-40 object-cover"
      />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Card className="border-brand-300 border-2 bg-brand-50">
          <CardContent className="pt-6">
            <p className="text-brand-950">
              Du stöttar <strong>{klass.class_name}</strong> på <strong>{klass.school_name}</strong> — klassen
              får <span className="bg-brand-300 px-1.5 py-0.5 rounded font-bold">{pricing.margin_hellofresh} kr</span>{" "}
              när du blir matkassekund.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-brand-950">Anmäl dig till Matkassar</CardTitle>
            <p className="text-sm text-stone-600">
              Fyll i dina uppgifter så skickar vi dem till matkasseleverantören, som kontaktar dig och startar din leverans. Du betalar matkasseleverantören direkt.
            </p>
          </CardHeader>
          <CardContent>
            <HelloFreshSignupForm
              classCode={klass.class_code}
              className={klass.class_name}
              studentName={elevParam}
              source="customer_link"
            />
          </CardContent>
        </Card>

        <p className="text-xs text-stone-500 text-center">
          Qlasskassan · qlasskassan.se ·{" "}
          <Link to="/integritetspolicy" className="underline">Integritetspolicy</Link>
        </p>
      </main>
    </div>
  );
}
