import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Search, Loader2, Pencil, Wallet } from "lucide-react";
import hfLogo from "@/assets/hellofresh/hellofresh-logo.png";

interface Signup {
  id: string;
  created_at: string;
  class_id: string;
  student_id: string | null;
  student_name: string | null;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  street_address: string;
  postal_code: string;
  city: string;
  delivery_notes: string | null;
  extra: Record<string, unknown>;
  source: string;
  status: string;
  commission_to_class: number;
  rejection_reason: string | null;
  admin_notes: string | null;
  hellofresh_reference: string | null;
}

interface ClassRow {
  id: string;
  school_name: string;
  class_name: string;
  association_name: string;
  organization_number: string;
  bank_account: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Väntar",
  approved: "Godkänd",
  paid_out: "Utbetald",
  rejected: "Avvisad",
};

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Väntar</Badge>;
    case "approved":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Godkänd</Badge>;
    case "paid_out":
      return <Badge className="bg-green-700 text-white border-green-700">Utbetald</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-stone-100 text-stone-500 border-stone-200">Avvisad</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function friendlyError(msg: string): string {
  if (msg.includes("redan anmäld") || msg.includes("hellofresh_signups_email_unique"))
    return "Kunden finns redan som aktiv anmälan.";
  if (msg.includes("Endast godkända")) return msg;
  if (msg.includes("Postnumret")) return msg;
  if (msg.includes("Mobilnumret")) return msg;
  return msg;
}

export default function AdminHelloFresh() {
  const [searchParams] = useSearchParams();
  const [signups, setSignups] = useState<Signup[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [classFilter, setClassFilter] = useState(searchParams.get("klass") ?? "all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<Signup | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [editTarget, setEditTarget] = useState<Signup | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Signup>>({});

  async function load() {
    setLoading(true);
    const [{ data: s }, { data: c }] = await Promise.all([
      supabase.from("hellofresh_signups").select("*").order("created_at", { ascending: false }),
      supabase.from("class_registrations").select("id, school_name, class_name, association_name, organization_number, bank_account"),
    ]);
    setSignups((s ?? []) as Signup[]);
    setClasses((c ?? []) as ClassRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const classById = useMemo(() => new Map(classes.map((c) => [c.id, c])), [classes]);

  const filtered = signups.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (classFilter !== "all" && s.class_id !== classFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const c = classById.get(s.class_id);
      return (
        s.customer_first_name.toLowerCase().includes(q) ||
        s.customer_last_name.toLowerCase().includes(q) ||
        s.customer_email.toLowerCase().includes(q) ||
        s.customer_phone.includes(q) ||
        s.city.toLowerCase().includes(q) ||
        (s.student_name ?? "").toLowerCase().includes(q) ||
        (c?.school_name ?? "").toLowerCase().includes(q) ||
        (c?.class_name ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pending = signups.filter((s) => s.status === "pending");
  const approvedRows = signups.filter((s) => s.status === "approved");
  const paidOut = signups.filter((s) => s.status === "paid_out");
  const rejected = signups.filter((s) => s.status === "rejected");
  const sum = (rows: Signup[]) => rows.reduce((acc, r) => acc + Number(r.commission_to_class || 0), 0);

  async function setStatus(rows: Signup[], status: string, extra: Record<string, unknown> = {}) {
    if (rows.length === 0) return;
    setBusy(true);
    const { error } = await supabase
      .from("hellofresh_signups")
      .update({ status, ...extra })
      .in("id", rows.map((r) => r.id));
    setBusy(false);
    if (error) {
      toast.error(friendlyError(error.message));
      return;
    }
    toast.success(`${rows.length} anmälningar uppdaterade till "${STATUS_LABEL[status]}".`);
    setSelected(new Set());
    load();
  }

  async function rejectWithReason() {
    if (!rejectTarget) return;
    await setStatus([rejectTarget], "rejected", { rejection_reason: rejectReason.trim() || null });
    setRejectTarget(null);
    setRejectReason("");
  }

  async function saveEdit() {
    if (!editTarget) return;
    setBusy(true);
    const { id, ...rest } = editDraft as any;
    delete rest.created_at;
    delete rest.updated_at;
    delete rest.status;
    delete rest.approved_at;
    delete rest.rejected_at;
    delete rest.paid_out_at;
    delete rest.commission_to_class;
    delete rest.consent_at;
    delete rest.consent_text;
    const { error } = await supabase.from("hellofresh_signups").update(rest).eq("id", editTarget.id);
    setBusy(false);
    if (error) {
      toast.error(friendlyError(error.message));
      return;
    }
    toast.success("Anmälan uppdaterad.");
    setEditTarget(null);
    load();
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedRows = filtered.filter((s) => selected.has(s.id));
  const selectedPending = selectedRows.filter((s) => s.status === "pending");
  const selectedApproved = selectedRows.filter((s) => s.status === "approved");

  function exportCsv() {
    const header = [
      "Datum", "Klasskod", "Skola", "Klass", "Elev", "Förnamn", "Efternamn", "E-post", "Telefon",
      "Gatuadress", "Postnummer", "Ort", "Leveransinfo", "Källa", "Status", "Ersättning", "Extra",
    ];
    const rows = filtered.map((s) => {
      const c = classById.get(s.class_id);
      return [
        new Date(s.created_at).toLocaleString("sv-SE"),
        (c as any)?.class_code ?? "",
        c?.school_name ?? "",
        c?.class_name ?? "",
        s.student_name ?? "",
        s.customer_first_name,
        s.customer_last_name,
        s.customer_email,
        s.customer_phone,
        s.street_address,
        s.postal_code,
        s.city,
        s.delivery_notes ?? "",
        s.source,
        STATUS_LABEL[s.status] ?? s.status,
        String(s.commission_to_class),
        JSON.stringify(s.extra ?? {}),
      ];
    });
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hellofresh-anmalningar.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Utbetalningsunderlag: godkända per klass
  const payoutByClass = useMemo(() => {
    const map = new Map<string, { count: number; total: number; rows: Signup[] }>();
    for (const s of approvedRows) {
      const cur = map.get(s.class_id) ?? { count: 0, total: 0, rows: [] };
      cur.count += 1;
      cur.total += Number(s.commission_to_class || 0);
      cur.rows.push(s);
      map.set(s.class_id, cur);
    }
    return map;
  }, [approvedRows]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <img src={hfLogo} alt="HelloFresh" className="h-8 w-auto" loading="lazy" />
        <div>
          <h1 className="text-2xl font-bold text-brand-950">HelloFresh-anmälningar</h1>
          <p className="text-sm text-stone-600">Godkänn, avvisa och betala ut ersättning till klasserna.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><p className="text-sm text-stone-600">Väntar</p></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-700">{pending.length}</p>
            <p className="text-xs text-stone-500 mt-1">{sum(pending).toLocaleString("sv-SE")} kr</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><p className="text-sm text-stone-600">Att betala ut</p></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-700">{approvedRows.length}</p>
            <p className="text-xs text-stone-500 mt-1">{sum(approvedRows).toLocaleString("sv-SE")} kr</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><p className="text-sm text-stone-600">Utbetalt totalt</p></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-950">{sum(paidOut).toLocaleString("sv-SE")}</p>
            <p className="text-xs text-stone-500 mt-1">kr</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><p className="text-sm text-stone-600">Avvisade</p></CardHeader>
          <CardContent><p className="text-3xl font-bold text-stone-500">{rejected.length}</p></CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" aria-hidden="true" />
          <Input
            placeholder="Sök namn, e-post, telefon, ort, klass..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla statusar</SelectItem>
            <SelectItem value="pending">Väntar</SelectItem>
            <SelectItem value="approved">Godkänd</SelectItem>
            <SelectItem value="paid_out">Utbetald</SelectItem>
            <SelectItem value="rejected">Avvisad</SelectItem>
          </SelectContent>
        </Select>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="md:w-56"><SelectValue placeholder="Alla klasser" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla klasser</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.school_name} · {c.class_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
          <Download className="h-4 w-4 mr-2" aria-hidden="true" />
          Exportera CSV (till HelloFresh)
        </Button>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 flex-wrap bg-brand-50 border border-brand-200 rounded-xl p-3">
          <span className="text-sm text-brand-900 font-medium">{selected.size} markerade</span>
          <Button
            size="sm"
            variant="outline"
            disabled={busy || selectedPending.length === 0}
            onClick={() => setStatus(selectedPending, "approved")}
          >
            Godkänn valda ({selectedPending.length})
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={busy || selectedApproved.length === 0}
            onClick={() => setStatus(selectedApproved, "paid_out")}
          >
            Markera valda som utbetalda ({selectedApproved.length})
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Rensa</Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-stone-500"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-stone-500">Inga anmälningar matchar.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Klass</TableHead>
                  <TableHead>Elev</TableHead>
                  <TableHead>Namn</TableHead>
                  <TableHead>E-post</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Adress</TableHead>
                  <TableHead>Källa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Belopp</TableHead>
                  <TableHead>Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => {
                  const c = classById.get(s.class_id);
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <Checkbox checked={selected.has(s.id)} onCheckedChange={() => toggleSelect(s.id)} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {new Date(s.created_at).toLocaleDateString("sv-SE")}
                      </TableCell>
                      <TableCell className="text-sm">
                        <Link to={`/admin/klasser/${s.class_id}`} className="text-brand-800 hover:underline">
                          {c?.school_name} {c?.class_name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm">{s.student_name ?? "—"}</TableCell>
                      <TableCell className="text-sm font-medium text-brand-950 whitespace-nowrap">
                        {s.customer_first_name} {s.customer_last_name}
                      </TableCell>
                      <TableCell className="text-sm">{s.customer_email}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{s.customer_phone}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {s.street_address}, {s.postal_code} {s.city}
                      </TableCell>
                      <TableCell className="text-xs text-stone-500">{s.source}</TableCell>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
                      <TableCell className="text-right font-semibold text-brand-900 whitespace-nowrap">
                        {Number(s.commission_to_class).toLocaleString("sv-SE")} kr
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {s.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline" disabled={busy} onClick={() => setStatus([s], "approved")}>
                                Godkänn
                              </Button>
                              <Button
                                size="sm" variant="outline" disabled={busy}
                                className="text-red-700 border-red-200 hover:bg-red-50"
                                onClick={() => { setRejectTarget(s); setRejectReason(""); }}
                              >
                                Avvisa
                              </Button>
                            </>
                          )}
                          {s.status === "approved" && (
                            <Button size="sm" variant="outline" disabled={busy} onClick={() => setStatus([s], "paid_out")}>
                              Markera utbetald
                            </Button>
                          )}
                          {s.status !== "pending" && (
                            <Button size="sm" variant="ghost" disabled={busy} onClick={() => setStatus([s], "pending")}>
                              Återställ
                            </Button>
                          )}
                          <Button
                            size="sm" variant="ghost" disabled={busy}
                            onClick={() => { setEditTarget(s); setEditDraft({ ...s }); }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Utbetalningsunderlag */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-950 flex items-center gap-2">
            <Wallet className="h-5 w-5" aria-hidden="true" />
            Utbetalningsunderlag
          </CardTitle>
          <p className="text-sm text-stone-600">Godkända anmälningar per klass, redo att betalas ut till föreningens konto.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {payoutByClass.size === 0 ? (
            <p className="text-sm text-stone-500">Inga godkända anmälningar väntar på utbetalning.</p>
          ) : (
            Array.from(payoutByClass.entries()).map(([classId, info]) => {
              const c = classById.get(classId);
              return (
                <div key={classId} className="border border-stone-200 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-brand-950">{c?.school_name} · {c?.class_name}</p>
                    <p className="text-sm text-stone-600">
                      {c?.association_name} · org.nr {c?.organization_number} · konto {c?.bank_account}
                    </p>
                    <p className="text-sm text-stone-600 mt-1">
                      {info.count} anmälningar · <strong>{info.total.toLocaleString("sv-SE")} kr</strong>
                    </p>
                  </div>
                  <Button
                    disabled={busy}
                    className="bg-brand-900 hover:bg-brand-800"
                    onClick={() => setStatus(info.rows, "paid_out")}
                  >
                    Markera som utbetalt
                  </Button>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Avvisa-dialog */}
      <Dialog open={!!rejectTarget} onOpenChange={(o) => !o && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-brand-950">Avvisa anmälan</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-600">
            {rejectTarget?.customer_first_name} {rejectTarget?.customer_last_name} avvisas och räknas bort från klassens totalsumma.
          </p>
          <div>
            <Label htmlFor="reject-reason">Anledning (valfritt)</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="T.ex. dubblett eller ogiltig anmälan"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Avbryt</Button>
            <Button
              className="bg-red-700 hover:bg-red-800 text-white"
              disabled={busy}
              onClick={rejectWithReason}
            >
              Avvisa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Redigera-dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-950">Redigera anmälan</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <div className="space-y-3">
              {(
                [
                  ["customer_first_name", "Förnamn"],
                  ["customer_last_name", "Efternamn"],
                  ["customer_email", "E-post"],
                  ["customer_phone", "Telefon"],
                  ["street_address", "Gatuadress"],
                  ["postal_code", "Postnummer"],
                  ["city", "Ort"],
                  ["delivery_notes", "Leveransinfo"],
                  ["student_name", "Elev"],
                  ["hellofresh_reference", "HelloFresh-referens"],
                ] as [keyof Signup, string][]
              ).map(([key, label]) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <Input
                    className="mt-1"
                    value={(editDraft[key] as string) ?? ""}
                    onChange={(e) => setEditDraft((d) => ({ ...d, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <Label>Interna anteckningar</Label>
                <Textarea
                  className="mt-1"
                  value={editDraft.admin_notes ?? ""}
                  onChange={(e) => setEditDraft((d) => ({ ...d, admin_notes: e.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditTarget(null)}>Avbryt</Button>
                <Button className="bg-brand-900 hover:bg-brand-800" disabled={busy} onClick={saveEdit}>
                  Spara
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
