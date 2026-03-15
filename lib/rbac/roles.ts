import { getDbUser } from "@/lib/auth/user";

// Recreate the Role type that Prisma previously generated
export type Role = "STUDENT" | "MENTOR" | "ADMIN";

export async function requireAuth() {
  const user = await getDbUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function getActiveRole(user: any): Promise<Role | null> {
  const { createAdminClient } = await import("@/lib/db/supabase");
  const supabase = await createAdminClient();
  
  const { data: roleData, error } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .eq('team_id', user.team_id)
    .single();
    
  if (error || !roleData || !roleData.roles) {
    return null;
  }
  
  // @ts-ignore
  return (Array.isArray(roleData.roles) ? roleData.roles[0].name : roleData.roles.name) as Role;
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth();
  const activeRoleName = await getActiveRole(user);
    
  if (!activeRoleName) {
    console.error("Role resolution failed for user:", user.id);
    throw new Error("FORBIDDEN: No active role mapping for this team context.");
  }
  
  if (!allowedRoles.includes(activeRoleName)) {
    throw new Error("FORBIDDEN: Insufficient permissions for " + activeRoleName);
  }
  
  return { ...user, role: activeRoleName };
}

export async function requireActiveSubscription() {
  const user = await requireRole(["STUDENT"]);
  
  const { createAdminClient } = await import("@/lib/db/supabase");
  const supabase = await createAdminClient();
  
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .single();
    
  // If no subscription record, or status is not active, or period is past
  if (!sub || sub.status !== 'ACTIVE' || new Date(sub.current_period_end) < new Date()) {
    throw new Error("PAYMENT_REQUIRED: Active subscription is required.");
  }
  
  return { user, subscription: sub };
}

/**
 * Server action wrapper utility to cleanly handle auth and role requirements
 * It ensures the action only executes if the user meets validation criteria.
 */
export function createProtectedAction<T>(
  allowedRoles: Role[],
  action: (user: any, formData: FormData) => Promise<T>
) {
  return async (formData: FormData): Promise<T> => {
    const user = await requireRole(allowedRoles);
    return action(user, formData);
  };
}
