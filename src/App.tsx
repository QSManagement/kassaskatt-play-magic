import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { JSX } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import PendingApproval from "./pages/PendingApproval.tsx";
import TeacherDashboard from "./pages/TeacherDashboard.tsx";
import { AuthProvider, useAuth } from "@/lib/AuthContext";

const queryClient = new QueryClient();

function ProtectedTeacher({ children }: { children: JSX.Element }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-600">Laddar...</div>;
  if (!user) return <Navigate to="/logga-in" replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role !== "teacher") return <Navigate to="/vantar" replace />;
  return children;
}

function ProtectedAdmin({ children }: { children: JSX.Element }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-600">Laddar...</div>;
  if (!user) return <Navigate to="/logga-in" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;
  return children;
}

const AdminDashboard = () => <div className="p-8">Admin-dashboard (byggs i 4B-2)</div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/logga-in" element={<Login />} />
            <Route path="/aterstall-losenord" element={<ResetPassword />} />
            <Route path="/vantar" element={<PendingApproval />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedTeacher>
                  <TeacherDashboard />
                </ProtectedTeacher>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedAdmin>
                  <AdminDashboard />
                </ProtectedAdmin>
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
