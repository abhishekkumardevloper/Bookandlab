import { requireRole } from "@/lib/rbac/roles";
import { Settings, User, Shield } from "lucide-react";

export default async function MentorSettingsPage() {
  const user = await requireRole(["MENTOR"]);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Settings className="w-10 h-10 text-emerald-600" />
          Account Settings
        </h1>
        <p className="text-lg text-slate-500 mt-2">
          Manage your mentor profile and preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left p-4 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 flex items-center gap-3">
            <User className="w-5 h-5" /> Profile
          </button>
          <button className="w-full text-left p-4 rounded-xl bg-white text-slate-600 font-bold border border-slate-100 hover:bg-slate-50 flex items-center gap-3">
            <Shield className="w-5 h-5" /> Security
          </button>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile Information</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">User ID</label>
                  <input type="text" disabled defaultValue={user.id} className="w-full bg-slate-100 border border-slate-200 text-slate-500 p-3 rounded-lg font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Role</label>
                  <input type="text" disabled defaultValue={user.role || "MENTOR"} className="w-full bg-slate-100 border border-slate-200 text-slate-500 p-3 rounded-lg font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email</label>
                <input type="text" disabled defaultValue={user.email || ""} className="w-full bg-slate-100 border border-slate-200 text-slate-500 p-3 rounded-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Team / School ID</label>
                <input type="text" disabled defaultValue={user.team_id || "Unassigned"} className="w-full bg-slate-100 border border-slate-200 text-slate-500 p-3 rounded-lg font-mono text-sm" />
              </div>
              <div className="pt-6 border-t border-slate-100">
                <button type="button" disabled className="bg-emerald-600/50 text-white px-6 py-3 rounded-lg font-bold cursor-not-allowed">
                  Save Changes
                </button>
                <p className="text-sm text-slate-500 mt-3 inline-block ml-4">Profile changes are managed by your administrator.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
