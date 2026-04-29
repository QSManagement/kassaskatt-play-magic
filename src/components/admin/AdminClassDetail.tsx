import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, XCircle, Mail, Phone, Building2 } from "lucide-react";
import { Send } from "lucide-react";
import { StatusBadge } from "./AdminClasses";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function OrderStatusBadge({
  invoiceStatus,
  deliveryStatus,
}: {
  invoiceStatus: string;
  deliveryStatus: string;
}) {
  if (deliveryStatus === "delivered")
    return (
      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
        Levererad
      </Badge>
    );
  if (deliveryStatus === "shipped")
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
        Skickad
      </Badge>
    );
  if (invoiceStatus === "paid")
    return (
      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
        Betald
      </Badge>
    );
  if (invoiceStatus === "sent")
    return (
      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
        Faktura skickad
      </Badge>
    );
  if (invoiceStatus === "cancelled")
    return (
      <Badge variant="outline" className="bg-stone-100 text-stone-500 border-stone-300">
        Avbruten
      </Badge>
    );
  if (invoiceStatus === "overdue")
    return (
      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
        Förfallen
      </Badge>
    );
  return <Badge variant="outline">Behandlas</Badge>;
}

export default function AdminClassDetail() {
  const { id } = useParams();
  const [klass, setKlass] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [repurchases, setRepurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);
    const [{ data: c }, { data: o }, { data: r }] = await Promise.all([
      supabase.from("class_registrations").select("*").eq("id", id!).single(),
      supabase.from("orders").select("*").eq("class_id", id!).order("created_at", { ascending: false }),
      supabase.from("repurchases").select("*").eq("class_id", id!).order("purchased_at", { ascending: false }),
    ]);
    setKlass(c);
    setOrders(o || []);
    setRepurchases(r || []);
    setLoading(false);
  }

  async function activate() {
    if (!klass?.user_id) {
      toast.error("Klassen saknar kopplad användare — kan inte aktivera");
      return;
    }

    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: klass.user_id,
      role: "teacher",
      class_id: klass.id,
    });

    if (roleError && !roleError.message.includes("duplicate")) {
      toast.error("Kunde inte skapa lärar-roll: " + roleError.message);
      return;
    }

    const { error: statusError } = await supabase
      .from("class_registrations")
      .update({ status: "active" })
      .eq("id", klass.id);

    if (statusError) {
      toast.error("Kunde inte uppdatera status");
      return;
    }

    if (sendEmail) {
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "class-activated",
            recipientEmail: klass.contact_email,
            idempotencyKey: `activate-${klass.id}`,
            templateData: {
              name: klass.contact_name,
              schoolName: klass.school_name,
              className: klass.class_name,
              loginUrl: `${window.location.origin}/logga-in`,
            },
          },
        });
        toast.success("Klassen är aktiverad och mejl skickat");
      } catch (err) {
        toast.success("Klassen är aktiverad");
        toast.warning("Mejl-utskick misslyckades — meddela läraren manuellt");
      }
    } else {
      toast.success("Klassen är aktiverad — läraren kan nu logga in");
    }

    setSendEmail(false);
    load();
  }

  async function cancel() {
    const { error } = await supabase
      .from("class_registrations")
      .update({ status: "cancelled" })
      .eq("id", klass.id);
    if (error) toast.error("Kunde inte avbryta");
    else {
      toast.success("Klassen avbruten");
      load();
    }
  }

  async function resendActivationEmail() {
    if (!klass?.contact_email) {
      toast.error("Klassen saknar kontakt-mejl");
      return;
    }
    setResending(true);
    try {
      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "class-activated",
          recipientEmail: klass.contact_email,
          // Unik nyckel per utskick så det inte deduperas av tidigare aktivering
          idempotencyKey: `activate-${klass.id}-resend-${Date.now()}`,
          templateData: {
            name: klass.contact_name,
            schoolName: klass.school_name,
            className: klass.class_name,
            loginUrl: `${window.location.origin}/logga-in`,
          },
        },
      });
      if (error) throw error;
      toast.success(`Aktiveringsmejl skickat till ${klass.contact_email}`);
    } catch (err: any) {
      toast.error("Kunde inte skicka mejl: " + (err?.message || "okänt fel"));
    } finally {
      setResending(false);
    }
  }

  if (loading || !klass) {
    return <div className="text-stone-500">Laddar...</div>;
  }

  const repurchaseTotal = repurchases.reduce((s, r) => s + Number(r.bonus_to_class), 0);

  return (
    <div className="space-y-6">
      <Link
        to="/admin/klasser"
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-emerald-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Tillbaka till klasser
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-emerald-950 tracking-tight">{klass.school_name}</h1>
            <StatusBadge status={klass.status} />
          </div>
          <p className="text-stone-600 mt-1">
            {klass.class_name && `${klass.class_name} · `}
            {klass.student_count} elever
          </p>
        </div>

        <div className="flex gap-2">
          {klass.status === "pending" && (
            <AlertDialog
              onOpenChange={(open) => {
                if (!open) setSendEmail(false);
              }}
            >
              <AlertDialogTrigger asChild>
                <Button className="bg-emerald-900 hover:bg-emerald-800">
                  <CheckCircle2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Aktivera klass
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Aktivera {klass.school_name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Detta gör att läraren ({klass.contact_email}) kan logga in på sin dashboard
                    och börja använda Qlasskassan. Klassen markeras som aktiv.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-start gap-2 rounded-md border border-stone-200 bg-stone-50 p-3">
                  <Checkbox
                    id="send-activation-email"
                    checked={sendEmail}
                    onCheckedChange={(v) => setSendEmail(v === true)}
                  />
                  <Label
                    htmlFor="send-activation-email"
                    className="text-sm leading-snug text-stone-700 cursor-pointer"
                  >
                    Skicka aktiveringsmejl till läraren
                    <span className="block text-xs text-stone-500 mt-0.5">
                      Kräver att email-infrastrukturen är konfigurerad. Annars informera läraren manuellt.
                    </span>
                  </Label>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                  <AlertDialogAction onClick={activate} className="bg-emerald-900 hover:bg-emerald-800">
                    Ja, aktivera
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {klass.status === "active" && (
            <Button
              variant="outline"
              onClick={resendActivationEmail}
              disabled={resending}
              className="border-emerald-200 text-emerald-900 hover:bg-emerald-50"
            >
              <Send className="h-4 w-4 mr-2" aria-hidden="true" />
              {resending ? "Skickar…" : "Skicka om aktiveringsmejl"}
            </Button>
          )}
          {klass.status !== "cancelled" && klass.status !== "completed" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-700 border-red-200 hover:bg-red-50">
                  <XCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                  Avbryt
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Avbryt klassen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Klassen markeras som avbruten. Läraren förlorar inte tillgången direkt
                    men kommer markeras som inaktiv.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Nej</AlertDialogCancel>
                  <AlertDialogAction onClick={cancel} className="bg-red-700 hover:bg-red-800">
                    Ja, avbryt
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total insamlat" value={`${Number(klass.total_to_class || 0).toLocaleString("sv-SE")} kr`} />
        <StatCard label="Gold sålda" value={klass.total_sold_gold || 0} />
        <StatCard label="Crema sålda" value={klass.total_sold_crema || 0} />
        <StatCard label="Återköpsbonus" value={`${repurchaseTotal.toLocaleString("sv-SE")} kr`} />
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="orders">Ordrar ({orders.length})</TabsTrigger>
          <TabsTrigger value="repurchases">Återköp ({repurchases.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-emerald-950">Kontakt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <DetailRow icon={Mail} label="Mejl" value={klass.contact_email} />
              <DetailRow icon={Phone} label="Telefon" value={klass.contact_phone} />
              <DetailRow label="Kontaktperson" value={klass.contact_name} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-emerald-950">Förening (för fakturering)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <DetailRow icon={Building2} label="Föreningsnamn" value={klass.association_name} />
              <DetailRow label="Organisationsnummer" value={klass.organization_number} />
              <DetailRow label="Bankgiro / kontonummer" value={klass.bank_account} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-emerald-950">Mål och kampanj</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <DetailRow
                label="Mål-belopp"
                value={klass.goal_amount ? `${klass.goal_amount.toLocaleString("sv-SE")} kr` : "–"}
              />
              <DetailRow label="Beskrivning" value={klass.fundraising_goal || "–"} />
              <DetailRow
                label="Kampanjperiod"
                value={
                  klass.campaign_start && klass.campaign_end
                    ? `${new Date(klass.campaign_start).toLocaleDateString("sv-SE")} – ${new Date(
                        klass.campaign_end,
                      ).toLocaleDateString("sv-SE")}`
                    : "–"
                }
              />
              <DetailRow
                label="Spårningsläge"
                value={klass.tracking_mode === "per_student" ? "Per elev" : "Sammanlagt"}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardContent className="p-0">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-stone-500">Inga ordrar än.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Gold</TableHead>
                      <TableHead>Crema</TableHead>
                      <TableHead>Klassen</TableHead>
                      <TableHead>Faktura</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>{new Date(o.created_at).toLocaleDateString("sv-SE")}</TableCell>
                        <TableCell>{o.qty_gold}</TableCell>
                        <TableCell>{o.qty_crema}</TableCell>
                        <TableCell>{Number(o.total_to_class).toLocaleString("sv-SE")} kr</TableCell>
                        <TableCell>
                          {Number(o.total_to_invoice).toLocaleString("sv-SE")} kr
                          <span className="block italic text-xs text-stone-500">
                            varav moms 6 %: {Math.round(Number(o.total_to_invoice) - Number(o.total_to_invoice) / 1.06).toLocaleString("sv-SE")} kr
                          </span>
                        </TableCell>
                        <TableCell>
                          <OrderStatusBadge
                            invoiceStatus={o.invoice_status}
                            deliveryStatus={o.delivery_status}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repurchases">
          <Card>
            <CardContent className="p-0">
              {repurchases.length === 0 ? (
                <div className="p-8 text-center text-stone-500">Inga återköp än.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Produkt</TableHead>
                      <TableHead>Antal</TableHead>
                      <TableHead className="text-right">Bonus</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repurchases.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{new Date(r.purchased_at).toLocaleDateString("sv-SE")}</TableCell>
                        <TableCell className="capitalize">{r.product}</TableCell>
                        <TableCell>{r.quantity}</TableCell>
                        <TableCell className="text-right font-semibold text-amber-700">
                          +{Number(r.bonus_to_class).toLocaleString("sv-SE")} kr
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-stone-600 text-xs uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-emerald-950 mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-stone-100 last:border-0">
      <div className="flex items-center gap-2 text-stone-600">
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        <span>{label}</span>
      </div>
      <span className="font-medium text-emerald-950 text-right">{value || "–"}</span>
    </div>
  );
}