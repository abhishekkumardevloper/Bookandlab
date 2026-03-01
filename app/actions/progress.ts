"use server"

import { requireActiveSubscription } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { revalidatePath } from "next/cache";

export async function submitStepProgress(stepId: string, data: any, markCompleted: boolean) {
  const { user } = await requireActiveSubscription();
  const supabase = await createAdminClient();

  // Validate step exists & get chapter context
  const { data: step } = await supabase
    .from('chapter_steps')
    .select('id, chapter_id, step_number')
    .eq('id', stepId)
    .single();

  if (!step) throw new Error("Step not found");

  // Upsert progress
  const status = markCompleted ? 'COMPLETED' : 'IN_PROGRESS';
  
  const { error } = await supabase
    .from('step_progress')
    .upsert({
      user_id: user.id,
      step_id: stepId,
      status: status,
      data: data,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, step_id' });

  if (error) throw new Error("Failed to save progress");

  // Ensure Chapter Progress is at least IN_PROGRESS
  await supabase
    .from('chapter_progress')
    .upsert({
      user_id: user.id,
      chapter_id: step.chapter_id,
      status: 'IN_PROGRESS',
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, chapter_id' });

  // If this was the final step (Step 6) and completed, chapter is PENDING REVIEW
  // (We handle that in Phase 3 or a Mentor Review trigger)

  revalidatePath(`/student/chapters/${step.chapter_id}`);
  return { success: true };
}
