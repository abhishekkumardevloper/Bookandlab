import { requireRole } from "@/lib/rbac/roles";
import { Ruler, Target, Brain, MessageSquare, Zap } from "lucide-react";

export default async function AdminRubricsPage() {
  await requireRole(["ADMIN"]);

  const RUBRIC_DIMENSIONS = [
    { name: "Concept Clarity", icon: Brain, description: "Measures depth of understanding of core concepts and principles.", scale: "1-5", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { name: "Critical Thinking", icon: Target, description: "Evaluates analytical reasoning, logical deduction, and problem-solving approach.", scale: "1-5", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { name: "Application", icon: Zap, description: "Assesses the ability to apply learned concepts to real-world scenarios.", scale: "1-5", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { name: "Communication", icon: MessageSquare, description: "Evaluates clarity of expression, structured argumentation, and presentation.", scale: "1-5", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Ruler className="w-10 h-10 text-indigo-600" />
          Rubric Setup
        </h1>
        <p className="text-lg text-slate-500 mt-2">
          Evaluation rubric dimensions used by mentors during project and reflection reviews.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {RUBRIC_DIMENSIONS.map((dim) => (
          <div key={dim.name} className={`border rounded-2xl p-6 shadow-sm ${dim.color}`}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white/50 shrink-0">
                <dim.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold">{dim.name}</h3>
                <p className="text-sm opacity-80 mt-1">{dim.description}</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs font-bold bg-white/40 px-2 py-1 rounded-full">Scale: {dim.scale}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Scoring Guide</h3>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Score</th>
                <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Level</th>
                <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="p-3 font-bold text-slate-800">5</td><td className="p-3 text-emerald-600 font-bold">Exceptional</td><td className="p-3 text-slate-600">Demonstrates mastery beyond expectations</td></tr>
              <tr><td className="p-3 font-bold text-slate-800">4</td><td className="p-3 text-blue-600 font-bold">Proficient</td><td className="p-3 text-slate-600">Strong understanding with minor gaps</td></tr>
              <tr><td className="p-3 font-bold text-slate-800">3</td><td className="p-3 text-amber-600 font-bold">Developing</td><td className="p-3 text-slate-600">Basic understanding, needs more practice</td></tr>
              <tr><td className="p-3 font-bold text-slate-800">2</td><td className="p-3 text-orange-600 font-bold">Beginning</td><td className="p-3 text-slate-600">Fundamental gaps in understanding</td></tr>
              <tr><td className="p-3 font-bold text-slate-800">1</td><td className="p-3 text-rose-600 font-bold">Insufficient</td><td className="p-3 text-slate-600">Insufficient evidence of learning</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
