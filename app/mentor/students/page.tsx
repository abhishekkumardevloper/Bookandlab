import { requireRole } from "@/lib/rbac/roles";
import { getMentorDashboardData } from "@/lib/services/mentor";
import Link from "next/link";
import { Users } from "lucide-react";
import { StudentManagementClient } from "@/components/mentor/StudentManagementClient";

export default async function MentorStudentsPage() {
  const user = await requireRole(["MENTOR"]);
  const { students } = await getMentorDashboardData(user.id, user.team_id);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Users className="w-10 h-10 text-emerald-600" />
          Assigned Students
        </h1>
        <p className="text-lg text-slate-500 mt-2">
          Your cohort has <strong className="text-slate-800">{students.length}</strong> active students.
        </p>
      </header>

      <StudentManagementClient initialStudents={students} />
    </div>
  );
}
