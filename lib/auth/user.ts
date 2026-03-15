import { stackServerApp } from "@/lib/auth/stack";
import { createAdminClient } from "@/lib/db/supabase";

export async function getDbUser() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) return null;

  // Multi-Tenancy extraction: users MUST have an active team context
  const selectedTeam = stackUser.selectedTeam;
  const teamId = selectedTeam?.id || "DEFAULT_TENANT_ID"; 
  // Note: If teams are strictly enforced in Stack Auth, selectedTeam will exist. 
  // Otherwise we fallback to a default isolation boundary.

  const supabase = await createAdminClient();

  // Upsert user securely bypassing RLS (using Admin Client)
  // StackAuth is source of truth, ensure it's synced.
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', stackUser.id)
    .single();

  if (existingUser) {
    // 1. Soft-disable security check
    if (existingUser.is_active === false) {
      console.warn("Soft-disabled user attempted access:", stackUser.id);
      return null; // Force null to trigger requireAuth failure
    }

    // Check if details or team context changed
    if (existingUser.email !== stackUser.primaryEmail || existingUser.name !== stackUser.displayName || existingUser.team_id !== teamId) {
      const { data: updatedUser } = await supabase
        .from('users')
        .update({
          email: stackUser.primaryEmail || "",
          name: stackUser.displayName || "",
          team_id: teamId,
          updated_at: new Date().toISOString()
        })
        .eq('id', stackUser.id)
        .select()
        .single();
      
      // Ensure role exists for the new team if team changed
      await ensureUserRole(supabase, stackUser.id, teamId);
        
      return updatedUser;
    }
    
    // Ensure role exists for the current team (safety fallback)
    await ensureUserRole(supabase, stackUser.id, teamId);
    
    return existingUser;
  }

  // Create new user (Role defaults to STUDENT in Postgres via user_roles)
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      id: stackUser.id,
      email: stackUser.primaryEmail || "",
      name: stackUser.displayName || "",
      team_id: teamId
    })
    .select()
    .single();
    
  if (insertError) {
    console.error("Critical Postgres insertion error during user sync:", insertError);
    throw new Error(`DB Sync Error: ${insertError.message}`);
  }
  
  await ensureUserRole(supabase, stackUser.id, teamId);
    
  return newUser;
}

/**
 * Ensures the user has a linked role configuration for their specific team context.
 * Role assignments default strictly to "STUDENT" upon first login per team.
 */
async function ensureUserRole(supabase: any, userId: string, teamId: string) {
  // First check if user_role mapping exists
  const { data: existingMapping } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', userId)
    .eq('team_id', teamId)
    .single();
    
  if (existingMapping) return; // Already safely mapped
  
  // Resolve base STUDENT role ID
  const { data: baseRole } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'STUDENT')
    .single();
    
  if (!baseRole) {
    console.error("Critical System Integrity Error: Failed to find base STUDENT role. Did you run the multi_tenancy migration?");
    return;
  }
  
  // Create mapping
  await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      team_id: teamId,
      role_id: baseRole.id
    });
}
