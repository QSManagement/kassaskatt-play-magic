import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, UserPlus, Share2, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  klass: any;
}

export default function StudentsTab({ klass }: Props) {
  const [students, setStudents] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, { gold: string; crema: string }>>({});
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const reportUrl = `https://qlasskassan.se/salj/${klass.class_code}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      toast.success("Länk kopierad");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Kunde inte kopiera");
    }
  }

  async function loadStudents() {
    setLoading(true);
    const { data } = await supabase
      .from("students")
      .select("*")
      .eq("class_id", klass.id)
      .order("name");
    const list = data || [];
    setStudents(list);
    setDrafts((prev) => {
      const next: Record<string, { gold: string; crema: string }> = {};
      for (const s of list) {
        next[s.id] = prev[s.id] ?? {
          gold: String(s.sold_gold ?? 0),
          crema: String(s.sold_crema ?? 0),
        };
      }
      return next;
    });
    setLoading(false);
  }

  useEffect(() => {
    loadStudents();
    // Live-uppdatera när elever rapporterar via publika länken
    const channel = supabase
      .channel(`students-${klass.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students", filter: `class_id=eq.${klass.id}` },
        () => loadStudents(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [klass.id]);

  async function addStudent() {
    if (!newName.trim()) return;
    const { error } = await supabase
      .from("students")
      .insert({ class_id: klass.id, name: newName.trim() });
    if (error) {
      toast.error("Kunde inte lägga till elev");
      return;
    }
    setNewName("");
    loadStudents();
  }

  function setDraft(id: string, field: "gold" | "crema", value: string) {
    const clean = value.replace(/[^0-9]/g, "");
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { gold: "0", crema: "0" }), [field]: clean },
    }));
  }

  async function commitStudent(id: string, field: "sold_gold" | "sold_crema", raw: string) {
    const value = Math.max(0, parseInt(raw) || 0);
    const student = students.find((s) => s.id === id);
    if (student && student[field] === value) return;
    const update: { sold_gold?: number; sold_crema?: number } = { [field]: value };
    const { error } = await supabase
      .from("students")
      .update(update)
      .eq("id", id);
    if (error) {
      toast.error("Kunde inte uppdatera");
      return;
    }
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  async function removeStudent(id: string) {
    if (!confirm("Ta bort denna elev?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) toast.error("Kunde inte ta bort");
    else loadStudents();
  }

  const totalGold = students.reduce(
    (s, e) => s + (parseInt(drafts[e.id]?.gold ?? "") || e.sold_gold || 0),
    0,
  );
  const totalCrema = students.reduce(
    (s, e) => s + (parseInt(drafts[e.id]?.crema ?? "") || e.sold_crema || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="text-emerald-950">Eleverna</CardTitle>
              <p className="text-sm text-stone-600 mt-1">
                Skriv in vad varje elev sålt — eller dela elevlänken så rapporterar de själva.
              </p>
            </div>
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="shrink-0">
                  <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Dela elevlänk
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-emerald-950">Elevernas rapporteringslänk</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-stone-600">
                    Dela länken eller QR-koden med klassen. Eleverna väljer sitt namn och fyller i hur mycket de sålt — det adderas automatiskt till deras totalsumma här.
                  </p>
                  <div className="flex items-center gap-2">
                    <Input value={reportUrl} readOnly className="font-mono text-sm" />
                    <Button onClick={copyLink} variant="outline" size="sm" className="shrink-0">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex justify-center bg-white p-4 rounded-lg border border-stone-200">
                    <QRCodeSVG value={reportUrl} size={200} />
                  </div>
                  <p className="text-xs text-stone-500 text-center">
                    Klasskod: <strong>{klass.class_code}</strong>
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Elevens namn"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addStudent()}
            />
            <Button onClick={addStudent} className="bg-emerald-900 hover:bg-emerald-800">
              <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
              Lägg till
            </Button>
          </div>

          {loading ? (
            <p className="text-stone-500">Laddar...</p>
          ) : students.length === 0 ? (
            <p className="text-stone-500 text-sm">Inga elever tillagda än.</p>
          ) : (
            <div className="space-y-2">
              {students.map((s) => (
                <div key={s.id} className="grid grid-cols-12 gap-2 items-center border border-stone-200 rounded-lg p-3">
                  <div className="col-span-5 font-medium text-emerald-950">{s.name}</div>
                  <div className="col-span-3">
                    <label className="text-xs text-stone-500 block">Gold</label>
                    <Input
                      type="number"
                      min={0}
                      value={drafts[s.id]?.gold ?? ""}
                      placeholder="0"
                      onChange={(e) => setDraft(s.id, "gold", e.target.value)}
                      onBlur={(e) => commitStudent(s.id, "sold_gold", e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs text-stone-500 block">Crema</label>
                    <Input
                      type="number"
                      min={0}
                      value={drafts[s.id]?.crema ?? ""}
                      placeholder="0"
                      onChange={(e) => setDraft(s.id, "crema", e.target.value)}
                      onBlur={(e) => commitStudent(s.id, "sold_crema", e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <Button variant="ghost" size="sm" onClick={() => removeStudent(s.id)}>
                      <Trash2 className="h-4 w-4 text-stone-400" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-4 flex justify-between text-sm">
                <span className="text-stone-700">Totalt sålda av eleverna:</span>
                <span className="font-semibold text-emerald-900">
                  {totalGold} Gold · {totalCrema} Crema
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}