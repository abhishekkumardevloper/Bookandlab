import { requireRole } from "@/lib/rbac/roles";
import { getAdminDashboardData } from "@/lib/services/admin";
import Link from "next/link";
import { Users, GraduationCap, BookOpen, UserMinus, Clock, ArrowRight, FileText, UserCheck, Brain, Ruler, BarChart3, FolderTree } from "lucide-react";

export default async function AdminDashboard() {
  const user = await requireRole(["ADMIN"]);
  const metrics = await getAdminDashboardData(user.team_id);
  
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Institution Governance</h1>
          <p className="text-lg text-slate-500 mt-1">Team: {user.team_id}</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Students</p>
              <p className="text-2xl font-extrabold text-slate-900">{metrics.studentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mentors</p>
              <p className="text-2xl font-extrabold text-slate-900">{metrics.mentorCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chapters</p>
              <p className="text-2xl font-extrabold text-slate-900">{metrics.activeChapters}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending</p>
              <p className="text-2xl font-extrabold text-slate-900">{metrics.pendingReviews}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-rose-100 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-rose-50 rounded-full flex items-center justify-center shrink-0">
              <UserMinus className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Unassigned</p>
              <p className="text-2xl font-extrabold text-rose-900">{metrics.unassignedStudentsCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      {metrics.activeChapters === 0 ? (
        <div className="bg-white border-2 border-dashed border-indigo-100 rounded-[2rem] p-12 text-center bg-indigo-50/20 group">
          <BookOpen className="w-16 h-16 text-indigo-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-black text-slate-800 mb-2">Build your Curriculum</h3>
          <p className="text-slate-500 font-medium max-w-lg mx-auto mb-8 text-lg">
            Create your first subject and chapters to begin building the learning experience for your institution.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/admin/subjects" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
              Create Subject
            </Link>
            <Link href="/admin/chapters" className="px-8 py-3 bg-white text-indigo-600 border border-indigo-200 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
              Manage Chapters
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Governance Grid */}
          <h2 className="text-2xl font-bold text-slate-800 mt-4">Platform Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { href: "/admin/classes", icon: GraduationCap, title: "Class Management", desc: "Create and manage class levels (6-10).", color: "indigo" },
              { href: "/admin/subjects", icon: BookOpen, title: "Subject Management", desc: "Create subjects per class.", color: "emerald" },
              { href: "/admin/units", icon: FolderTree, title: "Unit Management", desc: "Organize units within subjects.", color: "amber" },
              { href: "/admin/chapters", icon: FileText, title: "Chapter Management", desc: "Full chapter CRUD + publish/unpublish.", color: "blue" },
              { href: "/admin/users", icon: Users, title: "User Management", desc: "Manage roles and user status.", color: "purple" },
              { href: "/admin/assignments", icon: UserCheck, title: "Mentor Assignments", desc: "Assign students to mentors.", color: "teal" },
              { href: "/admin/skills", icon: Brain, title: "Skill Configuration", desc: "Manage the 5 core skill dimensions.", color: "rose" },
              { href: "/admin/rubrics", icon: Ruler, title: "Rubric Setup", desc: "Configure evaluation rubric templates.", color: "orange" },
              { href: "/admin/reports", icon: BarChart3, title: "Reports & Analytics", desc: "Platform-wide metrics and audit log.", color: "cyan" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group block">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 bg-${item.color}-50 rounded-xl flex items-center justify-center shrink-0`}>
                    <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors mt-1 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
