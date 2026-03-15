import { getDbUser } from "@/lib/auth/user";
import { getStudentSkillDashboard } from "@/lib/services/skills_engine";
import { notFound } from "next/navigation";
import { SkillsClient } from "@/components/student/SkillsClient";

export default async function SkillDashboardPage() {
  const user = await getDbUser();
  if (!user) return null;

  const data = await getStudentSkillDashboard(user.id);
  if (!data) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <SkillsClient data={data} />
    </div>
  );
}
