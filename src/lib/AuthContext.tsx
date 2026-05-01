import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { UserRole } from "./auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  classId: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  classId: null,
  loading: true,
});

async function loadRoleAndClass(
  userId: string
): Promise<{ role: UserRole; classId: string | null }> {
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role, class_id")
    .eq("user_id", userId);

  if (!roles || roles.length === 0) return { role: null, classId: null };

  if (roles.some((r) => r.role === "admin")) {
    return { role: "admin", classId: null };
  }
  const teacherRole = roles.find((r) => r.role === "teacher");
  if (teacherRole) {
    return { role: "teacher", classId: teacherRole.class_id ?? null };
  }
  return { role: null, classId: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [classId, setClassId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    // Set up listener FIRST to avoid missing events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        // Mark loading until role is resolved — prevents brief flash of
        // PendingApproval/wrong route while role is still null.
        setLoading(true);
        // Defer Supabase calls to avoid deadlocks inside the callback
        setTimeout(() => {
          loadRoleAndClass(newSession.user.id).then(({ role, classId }) => {
            if (!isMounted) return;
            setRole(role);
            setClassId(classId);
            setLoading(false);
          });
        }, 0);
      } else {
        setRole(null);
        setClassId(null);
        setLoading(false);
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      if (existingSession?.user) {
        loadRoleAndClass(existingSession.user.id).then(({ role, classId }) => {
          if (!isMounted) return;
          setRole(role);
          setClassId(classId);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, role, classId, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}