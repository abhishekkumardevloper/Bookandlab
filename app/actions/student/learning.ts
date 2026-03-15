"use server";

import { requireRole } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { revalidatePath } from "next/cache";

/**
 * Ensures a user has completed the previous step before starting or completing the current one.
 * Step 1 is always accessible if the chapter is unlocked.
 */
async function validateStepSequence(
  supabase: any,
  userId: string,
  chapterId: string,
  stepNumber: number,
) {
  // If chapter is locked, deny access.
  const { data: chapterProg } = await supabase
    .from("chapter_progress")
    .select("status")
    .eq("user_id", userId)
    .eq("chapter_id", chapterId)
    .single();

  if (!chapterProg || chapterProg.status === "LOCKED") {
    throw new Error("Chapter is locked or unavailable.");
  }

  if (stepNumber === 1) return true;

  // Find the step ID of the previous step in this chapter
  const { data: prevStep } = await supabase
    .from("chapter_steps")
    .select("id")
    .eq("chapter_id", chapterId)
    .eq("step_number", stepNumber - 1)
    .single();

  if (!prevStep) throw new Error("Previous step logic error.");

  const { data: prevProg } = await supabase
    .from("step_progress")
    .select("status")
    .eq("user_id", userId)
    .eq("step_id", prevStep.id)
    .single();

  if (!prevProg || prevProg.status !== "COMPLETED") {
    throw new Error(`You must complete Step ${stepNumber - 1} first.`);
  }

  return true;
}

export async function startChapterStep(chapterId: string, stepNumber: number) {
  const user = await requireRole(["STUDENT"]);
  const supabase = await createAdminClient();

  await validateStepSequence(supabase, user.id, chapterId, stepNumber);

  // Get current step ID
  const { data: currentStep } = await supabase
    .from("chapter_steps")
    .select("id")
    .eq("chapter_id", chapterId)
    .eq("step_number", stepNumber)
    .single();

  if (!currentStep) throw new Error("Step not found");

  // Mark step as IN_PROGRESS
  const { error } = await supabase.from("step_progress").upsert(
    {
      user_id: user.id,
      step_id: currentStep.id,
      status: "IN_PROGRESS",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id, step_id" },
  );

  if (error) throw new Error("Failed to start step: " + error.message);

  revalidatePath(`/student/chapters/${chapterId}`);
  return { success: true };
}

export async function completeInteractiveStep(
  chapterId: string,
  stepNumber: number,
) {
  const user = await requireRole(["STUDENT"]);
  const supabase = await createAdminClient();

  await validateStepSequence(supabase, user.id, chapterId, stepNumber);

  // Get current step ID
  const { data: currentStep } = await supabase
    .from("chapter_steps")
    .select("id")
    .eq("chapter_id", chapterId)
    .eq("step_number", stepNumber)
    .single();

  if (!currentStep) throw new Error("Step not found");

  const { error } = await supabase.from("step_progress").upsert(
    {
      user_id: user.id,
      step_id: currentStep.id,
      status: "COMPLETED",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id, step_id" },
  );

  if (error) throw new Error("Failed to complete step: " + error.message);

  // If this was an early step, we just unlock the next step.
  // We don't mark the whole chapter as completed until step 6 (reflection).

  revalidatePath(`/student/chapters/${chapterId}`);
  return { success: true };
}

export async function submitProject(
  chapterId: string,
  projectId: string,
  contentText: string,
  mediaUrls: string[],
) {
  const user = await requireRole(["STUDENT"]);
  const supabase = await createAdminClient();

  // Project is always Step 5.
  await validateStepSequence(supabase, user.id, chapterId, 5);

  const { error } = await supabase.from("project_submissions").upsert(
    {
      user_id: user.id,
      team_id: user.team_id,
      project_id: projectId,
      content_text: contentText,
      media_urls: mediaUrls,
      status: "PENDING", // Needs Mentor Review
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id, project_id" },
  );

  if (error) throw new Error("Failed to submit project: " + error.message);

  // Mark step 5 as completed automatically upon submission
  const { data: step5 } = await supabase
    .from("chapter_steps")
    .select("id")
    .eq("chapter_id", chapterId)
    .eq("step_number", 5)
    .single();

  if (step5) {
    await supabase.from("step_progress").upsert(
      {
        user_id: user.id,
        step_id: step5.id,
        status: "COMPLETED",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id, step_id" },
    );
  }

  revalidatePath(`/student/chapters/${chapterId}`);
  return { success: true };
}

export async function submitReflection(
  chapterId: string,
  reflectionId: string,
  contentText: string,
) {
  const user = await requireRole(["STUDENT"]);
  const supabase = await createAdminClient();

  // Reflection is always Step 6.
  await validateStepSequence(supabase, user.id, chapterId, 6);

  const { error } = await supabase.from("reflection_submissions").upsert(
    {
      user_id: user.id,
      team_id: user.team_id,
      reflection_id: reflectionId,
      content_text: contentText,
      status: "PENDING",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id, reflection_id" },
  );

  if (error) throw new Error("Failed to submit reflection: " + error.message);

  // Mark step 6 as completed
  const { data: step6 } = await supabase
    .from("chapter_steps")
    .select("id")
    .eq("chapter_id", chapterId)
    .eq("step_number", 6)
    .single();

  if (step6) {
    await supabase.from("step_progress").upsert(
      {
        user_id: user.id,
        step_id: step6.id,
        status: "COMPLETED",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id, step_id" },
    );
  }

  // Entire chapter is now practically finished from the student's POV, awaiting review
  await supabase.from("chapter_progress").upsert(
    {
      user_id: user.id,
      chapter_id: chapterId,
      status: "COMPLETED", // Student done. Mentor handles next.
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id, chapter_id" },
  );

  // Auto-unlock next chapter?
  // Could find next chapter in sequence and set to IN_PROGRESS or LOCKED->AVAILABLE
  // Doing a simple unlock if sequence_order + 1 exists in the same subject:
  const { data: currentChapter } = await supabase
    .from("chapters")
    .select("subject_id, sequence_order")
    .eq("id", chapterId)
    .single();

  if (currentChapter) {
    const { data: nextChapter } = await supabase
      .from("chapters")
      .select("id")
      .eq("subject_id", currentChapter.subject_id)
      .eq("sequence_order", currentChapter.sequence_order + 1)
      .single();

    if (nextChapter) {
      await supabase.from("chapter_progress").upsert(
        {
          user_id: user.id,
          chapter_id: nextChapter.id,
          status: "IN_PROGRESS", // Unlocking it
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id, chapter_id" },
      );
    }
  }

  revalidatePath(`/student/chapters/${chapterId}`);
  revalidatePath(`/student/subjects`);
  return { success: true };
}
