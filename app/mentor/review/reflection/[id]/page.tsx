import { requireRole } from "@/lib/rbac/roles";
import { getPendingReflectionSubmission } from "@/lib/services/mentor";
import { ReflectionReviewClient } from "@/components/mentor/ReflectionReviewClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ReflectionReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireRole(["MENTOR"]);
  
  // This validates the mentor is legally allowed to review THIS student's submission in THIS team
  const { submission, student } = await getPendingReflectionSubmission(id, user.id, user.team_id);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-blue-200 pb-4">
        <Link href="/mentor/dashboard" className="p-2 hover:bg-blue-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-blue-700" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reflection Evaluation</h1>
          <p className="text-blue-700 mt-1">Reviewing submission from {student.email}</p>
        </div>
      </div>

      <ReflectionReviewClient submission={submission} student={student} />
    </div>
  );
}
