import { requireRole } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { UnitManagementClient } from "@/components/admin/UnitManagementClient";
import { FolderTree } from "lucide-react";

export default async function AdminUnitsPage() {
  // Protect the route - requires ADMIN role
  await requireRole(["ADMIN"]);
  
  const supabase = await createAdminClient();
  
  // Fetch units and their associated subject names
  const { data: units } = await supabase
    .from("units")
    .select("id, name, subject_id, sequence_order, subjects(name)")
    .order("sequence_order");

  // Fetch subjects
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, class_level")
    .order("class_level");

  // Format the units data to satisfy TypeScript
  // Supabase joins sometimes return arrays for 1-to-1 relationships in their types.
  // This ensures 'subjects' is a single object, exactly as the component expects.
  const formattedUnits = (units || []).map((unit: any) => ({
    ...unit,
    subjects: Array.isArray(unit.subjects) ? unit.subjects[0] : unit.subjects,
  }));

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <FolderTree className="w-10 h-10 text-indigo-600" />
          Unit Management
        </h1>
        <p className="text-lg text-slate-500 mt-2">Organize units within subjects.</p>
      </header>

      {/* Pass the formatted data to the client component */}
      <UnitManagementClient initialUnits={formattedUnits} subjects={subjects || []} />
    </div>
  );
}
