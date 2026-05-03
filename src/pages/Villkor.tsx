import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function Villkor() {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/"><Logo size="md" variant="dark" /></Link>
          <Link to="/" className="text-sm text-emerald-900 hover:underline">← Till startsidan</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12 text-stone-800 leading-relaxed">
        <p className="text-xs uppercase tracking-wide text-stone-500 mb-2">Senast uppdaterad: 3 maj 2026</p>
        <h1 className="text-4xl font-bold text-emerald-950 mb-6">Allmänna villkor</h1>

        <h2 className="text-2xl font-bold text-emerald-950 mt-8 mb-3">1. Om tjänsten</h2>
        <p>Qlasskassan tillhandahålls av Scandinavian Coffee AB och hjälper klasser att samla in pengar genom försäljning av premium kaffe från Caffè Gondoliere. Beställningen görs av en lärare eller klassrepresentant för klassens/föreningens räkning.</p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-8 mb-3">2. Beställning och avtal</h2>
        <p>Bindande avtal uppstår när vi bekräftat beställningen via e-post. Beställaren ansvarar för att lämnade uppgifter (mottagare, leveransadress, faktureringsuppgifter) är korrekta.</p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-8 mb-3">3. Priser och betalning</h2>
        <p>Priser anges inklusive moms. Klassbeställningar faktureras föreningen/skolan med 30 dagars betalningsvillkor. Återköp av enskilda hushåll betalas direkt via Stripe.</p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-8 mb-3">4. Leverans</h2>
        <p>Klassbeställningar levereras fritt till angiven skola. Leveranstid är normalt 5–10 arbetsdagar efter bekräftad order. Återköp levereras till angiven adress enligt valt fraktsätt.</p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-8 mb-3">5. Reklamation</h2>
        <p>Eftersom produkten är livsmedel ber vi dig att kontrollera leveransen direkt vid mottagandet och anmäla eventuella fel inom skälig tid till <a href="mailto:kontakt@scandinaviancoffee.se" className="text-emerald-900 underline">kontakt@scandinaviancoffee.se</a>.</p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-8 mb-3">6. Ångerrätt</h2>
        <p>Ångerrätt enligt distansavtalslagen gäller normalt inte för livsmedel som riskerar att försämras snabbt (2 kap. 11 § distansavtalslagen). Skadat eller felaktigt levererat gods byts eller krediteras alltid.</p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-8 mb-3">7. Ansvarsbegränsning</h2>
        <p>Vårt ansvar är begränsat till varans värde. Vi ansvarar inte för indirekta skador eller utebliven vinst.</p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-8 mb-3">8. Personuppgifter</h2>
        <p>Vi behandlar personuppgifter i enlighet med vår <Link to="/integritetspolicy" className="text-emerald-900 underline">integritetspolicy</Link>.</p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-8 mb-3">9. Tvist</h2>
        <p>Svensk lag tillämpas. Tvist prövas i första hand i svensk allmän domstol. Konsumenter kan även vända sig till Allmänna reklamationsnämnden (ARN), arn.se.</p>
      </main>
    </div>
  );
}