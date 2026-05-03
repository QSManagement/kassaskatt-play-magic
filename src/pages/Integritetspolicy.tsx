import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function Integritetspolicy() {
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
        <h1 className="text-4xl font-bold text-emerald-950 mb-6">Integritetspolicy</h1>
        <p className="mb-6">
          Den här policyn beskriver hur Qlasskassan behandlar personuppgifter
          i samband med att du använder vår tjänst för klassinsamlingar.
          Vi följer dataskyddsförordningen (GDPR).
        </p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-10 mb-3">Personuppgiftsansvarig</h2>
        <p className="mb-2">
          Qlasskassan (drivs av Scandinavian Coffee AB, org.nr <em>[fyll i]</em>).
        </p>
        <p>Kontakt i dataskyddsfrågor: <a href="mailto:kontakt@scandinaviancoffee.se" className="text-emerald-900 underline">kontakt@scandinaviancoffee.se</a></p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-10 mb-3">Vilka uppgifter vi samlar in</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Lärare:</strong> namn, e-post, telefonnummer, skola och klassnamn vid registrering.</li>
          <li><strong>Föräldrar/återköpskunder:</strong> namn, e-post, leveransadress samt betalinformation som hanteras av Stripe.</li>
          <li><strong>Leads:</strong> namn, e-post och skola när du laddar ner vår startguide.</li>
          <li><strong>Elever:</strong> namn, om läraren väljer att lägga in dem för intern uppföljning.</li>
          <li><strong>Tekniska uppgifter:</strong> IP-adress och loggar i samband med inloggning och betalningar.</li>
        </ul>

        <h2 className="text-2xl font-bold text-emerald-950 mt-10 mb-3">Ändamål och rättslig grund</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-stone-200">
            <thead className="bg-stone-100 text-emerald-950">
              <tr>
                <th className="text-left p-3 border-b border-stone-200">Ändamål</th>
                <th className="text-left p-3 border-b border-stone-200">Rättslig grund</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-3 border-b border-stone-200">Skapa och hantera lärarkonto</td><td className="p-3 border-b border-stone-200">Avtal</td></tr>
              <tr><td className="p-3 border-b border-stone-200">Beställning, leverans och fakturering</td><td className="p-3 border-b border-stone-200">Avtal</td></tr>
              <tr><td className="p-3 border-b border-stone-200">Marknadsföring och nyhetsbrev</td><td className="p-3 border-b border-stone-200">Samtycke (avregistrering i varje mejl)</td></tr>
              <tr><td className="p-3 border-b border-stone-200">Återköpsnotiser till lärare</td><td className="p-3 border-b border-stone-200">Berättigat intresse</td></tr>
              <tr><td className="p-3">Bokföring</td><td className="p-3">Rättslig förpliktelse (bokföringslagen)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-emerald-950 mt-10 mb-3">Mottagare och underbiträden</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Lovable Cloud (Supabase):</strong> databas, autentisering och edge functions (EU).</li>
          <li><strong>Stripe:</strong> betalningar för återköp.</li>
          <li><strong>Resend:</strong> utskick av transaktions- och marknadsmejl.</li>
          <li><strong>Caffè Gondoliere / fraktpartner:</strong> tillverkning och leverans.</li>
        </ul>
        <p className="mt-3">Vissa underbiträden kan innebära överföring till tredje land (t.ex. USA). Sådan överföring sker i så fall med EU-kommissionens standardavtalsklausuler (SCC).</p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-10 mb-3">Lagringstid</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Lärarkonto: så länge kontot är aktivt + 12 månader.</li>
          <li>Leads (startguide): 24 månader.</li>
          <li>Bokföringsunderlag: 7 år enligt bokföringslagen.</li>
          <li>E-postsuppression och avregistreringar: tills vidare.</li>
        </ul>

        <h2 className="text-2xl font-bold text-emerald-950 mt-10 mb-3">Dina rättigheter</h2>
        <p className="mb-2">Du har rätt att:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>begära tillgång till dina uppgifter,</li>
          <li>begära rättelse eller radering,</li>
          <li>begära dataportabilitet,</li>
          <li>invända mot behandling som baseras på berättigat intresse,</li>
          <li>klaga till Integritetsskyddsmyndigheten (IMY).</li>
        </ul>
        <p className="mt-3">Kontakta oss på <a href="mailto:kontakt@scandinaviancoffee.se" className="text-emerald-900 underline">kontakt@scandinaviancoffee.se</a> så hanterar vi din begäran.</p>

        <h2 className="text-2xl font-bold text-emerald-950 mt-10 mb-3">Cookies</h2>
        <p>Vi använder endast nödvändiga cookies för inloggning. Läs mer på <Link to="/cookies" className="text-emerald-900 underline">cookiesidan</Link>.</p>
      </main>
    </div>
  );
}