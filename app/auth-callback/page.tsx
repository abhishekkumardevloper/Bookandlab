import { getDbUser } from "@/lib/auth/user";
import { getActiveRole } from "@/lib/rbac/roles";
import { redirectByRole } from "@/lib/auth/redirect";
import { redirect } from "next/navigation";

/**
 * Stack Auth Post-Login Callback
 * 
 * Enforces server-side reading of the authenticated user's role
 * and delegates routing logic to the central redirect controller.
 */
export default async function AuthCallbackPage() {
  let user = null;
  let activeRole = null;
  
  try {
    user = await getDbUser();
    if (user) {
      activeRole = await getActiveRole(user);
    }
  } catch (error) {
    console.error("Failed to sync Stack user to Database:", error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-4 text-center">
        <div>
           <h1 className="text-2xl font-bold mb-2 text-rose-600">Database Sync Error</h1>
           <p className="mb-4">We could not link your authentication session with the database profile.</p>
           <pre className="text-xs bg-slate-200 p-2 rounded text-left max-w-lg mb-4 overflow-auto">
             {String(error)}
           </pre>
           <a href="/handler/sign-out" className="text-indigo-600 font-bold hover:underline">Sign out and try again</a>
        </div>
      </div>
    );
  }

  if (user && activeRole) {
    // Controller handles the actual push to the correct dashboard
    redirectByRole(activeRole);
  }

  // Backup fallback if user resolution fails without throwing
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-4 text-center">
        <div>
           <h1 className="text-2xl font-bold mb-2">Login Session Invalid</h1>
           <p className="mb-4">We could not verify your active login session.</p>
           <a href="/handler/sign-out" className="px-4 py-2 bg-indigo-600 text-white rounded font-bold">Clear Session</a>
        </div>
      </div>
  );
}
