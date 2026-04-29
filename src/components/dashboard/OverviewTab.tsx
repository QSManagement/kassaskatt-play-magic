import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Coffee, TrendingUp, Calendar, Sparkles } from "lucide-react";

interface Props {
  klass: any;
}

export default function OverviewTab({ klass }: Props) {
  const [repurchaseTotal, setRepurchaseTotal] = useState(0);

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

  const totalEarned = Number(klass.total_to_class || 0) + repurchaseTotal;
  const goal = klass.goal_amount || 0;
  const progressPct = goal > 0 ? Math.min(100, (totalEarned / goal) * 100) : 0;

  const daysLeft = klass.campaign_end
    ? Math.max(0, Math.ceil((new Date(klass.campaign_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

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
            <p className="text-3xl font-bold text-emerald-950">{klass.total_sold_gold || 0}</p>
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
            <p className="text-3xl font-bold text-emerald-950">{klass.total_sold_crema || 0}</p>
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
    </div>
  );
}