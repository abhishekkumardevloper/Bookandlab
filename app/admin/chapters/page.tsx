import { requireRole } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { ChapterManagementClient } from "@/components/admin/ChapterManagementClient";
import { FileText } from "lucide-react";

export default async function AdminChaptersPage() {
  await requireRole(["ADMIN"]);
  const supabase = await createAdminClient();
  
  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, name, description, estimated_time, status, sequence_order, subjects(name, class_level)")
    .order("sequence_order");

  const { data: subjects } = await supabase.from("subjects").select("id, name, class_level").order("class_level");
  const { data: units } = await supabase.from("units").select("id, name").order("sequence_order");

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <FileText className="w-10 h-10 text-indigo-600" />
          Chapter Management
        </h1>
        <p className="text-lg text-slate-500 mt-2">Create, publish, and manage chapters.</p>
      </header>

      <ChapterManagementClient initialChapters={chapters || []} subjects={subjects || []} units={units || []} />
    </div>
  );
}
