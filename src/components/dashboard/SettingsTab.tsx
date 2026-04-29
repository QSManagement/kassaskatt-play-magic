import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { resetPassword } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  klass: any;
  user: any;
  onUpdated?: () => void | Promise<void>;
}

export default function SettingsTab({ klass, user, onUpdated }: Props) {
  const [contactName, setContactName] = useState(klass.contact_name || "");
  const [contactPhone, setContactPhone] = useState(klass.contact_phone || "");
  const [trackingMode, setTrackingMode] = useState(klass.tracking_mode || "aggregate");
  const [saving, setSaving] = useState(false);
  const [associationName, setAssociationName] = useState(klass.association_name || "");
  const [orgNumber, setOrgNumber] = useState(klass.organization_number || "");
  const [bankAccount, setBankAccount] = useState(klass.bank_account || "");
  const [savingAssoc, setSavingAssoc] = useState(false);

  async function saveContact() {
    setSaving(true);
    const { error } = await supabase
      .from("class_registrations")
      .update({
        contact_name: contactName,
        contact_phone: contactPhone,
        tracking_mode: trackingMode,
      })
      .eq("id", klass.id);
    setSaving(false);
    if (error) toast.error("Kunde inte spara");
    else {
      toast.success("Sparat");
      onUpdated?.();
    }
  }

  async function saveAssociation() {
    setSavingAssoc(true);
    const { error } = await supabase
      .from("class_registrations")
      .update({
        association_name: associationName,
        organization_number: orgNumber,
        bank_account: bankAccount,
      })
      .eq("id", klass.id);
    setSavingAssoc(false);
    if (error) toast.error("Kunde inte spara föreningsuppgifter");
    else {
      toast.success("Föreningsuppgifter sparade");
      onUpdated?.();
    }
  }

  async function handleResetPassword() {
    try {
      await resetPassword(user.email);
      toast.success("Återställningslänk skickad till din mejl");
    } catch (err: any) {
      toast.error(err.message || "Kunde inte skicka länk");
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-950">Kontaktuppgifter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact_name">Kontaktperson</Label>
            <Input id="contact_name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Telefon</Label>
            <Input id="contact_phone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Spårningsläge</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={trackingMode === "aggregate" ? "default" : "outline"}
                onClick={() => setTrackingMode("aggregate")}
                className={trackingMode === "aggregate" ? "bg-emerald-900 hover:bg-emerald-800" : ""}
              >
                Sammanlagt
              </Button>
              <Button
                type="button"
                variant={trackingMode === "per_student" ? "default" : "outline"}
                onClick={() => setTrackingMode("per_student")}
                className={trackingMode === "per_student" ? "bg-emerald-900 hover:bg-emerald-800" : ""}
              >
                Per elev
              </Button>
            </div>
            <p className="text-xs text-stone-500">
              Per-elev-läge visar en flik där du kan registrera vad varje elev sålt.
            </p>
          </div>
          <Button onClick={saveContact} disabled={saving} className="bg-emerald-900 hover:bg-emerald-800">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Spara
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-950">Förening</CardTitle>
          <p className="text-sm text-stone-600">
            Vi behöver dessa uppgifter för faktureringen. Dubbelkolla att de stämmer.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="association_name">Föreningsnamn</Label>
            <Input id="association_name" value={associationName} onChange={(e) => setAssociationName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization_number">Organisationsnummer</Label>
            <Input id="organization_number" value={orgNumber} onChange={(e) => setOrgNumber(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank_account">Bankgiro</Label>
            <Input id="bank_account" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
          </div>
          <Button onClick={saveAssociation} disabled={savingAssoc} className="bg-emerald-900 hover:bg-emerald-800">
            {savingAssoc && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Spara föreningsuppgifter
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-950">Säkerhet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-emerald-950">Mejl</p>
              <p className="text-sm text-stone-600">{user?.email}</p>
            </div>
          </div>
          <Button onClick={handleResetPassword} variant="outline">
            Skicka återställningslänk
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}