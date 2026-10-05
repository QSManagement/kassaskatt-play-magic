import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Loader2 } from "lucide-react";
import { usePricing } from "@/hooks/usePricing";

const schema = z.object({
  student_name: z.string().max(100, "Namnet är för långt.").optional(),
  first_name: z.string().trim().min(1, "Fyll i förnamn.").max(100, "Namnet är för långt."),
  last_name: z.string().trim().min(1, "Fyll i efternamn.").max(100, "Namnet är för långt."),
  email: z.string().trim().min(1, "Fyll i e-post.").max(254, "E-postadressen är för lång.").email("E-postadressen ser inte korrekt ut."),
  phone: z.string().trim().min(1, "Fyll i mobilnummer.").max(40, "Telefonnumret är för långt."),
  street: z.string().trim().min(1, "Fyll i gatuadress.").max(200, "Adressen är för lång."),
  postal_code: z.string().trim().min(1, "Fyll i postnummer.").max(10, "Postnumret är för långt."),
  city: z.string().trim().min(1, "Fyll i ort.").max(100, "Ortsnamnet är för långt."),
  delivery_notes: z.string().max(300, "Leveransinformationen är för lång.").optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Du måste godkänna att uppgifterna delas med HelloFresh." }) }),
  website: z.string().max(0).optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

// Fältkonfiguration — lägg till HelloFresh-specifika fält här så sparas de i `extra`.
const FIELDS: {
  name: keyof FormValues;
  label: string;
  placeholder?: string;
  inputMode?: "tel" | "numeric" | "text";
  autoComplete?: string;
  half?: boolean;
  required?: boolean;
}[] = [
  { name: "first_name", label: "Förnamn", placeholder: "Anna", autoComplete: "given-name", half: true, required: true },
  { name: "last_name", label: "Efternamn", placeholder: "Lindberg", autoComplete: "family-name", half: true, required: true },
  { name: "email", label: "E-post", placeholder: "anna@example.se", autoComplete: "email", required: true },
  { name: "phone", label: "Mobil", placeholder: "070-123 45 67", inputMode: "tel", autoComplete: "tel", required: true },
  { name: "street", label: "Gatuadress", placeholder: "Storgatan 1", autoComplete: "street-address", required: true },
  { name: "postal_code", label: "Postnummer", placeholder: "123 45", inputMode: "numeric", autoComplete: "postal-code", half: true, required: true },
  { name: "city", label: "Ort", placeholder: "Stockholm", autoComplete: "address-level2", half: true, required: true },
  { name: "delivery_notes", label: "Portkod / leveransinfo (valfritt)", placeholder: "T.ex. portkod 1234" },
];

interface Props {
  classCode: string;
  className?: string;
  studentName?: string;
  lockStudent?: boolean;
  source: "customer_link" | "student_report" | "teacher";
  onSuccess?: (firstName: string) => void;
}

export default function HelloFreshSignupForm({
  classCode,
  className,
  studentName,
  lockStudent,
  source,
  onSuccess,
}: Props) {
  const pricing = usePricing();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successName, setSuccessName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      student_name: studentName ?? "",
      consent: undefined as unknown as true,
      website: "",
    },
  });

  const consentValue = watch("consent");

  async function onSubmit(values: FormValues) {
    if (values.website) return; // honeypot
    setServerError(null);
    const { error } = await supabase.rpc("public_create_hellofresh_signup", {
      _code: classCode,
      _student_name: values.student_name?.trim() || null,
      _first_name: values.first_name,
      _last_name: values.last_name,
      _email: values.email,
      _phone: values.phone,
      _street: values.street,
      _postal_code: values.postal_code,
      _city: values.city,
      _delivery_notes: values.delivery_notes?.trim() || null,
      _source: source,
      _consent: true,
      _extra: {},
    });
    if (error) {
      setServerError(error.message || "Något gick fel — försök igen.");
      return;
    }
    setSuccessName(values.first_name);
    onSuccess?.(values.first_name);
  }

  if (successName) {
    return (
      <div className="text-center space-y-4 py-6">
        <CheckCircle2 className="h-14 w-14 text-brand-600 mx-auto" aria-hidden="true" />
        <div>
          <h3 className="text-xl font-bold text-brand-950">Tack {successName}!</h3>
          <p className="text-stone-600 mt-1">
            Din anmälan är skickad.{className ? ` ${className} får ${pricing.margin_hellofresh} kr när den är godkänd.` : ""}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSuccessName(null);
            reset({
              student_name: studentName ?? "",
              consent: undefined as unknown as true,
              website: "",
            });
          }}
        >
          Anmäl en kund till
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label>
          Webbplats
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div>
        <Label htmlFor="hf-student" className="text-brand-950">
          Vilken elev köper du av? <span className="text-stone-400 font-normal">(valfritt)</span>
        </Label>
        <Input
          id="hf-student"
          className="mt-1"
          placeholder="Elevens namn"
          maxLength={100}
          disabled={lockStudent}
          {...register("student_name")}
        />
        {errors.student_name && <p className="text-sm text-red-600 mt-1">{errors.student_name.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FIELDS.map((f) => (
          <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
            <Label htmlFor={`hf-${f.name}`} className="text-brand-950">
              {f.label}
              {f.required && " *"}
            </Label>
            <Input
              id={`hf-${f.name}`}
              className="mt-1"
              placeholder={f.placeholder}
              inputMode={f.inputMode}
              autoComplete={f.autoComplete}
              {...register(f.name)}
            />
            {errors[f.name] && <p className="text-sm text-red-600 mt-1">{errors[f.name]?.message as string}</p>}
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 bg-stone-50 border border-stone-200 rounded-xl p-4">
        <Checkbox
          id="hf-consent"
          checked={!!consentValue}
          onCheckedChange={(v) => setValue("consent", v === true ? true : (undefined as unknown as true), { shouldValidate: true })}
          className="mt-0.5"
        />
        <Label htmlFor="hf-consent" className="text-sm text-stone-700 font-normal leading-relaxed cursor-pointer">
          {source === "teacher"
            ? "Kunden har godkänt att uppgifterna delas med HelloFresh."
            : "Jag godkänner att Qlasskassan delar mina uppgifter med HelloFresh så att de kan kontakta mig och starta min leverans."}{" "}
          Läs mer i <Link to="/integritetspolicy" className="text-brand-700 underline">integritetspolicyn</Link>.
        </Label>
      </div>
      {errors.consent && <p className="text-sm text-red-600 -mt-2">{errors.consent.message}</p>}

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl p-4">{serverError}</div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-900 hover:bg-brand-800 rounded-full py-6 text-base font-semibold">
        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Skicka anmälan
      </Button>
    </form>
  );
}
