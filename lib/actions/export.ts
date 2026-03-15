"use server";

import { getAdminAnalytics } from "@/lib/services/analytics";
import { requireRole } from "@/lib/rbac/roles";

export async function exportAnalyticsCSVAction() {
  const user = await requireRole(["ADMIN"]);
  if (!user) throw new Error("Unauthorized");

  const analytics = await getAdminAnalytics(user.team_id);

  // 1. Student Completion CSV
  let csvContent = "Subject Name,Completed Chapters,Total Student-Chapters,Completion %\n";
  analytics.subjectEngagement.forEach((sub: any) => {
    const maxPossible = sub.total * analytics.studentCount;
    const pct = maxPossible > 0 ? Math.round((sub.completed / maxPossible) * 100) : 0;
    csvContent += `"${sub.name}",${sub.completed},${maxPossible},${pct}%\n`;
  });

  csvContent += "\n\nSkill,Average Score\n";
  analytics.skillAverages.forEach((skill: any) => {
    csvContent += `"${skill.name}",${skill.avg}\n`;
  });

  csvContent += "\n\nMentor ID,Total Reviews\n";
  analytics.mentorPerformance.forEach((mentor: any) => {
    csvContent += `"${mentor.id}",${mentor.reviewCount}\n`;
  });

  // Returning the CSV content as a string
  // The client will handle creating the blob and downloading
  return { 
    success: true, 
    data: csvContent, 
    filename: `bookandlab_analytics_${new Date().toISOString().split('T')[0]}.csv` 
  };
}
