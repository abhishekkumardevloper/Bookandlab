import { requireRole } from "@/lib/rbac/roles";
import { getMentorDashboardData } from "@/lib/services/mentor";
import Link from "next/link";
import { Clock, MessageSquare, UserCircle, CheckCircle, BarChart3, ArrowRight, FolderGit2 } from "lucide-react";

export default async function MentorDashboard() {
  const user = await requireRole(["MENTOR"]);
  const { students, pendingProjects, pendingReflections } = await getMentorDashboardData(user.id, user.team_id);
  
  const totalPending = pendingProjects.length + pendingReflections.length;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-lg text-slate-500 mt-1">{user?.name || user?.email}</p>
        </div>
        <Link 
          href="/mentor/pending"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          Review Queue <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Assigned Students</p>
              <p className="text-3xl font-extrabold text-slate-900">{students.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Pending Reviews</p>
              <p className="text-3xl font-extrabold text-slate-900">{totalPending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Projects Pending</p>
              <p className="text-3xl font-extrabold text-slate-900">{pendingProjects.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Reflections Pending</p>
              <p className="text-3xl font-extrabold text-slate-900">{pendingReflections.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Main Content */}
        <div className="space-y-8">
          {totalPending === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center bg-slate-50/30 group">
              <CheckCircle className="w-16 h-16 text-emerald-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-slate-800 mb-2">All Caught Up!</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">
                You currently have no pending reviews. Students in your cohort are still working on their milestones.
              </p>
            </div>
          ) : (
            <>
              {/* Pending Projects */}
              <section className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    Pending Project Reviews
                  </h2>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">{pendingProjects.length}</span>
                </div>
                
                {pendingProjects.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-300" />
                    <p className="font-semibold">All caught up! No projects pending.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {pendingProjects.slice(0, 5).map((p: any) => {
                      const student = students.find((s: any) => s.id === p.user_id);
                      return (
                        <div key={p.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div>
                            <h3 className="font-bold text-slate-800">{p.projects?.chapters?.name || 'Project Review'}</h3>
                            <p className="text-sm text-slate-500">by {student?.email} · {new Date(p.submitted_at).toLocaleDateString()}</p>
                          </div>
                          <Link href={`/mentor/review/project/${p.id}`} className="text-emerald-600 hover:text-emerald-800 font-bold text-sm flex items-center gap-1 transition-colors">
                            Review <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Pending Reflections */}
              <section className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    Pending Reflections
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{pendingReflections.length}</span>
                </div>
                
                {pendingReflections.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-300" />
                    <p className="font-semibold">No reflections awaiting review.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {pendingReflections.slice(0, 5).map((r: any) => {
                      const student = students.find((s: any) => s.id === r.user_id);
                      return (
                        <div key={r.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div>
                            <h3 className="font-bold text-slate-800">{r.reflections?.chapters?.name || 'Reflection'}</h3>
                            <p className="text-sm text-slate-500">by {student?.email} · {new Date(r.submitted_at).toLocaleDateString()}</p>
                          </div>
                          <Link href={`/mentor/review/reflection/${r.id}`} className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center gap-1 transition-colors">
                            Review <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned Students */}
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="p-5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-emerald-600" />
                Your Students
              </h3>
              <Link href="/mentor/students" className="text-xs font-bold text-emerald-600 hover:text-emerald-800">View All</Link>
            </div>
            {students.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No students assigned yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {students.slice(0, 6).map((student: any) => (
                  <Link key={student.id} href={`/mentor/student/${student.id}`} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group block">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                        {(student.email || "?")[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 truncate">{student.email}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-slate-900 rounded-[2rem] p-6 text-white shadow-lg">
            <BarChart3 className="w-8 h-8 text-emerald-300 mb-3" />
            <h3 className="text-lg font-bold mb-1">Skill Analytics</h3>
            <p className="text-emerald-200 text-sm mb-4">View skill distribution across your entire cohort.</p>
            <Link href="/mentor/analytics" className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2 rounded-full transition-colors backdrop-blur-sm border border-white/10 text-sm inline-flex items-center gap-2">
              Open Analytics <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
