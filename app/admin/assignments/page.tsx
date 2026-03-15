import { requireRole } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { AssignmentManagementClient } from "@/components/admin/AssignmentManagementClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminAssignmentsPage() {
  const user = await requireRole(["ADMIN"]);
  const supabase = await createAdminClient();

  // 1. Fetch Mentors in the Team
  const { data: teamMentors } = await supabase
    .from("user_roles")
    .select("user_id, users!inner(name, primary_email)")
    .eq("team_id", user.team_id)
    .eq("role_id", (await supabase.from("roles").select("id").eq("name", "MENTOR").single()).data?.id);

  // 2. Fetch Students in the Team
  const { data: teamStudents } = await supabase
    .from("user_roles")
    .select("user_id, users!inner(name, primary_email)")
    .eq("team_id", user.team_id)
    .eq("role_id", (await supabase.from("roles").select("id").eq("name", "STUDENT").single()).data?.id);

  // 3. Fetch Active Assignments
  const { data: assignments } = await supabase
    .from("mentor_assignments")
    .select("id, mentor_id, student_id")
    .eq("team_id", user.team_id);

  // Format Mentor List explicitly 
  const formattedMentors = (teamMentors || []).map((m: any) => ({
    id: m.user_id,
    name: m.users.name || m.users.primary_email,
    email: m.users.primary_email
  }));

  // Format Assignment Grid representing mapping logic
  const formattedStudents = (teamStudents || []).map((s: any) => {
    const activeAssignment = (assignments || []).find((a: any) => a.student_id === s.user_id);
    return {
      id: s.user_id,
      name: s.users.name || s.users.primary_email,
      email: s.users.primary_email,
      assignmentId: activeAssignment?.id || null,
      currentMentorId: activeAssignment?.mentor_id || null,
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-indigo-200 pb-4">
        <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mentor Assignments</h1>
          <p className="text-slate-600 mt-1">Assign grading authority. (Team: {user.team_id})</p>
        </div>
      </div>

      <AssignmentManagementClient 
        students={formattedStudents} 
        mentors={formattedMentors} 
      />
    </div>
  );
}
