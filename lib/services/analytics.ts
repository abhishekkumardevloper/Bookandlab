import { createAdminClient } from "@/lib/db/supabase";

/**
 * ANALYTICS CALCULATION ENGINE
 * All metrics calculated dynamically from source tables.
 * No static metrics stored.
 */

// ============================================
// ADMIN ANALYTICS
// ============================================

export async function getAdminAnalytics(teamId: string) {
  const supabase = await createAdminClient();

  // Team users
  const { data: teamUsers } = await supabase
    .from("user_roles")
    .select("user_id, roles(name)")
    .eq("team_id", teamId);

  const studentIds = (teamUsers || []).filter((u: any) => u.roles?.name === "STUDENT").map((u: any) => u.user_id);
  const mentorIds = (teamUsers || []).filter((u: any) => u.roles?.name === "MENTOR").map((u: any) => u.user_id);

  // Chapter completion rate
  const { count: totalChapters } = await supabase.from("chapters").select("id", { count: "exact" }).eq("status", "ACTIVE");
  let completionRate = 0;
  let completedByStudents: any[] = [];
  if (studentIds.length > 0) {
    const { data: progress } = await supabase
      .from("chapter_progress")
      .select("user_id, chapter_id, status")
      .in("user_id", studentIds);

    completedByStudents = (progress || []).filter((p: any) => p.status === "COMPLETED");
    const maxPossible = studentIds.length * (totalChapters || 1);
    completionRate = maxPossible > 0 ? Math.round((completedByStudents.length / maxPossible) * 100) : 0;
  }

  // Subject engagement (chapters completed per subject)
  const { data: chapters } = await supabase.from("chapters").select("id, subject_id, subjects(name)").eq("status", "ACTIVE");
  const subjectEngagement: Record<string, { name: string; completed: number; total: number }> = {};
  (chapters || []).forEach((ch: any) => {
    const subName = ch.subjects?.name || "Unknown";
    if (!subjectEngagement[ch.subject_id]) {
      subjectEngagement[ch.subject_id] = { name: subName, completed: 0, total: 0 };
    }
    subjectEngagement[ch.subject_id].total++;
    const completed = completedByStudents.filter((p: any) => p.chapter_id === ch.id).length;
    subjectEngagement[ch.subject_id].completed += completed;
  });

  // Skill growth averages
  const { data: skills } = await supabase.from("skills").select("id, name");
  const skillAverages: { name: string; avg: number }[] = [];
  if (skills && studentIds.length > 0) {
    for (const skill of skills) {
      const { data: histories } = await supabase
        .from("skill_history")
        .select("cumulative_score")
        .eq("skill_id", skill.id)
        .in("user_id", studentIds);
      const scores = (histories || []).map((h: any) => h.cumulative_score);
      const avg = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
      skillAverages.push({ name: skill.name, avg });
    }
  }

  // Mentor performance (reviews count, avg review time is not tracked so use count)
  const mentorPerformance: { id: string; reviewCount: number }[] = [];
  if (mentorIds.length > 0) {
    const { data: reviews } = await supabase
      .from("mentor_reviews")
      .select("mentor_id")
      .eq("team_id", teamId);
    mentorIds.forEach((mid: string) => {
      const count = (reviews || []).filter((r: any) => r.mentor_id === mid).length;
      mentorPerformance.push({ id: mid, reviewCount: count });
    });
  }

  // Submissions by status
  const { data: allSubs } = await supabase
    .from("project_submissions")
    .select("status")
    .eq("team_id", teamId);
  const submissionStats = {
    total: (allSubs || []).length,
    pending: (allSubs || []).filter((s: any) => s.status === "PENDING").length,
    approved: (allSubs || []).filter((s: any) => s.status === "APPROVED").length,
    needsRevision: (allSubs || []).filter((s: any) => s.status === "NEEDS_REVISION").length,
  };

  return {
    studentCount: studentIds.length,
    mentorCount: mentorIds.length,
    totalActiveChapters: totalChapters || 0,
    completionRate,
    subjectEngagement: Object.values(subjectEngagement),
    skillAverages,
    mentorPerformance,
    submissionStats,
  };
}

// ============================================
// MENTOR ANALYTICS
// ============================================

export async function getMentorAnalytics(mentorId: string, teamId: string) {
  const supabase = await createAdminClient();

  const { data: assignments } = await supabase
    .from("mentor_assignments")
    .select("student_id")
    .eq("mentor_id", mentorId)
    .eq("team_id", teamId);
  const studentIds = (assignments || []).map((a: any) => a.student_id);
  if (studentIds.length === 0) return { studentIds: [], skillTrends: [], weakestSkills: [], improvementPatterns: [], reviewStats: { total: 0, approved: 0, needsRevision: 0 } };

  // Skill trends per student
  const { data: skills } = await supabase.from("skills").select("id, name");
  const skillTrends: { name: string; avg: number; min: number; max: number; weakCount: number }[] = [];

  if (skills) {
    for (const skill of skills) {
      const { data: histories } = await supabase
        .from("skill_history")
        .select("cumulative_score, trend_indicator")
        .eq("skill_id", skill.id)
        .in("user_id", studentIds);
      const scores = (histories || []).map((h: any) => h.cumulative_score);
      const avg = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
      const min = scores.length > 0 ? Math.min(...scores) : 0;
      const max = scores.length > 0 ? Math.max(...scores) : 0;
      const weakCount = scores.filter((s: number) => s < 30).length;
      skillTrends.push({ name: skill.name, avg, min, max, weakCount });
    }
  }

  // Weakest skills (sorted by avg ascending)
  const weakestSkills = [...skillTrends].sort((a, b) => a.avg - b.avg).slice(0, 3);

  // Review stats
  const { data: reviews } = await supabase
    .from("mentor_reviews")
    .select("status_decision, reviewed_at")
    .eq("mentor_id", mentorId)
    .eq("team_id", teamId);
  const reviewStats = {
    total: (reviews || []).length,
    approved: (reviews || []).filter((r: any) => r.status_decision === "APPROVED").length,
    needsRevision: (reviews || []).filter((r: any) => r.status_decision === "NEEDS_REVISION").length,
  };

  // Improvement patterns (recent rubric scores)
  const { data: recentScores } = await supabase
    .from("skill_scores")
    .select("normalized_score, recorded_at, skills(name), chapters(name)")
    .in("user_id", studentIds)
    .order("recorded_at", { ascending: false })
    .limit(20);

  return {
    studentIds,
    skillTrends,
    weakestSkills,
    improvementPatterns: recentScores || [],
    reviewStats,
  };
}

// ============================================
// STUDENT ANALYTICS
// ============================================

export async function getStudentAnalytics(userId: string) {
  const supabase = await createAdminClient();

  // Chapter progress
  const { data: progress } = await supabase
    .from("chapter_progress")
    .select("chapter_id, status, started_at, completed_at, chapters(name, subjects(name))")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  const completed = (progress || []).filter((p: any) => p.status === "COMPLETED");
  const inProgress = (progress || []).filter((p: any) => p.status === "IN_PROGRESS");
  const totalActive = (progress || []).length;

  // Skill growth
  const { data: skills } = await supabase.from("skills").select("id, name");
  const skillGrowth: { name: string; current: number; trend: number }[] = [];
  if (skills) {
    for (const skill of skills) {
      const { data: hist } = await supabase
        .from("skill_history")
        .select("cumulative_score, trend_indicator")
        .eq("skill_id", skill.id)
        .eq("user_id", userId)
        .single();
      skillGrowth.push({
        name: skill.name,
        current: hist?.cumulative_score || 0,
        trend: hist?.trend_indicator || 0,
      });
    }
  }

  // Recent skill scores (timeline)
  const { data: recentScores } = await supabase
    .from("skill_scores")
    .select("raw_score, normalized_score, recorded_at, skills(name), chapters(name)")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })
    .limit(15);

  // Review feedback
  const { data: reviews } = await supabase
    .from("mentor_reviews")
    .select("status_decision, feedback_text, reviewed_at")
    .eq("student_id", userId)
    .order("reviewed_at", { ascending: false })
    .limit(5);

  // Submissions
  const { data: submissions } = await supabase
    .from("project_submissions")
    .select("status")
    .eq("user_id", userId);
  const submissionStats = {
    total: (submissions || []).length,
    approved: (submissions || []).filter((s: any) => s.status === "APPROVED").length,
    pending: (submissions || []).filter((s: any) => s.status === "PENDING").length,
  };

  return {
    chapterStats: { completed: completed.length, inProgress: inProgress.length, total: totalActive },
    chapterTimeline: progress || [],
    skillGrowth,
    recentScores: recentScores || [],
    recentReviews: reviews || [],
    submissionStats,
  };
}
