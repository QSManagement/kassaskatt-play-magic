import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Inbox, ExternalLink, Mail } from "lucide-react";

export default function AdminLeads() {
  const [pending, setPending] = useState<any[]>([]);
  const [otherLeads, setOtherLeads] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [{ data: regs }, { data: leads }] = await Promise.all([
      supabase
        .from("class_registrations")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      supabase
        .from("qlasskassan_leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    setPending(regs || []);
    setOtherLeads(leads || []);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-950 tracking-tight">Leads</h1>
        <p className="text-stone-600 mt-1">
          {pending.length} väntar på aktivering · {otherLeads.length} startguide-/info-leads
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Klassregistreringar ({pending.length})</TabsTrigger>
          <TabsTrigger value="other">Startguide & info ({otherLeads.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              {pending.length === 0 ? (
                <div className="p-8 text-center text-stone-500">
                  <Inbox className="h-8 w-8 mx-auto mb-3 text-stone-300" aria-hidden="true" />
                  Inga väntande klassregistreringar.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Anmäld</TableHead>
                      <TableHead>Skola / Klass</TableHead>
                      <TableHead>Kontakt</TableHead>
                      <TableHead>Förening</TableHead>
                      <TableHead className="text-right" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-sm text-stone-600">
                          {new Date(p.created_at).toLocaleDateString("sv-SE")}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-emerald-950">{p.school_name}</div>
                          {p.class_name && (
                            <div className="text-xs text-stone-500">
                              {p.class_name} · {p.student_count} elever
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{p.contact_name}</div>
                          <div className="text-xs text-stone-500">{p.contact_email}</div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {p.association_name}
                          <div className="text-xs text-stone-500">{p.organization_number}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/admin/klasser/${p.id}`}>
                              Granska
                              <ExternalLink className="h-3 w-3 ml-1" aria-hidden="true" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other">
          <Card>
            <CardContent className="p-0">
              {otherLeads.length === 0 ? (
                <div className="p-8 text-center text-stone-500">Inga leads än.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Källa</TableHead>
                      <TableHead>Namn</TableHead>
                      <TableHead>Mejl</TableHead>
                      <TableHead>Skola</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {otherLeads.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="text-sm text-stone-600">
                          {new Date(l.created_at).toLocaleDateString("sv-SE")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{l.source}</Badge>
                        </TableCell>
                        <TableCell>{l.name || "–"}</TableCell>
                        <TableCell>
                          <a
                            href={`mailto:${l.email}`}
                            className="text-amber-700 hover:underline inline-flex items-center gap-1"
                          >
                            <Mail className="h-3 w-3" aria-hidden="true" />
                            {l.email}
                          </a>
                        </TableCell>
                        <TableCell className="text-sm">{l.school_name || "–"}</TableCell>
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