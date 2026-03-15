import { requireRole } from "@/lib/rbac/roles";
import { getAdminAnalytics } from "@/lib/services/analytics";
import { BarChart3, TrendingUp, Users, CheckSquare, Clock, ArrowUpRight, GraduationCap, BookOpen, Shield, FileText } from "lucide-react";
import { createAdminClient } from "@/lib/db/supabase";
import { SkillBarChart, SubmissionPieChart, CompletionBarChart } from "@/components/shared/AnalyticsCharts";
import { ExportAnalyticsButton } from "@/components/admin/ExportAnalyticsButton";

export default async function AdminReportsPage() {
  const user = await requireRole(["ADMIN"]);
  const analytics = await getAdminAnalytics(user.team_id);

  const supabase = await createAdminClient();
  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select("id, action_type, target_id, details, created_at, actor_id")
    .eq("team_id", user.team_id)
    .order("created_at", { ascending: false })
    .limit(20);

  // Chart data
  const skillChartData = analytics.skillAverages.map(s => ({ name: s.name, value: s.avg }));
  const submissionChartData = [
    { name: "Pending", value: analytics.submissionStats.pending, color: "#f59e0b" },
    { name: "Approved", value: analytics.submissionStats.approved, color: "#10b981" },
    { name: "Needs Revision", value: analytics.submissionStats.needsRevision, color: "#ef4444" },
  ];
  const completionChartData = analytics.subjectEngagement.map(s => ({
    name: s.name.length > 12 ? s.name.slice(0, 12) + "…" : s.name,
    completed: s.completed,
    total: s.total * analytics.studentCount,
  }));

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-indigo-600" />
            Reports & Analytics
          </h1>
          <p className="text-lg text-slate-500 mt-2">Platform-wide intelligence — all metrics computed dynamically.</p>
        </div>
        <div className="flex shrink-0">
          <ExportAnalyticsButton />
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Students", value: analytics.studentCount, icon: GraduationCap, bg: "bg-indigo-50", fg: "text-indigo-600" },
          { label: "Mentors", value: analytics.mentorCount, icon: Users, bg: "bg-emerald-50", fg: "text-emerald-600" },
          { label: "Chapters", value: analytics.totalActiveChapters, icon: BookOpen, bg: "bg-amber-50", fg: "text-amber-600" },
          { label: "Completion", value: `${analytics.completionRate}%`, icon: TrendingUp, bg: "bg-blue-50", fg: "text-blue-600" },
          { label: "Submissions", value: analytics.submissionStats.total, icon: FileText, bg: "bg-purple-50", fg: "text-purple-600" },
          { label: "Pending", value: analytics.submissionStats.pending, icon: Clock, bg: "bg-rose-50", fg: "text-rose-600" },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
              <item.icon className={`w-5 h-5 ${item.fg}`} />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{item.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Skill Averages</h2>
          <SkillBarChart data={skillChartData} />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Submission Status</h2>
          <SubmissionPieChart data={submissionChartData} />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Subject Completion</h2>
          <CompletionBarChart data={completionChartData} />
        </div>
      </div>

      {/* Subject Engagement + Mentors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-600" /> Subject Engagement</h2>
          {analytics.subjectEngagement.length === 0 ? (
            <p className="text-slate-400 text-center py-6">No subject data yet.</p>
          ) : (
            <div className="space-y-3">
              {analytics.subjectEngagement.map((sub) => {
                const maxPossible = sub.total * analytics.studentCount;
                const pct = maxPossible > 0 ? Math.round((sub.completed / maxPossible) * 100) : 0;
                return (
                  <div key={sub.name}>
                    <div className="flex justify-between items-baseline mb-1"><span className="font-semibold text-slate-700 text-sm">{sub.name}</span><span className="text-xs text-indigo-600 font-bold">{pct}%</span></div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-purple-600" /> Mentor Performance</h2>
          {analytics.mentorPerformance.length === 0 ? (
            <p className="text-slate-400 text-center py-6">No mentors yet.</p>
          ) : (
            <div className="space-y-2">
              {analytics.mentorPerformance.map((m, i) => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">{i + 1}</div>
                    <span className="font-mono text-sm text-slate-600">{m.id.slice(0, 16)}...</span>
                  </div>
                  <span className="font-extrabold text-slate-800">{m.reviewCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3"><Shield className="w-5 h-5 text-indigo-600" /><h2 className="text-lg font-bold text-slate-800">Audit Trail (Last 20)</h2></div>
        {(!auditLogs || auditLogs.length === 0) ? (
          <div className="p-12 text-center text-slate-400"><Shield className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p className="font-semibold">No audit entries yet.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Actor</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4"><span className="px-2 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700">{log.action_type}</span></td>
                    <td className="p-4 text-slate-600 font-mono text-xs">{log.actor_id?.slice(0, 12)}...</td>
                    <td className="p-4 text-slate-500 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
