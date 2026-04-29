import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  GraduationCap,
  Inbox,
  TrendingUp,
  Sparkles,
  Package,
  ArrowRight,
} from "lucide-react";

interface Stats {
  activeClasses: number;
  pendingLeads: number;
  totalSoldGold: number;
  totalSoldCrema: number;
  totalRevenue: number;
  totalToClasses: number;
  repurchaseTotal: number;
  ordersThisMonth: number;
  topClasses: Array<{ id: string; name: string; total: number }>;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      { data: classes },
      { count: pendingLeads },
      { data: orders },
      { count: ordersThisMonth },
      { data: repurchases },
    ] = await Promise.all([
      supabase
        .from("class_registrations")
        .select("id, school_name, class_name, total_to_class, status, total_sold_gold, total_sold_crema"),
      supabase
        .from("class_registrations")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("orders").select("qty_gold, qty_crema, total_to_class, total_to_invoice"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString()),
      supabase.from("repurchases").select("bonus_to_class"),
    ]);

    const activeClasses = (classes ?? []).filter((c) => c.status === "active").length;
    const totalSoldGold = (orders ?? []).reduce((s, o) => s + (o.qty_gold || 0), 0);
    const totalSoldCrema = (orders ?? []).reduce((s, o) => s + (o.qty_crema || 0), 0);
    const totalRevenue = (orders ?? []).reduce((s, o) => s + Number(o.total_to_invoice || 0), 0);
    const totalToClasses = (orders ?? []).reduce((s, o) => s + Number(o.total_to_class || 0), 0);
    const repurchaseTotal = (repurchases ?? []).reduce((s, r) => s + Number(r.bonus_to_class || 0), 0);

    const topClasses = (classes ?? [])
      .filter((c) => c.status === "active" && Number(c.total_to_class) > 0)
      .map((c) => ({
        id: c.id,
        name: `${c.school_name} ${c.class_name || ""}`.trim(),
        total: Number(c.total_to_class || 0),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    setStats({
      activeClasses,
      pendingLeads: pendingLeads || 0,
      totalSoldGold,
      totalSoldCrema,
      totalRevenue,
      totalToClasses,
      repurchaseTotal,
      ordersThisMonth: ordersThisMonth || 0,
      topClasses,
    });
  }

  if (!stats) {
    return <div className="text-stone-500">Laddar...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-950 tracking-tight">Översikt</h1>
        <p className="text-stone-600 mt-1">Allt du behöver veta om Qlasskassan just nu.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={GraduationCap} label="Aktiva klasser" value={stats.activeClasses} color="emerald" />
        <KpiCard icon={Inbox} label="Väntande leads" value={stats.pendingLeads} color="amber" link="/admin/leads" />
        <KpiCard icon={Package} label="Ordrar denna månad" value={stats.ordersThisMonth} color="emerald" link="/admin/ordrar" />
        <KpiCard
          icon={Sparkles}
          label="Återköpsbonus"
          value={`${stats.repurchaseTotal.toLocaleString("sv-SE")} kr`}
          color="amber"
          link="/admin/aterkop"
        />
      </div>

      <Card className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white border-0">
        <CardContent className="pt-8 pb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-emerald-200 text-xs uppercase tracking-wide">Total fakturerat</p>
              <p className="text-4xl font-bold mt-2 tracking-tight">
                {stats.totalRevenue.toLocaleString("sv-SE")}{" "}
                <span className="text-2xl text-emerald-200">kr</span>
              </p>
              <p className="text-emerald-300 text-sm mt-1">Inkl. moms 6%</p>
            </div>
            <div>
              <p className="text-emerald-200 text-xs uppercase tracking-wide">Till klasser</p>
              <p className="text-4xl font-bold mt-2 tracking-tight">
                {stats.totalToClasses.toLocaleString("sv-SE")}{" "}
                <span className="text-2xl text-emerald-200">kr</span>
              </p>
              <p className="text-emerald-300 text-sm mt-1">Klassens andel</p>
            </div>
            <div>
              <p className="text-emerald-200 text-xs uppercase tracking-wide">Sålda påsar</p>
              <p className="text-4xl font-bold mt-2 tracking-tight">
                {(stats.totalSoldGold + stats.totalSoldCrema).toLocaleString("sv-SE")}
              </p>
              <p className="text-emerald-300 text-sm mt-1">
                {stats.totalSoldGold} Gold · {stats.totalSoldCrema} Crema
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-950">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
            Top-presterande klasser
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topClasses.length === 0 ? (
            <p className="text-stone-500 text-sm">Inga klasser har sålt något än.</p>
          ) : (
            <div className="space-y-3">
              {stats.topClasses.map((c, i) => (
                <Link
                  key={c.id}
                  to={`/admin/klasser/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <p className="font-medium text-emerald-950">{c.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-emerald-900">{c.total.toLocaleString("sv-SE")} kr</p>
                    <ArrowRight className="h-4 w-4 text-stone-400 group-hover:text-emerald-700" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface KpiCardProps {
  icon: typeof GraduationCap;
  label: string;
  value: string | number;
  color: "emerald" | "amber";
  link?: string;
}

function KpiCard({ icon: Icon, label, value, color, link }: KpiCardProps) {
  const colorClasses =
    color === "emerald" ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50";

  const content = (
    <Card className={`${colorClasses} hover:shadow-md transition-shadow`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <Icon
            className={`h-5 w-5 ${color === "emerald" ? "text-emerald-700" : "text-amber-700"}`}
            aria-hidden="true"
          />
          {link && <ArrowRight className="h-4 w-4 text-stone-400" aria-hidden="true" />}
        </div>
        <p className="text-stone-600 text-sm mt-3">{label}</p>
        <p className="text-2xl font-bold text-emerald-950 mt-1">{value}</p>
      </CardContent>
    </Card>
  );

  return link ? <Link to={link}>{content}</Link> : content;
}