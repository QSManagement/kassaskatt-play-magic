import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, Sparkles, ArrowRight, Check, Users, Coffee, Salad } from 'lucide-react';
import { RegistrationDialog } from '@/components/registration/RegistrationDialog';
import { StartguideDialog } from '@/components/registration/StartguideDialog';
import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import ProfitCalculator from '@/components/site/ProfitCalculator';
import { GoldCard, CremaCard, HelloFreshCard } from '@/components/site/ProductCards';
import coffeeGold from '@/assets/coffee-gold.png';
import coffeeCrema from '@/assets/coffee-crema.png';
import hfBox from '@/assets/hellofresh/hellofresh-box.webp';
import hfLogo from '@/assets/hellofresh/hellofresh-logo.png';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { usePricing } from '@/hooks/usePricing';

export default function Index() {
  const [regOpen, setRegOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const pricing = usePricing();

  useEffect(() => {
    document.title = 'Qlasskassan – Sälj kaffe och HelloFresh till klasskassan';
  }, []);

  const compareRows: { label: string; kaffe: string; hf: string }[] = [
    { label: 'Klassen får', kaffe: `${pricing.margin_gold}–${pricing.margin_crema} kr per förpackning`, hf: `${pricing.margin_hellofresh} kr per godkänd kund` },
    { label: 'Så säljer ni', kaffe: 'Säljblad + elevlänk, ni samlar in beställningar', hf: 'Kunden anmäler sig via klassens länk/QR' },
    { label: 'Betalning', kaffe: 'Kunden betalar klassen, vi fakturerar föreningen (14 dagar)', hf: 'Kunden betalar HelloFresh, vi betalar ut till klassen' },
    { label: 'Leverans', kaffe: 'Till skolan, ni delar ut', hf: 'Hem till kunden' },
    { label: 'Återköpsbonus', kaffe: `${pricing.repurchase_bonus} kr/förp i 6 mån`, hf: 'Nej' },
    { label: 'Passar när', kaffe: 'Ni vill sälja något folk köper om och om igen', hf: 'Ni vill slippa hantera varor och pengar' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <SiteNav onRegister={() => setRegOpen(true)} />

      {/* Hero */}
      <section className="relative pt-32 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-hf-lime/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Kaffe + HelloFresh — samma konto
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand-950 leading-[1.05] tracking-tight mb-6">
              Bygg er klasskassa med <span className="italic text-amber-700">kaffe</span> och{' '}
              <span className="bg-hf-lime px-2 rounded-lg">matkassar</span>
            </h1>
            <p className="text-lg text-brand-900/80 mb-6 leading-relaxed">
              Sälj premiumkaffe från Caffè Gondoliere och HelloFresh matkassar — produkter familjer faktiskt vill ha. Välj det ena eller kör båda.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-brand-900/80 mb-8">
              <span><span className="text-amber-700 font-bold">Upp till {pricing.margin_crema} kr</span>/förpackning</span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-amber-400" aria-hidden="true"></span>
              <span><span className="text-brand-900 font-bold">{pricing.margin_hellofresh} kr</span> per HelloFresh-kund</span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-amber-400" aria-hidden="true"></span>
              <span><span className="text-brand-900 font-bold">0 kr</span> att starta</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              <button onClick={() => setRegOpen(true)} className="bg-brand-900 text-amber-50 px-7 py-4 rounded-full font-semibold hover:bg-brand-800 transition shadow-lg shadow-brand-900/20 flex items-center gap-2 group">
                Kom igång gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
              </button>
              <button onClick={() => setGuideOpen(true)} className="bg-white text-brand-950 px-7 py-4 rounded-full font-semibold hover:bg-stone-100 transition border border-stone-200">
                Få startguide via mail
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-brand-900/70">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-700" aria-hidden="true" /> Ett konto och en klasskod för båda</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-700" aria-hidden="true" /> Kaffe: faktura till föreningen, 14 dagar</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-700" aria-hidden="true" /> HelloFresh: inget lager, ingen faktura</div>
            </div>
          </div>

          {/* Produktväljare */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-5">
            <Link to="/kaffe" className="group rounded-3xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 p-4 md:p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
              <div className="relative h-24 md:h-36 md:w-40 shrink-0 flex items-center justify-center">
                <img src={coffeeGold} alt="Kaffe Gold" className="h-20 md:h-32 w-auto object-contain drop-shadow-lg -rotate-6 translate-x-3" />
                <img src={coffeeCrema} alt="Kaffe Crema" className="h-24 md:h-36 w-auto object-contain drop-shadow-lg rotate-6 -translate-x-3" />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xl md:text-2xl font-bold text-brand-950 mb-1">
                  <Coffee className="w-5 h-5 text-amber-700" aria-hidden="true" /> Kaffe
                </div>
                <p className="text-xs md:text-sm text-brand-900/80 mb-3">
                  Upp till {pricing.margin_crema} kr per förpackning + {pricing.repurchase_bonus} kr återköpsbonus
                </p>
                <span className="mt-auto text-sm font-semibold text-amber-800 group-hover:text-amber-600">Utforska kaffet →</span>
              </div>
            </Link>
            <Link to="/hellofresh" className="group rounded-3xl bg-hf-soft border-2 border-hf-lime/60 p-4 md:p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-3 md:gap-6 relative">
              <span className="absolute top-3 right-3 bg-hf-lime text-brand-950 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full">Nyhet</span>
              <div className="h-24 md:h-36 md:w-40 shrink-0 flex items-center justify-center">
                <img src={hfBox} alt="HelloFresh matkasse" className="h-20 md:h-32 w-auto object-contain rounded-xl drop-shadow-lg" />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xl md:text-2xl font-bold text-brand-950 mb-1">
                  <Salad className="w-5 h-5 text-hf-green" aria-hidden="true" /> HelloFresh
                </div>
                <p className="text-xs md:text-sm text-brand-900/80 mb-3">
                  {pricing.margin_hellofresh} kr per kund · inget lager, ingen faktura
                </p>
                <span className="mt-auto text-sm font-semibold text-brand-800 group-hover:text-brand-600">Utforska HelloFresh →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pilotremsa */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto bg-brand-950 rounded-3xl px-6 py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 text-amber-50 font-semibold">
            <span className="w-2.5 h-2.5 bg-amber-300 rounded-full animate-pulse shrink-0"></span>
            Pilot — anmälan öppen inför HT 2026
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-amber-200/70 uppercase tracking-widest">Pilotplatser</span>
              <span className="text-amber-50 font-bold tabular-nums"><span className="text-amber-300">37</span> / 50 platser kvar</span>
            </div>
            <div className="h-1.5 bg-brand-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full" style={{ width: `${(37 / 50) * 100}%` }}></div>
            </div>
          </div>
          <button onClick={() => setRegOpen(true)} className="bg-amber-300 text-brand-950 px-6 py-3 rounded-full font-bold hover:bg-amber-200 transition inline-flex items-center justify-center gap-2 group shrink-0">
            Anmäl er klass
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-8 border-y border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-10 text-sm text-brand-900/60">
          <div className="flex items-center gap-2 text-center">
            Auktoriserad återförsäljare av <span className="text-xl font-serif italic text-brand-950">Caffè Gondoliere</span>
          </div>
          <span className="hidden sm:block w-px h-8 bg-stone-300" aria-hidden="true" />
          <div className="flex items-center gap-3">
            I samarbete med <img src={hfLogo} alt="HelloFresh" className="h-7 w-auto" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Produkter */}
      <section id="produkter" className="scroll-mt-28 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">Sortimentet</div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-950 max-w-3xl mx-auto leading-tight">Tre sätt att fylla klasskassan</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            <GoldCard />
            <CremaCard />
            <HelloFreshCard />
          </div>
        </div>
      </section>

      {/* Så funkar det */}
      <section id="sa-funkar" className="scroll-mt-28 py-24 px-6 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">Så funkar det</div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-950 max-w-3xl mx-auto leading-tight">Tre enkla steg från start till klassresa</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', icon: Package, title: 'Registrera klassen', desc: 'Gratis och tar 2 minuter. Ett konto och en klasskod för både kaffe och HelloFresh.', color: 'bg-amber-100' },
              { num: '02', icon: Users, title: 'Sälj det som passar er', desc: 'Kaffe via säljblad och elevlänk. HelloFresh via klassens egen länk och QR-kod — kunden anmäler sig själv.', color: 'bg-hf-soft' },
              { num: '03', icon: TrendingUp, title: 'Pengarna kommer in', desc: `Kaffe: ni samlar in betalt och vi fakturerar föreningen. HelloFresh: vi betalar ut ${pricing.margin_hellofresh} kr per godkänd kund.`, color: 'bg-stone-200' },
            ].map((step) => (
              <div key={step.num} className="bg-stone-50 rounded-3xl p-8 border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`${step.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                  <step.icon className="w-7 h-7 text-brand-950" aria-hidden="true" />
                </div>
                <div className="text-xs font-bold text-amber-700 mb-2">STEG {step.num}</div>
                <h3 className="text-2xl font-bold text-brand-950 mb-3">{step.title}</h3>
                <p className="text-brand-900/70 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kaffe eller HelloFresh? */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">Välj rätt</div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-950 leading-tight">Kaffe eller HelloFresh?</h2>
          </div>

          {/* Desktop: tabell */}
          <div className="hidden md:block bg-white rounded-3xl overflow-hidden border border-stone-200">
            <div className="grid grid-cols-3 text-sm font-semibold">
              <div className="p-5 bg-stone-100"></div>
              <div className="p-5 text-center bg-amber-700 text-amber-50 flex items-center justify-center gap-2"><Coffee className="w-4 h-4" aria-hidden="true" /> Kaffe</div>
              <div className="p-5 text-center bg-hf-lime text-brand-950 flex items-center justify-center gap-2"><Salad className="w-4 h-4" aria-hidden="true" /> HelloFresh</div>
            </div>
            {compareRows.map((r, i) => (
              <div key={r.label} className={`grid grid-cols-3 text-sm border-t border-stone-200 ${i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}`}>
                <div className="p-5 font-medium text-brand-950">{r.label}</div>
                <div className="p-5 text-center text-brand-900/80 bg-amber-50/50">{r.kaffe}</div>
                <div className="p-5 text-center text-brand-900/80 bg-hf-soft/40">{r.hf}</div>
              </div>
            ))}
          </div>

          {/* Mobil: staplade kort */}
          <div className="md:hidden space-y-4">
            {([
              { key: 'kaffe', title: 'Kaffe', icon: Coffee, head: 'bg-amber-700 text-amber-50' },
              { key: 'hf', title: 'HelloFresh', icon: Salad, head: 'bg-hf-lime text-brand-950' },
            ] as const).map((col) => (
              <div key={col.key} className="bg-white rounded-3xl overflow-hidden border border-stone-200">
                <div className={`${col.head} px-5 py-3 font-bold flex items-center gap-2`}>
                  <col.icon className="w-4 h-4" aria-hidden="true" /> {col.title}
                </div>
                <dl className="divide-y divide-stone-200">
                  {compareRows.map((r) => (
                    <div key={r.label} className="px-5 py-3">
                      <dt className="text-xs font-semibold text-brand-900/60 uppercase tracking-wide">{r.label}</dt>
                      <dd className="text-sm text-brand-950 mt-0.5">{col.key === 'kaffe' ? r.kaffe : r.hf}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-lg font-semibold text-brand-950 mb-5">Kör båda — samma konto och klasskod</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/kaffe" className="bg-amber-700 text-amber-50 px-6 py-3 rounded-full font-semibold hover:bg-amber-800 transition inline-flex items-center gap-2">
                <Coffee className="w-4 h-4" aria-hidden="true" /> Utforska kaffet
              </Link>
              <Link to="/hellofresh" className="bg-hf-lime text-brand-950 px-6 py-3 rounded-full font-semibold hover:brightness-95 transition inline-flex items-center gap-2">
                <Salad className="w-4 h-4" aria-hidden="true" /> Utforska HelloFresh
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProfitCalculator includeHelloFresh onRegister={() => setRegOpen(true)} />

      {/* Tidiga klasser (testimonials) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">Tidiga klasser</div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-950 leading-tight mb-4">Tidiga klasser som testat oss</h2>
            <p className="text-brand-900/70 text-lg max-w-2xl mx-auto">Vi är nya — men de första klasserna har redan börjat. Här är deras ord.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: 'Vi var skeptiska till att byta från godis-försäljning. Men kaffet sålde slut på en vecka, och föräldrarna hör fortfarande av sig och vill köpa mer.', name: 'Klassmamma Anna', role: 'Klass 8B Lindbladskolan', amount: 'Insamlat: 24 800 kr' },
              { quote: 'Återköpsklubben var det som fick oss att välja Qlasskassan. Det fortsätter ticka in pengar långt efter vår kampanj är slut.', name: 'Tränare Marcus', role: 'Hammarby IF P15', amount: 'Insamlat: 18 400 kr + återköp' },
              { quote: 'Det enklaste vi gjort. Beställningar in, ett mejl till Qlasskassan, leverans till skolan en vecka senare.', name: 'Lärare Linnea', role: 'Östra Real', amount: 'Insamlat: 16 200 kr' },
            ].map((t) => (
              <div key={t.name} className="relative bg-stone-50 border border-stone-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="absolute top-5 right-5 bg-amber-200 text-amber-900 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">Tidig pilot</div>
                <p className="italic text-brand-950 text-lg leading-relaxed mb-8 mt-4">“{t.quote}”</p>
                <div className="mt-auto pt-5 border-t border-stone-200">
                  <div className="font-bold text-brand-950">{t.name}</div>
                  <div className="text-sm text-brand-900/60 mb-3">{t.role}</div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    {t.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 text-sm text-brand-900/70">
            Vill ni vara nästa?{' '}
            <button onClick={() => setRegOpen(true)} className="font-semibold text-brand-900 underline decoration-amber-400 decoration-2 underline-offset-4 hover:text-amber-700 transition">
              Kom igång gratis →
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-950 leading-tight">Frågor klassföräldrar brukar ställa</h2>
          </div>
          <Accordion type="single" collapsible className="bg-white border border-stone-200 rounded-3xl px-6 md:px-8">
            {[
              { q: 'Kostar det något att starta?', a: 'Nej. Registrering, säljmaterial och all support är gratis. Ni betalar bara för de förpackningar ni faktiskt beställer.' },
              { q: 'Måste klassen ha en förening?', a: 'Ja. För kaffet fakturerar vi föreningen, för HelloFresh betalar vi ut till föreningens konto. Oftast är det föräldraföreningen. Saknar ni det går det att registrera en enkel ideell förening på 30 minuter — vi skickar instruktioner i startguiden.' },
              { q: 'Kan vi sälja både kaffe och HelloFresh?', a: 'Ja. Ni använder samma konto, samma klasskod och samma dashboard för båda. Kör det ena, det andra eller båda samtidigt.' },
              { q: 'Hur länge tar en typisk försäljning?', a: 'Ni bestämmer själva hur länge ni säljer – allt från några dagar till hela terminen. När ni skickat in den samlade beställningen levererar vi inom 5 arbetsdagar. Många klasser kör flera säljperioder per läsår.' },
              { q: 'Vad om vi vill avbryta?', a: 'Inga bindningstider. Ni bestämmer själva när och hur mycket ni säljer. Skickar ni inte in en beställning så kostar det inget.' },
              { q: 'Hur mycket tjänar en typisk klass?', a: '25 elever som säljer 8 förpackningar var med 60 % Crema-mix landar på cirka 11 600 kr vid utlämning. Sen tickar Återköpsklubben på i 6 månader — vanligtvis 1 500–2 500 kr extra.' },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-stone-200 last:border-0">
                <AccordionTrigger className="text-left text-brand-950 font-semibold py-5 hover:no-underline hover:text-amber-700">{item.q}</AccordionTrigger>
                <AccordionContent className="text-brand-900/75 leading-relaxed pb-5">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="text-center text-sm text-brand-900/70 mt-6">
            Fler frågor om{' '}
            <Link to="/kaffe#faq" className="font-semibold text-amber-800 underline decoration-amber-400 underline-offset-4">kaffet →</Link>{' '}
            eller{' '}
            <Link to="/hellofresh#faq" className="font-semibold text-brand-800 underline decoration-hf-lime underline-offset-4">HelloFresh →</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand-900 to-brand-950 rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-6 leading-tight">Redo att starta er klasskassa?</h2>
            <p className="text-amber-100/80 text-lg mb-10 max-w-xl mx-auto">
              Registrera klassen gratis på 2 minuter — sälj kaffe, HelloFresh eller båda.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => setRegOpen(true)} className="bg-amber-300 text-brand-950 px-7 py-4 rounded-full font-bold hover:bg-amber-200 transition shadow-xl flex items-center gap-2 group">
                Kom igång gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
              </button>
              <button onClick={() => setGuideOpen(true)} className="bg-brand-800 text-amber-50 px-7 py-4 rounded-full font-semibold hover:bg-brand-700 transition border border-brand-700">
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
