import { requireRole } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { GraduationCap } from "lucide-react";

export default async function AdminClassesPage() {
  await requireRole(["ADMIN"]);
  const supabase = await createAdminClient();
  
  const { data: subjects } = await supabase
    .from("subjects")
    .select("class_level")
    .order("class_level");
  
  const classMap = new Map<string, number>();
  (subjects || []).forEach((s: any) => {
    classMap.set(s.class_level, (classMap.get(s.class_level) || 0) + 1);
  });

  const CLASS_LEVELS = ["6", "7", "8", "9", "10"];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <GraduationCap className="w-10 h-10 text-indigo-600" />
          Class Management
        </h1>
        <p className="text-lg text-slate-500 mt-2">Manage class levels for the institution.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLASS_LEVELS.map((level) => (
          <div key={level} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                  <span className="text-xl font-extrabold text-indigo-600">{level}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Class {level}</h3>
                  <p className="text-sm text-slate-500">{classMap.get(level) || 0} subjects</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
        <h3 className="font-bold text-indigo-800 mb-2">About Class Levels</h3>
        <p className="text-sm text-indigo-700">
          Class levels (6-10) are the top-level organizational unit. Subjects are created within each class level. 
          To add subjects, go to <strong>Subject Management</strong>.
        </p>
      </div>
    </div>
  );
}
