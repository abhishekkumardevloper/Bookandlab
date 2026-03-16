// lib/rbac/roles.ts
import { cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

/**
 * requireRole - server helper for pages/layouts that must be accessed by certain roles
 * Usage: const user = await requireRole(['STUDENT']);
 */
export async function requireRole(allowedRoles: string[]) {
  const supabase = createServerComponentSupabaseClient({ cookies });
  const {
    data: { user: sbUser },
  } = await supabase.auth.getUser();

  // not logged in -> login
  if (!sbUser) redirect("/login");

  // fetch profile (assumes you have profiles table with `role` column)
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, role, team_id, full_name")
    .eq("id", sbUser.id)
    .maybeSingle();

  if (error || !profile) {
    // unable to fetch profile -> log out or redirect to login
    console.error("requireRole: profile fetch failed", error);
    redirect("/login");
  }

  // if user role not allowed -> redirect to their correct dashboard
  if (!allowedRoles.includes(profile.role)) {
    // example: map role to route
    if (profile.role === "ADMIN") {
      redirect("/admin/dashboard");
    } else if (profile.role === "TEACHER" || profile.role === "MENTOR") {
      redirect("/teacher/dashboard");
    } else {
      // fallback: forbidden
      redirect("/403");
    }
  }

  // allowed -> return profile
  return profile;
}
