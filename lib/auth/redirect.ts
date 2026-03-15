import { redirect } from "next/navigation";
import { Role } from "@/lib/rbac/roles";

/**
 * Centralized Role Redirect Controller
 * 
 * Dictates to exactly which dashboard a specific user role should land 
 * immediately after login or if they hit the root '/' while authenticated.
 */
export function redirectByRole(role?: string | null): never {
  switch (role) {
    case "ADMIN":
      redirect("/admin/dashboard");
    case "MENTOR":
      redirect("/mentor/dashboard");
    case "STUDENT":
      redirect("/student/dashboard");
    default:
      // Safe fallback if role is missing or unrecognized but they are authenticated.
      // E.g., a completely new user getting created before role sync is done.
      redirect("/student/dashboard"); 
  }
}
