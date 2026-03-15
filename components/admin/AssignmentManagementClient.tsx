"use client";

import { useState } from "react";
import { assignMentorAction, revokeMentorAction } from "@/lib/actions/admin";
import { Link, Users, Loader2, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";

export function AssignmentManagementClient({
  students,
  mentors
}: {
  students: any[];
  mentors: any[];
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleAssign = async (studentId: string, mentorId: string) => {
    if (loadingId) return;
    setLoadingId(studentId);
    
    try {
      if (mentorId === "") {
        // Find existing assignment ID if the user is unassigning
        const student = students.find(s => s.id === studentId);
        if (student?.assignmentId) {
          await revokeMentorAction(student.assignmentId);
        }
      } else {
        const formData = new FormData();
        formData.append("studentId", studentId);
        formData.append("mentorId", mentorId);
        await assignMentorAction(formData);
      }
      router.refresh();
    } catch (err: any) {
      alert("Failed to update assignment: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
         <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
           <Link className="text-indigo-600 w-5 h-5"/>
           Active Routings
         </h2>
         <p className="text-sm font-medium text-slate-500">{mentors.length} Mentors Available</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-xs border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 w-1/2">Student Profile</th>
              <th className="px-6 py-4 w-1/2">Assigned Mentor & Authority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => {
              const isLoading = loadingId === s.id;
              
              return (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{s.name}</div>
                    <div className="text-slate-500 mt-1">{s.email}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <select
                        className={`text-sm rounded-lg shadow-sm border transition-colors disabled:opacity-50 flex-1 max-w-[300px] ${
                          s.currentMentorId ? 'border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 bg-indigo-50/30 font-medium text-indigo-900' : 'border-slate-300 focus:border-slate-500 focus:ring-slate-500 text-slate-500'
                        }`}
                        value={s.currentMentorId || ""}
                        disabled={isLoading}
                        onChange={(e) => handleAssign(s.id, e.target.value)}
                      >
                        <option value="">-- No Mentor Assigned --</option>
                        {mentors.map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                        ))}
                      </select>
                      
                      {isLoading && <Loader2 className="w-5 h-5 animate-spin text-indigo-600 shrink-0" />}
                      {!isLoading && s.currentMentorId && <Users className="w-5 h-5 text-indigo-400 shrink-0" />}
                      {!isLoading && !s.currentMentorId && <UserMinus className="w-5 h-5 text-rose-300 shrink-0" />}
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {students.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-slate-500">
                  No students exist in this team to assign.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
