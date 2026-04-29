import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn, resetPassword } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Inloggad — välkommen tillbaka");
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.message?.includes("Invalid login credentials")
        ? "Fel mejl eller lösenord"
        : err.message || "Inloggning misslyckades";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success("Återställningslänk skickad till din mejl");
      setResetMode(false);
    } catch (err: any) {
      toast.error(err.message || "Kunde inte skicka återställningslänk");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex justify-center mb-8">
          <Logo size="lg" variant="dark" />
        </Link>

        <Card className="border-emerald-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-950">
              {resetMode ? "Återställ lösenord" : "Logga in"}
            </CardTitle>
            <p className="text-sm text-stone-600 mt-1">
              {resetMode
                ? "Skriv in din mejl så skickar vi en återställningslänk."
                : "Logga in för att se din klass progress och beställningar."}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={resetMode ? handleReset : handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Mejl</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="namn@exempel.se"
                />
              </div>

              {!resetMode && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Lösenord</Label>
                    <button
                      type="button"
                      onClick={() => setResetMode(true)}
                      className="text-sm text-amber-700 hover:underline"
                    >
                      Glömt lösenord?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    minLength={8}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-900 hover:bg-emerald-800"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {resetMode ? "Skicka återställningslänk" : "Logga in"}
              </Button>

              {resetMode && (
                <button
                  type="button"
                  onClick={() => setResetMode(false)}
                  className="w-full text-sm text-stone-600 hover:text-stone-900"
                >
                  ← Tillbaka till inloggning
                </button>
              )}
            </form>

            <div className="mt-6 pt-6 border-t border-stone-200 text-center text-sm text-stone-600">
              Har ni inte en klass än?{" "}
              <Link to="/" className="text-amber-700 hover:underline">
                Anmäl er här
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}