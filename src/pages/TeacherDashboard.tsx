import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, ShoppingBag, Users, Sparkles, Settings } from "lucide-react";
import { toast } from "sonner";

import OverviewTab from "@/components/dashboard/OverviewTab";
import OrderTab from "@/components/dashboard/OrderTab";
import StudentsTab from "@/components/dashboard/StudentsTab";
import RepurchasesTab from "@/components/dashboard/RepurchasesTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import HelpDialog from "@/components/dashboard/HelpDialog";

export default function TeacherDashboard() {
  const { classId, user } = useAuth();
  const [klass, setKlass] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function reloadKlass() {
    if (!classId) return;
    const { data, error } = await supabase
      .from("class_registrations")
      .select("*")
      .eq("id", classId)
      .single();
    if (error) toast.error("Kunde inte ladda klassinformation");
    else setKlass(data);
  }

  useEffect(() => {
    if (!classId) {
      setLoading(false);
      return;
    }
    reloadKlass().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  async function handleSignOut() {
    await signOut();
    toast.success("Du är utloggad");
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-stone-600">Laddar...</div>;
  }

  if (!klass) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-600">
        <div className="text-center">
          <p className="mb-4">Vi kunde inte hitta din klass.</p>
          <Button onClick={handleSignOut} variant="outline">Logga ut</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" variant="dark" />
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-emerald-950 leading-tight">
                {klass.school_name}
              </h1>
              <p className="text-sm text-stone-600">
                {klass.class_name} · {klass.student_count} elever
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <HelpDialog />
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
              Logga ut
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList
            className={`grid w-full ${klass.tracking_mode === "per_student" ? "grid-cols-5" : "grid-cols-4"} mb-8 h-auto gap-1`}
          >
            <TabsTrigger value="overview" className="flex-col md:flex-row gap-1 md:gap-2 py-2 md:py-3 text-[11px] md:text-sm">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              <span>Översikt</span>
            </TabsTrigger>
            <TabsTrigger value="order" className="flex-col md:flex-row gap-1 md:gap-2 py-2 md:py-3 text-[11px] md:text-sm">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span>Beställ</span>
            </TabsTrigger>
            {klass.tracking_mode === "per_student" && (
              <TabsTrigger value="students" className="flex-col md:flex-row gap-1 md:gap-2 py-2 md:py-3 text-[11px] md:text-sm">
                <Users className="h-4 w-4" aria-hidden="true" />
                <span>Elever</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="repurchases" className="flex-col md:flex-row gap-1 md:gap-2 py-2 md:py-3 text-[11px] md:text-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Återköp</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-col md:flex-row gap-1 md:gap-2 py-2 md:py-3 text-[11px] md:text-sm">
              <Settings className="h-4 w-4" aria-hidden="true" />
              <span>Inställ.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab klass={klass} /></TabsContent>
          <TabsContent value="order"><OrderTab klass={klass} onOrdersChanged={reloadKlass} /></TabsContent>
          {klass.tracking_mode === "per_student" && (
            <TabsContent value="students"><StudentsTab klass={klass} /></TabsContent>
          )}
          <TabsContent value="repurchases"><RepurchasesTab klass={klass} /></TabsContent>
          <TabsContent value="settings"><SettingsTab klass={klass} user={user} onUpdated={reloadKlass} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}