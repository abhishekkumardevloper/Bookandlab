import { requireRole } from "@/lib/rbac/roles";
import { getSystemHealth } from "@/lib/services/monitoring";
import { Activity, ShieldCheck, Database, Zap, Cpu, HardDrive, Globe, RefreshCcw, Bell, Server } from "lucide-react";

export default async function MonitoringPage() {
  const user = await requireRole(["ADMIN"]);
  const health = await getSystemHealth();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="w-10 h-10 text-indigo-600" />
            System Monitoring
          </h1>
          <p className="text-lg text-slate-500 mt-1">Real-time health and performance intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100">
            <ShieldCheck className="w-4 h-4" /> System Operational
          </span>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database className="w-12 h-12 text-indigo-600" />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Database Status</p>
          <p className="text-3xl font-black text-slate-900 mb-2">{health.database}</p>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected to Supabase
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-12 h-12 text-amber-600" />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">API Latency</p>
          <p className="text-3xl font-black text-slate-900 mb-2">{health.latency}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Optimal Performance</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <RefreshCcw className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">System Uptime</p>
          <p className="text-3xl font-black text-slate-900 mb-2">{health.uptime}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Last 30 Days</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe className="w-12 h-12 text-emerald-600" />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active Sessions</p>
          <p className="text-3xl font-black text-slate-900 mb-2">{health.activeSessions}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Live Users</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resource Allocation */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            Server Resource Usage
          </h2>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> CPU Load
                </span>
                <span className="font-black text-slate-900">{health.cpuUsage}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: health.cpuUsage }} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <HardDrive className="w-4 h-4" /> RAM Utilization
                </span>
                <span className="font-black text-slate-900">{health.memoryUsage}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: health.memoryUsage }} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4" /> Storage Usage
                </span>
                <span className="font-black text-slate-900">{health.storageUsed}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: "2.4%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* System Logs & Events */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Server className="w-5 h-5 text-slate-600" />
            Recent Infrastructure Events
          </h2>
          <div className="space-y-4">
            {[
              { time: "2m ago", event: "Backup successfully completed", icon: Database, color: "text-emerald-500" },
              { time: "15m ago", event: "Auto-scaled: Added node-v14-x2", icon: Cpu, color: "text-blue-500" },
              { time: "1h ago", event: "System health check passed", icon: ShieldCheck, color: "text-indigo-500" },
              { time: "2h ago", event: "Cron Job: Notification cleanup", icon: Bell, color: "text-amber-500" },
              { time: "5h ago", event: "Security Audit: No anomalies", icon: ShieldCheck, color: "text-emerald-500" },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className={`w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center ${ev.color}`}>
                  <ev.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{ev.event}</p>
                  <p className="text-xs text-slate-400 font-medium">{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Distribution */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20" />
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          Global High-Availability
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {health.regions.map((region, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Region</p>
              <p className="text-sm font-bold text-white mb-2">{region}</p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ACTIVE
              </div>
            </div>
          ))}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Notifications</p>
            <p className="text-lg font-black text-white">{health.notificationsSent}</p>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-tight">Sent Today</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Last Backup</p>
            <p className="text-lg font-black text-white">{health.lastBackup}</p>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-tight">Point-in-time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
