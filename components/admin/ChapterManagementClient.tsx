"use client";

import { useState } from "react";
import { createChapterAction, deleteChapterAction } from "@/lib/actions/curriculum";
import { toggleChapterStatusAction } from "@/lib/actions/admin";
import { Loader2, Plus, Trash2, FileText, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function ChapterManagementClient({ initialChapters, subjects, units }: { initialChapters: any[]; subjects: any[]; units: any[] }) {
  const [chapters, setChapters] = useState(initialChapters);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createChapterAction(new FormData(e.currentTarget));
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleToggleStatus(id: string, currentStatus: string) {
    const fd = new FormData();
    fd.append("chapterId", id);
    fd.append("newStatus", currentStatus === "ACTIVE" ? "DRAFT" : "ACTIVE");
    try {
      await toggleChapterStatusAction(fd);
      setChapters(chapters.map(c => c.id === id ? { ...c, status: currentStatus === "ACTIVE" ? "DRAFT" : "ACTIVE" } : c));
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this chapter permanently?")) return;
    const fd = new FormData();
    fd.append("chapterId", id);
    try {
      await deleteChapterAction(fd);
      setChapters(chapters.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Chapter
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Chapter Name</label>
              <input name="name" required placeholder="e.g. Photosynthesis" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
              <select name="subjectId" required className="w-full border border-slate-300 rounded-lg p-2.5 text-sm">
                <option value="">Select</option>
                {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name} (Class {s.class_level})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Unit (Optional)</label>
              <select name="unitId" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm">
                <option value="">No unit</option>
                {units.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Estimated Time (min)</label>
              <input name="estimatedTime" type="number" min="5" defaultValue="30" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Sequence Order</label>
              <input name="sequenceOrder" type="number" min="1" defaultValue="1" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
              <input name="description" placeholder="Optional" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Why It Matters</label>
            <textarea name="whyItMatters" placeholder="Optional motivation text" rows={2} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
          </div>
          <button type="submit" disabled={isCreating} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50">
            {isCreating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin inline" /> Creating...</> : "Create Chapter"}
          </button>
        </form>
      )}

      {chapters.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold">No chapters created yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Chapter</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Subject</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Time</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chapters.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/chapters/${c.id}`} className="font-semibold text-indigo-700 hover:underline">{c.name}</Link>
                    {c.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{c.description}</p>}
                  </td>
                  <td className="p-4 text-slate-600 text-sm">{c.subjects?.name || "—"}</td>
                  <td className="p-4 text-slate-500 text-sm">{c.estimated_time || "—"}m</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${c.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                      {c.status || "DRAFT"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-1">
                    <button onClick={() => handleToggleStatus(c.id, c.status)} className="text-indigo-500 hover:text-indigo-700 p-1.5 hover:bg-indigo-50 rounded-lg transition-colors" title={c.status === "ACTIVE" ? "Unpublish" : "Publish"}>
                      {c.status === "ACTIVE" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
