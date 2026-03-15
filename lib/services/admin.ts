import { createAdminClient } from "@/lib/db/supabase";

/**
 * 1. Admin Dashboard Metrics Reader
 * Pulls counts and high-level KPIs locked to the user's specific team.
 */
export async function getAdminDashboardData(teamId: string) {
  const supabase = await createAdminClient();

  // Total Students & Total Mentors
  const { data: teamUsers, error: usersErr } = await supabase
    .from("user_roles")
    .select("user_id, roles(name)")
    .eq("team_id", teamId);

  if (usersErr) throw new Error("Could not reliably read team configuration.");

  let studentCount = 0;
  let mentorCount = 0;

  (teamUsers || []).forEach((u: any) => {
    const roleName = u.roles?.name;
    if (roleName === "STUDENT") studentCount++;
    if (roleName === "MENTOR") mentorCount++;
  });

  // Active Chapters (A curriculum metric)
  // For the moment, we assume all chapters are universal. If Curriculum is multi-tenant later, you add `.eq('team_id', ...)`
  const { count: activeChapters } = await supabase
    .from("chapters")
    .select("id", { count: "exact" })
    .eq("status", "ACTIVE");

  // Pending Reviews / Load Analysis (Count the distinct pending projects for mentors in this team)
  const { count: pendingReviews } = await supabase
    .from("project_submissions")
    .select("id", { count: "exact" })
    .eq("team_id", teamId)
    .eq("status", "PENDING");

  // Unassigned Students Risk
  // We identify students who have NO assignment record in `mentor_assignments`.
  const studentIdsInTeam = teamUsers?.filter((u: any) => u.roles?.name === "STUDENT").map(u => u.user_id) || [];
  
  const { data: assignments } = await supabase
    .from("mentor_assignments")
    .select("student_id")
    .eq("team_id", teamId)
    .in("student_id", studentIdsInTeam);

  const assignedSet = new Set(assignments?.map(a => a.student_id));
  const unassignedStudentsCount = studentIdsInTeam.length - assignedSet.size;

  return {
    studentCount,
    mentorCount,
    activeChapters: activeChapters || 0,
    pendingReviews: pendingReviews || 0,
    unassignedStudentsCount,
  };
}

/**
 * 2. Get Users For Admin Management
 * Retrieves a detailed user grid showing Roles, Assignment Load, and Status
 */
export async function getAdminUsersList(teamId: string) {
  const supabase = await createAdminClient();

  const { data: users, error } = await supabase
    .from("user_roles")
    .select(`
      user_id,
      roles(name),
      users!inner(id, name, email, is_active, created_at)
    `)
    .eq("team_id", teamId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed fetching admin user list:", error);
    return [];
  }

  // Fetch their assignments to show Mentor load or Student assignments
  const { data: assignments } = await supabase
    .from("mentor_assignments")
    .select("student_id, mentor_id")
    .eq("team_id", teamId);

  return (users || []).map((ur: any) => {
    const role = ur.roles?.name;
    const isMentor = role === "MENTOR";
    const isStudent = role === "STUDENT";
    let loadOrAssignment = "";

    if (isMentor && assignments) {
      const assignedCount = assignments.filter(a => a.mentor_id === ur.user_id).length;
      loadOrAssignment = assignedCount > 0 ? `${assignedCount} student(s) assigned` : "No assignments";
    }

    if (isStudent && assignments) {
      const hasAssignment = assignments.some(a => a.student_id === ur.user_id);
      loadOrAssignment = hasAssignment ? "Mentor Assigned" : "Needs Mentor";
    }

    return {
      id: ur.user_id,
      email: ur.users.email,
      name: ur.users.name || "Unknown",
      role: role,
      isActive: ur.users.is_active,
      assignedMetadata: loadOrAssignment,
      created_at: ur.users.created_at
    };
  });
}
