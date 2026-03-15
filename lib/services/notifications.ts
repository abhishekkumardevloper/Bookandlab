import { createAdminClient } from "@/lib/db/supabase";

export type NotificationType =
  | "REVIEW_COMPLETED"
  | "PROJECT_SUBMITTED"
  | "MENTOR_ASSIGNED"
  | "CHAPTER_UNLOCKED"
  | "ADMIN_ANNOUNCEMENT"
  | "ROLE_CHANGED"
  | "SUBMISSION_STATUS";

export async function createNotification(
  userId: string,
  teamId: string,
  type: NotificationType,
  message: string,
  metadata: Record<string, any> = {}
) {
  const supabase = await createAdminClient();
  await supabase.from("notifications").insert({
    user_id: userId,
    team_id: teamId,
    type,
    message,
    metadata,
  });
}

export async function getUserNotifications(userId: string, teamId: string, limit = 30) {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("team_id", teamId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getUnreadCount(userId: string, teamId: string): Promise<number> {
  const supabase = await createAdminClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .eq("team_id", teamId)
    .eq("is_read", false);
  return count || 0;
}

export async function markNotificationRead(notificationId: string, userId: string) {
  const supabase = await createAdminClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);
}

export async function markAllRead(userId: string, teamId: string) {
  const supabase = await createAdminClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("team_id", teamId)
    .eq("is_read", false);
}
