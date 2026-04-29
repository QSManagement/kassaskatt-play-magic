import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Search, GraduationCap } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: "Väntande", className: "bg-amber-100 text-amber-800 border-amber-200" },
    lead: { label: "Lead", className: "bg-stone-100 text-stone-700 border-stone-200" },
    active: { label: "Aktiv", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    completed: { label: "Avslutad", className: "bg-stone-100 text-stone-600 border-stone-200" },
    cancelled: { label: "Avbruten", className: "bg-red-50 text-red-700 border-red-200" },
  };
  const config = map[status] || { label: status, className: "bg-stone-100" };
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

export default function AdminClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("class_registrations")
      .select("*")
      .order("created_at", { ascending: false });
    setClasses(data || []);
    setLoading(false);
  }

  const filtered = classes.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        (c.school_name || "").toLowerCase().includes(s) ||
        (c.class_name || "").toLowerCase().includes(s) ||
        (c.contact_name || "").toLowerCase().includes(s) ||
        (c.contact_email || "").toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-950 tracking-tight">Klasser</h1>
        <p className="text-stone-600 mt-1">
          {classes.length} klasser totalt · {classes.filter((c) => c.status === "active").length} aktiva
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" aria-hidden="true" />
          <Input
            placeholder="Sök skola, klass eller kontaktperson..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla statusar</SelectItem>
            <SelectItem value="pending">Väntande</SelectItem>
            <SelectItem value="active">Aktiva</SelectItem>
            <SelectItem value="completed">Avslutade</SelectItem>
            <SelectItem value="cancelled">Avbrutna</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-stone-500">Laddar...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-stone-500">
              <GraduationCap className="h-8 w-8 mx-auto mb-3 text-stone-300" aria-hidden="true" />
              Inga klasser matchar filtret.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skola / Klass</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Elever</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Insamlat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer hover:bg-stone-50"
                    onClick={() => {
                      window.location.href = `/admin/klasser/${c.id}`;
                    }}
                  >
                    <TableCell className="font-medium text-emerald-950">
                      <Link to={`/admin/klasser/${c.id}`} className="hover:underline">
                        {c.school_name}
                        {c.class_name && <span className="text-stone-500 ml-2">· {c.class_name}</span>}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{c.contact_name}</div>
                      <div className="text-xs text-stone-500">{c.contact_email}</div>
                    </TableCell>
                    <TableCell className="text-stone-700">{c.student_count}</TableCell>
                    <TableCell>
                      <StatusBadge status={c.status} />
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-900">
                      {Number(c.total_to_class || 0).toLocaleString("sv-SE")} kr
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