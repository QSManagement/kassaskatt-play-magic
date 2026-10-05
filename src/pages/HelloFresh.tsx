import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Check, Sparkles, Package, Users, TrendingUp, Salad,
} from "lucide-react";
import { RegistrationDialog } from "@/components/registration/RegistrationDialog";
import { StartguideDialog } from "@/components/registration/StartguideDialog";
import { Logo } from "@/components/Logo";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePricing } from "@/hooks/usePricing";
import heroImg from "@/assets/matkassar/meal-kit.jpg";
import dishesBlue from "@/assets/matkassar/meal-kit.jpg";
import ProfitCalculator from "@/components/site/ProfitCalculator";


export function HelloFreshLockup({ light }: { light?: boolean }) {
  return <Logo size="sm" variant={light ? "light" : "dark"} />;
}

export default function HelloFresh() {
  const pricing = usePricing();
  const m = pricing.margin_hellofresh;
  const [regOpen, setRegOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    document.title = "Matkasseförsäljning för klasser – Qlasskassan";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        `Sälj Matkassar med klassen — ${m} kr till klasskassan per kund. Ingen faktura, inget lager, samma klasskod som kaffet.`,
      );
    }
    return () => {
      document.title = "Qlasskassan";
    };
  }, [m]);


  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <SiteNav onRegister={() => setRegOpen(true)} />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-brand-300/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            {/* Qlasskassan-loggan finns redan i menyn, här visas bara partnern */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-950 px-3 py-1 rounded-full text-sm font-medium border border-brand-300/40">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Nyhet
              </span>

              
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-950 leading-[1.05] tracking-tight mb-6">
              Sälj Matkassar —{" "}
              <span className="bg-brand-300 px-2 rounded-lg inline-block">{m} kr</span>{" "}
              till klasskassan per kund
            </h1>
            <p className="text-lg text-brand-900/80 mb-6 leading-relaxed">
              Matkassar med färdiga recept och färska råvaror, levererade hem till dörren. Ett lätt sälj till alla familjer som vill slippa tänka på middagen.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-brand-900/80 mb-8">
              <span><span className="text-brand-900 font-bold">{m} kr</span> per kund</span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-brand-300" aria-hidden="true"></span>
              <span><span className="text-brand-900 font-bold">0 kr</span> att starta</span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-brand-300" aria-hidden="true"></span>
              <span><span className="text-brand-900 font-bold">Inget</span> att dela ut</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setRegOpen(true)}
                className="bg-brand-900 text-amber-50 px-7 py-4 rounded-full font-semibold hover:bg-brand-800 transition shadow-lg shadow-brand-900/20 flex items-center gap-2 group"
              >
                Kom igång gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
              </button>
              <button
                onClick={() => setGuideOpen(true)}
                className="bg-white text-brand-950 px-7 py-4 rounded-full font-semibold hover:bg-stone-100 transition border border-stone-200"
              >
                Få startguide via mail
              </button>
              <Link
                to="/logga-in"
                className="bg-white text-brand-950 px-7 py-4 rounded-full font-semibold hover:bg-stone-100 transition border border-stone-200"
              >
                Logga in
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="Matkasse med råvaror och middagar – exempelbild"
              className="rounded-3xl shadow-2xl w-full object-cover"
            />
            <div className="absolute -top-5 -right-4 bg-brand-300 text-brand-950 px-5 py-3 rounded-2xl font-bold shadow-xl rotate-3">
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
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3">
            {["Färska råvaror", "Recept steg för steg", "Levereras hem till dörren"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm font-medium text-brand-900/70">
                <Check className="w-4 h-4 text-brand-700" aria-hidden="true" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Så funkar det */}
      <section id="sa-funkar" className="py-24 px-6 scroll-mt-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-brand-700 uppercase tracking-widest mb-3">Så funkar det</div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-950 max-w-3xl mx-auto leading-tight">
              Tre enkla steg — samma konto som kaffet
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", icon: Package, title: "Registrera klassen", desc: "Samma gratiskonto som för kaffet. Har ni redan ett konto är ni klara — Matkassar finns redan i er dashboard.", color: "bg-brand-50" },
              { num: "02", icon: Users, title: "Hitta kunder", desc: "Kunden anmäler sig på en minut via klassens länk eller QR-kod. Inga pengar hanteras av er — kunden betalar matkasseleverantören direkt.", color: "bg-brand-100" },
              { num: "03", icon: TrendingUp, title: `Klassen får ${m} kr`, desc: "Per godkänd kund betalar vi ut till föreningens konto. Utan faktura och utan lager.", color: "bg-stone-200" },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`${step.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                  <step.icon className="w-7 h-7 text-brand-950" aria-hidden="true" />
                </div>
                <div className="text-xs font-bold text-brand-700 mb-2">STEG {step.num}</div>
                <h3 className="text-2xl font-bold text-brand-950 mb-3">{step.title}</h3>
                <p className="text-brand-900/70 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vad får kunden? */}
      <section className="py-24 px-6 bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <img src={heroImg} alt="Matkasse med färska råvaror och tillagade middagar – exempelbild" className="rounded-lg w-full object-cover" loading="lazy" />
          <div>
            <div className="text-sm font-semibold text-brand-700 uppercase tracking-widest mb-3">Vad får kunden?</div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-950 leading-tight mb-6">
              Middagen löst — hela veckan
            </h2>
            <ul className="space-y-4 text-brand-900/80 text-lg">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-brand-700 mt-1 shrink-0" aria-hidden="true" />
                Färska, uppmätta råvaror — inget svinn
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-brand-700 mt-1 shrink-0" aria-hidden="true" />
                Enkla recept steg för steg
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-brand-700 mt-1 shrink-0" aria-hidden="true" />
                Leverans hem till dörren
              </li>
            </ul>
            <p className="text-sm text-brand-900/60 mt-6">
              Kunden betalar matkasseleverantören direkt enligt deras erbjudande — klassen hanterar inga pengar.
            </p>
          </div>
        </div>
      </section>

      <ProfitCalculator includeHelloFresh includeCoffee={false} accent="lime" onRegister={() => setRegOpen(true)} />


      {/* Kombo */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-950 leading-tight">
              Kaffe + Matkassar = bästa kombon
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold text-brand-950 mb-3">Kaffe från Caffè Gondoliere</h3>
              <p className="text-brand-900/70 mb-4">
                Upp till {pricing.margin_crema} kr/förpackning + {pricing.repurchase_bonus} kr återköpsbonus i 6 månader.
              </p>
              <Link to="/kaffe" className="text-brand-800 font-semibold underline decoration-amber-400 decoration-2 underline-offset-4 hover:text-amber-700 transition">
                Utforska kaffet →
              </Link>
            </div>
            <div className="relative bg-white rounded-3xl p-8 border-2 border-brand-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <img
                src={dishesBlue}
                alt="Matkassar-rätter på turkos bakgrund"
                className="absolute inset-0 w-full h-full object-cover opacity-10"
                loading="lazy"
              />
              <div className="relative">
                <h3 className="text-2xl font-bold text-brand-950 mb-3">Matkassar</h3>
                <p className="text-brand-900/70 mb-4">
                  {m} kr per kund, levereras hem till kunden. Ingen faktura, inget lager.
                </p>
                <div className="inline-block bg-brand-300 text-brand-950 font-bold px-4 py-2 rounded-full">
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
            <div className="text-sm font-semibold text-brand-700 uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-950 leading-tight">
              Frågor om Matkasseförsäljning
            </h2>
          </div>
          <Accordion type="single" collapsible className="bg-stone-50 border border-stone-200 rounded-3xl px-6 md:px-8">
            {[
              { q: "Kostar det något för klassen?", a: "Nej. Det är helt gratis att registrera klassen och sälja Matkassar via Qlasskassan." },
              { q: "Vad betalar kunden?", a: "Kunden betalar matkasseleverantören direkt enligt deras erbjudande. Klassen hanterar inga pengar." },
              { q: "När räknas ett sälj?", a: "Anmälan syns direkt i er dashboard som \"Väntar\". När vi kontrollerat och godkänt den är den klar för utbetalning. Avvisade anmälningar, t.ex. dubbletter, räknas bort." },
              { q: "Hur får vi pengarna?", a: "Vi betalar ut till föreningens konto som ni angav vid registreringen." },
              { q: "Finns det återköpsbonus?", a: "Nej, återköpsbonusen gäller bara kaffet." },
              { q: "Kan vi sälja både kaffe och Matkassar?", a: "Ja, med samma dashboard och samma klasskod." },
              { q: "Vilka uppgifter lämnar kunden?", a: "Namn, e-post, mobil och adress, som delas med matkasseleverantören för leveransen." },
              { q: "Kan samma kund räknas två gånger?", a: "Nej, varje hushåll räknas en gång." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-stone-200 last:border-0">
                <AccordionTrigger className="text-left text-brand-950 font-semibold py-5 hover:no-underline hover:text-brand-700">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-brand-900/75 leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand-900 to-brand-950 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-300/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <Salad className="w-10 h-10 text-brand-300 mx-auto mb-6" aria-hidden="true" />
            <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-6 leading-tight">
              Redo att sälja Matkassar med klassen?
            </h2>
            <p className="text-amber-100/80 text-lg mb-10 max-w-xl mx-auto">
              Registrera klassen gratis på 2 minuter — samma konto, samma klasskod, samma dashboard som kaffet.
            </p>
            <button
              onClick={() => setRegOpen(true)}
              className="bg-brand-300 text-brand-950 px-7 py-4 rounded-full font-bold hover:brightness-95 transition shadow-xl inline-flex items-center gap-2 group"
            >
              Kom igång gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
      <RegistrationDialog open={regOpen} onOpenChange={setRegOpen} />
      <StartguideDialog open={guideOpen} onOpenChange={setGuideOpen} product="matkassar" />
    </div>
  );
}
