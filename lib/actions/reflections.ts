"use server";

import { createProtectedAction } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { revalidatePath } from "next/cache";

export const submitReflectionAction = createProtectedAction(
  ["STUDENT"],
  async (user, formData: FormData) => {
    const reflectionId = formData.get("reflectionId") as string;
    const contentText = formData.get("contentText") as string;

    if (!reflectionId) {
      throw new Error("Reflection ID is required.");
    }
    if (!contentText || contentText.trim().length < 10) {
      throw new Error("Reflection must be at least 10 characters long.");
    }

    const supabase = await createAdminClient();

    // 1. Verify Reflection exists
    const { data: reflection, error: reflectionError } = await supabase
      .from("reflections")
      .select("id, chapter_id")
      .eq("id", reflectionId)
      .single();

    if (reflectionError || !reflection) {
      throw new Error("Invalid reflection reference.");
    }

    // 2. Check existing status
    const { data: existing } = await supabase
      .from("reflection_submissions")
      .select("status")
      .eq("reflection_id", reflectionId)
      .eq("user_id", user.id)
      .single();

    if (existing && existing.status === "APPROVED") {
      throw new Error("This reflection has already been approved and is immutable.");
    }

    // 3. Upsert Securely
    const { error: upsertError } = await supabase
      .from("reflection_submissions")
      .upsert(
        {
          reflection_id: reflectionId,
          user_id: user.id,
          team_id: user.team_id,
          content_text: contentText.trim(),
          status: "PENDING",
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id, reflection_id' }
      );

    if (upsertError) {
      console.error("[submitReflectionAction] Upsert Error:", upsertError);
      throw new Error("Failed to save reflection.");
    }

    // 4. Mark Step 6 (Reflection) as COMPLETED
    const { data: step6 } = await supabase
      .from("chapter_steps")
      .select("id")
      .eq("chapter_id", reflection.chapter_id)
      .eq("step_number", 6)
      .single();

    if (step6) {
      await supabase.from("step_progress").upsert({
        user_id: user.id,
        step_id: step6.id,
        status: "COMPLETED",
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, step_id' });
    }

    // Optional: We can mark Chapter Progress as 'PENDING_REVIEW' here if we had that state, 
    // but the system relies on Mentor approval to mark the Chapter COMPLETED.

    revalidatePath(`/student/chapters/${reflection.chapter_id}`);
    revalidatePath(`/student/dashboard`);

    return { success: true, message: "Reflection submitted successfully pending mentor review." };
  }
);
