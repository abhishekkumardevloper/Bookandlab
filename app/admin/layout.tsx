import { requireRole } from "@/lib/rbac/roles";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, Layers, BarChart3, Settings, Bell, Shield, HeartPulse } from "lucide-react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { getUserNotifications, getUnreadCount } from "@/lib/services/notifications";
import { MobileNav } from "@/components/shared/MobileNav";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/subjects", label: "Curriculum", icon: "BookOpen" },
  { href: "/admin/users", label: "User Management", icon: "Users" },
  { href: "/admin/reports", label: "Intelligence", icon: "BarChart3" },
  { href: "/admin/monitoring", label: "System Health", icon: "HeartPulse" },
  { href: "/admin/notifications", label: "Announcements", icon: "Bell" },
  { href: "/admin/settings", label: "Global Settings", icon: "Settings" },
];

const ICON_MAP: Record<string, any> = {
  LayoutDashboard, Users, BookOpen, Layers, BarChart3, Settings, Bell, HeartPulse
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["ADMIN"]);
  if (!user) redirect("/403");

  const initialNotifications = await getUserNotifications(user.id, user.team_id, 5);
  const initialUnreadCount = await getUnreadCount(user.id, user.team_id);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 sticky top-0 h-screen hidden lg:flex shadow-sm">
        <div className="p-8 border-b border-slate-100">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
               <Shield className="w-6 h-6 text-indigo-400" />
             </div>
             <div>
               <h2 className="text-xl font-extrabold tracking-tight text-slate-900">BookandLab</h2>
               <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mt-0.5">Control Center</p>
             </div>
           </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100"
              >
                {Icon && <Icon className="w-5 h-5" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">System Integrity</div>
           <div className="flex justify-center gap-1">
             {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-4 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        <DashboardHeader 
          user={user} 
          role="ADMIN" 
          initialNotifications={initialNotifications}
          initialUnreadCount={initialUnreadCount}
        />
        <main className="flex-1 overflow-y-auto bg-white/50">
          {children}
        </main>

        {/* Mobile Navigation Trigger */}
        <MobileNav user={user} role="ADMIN" items={NAV_ITEMS} />
      </div>
    </div>
  );
}
