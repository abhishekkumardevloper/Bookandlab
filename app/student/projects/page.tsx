import { getDbUser } from "@/lib/auth/user";
import { createAdminClient } from "@/lib/db/supabase";
import { FolderGit2, Calendar, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentProjectsPage() {
  const user = await getDbUser();
  if (!user) redirect("/handler/sign-in");

  const supabase = await createAdminClient();

  // Fetch all project submissions for this user, including project details
  const { data: submissions, error } = await supabase
    .from("project_submissions")
    .select(`
      id,
      status,
      content_text,
      media_urls,
      updated_at,
      project:projects (
        id,
        type,
        instructions,
        chapter:chapters (
          id,
          name,
          subject:subjects (
            id,
            name
          )
        )
      )
    `)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to load projects:", error);
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <FolderGit2 className="w-10 h-10 text-indigo-600" />
            My Projects
          </h1>
          <p className="text-lg text-slate-500 mt-2">
            Track your submissions, reviews, and mentor feedback.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions && submissions.length > 0 ? (
          submissions.map((sub: any) => {
            const subjectName = Array.isArray(sub.project?.chapter?.subject) 
              ? sub.project.chapter.subject[0]?.name 
              : sub.project?.chapter?.subject?.name;

            return (
              <div key={sub.id} className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm flex flex-col h-full relative overflow-hidden group hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1 block">
                      {subjectName || "Unknown Subject"}
                    </span>
                    <h3 className="font-extrabold text-lg text-slate-900 leading-snug">
                      {sub.project?.chapter?.name || "Unknown Chapter"}
                    </h3>
                  </div>
                  <div className="shrink-0 ml-4">
                    {sub.status === 'APPROVED' && <div className="text-emerald-500 bg-emerald-50 p-2 rounded-full"><CheckCircle className="w-5 h-5"/></div>}
                    {sub.status === 'PENDING' && <div className="text-amber-500 bg-amber-50 p-2 rounded-full"><Clock className="w-5 h-5"/></div>}
                    {sub.status === 'NEEDS_REVISION' && <div className="text-red-500 bg-red-50 p-2 rounded-full"><AlertTriangle className="w-5 h-5"/></div>}
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <p className="text-sm text-slate-600 line-clamp-3 mb-3">
                    <span className="font-semibold text-slate-700">Project Type:</span> {sub.project?.type}
                  </p>
                  <p className="text-sm text-slate-500 line-clamp-2 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{sub.content_text}"
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(sub.updated_at).toLocaleDateString()}
                  </div>
                  <Link 
                    href={`/student/chapters/${sub.project?.chapter?.id}`} 
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                  >
                    View Project <FileText className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center bg-slate-50 border border-slate-200 rounded-[2rem]">
            <FolderGit2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No projects yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              You haven't submitted any projects yet. Keep advancing through your chapters to reach project milestones!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
