import { requireRole } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { Brain } from "lucide-react";

export default async function AdminSkillsPage() {
  await requireRole(["ADMIN"]);
  const supabase = await createAdminClient();

  const { data: skills } = await supabase.from("skills").select("*").order("name");

  const SKILL_COLORS: Record<string, string> = {
    "Understanding": "bg-blue-50 text-blue-700 border-blue-200",
    "Thinking": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Practical": "bg-amber-50 text-amber-700 border-amber-200",
    "Communication": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Creativity": "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Brain className="w-10 h-10 text-indigo-600" />
          Skill Configuration
        </h1>
        <p className="text-lg text-slate-500 mt-2">
          The 5 core skill dimensions used by the evaluation engine.
        </p>
      </header>

      {(!skills || skills.length === 0) ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
          <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No skills configured</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Run the skill engine migration to seed the 5 core skill definitions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill: any) => {
            const colors = SKILL_COLORS[skill.name] || "bg-slate-50 text-slate-700 border-slate-200";
            return (
              <div key={skill.id} className={`border rounded-2xl p-6 shadow-sm ${colors}`}>
                <h3 className="text-xl font-extrabold mb-2">{skill.name}</h3>
                <p className="text-sm opacity-80">{skill.description || "No description"}</p>
                <div className="mt-4 flex items-center gap-4 text-xs opacity-60">
                  <span>ID: <code className="font-mono">{skill.id.slice(0, 8)}</code></span>
                  <span>Weight: <strong>{skill.weight || 1}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
        <h3 className="font-bold text-indigo-800 mb-2">About Skills</h3>
        <p className="text-sm text-indigo-700">
          Skills are the foundational evaluation dimensions. Mentor rubric scores map to these skills via the evaluation engine.
          Modifying skill definitions affects all future evaluations.
        </p>
      </div>
    </div>
  );
}
