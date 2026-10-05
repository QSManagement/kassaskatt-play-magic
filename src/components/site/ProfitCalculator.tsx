import { useState } from "react";
import { ArrowRight, Calculator, Coffee, Repeat, Salad } from "lucide-react";
import { usePricing } from "@/hooks/usePricing";

export default function ProfitCalculator({
  includeHelloFresh,
  onRegister,
}: {
  includeHelloFresh: boolean;
  onRegister: () => void;
}) {
  const pricing = usePricing();
  const [coffeeOn, setCoffeeOn] = useState(true);
  const [hfOn, setHfOn] = useState(true);
  const [students, setStudents] = useState(25);
  const [goldPerStudent, setGoldPerStudent] = useState(4);
  const [cremaPerStudent, setCremaPerStudent] = useState(6);
  const [hfPerStudent, setHfPerStudent] = useState(1);
  const hfCustomers = includeHelloFresh && hfOn ? students * hfPerStudent : 0;

  const goldBags = coffeeOn ? students * goldPerStudent : 0;
  const cremaBags = coffeeOn ? students * cremaPerStudent : 0;
  const totalBags = goldBags + cremaBags;
  const cremaEarnings = cremaBags * pricing.margin_crema;
  const goldEarnings = goldBags * pricing.margin_gold;
  const coffeeEarnings = cremaEarnings + goldEarnings;
  const reorderEarnings = Math.round(coffeeEarnings * 0.05);
  const hfEarnings = hfCustomers * pricing.margin_hellofresh;
  const grandTotal = coffeeEarnings + hfEarnings;

  const slider = "w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer";
  const checkboxBase = "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition cursor-pointer select-none text-left";
  const checkboxOn = "border-brand-900 bg-white shadow-sm";
  const checkboxOff = "border-stone-300 bg-stone-100 opacity-70";

  const productToggle = (
    checked: boolean,
    onToggle: () => void,
    icon: React.ReactNode,
    label: string,
  ) => (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={`${checkboxBase} ${checked ? checkboxOn : checkboxOff}`}
    >
      <span
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
          checked ? "border-brand-900 bg-brand-900 text-white" : "border-stone-400"
        }`}
        aria-hidden="true"
      >
        {checked && (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {icon}
      <span className="font-semibold text-brand-950">{label}</span>
    </button>
  );

  return (
    <section id="kalkylator" className="scroll-mt-28 py-24 px-6 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 relative overflow-hidden">
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
          <p className="text-amber-100/70 text-lg">Välj vad ni vill sälja och justera — se direkt hur mycket som hamnar i kassan.</p>
        </div>

        <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-3">
              {productToggle(coffeeOn, () => setCoffeeOn(!coffeeOn), <Coffee className="w-5 h-5 text-amber-700" aria-hidden="true" />, "Kaffe")}
              {includeHelloFresh && productToggle(hfOn, () => setHfOn(!hfOn), <Salad className="w-5 h-5 text-hf-lime" aria-hidden="true" />, "HelloFresh")}
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label className="font-semibold text-brand-950">Antal elever i klassen</label>
                <span className="text-3xl font-bold text-brand-900">{students}</span>
              </div>
              <input type="range" min="0" max="50" value={students} onChange={(e) => setStudents(Number(e.target.value))} className={`${slider} accent-brand-800`} aria-label="Antal elever" />
              <div className="flex justify-between text-xs text-brand-900/50 mt-1"><span>0</span><span>50</span></div>
            </div>
            {coffeeOn && (
              <>
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <label className="font-semibold text-brand-950">Antal Gold per elev</label>
                    <span className="text-3xl font-bold text-brand-900">{goldPerStudent}</span>
                  </div>
                  <input type="range" min="0" max="50" value={goldPerStudent} onChange={(e) => setGoldPerStudent(Number(e.target.value))} className={`${slider} accent-brand-800`} aria-label="Antal Gold per elev" />
                  <div className="flex justify-between text-xs text-brand-900/50 mt-1"><span>0</span><span>50</span></div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <label className="font-semibold text-brand-950">Antal Crema per elev</label>
                    <span className="text-3xl font-bold text-brand-900">{cremaPerStudent}</span>
                  </div>
                  <input type="range" min="0" max="50" value={cremaPerStudent} onChange={(e) => setCremaPerStudent(Number(e.target.value))} className={`${slider} accent-amber-700`} aria-label="Antal Crema per elev" />
                  <div className="flex justify-between text-xs text-brand-900/50 mt-1"><span>0</span><span>50</span></div>
                </div>
              </>
            )}
            {includeHelloFresh && hfOn && (
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="font-semibold text-brand-950">HelloFresh-kunder</label>
                  <span className="text-3xl font-bold text-brand-900">{hfCustomersRaw}</span>
                </div>
                <input type="range" min="0" max="50" value={hfCustomersRaw} onChange={(e) => setHfCustomers(Number(e.target.value))} className={`${slider} accent-brand-800`} aria-label="Antal HelloFresh-kunder" />
                <div className="flex justify-between text-xs text-brand-900/50 mt-1"><span>0</span><span>50</span></div>
                <div className="text-xs text-brand-900/60 mt-2">{pricing.margin_hellofresh} kr till klassen per godkänd anmälan — kunderna anmäler sig själva via er länk.</div>
              </div>
            )}
          </div>

          <div className="bg-brand-950 rounded-2xl p-6 sm:p-8 text-amber-50 flex flex-col justify-between">
            <div>
              <div className="text-amber-200/70 text-sm font-medium mb-2">Total intäkt till klasskassan</div>
              <div className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-2">
                {grandTotal.toLocaleString("sv-SE")}
                <span className="text-2xl text-amber-200/70 ml-2">kr</span>
              </div>
              <div className="text-amber-200/60 text-sm mb-3">
                Baserat på {totalBags} sålda förpackningar{hfCustomers > 0 ? ` + ${hfCustomers} HelloFresh-kunder` : ""}
              </div>
              {coffeeOn && (
                <div className="inline-flex items-center gap-2 bg-amber-300/15 text-amber-200 px-3 py-1.5 rounded-full text-xs font-medium mb-8">
                  <Repeat className="w-3 h-3 shrink-0" aria-hidden="true" />
                  + ungefär {reorderEarnings.toLocaleString("sv-SE")} kr extra från Återköpsklubben på kaffet (6 mån)
                </div>
              )}
              <div className="space-y-3 pt-6 border-t border-brand-800">
                {coffeeOn && (
                  <>
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-amber-100/80 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-300 shrink-0"></span>
                        Crema ({cremaBags} förpackningar × {pricing.margin_crema} kr)
                      </span>
                      <span className="font-bold whitespace-nowrap">{cremaEarnings.toLocaleString("sv-SE")} kr</span>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-amber-100/80 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-400 shrink-0"></span>
                        Gold ({goldBags} förpackningar × {pricing.margin_gold} kr)
                      </span>
                      <span className="font-bold whitespace-nowrap">{goldEarnings.toLocaleString("sv-SE")} kr</span>
                    </div>
                  </>
                )}
                {hfCustomers > 0 && (
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-amber-100/80 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-hf-lime shrink-0"></span>
                      HelloFresh ({hfCustomers} kunder × {pricing.margin_hellofresh} kr)
                    </span>
                    <span className="font-bold whitespace-nowrap">{hfEarnings.toLocaleString("sv-SE")} kr</span>
                  </div>
                )}
                {grandTotal === 0 && (
                  <div className="text-amber-100/60 text-sm">Bocka i kaffe eller HelloFresh för att räkna.</div>
                )}
              </div>
            </div>
            <button onClick={onRegister} className="mt-8 bg-amber-300 text-brand-950 px-6 py-4 rounded-full font-bold hover:bg-amber-200 transition flex items-center justify-center gap-2 group">
              Starta er försäljning nu
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
