import { useState } from "react";
import { z } from "zod";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const step1Schema = z.object({
  school_name: z.string().trim().min(2, "Skolans namn krävs").max(120),
  class_name: z.string().trim().min(1, "Klass krävs").max(20),
  student_count: z.coerce.number().int().min(1).max(60),
  fundraising_goal: z.string().trim().max(300).optional(),
});
const step2Schema = z.object({
  contact_name: z.string().trim().min(2, "Namn krävs").max(120),
  contact_email: z.string().trim().email("Ogiltig e-post").max(255),
  contact_phone: z.string().trim().min(6, "Telefon krävs").max(40),
  password: z.string().min(8, "Minst 8 tecken").max(72),
});
const step3Schema = z.object({
  association_name: z.string().trim().min(2, "Föreningsnamn krävs").max(160),
  organization_number: z.string().trim().min(8, "Org.nr krävs").max(20),
  bank_account: z.string().trim().min(4, "Bankgiro/konto krävs").max(40),
});

type FormState = {
  school_name: string; class_name: string; student_count: string; fundraising_goal: string;
  contact_name: string; contact_email: string; contact_phone: string; password: string;
  association_name: string; organization_number: string; bank_account: string;
};

const empty: FormState = {
  school_name: "", class_name: "", student_count: "25", fundraising_goal: "",
  contact_name: "", contact_email: "", contact_phone: "", password: "",
  association_name: "", organization_number: "", bank_account: "",
};

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export function RegistrationDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const upd = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setStep(1); setData(empty); setErrors({}); }, 200);
  };

  const next = () => {
    setErrors({});
    if (step === 1) {
      const r = step1Schema.safeParse(data);
      if (!r.success) { setErrors(flatten(r.error)); return; }
    } else if (step === 2) {
      const r = step2Schema.safeParse(data);
      if (!r.success) { setErrors(flatten(r.error)); return; }
    }
    setStep((s) => s + 1);
  };

  const submit = async () => {
    setErrors({});
    const r = step3Schema.safeParse(data);
    if (!r.success) { setErrors(flatten(r.error)); return; }
    setSubmitting(true);
    try {
      // 1. Sign up the teacher
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.contact_email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: data.contact_name },
        },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Kunde inte skapa konto");

      // 2. Insert registration row
      const { error: insertError } = await supabase.from("class_registrations").insert({
        user_id: authData.user.id,
        school_name: data.school_name,
        class_name: data.class_name,
        student_count: parseInt(data.student_count),
        fundraising_goal: data.fundraising_goal || null,
        contact_name: data.contact_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        association_name: data.association_name,
        organization_number: data.organization_number,
        bank_account: data.bank_account,
      });
      if (insertError) throw insertError;

      // Log unified lead (non-blocking, best-effort)
      supabase.from("qlasskassan_leads").insert({
        source: "pilot_registration",
        name: data.contact_name,
        email: data.contact_email,
        phone: data.contact_phone,
        school_name: data.school_name,
        class_name: data.class_name,
        student_count: parseInt(data.student_count),
        association_name: data.association_name,
        organization_number: data.organization_number,
        bank_account: data.bank_account,
        fundraising_goal: data.fundraising_goal || null,
      }).then(({ error: leadErr }) => {
        if (leadErr) console.warn("lead insert failed", leadErr);
      });

      // 3. Trigger welcome email (non-blocking)
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "registration-welcome",
          recipientEmail: data.contact_email,
          idempotencyKey: `welcome-${authData.user.id}`,
          templateData: {
            name: data.contact_name,
            className: data.class_name,
            schoolName: data.school_name,
          },
        },
      }).catch((e) => console.warn("welcome email failed", e));

      setStep(4);
    } catch (err: any) {
      toast.error(err?.message || "Något gick fel. Försök igen.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-xl bg-stone-50 border-stone-200">
        <DialogHeader>
          <DialogTitle className="text-emerald-950 text-2xl font-bold">
            {step === 4 ? "Välkommen till Qlasskassan!" : "Registrera er klass"}
          </DialogTitle>
          <DialogDescription className="text-emerald-900/70">
            {step < 4 && `Steg ${step} av 3`}
            {step === 4 && "Vi har skickat en startguide till din e-post."}
          </DialogDescription>
        </DialogHeader>

        {step < 4 && (
          <div className="flex gap-1.5 mt-2 mb-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-emerald-800" : "bg-stone-200"}`} />
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Field id="school_name" label="Skola" value={data.school_name} onChange={upd("school_name")} error={errors.school_name} placeholder="Lindbladskolan" />
            <div className="grid grid-cols-2 gap-3">
              <Field id="class_name" label="Klass" value={data.class_name} onChange={upd("class_name")} error={errors.class_name} placeholder="6B" />
              <Field id="student_count" label="Antal elever" type="number" value={data.student_count} onChange={upd("student_count")} error={errors.student_count} />
            </div>
            <div>
              <Label htmlFor="fundraising_goal" className="text-emerald-950 font-medium">Mål med insamlingen <span className="text-emerald-900/50 font-normal">(valfritt)</span></Label>
              <Textarea id="fundraising_goal" value={data.fundraising_goal} onChange={upd("fundraising_goal")} placeholder="Klassresa till Berlin våren 2027" className="mt-1 bg-white border-stone-200" rows={2} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field id="contact_name" label="Ditt namn" value={data.contact_name} onChange={upd("contact_name")} error={errors.contact_name} placeholder="Anna Andersson" />
            <Field id="contact_email" label="E-post" type="email" value={data.contact_email} onChange={upd("contact_email")} error={errors.contact_email} placeholder="anna@skolan.se" />
            <Field id="contact_phone" label="Telefon" value={data.contact_phone} onChange={upd("contact_phone")} error={errors.contact_phone} placeholder="070-123 45 67" />
            <Field id="password" label="Välj lösenord (för dashboarden)" type="password" value={data.password} onChange={upd("password")} error={errors.password} placeholder="Minst 8 tecken" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-emerald-900/70 -mt-2">Klassens förening hanterar pengarna. Vi behöver uppgifterna för faktura och utbetalning.</p>
            <Field id="association_name" label="Föreningens namn" value={data.association_name} onChange={upd("association_name")} error={errors.association_name} placeholder="Klass 6B förening" />
            <Field id="organization_number" label="Organisationsnummer" value={data.organization_number} onChange={upd("organization_number")} error={errors.organization_number} placeholder="802400-1234" />
            <Field id="bank_account" label="Bankgiro eller kontonummer" value={data.bank_account} onChange={upd("bank_account")} error={errors.bank_account} placeholder="1234-5678" />
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-800" />
            </div>
            <p className="text-emerald-900/80 mb-2">Ditt konto är skapat och vi har skickat startguiden till <strong>{data.contact_email}</strong>.</p>
            <p className="text-sm text-emerald-900/60 mb-2">Hittar du inte mejlet? Kolla skräpposten/spam-mappen.</p>
            <p className="text-sm text-emerald-900/60">Logga in på dashboarden för att komma igång.</p>
          </div>
        )}

        {step < 4 && (
          <div className="flex justify-between mt-6">
            <button onClick={() => step > 1 ? setStep(step - 1) : handleClose()} disabled={submitting}
              className="text-emerald-900 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-200 transition flex items-center gap-1.5 disabled:opacity-50">
              <ArrowLeft className="w-4 h-4" /> {step === 1 ? "Avbryt" : "Tillbaka"}
            </button>
            <button onClick={step === 3 ? submit : next} disabled={submitting}
              className="bg-emerald-900 text-amber-50 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-800 transition shadow-sm flex items-center gap-2 disabled:opacity-60">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {step === 3 ? "Slutför registrering" : "Nästa"}
              {!submitting && step < 3 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {step === 4 && (
          <button onClick={handleClose} className="bg-emerald-900 text-amber-50 px-6 py-3 rounded-full text-sm font-semibold hover:bg-emerald-800 transition mt-2">
            Stäng
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ id, label, value, onChange, error, type = "text", placeholder }: any) {
  return (
    <div>
      <Label htmlFor={id} className="text-emerald-950 font-medium">{label}</Label>
      <Input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`mt-1 bg-white border-stone-200 ${error ? "border-red-400" : ""}`} />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function flatten(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const k = issue.path[0] as string;
    if (k && !out[k]) out[k] = issue.message;
  }
  return out;
}
