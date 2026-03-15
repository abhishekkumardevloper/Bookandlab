"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { markNotificationReadAction, markAllNotificationsReadAction, fetchNotificationsAction } from "@/lib/actions/notifications";
import { Bell, CheckCheck, Circle, Clock, FileText, Users, BookOpen, Shield, TrendingUp } from "lucide-react";

const ICON_MAP: Record<string, any> = {
  REVIEW_COMPLETED: TrendingUp,
  PROJECT_SUBMITTED: FileText,
  MENTOR_ASSIGNED: Users,
  CHAPTER_UNLOCKED: BookOpen,
  ADMIN_ANNOUNCEMENT: Shield,
  ROLE_CHANGED: Shield,
  SUBMISSION_STATUS: FileText,
};

const COLOR_MAP: Record<string, string> = {
  REVIEW_COMPLETED: "text-emerald-600 bg-emerald-50 border-emerald-100",
  PROJECT_SUBMITTED: "text-blue-600 bg-blue-50 border-blue-100",
  MENTOR_ASSIGNED: "text-indigo-600 bg-indigo-50 border-indigo-100",
  CHAPTER_UNLOCKED: "text-amber-600 bg-amber-50 border-amber-100",
  ADMIN_ANNOUNCEMENT: "text-purple-600 bg-purple-50 border-purple-100",
  ROLE_CHANGED: "text-rose-600 bg-rose-50 border-rose-100",
  SUBMISSION_STATUS: "text-sky-600 bg-sky-50 border-sky-100",
};

export function NotificationClient({ userId, teamId, initialNotifications, initialUnreadCount }: {
  userId: string;
  teamId: string;
  initialNotifications: any[];
  initialUnreadCount: number;
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const poll = useCallback(async () => {
    try {
      const { notifications: fresh, unreadCount: count } = await fetchNotificationsAction(userId, teamId);
      setNotifications(fresh);
      setUnreadCount(count);
    } catch {}
  }, [userId, teamId]);

  useEffect(() => {
    const interval = setInterval(poll, 12000);
    return () => clearInterval(interval);
  }, [poll]);

  async function handleMarkRead(id: string) {
    const fd = new FormData();
    fd.append("notificationId", id);
    await markNotificationReadAction(fd);
    setNotifications(n => n.map(x => x.id === id ? { ...x, is_read: true } : x));
    setUnreadCount(c => Math.max(0, c - 1));
  }

  async function handleMarkAll() {
    await markAllNotificationsReadAction(new FormData());
    setNotifications(n => n.map(x => ({ ...x, is_read: true })));
    setUnreadCount(0);
  }

  // Helper to format dates cleanly
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* TRIGGER BUTTON (Strictly Sized) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          isOpen ? "bg-slate-100 border-slate-300" : "bg-white border-slate-200 hover:bg-slate-50"
        }`}
      >
        <Bell className={`w-5 h-5 min-w-[20px] min-h-[20px] shrink-0 transition-colors ${isOpen ? 'text-slate-800' : 'text-slate-500'}`} />
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 border-2 border-white rounded-full translate-x-1/4 -translate-y-1/4 shadow-sm z-10">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN PANEL */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[340px] sm:w-[400px] bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Dropdown Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-extrabold text-slate-800 text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAll} 
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-blue-50"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* Dropdown Body (Scrollable) */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-3 space-y-1.5 bg-slate-50/30">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-base font-bold text-slate-700">All caught up!</h4>
                <p className="text-sm text-slate-500 mt-1">No notifications at the moment.</p>
              </div>
            ) : (
              notifications.map((n: any) => {
                const Icon = ICON_MAP[n.type] || Bell;
                const colors = COLOR_MAP[n.type] || "text-slate-600 bg-slate-100 border-slate-200";
                
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.is_read && handleMarkRead(n.id)}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                      n.is_read
                        ? "bg-transparent hover:bg-slate-50 opacity-70"
                        : "bg-white border border-slate-100 shadow-sm cursor-pointer hover:border-blue-200 hover:shadow-md group"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${colors}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className={`text-sm leading-snug ${n.is_read ? "text-slate-600" : "text-slate-800 font-bold group-hover:text-blue-700 transition-colors"}`}>
                        {n.message}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-medium text-slate-400">{formatTime(n.created_at)}</span>
                      </div>
                    </div>
                    
                    {!n.is_read && (
                      <div className="shrink-0 mt-2">
                        <Circle className="w-2.5 h-2.5 text-blue-600 fill-blue-600" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          
          {/* Optional Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
            <button className="text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-widest transition-colors">
              View All History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
