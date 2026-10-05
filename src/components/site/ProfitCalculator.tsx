import { useState } from "react";
import { ArrowRight, Calculator, Repeat } from "lucide-react";
import { usePricing } from "@/hooks/usePricing";

export default function ProfitCalculator({
  includeHelloFresh,
  onRegister,
}: {
  includeHelloFresh: boolean;
  onRegister: () => void;
}) {
  const pricing = usePricing();
  const [students, setStudents] = useState(25);
  const [bagsPerStudent, setBagsPerStudent] = useState(10);
  const [cremaRatio, setCremaRatio] = useState(60);
  const [hfCustomersRaw, setHfCustomers] = useState(5);
  const hfCustomers = includeHelloFresh ? hfCustomersRaw : 0;

  const totalBags = students * bagsPerStudent;
  const cremaBags = Math.round(totalBags * (cremaRatio / 100));
  const goldBags = totalBags - cremaBags;
  const cremaEarnings = cremaBags * pricing.margin_crema;
  const goldEarnings = goldBags * pricing.margin_gold;
  const coffeeEarnings = cremaEarnings + goldEarnings;
  const reorderEarnings = Math.round(coffeeEarnings * 0.05);
  const hfEarnings = hfCustomers * pricing.margin_hellofresh;
  const grandTotal = coffeeEarnings + hfEarnings;

  const slider = "w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer";

  return (
    <section id="kalkylator" className="scroll-mt-28 py-24 px-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-300 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-300/20 text-amber-200 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" aria-hidden="true" /> Räkna ut er potential
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-4 leading-tight">
            Hur mycket kan <span className="italic text-amber-300">er klass</span> tjäna?
          </h2>
          <p className="text-amber-100/70 text-lg">Justera och se direkt hur mycket som hamnar i kassan.</p>
        </div>

        <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label className="font-semibold text-emerald-950">Antal elever i klassen</label>
                <span className="text-3xl font-bold text-emerald-900">{students}</span>
              </div>
              <input type="range" min="1" max="50" value={students} onChange={(e) => setStudents(Number(e.target.value))} className={`${slider} accent-emerald-800`} aria-label="Antal elever" />
              <div className="flex justify-between text-xs text-emerald-900/50 mt-1"><span>10</span><span>50</span></div>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label className="font-semibold text-emerald-950">Förpackningar per elev</label>
                <span className="text-3xl font-bold text-emerald-900">{bagsPerStudent}</span>
              </div>
              <input type="range" min="0" max="50" value={bagsPerStudent} onChange={(e) => setBagsPerStudent(Number(e.target.value))} className={`${slider} accent-emerald-800`} aria-label="Förpackningar per elev" />
              <div className="flex justify-between text-xs text-emerald-900/50 mt-1"><span>1</span><span>50</span></div>
              <div className="text-xs text-emerald-900/60 mt-2">Snitt hos våra klasser: 8 förpackningar/elev</div>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label className="font-semibold text-emerald-950">Andel Crema (premium)</label>
                <span className="text-3xl font-bold text-emerald-900">{cremaRatio}%</span>
              </div>
              <input type="range" min="0" max="100" value={cremaRatio} onChange={(e) => setCremaRatio(Number(e.target.value))} className={`${slider} accent-amber-700`} aria-label="Andel Crema" />
              <div className="flex justify-between text-xs text-emerald-900/50 mt-1"><span>Bara Gold</span><span>Bara Crema</span></div>
            </div>
            {includeHelloFresh && (
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="font-semibold text-emerald-950">HelloFresh-kunder</label>
                  <span className="text-3xl font-bold text-emerald-900">{hfCustomersRaw}</span>
                </div>
                <input type="range" min="0" max="50" value={hfCustomersRaw} onChange={(e) => setHfCustomers(Number(e.target.value))} className={`${slider} accent-emerald-800`} aria-label="Antal HelloFresh-kunder" />
                <div className="flex justify-between text-xs text-emerald-900/50 mt-1"><span>0</span><span>30</span></div>
                <div className="text-xs text-emerald-900/60 mt-2">{pricing.margin_hellofresh} kr till klassen per godkänd anmälan — kunderna anmäler sig själva via er länk.</div>
              </div>
            )}
          </div>

          <div className="bg-emerald-950 rounded-2xl p-6 sm:p-8 text-amber-50 flex flex-col justify-between">
            <div>
              <div className="text-amber-200/70 text-sm font-medium mb-2">Total intäkt till klasskassan</div>
              <div className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-2">
                {grandTotal.toLocaleString("sv-SE")}
                <span className="text-2xl text-amber-200/70 ml-2">kr</span>
              </div>
              <div className="text-amber-200/60 text-sm mb-3">
                Baserat på {totalBags} sålda förpackningar{hfCustomers > 0 ? ` + ${hfCustomers} HelloFresh-kunder` : ""}
              </div>
              <div className="inline-flex items-center gap-2 bg-amber-300/15 text-amber-200 px-3 py-1.5 rounded-full text-xs font-medium mb-8">
                <Repeat className="w-3 h-3 shrink-0" aria-hidden="true" />
                + ungefär {reorderEarnings.toLocaleString("sv-SE")} kr extra från Återköpsklubben på kaffet (6 mån)
              </div>
              <div className="space-y-3 pt-6 border-t border-emerald-800">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-amber-100/80 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-300 shrink-0"></span>
                    Crema ({cremaBags} förpackningar × {pricing.margin_crema} kr)
                  </span>
                  <span className="font-bold whitespace-nowrap">{cremaEarnings.toLocaleString("sv-SE")} kr</span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-amber-100/80 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                    Gold ({goldBags} förpackningar × {pricing.margin_gold} kr)
                  </span>
                  <span className="font-bold whitespace-nowrap">{goldEarnings.toLocaleString("sv-SE")} kr</span>
                </div>
                {hfCustomers > 0 && (
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-amber-100/80 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-hf-lime shrink-0"></span>
                      HelloFresh ({hfCustomers} kunder × {pricing.margin_hellofresh} kr)
                    </span>
                    <span className="font-bold whitespace-nowrap">{hfEarnings.toLocaleString("sv-SE")} kr</span>
                  </div>
                )}
              </div>
            </div>
            <button onClick={onRegister} className="mt-8 bg-amber-300 text-emerald-950 px-6 py-4 rounded-full font-bold hover:bg-amber-200 transition flex items-center justify-center gap-2 group">
              Starta er försäljning nu
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
