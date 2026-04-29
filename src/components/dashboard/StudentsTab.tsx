import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, UserPlus } from "lucide-react";

interface Props {
  klass: any;
}

export default function StudentsTab({ klass }: Props) {
  const [students, setStudents] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadStudents() {
    setLoading(true);
    const { data } = await supabase
      .from("students")
      .select("*")
      .eq("class_id", klass.id)
      .order("name");
    setStudents(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadStudents();
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

  async function updateStudent(id: string, field: "sold_gold" | "sold_crema", value: number) {
    const { error } = await supabase
      .from("students")
      .update({ [field]: Math.max(0, value) })
      .eq("id", id);
    if (error) toast.error("Kunde inte uppdatera");
    else loadStudents();
  }

  async function removeStudent(id: string) {
    if (!confirm("Ta bort denna elev?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) toast.error("Kunde inte ta bort");
    else loadStudents();
  }

  const totalGold = students.reduce((s, e) => s + (e.sold_gold || 0), 0);
  const totalCrema = students.reduce((s, e) => s + (e.sold_crema || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-950">Eleverna</CardTitle>
          <p className="text-sm text-stone-600">
            Skriv in vad varje elev sålt. När alla är klara går du till Beställning för att summera och skicka in.
          </p>
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
                      value={s.sold_gold || 0}
                      onChange={(e) => updateStudent(s.id, "sold_gold", parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs text-stone-500 block">Crema</label>
                    <Input
                      type="number"
                      min={0}
                      value={s.sold_crema || 0}
                      onChange={(e) => updateStudent(s.id, "sold_crema", parseInt(e.target.value) || 0)}
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