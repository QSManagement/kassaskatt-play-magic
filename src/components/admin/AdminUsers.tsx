import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

export default function AdminUsers() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: roles } = await supabase
      .from("user_roles")
      .select(
        "user_id, role, class_id, created_at, class_registrations:class_id ( school_name, class_name )",
      )
      .order("created_at", { ascending: false });

    const userIds = [...new Set((roles ?? []).map((r) => r.user_id))];

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", userIds);

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

    const enriched = (roles ?? []).map((r) => ({
      ...r,
      profile: profileMap.get(r.user_id),
    }));

    setAdmins(enriched.filter((r) => r.role === "admin"));
    setTeachers(enriched.filter((r) => r.role === "teacher"));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-950 tracking-tight">Användare</h1>
        <p className="text-stone-600 mt-1">
          {admins.length} admin · {teachers.length} lärare
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-emerald-950 mb-4">Admins</h2>
          {admins.length === 0 ? (
            <p className="text-stone-500 text-sm">Inga admins.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mejl</TableHead>
                  <TableHead>Namn</TableHead>
                  <TableHead>Tillagd</TableHead>
                  <TableHead>Roll</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((a) => (
                  <TableRow key={a.user_id + (a.class_id || "")}>
                    <TableCell>{a.profile?.email || "–"}</TableCell>
                    <TableCell>{a.profile?.full_name || "–"}</TableCell>
                    <TableCell className="text-sm text-stone-600">
                      {new Date(a.created_at).toLocaleDateString("sv-SE")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-emerald-100 text-emerald-800 border-emerald-200"
                      >
                        Admin
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-emerald-950 mb-4">Lärare</h2>
          {teachers.length === 0 ? (
            <p className="text-stone-500 text-sm">
              <Users className="h-6 w-6 inline mr-2 text-stone-300" aria-hidden="true" />
              Inga aktiva lärare än. När admin aktiverar en klass dyker läraren upp här.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mejl</TableHead>
                  <TableHead>Namn</TableHead>
                  <TableHead>Klass</TableHead>
                  <TableHead>Aktiverad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((t) => (
                  <TableRow key={t.user_id + (t.class_id || "")}>
                    <TableCell>{t.profile?.email || "–"}</TableCell>
                    <TableCell>{t.profile?.full_name || "–"}</TableCell>
                    <TableCell className="text-sm">
                      {t.class_registrations?.school_name}
                      {t.class_registrations?.class_name && (
                        <span className="text-stone-500 ml-1">
                          · {t.class_registrations.class_name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-stone-600">
                      {new Date(t.created_at).toLocaleDateString("sv-SE")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="bg-stone-50 border-stone-200">
        <CardContent className="pt-6">
          <p className="text-sm text-stone-600">
            <strong>Lägga till admin:</strong> Be Lovable skapa en användare i backend, sedan tilldela rollen
            via en migrations-snutt: <code className="text-xs">INSERT INTO user_roles (user_id, role) VALUES ('USER_UUID', 'admin');</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}