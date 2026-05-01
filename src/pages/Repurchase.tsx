import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/Logo";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { supabase } from "@/integrations/supabase/client";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Coffee, Minus, Plus, CheckCircle2, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

type ClassMatch = {
  id: string;
  school_name: string;
  class_name: string | null;
  class_code: string;
  window_active?: boolean;
};

const PRICE_GOLD = 169;
const PRICE_CREMA = 249;
const BONUS_PER_BAG = 15;

const formSchema = z.object({
  recipient: z.string().trim().min(1, "Mottagarens namn krävs").max(100),
  address: z.string().trim().min(3, "Adress krävs").max(255),
  postalCode: z.string().trim().min(3, "Postnummer krävs").max(20),
  city: z.string().trim().min(1, "Ort krävs").max(100),
  customerName: z.string().trim().min(1, "Ditt namn krävs").max(100),
  customerEmail: z.string().trim().email("Ogiltig e-postadress").max(255),
  customerPhone: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export default function Repurchase() {
  const [searchParams] = useSearchParams();
  const initialCode = (searchParams.get("kod") ?? searchParams.get("code") ?? "").toUpperCase();

  const [classCode, setClassCode] = useState(initialCode);
  const [klass, setKlass] = useState<ClassMatch | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [qtyGold, setQtyGold] = useState(initialCode ? 1 : 0);
  const [qtyCrema, setQtyCrema] = useState(0);

  const [form, setForm] = useState({
    recipient: "",
    address: "",
    postalCode: "",
    city: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const debounceRef = useRef<number | null>(null);

  // Debounced class code lookup
  useEffect(() => {
    const code = classCode.trim().toUpperCase();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!code || code.length < 5) {
      setKlass(null);
      setLookupError(null);
      setLookingUp(false);
      return;
    }
    setLookingUp(true);
    debounceRef.current = window.setTimeout(async () => {
      const { data, error } = await supabase.rpc("lookup_class_by_code", { _code: code });
      const match = Array.isArray(data) ? data[0] : data;
      if (error) {
        setLookupError("Kunde inte söka efter klasskoden");
        setKlass(null);
      } else if (!match) {
        setLookupError("Hittade ingen klass med den koden");
        setKlass(null);
      } else if (match.window_active === false) {
        setLookupError(
          "Den här klassens återköpsperiod (6 månader) har gått ut. Hör av er till oss om ni vill förlänga.",
        );
        setKlass(null);
      } else {
        setLookupError(null);
        setKlass(match as ClassMatch);
      }
      setLookingUp(false);
    }, 350);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [classCode]);

  const total = qtyGold * PRICE_GOLD + qtyCrema * PRICE_CREMA;
  const totalBags = qtyGold + qtyCrema;
  const bonusToClass = totalBags * BONUS_PER_BAG;
  const momsAmount = useMemo(() => Math.round((total - total / 1.06) * 100) / 100, [total]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((e) => {
      const { [key]: _omit, ...rest } = e;
      return rest;
    });
  }

  async function handleSubmit() {
    if (!klass) {
      toast.error("Välj en giltig klasskod först");
      return;
    }
    if (totalBags === 0) {
      toast.error("Välj minst en påse kaffe");
      return;
    }

    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      const flat: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0]) flat[issue.path[0] as string] = issue.message;
      }
      setErrors(flat);
      toast.error("Kontrollera fälten i formuläret");
      return;
    }

    setSubmitting(true);
    try {
      const returnUrl = `${window.location.origin}/aterkop/tack?session_id={CHECKOUT_SESSION_ID}`;
      const { data, error } = await supabase.functions.invoke("create-repurchase-checkout", {
        body: {
          classCode: klass.class_code,
          qtyGold,
          qtyCrema,
          customer: {
            name: parsed.data.customerName,
            email: parsed.data.customerEmail,
            phone: parsed.data.customerPhone || null,
          },
          delivery: {
            recipient: parsed.data.recipient,
            address: parsed.data.address,
            postalCode: parsed.data.postalCode,
            city: parsed.data.city,
          },
          notes: parsed.data.notes || null,
          returnUrl,
          environment: getStripeEnvironment(),
        },
      });
      if (error) throw error;
      if (!data?.clientSecret) throw new Error("Saknade clientSecret från servern");
      setClientSecret(data.clientSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Något gick fel";
      toast.error("Kunde inte starta betalning: " + message);
    } finally {
      setSubmitting(false);
    }
  }

  const checkoutOptions = useMemo(
    () => (clientSecret ? { fetchClientSecret: async () => clientSecret } : null),
    [clientSecret],
  );

  if (clientSecret && checkoutOptions) {
    return (
      <div className="min-h-screen bg-stone-50">
        <PaymentTestModeBanner />
        <header className="border-b border-stone-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="sm" variant="dark" />
            </Link>
            <button
              onClick={() => setClientSecret(null)}
              className="text-sm text-stone-600 hover:text-emerald-900 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Tillbaka
            </button>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div id="checkout">
            <EmbeddedCheckoutProvider stripe={getStripe()} options={checkoutOptions}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-50">
      <PaymentTestModeBanner />
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" variant="dark" />
          </Link>
          <span className="text-xs text-stone-500">Återköpsklubben</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-sm font-medium">
            <Coffee className="w-4 h-4" aria-hidden="true" />
            Stötta klassen — köp kaffe
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-950 tracking-tight">
            Återköp för klassen
          </h1>
          <p className="text-stone-600 max-w-xl mx-auto">
            Ange klasskoden från säljbladet, välj kaffe och betala — klassen får{" "}
            <strong>{BONUS_PER_BAG} kr per påse</strong> i bonus, helt automatiskt.
          </p>
        </div>

        {/* Class code */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Label htmlFor="class-code" className="text-emerald-950 font-semibold">
              Klasskod
            </Label>
            <div className="relative">
              <Input
                id="class-code"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                placeholder="KAF-XXXXX"
                className="font-mono text-lg tracking-wider uppercase"
                maxLength={20}
                autoComplete="off"
              />
              {lookingUp && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-stone-400" />
              )}
            </div>
            {klass && (
              <div className="flex items-start gap-2 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-950">{klass.school_name}</p>
                  {klass.class_name && (
                    <p className="text-emerald-800">{klass.class_name}</p>
                  )}
                </div>
              </div>
            )}
            {lookupError && classCode.length >= 5 && !lookingUp && (
              <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{lookupError}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="font-semibold text-emerald-950">Välj kaffe</h2>
            <ProductRow
              name="Caffè Gondoliere Gold"
              subtitle="500 g malet · 100 % Arabica"
              price={PRICE_GOLD}
              qty={qtyGold}
              setQty={setQtyGold}
            />
            <ProductRow
              name="Caffè Gondoliere Crema"
              subtitle="500 g hela bönor · höglands-Arabica"
              price={PRICE_CREMA}
              qty={qtyCrema}
              setQty={setQtyCrema}
            />
          </CardContent>
        </Card>

        {/* Delivery */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="font-semibold text-emerald-950">Leveransadress</h2>
            <Field
              label="Mottagare"
              value={form.recipient}
              onChange={(v) => update("recipient", v)}
              error={errors.recipient}
            />
            <Field
              label="Adress"
              value={form.address}
              onChange={(v) => update("address", v)}
              error={errors.address}
            />
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <Field
                  label="Postnummer"
                  value={form.postalCode}
                  onChange={(v) => update("postalCode", v)}
                  error={errors.postalCode}
                />
              </div>
              <div className="col-span-2">
                <Field
                  label="Ort"
                  value={form.city}
                  onChange={(v) => update("city", v)}
                  error={errors.city}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="font-semibold text-emerald-950">Dina uppgifter</h2>
            <Field
              label="Ditt namn"
              value={form.customerName}
              onChange={(v) => update("customerName", v)}
              error={errors.customerName}
            />
            <Field
              label="E-post (för orderbekräftelse)"
              type="email"
              value={form.customerEmail}
              onChange={(v) => update("customerEmail", v)}
              error={errors.customerEmail}
            />
            <Field
              label="Telefon (valfritt)"
              type="tel"
              value={form.customerPhone}
              onChange={(v) => update("customerPhone", v)}
              error={errors.customerPhone}
            />
            <div className="space-y-1.5">
              <Label className="text-sm text-stone-700">Meddelande (valfritt)</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={2}
                placeholder="T.ex. portkod eller annan info till leverans"
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="border-emerald-200 bg-white">
          <CardContent className="pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Antal påsar</span>
              <span>{totalBags} st</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Frakt</span>
              <span className="text-emerald-700 font-medium">Fri</span>
            </div>
            <div className="flex justify-between text-base border-t border-stone-200 pt-3">
              <span className="font-semibold text-emerald-950">Totalt</span>
              <span className="text-2xl font-bold text-emerald-950">
                {total.toLocaleString("sv-SE")} kr
              </span>
            </div>
            <p className="text-xs text-stone-500 text-right">
              varav moms 6 %: {momsAmount.toLocaleString("sv-SE")} kr
            </p>
            {bonusToClass > 0 && klass && (
              <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm flex justify-between items-center">
                <span className="text-amber-900">
                  {klass.school_name} {klass.class_name ? `(${klass.class_name})` : ""} får
                </span>
                <span className="font-bold text-amber-700 text-lg">
                  +{bonusToClass.toLocaleString("sv-SE")} kr
                </span>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!klass || totalBags === 0 || submitting}
              className="w-full bg-emerald-900 hover:bg-emerald-800 text-amber-50 h-12 text-base"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Förbereder betalning…
                </>
              ) : (
                "Gå till betalning"
              )}
            </Button>
            <p className="text-xs text-stone-500 text-center">
              Vi packar och skickar inom 5 arbetsdagar efter mottagen betalning.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function ProductRow({
  name,
  subtitle,
  price,
  qty,
  setQty,
}: {
  name: string;
  subtitle: string;
  price: number;
  qty: number;
  setQty: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-md bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Coffee className="h-5 w-5 text-amber-700" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-emerald-950 truncate">{name}</p>
          <p className="text-xs text-stone-500 truncate">{subtitle}</p>
          <p className="text-sm text-emerald-900 mt-0.5">{price} kr / påse</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setQty(Math.max(0, qty - 1))}
          disabled={qty === 0}
          aria-label="Minska antal"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center font-semibold">{qty}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setQty(Math.min(50, qty + 1))}
          aria-label="Öka antal"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-stone-700">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-red-300 focus-visible:ring-red-300" : ""}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}