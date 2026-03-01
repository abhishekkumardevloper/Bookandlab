import { requireRole } from "@/lib/rbac/roles";
import { getAdminDashboardData } from "@/lib/services/admin";
import Link from "next/link";
import { Users, GraduationCap, BookOpen, UserMinus } from "lucide-react";

export default async function AdminDashboard() {
  const user = await requireRole(["ADMIN"]);
  const metrics = await getAdminDashboardData(user.team_id);
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="border-b border-indigo-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">Institution Governance</h1>
        <p className="text-slate-600 mt-2">Team Context: {user.team_id}</p>
      </header>
      
      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Students</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{metrics.studentCount}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Mentors</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{metrics.mentorCount}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Active Chapters</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{metrics.activeChapters}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-rose-500 uppercase tracking-widest">Unassigned Risk</p>
            <p className="text-3xl font-bold text-rose-900 mt-1">{metrics.unassignedStudentsCount}</p>
          </div>
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
            <UserMinus className="w-6 h-6 text-rose-600" />
          </div>
        </div>
      </div>
      
      {/* Management Grid */}
      <h2 className="text-xl font-bold text-slate-900 mt-12 mb-4">Governance Controls</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/users" className="block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group">
          <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">User Management</h3>
          <p className="text-sm text-slate-500 mb-4">Safely assign roles (Admin, Mentor, Student) and suspend accounts strictly within your team.</p>
          <span className="text-indigo-600 text-sm font-semibold flex items-center gap-1">Manage Users &rarr;</span>
        </Link>
        
        <Link href="/admin/curriculum" className="block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group">
          <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">Curriculum Metadata</h3>
          <p className="text-sm text-slate-500 mb-4">Control visibility status (Draft vs Active) of chapters for your institution.</p>
          <span className="text-indigo-600 text-sm font-semibold flex items-center gap-1">Manage Curriculum &rarr;</span>
        </Link>

        <Link href="/admin/assignments" className="block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group">
          <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">Mentor Assignments</h3>
          <p className="text-sm text-slate-500 mb-4">Allocate student cohorts to human evaluators to maintain assessment quality.</p>
          <span className="text-indigo-600 text-sm font-semibold flex items-center gap-1">Manage Assignments &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
