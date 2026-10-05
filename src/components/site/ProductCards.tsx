import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { usePricing } from "@/hooks/usePricing";
import coffeeGold from "@/assets/coffee-gold.png";
import coffeeCrema from "@/assets/coffee-crema.png";
import hfBox from "@/assets/hellofresh/hellofresh-box.webp";

const cardBase =
  "bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative flex flex-col h-full";

export function GoldCard({ showLink = true }: { showLink?: boolean }) {
  const pricing = usePricing();
  return (
    <div className={`${cardBase} border border-stone-200`}>
      <div className="bg-gradient-to-br from-stone-100 to-stone-50 h-72 flex items-center justify-center relative overflow-hidden">
        <img src={coffeeGold} alt="Caffè Gondoliere Gold 500g malet filterkaffe" className="h-64 w-auto object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-300" loading="lazy" />
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-2xl font-bold text-brand-950">Gold</h3>
          <div className="text-2xl font-bold text-brand-950">{pricing.price_gold_consumer} kr</div>
        </div>
        <p className="text-brand-900/70 mb-6">Premium 100% Arabica malet filterkaffe. Mjuk, aromatisk och välbalanserad — en klassiker för bryggkaffe hemma och på kontoret.</p>
        <div className="bg-brand-50 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-brand-900">Klassen tjänar per förpackning</span>
            <span className="text-3xl font-bold text-brand-800">{pricing.margin_gold} kr</span>
          </div>
          <div className="h-2 bg-brand-200 rounded-full overflow-hidden">
            <div className="h-full bg-brand-700 rounded-full" style={{ width: "30%" }}></div>
          </div>
          <div className="text-xs text-brand-700 mt-1 font-medium">Sälj 8 förpackningar = {(8 * pricing.margin_gold).toLocaleString("sv-SE")} kr till klassen</div>
        </div>
        <ul className="space-y-2 text-sm text-brand-900/80 mb-6">
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-700" aria-hidden="true" /> 100% Arabica · malet filterkaffe</li>
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-700" aria-hidden="true" /> 500 g förpackning</li>
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-700" aria-hidden="true" /> Rainforest Alliance-certifierad</li>
        </ul>
        {showLink && (
          <Link to="/kaffe" className="mt-auto inline-flex items-center gap-2 text-amber-800 font-semibold hover:text-amber-600 transition">
            Läs mer om kaffet <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}

export function CremaCard({ showLink = true }: { showLink?: boolean }) {
  const pricing = usePricing();
  return (
    <div className={`${cardBase} border-2 border-amber-300`}>
      <div className="absolute top-4 right-4 bg-amber-300 text-brand-950 px-3 py-1 rounded-full text-xs font-bold z-10">KLASSENS FAVORIT</div>
      <div className="bg-gradient-to-br from-amber-100 to-amber-50 h-72 flex items-center justify-center relative overflow-hidden">
        <img src={coffeeCrema} alt="Caffè Gondoliere Crema 1 kg hela bönor — 100% Arabica" className="h-64 w-auto object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-300" loading="lazy" />
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-2xl font-bold text-brand-950">Crema</h3>
          <div className="text-2xl font-bold text-brand-950">{pricing.price_crema_consumer} kr</div>
        </div>
        <p className="text-brand-900/70 mb-6">100% Arabica i hela bönor. Balanserad, len och nötig med naturlig sötma och len crema — lyxvalet för espresso och fullautomater.</p>
        <div className="bg-amber-50 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-amber-900">Klassen tjänar per förpackning</span>
            <span className="text-3xl font-bold text-amber-800">{pricing.margin_crema} kr</span>
          </div>
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-600 rounded-full" style={{ width: "28%" }}></div>
          </div>
          <div className="text-xs text-amber-800 mt-1 font-medium">Sälj 8 förpackningar = {(8 * pricing.margin_crema).toLocaleString("sv-SE")} kr till klassen</div>
        </div>
        <ul className="space-y-2 text-sm text-brand-900/80 mb-6">
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-700" aria-hidden="true" /> 100% Arabica</li>
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-700" aria-hidden="true" /> Hela bönor · 1 kg förpackning</li>
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-700" aria-hidden="true" /> Rainforest Alliance-certifierad</li>
        </ul>
        {showLink && (
          <Link to="/kaffe" className="mt-auto inline-flex items-center gap-2 text-amber-800 font-semibold hover:text-amber-600 transition">
            Läs mer om kaffet <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}

export function HelloFreshCard() {
  const pricing = usePricing();
  return (
    <div className={`${cardBase} border-2 border-hf-lime/60`}>
      <div className="bg-hf-soft h-72 flex items-center justify-center relative overflow-hidden">
        <img src={hfBox} alt="HelloFresh matkasse med färska ingredienser och receptkort" className="h-64 w-auto object-contain drop-shadow-xl rounded-2xl transform group-hover:scale-105 transition-transform duration-300" loading="lazy" />
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-2xl font-bold text-brand-950">HelloFresh</h3>
          <div className="text-sm font-bold text-brand-950 bg-hf-lime px-3 py-1 rounded-full">Nyhet</div>
        </div>
        <p className="text-brand-900/70 mb-6">Sälj matkassar utan att hantera varor eller pengar — kunderna anmäler sig själva via er unika länk och HelloFresh sköter resten.</p>
        <div className="bg-hf-soft rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-brand-900">Klassen tjänar per kund</span>
            <span className="text-3xl font-bold text-brand-800">{pricing.margin_hellofresh} kr</span>
          </div>
          <div className="text-xs text-brand-700 mt-1 font-medium">10 anmälningar = {(10 * pricing.margin_hellofresh).toLocaleString("sv-SE")} kr till klassen</div>
        </div>
        <ul className="space-y-2 text-sm text-brand-900/80 mb-6">
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-700" aria-hidden="true" /> Inget lager, ingen faktura, ingen administration</li>
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-700" aria-hidden="true" /> Egen länk, QR-kod och affisch i er dashboard</li>
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-700" aria-hidden="true" /> Kan kombineras med kaffeförsäljningen</li>
        </ul>
        <Link to="/hellofresh" className="mt-auto inline-flex items-center gap-2 text-brand-800 font-semibold hover:text-brand-600 transition">
          Läs mer om HelloFresh <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
