import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Check, Sparkles, Package, Users, TrendingUp, Calculator, Salad,
} from "lucide-react";
import { RegistrationDialog } from "@/components/registration/RegistrationDialog";
import { Logo } from "@/components/Logo";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePricing } from "@/hooks/usePricing";
import heroImg from "@/assets/hellofresh/hellofresh-hero.webp";
import boxImg from "@/assets/hellofresh/hellofresh-box.webp";
import dishesLight from "@/assets/hellofresh/hellofresh-dishes-light.webp";
import dishesBlue from "@/assets/hellofresh/hellofresh-dishes-blue.webp";
import recipeCards from "@/assets/hellofresh/hellofresh-recipe-cards.webp";
import hfLogo from "@/assets/hellofresh/hellofresh-logo.png";
import hfLogoLight from "@/assets/hellofresh/hellofresh-logo-light.png";

export function HelloFreshLockup({ light }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Logo size="sm" variant={light ? "light" : "dark"} />
      <span className={`font-light text-2xl ${light ? "text-emerald-300" : "text-stone-400"}`} aria-hidden="true">×</span>
      <img
        src={light ? hfLogoLight : hfLogo}
        alt="HelloFresh"
        className="h-7 w-auto"
        loading="lazy"
      />
    </div>
  );
}

export default function HelloFresh() {
  const pricing = usePricing();
  const m = pricing.margin_hellofresh;
  const [regOpen, setRegOpen] = useState(false);
  const [students, setStudents] = useState(25);
  const [customersPerStudent, setCustomersPerStudent] = useState(2);

  useEffect(() => {
    document.title = "HelloFresh-försäljning för klasser – Qlasskassan";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        `Sälj HelloFresh med klassen — ${m} kr till klasskassan per kund. Ingen faktura, inget lager, samma klasskod som kaffet.`,
      );
    }
    return () => {
      document.title = "Qlasskassan";
    };
  }, [m]);

  const total = students * customersPerStudent * m;

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <SiteNav onRegister={() => setRegOpen(true)} />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-hf-lime/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-hf-soft text-emerald-950 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-hf-lime/40">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Nyhet i Qlasskassan
            </div>
            <div className="mb-6">
              <HelloFreshLockup />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-emerald-950 leading-[1.05] tracking-tight mb-6">
              Sälj HelloFresh —{" "}
              <span className="bg-hf-lime px-2 rounded-lg inline-block">{m} kr</span>{" "}
              till klasskassan per kund
            </h1>
            <p className="text-lg text-emerald-900/80 mb-6 leading-relaxed">
              Matkassar med färdiga recept och färska råvaror, levererade hem till dörren. Ett lätt sälj till alla familjer som vill slippa tänka på middagen.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-emerald-900/80 mb-8">
              <span><span className="text-emerald-900 font-bold">{m} kr</span> per kund</span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-hf-lime" aria-hidden="true"></span>
              <span><span className="text-emerald-900 font-bold">0 kr</span> att starta</span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-hf-lime" aria-hidden="true"></span>
              <span><span className="text-emerald-900 font-bold">Inget</span> att dela ut</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setRegOpen(true)}
                className="bg-emerald-900 text-amber-50 px-7 py-4 rounded-full font-semibold hover:bg-emerald-800 transition shadow-lg shadow-emerald-900/20 flex items-center gap-2 group"
              >
                Kom igång gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
              </button>
              <Link
                to="/logga-in"
                className="bg-white text-emerald-950 px-7 py-4 rounded-full font-semibold hover:bg-stone-100 transition border border-stone-200"
              >
                Logga in
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="HelloFresh-matkasse i ett kök med lax och receptkort"
              className="rounded-3xl shadow-2xl w-full object-cover"
            />
            <div className="absolute -top-5 -right-4 bg-hf-lime text-emerald-950 px-5 py-3 rounded-2xl font-bold shadow-xl rotate-3">
              <div className="text-xs">Klassen får</div>
              <div className="text-2xl">+{m} kr</div>
              <div className="text-xs">per kund</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-10 border-y border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-xs uppercase tracking-widest text-emerald-900/50 mb-6">I samarbete med</div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <img src={hfLogo} alt="HelloFresh" className="h-8 w-auto" loading="lazy" />
            <div className="text-sm text-emerald-900/60">Färska råvaror</div>
            <div className="text-sm text-emerald-900/60">Recept steg för steg</div>
            <div className="text-sm text-emerald-900/60">Levereras hem till dörren</div>
          </div>
        </div>
      </section>

      {/* Så funkar det */}
      <section id="sa-funkar" className="py-24 px-6 scroll-mt-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-emerald-700 uppercase tracking-widest mb-3">Så funkar det</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 max-w-3xl mx-auto leading-tight">
              Tre enkla steg — samma konto som kaffet
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", icon: Package, title: "Registrera klassen", desc: "Samma gratiskonto som för kaffet. Har ni redan ett konto är ni klara — HelloFresh finns redan i er dashboard.", color: "bg-hf-soft" },
              { num: "02", icon: Users, title: "Hitta kunder", desc: "Kunden anmäler sig på en minut via klassens länk eller QR-kod. Inga pengar hanteras av er — kunden betalar HelloFresh direkt.", color: "bg-emerald-100" },
              { num: "03", icon: TrendingUp, title: `Klassen får ${m} kr`, desc: "Per godkänd kund betalar vi ut till föreningens konto. Utan faktura och utan lager.", color: "bg-stone-200" },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`${step.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                  <step.icon className="w-7 h-7 text-emerald-950" aria-hidden="true" />
                </div>
                <div className="text-xs font-bold text-emerald-700 mb-2">STEG {step.num}</div>
                <h3 className="text-2xl font-bold text-emerald-950 mb-3">{step.title}</h3>
                <p className="text-emerald-900/70 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vad får kunden? */}
      <section className="py-24 px-6 bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            <img
              src={dishesLight}
              alt="HelloFresh-rätter fotograferade ovanifrån"
              className="col-span-2 rounded-3xl w-full object-cover shadow-lg"
              loading="lazy"
            />
            <img
              src={boxImg}
              alt="HelloFresh-låda full av färska grönsaker"
              className="rounded-3xl w-full object-cover shadow-lg"
              loading="lazy"
            />
            <img
              src={recipeCards}
              alt="HelloFresh-påsar med receptkort"
              className="rounded-3xl w-full object-cover shadow-lg max-w-full"
              loading="lazy"
            />
          </div>
          <div>
            <div className="text-sm font-semibold text-emerald-700 uppercase tracking-widest mb-3">Vad får kunden?</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight mb-6">
              Middagen löst — hela veckan
            </h2>
            <ul className="space-y-4 text-emerald-900/80 text-lg">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-700 mt-1 shrink-0" aria-hidden="true" />
                Färska, uppmätta råvaror — inget svinn
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-700 mt-1 shrink-0" aria-hidden="true" />
                Enkla recept steg för steg
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-700 mt-1 shrink-0" aria-hidden="true" />
                Leverans hem till dörren
              </li>
            </ul>
            <p className="text-sm text-emerald-900/60 mt-6">
              Kunden betalar HelloFresh direkt enligt deras erbjudande — klassen hanterar inga pengar.
            </p>
          </div>
        </div>
      </section>

      {/* Kalkylator */}
      <section className="py-24 px-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-hf-lime rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-hf-lime/20 text-hf-lime px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Calculator className="w-4 h-4" aria-hidden="true" /> Räkna ut er potential
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-4 leading-tight">
              Hur mycket kan klassen tjäna på HelloFresh?
            </h2>
          </div>
          <div className="bg-amber-50 rounded-3xl p-8 md:p-12 shadow-2xl grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="font-semibold text-emerald-950">Antal elever i klassen</label>
                  <span className="text-3xl font-bold text-emerald-900">{students}</span>
                </div>
                <input
                  type="range" min="10" max="50" value={students}
                  onChange={(e) => setStudents(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-emerald-800"
                  aria-label="Antal elever"
                />
                <div className="flex justify-between text-xs text-emerald-900/50 mt-1"><span>10</span><span>50</span></div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="font-semibold text-emerald-950">Kunder per elev</label>
                  <span className="text-3xl font-bold text-emerald-900">{customersPerStudent}</span>
                </div>
                <input
                  type="range" min="1" max="5" value={customersPerStudent}
                  onChange={(e) => setCustomersPerStudent(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-emerald-800"
                  aria-label="Kunder per elev"
                />
                <div className="flex justify-between text-xs text-emerald-900/50 mt-1"><span>1</span><span>5</span></div>
              </div>
            </div>
            <div className="bg-emerald-950 rounded-2xl p-8 text-amber-50 flex flex-col justify-between">
              <div>
                <div className="text-hf-lime text-sm font-medium mb-2">Totalt till klasskassan</div>
                <div className="text-6xl md:text-7xl font-bold tracking-tight mb-2">
                  {total.toLocaleString("sv-SE")}
                  <span className="text-2xl text-amber-200/70 ml-2">kr</span>
                </div>
                <div className="text-amber-200/60 text-sm mb-3">
                  {students} elever × {customersPerStudent} kunder × {m} kr
                </div>
                <p className="text-amber-200/60 text-xs pt-6 border-t border-emerald-800">
                  Ingen återköpsbonus på HelloFresh — kombinera med kaffet för största möjliga klasskassa.
                </p>
              </div>
              <button
                onClick={() => setRegOpen(true)}
                className="mt-8 bg-hf-lime text-emerald-950 px-6 py-4 rounded-full font-bold hover:brightness-95 transition flex items-center justify-center gap-2 group"
              >
                Starta er försäljning nu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Kombo */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight">
              Kaffe + HelloFresh = bästa kombon
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold text-emerald-950 mb-3">Kaffe från Caffè Gondoliere</h3>
              <p className="text-emerald-900/70 mb-4">
                Upp till {pricing.margin_crema} kr/förpackning + {pricing.repurchase_bonus} kr återköpsbonus i 6 månader.
              </p>
              <Link to="/kaffe" className="text-emerald-800 font-semibold underline decoration-amber-400 decoration-2 underline-offset-4 hover:text-amber-700 transition">
                Utforska kaffet →
              </Link>
            </div>
            <div className="relative bg-white rounded-3xl p-8 border-2 border-hf-lime hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <img
                src={dishesBlue}
                alt="HelloFresh-rätter på turkos bakgrund"
                className="absolute inset-0 w-full h-full object-cover opacity-10"
                loading="lazy"
              />
              <div className="relative">
                <h3 className="text-2xl font-bold text-emerald-950 mb-3">HelloFresh matkassar</h3>
                <p className="text-emerald-900/70 mb-4">
                  {m} kr per kund, levereras hem till kunden. Ingen faktura, inget lager.
                </p>
                <div className="inline-block bg-hf-lime text-emerald-950 font-bold px-4 py-2 rounded-full">
                  {m} kr / kund
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 py-24 px-6 bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm font-semibold text-emerald-700 uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight">
              Frågor om HelloFresh-försäljning
            </h2>
          </div>
          <Accordion type="single" collapsible className="bg-stone-50 border border-stone-200 rounded-3xl px-6 md:px-8">
            {[
              { q: "Kostar det något för klassen?", a: "Nej. Det är helt gratis att registrera klassen och sälja HelloFresh via Qlasskassan." },
              { q: "Vad betalar kunden?", a: "Kunden betalar HelloFresh direkt enligt deras erbjudande. Klassen hanterar inga pengar." },
              { q: "När räknas ett sälj?", a: "Anmälan syns direkt i er dashboard som \"Väntar\". När vi kontrollerat och godkänt den är den klar för utbetalning. Avvisade anmälningar, t.ex. dubbletter, räknas bort." },
              { q: "Hur får vi pengarna?", a: "Vi betalar ut till föreningens konto som ni angav vid registreringen." },
              { q: "Finns det återköpsbonus?", a: "Nej, återköpsbonusen gäller bara kaffet." },
              { q: "Kan vi sälja både kaffe och HelloFresh?", a: "Ja, med samma dashboard och samma klasskod." },
              { q: "Vilka uppgifter lämnar kunden?", a: "Namn, e-post, mobil och adress, som delas med HelloFresh för leveransen." },
              { q: "Kan samma kund räknas två gånger?", a: "Nej, varje hushåll räknas en gång." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-stone-200 last:border-0">
                <AccordionTrigger className="text-left text-emerald-950 font-semibold py-5 hover:no-underline hover:text-emerald-700">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-emerald-900/75 leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-hf-lime/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <Salad className="w-10 h-10 text-hf-lime mx-auto mb-6" aria-hidden="true" />
            <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-6 leading-tight">
              Redo att sälja HelloFresh med klassen?
            </h2>
            <p className="text-amber-100/80 text-lg mb-10 max-w-xl mx-auto">
              Registrera klassen gratis på 2 minuter — samma konto, samma klasskod, samma dashboard som kaffet.
            </p>
            <button
              onClick={() => setRegOpen(true)}
              className="bg-hf-lime text-emerald-950 px-7 py-4 rounded-full font-bold hover:brightness-95 transition shadow-xl inline-flex items-center gap-2 group"
            >
              Kom igång gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
      <RegistrationDialog open={regOpen} onOpenChange={setRegOpen} />
    </div>
  );
}
