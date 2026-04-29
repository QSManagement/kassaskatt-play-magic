import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { resetPassword } from "@/lib/auth";
import { toast } from "sonner";

export default function AdminSettings() {
  const { user } = useAuth();

  async function handleReset() {
    try {
      await resetPassword(user?.email || "");
      toast.success("Återställningslänk skickad till din mejl");
    } catch (err: any) {
      toast.error(err.message || "Kunde inte skicka länk");
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-emerald-950 tracking-tight">Inställningar</h1>
        <p className="text-stone-600 mt-1">Hantera ditt admin-konto.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-950">Konto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between border-b border-stone-100 pb-3">
            <span className="text-stone-600">Mejl</span>
            <span className="font-medium text-emerald-950">{user?.email}</span>
          </div>
          <Button onClick={handleReset} variant="outline">
            Skicka återställningslänk för lösenord
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-950">System-info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-600">Version</span>
            <span className="font-mono text-emerald-950">Qlasskassan v1.0 (4B-2)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-600">Backend</span>
            <span className="font-mono text-emerald-950">Lovable Cloud</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}