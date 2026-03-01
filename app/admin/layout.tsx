import { requireRole } from "@/lib/rbac/roles";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireRole(["ADMIN"]);
  } catch {
    redirect("/403");
  }

  return <div className="min-h-screen bg-slate-900 text-slate-100">{children}</div>;
}
