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
              Premium kaffe och matkassar för klassinsamlingar. Auktoriserad svensk återförsäljare av Caffè Gondoliere.
            </p>
          </div>
          <div>
            <div className="font-semibold text-amber-50 mb-4 text-sm">Produkter</div>
            <ul className="space-y-2 text-sm">
              <li>Gold 500g</li>
              <li>Crema 1 kg bönor</li>
              <li>
                <a href="/hellofresh" className="hover:text-amber-300 transition">HelloFresh matkassar</a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-amber-50 mb-4 text-sm">Information</div>
            <ul className="space-y-2 text-sm">
              <li><a href="/#sa-funkar" className="hover:text-amber-300 transition">Så funkar det</a></li>
              <li><a href="/#aterkop" className="hover:text-amber-300 transition">Återköpsklubben</a></li>
              <li><a href="/#faq" className="hover:text-amber-300 transition">Vanliga frågor</a></li>
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
          <div className="flex gap-6">
            <a href="/villkor" className="hover:text-amber-300 transition">Allmänna villkor</a>
            <a href="/integritetspolicy" className="hover:text-amber-300 transition">Integritetspolicy</a>
            <a href="/cookies" className="hover:text-amber-300 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
