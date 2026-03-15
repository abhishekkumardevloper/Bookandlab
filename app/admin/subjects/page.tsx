import { requireRole } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { SubjectManagementClient } from "@/components/admin/SubjectManagementClient";
import { BookOpen } from "lucide-react";

export default async function AdminSubjectsPage() {
  await requireRole(["ADMIN"]);
  const supabase = await createAdminClient();
  
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, class_level, description")
    .order("class_level")
    .order("name");

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-indigo-600" />
          Subject Management
        </h1>
        <p className="text-lg text-slate-500 mt-2">Create and manage subjects per class level.</p>
      </header>

      <SubjectManagementClient initialSubjects={subjects || []} />
    </div>
  );
}
