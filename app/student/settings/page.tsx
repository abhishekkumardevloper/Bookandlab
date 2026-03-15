import { getDbUser } from "@/lib/auth/user";
import { Settings, User, Shield, Briefcase } from "lucide-react";
import { redirect } from "next/navigation";

export default async function StudentSettingsPage() {
  const user = await getDbUser();
  if (!user) redirect("/handler/sign-in");

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Settings className="w-10 h-10 text-indigo-600" />
            Account Settings
          </h1>
          <p className="text-lg text-slate-500 mt-2">
            Manage your personal information and preferences.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left p-4 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 flex items-center gap-3">
            <User className="w-5 h-5"/> Profile
          </button>
          <button className="w-full text-left p-4 rounded-xl bg-white text-slate-600 font-bold border border-slate-100 hover:bg-slate-50 flex items-center gap-3">
            <Shield className="w-5 h-5"/> Security
          </button>
          <button className="w-full text-left p-4 rounded-xl bg-white text-slate-600 font-bold border border-slate-100 hover:bg-slate-50 flex items-center gap-3">
            <Briefcase className="w-5 h-5"/> Current Institution
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
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
                  <input type="text" disabled defaultValue={user.roles?.join(", ") || "STUDENT"} className="w-full bg-slate-100 border border-slate-200 text-slate-500 p-3 rounded-lg font-bold" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Team / School ID</label>
                <input type="text" disabled defaultValue={user.team_id || "Unassigned"} className="w-full bg-slate-100 border border-slate-200 text-slate-500 p-3 rounded-lg font-mono text-sm" />
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button type="button" disabled className="bg-indigo-600/50 text-white px-6 py-3 rounded-lg font-bold cursor-not-allowed">
                  Save Changes
                </button>
                <p className="text-sm text-slate-500 mt-3 inline-block ml-4">Changes are disabled in this demo environment.</p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
