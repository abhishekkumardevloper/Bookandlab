import { createAdminClient } from "@/lib/db/supabase";

export async function getMentorDashboardData(mentorId: string, teamId: string) {
  const supabase = await createAdminClient();

  // 1. Fetch Assigned Students strictly mapped to this mentor's team context
  const { data: assignments, error: assignErr } = await supabase
    .from("mentor_assignments")
    .select(`
      student_id,
      users!mentor_assignments_student_id_fkey(id, email)
    `)
    .eq("mentor_id", mentorId)
    .eq("team_id", teamId);

  if (assignErr) {
    console.error("Error fetching mentor assignments:", assignErr);
    return { students: [], pendingProjects: [], pendingReflections: [] };
  }

  const assignedStudentIds = assignments?.map((a) => a.student_id) || [];
  
  // Format student records safely handling generic user names/emails until profiles exist
  const students = assignments?.map(a => {
    const u: any = a.users;
    return {
      id: a.student_id,
      email: u?.email || 'Unknown Student',
    };
  }) || [];

  if (assignedStudentIds.length === 0) {
    return { students: [], pendingProjects: [], pendingReflections: [] };
  }

  // 2. Fetch PENDING Project Submissions for these specific students IN the same team
  const { data: pendingProjects } = await supabase
    .from("project_submissions")
    .select(`
      id, user_id, status, submitted_at,
      projects(id, type, chapters(id, name, subject_id))
    `)
    .in("user_id", assignedStudentIds)
    .eq("team_id", teamId)
    .eq("status", "PENDING")
    .order("submitted_at", { ascending: true });

  // 3. Fetch PENDING Reflection Submissions
  const { data: pendingReflections } = await supabase
    .from("reflection_submissions")
    .select(`
      id, user_id, status, submitted_at,
      reflections(id, chapters(id, name, subject_id))
    `)
    .in("user_id", assignedStudentIds)
    .eq("team_id", teamId)
    .eq("status", "PENDING")
    .order("submitted_at", { ascending: true });

  return {
    students,
    pendingProjects: pendingProjects || [],
    pendingReflections: pendingReflections || [],
  };
}

export async function getMentorStudentDetail(mentorId: string, studentId: string, teamId: string) {
  const supabase = await createAdminClient();

  // 1. Validate Assignment FIRST
  const { data: assignment, error } = await supabase
    .from("mentor_assignments")
    .select("id")
    .eq("mentor_id", mentorId)
    .eq("student_id", studentId)
    .eq("team_id", teamId)
    .single();

  if (error || !assignment) {
    throw new Error("UNAUTHORIZED: Student not assigned to this mentor.");
  }

  // 2. Fetch Student Profile Basics
  const { data: user } = await supabase
    .from("users")
    .select("email, name")
    .eq("id", studentId)
    .single();

  // 3. We can leverage existing services if we needed, but keeping it direct is safer for specific mentor views.
  // We need their skill history, recent scores, and progress.
  
  const { data: skills } = await supabase.from('skills').select('*');
  const { data: history = [] } = await supabase.from('skill_history').select('*').eq('user_id', studentId);
  const { data: recentScores = [] } = await supabase
    .from('skill_scores')
    .select(`raw_score, normalized_score, recorded_at, skills(name), chapters(name)`)
    .eq('user_id', studentId)
    .order('recorded_at', { ascending: false })
    .limit(10);

  const { data: mentorReviews = [] } = await supabase
    .from('mentor_reviews')
    .select(`
      id, status_decision, feedback_text, reviewed_at,
      project_submissions(projects(chapters(name))),
      reflection_submissions(reflections(chapters(name)))
    `)
    .eq('student_id', studentId)
    .order('reviewed_at', { ascending: false })
    .limit(10);

  const skillProfiles = skills?.map(skill => {
    const hist = history?.find(h => h.skill_id === skill.id);
    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      cumulative: hist?.cumulative_score || 0,
      trend: hist?.trend_indicator || 0.0
    };
  }) || [];

  return {
    student: { id: studentId, email: user?.email || "Unknown" },
    skillProfiles,
    recentScores,
    mentorReviews,
  };
}

export async function getPendingProjectSubmission(submissionId: string, mentorId: string, teamId: string) {
  const supabase = await createAdminClient();
  
  const { data: submission, error } = await supabase
    .from("project_submissions")
    .select(`
      id, user_id, content_text, media_urls, status, submitted_at,
      projects(id, type, instructions, chapters(id, name, subject_id))
    `)
    .eq("id", submissionId)
    .eq("team_id", teamId)
    .single();

  if (error || !submission) throw new Error("Submission not found.");

  // Validate Assignment
  const { data: assignment } = await supabase
    .from("mentor_assignments")
    .select("id")
    .eq("mentor_id", mentorId)
    .eq("student_id", submission.user_id)
    .eq("team_id", teamId)
    .single();

  if (!assignment) throw new Error("UNAUTHORIZED: Student not assigned to you.");

  const { data: user } = await supabase.from("users").select("email, name").eq("id", submission.user_id).single();

  return { submission, student: { id: submission.user_id, email: user?.email || "Unknown" } };
}

export async function getPendingReflectionSubmission(submissionId: string, mentorId: string, teamId: string) {
  const supabase = await createAdminClient();
  
  const { data: submission, error } = await supabase
    .from("reflection_submissions")
    .select(`
      id, user_id, content_text, audio_url, status, submitted_at,
      reflections(id, prompt, chapters(id, name, subject_id))
    `)
    .eq("id", submissionId)
    .eq("team_id", teamId)
    .single();

  if (error || !submission) throw new Error("Submission not found.");

  // Validate Assignment
  const { data: assignment } = await supabase
    .from("mentor_assignments")
    .select("id")
    .eq("mentor_id", mentorId)
    .eq("student_id", submission.user_id)
    .eq("team_id", teamId)
    .single();

  if (!assignment) throw new Error("UNAUTHORIZED: Student not assigned to you.");

  const { data: user } = await supabase.from("users").select("email, name").eq("id", submission.user_id).single();

  return { submission, student: { id: submission.user_id, email: user?.email || "Unknown" } };
}
