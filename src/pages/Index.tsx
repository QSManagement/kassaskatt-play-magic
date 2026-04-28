import { useState, useEffect } from 'react';
import { Coffee, Calculator, Package, TrendingUp, Heart, ShieldCheck, Truck, Sparkles, ArrowRight, Check, Users, Repeat } from 'lucide-react';

export default function Index() {
  const [students, setStudents] = useState(25);
  const [bagsPerStudent, setBagsPerStudent] = useState(8);
  const [goldRatio, setGoldRatio] = useState(60);
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalBags = students * bagsPerStudent;
  const goldBags = Math.round(totalBags * (goldRatio / 100));
  const classicBags = totalBags - goldBags;
  const goldEarnings = goldBags * 80;
  const classicEarnings = classicBags * 60;
  const totalEarnings = goldEarnings + classicEarnings;

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled > 50 ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-900 rounded-full flex items-center justify-center">
              <Coffee className="w-5 h-5 text-amber-300" />
            </div>
            <span className="font-bold text-xl text-emerald-950">Klasskassa</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-emerald-950">
            <a href="#sa-funkar" className="hover:text-amber-700 transition">Så funkar det</a>
            <a href="#produkter" className="hover:text-amber-700 transition">Produkter</a>
            <a href="#kalkylator" className="hover:text-amber-700 transition">Räkna ut</a>
            <a href="#aterkop" className="hover:text-amber-700 transition">Återköpsklubben</a>
          </div>
          <button className="bg-emerald-900 text-amber-50 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-800 transition shadow-sm">
            Starta försäljning
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Sveriges nya klasskassa-favorit
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-emerald-950 leading-[1.05] tracking-tight mb-6">
              Sälj <span className="italic text-amber-700">premium</span> kaffe<br />
              Tjäna <span className="underline decoration-amber-400 decoration-4 underline-offset-4">tusentals</span> till klassen
            </h1>
            <p className="text-lg text-emerald-900/80 mb-8 leading-relaxed">
              Glöm trötta kataloger med kakor och kryddor. Klasskassa erbjuder Rainforest Alliance-certifierat premium kaffe från Caffè Gondoliere — produkter folk faktiskt vill köpa, igen och igen.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <button className="bg-emerald-900 text-amber-50 px-7 py-4 rounded-full font-semibold hover:bg-emerald-800 transition shadow-lg shadow-emerald-900/20 flex items-center gap-2 group">
                Kom igång gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
              <button className="bg-white text-emerald-950 px-7 py-4 rounded-full font-semibold hover:bg-stone-100 transition border border-stone-200">
                Få startguide via mail
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-emerald-900/70">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" /> Upp till 80 kr per påse</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" /> 30 dagars faktura</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" /> Fri retur av osålt</div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="text-amber-100/80 text-sm font-medium">Status</div>
                <div className="flex items-center gap-1.5 text-xs text-amber-100/60">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  Anmälan öppen
                </div>
              </div>
              <div className="text-amber-50">
                <div className="text-sm text-amber-100/70 mb-2">Vi rullar ut till svenska skolor</div>
                <div className="text-5xl font-bold tracking-tight mb-6">Lansering 2026</div>
                <div className="pt-6 border-t border-emerald-800">
                  <p className="text-amber-100/80 text-sm leading-relaxed">
                    Anmäl er klass tidigt — först till kvarn till hösten 2026. Vi hör av oss med startguide och allt ni behöver inför säsongen.
                  </p>
                </div>
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

      {/* Logos / trust strip */}
      <section className="py-10 border-y border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-xs uppercase tracking-widest text-emerald-900/50 mb-6">Officiell svensk partner till</div>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
            <div className="text-2xl font-serif italic text-emerald-950">Caffè Gondoliere</div>
            <div className="text-sm text-emerald-900/60">Rainforest Alliance-certifierat</div>
            <div className="text-sm text-emerald-900/60">100% Arabica i Gold</div>
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
              { num: '03', icon: TrendingUp, title: 'Pengarna kommer in', desc: 'Vi levererar fraktfritt, ni får faktura med 30 dagars betaltid. Klassen behåller upp till 40% av priset.', color: 'bg-stone-200' }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-stone-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className={`${step.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                  <step.icon className="w-7 h-7 text-emerald-950" />
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
              <Calculator className="w-4 h-4" /> Räkna ut er potential
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
                />
                <div className="flex justify-between text-xs text-emerald-900/50 mt-1"><span>3</span><span>20</span></div>
                <div className="text-xs text-emerald-900/60 mt-2">Snitt hos våra klasser: 8 påsar/elev</div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="font-semibold text-emerald-950">Andel Gold (premium)</label>
                  <span className="text-3xl font-bold text-emerald-900">{goldRatio}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={goldRatio}
                  onChange={(e) => setGoldRatio(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-amber-700"
                />
                <div className="flex justify-between text-xs text-emerald-900/50 mt-1"><span>Bara Classic</span><span>Bara Gold</span></div>
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
                <div className="text-amber-200/60 text-sm mb-8">Baserat på {totalBags} sålda påsar</div>

                <div className="space-y-3 pt-6 border-t border-emerald-800">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-100/80 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                      Gold ({goldBags} påsar × 80 kr)
                    </span>
                    <span className="font-bold">{goldEarnings.toLocaleString('sv-SE')} kr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-100/80 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Classic ({classicBags} påsar × 60 kr)
                    </span>
                    <span className="font-bold">{classicEarnings.toLocaleString('sv-SE')} kr</span>
                  </div>
                </div>
              </div>

              <button className="mt-8 bg-amber-300 text-emerald-950 px-6 py-4 rounded-full font-bold hover:bg-amber-200 transition flex items-center justify-center gap-2 group">
                Starta er försäljning nu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
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
              Två sorter. Båda lika lättsålda.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Classic */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 hover:shadow-2xl transition-all group">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 h-72 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-56 bg-gradient-to-b from-emerald-900 to-emerald-950 rounded-lg shadow-2xl flex flex-col items-center justify-center text-amber-50 transform group-hover:scale-105 transition-transform">
                    <div className="text-xs italic mb-1 text-amber-200">Caffè</div>
                    <div className="text-2xl font-serif font-bold">Gondoliere</div>
                    <div className="mt-3 px-3 py-1 bg-emerald-800 rounded text-xs">CLASSIC</div>
                    <div className="mt-2 text-xs text-amber-200/70">500g · Malet</div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-2xl font-bold text-emerald-950">Classic</h3>
                  <div className="text-2xl font-bold text-emerald-950">199 kr</div>
                </div>
                <p className="text-emerald-900/70 mb-6">Mellanrostat, balanserat och rikt. En smak som passar alla.</p>
                <div className="bg-emerald-50 rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-900">Klassen tjänar per påse</span>
                    <span className="text-3xl font-bold text-emerald-800">60 kr</span>
                  </div>
                  <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-700 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <div className="text-xs text-emerald-700 mt-1">30% av försäljningspriset</div>
                </div>
                <ul className="space-y-2 text-sm text-emerald-900/80">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" /> 40% Arabica / 60% Robusta</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" /> Vakuumförpackad 500g</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" /> Hållbarhet 18 mån</li>
                </ul>
              </div>
            </div>

            {/* Gold */}
            <div className="bg-white rounded-3xl overflow-hidden border-2 border-amber-300 hover:shadow-2xl transition-all group relative">
              <div className="absolute top-4 right-4 bg-amber-300 text-emerald-950 px-3 py-1 rounded-full text-xs font-bold z-10">
                BÄSTSÄLJARE
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 h-72 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-56 bg-gradient-to-b from-amber-700 via-amber-800 to-emerald-950 rounded-lg shadow-2xl flex flex-col items-center justify-center text-amber-50 transform group-hover:scale-105 transition-transform">
                    <div className="text-xs italic mb-1 text-amber-200">Caffè</div>
                    <div className="text-2xl font-serif font-bold">Gondoliere</div>
                    <div className="mt-3 px-3 py-1 bg-amber-300 text-emerald-950 rounded text-xs font-bold">GOLD</div>
                    <div className="mt-2 text-xs text-amber-200/70">500g · Malet</div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-2xl font-bold text-emerald-950">Gold</h3>
                  <div className="text-2xl font-bold text-emerald-950">249 kr</div>
                </div>
                <p className="text-emerald-900/70 mb-6">100% Arabica från höglänta odlingar. Mjuk, fyllig och elegant — klart bästsäljaren.</p>
                <div className="bg-amber-50 rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-amber-900">Klassen tjänar per påse</span>
                    <span className="text-3xl font-bold text-amber-800">80 kr</span>
                  </div>
                  <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                  <div className="text-xs text-amber-800 mt-1">32% av försäljningspriset</div>
                </div>
                <ul className="space-y-2 text-sm text-emerald-900/80">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-700" /> 100% Arabica</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-700" /> Vakuumförpackad 500g</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-700" /> Rainforest Alliance-certifierad</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-10 text-sm text-emerald-900/60">
            Bönor och fler varianter kommer snart. Maila <span className="font-medium text-emerald-900">info@klasskassa.se</span> för förbeställning.
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
                <Repeat className="w-4 h-4" /> Bara hos Klasskassa
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-6 leading-tight">
                Klassen får pengar <span className="italic text-amber-700">även</span> efter att försäljningen är slut.
              </h2>
              <p className="text-lg text-emerald-900/80 mb-8 leading-relaxed">
                Det här är vår superkraft. När en kund köpt kaffe via klassen får de en QR-kod på påsen. Återköper de kaffet på scandinaviancoffee.se inom 12 månader får klassen <strong>30 kr per påse</strong> — automatiskt, utan att eleverna lyfter ett finger.
              </p>
              <div className="bg-white rounded-2xl p-6 border border-amber-200 mb-8">
                <div className="text-sm font-semibold text-emerald-900 mb-4">Räkneexempel återköp</div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center"><span className="text-emerald-900/70">Klassen säljer 200 påsar i höstas</span><span className="font-medium">200 påsar</span></div>
                  <div className="flex justify-between items-center"><span className="text-emerald-900/70">30% återköper i snitt 4 ggr/år</span><span className="font-medium">240 återköp</span></div>
                  <div className="flex justify-between items-center pt-3 border-t border-stone-200"><span className="font-semibold text-emerald-900">Bonus till klassen</span><span className="text-2xl font-bold text-amber-700">+7 200 kr</span></div>
                </div>
              </div>
              <button className="bg-emerald-900 text-amber-50 px-7 py-4 rounded-full font-semibold hover:bg-emerald-800 transition shadow-lg flex items-center gap-2 group">
                Läs mer om återköpsklubben
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-amber-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-900 rounded-full flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-950">Klass 6B - Lindbladskolan</div>
                    <div className="text-xs text-emerald-900/60">Aktiv återköpsklubb</div>
                  </div>
                </div>
                <div className="text-emerald-900/70 text-sm mb-2">Insamlat den här månaden</div>
                <div className="text-5xl font-bold text-emerald-950 mb-1">+ 1 240 kr</div>
                <div className="text-sm text-emerald-700 mb-6">från återkommande kunder</div>
                <div className="space-y-3">
                  {[
                    { name: 'Anna L.', amount: '+ 60 kr', detail: '2× Gold' },
                    { name: 'Markus B.', amount: '+ 30 kr', detail: '1× Classic' },
                    { name: 'Sofia W.', amount: '+ 90 kr', detail: '3× Gold' },
                    { name: 'Erik J.', amount: '+ 60 kr', detail: '2× Classic' }
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

      {/* Jämförelse */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-3">Varför kaffe?</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight">
              Bättre än kakor, kryddor och tomter.
            </h2>
          </div>

          <div className="bg-stone-50 rounded-3xl overflow-hidden border border-stone-200">
            <div className="grid grid-cols-4 bg-emerald-950 text-amber-50 text-sm font-semibold">
              <div className="p-5"></div>
              <div className="p-5 text-center bg-amber-700">Klasskassa</div>
              <div className="p-5 text-center">Kakor</div>
              <div className="p-5 text-center">Kryddor</div>
            </div>
            {[
              ['Marginal till klassen', '60–80 kr/påse', '20–30 kr/box', '49–54 kr/box'],
              ['Återkommande kunder', 'Ja, automatiskt', 'Sällan', 'Sällan'],
              ['Förbrukningsvara', 'Ja — köps om varje månad', 'Nej', 'Nej'],
              ['Premium-känsla', 'Hög', 'Låg', 'Mellan'],
              ['Påsar som behövs (15 000 kr)', '~190', '~600', '~290']
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-4 text-sm border-t border-stone-200 ${i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}`}>
                <div className="p-5 font-medium text-emerald-950">{row[0]}</div>
                <div className="p-5 text-center font-bold text-emerald-800 bg-amber-50/50">{row[1]}</div>
                <div className="p-5 text-center text-emerald-900/70">{row[2]}</div>
                <div className="p-5 text-center text-emerald-900/70">{row[3]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trygghet */}
      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 leading-tight">
              Tryggt från första påsen.
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: '30 dagars faktura', desc: 'Sälj först, betala sedan. Ingen risk för klassen.' },
              { icon: Truck, title: 'Fri frakt', desc: 'Vi levererar direkt till skolan, alltid utan kostnad.' },
              { icon: Repeat, title: 'Fri retur av osålt', desc: 'Det ni inte säljer kan ni returnera utan kostnad.' },
              { icon: Heart, title: '1,5% till välgörenhet', desc: 'Av varje försäljning går en del till barn i nöd.' }
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <f.icon className="w-7 h-7 text-amber-300" />
                </div>
                <h3 className="font-bold text-emerald-950 mb-2">{f.title}</h3>
                <p className="text-sm text-emerald-900/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
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
              <button className="bg-amber-300 text-emerald-950 px-7 py-4 rounded-full font-bold hover:bg-amber-200 transition shadow-xl flex items-center gap-2 group">
                Kom igång gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
              <button className="bg-emerald-800 text-amber-50 px-7 py-4 rounded-full font-semibold hover:bg-emerald-700 transition border border-emerald-700">
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
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-amber-300 rounded-full flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-emerald-950" />
                </div>
                <span className="font-bold text-xl text-amber-50">Klasskassa</span>
              </div>
              <p className="text-sm leading-relaxed">Premium kaffe för klassinsamlingar. Officiell svensk partner till Caffè Gondoliere.</p>
            </div>
            <div>
              <div className="font-semibold text-amber-50 mb-4 text-sm">Produkter</div>
              <ul className="space-y-2 text-sm">
                <li>Classic 500g</li>
                <li>Gold 500g</li>
                <li>Bönor (kommer snart)</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-amber-50 mb-4 text-sm">Information</div>
              <ul className="space-y-2 text-sm">
                <li>Så funkar det</li>
                <li>Återköpsklubben</li>
                <li>Vanliga frågor</li>
                <li>Referenser</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-amber-50 mb-4 text-sm">Kontakt</div>
              <ul className="space-y-2 text-sm">
                <li>info@klasskassa.se</li>
                <li>070-123 45 67</li>
                <li>Vardagar 9-17</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-emerald-800 text-xs flex flex-wrap justify-between gap-4">
            <div>© 2026 Klasskassa · Drivs av Scandinavian Coffee AB</div>
            <div className="flex gap-6">
              <span>Allmänna villkor</span>
              <span>Integritetspolicy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
