"use client";

import { useState } from "react";
import { createSubjectAction, deleteSubjectAction, updateSubjectAction } from "@/lib/actions/curriculum";
import { Loader2, Plus, Trash2, BookOpen, Pencil, X } from "lucide-react";

type Subject = {
  id: string;
  name: string;
  class_level: string;
  description?: string | null;
};

export function SubjectManagementClient({ initialSubjects }: { initialSubjects: Subject[] }) {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [isSavingSubject, setIsSavingSubject] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsCreating(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createSubjectAction(formData);
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSavingSubject(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateSubjectAction(formData);
      const subjectId = formData.get("subjectId") as string;
      const name = formData.get("name") as string;
      const classLevel = formData.get("classLevel") as string;
      const description = (formData.get("description") as string) || "";

      setSubjects((prev) =>
        prev.map((s) =>
          s.id === subjectId
            ? { ...s, name, class_level: classLevel, description }
            : s
        )
      );
      setEditingSubjectId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSavingSubject(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this subject and all its units/chapters?")) return;
    const fd = new FormData();
    fd.append("subjectId", id);
    try {
      await deleteSubjectAction(fd);
      setSubjects(subjects.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Subject Name</label>
              <input name="name" required placeholder="e.g. Mathematics" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Class Level</label>
              <select name="classLevel" required className="w-full border border-slate-300 rounded-lg p-2.5 text-sm">
                <option value="">Select</option>
                {["6", "7", "8", "9", "10"].map((l) => (
                  <option key={l} value={l}>Class {l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
              <input name="description" placeholder="Optional" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
            </div>
          </div>
          <button type="submit" disabled={isCreating} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50">
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin inline" /> Creating...
              </>
            ) : (
              "Create Subject"
            )}
          </button>
        </form>
      )}

      {subjects.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold">No subjects created yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Subject</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Class</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Description</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((s) => {
                const isEditing = editingSubjectId === s.id;
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors align-top">
                    {isEditing ? (
                      <td colSpan={4} className="p-4">
                        <form onSubmit={handleUpdate} className="space-y-3">
                          <input type="hidden" name="subjectId" value={s.id} />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input name="name" defaultValue={s.name} required className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                            <select name="classLevel" defaultValue={String(s.class_level)} required className="w-full border border-slate-300 rounded-lg p-2.5 text-sm">
                              {["6", "7", "8", "9", "10"].map((l) => (
                                <option key={l} value={l}>Class {l}</option>
                              ))}
                            </select>
                            <input name="description" defaultValue={s.description || ""} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setEditingSubjectId(null)} className="px-3 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center gap-1">
                              <X className="w-4 h-4" /> Cancel
                            </button>
                            <button type="submit" disabled={isSavingSubject} className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
                              {isSavingSubject ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="p-4 font-semibold text-slate-800">{s.name}</td>
                        <td className="p-4 text-slate-600">Class {s.class_level}</td>
                        <td className="p-4 text-sm text-slate-500 truncate max-w-xs">{s.description || "—"}</td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <button onClick={() => setEditingSubjectId(s.id)} className="text-indigo-500 hover:text-indigo-700 transition-colors p-1.5 hover:bg-indigo-50 rounded-lg">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(s.id)} className="text-rose-500 hover:text-rose-700 transition-colors p-1.5 hover:bg-rose-50 rounded-lg">
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
