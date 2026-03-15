"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Users, ArrowRight, Mail, Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 20;

export function StudentManagementClient({ initialStudents }: { initialStudents: any[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = initialStudents;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s => 
        (s.name && s.name.toLowerCase().includes(q)) || 
        (s.email && s.email.toLowerCase().includes(q))
      );
    }
    return result;
  }, [initialStudents, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (initialStudents.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-16 text-center">
        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">No students assigned</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Contact your administrator to get students assigned to your mentor profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
          />
        </div>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          {filtered.length} Student{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginated.map((student: any) => (
          <Link
            key={student.id}
            href={`/mentor/student/${student.id}`}
            className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group block"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-extrabold text-xl shrink-0">
                {(student.name?.[0] || student.email?.[0] || "?").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-lg truncate">{student.name || student.email}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{student.email}</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
            </div>
          </Link>
        ))}
      </div>

      {paginated.length === 0 && search && (
        <div className="text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-[2rem]">
          No students found matching "{search}".
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl">
          <p className="text-sm text-slate-500 font-medium">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
