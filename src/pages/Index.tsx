import { useState, useEffect } from 'react';
import {
  Calculator, Package, TrendingUp, ShieldCheck, Truck, Sparkles, ArrowRight, Check, Users, Repeat,
  Menu, X, ClipboardList, Wallet,
} from 'lucide-react';
import { RegistrationDialog } from '@/components/registration/RegistrationDialog';
import { StartguideDialog } from '@/components/registration/StartguideDialog';
import { Logo } from '@/components/Logo';
import coffeeGold from '@/assets/coffee-gold.png';
import coffeeCrema from '@/assets/coffee-crema.png';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NAV_LINKS = [
  { href: '#sa-funkar', label: 'Så funkar det' },
  { href: '#produkter', label: 'Produkter' },
  { href: '#kalkylator', label: 'Räkna ut' },
  { href: '#aterkop', label: 'Återköpsklubben' },
  { href: '#faq', label: 'Frågor' },
];

export default function Index() {
  const [students, setStudents] = useState(25);
  const [bagsPerStudent, setBagsPerStudent] = useState(10);
  const [goldRatio, setGoldRatio] = useState(60);
  const [scrolled, setScrolled] = useState(0);
  const [regOpen, setRegOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalBags = students * bagsPerStudent;
  const goldBags = Math.round(totalBags * (goldRatio / 100));
  const classicBags = totalBags - goldBags;
  const goldEarnings = goldBags * 70; // Crema: 70 kr/påse
  const classicEarnings = classicBags * 50; // Gold: 50 kr/påse
  const totalEarnings = goldEarnings + classicEarnings;
  const reorderEarnings = Math.round(totalEarnings * 0.05);

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled > 50 ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-3 md:py-4 flex items-center justify-between gap-4">
          <a
            href="#"
            aria-label="Qlasskassan – startsida"
            className="relative -mb-8 md:-mb-10 flex items-center"
          >
            <Logo size="sm" variant="dark" />
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-emerald-950">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-amber-700 transition">{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRegOpen(true)}
              aria-label="Starta försäljning"
              className="hidden sm:inline-flex bg-emerald-900 text-amber-50 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-800 transition shadow-sm"
            >
              Starta försäljning
            </button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button aria-label="Öppna meny" className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-900 text-amber-50">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-stone-50 border-l border-stone-200 p-6 w-[80vw] max-w-sm">
                <div className="flex items-center justify-between mb-8">
                  <Logo size="sm" variant="dark" />
                  <button aria-label="Stäng meny" onClick={() => setMobileOpen(false)} className="w-9 h-9 rounded-full hover:bg-stone-200 inline-flex items-center justify-center">
                    <X className="w-5 h-5 text-emerald-950" />
                  </button>
                </div>
                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-xl text-emerald-950 font-medium hover:bg-amber-100 transition"
                    >
                      {l.label}
                    </a>
                  ))}
                </nav>
                <button
                  onClick={() => { setMobileOpen(false); setRegOpen(true); }}
                  className="mt-8 w-full bg-emerald-900 text-amber-50 px-5 py-3 rounded-full text-sm font-semibold hover:bg-emerald-800 transition"
                >
                  Starta försäljning
                </button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Sveriges nya klasskassa-favorit
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-emerald-950 leading-[1.05] tracking-tight mb-6">
              <span className="block">Sälj <span className="italic text-amber-700">premium</span> kaffe</span>
              <span className="block">Bygg er <span className="underline decoration-amber-400 decoration-4 underline-offset-4">klasskassa</span> på fyra veckor</span>
            </h1>

            {/* I1: Sifferstrip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-emerald-900/80 mb-6">
              <span className="inline-flex items-center gap-2">
                <span className="text-amber-700 font-bold">+15 kr/påse</span>
                <span className="text-emerald-900/60">Återköpsbonus</span>
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-amber-400" aria-hidden="true"></span>
              <span className="inline-flex items-center gap-2">
                <span className="text-amber-700 font-bold">0 kr</span>
                <span className="text-emerald-900/60">att starta</span>
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-amber-400" aria-hidden="true"></span>
              <span className="inline-flex items-center gap-2">
                <span className="text-amber-700 font-bold">4 v</span>
                <span className="text-emerald-900/60">typisk kampanj</span>
              </span>
            </div>

            <p className="text-lg text-emerald-900/80 mb-8 leading-relaxed">
              Glöm trötta kataloger med kakor och kryddor. Qlasskassan erbjuder Rainforest Alliance-certifierat premium kaffe från Caffè Gondoliere — produkter folk faktiskt vill köpa, igen och igen.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <button onClick={() => setRegOpen(true)} aria-label="Kom igång gratis" className="bg-emerald-900 text-amber-50 px-7 py-4 rounded-full font-semibold hover:bg-emerald-800 transition shadow-lg shadow-emerald-900/20 flex items-center gap-2 group">
                Kom igång gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
              </button>
              <button onClick={() => setGuideOpen(true)} aria-label="Få startguide via mail" className="bg-white text-emerald-950 px-7 py-4 rounded-full font-semibold hover:bg-stone-100 transition border border-stone-200">
                Få startguide via mail
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-emerald-900/70">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" aria-hidden="true" /> Upp till 70 kr per påse till klassen</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" aria-hidden="true" /> Faktura till föreningen, 14 dagar</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" aria-hidden="true" /> Inget osålt — vi rullar exakt volym</div>
            </div>
          </div>

          {/* Hero kort: Anmälan inför HT 2026 */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="text-amber-100/80 text-sm font-medium">Status</div>
                <div className="flex items-center gap-1.5 text-xs text-amber-100/60">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  Pilot — anmälan öppen
                </div>
              </div>
              <div className="text-amber-50">
                <div className="text-sm text-amber-100/70 mb-2">Vi rullar ut till svenska skolor</div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Anmälan inför HT 2026</div>
                <p className="text-amber-100/80 text-sm leading-relaxed mt-4">
                  Vi tar in 50 pilotklasser inför hösten. Snäppet före alla andra. Anmäl er — vi hör av oss inom 24 timmar.
                </p>

                <div className="mt-6 pt-6 border-t border-emerald-800">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-amber-200/70 text-xs uppercase tracking-widest">Pilotplatser</span>
                    <span className="text-amber-50 font-bold tabular-nums"><span className="text-amber-300">37</span> / 50 kvar</span>
                  </div>
                  <div className="h-1.5 bg-emerald-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full" style={{ width: `${(37 / 50) * 100}%` }}></div>
                  </div>
                </div>

                <button onClick={() => setRegOpen(true)} className="mt-6 w-full bg-amber-300 text-emerald-950 px-5 py-3 rounded-full font-bold hover:bg-amber-200 transition flex items-center justify-center gap-2 group">
                  Anmäl er klass
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-amber-300 text-emerald-950 px-5 py-3 rounded-2xl font-bold shadow-xl rotate-3">
              <div className="text-xs">Tidig anmälan</div>
              <div className="text-2xl">öppen</div>
              <div className="text-xs">just nu</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-10 border-y border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-xs uppercase tracking-widest text-emerald-900/50 mb-6">Auktoriserad svensk återförsäljare av</div>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
            <div className="text-2xl font-serif italic text-emerald-950">Caffè Gondoliere</div>
            <div className="text-sm text-emerald-900/60">Rainforest Alliance-certifierat</div>
            <div className="text-sm text-emerald-900/60">100% Arabica i Crema</div>
            <div className="text-sm text-emerald-900/60">Ett av Europas största rosterier</div>
          </div>
        </div>
      </section>

      {/* Så funkar det */}
      <section id="sa-funkar" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">Så funkar det</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 max-w-3xl mx-auto leading-tight">
              Tre enkla steg från start till klassresa
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', icon: Package, title: 'Registrera klassen', desc: 'Gratis och tar 2 minuter. Fyll i klass, antal elever och ert mål — ni får direkt tillgång till en egen dashboard.', color: 'bg-amber-100' },
              { num: '02', icon: Users, title: 'Klassen säljer', desc: 'Eleverna säljer till familj, grannar och vänner. Allt går via vår enkla webbshop eller papperskatalog.', color: 'bg-emerald-100' },
              { num: '03', icon: TrendingUp, title: 'Pengarna kommer in', desc: 'Klassen samlar in beställningar och pengar. Vi fakturerar föreningen exakt volym med 14 dagars betaltid och levererar till skolan. Klassen behåller hela sin marginal.', color: 'bg-stone-200' }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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

      {/* Kalkylator */}
      <section id="kalkylator" className="py-24 px-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 relative overflow-hidden">
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

          <div className="bg-amber-50 rounded-3xl p-8 md:p-12 shadow-2xl grid md:grid-cols-2 gap-12">
            {/* Inputs */}
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
                  <label className="font-semibold text-emerald-950">Påsar per elev</label>
                  <span className="text-3xl font-bold text-emerald-900">{bagsPerStudent}</span>
                </div>
                <input
                  type="range" min="3" max="20" value={bagsPerStudent}
                  onChange={(e) => setBagsPerStudent(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-emerald-800"
                  aria-label="Påsar per elev"
                />
                <div className="flex justify-between text-xs text-emerald-900/50 mt-1"><span>3</span><span>20</span></div>
                <div className="text-xs text-emerald-900/60 mt-2">Snitt hos våra klasser: 8 påsar/elev</div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="font-semibold text-emerald-950">Andel Crema (premium)</label>
                  <span className="text-3xl font-bold text-emerald-900">{goldRatio}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={goldRatio}
                  onChange={(e) => setGoldRatio(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-amber-700"
                  aria-label="Andel Crema"
                />
                <div className="flex justify-between text-xs text-emerald-900/50 mt-1"><span>Bara Gold</span><span>Bara Crema</span></div>
              </div>
            </div>

            {/* Output */}
            <div className="bg-emerald-950 rounded-2xl p-8 text-amber-50 flex flex-col justify-between">
              <div>
                <div className="text-amber-200/70 text-sm font-medium mb-2">Total intäkt till klasskassan</div>
                <div className="text-6xl md:text-7xl font-bold tracking-tight mb-2">
                  {totalEarnings.toLocaleString('sv-SE')}
                  <span className="text-2xl text-amber-200/70 ml-2">kr</span>
                </div>
                <div className="text-amber-200/60 text-sm mb-3">Baserat på {totalBags} sålda påsar</div>
                <div className="inline-flex items-center gap-2 bg-amber-300/15 text-amber-200 px-3 py-1.5 rounded-full text-xs font-medium mb-8">
                  <Repeat className="w-3 h-3" aria-hidden="true" />
                  + ungefär {reorderEarnings.toLocaleString('sv-SE')} kr extra från Återköpsklubben (6 mån)
                </div>

                <div className="space-y-3 pt-6 border-t border-emerald-800">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-100/80 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                      Crema ({goldBags} påsar × 70 kr)
                    </span>
                    <span className="font-bold">{goldEarnings.toLocaleString('sv-SE')} kr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-100/80 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Gold ({classicBags} påsar × 50 kr)
                    </span>
                    <span className="font-bold">{classicEarnings.toLocaleString('sv-SE')} kr</span>
                  </div>
                </div>
              </div>

              <button onClick={() => setRegOpen(true)} className="mt-8 bg-amber-300 text-emerald-950 px-6 py-4 rounded-full font-bold hover:bg-amber-200 transition flex items-center justify-center gap-2 group">
                Starta er försäljning nu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Produkter */}
      <section id="produkter" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">Sortimentet</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 max-w-3xl mx-auto leading-tight">
              Två sorter — båda lika lättsålda
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Gold (basprodukt) */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-stone-100 to-stone-50 h-72 flex items-center justify-center relative overflow-hidden">
                <img
                  src={coffeeGold}
                  alt="Caffè Gondoliere Gold 500g malet filterkaffe"
                  className="h-64 w-auto object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-8">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-2xl font-bold text-emerald-950">Gold</h3>
                  <div className="text-2xl font-bold text-emerald-950">169 kr</div>
                </div>
                <p className="text-emerald-900/70 mb-6">Premium 100% Arabica malet filterkaffe. Mjuk, aromatisk och välbalanserad — en klassiker för bryggkaffe hemma och på kontoret.</p>
                <div className="bg-emerald-50 rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-900">Klassen tjänar per påse</span>
                    <span className="text-3xl font-bold text-emerald-800">50 kr</span>
                  </div>
                  <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-700 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <div className="text-xs text-emerald-700 mt-1 font-medium">Sälj 8 påsar = 400 kr till klassen</div>
                </div>
                <ul className="space-y-2 text-sm text-emerald-900/80">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" aria-hidden="true" /> 100% Arabica · malet filterkaffe</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" aria-hidden="true" /> 500 g påse</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" aria-hidden="true" /> Rainforest Alliance-certifierad</li>
                </ul>
              </div>
            </div>

            {/* Crema (premium) */}
            <div className="bg-white rounded-3xl overflow-hidden border-2 border-amber-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative">
              <div className="absolute top-4 right-4 bg-amber-300 text-emerald-950 px-3 py-1 rounded-full text-xs font-bold z-10">
                KLASSENS FAVORIT
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 h-72 flex items-center justify-center relative overflow-hidden">
                <img
                  src={coffeeCrema}
                  alt="Caffè Gondoliere Crema 1 kg hela bönor — 100% Arabica"
                  className="h-64 w-auto object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-8">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-2xl font-bold text-emerald-950">Crema</h3>
                  <div className="text-2xl font-bold text-emerald-950">249 kr</div>
                </div>
                <p className="text-emerald-900/70 mb-6">100% Arabica i hela bönor. Balanserad, len och nötig med naturlig sötma och len crema — lyxvalet för espresso och fullautomater.</p>
                <div className="bg-amber-50 rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-amber-900">Klassen tjänar per påse</span>
                    <span className="text-3xl font-bold text-amber-800">70 kr</span>
                  </div>
                  <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                  <div className="text-xs text-amber-800 mt-1 font-medium">Sälj 8 påsar = 560 kr till klassen</div>
                </div>
                <ul className="space-y-2 text-sm text-emerald-900/80">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-700" aria-hidden="true" /> 100% Arabica</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-700" aria-hidden="true" /> Hela bönor · 1 kg påse</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-700" aria-hidden="true" /> Rainforest Alliance-certifierad</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-10 text-sm text-emerald-900/60">
            Bönor och fler varianter kommer snart. Maila <span className="font-medium text-emerald-900">info@qlasskassan.se</span> för förbeställning.
          </div>
        </div>
      </section>

      {/* Återköpsklubben */}
      <section id="aterkop" className="py-24 px-6 bg-amber-50 relative overflow-hidden">
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
                Det här är vår superkraft. När en kund köpt kaffe via klassen får de en QR-kod på påsen. Återköper de kaffet på scandinaviancoffee.se inom 6 månader får klassen <strong>15 kr per påse</strong> — automatiskt, utan att eleverna lyfter ett finger.
              </p>
              <div className="bg-white rounded-2xl p-6 border border-amber-200 mb-8">
                <div className="text-sm font-semibold text-emerald-900 mb-4">Räkneexempel återköp</div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center"><span className="text-emerald-900/70">Klassen säljer 200 påsar</span><span className="font-medium">200 påsar</span></div>
                  <div className="flex justify-between items-center"><span className="text-emerald-900/70">30 % återköper i snitt 2 ggr på 6 mån</span><span className="font-medium">120 återköp</span></div>
                  <div className="flex justify-between items-center pt-3 border-t border-stone-200"><span className="font-semibold text-emerald-900">Bonus till klassen</span><span className="text-2xl font-bold text-amber-700">+1 800 kr</span></div>
                </div>
              </div>
              <button onClick={() => setRegOpen(true)} aria-label="Anmäl er klass" className="bg-emerald-900 text-amber-50 px-7 py-4 rounded-full font-semibold hover:bg-emerald-800 transition shadow-lg flex items-center gap-2 group">
                Anmäl er klass
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-amber-200">
                <div className="flex items-center gap-3 mb-6">
                  <Logo size="md" variant="dark" showWordmark={false} />
                  <div>
                    <div className="font-bold text-emerald-950">Klass 6B - Lindbladskolan</div>
                    <div className="text-xs text-emerald-900/60">Aktiv återköpsklubb</div>
                  </div>
                </div>
                <div className="text-emerald-900/70 text-sm mb-2">Insamlat den här månaden</div>
                <div className="text-5xl font-bold text-emerald-950 mb-1">+ 540 kr</div>
                <div className="text-sm text-emerald-700 mb-6">från återkommande kunder · räkneexempel</div>
                <div className="space-y-3">
                  {[
                    { name: 'Anna L.', amount: '+ 30 kr', detail: '2× Crema' },
                    { name: 'Markus B.', amount: '+ 15 kr', detail: '1× Gold' },
                    { name: 'Sofia W.', amount: '+ 45 kr', detail: '3× Crema' },
                    { name: 'Erik J.', amount: '+ 30 kr', detail: '2× Gold' }
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-emerald-950">{tx.name}</div>
                        <div className="text-xs text-emerald-900/60">{tx.detail}</div>
                      </div>
                      <div className="text-sm font-bold text-amber-700">{tx.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-amber-300 text-emerald-950 px-4 py-2 rounded-2xl font-bold text-sm shadow-xl rotate-[-3deg]">
                Passiv inkomst
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tidiga klasser (testimonials) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">Tidiga klasser</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight mb-4">
              Tidiga klasser som testat oss
            </h2>
            <p className="text-emerald-900/70 text-lg max-w-2xl mx-auto">
              Vi är nya — men de första klasserna har redan börjat. Här är deras ord.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: 'Vi var skeptiska till att byta från godis-försäljning. Men kaffet sålde slut på en vecka, och föräldrarna hör fortfarande av sig och vill köpa mer.',
                name: 'Klassmamma Anna',
                role: 'Klass 8B Lindbladskolan',
                amount: 'Insamlat: 24 800 kr',
              },
              {
                quote: 'Återköpsklubben var det som fick oss att välja Qlasskassan. Det fortsätter ticka in pengar långt efter vår kampanj är slut.',
                name: 'Tränare Marcus',
                role: 'Hammarby IF P15',
                amount: 'Insamlat: 18 400 kr + återköp',
              },
              {
                quote: 'Det enklaste vi gjort. Beställningar in, ett mejl till Qlasskassan, leverans till skolan en vecka senare.',
                name: 'Lärare Linnea',
                role: 'Östra Real',
                amount: 'Insamlat: 16 200 kr',
              },
            ].map((t, i) => (
              <div key={i} className="relative bg-stone-50 border border-stone-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="absolute top-5 right-5 bg-amber-200 text-amber-900 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  Tidig pilot
                </div>
                <p className="italic text-emerald-950 text-lg leading-relaxed mb-8 mt-4">
                  “{t.quote}”
                </p>
                <div className="mt-auto pt-5 border-t border-stone-200">
                  <div className="font-bold text-emerald-950">{t.name}</div>
                  <div className="text-sm text-emerald-900/60 mb-3">{t.role}</div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    {t.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 text-sm text-emerald-900/70">
            Vill ni vara nästa?{' '}
            <button onClick={() => setRegOpen(true)} className="font-semibold text-emerald-900 underline decoration-amber-400 decoration-2 underline-offset-4 hover:text-amber-700 transition">
              Kom igång gratis →
            </button>
          </div>
        </div>
      </section>

      {/* Jämförelse */}
      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">Varför kaffe?</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight">
              Jämför med vad ni redan känner till
            </h2>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200">
            <div className="grid grid-cols-4 bg-emerald-950 text-amber-50 text-sm font-semibold">
              <div className="p-5"></div>
              <div className="p-5 text-center bg-amber-700">Qlasskassan</div>
              <div className="p-5 text-center">Kakor</div>
              <div className="p-5 text-center">Kryddor</div>
            </div>
            {[
              ['Marginal till klassen', '50–70 kr/påse', '20–30 kr/box', '49–54 kr/box'],
              ['Återkommande kunder', 'Ja, automatiskt', 'Sällan', 'Sällan'],
              ['Förbrukningsvara', 'Ja — köps om varje månad', 'Nej', 'Nej'],
              ['Premium-känsla', 'Hög', 'Låg', 'Mellan'],
              ['Påsar/boxar för 15 000 kr', '~190', '~600', '~290'],
              ['Återköpsbonus efter kampanj', 'Ja — 15 kr/påse i 6 mån', 'Nej', 'Nej'],
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-4 text-sm border-t border-stone-200 ${i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}`}>
                <div className="p-5 font-medium text-emerald-950">{row[0]}</div>
                <div className="p-5 text-center font-bold text-emerald-800 bg-amber-50/50">{row[1]}</div>
                <div className="p-5 text-center text-emerald-900/70">{row[2]}</div>
                <div className="p-5 text-center text-emerald-900/70">{row[3]}</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-emerald-900/50 mt-4 text-center">
            *Marginalsiffror baserade på publika prisuppgifter från etablerade aktörer på marknaden (april 2026).
          </p>
        </div>
      </section>

      {/* Trygghet — D1 */}
      <section className="py-24 px-6 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight mb-5">
              Schysst för båda — glasklart från start
            </h2>
            <p className="text-emerald-900/75 text-lg leading-relaxed">
              Vi är ett nystartat svenskt kafferosteri. Vi älskar klasserna vi jobbar med — men vi måste också kunna leverera till nästa klass. Därför håller vi det enkelt och rättvist.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: ClipboardList, title: 'Beställningar först, leverans sedan', desc: 'Klassen samlar in beställningar och pengar från familj, grannar och vänner. Inga osålda lager, inget svinn.' },
              { icon: Wallet, title: 'Faktura mot föreningens konto', desc: 'När ni skickat in beställningen fakturerar vi föreningen för exakt volym — 14 dagars betaltid. Klassen behåller sin marginal direkt.' },
              { icon: Truck, title: 'Vi levererar till skolan', desc: 'Fri leverans till skolan på beställningar över 50 påsar. Ni packar och delar ut själva — eleverna sköter sin runda i området.' },
              { icon: Sparkles, title: 'Återköpsklubben ingår alltid', desc: 'När er kampanj är slut fortsätter klassen tjäna 15 kr per återköp i 6 månader — automatiskt, utan att ni gör något.' },
            ].map((f, i) => (
              <div key={i} className="text-center bg-white border border-stone-200 rounded-3xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight">
              Frågor klassföräldrar brukar ställa
            </h2>
          </div>
          <Accordion type="single" collapsible className="bg-white border border-stone-200 rounded-3xl px-6 md:px-8">
            {[
              { q: 'Hur länge tar en typisk försäljning?', a: 'Från kickoff till utlämning brukar det landa på 4 veckor. Ni säljer i 2–3 veckor, samlar in beställningar och pengar, vi levererar inom 5 arbetsdagar.' },
              { q: 'Hur går betalningen till?', a: 'Klassen samlar in pengar från kunderna (Swish till föreningens konto). När ni skickar in den samlade beställningen till oss fakturerar vi föreningen för vår del — med 14 dagars betaltid. Klassen behåller mellanskillnaden direkt.' },
              { q: 'Vad händer om en kund ångrar sig?', a: 'Eftersom ni samlar in beställningar och pengar innan vi packar och kör så händer det sällan. Skulle det ändå göra det, hör av er — vi löser det.' },
              { q: 'Måste klassen ha en förening?', a: 'Ja, vi fakturerar mot ett organisationsnummer (oftast föräldraföreningen). Saknar ni det går det att registrera en enkel ideell förening på 30 minuter — vi skickar instruktioner i startguiden.' },
              { q: 'Kostar det något att starta?', a: 'Nej. Registrering, säljmaterial och all support är gratis. Ni betalar bara för de påsar ni faktiskt beställer.' },
              { q: 'Hur funkar Återköpsklubben rent tekniskt?', a: 'Varje påse har en QR-kod som leder till scandinaviancoffee.se. När en kund handlar där och anger klasskoden får klassen 15 kr per påse — i 6 månader. Vi mejlar er en månadsrapport.' },
              { q: 'Är kaffet faktiskt premium?', a: 'Caffè Gondoliere är ett av Europas största rosterier, certifierat av Rainforest Alliance. Crema är 100 % höglands-Arabica i hela bönor. Provsmaka själva — vi skickar gratis sample-paket till intresserade lärare på begäran.' },
              { q: 'Vad om vi vill avbryta?', a: 'Inga bindningstider. Ni bestämmer själva när och hur mycket ni säljer. Skickar ni inte in en beställning så kostar det inget.' },
              { q: 'Hur mycket tjänar en typisk klass?', a: '25 elever som säljer 8 påsar var med 60 % Crema-mix landar på cirka 11 600 kr vid utlämning. Sen tickar Återköpsklubben på i 6 månader — vanligtvis 1 500–2 500 kr extra.' },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-stone-200 last:border-0">
                <AccordionTrigger className="text-left text-emerald-950 font-semibold py-5 hover:no-underline hover:text-amber-700">
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
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-6 leading-tight">
              Redo att starta er klasskassa?
            </h2>
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

      {/* Footer */}
      <footer className="py-12 px-6 bg-emerald-950 text-amber-100/70">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <Logo size="md" variant="light" showTagline />
              </div>
              <p className="text-sm leading-relaxed">Premium kaffe för klassinsamlingar. Auktoriserad svensk återförsäljare av Caffè Gondoliere.</p>
            </div>
            <div>
              <div className="font-semibold text-amber-50 mb-4 text-sm">Produkter</div>
              <ul className="space-y-2 text-sm">
                <li>Gold 500g</li>
                <li>Crema 1 kg bönor</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-amber-50 mb-4 text-sm">Information</div>
              <ul className="space-y-2 text-sm">
                <li><a href="#sa-funkar" className="hover:text-amber-300 transition">Så funkar det</a></li>
                <li><a href="#aterkop" className="hover:text-amber-300 transition">Återköpsklubben</a></li>
                <li><a href="#faq" className="hover:text-amber-300 transition">Vanliga frågor</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-amber-50 mb-4 text-sm">Kontakt</div>
              <ul className="space-y-2 text-sm">
                <li>info@qlasskassan.se</li>
                <li>070-123 45 67</li>
                <li>Vardagar 9-17</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-emerald-800 text-xs flex flex-wrap justify-between gap-4">
            <div>© 2026 Qlasskassan · Drivs av Scandinavian Coffee AB</div>
            <div className="flex gap-6">
              <span>Allmänna villkor</span>
              <span>Integritetspolicy</span>
            </div>
          </div>
        </div>
      </footer>

      <RegistrationDialog open={regOpen} onOpenChange={setRegOpen} />
      <StartguideDialog open={guideOpen} onOpenChange={setGuideOpen} />
    </div>
  );
}