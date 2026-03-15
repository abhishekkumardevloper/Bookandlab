import { requireRole } from "@/lib/rbac/roles";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, BookOpen, Star, Settings, 
  Bell, GraduationCap, Trophy, LogOut 
} from "lucide-react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { getUserNotifications, getUnreadCount } from "@/lib/services/notifications";
import { getStudentGamification } from "@/lib/services/student";
import { MobileNav } from "@/components/shared/MobileNav";

const NAV_ITEMS = [
  { href: "/student/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/student/subjects", label: "My Subjects", icon: "BookOpen" },
  { href: "/student/skills", label: "Skill Growth", icon: "Star" },
  { href: "/student/notifications", label: "Notifications", icon: "Bell" },
];

const ACCOUNT_ITEMS = [
  { href: "/student/settings", label: "Settings", icon: "Settings" },
];

const ICON_MAP: Record<string, any> = {
  LayoutDashboard, BookOpen, Star, Settings, Bell,
};

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["STUDENT"]);
  if (!user) redirect("/403");

  // Fetch notifications for the header
  const initialNotifications = await getUserNotifications(user.id, user.team_id, 5);
  const initialUnreadCount = await getUnreadCount(user.id, user.team_id);
  const gamification = await getStudentGamification(user.id);

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans">
      
      {/* Sidebar - Desktop */}
      <aside className="w-[260px] bg-[#141522] text-slate-300 flex-col shrink-0 sticky top-0 h-screen hidden lg:flex border-r border-slate-800 relative z-20">
        
        {/* Logo Area */}
        <div className="p-6 mb-2">
          <Link href="/student/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white tracking-wide leading-tight group-hover:text-blue-400 transition-colors">BookandLab</h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Learning Platform</p>
            </div>
          </Link>
        </div>

        {/* Navigation Area */}
        <div className="flex-1 px-4 space-y-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
          
          {/* Main Menu */}
          <div>
            <div className="text-[10px] font-bold text-slate-500 mb-3 px-3 uppercase tracking-widest">Main</div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = ICON_MAP[item.icon];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-all group"
                  >
                    {Icon && <Icon className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Account & Settings */}
          <div>
            <div className="text-[10px] font-bold text-slate-500 mb-3 px-3 uppercase tracking-widest">Account</div>
            <nav className="space-y-1">
              {ACCOUNT_ITEMS.map((item) => {
                const Icon = ICON_MAP[item.icon];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-all group"
                  >
                    {Icon && <Icon className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Gamification Widget (Bottom) */}
        <div className="p-4 mt-auto">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
            
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 shrink-0 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-[#141522] rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Level {gamification.level}</h4>
                  <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">{gamification.totalXP} XP</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Explorer Mastery</p>
              </div>
            </div>

            <div className="relative z-10 mt-4">
              <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                <span>Progress</span>
                <span>{gamification.levelProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${gamification.levelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logout (Subtle) */}
        <div className="px-4 pb-6 pt-2">
           <Link href="/logout" className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-rose-400/70 hover:text-rose-400 transition-colors group">
             <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             Logout
           </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <DashboardHeader 
          user={user} 
          role="STUDENT" 
          initialNotifications={initialNotifications}
          initialUnreadCount={initialUnreadCount}
        />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
        {/* Mobile Navigation Trigger */}
        <MobileNav user={user} role="STUDENT" items={[...NAV_ITEMS, ...ACCOUNT_ITEMS]} gamification={gamification} />
      </div>
    </div>
  );
}
