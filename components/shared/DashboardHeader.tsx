"use client";

import { Search, ChevronDown, User, BookOpen } from "lucide-react"; 
import { NotificationClient } from "@/components/shared/NotificationClient";

export function DashboardHeader({ 
  user, 
  role, 
  initialNotifications, 
  initialUnreadCount 
}: { 
  user: any, 
  role: string,
  initialNotifications: any[],
  initialUnreadCount: number
}) {
  
  // Helper to get initials (e.g., "Aryan A." -> "AA")
  const getInitials = (name: string) => {
    if (!name) return "AA"; // Fallback to match your screenshot
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const displayName = user?.name || "Aryan A.";

  return (
    <header className="h-[88px] bg-[#fafafa] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      
      {/* 1. Logo Section (New) */}
      <div className="flex items-center shrink-0 mr-4 md:mr-8">
        <span className="text-black font-extrabold text-xl tracking-tight whitespace-nowrap">
          book and lab
        </span>
      </div>

      {/* 2. Left/Middle: Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="flex items-center bg-white border border-slate-200 rounded-full px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
          <input 
            type="text" 
            placeholder="Search chapters, topics, concepts..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400 font-medium" 
          />
        </div>
      </div>

      {/* 3. Middle: Time Filter Toggle */}
      <div className="hidden lg:flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm text-sm font-semibold mx-4">
        <button className="px-4 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition-colors">Day</button>
        <button className="px-4 py-1.5 rounded-lg bg-slate-50 text-slate-900 border border-slate-200 shadow-sm">Week</button>
        <button className="px-4 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition-colors">Month</button>
        <button className="px-4 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition-colors">Year</button>
      </div>

      {/* 4. Right: Notifications & Profile */}
      <div className="flex items-center gap-3 ml-auto">
        
        {/* Constrained Notification Wrapper */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm shrink-0 [&>button]:w-full [&>button]:h-full [&_svg]:w-5 [&_svg]:h-5">
          <NotificationClient 
            userId={user?.id} 
            teamId={user?.team_id}
            initialNotifications={initialNotifications}
            initialUnreadCount={initialUnreadCount}
          />
        </div>
        
        {/* Profile Pill */}
        <button className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-full pl-1.5 pr-4 py-1.5 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-inner">
            {getInitials(displayName)}
          </div>
          <span className="text-sm font-bold text-slate-700 hidden sm:block">
            {displayName}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-400 ml-0.5 hidden sm:block" />
        </button>

      </div>
    </header>
  );
}
