import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Sparkles } from "lucide-react";

export default function AdminRepurchases() {
  const [repurchases, setRepurchases] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [{ data: rs }, { data: cs }] = await Promise.all([
      supabase
        .from("repurchases")
        .select(`*, class_registrations:class_id ( school_name, class_name )`)
        .order("purchased_at", { ascending: false }),
      supabase
        .from("class_registrations")
        .select("id, school_name, class_name")
        .in("status", ["active", "completed"])
        .order("school_name"),
    ]);
    setRepurchases(rs || []);
    setClasses(cs || []);
  }

  async function addRepurchase(form: any) {
    const { error } = await supabase.from("repurchases").insert({
      class_id: form.class_id,
      product: form.product,
      quantity: parseInt(form.quantity, 10),
      customer_email: form.customer_email || null,
      notes: form.notes || null,
    });
    if (error) {
      toast.error("Kunde inte lägga till: " + error.message);
    } else {
      toast.success("Återköp registrerat");
      setOpen(false);
      load();
    }
  }

  const total = repurchases.reduce((s, r) => s + Number(r.bonus_to_class), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950 tracking-tight">Återköpsklubben</h1>
          <p className="text-stone-600 mt-1">
            {repurchases.length} återköp · {total.toLocaleString("sv-SE")} kr utbetalt
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-900 hover:bg-emerald-800">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Registrera återköp
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrera återköp</DialogTitle>
            </DialogHeader>
            <RepurchaseForm classes={classes} onSubmit={addRepurchase} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {repurchases.length === 0 ? (
            <div className="p-8 text-center text-stone-500">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-stone-300" aria-hidden="true" />
              Inga återköp registrerade än.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Klass</TableHead>
                  <TableHead>Produkt</TableHead>
                  <TableHead>Antal</TableHead>
                  <TableHead className="text-right">Bonus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repurchases.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm text-stone-600">
                      {new Date(r.purchased_at).toLocaleDateString("sv-SE")}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/admin/klasser/${r.class_id}`}
                        className="hover:underline text-emerald-950 font-medium"
                      >
                        {r.class_registrations?.school_name}
                        {r.class_registrations?.class_name && (
                          <span className="text-stone-500 ml-1">
                            · {r.class_registrations.class_name}
                          </span>
                        )}
                      </Link>
                    </TableCell>
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
    </div>
  );
}

function RepurchaseForm({
  classes,
  onSubmit,
}: {
  classes: any[];
  onSubmit: (f: any) => void;
}) {
  const [form, setForm] = useState({
    class_id: "",
    product: "gold",
    quantity: "1",
    customer_email: "",
    notes: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4 mt-2"
    >
      <div className="space-y-2">
        <Label>Klass</Label>
        <Select value={form.class_id} onValueChange={(v) => setForm({ ...form, class_id: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Välj klass" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.school_name} {c.class_name && `· ${c.class_name}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Produkt</Label>
          <Select value={form.product} onValueChange={(v) => setForm({ ...form, product: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gold">Gold malet</SelectItem>
              <SelectItem value="crema">Crema bönor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Antal påsar</Label>
          <Input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Kund-mejl (valfritt)</Label>
        <Input
          type="email"
          value={form.customer_email}
          onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Anteckningar (valfritt)</Label>
        <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-900 hover:bg-emerald-800"
        disabled={!form.class_id}
      >
        Spara återköp
      </Button>
    </form>
  );
}