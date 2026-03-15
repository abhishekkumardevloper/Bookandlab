import { getDbUser } from "@/lib/auth/user";
import { getStudentAnalytics } from "@/lib/services/analytics";
import { BarChart3, BookOpen, Target, TrendingUp, TrendingDown, Minus, Clock, Trophy, CheckCircle, FileText, Brain, Zap, MessageSquare, Activity, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { SkillRadarChart, GrowthAreaChart } from "@/components/shared/AnalyticsCharts";

export default async function StudentAnalyticsPage() {
  const user = await getDbUser();
  if (!user) redirect("/handler/sign-in");

  const analytics = await getStudentAnalytics(user.id);

  const SKILL_ICONS: Record<string, any> = {
    "Understanding": Brain, "Thinking": Target, "Practical": Zap, "Communication": MessageSquare, "Creativity": Activity,
  };
  const SKILL_COLORS: Record<string, string> = {
    "Understanding": "bg-blue-500", "Thinking": "bg-indigo-500", "Practical": "bg-amber-500", "Communication": "bg-emerald-500", "Creativity": "bg-purple-500",
  };
  const SKILL_BG: Record<string, string> = {
    "Understanding": "bg-blue-50 text-blue-600", "Thinking": "bg-indigo-50 text-indigo-600", "Practical": "bg-amber-50 text-amber-600", "Communication": "bg-emerald-50 text-emerald-600", "Creativity": "bg-purple-50 text-purple-600",
  };

  // Prepare chart data
  const radarData = analytics.skillGrowth.map(s => ({ name: s.name, value: s.current }));
  const timelineData = analytics.recentScores.map((s: any) => ({
    label: new Date(s.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: s.normalized_score || 0,
  })).reverse();

  const hasSkillData = analytics.skillGrowth.some(s => s.current > 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <BarChart3 className="w-10 h-10 text-indigo-600" />
          Learning Analytics
        </h1>
        <p className="text-lg text-slate-500 mt-2">Your personal performance metrics — updated after every review.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
          <p className="text-2xl font-extrabold text-slate-900">{analytics.chapterStats.completed}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Completed</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2"><BookOpen className="w-5 h-5 text-blue-600" /></div>
          <p className="text-2xl font-extrabold text-slate-900">{analytics.chapterStats.inProgress}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">In Progress</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-2"><FileText className="w-5 h-5 text-indigo-600" /></div>
          <p className="text-2xl font-extrabold text-slate-900">{analytics.submissionStats.total}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Submissions</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2"><Trophy className="w-5 h-5 text-amber-600" /></div>
          <p className="text-2xl font-extrabold text-slate-900">{analytics.submissionStats.approved}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Approved</p>
        </div>
      </div>

      {/* Charts Row */}
      {hasSkillData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-600" /> Skill Radar</h2>
            <SkillRadarChart data={radarData} />
          </div>
          {timelineData.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-600" /> Score Timeline</h2>
              <GrowthAreaChart data={timelineData} />
            </div>
          )}
        </div>
      )}

      {/* Skill Growth Bars */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-600" /> Skill Growth</h2>
        {!hasSkillData ? (
          <div className="bg-slate-50 rounded-xl p-10 text-center">
            <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Skills will appear after your first mentor review.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {analytics.skillGrowth.map((skill) => {
              const Icon = SKILL_ICONS[skill.name] || BarChart3;
              const barColor = SKILL_COLORS[skill.name] || "bg-slate-500";
              const bg = SKILL_BG[skill.name] || "bg-slate-50 text-slate-600";
              const TrendIcon = skill.trend > 0 ? TrendingUp : skill.trend < 0 ? TrendingDown : Minus;
              const trendColor = skill.trend > 0 ? "text-emerald-500" : skill.trend < 0 ? "text-rose-500" : "text-slate-400";
              return (
                <div key={skill.name}>
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${bg}`}><Icon className="w-5 h-5" /></div>
                      <span className="font-bold text-slate-700">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                      <span className="font-extrabold text-xl text-slate-800">{skill.current}</span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all duration-1000`} style={{ width: `${Math.min(skill.current, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chapter Timeline + Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600" /> Chapter Timeline</h2>
          {analytics.chapterTimeline.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No chapters started yet.</p>
          ) : (
            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {analytics.chapterTimeline.map((ch: any) => (
                <div key={ch.chapter_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">{ch.chapters?.name || "Chapter"}</p>
                    <p className="text-xs text-slate-400">{ch.chapters?.subjects?.name || ""}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${ch.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{ch.status}</span>
                    {ch.completed_at && <p className="text-xs text-slate-400 mt-0.5">{new Date(ch.completed_at).toLocaleDateString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-600" /> Performance History</h2>
          {analytics.recentScores.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No scores recorded yet.</p>
          ) : (
            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {analytics.recentScores.map((score: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-semibold text-slate-700 text-sm">{score.skills?.name || "—"}</span>
                    <span className="text-xs text-slate-400 ml-2">{score.chapters?.name || ""}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">{score.normalized_score}</span>
                    <p className="text-xs text-slate-400">{new Date(score.recorded_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mentor Feedback */}
      {analytics.recentReviews.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Mentor Feedback</h2>
          <div className="space-y-3">
            {analytics.recentReviews.map((review: any, i: number) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${review.status_decision === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{review.status_decision}</span>
                  <span className="text-xs text-slate-400">{new Date(review.reviewed_at).toLocaleDateString()}</span>
                </div>
                {review.feedback_text && <p className="text-sm text-slate-600 italic">&ldquo;{review.feedback_text}&rdquo;</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
