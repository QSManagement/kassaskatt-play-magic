import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { CheckCircle2, MailX, Loader2, AlertCircle } from "lucide-react";

type State =
  | { kind: "loading" }
  | { kind: "valid" }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "submitting" }
  | { kind: "done" }
  | { kind: "error"; message: string };

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`;
    fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.valid) setState({ kind: "valid" });
        else if (data.reason === "already_unsubscribed") setState({ kind: "already" });
        else setState({ kind: "invalid" });
      })
      .catch(() => setState({ kind: "error", message: "Kunde inte kontakta servern." }));
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    if (error) {
      setState({ kind: "error", message: error.message });
      return;
    }
    if ((data as any)?.success) setState({ kind: "done" });
    else if ((data as any)?.reason === "already_unsubscribed") setState({ kind: "already" });
    else setState({ kind: "error", message: "Något gick fel." });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <Logo size="lg" variant="dark" />
        </div>
        <Card className="border-stone-200">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            {state.kind === "loading" && (
              <>
                <Loader2 className="h-10 w-10 mx-auto animate-spin text-stone-400" />
                <p className="text-stone-600">Kontrollerar länken…</p>
              </>
            )}
            {state.kind === "valid" && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100">
                  <MailX className="h-8 w-8 text-amber-700" />
                </div>
                <h1 className="text-2xl font-bold text-emerald-950">Avregistrera mejl</h1>
                <p className="text-stone-700">
                  Klicka på knappen nedan för att avregistrera dig från utskick från Qlasskassan.
                </p>
                <Button onClick={confirm} className="bg-emerald-900 hover:bg-emerald-800 text-amber-50 w-full">
                  Bekräfta avregistrering
                </Button>
              </>
            )}
            {state.kind === "submitting" && (
              <>
                <Loader2 className="h-10 w-10 mx-auto animate-spin text-stone-400" />
                <p className="text-stone-600">Avregistrerar…</p>
              </>
            )}
            {state.kind === "done" && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-8 w-8 text-emerald-700" />
                </div>
                <h1 className="text-2xl font-bold text-emerald-950">Du är avregistrerad</h1>
                <p className="text-stone-700">Du kommer inte längre få mejl från oss.</p>
              </>
            )}
            {state.kind === "already" && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100">
                  <CheckCircle2 className="h-8 w-8 text-stone-500" />
                </div>
                <h1 className="text-2xl font-bold text-emerald-950">Redan avregistrerad</h1>
                <p className="text-stone-700">Den här mejladressen är redan avregistrerad.</p>
              </>
            )}
            {(state.kind === "invalid" || state.kind === "error") && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                  <AlertCircle className="h-8 w-8 text-red-700" />
                </div>
                <h1 className="text-2xl font-bold text-emerald-950">Länken fungerade inte</h1>
                <p className="text-stone-700">
                  {state.kind === "error" ? state.message : "Länken är ogiltig eller har gått ut."}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}