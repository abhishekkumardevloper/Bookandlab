"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderGit2, MessageSquare, ArrowRight, Search, Filter } from "lucide-react";

export function PendingReviewsClient({ 
  students, 
  pendingProjects, 
  pendingReflections 
}: { 
  students: any[], 
  pendingProjects: any[], 
  pendingReflections: any[] 
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "PROJECT" | "REFLECTION">("ALL");

  const filteredProjects = typeFilter === "REFLECTION" ? [] : pendingProjects.filter(p => {
    const student = students.find(s => s.id === p.user_id);
    const matchesSearch = student?.email?.toLowerCase().includes(search.toLowerCase()) || 
                          p.projects?.chapters?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const filteredReflections = typeFilter === "PROJECT" ? [] : pendingReflections.filter(r => {
    const student = students.find(s => s.id === r.user_id);
    const matchesSearch = student?.email?.toLowerCase().includes(search.toLowerCase()) || 
                          r.reflections?.chapters?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const totalCount = filteredProjects.length + filteredReflections.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search student email or chapter..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(["ALL", "PROJECT", "REFLECTION"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  typeFilter === f 
                    ? "bg-white text-emerald-700 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {totalCount === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center">
            <p className="text-slate-400 font-medium">No pending submissions match your criteria.</p>
          </div>
        ) : (
          <>
            {filteredProjects.length > 0 && (
              <section className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-amber-500" />
                    Project Submissions
                  </h2>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">{filteredProjects.length}</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredProjects.map((p: any) => {
                    const student = students.find((s: any) => s.id === p.user_id);
                    return (
                      <div key={p.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                          <h3 className="font-bold text-slate-800">{p.projects?.chapters?.name || 'Project'}</h3>
                          <p className="text-sm text-slate-500">by {student?.email} · {new Date(p.submitted_at).toLocaleDateString()}</p>
                        </div>
                        <Link href={`/mentor/review/project/${p.id}`} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-sm px-4 py-2 rounded-full transition-colors flex items-center gap-1">
                          Start Review <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {filteredReflections.length > 0 && (
              <section className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    Reflection Submissions
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{filteredReflections.length}</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredReflections.map((r: any) => {
                    const student = students.find((s: any) => s.id === r.user_id);
                    return (
                      <div key={r.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                          <h3 className="font-bold text-slate-800">{r.reflections?.chapters?.name || 'Reflection'}</h3>
                          <p className="text-sm text-slate-500">by {student?.email} · {new Date(r.submitted_at).toLocaleDateString()}</p>
                        </div>
                        <Link href={`/mentor/review/reflection/${r.id}`} className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-sm px-4 py-2 rounded-full transition-colors flex items-center gap-1">
                          Start Review <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
