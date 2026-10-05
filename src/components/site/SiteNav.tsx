import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LogIn, Coffee, Salad } from "lucide-react";
import { usePricing } from "@/hooks/usePricing";
import coffeeCrema from "@/assets/coffee-crema.png";
import hfBox from "@/assets/hellofresh/hellofresh-box.webp";

const LINKS = [
  { href: "/#sa-funkar", label: "Så funkar det" },
  { href: "/#kalkylator", label: "Räkna ut" },
  { href: "/#faq", label: "Frågor" },
];

function NewBadge() {
  return (
    <span className="bg-hf-lime text-brand-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
      Ny
    </span>
  );
}

export function HelloFreshBadgeLink({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/hellofresh" onClick={onClick} className="inline-flex items-center gap-1.5 hover:text-amber-700 transition">
      HelloFresh
      <NewBadge />
    </Link>
  );
}

export default function SiteNav({ onRegister }: { onRegister?: () => void }) {
  const [scrolled, setScrolled] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const pricing = usePricing();
  const onKaffe = pathname === "/kaffe";
  const onHf = pathname === "/hellofresh";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const close = () => setMobileOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled > 50 ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
        <Link to="/" aria-label="Qlasskassan – startsida" className="flex items-center shrink-0">
          <Logo size="sm" variant="dark" />
        </Link>
        <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-brand-950">
          <Link
            to="/kaffe"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition hover:text-amber-700 ${onKaffe ? "bg-amber-100 text-amber-900" : ""}`}
          >
            <Coffee className="w-4 h-4" aria-hidden="true" /> Kaffe
          </Link>
          <Link
            to="/hellofresh"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition hover:text-brand-700 ${onHf ? "bg-hf-soft" : ""}`}
          >
            <Salad className="w-4 h-4" aria-hidden="true" /> HelloFresh <NewBadge />
          </Link>
          <span className="w-px h-5 bg-stone-300" aria-hidden="true" />
          {LINKS.map((l) => (
            <Link key={l.href} to={l.href} className="hover:text-amber-700 transition">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/logga-in"
            aria-label="Logga in"
            className="hidden sm:inline-flex items-center gap-1.5 text-brand-950 hover:text-amber-700 transition text-sm font-medium px-3 py-2"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            Logga in
          </Link>
          {onRegister && (
            <button
              onClick={onRegister}
              aria-label="Starta försäljning"
              className="hidden sm:inline-flex bg-brand-900 text-amber-50 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-800 transition shadow-sm"
            >
              Starta försäljning
            </button>
          )}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Öppna meny"
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-900 text-amber-50"
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-stone-50 border-l border-stone-200 p-6 w-[85vw] max-w-sm overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <Logo size="sm" variant="dark" />
                <button
                  aria-label="Stäng meny"
                  onClick={close}
                  className="w-9 h-9 rounded-full hover:bg-stone-200 inline-flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-brand-950" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Link
                  to="/kaffe"
                  onClick={close}
                  className={`rounded-2xl p-3 bg-gradient-to-br from-amber-100 to-amber-50 border ${onKaffe ? "border-amber-500" : "border-amber-200"} flex flex-col`}
                >
                  <img src={coffeeCrema} alt="" className="h-16 w-auto object-contain self-center mb-2" />
                  <span className="font-bold text-brand-950 inline-flex items-center gap-1"><Coffee className="w-4 h-4" aria-hidden="true" /> Kaffe</span>
                  <span className="text-xs text-amber-900">Upp till {pricing.margin_crema} kr/förp</span>
                </Link>
                <Link
                  to="/hellofresh"
                  onClick={close}
                  className={`rounded-2xl p-3 bg-hf-soft border ${onHf ? "border-brand-700" : "border-hf-lime/60"} flex flex-col`}
                >
                  <img src={hfBox} alt="" className="h-16 w-auto object-contain self-center mb-2 rounded-lg" />
                  <span className="font-bold text-brand-950 inline-flex flex-wrap items-center gap-1">HelloFresh <NewBadge /></span>
                  <span className="text-xs text-brand-900">{pricing.margin_hellofresh} kr/kund</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-1">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={close}
                    className="px-4 py-3 rounded-xl text-brand-950 font-medium hover:bg-amber-100 transition"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              {onRegister && (
                <button
                  onClick={() => {
                    close();
                    onRegister();
                  }}
                  className="mt-6 w-full bg-brand-900 text-amber-50 px-5 py-3 rounded-full text-sm font-semibold hover:bg-brand-800 transition"
                >
                  Starta försäljning
                </button>
              )}
              <Link
                to="/logga-in"
                onClick={close}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 border-2 border-brand-900 text-brand-900 px-5 py-3 rounded-full text-sm font-semibold hover:bg-brand-900 hover:text-amber-50 transition"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Logga in
              </Link>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
