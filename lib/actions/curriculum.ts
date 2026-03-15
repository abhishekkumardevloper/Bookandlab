"use server";

import { createProtectedAction } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { revalidatePath } from "next/cache";

/** Create a Subject */
export const createSubjectAction = createProtectedAction(
  ["ADMIN"],
  async (user, formData: FormData) => {
    const name = formData.get("name") as string;
    const classLevel = formData.get("classLevel") as string;
    const description = formData.get("description") as string;
    if (!name || !classLevel) throw new Error("Name and class level are required.");

    const supabase = await createAdminClient();
    const { error } = await supabase.from("subjects").insert({ name, class_level: classLevel, description: description || "" });
    if (error) throw new Error("Failed to create subject: " + error.message);

    await supabase.from("audit_logs").insert({ team_id: user.team_id, actor_id: user.id, action_type: "SUBJECT_CREATED", details: { name, classLevel } });
    revalidatePath("/admin/subjects");
    return { success: true };
  }
);

/** Create a Unit */
export const createUnitAction = createProtectedAction(
  ["ADMIN"],
  async (user, formData: FormData) => {
    const name = formData.get("name") as string;
    const subjectId = formData.get("subjectId") as string;
    const sequenceOrder = parseInt(formData.get("sequenceOrder") as string || "1");
    if (!name || !subjectId) throw new Error("Name and subject are required.");

    const supabase = await createAdminClient();
    const { error } = await supabase.from("units").insert({ name, subject_id: subjectId, sequence_order: sequenceOrder });
    if (error) throw new Error("Failed to create unit: " + error.message);

    await supabase.from("audit_logs").insert({ team_id: user.team_id, actor_id: user.id, action_type: "UNIT_CREATED", details: { name, subjectId } });
    revalidatePath("/admin/units");
    return { success: true };
  }
);

/** Create a Chapter */
export const createChapterAction = createProtectedAction(
  ["ADMIN"],
  async (user, formData: FormData) => {
    const name = formData.get("name") as string;
    const subjectId = formData.get("subjectId") as string;
    const unitId = formData.get("unitId") as string || null;
    const description = formData.get("description") as string || "";
    const whyItMatters = formData.get("whyItMatters") as string || "";
    const estimatedTime = parseInt(formData.get("estimatedTime") as string || "30");
    const sequenceOrder = parseInt(formData.get("sequenceOrder") as string || "1");
    if (!name || !subjectId) throw new Error("Name and subject are required.");

    const supabase = await createAdminClient();
    const { error } = await supabase.from("chapters").insert({
      name, subject_id: subjectId, unit_id: unitId || null,
      description, why_it_matters: whyItMatters, estimated_time: estimatedTime,
      sequence_order: sequenceOrder, status: "DRAFT"
    });
    if (error) throw new Error("Failed to create chapter: " + error.message);

    await supabase.from("audit_logs").insert({ team_id: user.team_id, actor_id: user.id, action_type: "CHAPTER_CREATED", details: { name, subjectId } });
    revalidatePath("/admin/chapters");
    return { success: true };
  }
);

/** Update Chapter Step Content */
export const updateChapterStepAction = createProtectedAction(
  ["ADMIN"],
  async (user, formData: FormData) => {
    const stepId = formData.get("stepId") as string;
    const contentReference = formData.get("contentReference") as string;
    if (!stepId) throw new Error("Step ID is required.");

    const supabase = await createAdminClient();
    const { error } = await supabase.from("chapter_steps")
      .update({ content_reference: contentReference })
      .eq("id", stepId);
    if (error) throw new Error("Failed to update step: " + error.message);

    revalidatePath("/admin/chapters");
    return { success: true };
  }
);

/** Delete Subject */
export const deleteSubjectAction = createProtectedAction(
  ["ADMIN"],
  async (user, formData: FormData) => {
    const subjectId = formData.get("subjectId") as string;
    if (!subjectId) throw new Error("Subject ID required.");
    const supabase = await createAdminClient();
    await supabase.from("subjects").delete().eq("id", subjectId);
    await supabase.from("audit_logs").insert({ team_id: user.team_id, actor_id: user.id, action_type: "SUBJECT_DELETED", target_id: subjectId });
    revalidatePath("/admin/subjects");
    return { success: true };
  }
);

/** Delete Unit */
export const deleteUnitAction = createProtectedAction(
  ["ADMIN"],
  async (user, formData: FormData) => {
    const unitId = formData.get("unitId") as string;
    if (!unitId) throw new Error("Unit ID required.");
    const supabase = await createAdminClient();
    await supabase.from("units").delete().eq("id", unitId);
    await supabase.from("audit_logs").insert({ team_id: user.team_id, actor_id: user.id, action_type: "UNIT_DELETED", target_id: unitId });
    revalidatePath("/admin/units");
    return { success: true };
  }
);

/** Delete Chapter */
export const deleteChapterAction = createProtectedAction(
  ["ADMIN"],
  async (user, formData: FormData) => {
    const chapterId = formData.get("chapterId") as string;
    if (!chapterId) throw new Error("Chapter ID required.");
    const supabase = await createAdminClient();
    await supabase.from("chapters").delete().eq("id", chapterId);
    await supabase.from("audit_logs").insert({ team_id: user.team_id, actor_id: user.id, action_type: "CHAPTER_DELETED", target_id: chapterId });
    revalidatePath("/admin/chapters");
    return { success: true };
  }
);
