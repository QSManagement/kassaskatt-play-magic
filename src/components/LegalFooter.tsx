import { Link } from "react-router-dom";

export function LegalFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 py-6 px-6 text-xs text-stone-600">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} Qlasskassan</div>
        <nav className="flex flex-wrap gap-5">
          <Link to="/integritetspolicy" className="hover:text-emerald-900 hover:underline">Integritetspolicy</Link>
          <Link to="/villkor" className="hover:text-emerald-900 hover:underline">Villkor</Link>
          <Link to="/cookies" className="hover:text-emerald-900 hover:underline">Cookies</Link>
        </nav>
      </div>
    </footer>
  );
}