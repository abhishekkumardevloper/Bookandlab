import { requireRole } from "@/lib/rbac/roles";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Clock, Star, Bell, Settings, ShieldCheck } from "lucide-react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { getUserNotifications, getUnreadCount } from "@/lib/services/notifications";
import { MobileNav } from "@/components/shared/MobileNav";

const NAV_ITEMS = [
  { href: "/mentor/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/mentor/pending", label: "Pending Reviews", icon: "Clock" },
  { href: "/mentor/students", label: "Assigned Students", icon: "Users" },
  { href: "/mentor/analytics", label: "Cohort Intelligence", icon: "Star" },
  { href: "/mentor/notifications", label: "Notifications", icon: "Bell" },
  { href: "/mentor/settings", label: "Settings", icon: "Settings" },
];

const ICON_MAP: Record<string, any> = {
  LayoutDashboard, Users, Clock, Star, Bell, Settings
};

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["MENTOR"]);
  if (!user) redirect("/403");

  const initialNotifications = await getUserNotifications(user.id, user.team_id, 5);
  const initialUnreadCount = await getUnreadCount(user.id, user.team_id);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop Only */}
      <aside className="w-68 bg-slate-900 text-white flex flex-col shrink-0 sticky top-0 h-screen hidden lg:flex border-r border-slate-800">
        <div className="p-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <div>
               <h2 className="text-xl font-black tracking-tight">BookandLab</h2>
               <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mt-0.5">Mentor Governance</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all group"
              >
                {Icon && <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800">
           <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Session Protocol</p>
              <p className="text-xs text-slate-300 font-medium">Verify reflections daily to unlock curriculum flow.</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        <DashboardHeader 
          user={user} 
          role="MENTOR" 
          initialNotifications={initialNotifications}
          initialUnreadCount={initialUnreadCount}
        />
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
        
        {/* Mobile Navigation Trigger */}
        <MobileNav user={user} role="MENTOR" items={NAV_ITEMS} />
      </div>
    </div>
  );
}
