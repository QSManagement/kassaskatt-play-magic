import { signOut } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Clock, Mail } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function PendingApproval() {
  const { loading, role } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-stone-600">Laddar...</div>;
  }
  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "teacher") return <Navigate to="/dashboard" replace />;
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <Logo size="lg" variant="dark" />
        </div>

        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-6">
              <Clock className="h-8 w-8 text-amber-700" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-bold text-emerald-950 mb-3 tracking-tight">
              Vi granskar er anmälan
            </h1>

            <p className="text-stone-700 leading-relaxed mb-6">
              Tack för att ni anmält er klass! Vi går igenom alla anmälningar manuellt
              för att säkerställa att allt stämmer. Ni hör från oss inom 24 timmar.
            </p>

            <div className="bg-white border border-stone-200 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-stone-500 mt-0.5" aria-hidden="true" />
                <div className="text-sm text-stone-600">
                  Vi kontaktar er på den mejl ni angav vid registrering.
                  När ni får aktiveringsmejlet kan ni logga in här igen.
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={signOut} variant="outline" className="w-full">
                Logga ut
              </Button>
              <p className="text-xs text-stone-500">
                Frågor? Mejla oss på{" "}
                <a href="mailto:kontakt@scandinaviancoffee.se" className="text-amber-700 hover:underline">
                  kontakt@scandinaviancoffee.se
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}