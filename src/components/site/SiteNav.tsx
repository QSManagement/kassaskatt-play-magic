import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LogIn } from "lucide-react";

const LINKS = [
  { href: "/#sa-funkar", label: "Så funkar det" },
  { href: "/#produkter", label: "Produkter" },
  { href: "/#kalkylator", label: "Räkna ut" },
  { href: "/#aterkop", label: "Återköpsklubben" },
  { href: "/#faq", label: "Frågor" },
];

export function HelloFreshBadgeLink({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/hellofresh"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 hover:text-amber-700 transition"
    >
      HelloFresh
      <span className="bg-hf-lime text-emerald-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
        Ny
      </span>
    </Link>
  );
}

export default function SiteNav({ onRegister }: { onRegister?: () => void }) {
  const [scrolled, setScrolled] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled > 50 ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 md:py-4 flex items-center justify-between gap-4">
        <a href="/" aria-label="Qlasskassan – startsida" className="relative -mb-8 md:-mb-10 flex items-center">
          <Logo size="sm" variant="dark" />
        </a>
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-emerald-950">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-amber-700 transition">
              {l.label}
            </a>
          ))}
          <HelloFreshBadgeLink />
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/logga-in"
            aria-label="Logga in"
            className="hidden sm:inline-flex items-center gap-1.5 text-emerald-950 hover:text-amber-700 transition text-sm font-medium px-3 py-2"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            Logga in
          </Link>
          {onRegister && (
            <button
              onClick={onRegister}
              aria-label="Starta försäljning"
              className="hidden sm:inline-flex bg-emerald-900 text-amber-50 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-800 transition shadow-sm"
            >
              Starta försäljning
            </button>
          )}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Öppna meny"
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-900 text-amber-50"
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-stone-50 border-l border-stone-200 p-6 w-[80vw] max-w-sm">
              <div className="flex items-center justify-between mb-8">
                <Logo size="sm" variant="dark" />
                <button
                  aria-label="Stäng meny"
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 rounded-full hover:bg-stone-200 inline-flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-emerald-950" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-emerald-950 font-medium hover:bg-amber-100 transition"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="px-4 py-3">
                  <HelloFreshBadgeLink onClick={() => setMobileOpen(false)} />
                </div>
              </nav>
              {onRegister && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onRegister();
                  }}
                  className="mt-8 w-full bg-emerald-900 text-amber-50 px-5 py-3 rounded-full text-sm font-semibold hover:bg-emerald-800 transition"
                >
                  Starta försäljning
                </button>
              )}
              <Link
                to="/logga-in"
                onClick={() => setMobileOpen(false)}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 border-2 border-emerald-900 text-emerald-900 px-5 py-3 rounded-full text-sm font-semibold hover:bg-emerald-900 hover:text-amber-50 transition"
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
