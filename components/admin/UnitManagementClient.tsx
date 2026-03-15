"use client";

import { useState } from "react";
import { createUnitAction, deleteUnitAction } from "@/lib/actions/curriculum";
import { Loader2, Plus, Trash2, FolderTree } from "lucide-react";

export function UnitManagementClient({ initialUnits, subjects }: { initialUnits: any[]; subjects: any[] }) {
  const [units, setUnits] = useState(initialUnits);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createUnitAction(new FormData(e.currentTarget));
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this unit?")) return;
    const fd = new FormData();
    fd.append("unitId", id);
    try {
      await deleteUnitAction(fd);
      setUnits(units.filter(u => u.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Unit
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Unit Name</label>
              <input name="name" required placeholder="e.g. Algebra" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
              <select name="subjectId" required className="w-full border border-slate-300 rounded-lg p-2.5 text-sm">
                <option value="">Select</option>
                {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name} (Class {s.class_level})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Sequence Order</label>
              <input name="sequenceOrder" type="number" min="1" defaultValue="1" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
            </div>
          </div>
          <button type="submit" disabled={isCreating} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50">
            {isCreating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin inline" /> Creating...</> : "Create Unit"}
          </button>
        </form>
      )}

      {units.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
          <FolderTree className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold">No units created yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Unit</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Subject</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Order</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {units.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-slate-800">{u.name}</td>
                  <td className="p-4 text-slate-600">{u.subjects?.name || "—"}</td>
                  <td className="p-4 text-slate-500">{u.sequence_order}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(u.id)} className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition-colors">
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
