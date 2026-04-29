import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidToken(!!session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Lösenorden matchar inte");
      return;
    }
    if (password.length < 8) {
      toast.error("Lösenordet måste vara minst 8 tecken");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      toast.success("Lösenordet uppdaterat — du är inloggad");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Kunde inte uppdatera lösenordet");
    } finally {
      setLoading(false);
    }
  }

  if (validToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-stone-700 mb-4">Återställningslänken är ogiltig eller har gått ut.</p>
            <Button onClick={() => navigate("/logga-in")} variant="outline">
              Tillbaka till inloggning
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" variant="dark" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-950">Sätt nytt lösenord</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nytt lösenord</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Bekräfta lösenord</Label>
                <Input
                  id="confirm"
                  type="password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-900 hover:bg-emerald-800" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Spara lösenord
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}