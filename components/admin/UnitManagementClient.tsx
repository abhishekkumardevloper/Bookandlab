"use client";

import { useState } from "react";
import { createUnitAction, deleteUnitAction, updateUnitAction } from "@/lib/actions/curriculum";
import { Loader2, Plus, Trash2, FolderTree, Pencil, X } from "lucide-react";

type Subject = { id: string; name: string; class_level: string };
type Unit = {
  id: string;
  name: string;
  subject_id?: string;
  sequence_order: number;
  subjects?: { name: string };
};

export function UnitManagementClient({ initialUnits, subjects }: { initialUnits: Unit[]; subjects: Subject[] }) {
  const [units, setUnits] = useState(initialUnits);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [isSavingUnit, setIsSavingUnit] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createUnitAction(new FormData(e.currentTarget));
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSavingUnit(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateUnitAction(formData);
      const unitId = formData.get("unitId") as string;
      const name = formData.get("name") as string;
      const subjectId = formData.get("subjectId") as string;
      const sequenceOrder = parseInt((formData.get("sequenceOrder") as string) || "1");
      const selectedSubject = subjects.find((s) => s.id === subjectId);

      setUnits((prev) =>
        prev.map((u) =>
          u.id === unitId
            ? {
                ...u,
                name,
                subject_id: subjectId,
                sequence_order: sequenceOrder,
                subjects: selectedSubject ? { name: selectedSubject.name } : u.subjects,
              }
            : u
        )
      );
      setEditingUnitId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSavingUnit(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this unit?")) return;
    const fd = new FormData();
    fd.append("unitId", id);
    try {
      await deleteUnitAction(fd);
      setUnits(units.filter((u) => u.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
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
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} (Class {s.class_level})</option>
                ))}
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
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {units.map((u) => {
                const isEditing = editingUnitId === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors align-top">
                    {isEditing ? (
                      <td colSpan={4} className="p-4">
                        <form onSubmit={handleUpdate} className="space-y-3">
                          <input type="hidden" name="unitId" value={u.id} />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input name="name" defaultValue={u.name} required className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                            <select
                              name="subjectId"
                              defaultValue={u.subject_id || ""}
                              required
                              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                            >
                              <option value="" disabled>Select subject</option>
                              {subjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.name} (Class {s.class_level})</option>
                              ))}
                            </select>
                            <input name="sequenceOrder" type="number" min="1" defaultValue={u.sequence_order} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setEditingUnitId(null)} className="px-3 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center gap-1">
                              <X className="w-4 h-4" /> Cancel
                            </button>
                            <button type="submit" disabled={isSavingUnit} className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
                              {isSavingUnit ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="p-4 font-semibold text-slate-800">{u.name}</td>
                        <td className="p-4 text-slate-600">{u.subjects?.name || "—"}</td>
                        <td className="p-4 text-slate-500">{u.sequence_order}</td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <button onClick={() => setEditingUnitId(u.id)} className="text-indigo-500 hover:text-indigo-700 p-1.5 hover:bg-indigo-50 rounded-lg transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(u.id)} className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
