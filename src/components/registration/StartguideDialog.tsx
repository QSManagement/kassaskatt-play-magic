import { useState } from "react";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(2, "Namn krävs").max(120),
  email: z.string().trim().email("Ogiltig e-post").max(255),
  school_name: z.string().trim().min(2, "Skola krävs").max(120),
});

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export function StartguideDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const close = () => {
    onOpenChange(false);
    setTimeout(() => { setName(""); setEmail(""); setSchool(""); setErrors({}); setDone(false); }, 200);
  };

  const submit = async () => {
    setErrors({});
    const r = schema.safeParse({ name, email, school_name: school });
    if (!r.success) {
      const out: Record<string, string> = {};
      for (const i of r.error.issues) { const k = i.path[0] as string; if (k && !out[k]) out[k] = i.message; }
      setErrors(out);
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-startguide", {
        body: r.data,
      });
      if (error) throw error;
      setDone(true);
    } catch (err: any) {
      toast.error(err?.message || "Kunde inte skicka. Försök igen.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-md bg-stone-50 border-stone-200">
        <DialogHeader>
          <DialogTitle className="text-emerald-950 text-2xl font-bold">
            {done ? "Mailet är på väg!" : "Få startguiden"}
          </DialogTitle>
          <DialogDescription className="text-emerald-900/70">
            {done ? "Kolla din inkorg om en stund." : "Vi mailar dig en PDF med allt ni behöver för att komma igång."}
          </DialogDescription>
        </DialogHeader>

        {!done ? (
          <div className="space-y-4 mt-2">
            <Field id="sg-name" label="Ditt namn" value={name} onChange={(e: any) => setName(e.target.value)} error={errors.name} />
            <Field id="sg-email" label="E-post" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} error={errors.email} />
            <Field id="sg-school" label="Skola" value={school} onChange={(e: any) => setSchool(e.target.value)} error={errors.school_name} />
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={close} disabled={submitting} className="text-emerald-900 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-200 transition disabled:opacity-50">
                Avbryt
              </button>
              <button onClick={submit} disabled={submitting} className="bg-emerald-900 text-amber-50 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-800 transition shadow-sm flex items-center gap-2 disabled:opacity-60">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Skicka guiden
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-emerald-800" />
            </div>
            <p className="text-emerald-900/80 mb-6">Guiden skickas till <strong>{email}</strong>.</p>
            <button onClick={close} className="bg-emerald-900 text-amber-50 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-800 transition">
              Stäng
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ id, label, value, onChange, error, type = "text" }: any) {
  return (
    <div>
      <Label htmlFor={id} className="text-emerald-950 font-medium">{label}</Label>
      <Input id={id} type={type} value={value} onChange={onChange} className={`mt-1 bg-white border-stone-200 ${error ? "border-red-400" : ""}`} />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
