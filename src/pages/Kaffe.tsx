import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Check, Coffee, Package, Users, TrendingUp, Repeat, ClipboardList, Wallet, Truck, Sparkles,
} from "lucide-react";
import { RegistrationDialog } from "@/components/registration/RegistrationDialog";
import { StartguideDialog } from "@/components/registration/StartguideDialog";
import { Logo } from "@/components/Logo";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import ProfitCalculator from "@/components/site/ProfitCalculator";
import { GoldCard, CremaCard } from "@/components/site/ProductCards";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePricing } from "@/hooks/usePricing";
import coffeeGold from "@/assets/coffee-gold.png";
import coffeeCrema from "@/assets/coffee-crema.png";
import dishesBlue from "@/assets/hellofresh/hellofresh-dishes-blue.webp";

export default function Kaffe() {
  const pricing = usePricing();
  const b = pricing.repurchase_bonus;
  const [regOpen, setRegOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    document.title = "Kaffeförsäljning för klasser – Qlasskassan";
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <SiteNav onRegister={() => setRegOpen(true)} />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Coffee className="w-4 h-4" aria-hidden="true" />
              Caffè Gondoliere · Rainforest Alliance
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-emerald-950 leading-[1.05] tracking-tight mb-6">
              Sälj <span className="italic text-amber-700">premium</span>kaffe — upp till {pricing.margin_crema} kr per förpackning till klassen
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-emerald-900/80 mb-6">
              <span><span className="text-amber-700 font-bold">+{b} kr/förpackning</span> <span className="text-emerald-900/60">Återköpsbonus</span></span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-amber-400" aria-hidden="true"></span>
              <span><span className="text-amber-700 font-bold">0 kr</span> <span className="text-emerald-900/60">att starta</span></span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-amber-400" aria-hidden="true"></span>
              <span><span className="text-amber-700 font-bold">4 v</span> <span className="text-emerald-900/60">typisk kampanj</span></span>
            </div>
            <p className="text-lg text-emerald-900/80 mb-8 leading-relaxed">
              Glöm trötta kataloger med kakor och kryddor. Qlasskassan erbjuder Rainforest Alliance-certifierat premium kaffe från Caffè Gondoliere — produkter folk faktiskt vill köpa, igen och igen.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <button onClick={() => setRegOpen(true)} className="bg-emerald-900 text-amber-50 px-7 py-4 rounded-full font-semibold hover:bg-emerald-800 transition shadow-lg shadow-emerald-900/20 flex items-center gap-2 group">
                Kom igång gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
              </button>
              <button onClick={() => setGuideOpen(true)} className="bg-white text-emerald-950 px-7 py-4 rounded-full font-semibold hover:bg-stone-100 transition border border-stone-200">
                Få startguide via mail
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-emerald-900/70">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" aria-hidden="true" /> Upp till {pricing.margin_crema} kr per förpackning till klassen</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" aria-hidden="true" /> Faktura till föreningen, 14 dagar</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" aria-hidden="true" /> Inget osålt — vi rullar exakt volym</div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-amber-100 via-amber-50 to-stone-50 border border-amber-200 shadow-2xl h-80 md:h-[26rem] flex items-center justify-center gap-2 overflow-hidden">
              <img src={coffeeGold} alt="Caffè Gondoliere Gold 500 g" className="h-56 md:h-72 w-auto object-contain drop-shadow-xl -rotate-6 translate-x-4" />
              <img src={coffeeCrema} alt="Caffè Gondoliere Crema 1 kg" className="h-64 md:h-80 w-auto object-contain drop-shadow-xl rotate-6 -translate-x-4" />
            </div>
            <div className="absolute -top-5 -right-3 bg-amber-300 text-emerald-950 px-5 py-3 rounded-2xl font-bold shadow-xl rotate-3">
              <div className="text-2xl">+{b} kr</div>
              <div className="text-xs">återköpsbonus</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-10 border-y border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-xs uppercase tracking-widest text-emerald-900/50 mb-6">Auktoriserad svensk återförsäljare av</div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-70">
            <div className="text-2xl font-serif italic text-emerald-950">Caffè Gondoliere</div>
            <div className="text-sm text-emerald-900/60">Rainforest Alliance-certifierat</div>
            <div className="text-sm text-emerald-900/60">100% Arabica i Crema</div>
            <div className="text-sm text-emerald-900/60">Ett av Europas största rosterier</div>
          </div>
        </div>
      </section>

      {/* Så funkar det */}
      <section id="sa-funkar" className="scroll-mt-28 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">Så funkar det</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 max-w-3xl mx-auto leading-tight">Tre enkla steg från start till klassresa</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", icon: Package, title: "Registrera klassen", desc: "Gratis och tar 2 minuter. Fyll i klass, antal elever och ert mål — ni får direkt tillgång till en egen dashboard.", color: "bg-amber-100" },
              { num: "02", icon: Users, title: "Klassen säljer", desc: "Eleverna säljer till familj, grannar och vänner. Allt går via vår enkla webbshop eller papperskatalog.", color: "bg-emerald-100" },
              { num: "03", icon: TrendingUp, title: "Pengarna kommer in", desc: "Klassen samlar in beställningar och pengar. Vi fakturerar föreningen exakt volym med 14 dagars betaltid och levererar till skolan. Klassen behåller hela sin marginal.", color: "bg-stone-200" },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-3xl p-8 border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`${step.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                  <step.icon className="w-7 h-7 text-emerald-950" aria-hidden="true" />
                </div>
                <div className="text-xs font-bold text-amber-700 mb-2">STEG {step.num}</div>
                <h3 className="text-2xl font-bold text-emerald-950 mb-3">{step.title}</h3>
                <p className="text-emerald-900/70 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sorterna */}
      <section id="sorter" className="scroll-mt-28 py-24 px-6 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">Sortimentet</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight">Två sorter som säljer sig själva</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <GoldCard showLink={false} />
            <CremaCard showLink={false} />
          </div>
          <div className="text-center mt-10 text-sm text-emerald-900/60">
            Bönor och fler varianter kommer snart. Maila <span className="font-medium text-emerald-900">kontakt@scandinaviancoffee.se</span> för förbeställning.
          </div>
        </div>
      </section>

      <ProfitCalculator includeHelloFresh={false} onRegister={() => setRegOpen(true)} />

      {/* Återköpsklubben */}
      <section id="aterkop" className="scroll-mt-28 py-24 px-6 bg-amber-50 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-200/50 rounded-full blur-3xl"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-900 text-amber-100 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Repeat className="w-4 h-4" aria-hidden="true" /> Bara hos Qlasskassan
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-6 leading-tight">
                Klassen får pengar <span className="italic text-amber-700">även</span> efter att försäljningen är slut
              </h2>
              <p className="text-lg text-emerald-900/80 mb-8 leading-relaxed">
                Det här är vår superkraft. Varje klass får en unik klasskod. Återköper kunderna kaffet på <strong>qlasskassan.se/aterkop</strong> med koden inom 6 månader får klassen <strong>{b} kr per förpackning</strong> — automatiskt, utan att eleverna lyfter ett finger.
              </p>
              <div className="bg-white rounded-2xl p-6 border border-amber-200 mb-8">
                <div className="text-sm font-semibold text-emerald-900 mb-4">Räkneexempel återköp</div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center gap-3"><span className="text-emerald-900/70">Klassen säljer 200 förpackningar</span><span className="font-medium">200 förpackningar</span></div>
                  <div className="flex justify-between items-center gap-3"><span className="text-emerald-900/70">30 % återköper i snitt 2 ggr på 6 mån</span><span className="font-medium">120 återköp</span></div>
                  <div className="flex justify-between items-center gap-3 pt-3 border-t border-stone-200"><span className="font-semibold text-emerald-900">Bonus till klassen</span><span className="text-2xl font-bold text-amber-700">+{(120 * b).toLocaleString("sv-SE")} kr</span></div>
                </div>
              </div>
              <button onClick={() => setRegOpen(true)} className="bg-emerald-900 text-amber-50 px-7 py-4 rounded-full font-semibold hover:bg-emerald-800 transition shadow-lg flex items-center gap-2 group">
                Anmäl er klass
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
              </button>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-900 text-amber-300 flex items-center justify-center shrink-0" aria-hidden="true">
                    <Repeat className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-950">Klass 6B - Lindbladskolan</div>
                    <div className="text-xs text-emerald-900/60">Aktiv återköpsklubb</div>
                  </div>
                </div>
                <div className="text-emerald-900/70 text-sm mb-2">Insamlat den här månaden</div>
                <div className="text-5xl font-bold text-emerald-950 mb-1">+ {(36 * b).toLocaleString("sv-SE")} kr</div>
                <div className="text-sm text-emerald-700 mb-6">från återkommande kunder · räkneexempel</div>
                <div className="space-y-3">
                  {[
                    { name: "Anna L.", n: 2, detail: "2× Crema" },
                    { name: "Markus B.", n: 1, detail: "1× Gold" },
                    { name: "Sofia W.", n: 3, detail: "3× Crema" },
                    { name: "Erik J.", n: 2, detail: "2× Gold" },
                  ].map((tx) => (
                    <div key={tx.name} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-emerald-950">{tx.name}</div>
                        <div className="text-xs text-emerald-900/60">{tx.detail}</div>
                      </div>
                      <div className="text-sm font-bold text-amber-700">+ {tx.n * b} kr</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -left-2 sm:-left-4 bg-amber-300 text-emerald-950 px-4 py-2 rounded-2xl font-bold text-sm shadow-xl rotate-[-3deg]">
                Passiv inkomst
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Varför kaffe? */}
      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">Varför kaffe?</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight">Jämför med vad ni redan känner till</h2>
          </div>
          <div className="bg-white rounded-3xl overflow-x-auto border border-stone-200">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-4 bg-emerald-950 text-amber-50 text-sm font-semibold">
                <div className="p-4 md:p-5"></div>
                <div className="p-4 md:p-5 text-center bg-amber-700">Qlasskassan</div>
                <div className="p-4 md:p-5 text-center">Kakor</div>
                <div className="p-4 md:p-5 text-center">Kryddor</div>
              </div>
              {[
                ["Marginal till klassen", `${pricing.margin_gold}–${pricing.margin_crema} kr/förpackning`, "20–30 kr/box", "49–54 kr/box"],
                ["Återkommande kunder", "Ja, automatiskt", "Sällan", "Sällan"],
                ["Förbrukningsvara", "Ja — köps om varje månad", "Nej", "Nej"],
                ["Premium-känsla", "Hög", "Låg", "Mellan"],
                ["Förpackningar/boxar för 15 000 kr", "~270", "~600", "~290"],
                ["Återköpsbonus efter kampanj", `Ja — ${b} kr/förpackning i 6 mån`, "Nej", "Nej"],
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-4 text-sm border-t border-stone-200 ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}>
                  <div className="p-4 md:p-5 font-medium text-emerald-950">{row[0]}</div>
                  <div className="p-4 md:p-5 text-center font-bold text-emerald-800 bg-amber-50/50">{row[1]}</div>
                  <div className="p-4 md:p-5 text-center text-emerald-900/70">{row[2]}</div>
                  <div className="p-4 md:p-5 text-center text-emerald-900/70">{row[3]}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-emerald-900/50 mt-4 text-center">
            *Marginalsiffror baserade på publika prisuppgifter från etablerade aktörer på marknaden (april 2026).
          </p>
        </div>
      </section>

      {/* Schysst för båda */}
      <section className="py-24 px-6 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight mb-5">Schysst för båda — glasklart från start</h2>
            <p className="text-emerald-900/75 text-lg leading-relaxed">
              Vi är ett nystartat svenskt kafferosteri. Vi älskar klasserna vi jobbar med — men vi måste också kunna leverera till nästa klass. Därför håller vi det enkelt och rättvist.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ClipboardList, title: "Beställningar först, leverans sedan", desc: "Klassen samlar in beställningar och pengar från familj, grannar och vänner. Inga osålda lager, inget svinn." },
              { icon: Wallet, title: "Faktura mot föreningens konto", desc: "När ni skickat in beställningen fakturerar vi föreningen för exakt volym — 14 dagars betaltid. Klassen behåller sin marginal direkt." },
              { icon: Truck, title: "Vi levererar till skolan", desc: "Fri leverans till skolan på beställningar över 50 förpackningar. Ni packar och delar ut själva — eleverna sköter sin runda i området." },
              { icon: Sparkles, title: "Återköpsklubben ingår alltid", desc: `När er kampanj är slut fortsätter klassen tjäna ${b} kr per återköp i 6 månader — automatiskt, utan att ni gör något.` },
            ].map((f) => (
              <div key={f.title} className="text-center bg-white border border-stone-200 rounded-3xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <f.icon className="w-7 h-7 text-amber-300" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-emerald-950 mb-2">{f.title}</h3>
                <p className="text-sm text-emerald-900/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kombo */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight">Kaffe + HelloFresh = bästa kombon</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border-2 border-amber-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold text-emerald-950 mb-3">Kaffe från Caffè Gondoliere</h3>
              <p className="text-emerald-900/70 mb-4">
                Upp till {pricing.margin_crema} kr/förpackning + {b} kr återköpsbonus i 6 månader.
              </p>
              <div className="inline-block bg-amber-700 text-amber-50 font-bold px-4 py-2 rounded-full">
                {pricing.margin_gold}–{pricing.margin_crema} kr / förp
              </div>
            </div>
            <div className="relative bg-white rounded-3xl p-8 border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <img src={dishesBlue} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" loading="lazy" />
              <div className="relative">
                <h3 className="text-2xl font-bold text-emerald-950 mb-3">HelloFresh matkassar</h3>
                <p className="text-emerald-900/70 mb-4">
                  {pricing.margin_hellofresh} kr per kund, levereras hem till kunden. Ingen faktura, inget lager.
                </p>
                <Link to="/hellofresh" className="text-emerald-800 font-semibold underline decoration-hf-lime decoration-2 underline-offset-4 hover:text-emerald-600 transition">
                  Utforska HelloFresh →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 py-24 px-6 bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight">Frågor om kaffeförsäljning</h2>
          </div>
          <Accordion type="single" collapsible className="bg-stone-50 border border-stone-200 rounded-3xl px-6 md:px-8">
            {[
              { q: "Hur går betalningen till?", a: "Klassen samlar in pengar från kunderna (Swish till föreningens konto). När ni skickar in den samlade beställningen till oss fakturerar vi föreningen för vår del — med 14 dagars betaltid. Klassen behåller mellanskillnaden direkt." },
              { q: "Vad händer om en kund ångrar sig?", a: "Eftersom ni samlar in beställningar och pengar innan vi packar och kör så händer det sällan. Skulle det ändå göra det, hör av er — vi löser det." },
              { q: "Hur funkar Återköpsklubben rent tekniskt?", a: `Varje klass får en unik klasskod (står på säljbladet). När en kund handlar på qlasskassan.se/aterkop och anger koden får klassen ${b} kr per förpackning — i 6 månader. Vi mejlar er en månadsrapport.` },
              { q: "Är kaffet faktiskt premium?", a: "Caffè Gondoliere är ett av Europas största rosterier, certifierat av Rainforest Alliance. Crema är 100 % höglands-Arabica i hela bönor. Provsmaka själva — vi skickar gratis sample-paket till intresserade lärare på begäran." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-stone-200 last:border-0">
                <AccordionTrigger className="text-left text-emerald-950 font-semibold py-5 hover:no-underline hover:text-amber-700">{item.q}</AccordionTrigger>
                <AccordionContent className="text-emerald-900/75 leading-relaxed pb-5">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="text-center text-sm text-emerald-900/70 mt-6">
            Fler frågor? Se <Link to="/#faq" className="font-semibold text-emerald-900 underline decoration-amber-400 underline-offset-4">vanliga frågor →</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <Coffee className="w-10 h-10 text-amber-300 mx-auto mb-6" aria-hidden="true" />
            <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-6 leading-tight">Redo att sälja kaffe med klassen?</h2>
            <p className="text-amber-100/80 text-lg mb-10 max-w-xl mx-auto">
              Registrera klassen gratis på 2 minuter — eller få vår startguide skickad till mailen direkt.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => setRegOpen(true)} className="bg-amber-300 text-emerald-950 px-7 py-4 rounded-full font-bold hover:bg-amber-200 transition shadow-xl flex items-center gap-2 group">
                Kom igång gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
              </button>
              <button onClick={() => setGuideOpen(true)} className="bg-emerald-800 text-amber-50 px-7 py-4 rounded-full font-semibold hover:bg-emerald-700 transition border border-emerald-700">
                Få startguide via mail
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <RegistrationDialog open={regOpen} onOpenChange={setRegOpen} />
      <StartguideDialog open={guideOpen} onOpenChange={setGuideOpen} />
    </div>
  );
}
