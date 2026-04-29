import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { JSX } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AuthProvider, useAuth } from "@/lib/AuthContext";

const queryClient = new QueryClient();

function RequireAuth({
  children,
  requiredRole,
}: {
  children: JSX.Element;
  requiredRole?: "admin" | "teacher";
}) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="p-8">Laddar...</div>;
  if (!user) return <Navigate to="/logga-in" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

const LoginPage = () => <div className="p-8">Inloggning (byggs i 4B)</div>;
const ResetPasswordPage = () => <div className="p-8">Återställ lösenord (byggs i 4B)</div>;
const TeacherDashboard = () => <div className="p-8">Lärar-dashboard (byggs i 4B)</div>;
const AdminDashboard = () => <div className="p-8">Admin-dashboard (byggs i 4B)</div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/logga-in" element={<LoginPage />} />
            <Route path="/aterstall-losenord" element={<ResetPasswordPage />} />
            <Route
              path="/dashboard/*"
              element={
                <RequireAuth requiredRole="teacher">
                  <TeacherDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/*"
              element={
                <RequireAuth requiredRole="admin">
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
