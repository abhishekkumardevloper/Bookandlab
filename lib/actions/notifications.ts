"use server";

import { createProtectedAction } from "@/lib/rbac/roles";
import { markNotificationRead, markAllRead, getUserNotifications, getUnreadCount } from "@/lib/services/notifications";

export const markNotificationReadAction = createProtectedAction(
  ["STUDENT", "MENTOR", "ADMIN"],
  async (user, formData: FormData) => {
    const notificationId = formData.get("notificationId") as string;
    if (!notificationId) throw new Error("Notification ID required.");
    await markNotificationRead(notificationId, user.id);
    return { success: true };
  }
);

export const markAllNotificationsReadAction = createProtectedAction(
  ["STUDENT", "MENTOR", "ADMIN"],
  async (user) => {
    await markAllRead(user.id, user.team_id);
    return { success: true };
  }
);

export async function fetchNotificationsAction(userId: string, teamId: string) {
  const notifications = await getUserNotifications(userId, teamId);
  const unreadCount = await getUnreadCount(userId, teamId);
  return { notifications, unreadCount };
}
