import { requireRole } from "@/lib/rbac/roles";
import { getMentorStudentDetail } from "@/lib/services/mentor";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, Activity, BookOpen, CheckCircle, ChevronRight, MessageSquareText } from "lucide-react";

// Helper function to safely extract the chapter name for reviews. 
const extractChapterName = (submission: any, type: "project" | "reflection") => {
  if (!submission) return "Unknown";
  
  const sub = Array.isArray(submission) ? submission[0] : submission;
  if (!sub) return "Unknown";

  const relation = type === "project" ? sub.projects : sub.reflections;
  const rel = Array.isArray(relation) ? relation[0] : relation;
  
  const chapters = rel?.chapters;
  const chapter = Array.isArray(chapters) ? chapters[0] : chapters;

  return chapter?.name || (type === "project" ? "Project" : "Reflection");
};

// Helper function to safely extract the name property from relations that might be arrays
const getName = (item: any, fallback = "Unknown") => {
  if (!item) return fallback;
  const target = Array.isArray(item) ? item[0] : item;
  return target?.name || fallback;
};

export default async function MentorStudentDetail({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const user = await requireRole(["MENTOR"]);
  
  // This call inherently checks assignment and team isolation
  const data = await getMentorStudentDetail(user.id, studentId, user.team_id);
  const { student, skillProfiles, recentScores, mentorReviews } = data;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-emerald-200 pb-4">
        <Link href="/mentor/dashboard" className="p-2 hover:bg-emerald-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-emerald-700" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">Student Profile</h1>
          <p className="text-emerald-700 mt-1">{student.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <BrainCircuit className="w-5 h-5 text-indigo-500" />
              Skill Progression Profile
            </h2>
            <div className="grid gap-4">
              {skillProfiles.map((skill) => (
                <div key={skill.id} className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{skill.name}</h3>
                    <p className="text-xs text-slate-500 max-w-md">{skill.description}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-500">Score</span>
                      <span className="text-xl font-bold text-indigo-700">{skill.cumulative}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-500">Trend</span>
                      <span className={`text-sm font-medium ${skill.trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {skill.trend > 0 ? '+' : ''}{skill.trend}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Your Previous Feedback
            </h2>
            {!mentorReviews || mentorReviews.length === 0 ? (
              <div className="bg-slate-50 rounded-xl p-6 text-center text-slate-500 border border-slate-200">
                You haven't evaluated this student's work yet.
              </div>
            ) : (
              <div className="space-y-4">
                {mentorReviews.map((review) => {
                  const isProject = !!review.project_submissions;
                  // Use the helper to safely retrieve the context name
                  const contextName = extractChapterName(
                    isProject ? review.project_submissions : review.reflection_submissions,
                    isProject ? "project" : "reflection"
                  );

                  return (
                    <div key={review.id} className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            review.status_decision === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {review.status_decision}
                          </span>
                          <span className="text-sm font-medium text-slate-700">{contextName}</span>
                        </div>
                        <span className="text-xs text-slate-400">{new Date(review.reviewed_at).toLocaleDateString()}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded text-sm text-slate-700 italic border-l-2 border-indigo-200">
                        "{review.feedback_text}"
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-xl border p-5 shadow-sm sticky top-6">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4 border-b pb-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Recent Score Deltas
            </h3>
            {!recentScores || recentScores.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No evaluated chapters yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentScores.map((score, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <div className="truncate pr-2">
                      {/* Used getName helper here for both skills and chapters */}
                      <span className="font-medium text-slate-700">{getName(score.skills, "Skill")}</span>
                      <p className="text-xs text-slate-400 truncate">{getName(score.chapters, "Chapter")}</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 font-medium px-2 py-1 rounded">
                      +{score.normalized_score}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
