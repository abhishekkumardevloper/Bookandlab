import { requireRole } from "@/lib/rbac/roles";
import { getAdminUsersList } from "@/lib/services/admin";
import { UserManagementClient } from "@/components/admin/UserManagementClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminUsersPage() {
  const user = await requireRole(["ADMIN"]);
  const users = await getAdminUsersList(user.team_id);
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-indigo-200 pb-4">
        <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">Manage institutional access within {user.team_id}</p>
        </div>
      </div>

      <UserManagementClient currentUserId={user.id} initialUsers={users} />
    </div>
  );
}
