import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function Cookies() {
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
        <h1 className="text-4xl font-bold text-emerald-950 mb-6">Cookies</h1>

        <p className="mb-6">
          Qlasskassan använder <strong>endast nödvändiga cookies</strong> för
          att tjänsten ska fungera (t.ex. för att hålla dig inloggad).
          Eftersom vi inte använder cookies för analys, marknadsföring eller
          spårning krävs ingen samtyckesbanner enligt lagen om elektronisk
          kommunikation (LEK).
        </p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-8 mb-3">Cookies vi sätter</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-stone-200">
            <thead className="bg-stone-100 text-emerald-950">
              <tr>
                <th className="text-left p-3 border-b border-stone-200">Namn</th>
                <th className="text-left p-3 border-b border-stone-200">Syfte</th>
                <th className="text-left p-3 border-b border-stone-200">Lagring</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-stone-200 font-mono text-xs">sb-access-token</td>
                <td className="p-3 border-b border-stone-200">Håller dig inloggad</td>
                <td className="p-3 border-b border-stone-200">1 timme</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">sb-refresh-token</td>
                <td className="p-3">Förnyar inloggningssessionen</td>
                <td className="p-3">Tills du loggar ut</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-emerald-950 mt-10 mb-3">Tredjepartstjänster</h2>
        <p>När du betalar ett återköp omdirigeras du till Stripe, som kan sätta egna cookies för att hantera betalningen. Läs mer hos <a href="https://stripe.com/cookies-policy/legal" className="text-emerald-900 underline" target="_blank" rel="noreferrer">Stripe</a>.</p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-10 mb-3">Ändringar</h2>
        <p>Om vi i framtiden börjar använda cookies för analys eller marknadsföring kommer vi att be om ditt samtycke via en banner och uppdatera den här sidan.</p>

        <p className="mt-8">Frågor? Mejla <a href="mailto:kontakt@scandinaviancoffee.se" className="text-emerald-900 underline">kontakt@scandinaviancoffee.se</a>.</p>
      </main>
    </div>
  );
}