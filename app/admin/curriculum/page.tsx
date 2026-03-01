import { requireRole } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { CurriculumManagementClient } from "@/components/admin/CurriculumManagementClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminCurriculumPage() {
  await requireRole(["ADMIN"]);
  
  // Notice we aren't enforcing `team_id` on SELECT here because curriculum definitions
  // are global across the institution for this architecture, but toggling the status 
  // will be an Admin-level privilege.
  const supabase = await createAdminClient();
  const { data: chapters } = await supabase
    .from("chapters")
    .select(`
      id, name, description, estimated_time, status,
      subjects(name)
    `)
    .order("status", { ascending: false }); // Show ACTIVE first, then DRAFT

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-rose-200 pb-4">
        <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Curriculum Structure</h1>
          <p className="text-slate-600 mt-1">Manage Chapter visibility (Draft vs Active) across the platform.</p>
        </div>
      </div>

      <CurriculumManagementClient initialChapters={chapters || []} />
    </div>
  );
}
