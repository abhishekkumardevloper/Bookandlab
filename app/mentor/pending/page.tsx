import { requireRole } from "@/lib/rbac/roles";
import { getMentorDashboardData } from "@/lib/services/mentor";
import { ClipboardList, CheckCircle } from "lucide-react";
import { PendingReviewsClient } from "@/components/mentor/PendingReviewsClient";

export default async function MentorPendingPage() {
  const user = await requireRole(["MENTOR"]);
  const { students, pendingProjects, pendingReflections } = await getMentorDashboardData(user.id, user.team_id);

  const totalPending = pendingProjects.length + pendingReflections.length;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <ClipboardList className="w-10 h-10 text-emerald-600" />
          Pending Reviews
        </h1>
        <p className="text-lg text-slate-500 mt-2">
          You have <strong className="text-amber-600">{totalPending}</strong> submissions awaiting evaluation.
        </p>
      </header>

      {totalPending === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-16 text-center shadow-inner">
          <CheckCircle className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">All caught up!</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            There are no pending reviews. Check back later when students submit new work.
          </p>
        </div>
      ) : (
        <PendingReviewsClient 
          students={students} 
          pendingProjects={pendingProjects} 
          pendingReflections={pendingReflections} 
        />
      )}
    </div>
  );
}
