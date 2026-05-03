import { useState } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  LayoutDashboard,
  GraduationCap,
  Inbox,
  ShoppingBag,
  Sparkles,
  Users,
  Settings,
  Tag,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import AdminOverview from "@/components/admin/AdminOverview";
import AdminClasses from "@/components/admin/AdminClasses";
import AdminClassDetail from "@/components/admin/AdminClassDetail";
import AdminLeads from "@/components/admin/AdminLeads";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminRepurchases from "@/components/admin/AdminRepurchases";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminPricing from "@/components/admin/AdminPricing";

const navItems = [
  { to: "/admin", label: "Översikt", icon: LayoutDashboard, exact: true },
  { to: "/admin/klasser", label: "Klasser", icon: GraduationCap },
  { to: "/admin/leads", label: "Leads", icon: Inbox },
  { to: "/admin/ordrar", label: "Ordrar", icon: ShoppingBag },
  { to: "/admin/aterkop", label: "Återköp", icon: Sparkles },
  { to: "/admin/anvandare", label: "Användare", icon: Users },
  { to: "/admin/priser", label: "Priser", icon: Tag },
  { to: "/admin/installningar", label: "Inställningar", icon: Settings },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    toast.success("Utloggad");
  }

  return (
    <div className="min-h-screen bg-stone-50 flex w-full">
      <aside className="hidden md:flex w-64 bg-emerald-950 text-white flex-col border-r border-emerald-900">
        <div className="p-6 border-b border-emerald-900">
          <Link to="/admin" className="flex items-center gap-3">
            <Logo size="sm" variant="light" />
            <div>
              <p className="font-bold text-lg leading-tight">Qlasskassan</p>
              <p className="text-xs text-emerald-300 uppercase tracking-wide">Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-800 text-white"
                    : "text-emerald-200 hover:bg-emerald-900 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-emerald-900">
          <div className="text-xs text-emerald-300 mb-2 truncate">{user?.email}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-emerald-200 hover:text-white hover:bg-emerald-900"
          >
            <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
            Logga ut
          </Button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 bg-emerald-950 text-white z-40 px-4 py-3 flex items-center justify-between border-b border-emerald-900">
        <Link to="/admin" className="flex items-center gap-2">
          <Logo size="sm" variant="light" />
          <span className="font-bold">Admin</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-emerald-100 hover:bg-emerald-900"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute top-0 left-0 bottom-0 w-72 bg-emerald-950 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-1 mt-12">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-emerald-200 hover:bg-emerald-900 hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-emerald-200 hover:bg-emerald-900 hover:text-white"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logga ut
              </button>
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1 mt-14 md:mt-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="klasser" element={<AdminClasses />} />
            <Route path="klasser/:id" element={<AdminClassDetail />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="ordrar" element={<AdminOrders />} />
            <Route path="aterkop" element={<AdminRepurchases />} />
            <Route path="anvandare" element={<AdminUsers />} />
            <Route path="priser" element={<AdminPricing />} />
            <Route path="installningar" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}