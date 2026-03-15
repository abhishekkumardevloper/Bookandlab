"use client";

import { useState } from "react";
import { toggleChapterStatusAction } from "@/lib/actions/admin";
import { BookOpen, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export function CurriculumManagementClient({
  initialChapters
}: {
  initialChapters: any[];
}) {
  const [chapters, setChapters] = useState(initialChapters);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusToggle = async (chapterId: string, currentStatus: string) => {
    if (loadingId) return;
    setLoadingId(chapterId);
    
    const newStatus = currentStatus === "ACTIVE" ? "DRAFT" : "ACTIVE";
    
    try {
      const formData = new FormData();
      formData.append("chapterId", chapterId);
      formData.append("newStatus", newStatus);
      
      const res = await toggleChapterStatusAction(formData);
      if (res.success) {
        setChapters(chapters.map(c => c.id === chapterId ? { ...c, status: newStatus } : c));
        router.refresh();
      }
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
         <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
           <BookOpen className="text-rose-600 w-5 h-5"/>
           Platform Chapters
         </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-xs border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Chapter & Subject</th>
              <th className="px-6 py-4">Visibility Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {chapters.map((c) => {
              const isLoading = loadingId === c.id;
              const isActive = c.status === "ACTIVE";
              
              return (
                <tr key={c.id} className={`hover:bg-slate-50 transition-colors ${!isActive ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-slate-500 mt-1">{c.subjects?.name || "Uncategorized"}</div>
                    <div className="text-xs text-slate-400 mt-1 max-w-[400px] truncate" title={c.description}>{c.description}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border gap-1 ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                        {isActive ? <Eye className="w-3 h-3"/> : <EyeOff className="w-3 h-3"/>}
                        {isActive ? 'ACTIVE' : 'DRAFT'}
                      </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleStatusToggle(c.id, c.status)}
                      disabled={isLoading}
                      className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 inline-flex items-center justify-center min-w-[120px] ${
                        isActive 
                          ? 'border-slate-300 text-slate-700 hover:bg-slate-100' 
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isActive ? 'Move to Draft' : 'Publish as Active')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
