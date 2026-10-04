import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function SiteFooter() {
  return (
    <footer className="py-12 px-6 bg-emerald-950 text-amber-100/70">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Logo size="md" variant="light" showTagline />
            </div>
            <p className="text-sm leading-relaxed">
              Premiumkaffe från Caffè Gondoliere och HelloFresh matkassar för klassinsamlingar — ett konto, en klasskod. Auktoriserad svensk återförsäljare av Caffè Gondoliere.
            </p>
          </div>
          <div>
            <div className="font-semibold text-amber-50 mb-4 text-sm">Produkter</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/kaffe" className="hover:text-amber-300 transition">Kaffe – Gold &amp; Crema</Link></li>
              <li><Link to="/hellofresh" className="hover:text-amber-300 transition">HelloFresh matkassar</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-amber-50 mb-4 text-sm">Information</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#sa-funkar" className="hover:text-amber-300 transition">Så funkar det</Link></li>
              <li><Link to="/kaffe#aterkop" className="hover:text-amber-300 transition">Återköpsklubben</Link></li>
              <li><Link to="/#faq" className="hover:text-amber-300 transition">Vanliga frågor</Link></li>
              <li><Link to="/logga-in" className="hover:text-amber-300 transition">Logga in</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-amber-50 mb-4 text-sm">Kontakt</div>
            <ul className="space-y-2 text-sm">
              <li>kontakt@scandinaviancoffee.se</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-emerald-800 text-xs flex flex-wrap justify-between gap-4">
          <div>© 2026 Qlasskassan · Drivs av Scandinavian Coffee AB</div>
          <div className="flex flex-wrap gap-6">
            <Link to="/villkor" className="hover:text-amber-300 transition">Allmänna villkor</Link>
            <Link to="/integritetspolicy" className="hover:text-amber-300 transition">Integritetspolicy</Link>
            <Link to="/cookies" className="hover:text-amber-300 transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
