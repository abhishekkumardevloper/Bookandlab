import { getDbUser } from "@/lib/auth/user";
import { getUserNotifications, getUnreadCount } from "@/lib/services/notifications";
import { NotificationClient } from "@/components/shared/NotificationClient";
import { Bell } from "lucide-react";
import { redirect } from "next/navigation";

export default async function StudentNotificationsPage() {
  const user = await getDbUser();
  if (!user) redirect("/handler/sign-in");

  const notifications = await getUserNotifications(user.id, user.team_id);
  const unreadCount = await getUnreadCount(user.id, user.team_id);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Bell className="w-10 h-10 text-indigo-600" />
          Notifications
        </h1>
      </header>
      <NotificationClient userId={user.id} teamId={user.team_id} initialNotifications={notifications} initialUnreadCount={unreadCount} />
    </div>
  );
}
