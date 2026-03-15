import { requireRole } from "@/lib/rbac/roles";
import { getMentorAnalytics } from "@/lib/services/analytics";
import { BarChart3, Brain, Target, Zap, MessageSquare, Users, TrendingUp, Activity, AlertTriangle, Sparkles } from "lucide-react";
import { SkillRadarChart, GrowthAreaChart } from "@/components/shared/AnalyticsCharts";

export default async function MentorAnalyticsPage() {
  const user = await requireRole(["MENTOR"]);
  const analytics = await getMentorAnalytics(user.id, user.team_id);

  const SKILL_ICONS: Record<string, any> = {
    "Understanding": Brain, "Thinking": Target, "Practical": Zap, "Communication": MessageSquare, "Creativity": Activity,
  };
  const SKILL_BAR_COLORS: Record<string, string> = {
    "Understanding": "bg-blue-500", "Thinking": "bg-indigo-500", "Practical": "bg-amber-500", "Communication": "bg-emerald-500", "Creativity": "bg-purple-500",
  };
  const SKILL_BG: Record<string, string> = {
    "Understanding": "bg-blue-50 text-blue-600", "Thinking": "bg-indigo-50 text-indigo-600", "Practical": "bg-amber-50 text-amber-600", "Communication": "bg-emerald-50 text-emerald-600", "Creativity": "bg-purple-50 text-purple-600",
  };

  const overallAvg = analytics.skillTrends.length > 0
    ? Math.round(analytics.skillTrends.reduce((a, s) => a + s.avg, 0) / analytics.skillTrends.length)
    : 0;

  // Prepare chart data
  const radarData = analytics.skillTrends.map(s => ({ name: s.name, value: s.avg }));
  const timelineData = analytics.improvementPatterns.map((s: any) => ({
    label: new Date(s.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: s.normalized_score || 0,
  })).reverse();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <BarChart3 className="w-10 h-10 text-emerald-600" />
          Cohort Skill Intelligence
        </h1>
        <p className="text-lg text-slate-500 mt-2">
          Dynamic metrics across <strong className="text-slate-800">{analytics.studentIds.length}</strong> assigned students.
        </p>
      </header>

      {analytics.studentIds.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-16 text-center">
          <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No student data yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Analytics will populate as you begin reviewing projects.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Cohort</p>
                <p className="text-2xl font-extrabold text-slate-900">{analytics.studentIds.length}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average Score</p>
                <p className="text-2xl font-extrabold text-slate-900">{overallAvg}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Reviews</p>
                <p className="text-2xl font-extrabold text-slate-900">{analytics.reviewStats.total}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Approved %</p>
                <p className="text-2xl font-extrabold text-slate-900">
                  {analytics.reviewStats.total > 0 ? Math.round((analytics.reviewStats.approved / analytics.reviewStats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Skill Distribution
              </h2>
              <SkillRadarChart data={radarData} />
            </div>
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Cohort Improvement
              </h2>
              <GrowthAreaChart data={timelineData} />
            </div>
          </div>

          {/* Skill Trends Details */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Performance per Dimension</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {analytics.skillTrends.map((skill) => {
                const Icon = SKILL_ICONS[skill.name as string] || BarChart3;
                const barColor = SKILL_BAR_COLORS[skill.name as string] || "bg-slate-500";
                const bg = SKILL_BG[skill.name as string] || "bg-slate-50 text-slate-600";
                return (
                  <div key={skill.name}>
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${bg}`}><Icon className="w-5 h-5" /></div>
                        <div>
                          <span className="font-bold text-slate-700">{skill.name}</span>
                          {skill.weakCount > 0 && (
                            <span className="ml-2 text-[10px] font-black uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full tracking-wider">
                              {skill.weakCount} student(s) weak
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-xl text-slate-800">{skill.avg}</span>
                        <span className="text-xs text-slate-400 ml-1">avg</span>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} rounded-full transition-all duration-1000 shadow-sm`} 
                        style={{ width: `${Math.min(skill.avg, 100)}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critical Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Critical Weaknesses
              </h2>
              {analytics.weakestSkills.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Stable cohort—no critical skill drops detected.</p>
              ) : (
                <div className="space-y-4">
                  {analytics.weakestSkills.map((skill, i) => (
                    <div key={skill.name} className="flex items-center justify-between p-4 bg-amber-50/30 border border-amber-100 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center font-black text-amber-700">{i + 1}</div>
                        <div>
                          <span className="font-bold text-slate-800 block">{skill.name}</span>
                          <span className="text-xs text-slate-500 font-medium">Needs instructional intervention</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-2xl text-amber-600">{skill.avg}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Recent Scoring Patterns
              </h2>
              {analytics.improvementPatterns.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No recent scores recorded.</p>
              ) : (
                <div className="space-y-3 flex-1 overflow-y-auto pr-2 max-h-[350px]">
                  {analytics.improvementPatterns.map((score: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors group">
                      <div>
                        <span className="font-bold text-slate-800 text-sm block group-hover:text-emerald-700 transition-colors">{score.skills?.name || "Dimension"}</span>
                        <span className="text-xs text-slate-400 font-medium">{score.chapters?.name}</span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="font-black text-lg text-slate-900 bg-white px-2 rounded-lg border border-slate-200 shadow-sm">{score.normalized_score}</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">{new Date(score.recorded_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
