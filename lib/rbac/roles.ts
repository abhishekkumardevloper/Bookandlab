import { redirect } from "next/navigation";
import { stackServerApp } from "@/lib/auth/stack";
import { createAdminClient } from "@/lib/db/supabase";

export type Role = "STUDENT" | "MENTOR" | "ADMIN" | "TEACHER";

// Reusable function to get the current authenticated user and their DB profile
export async function getDbUser() {
  if (!stackServerApp) return null;
  
  const authUser = await stackServerApp.getUser();
  if (!authUser) return null;

  const supabase = await createAdminClient();
  
  // Fetch the user's profile which contains their role
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  return profile;
}

// Fetches the current user's role without enforcing a redirect
// (This fixes the Turbopack build error)
export async function getActiveRole(): Promise<Role | null> {
  const user = await getDbUser();
  if (!user || !user.role) {
    return null;
  }
  return user.role as Role;
}

// Protects routes that just need ANY logged-in user
export async function requireAuth() {
  const user = await getDbUser();
  if (!user) {
    redirect("/handler/sign-in");
  }
  return user;
}

// Protects routes that need specific roles
export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth();

  // THE BOUNCER LOGIC: If user's role is not in the allowed list, redirect them!
  if (!user.role || !allowedRoles.includes(user.role as Role)) {
    console.warn(`Access Denied: User has role ${user.role}, but route requires ${allowedRoles}`);
    
    // Send them to their appropriate dashboard based on their ACTUAL role
    if (user.role === "ADMIN") {
      redirect("/admin/units"); // Or your admin home
    } else if (user.role === "TEACHER" || user.role === "MENTOR") {
      redirect("/teacher/dashboard");
    } else {
      // Default fallback (Student)
      redirect("/dashboard"); 
    }
  }

  return { ...user, role: user.role as Role };
}

// Protects routes that require a paid subscription
export async function requireActiveSubscription() {
  const user = await requireRole(["STUDENT"]);

  const supabase = await createAdminClient();
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .single();

  if (!sub || sub.status !== "ACTIVE" || new Date(sub.current_period_end) < new Date()) {
    throw new Error("PAYMENT_REQUIRED: Active subscription is required.");
  }

  return { user, subscription: sub };
}

// Helper for Server Actions
export function createProtectedAction<T, TPayload = FormData>(
  allowedRoles: Role[],
  action: (user: any, payload: TPayload) => Promise<T>
) {
  return async (payload: TPayload): Promise<T> => {
    const user = await requireRole(allowedRoles);
    return action(user, payload);
  };
}
