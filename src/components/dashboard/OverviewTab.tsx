import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Coffee, TrendingUp, Calendar, Sparkles, FileText, Download } from "lucide-react";
import { Ticket, Copy, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  klass: any;
}

export default function OverviewTab({ klass }: Props) {
  const [repurchaseTotal, setRepurchaseTotal] = useState(0);
  const [editingCode, setEditingCode] = useState(false);
  const [codeDraft, setCodeDraft] = useState(klass.class_code ?? "");
  const [savingCode, setSavingCode] = useState(false);
  const [currentCode, setCurrentCode] = useState<string>(klass.class_code ?? "");

  useEffect(() => {
    supabase
      .from("repurchases")
      .select("bonus_to_class")
      .eq("class_id", klass.id)
      .then(({ data }) => {
        const total = (data ?? []).reduce((sum, r) => sum + Number(r.bonus_to_class), 0);
        setRepurchaseTotal(total);
      });
  }, [klass.id]);

  const displayGold = Number(klass.total_sold_gold || 0);
  const displayCrema = Number(klass.total_sold_crema || 0);
  const totalEarned = Number(klass.total_to_class || 0) + repurchaseTotal;
  const goal = klass.goal_amount || 0;
  const progressPct = goal > 0 ? Math.min(100, (totalEarned / goal) * 100) : 0;

  const daysLeft = klass.campaign_end
    ? Math.max(0, Math.ceil((new Date(klass.campaign_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const repurchaseLink = `${window.location.origin}/aterkop?kod=${currentCode ?? ""}`;

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopierad`);
  }

  async function saveCode() {
    const trimmed = codeDraft.trim().toUpperCase();
    if (!/^[A-Z0-9-]{4,20}$/.test(trimmed)) {
      toast.error("Använd 4–20 tecken: A–Z, 0–9 eller bindestreck.");
      return;
    }
    if (trimmed === currentCode) {
      setEditingCode(false);
      return;
    }
    setSavingCode(true);
    const { error } = await supabase
      .from("class_registrations")
      .update({ class_code: trimmed })
      .eq("id", klass.id);
    setSavingCode(false);
    if (error) {
      if (error.message?.includes("class_code") || (error as any).code === "23505") {
        toast.error("Den koden är redan tagen — välj en annan.");
      } else {
        toast.error("Kunde inte spara koden: " + error.message);
      }
      return;
    }
    setCurrentCode(trimmed);
    setEditingCode(false);
    toast.success("Klasskod uppdaterad");
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white border-0 overflow-hidden">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="text-emerald-200 text-sm uppercase tracking-wide">Insamlat hittills</p>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-5xl font-bold tracking-tight">
                  {totalEarned.toLocaleString("sv-SE")}
                </span>
                <span className="text-2xl text-emerald-200">kr</span>
              </div>
            </div>
            {goal > 0 && (
              <div className="text-right">
                <p className="text-emerald-200 text-sm">Mål</p>
                <p className="text-2xl font-bold">{goal.toLocaleString("sv-SE")} kr</p>
              </div>
            )}
          </div>

          {goal > 0 && (
            <>
              <div className="h-2 bg-emerald-800 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-amber-400 transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-sm text-emerald-200">
                {progressPct.toFixed(0)} % av målet — {(goal - totalEarned).toLocaleString("sv-SE")} kr kvar
              </p>
            </>
          )}

          {klass.fundraising_goal && (
            <p className="mt-4 text-emerald-100 italic">"{klass.fundraising_goal}"</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-stone-600 text-sm">
              <Coffee className="h-4 w-4" aria-hidden="true" />
              Gold sålda
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-950">{displayGold}</p>
            <p className="text-xs text-stone-500 mt-1">påsar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-stone-600 text-sm">
              <Coffee className="h-4 w-4" aria-hidden="true" />
              Crema sålda
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-950">{displayCrema}</p>
            <p className="text-xs text-stone-500 mt-1">påsar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-stone-600 text-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Återköp
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-700">+{repurchaseTotal.toLocaleString("sv-SE")}</p>
            <p className="text-xs text-stone-500 mt-1">kr extra</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-stone-600 text-sm">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Kampanj
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-950">
              {daysLeft !== null ? daysLeft : "–"}
            </p>
            <p className="text-xs text-stone-500 mt-1">dagar kvar</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-stone-600">Kampanjstatus</p>
              <p className="text-lg font-semibold text-emerald-950 mt-1 capitalize">
                {klass.status === "active" ? "Aktiv" : klass.status}
              </p>
            </div>
            <Badge variant="outline" className="border-emerald-300 text-emerald-700">
              <TrendingUp className="h-3 w-3 mr-1" aria-hidden="true" />
              {klass.tracking_mode === "per_student" ? "Per elev" : "Sammanlagt"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {currentCode && (
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-amber-50">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Ticket className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-emerald-950">Er klasskod</p>
                <p className="text-sm text-stone-600 mt-1">
                  Dela med era kunder. När de återköper kaffe på qlasskassan.se/aterkop och anger koden får ni 15 kr per påse — automatiskt.
                  Välj gärna en kod som är lätt att komma ihåg, t.ex. <code className="font-mono">SOLSKOLAN-3A</code>.
                </p>
              </div>
            </div>
            {editingCode ? (
              <div className="flex items-center gap-2 bg-white border border-emerald-200 rounded-lg p-3">
                <Input
                  value={codeDraft}
                  onChange={(e) => setCodeDraft(e.target.value.toUpperCase())}
                  maxLength={20}
                  placeholder="T.EX. SOLSKOLAN-3A"
                  className="font-mono text-lg tracking-wider uppercase flex-1"
                  autoFocus
                />
                <Button size="sm" onClick={saveCode} disabled={savingCode} className="bg-emerald-900 hover:bg-emerald-800 text-amber-50">
                  <Check className="h-3 w-3 mr-1" /> Spara
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditingCode(false); setCodeDraft(currentCode); }}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-white border border-emerald-200 rounded-lg p-3">
                <code className="font-mono text-2xl font-bold text-emerald-900 flex-1 tracking-wider">
                  {currentCode}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(currentCode, "Klasskod")}
                >
                  <Copy className="h-3 w-3 mr-1" /> Kopiera
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setCodeDraft(currentCode); setEditingCode(true); }}
                >
                  <Pencil className="h-3 w-3 mr-1" /> Ändra
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg p-3">
              <span className="text-xs text-stone-500 truncate flex-1">{repurchaseLink}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(repurchaseLink, "Direktlänk")}
              >
                <Copy className="h-3 w-3 mr-1" /> Kopiera länk
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <FileText className="h-5 w-5 text-amber-700" aria-hidden="true" />
              </div>
              <div>
                <p className="text-base font-semibold text-emerald-950">Säljblad för klassen</p>
                <p className="text-sm text-stone-600 mt-1">
                  Skriv ut och dela ut till eleverna så de kan hålla koll på sin egen försäljning.
                </p>
              </div>
            </div>
            <Button asChild className="bg-emerald-950 hover:bg-emerald-900 text-amber-50 shrink-0">
              <a href="/qlasskassan-saljblad.pdf" download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                Ladda ner säljblad (PDF)
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}