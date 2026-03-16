import { getDbUser } from "@/lib/auth/user";

export type Role = "STUDENT" | "MENTOR" | "ADMIN";

type AuthenticatedUser = Awaited<ReturnType<typeof getDbUser>>;
type UserWithRole = NonNullable<AuthenticatedUser> & { role: Role };
type RoleJoin = { name: Role } | { name: Role }[];

function resolveRoleFromJoin(roleJoin: RoleJoin | null | undefined): Role | null {
  if (!roleJoin) return null;
  const roleName = Array.isArray(roleJoin) ? roleJoin[0]?.name : roleJoin.name;
  return roleName ?? null;
}

export async function requireAuth() {
  const user = await getDbUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function getActiveRole(user: NonNullable<AuthenticatedUser>): Promise<Role | null> {
  const { createAdminClient } = await import("@/lib/db/supabase");
  const supabase = await createAdminClient();

  const { data: roleData, error } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", user.id)
    .eq("team_id", user.team_id)
    .single();

  if (error || !roleData) {
    return null;
  }

  return resolveRoleFromJoin(roleData.roles as RoleJoin | undefined);
}

export async function requireRole(allowedRoles: Role[]): Promise<UserWithRole> {
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
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .single();

  if (!sub || sub.status !== "ACTIVE" || new Date(sub.current_period_end) < new Date()) {
    throw new Error("PAYMENT_REQUIRED: Active subscription is required.");
  }

  return { user, subscription: sub };
}

export function createProtectedAction<T, TPayload = FormData>(
  allowedRoles: Role[],
  action: (user: UserWithRole, payload: TPayload) => Promise<T>
) {
  return async (payload: TPayload): Promise<T> => {
    const user = await requireRole(allowedRoles);
    return action(user, payload);
  };
}
