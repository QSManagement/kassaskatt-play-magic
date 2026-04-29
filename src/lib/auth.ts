import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "teacher" | null;

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/aterstall-losenord`,
  });
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserRole(): Promise<UserRole> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  if (!roles || roles.length === 0) return null;
  if (roles.some((r) => r.role === "admin")) return "admin";
  if (roles.some((r) => r.role === "teacher")) return "teacher";
  return null;
}

export async function getUserClassId(): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_roles")
    .select("class_id")
    .eq("user_id", user.id)
    .eq("role", "teacher")
    .maybeSingle();

  return data?.class_id ?? null;
}