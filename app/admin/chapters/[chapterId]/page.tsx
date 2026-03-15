import { requireRole } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default async function ChapterContentEditorPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  await requireRole(["ADMIN"]);
  const supabase = await createAdminClient();

  const { data: chapter } = await supabase
    .from("chapters")
    .select("id, name, description, why_it_matters, estimated_time, status, subjects(name)")
    .eq("id", chapterId)
    .single();

  const { data: steps } = await supabase
    .from("chapter_steps")
    .select("id, step_number, type, content_reference")
    .eq("chapter_id", chapterId)
    .order("step_number");

  if (!chapter) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Chapter not found</h1>
        <Link href="/admin/chapters" className="text-indigo-600 mt-4 inline-block">Back to Chapters</Link>
      </div>
    );
  }

  const STEP_LABELS: Record<number, string> = {
    1: "Theory / Concept",
    2: "Guided Practice",
    3: "Interactive Exercise",
    4: "Project",
    5: "Reflection",
    6: "Assessment",
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <Link href="/admin/chapters" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-indigo-600" />
            {chapter.name}
          </h1>
          <p className="text-slate-500 mt-1">{(chapter as any).subjects?.name} · {chapter.estimated_time}min · <span className={chapter.status === "ACTIVE" ? "text-emerald-600 font-bold" : "text-slate-400 font-bold"}>{chapter.status}</span></p>
        </div>
      </div>

      {/* Chapter Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Chapter Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Description</p>
            <p className="text-slate-700 text-sm">{chapter.description || "No description"}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Why It Matters</p>
            <p className="text-slate-700 text-sm">{chapter.why_it_matters || "Not set"}</p>
          </div>
        </div>
      </div>

      {/* Steps Editor */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Chapter Steps ({steps?.length || 0}/6)</h2>
        
        {(!steps || steps.length === 0) ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <p className="text-amber-700 font-semibold">No steps defined yet.</p>
            <p className="text-amber-600 text-sm mt-1">Steps are auto-created when chapter content is seeded. Use the Supabase dashboard to populate `chapter_steps`.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step: any) => (
              <div key={step.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-700 font-extrabold shrink-0">
                    {step.step_number}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{STEP_LABELS[step.step_number] || `Step ${step.step_number}`}</h3>
                    <p className="text-xs text-slate-500">Type: <span className="font-semibold">{step.type}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Content Ref</p>
                  <p className="text-sm font-mono text-slate-600 truncate max-w-xs">{step.content_reference || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
