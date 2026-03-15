"use server";

import { createProtectedAction } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { revalidatePath } from "next/cache";

/**
 * 1. Change User Role
 * A core governance function to dynamically switch users between STUDENT, MENTOR, and ADMIN
 */
export const changeUserRoleAction = createProtectedAction(
  ["ADMIN"],
  async (user, formData: FormData) => {
    const targetUserId = formData.get("userId") as string;
    const newRoleName = formData.get("newRole") as "STUDENT" | "MENTOR" | "ADMIN";

    if (!targetUserId || !newRoleName) {
      throw new Error("Missing required fields for role change.");
    }

    // Block Self-Demotion
    if (user.id === targetUserId && newRoleName !== "ADMIN") {
      throw new Error("SECURITY BLOCK: Admins cannot demote themselves. Ask another Admin to perform this action.");
    }

    const supabase = await createAdminClient();

    // Verify Target User is in the same Team isolating the attack surface
    const { data: targetMapping } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", targetUserId)
      .eq("team_id", user.team_id)
      .single();

    if (!targetMapping) {
      throw new Error("User does not exist in your active team.");
    }

    // Get ID of the new Role
    const { data: roleData } = await supabase
      .from("roles")
      .select("id")
      .eq("name", newRoleName)
      .single();

    if (!roleData) throw new Error("Invalid Role specified.");

    // Execute Mutation
    await supabase
      .from("user_roles")
      .update({ role_id: roleData.id, created_at: new Date().toISOString() })
      .eq("user_id", targetUserId)
      .eq("team_id", user.team_id);

    // Write to Audit Log
    await supabase
      .from("audit_logs")
      .insert({
        team_id: user.team_id,
        actor_id: user.id,
        action_type: "ROLE_CHANGE",
        target_id: targetUserId,
        details: { new_role: newRoleName }
      });

    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");
    return { success: true, message: `Role updated to ${newRoleName}` };
  }
);

/**
 * 2. Toggle User Status (Deactivation/Activation)
 * Provides soft-deletion to preserve learning histories but block active use.
 */
export const toggleUserStatusAction = createProtectedAction(
  ["ADMIN"],
  async (user, formData: FormData) => {
    const targetUserId = formData.get("userId") as string;
    const isActive = formData.get("isActive") === "true"; // Next state

    if (!targetUserId) throw new Error("Missing user identifier.");

    if (user.id === targetUserId) {
      throw new Error("SECURITY BLOCK: Admins cannot disable themselves.");
    }

    const supabase = await createAdminClient();

    // Verify Team Boundaries
    const { data: targetUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", targetUserId)
      .eq("team_id", user.team_id)
      .single();

    if (!targetUser) throw new Error("Target user not found in this team.");

    // Mutate
    await supabase
      .from("users")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", targetUserId);

    // Write to Audit Log
    await supabase
      .from("audit_logs")
      .insert({
        team_id: user.team_id,
        actor_id: user.id,
        action_type: isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
        target_id: targetUserId
      });

    revalidatePath("/admin/users");
    return { success: true, message: `User account is now ${isActive ? 'Active' : 'Deactivated'}.` };
  }
);

/**
 * 3. Assign Mentor to Student
 * Pairs a student with a mentor within the same team.
 */
export const assignMentorAction = createProtectedAction(
  ["ADMIN"],
  async (user, formData: FormData) => {
    const studentId = formData.get("studentId") as string;
    const mentorId = formData.get("mentorId") as string;

    if (!studentId || !mentorId) throw new Error("Missing assignment IDs");

    const supabase = await createAdminClient();

    // Verify Both exist in Team
    const { data: validPairs } = await supabase
      .from("user_roles")
      .select("user_id, role_id")
      .eq("team_id", user.team_id)
      .in("user_id", [studentId, mentorId]);

    if (!validPairs || validPairs.length !== 2) {
      throw new Error("One or both users do not exist in your active team.");
    }

    // Upsert the assignment
    const { error } = await supabase
      .from("mentor_assignments")
      .upsert({
        team_id: user.team_id,
        student_id: studentId,
        mentor_id: mentorId,
        assigned_by: user.id
      }, { onConflict: "team_id, student_id" });

    if (error) throw new Error("Failed to assign mentor.");

    await supabase.from("audit_logs").insert({
      team_id: user.team_id,
      actor_id: user.id,
      action_type: "MENTOR_ASSIGNED",
      target_id: studentId,
      details: { mentor_id: mentorId }
    });

    revalidatePath("/admin/assignments");
    return { success: true };
  }
);

/**
 * 4. Revoke Mentor Assignment
 */
export const revokeMentorAction = createProtectedAction(
  ["ADMIN"],
  async (user, formData: FormData | string) => {
    // Can accept string ID directly or FormData
    const assignmentId = typeof formData === 'string' ? formData : formData.get("assignmentId") as string;
    
    if (!assignmentId) throw new Error("Missing assignment ID");

    const supabase = await createAdminClient();

    // Verify ownership before delete
    const { data: assignment } = await supabase
      .from("mentor_assignments")
      .select("student_id")
      .eq("id", assignmentId)
      .eq("team_id", user.team_id)
      .single();

    if (!assignment) throw new Error("Assignment not found in your team.");

    await supabase.from("mentor_assignments").delete().eq("id", assignmentId);

    await supabase.from("audit_logs").insert({
      team_id: user.team_id,
      actor_id: user.id,
      action_type: "MENTOR_REVOKED",
      target_id: assignment.student_id
    });

    revalidatePath("/admin/assignments");
    return { success: true };
  }
);

/**
 * 5. Toggle Chapter Status (Curriculum Metadata)
 * Controls whether a chapter is DRAFT or ACTIVE globally.
 */
export const toggleChapterStatusAction = createProtectedAction(
  ["ADMIN"],
  async (user, formData: FormData) => {
    const chapterId = formData.get("chapterId") as string;
    const newStatus = formData.get("newStatus") as "DRAFT" | "ACTIVE";

    if (!chapterId || !["DRAFT", "ACTIVE"].includes(newStatus)) {
      throw new Error("Missing or invalid fields.");
    }

    const supabase = await createAdminClient();

    await supabase
      .from("chapters")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", chapterId);

    await supabase.from("audit_logs").insert({
      team_id: user.team_id,
      actor_id: user.id,
      action_type: "CHAPTER_STATUS_CHANGED",
      target_id: chapterId,
      details: { new_status: newStatus }
    });

    revalidatePath("/admin/curriculum");
    return { success: true };
  }
);

