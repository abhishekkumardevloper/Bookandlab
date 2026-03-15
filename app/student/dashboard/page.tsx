import { getDbUser } from "@/lib/auth/user";
import { getStudentDashboardData } from "@/lib/services/student";
import { DashboardClient } from "@/components/student/DashboardClient";

export default async function StudentDashboard() {
  const user = await getDbUser();
  if (!user) return null;

  const data = await getStudentDashboardData(user.id);

  return <DashboardClient user={user} data={data} />;
}
