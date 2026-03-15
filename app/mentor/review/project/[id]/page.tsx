import { requireRole } from "@/lib/rbac/roles";
import { getPendingProjectSubmission } from "@/lib/services/mentor";
import { ProjectReviewClient } from "@/components/mentor/ProjectReviewClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProjectReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireRole(["MENTOR"]);
  
  // This validates the mentor is legally allowed to review THIS student's submission in THIS team
  const { submission, student } = await getPendingProjectSubmission(id, user.id, user.team_id);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-emerald-200 pb-4">
        <Link href="/mentor/dashboard" className="p-2 hover:bg-emerald-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-emerald-700" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">Project Evaluation</h1>
          <p className="text-emerald-700 mt-1">Reviewing submission from {student.email}</p>
        </div>
      </div>

      <ProjectReviewClient submission={submission} student={student} />
    </div>
  );
}
