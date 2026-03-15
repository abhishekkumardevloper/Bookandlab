"use client";

import { useState, useMemo } from "react";
import { changeUserRoleAction, toggleUserStatusAction } from "@/lib/actions/admin";
import { Shield, ShieldAlert, GraduationCap, Users, Loader2, AlertCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 20;

export function UserManagementClient({ currentUserId, initialUsers }: { currentUserId: string, initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const filtered = useMemo(() => {
    let result = users;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    }
    if (roleFilter !== "ALL") result = result.filter(u => u.role === roleFilter);
    if (statusFilter !== "ALL") result = result.filter(u => statusFilter === "ACTIVE" ? u.isActive : !u.isActive);
    return result;
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRoleChange = async (userId: string, newRole: "STUDENT" | "MENTOR" | "ADMIN") => {
    if (loadingId) return;
    setLoadingId(userId); setError("");
    try {
      const fd = new FormData(); fd.append("userId", userId); fd.append("newRole", newRole);
      const res = await changeUserRoleAction(fd);
      if (res.success) { setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u)); router.refresh(); }
    } catch (err: any) { setError(err.message || "Failed to update role"); } finally { setLoadingId(null); }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    if (loadingId) return;
    setLoadingId(userId); setError("");
    try {
      const fd = new FormData(); fd.append("userId", userId); fd.append("isActive", (!currentStatus).toString());
      const res = await toggleUserStatusAction(fd);
      if (res.success) { setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u)); router.refresh(); }
    } catch (err: any) { setError(err.message || "Failed to update status"); } finally { setLoadingId(null); }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN": return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case "MENTOR": return <Users className="w-5 h-5 text-emerald-500" />;
      default: return <GraduationCap className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" /><p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500">
          <option value="ALL">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="MENTOR">Mentor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500">
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Suspended</option>
        </select>
        <span className="text-xs text-slate-400 font-mono">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((u) => {
                const isSelf = u.id === currentUserId;
                const isLoading = loadingId === u.id;
                return (
                  <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${!u.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        {u.name || "—"} {isSelf && <span className="ml-1 text-[10px] uppercase bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">You</span>}
                      </div>
                      <div className="text-slate-500 mt-0.5 text-xs">{u.email}</div>
                    </td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2">{getRoleIcon(u.role)}<span className="font-medium text-slate-700">{u.role}</span></div></td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${u.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <select className="text-sm border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50"
                          value={u.role} disabled={isLoading || isSelf}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as any)}>
                          <option value="STUDENT">Student</option><option value="MENTOR">Mentor</option><option value="ADMIN">Admin</option>
                        </select>
                        <button onClick={() => handleStatusToggle(u.id, u.isActive)} disabled={isLoading || isSelf}
                          className={`text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 flex items-center justify-center min-w-[90px] ${u.isActive ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}>
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (u.isActive ? 'Suspend' : 'Activate')}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No users match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
