"use server";

import { createProtectedAction } from "@/lib/rbac/roles";
import { createAdminClient } from "@/lib/db/supabase";
import { processMentorSkillEvaluation } from "@/lib/services/skills_engine";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/services/notifications";

export const submitMentorReviewAction = createProtectedAction(
  ["MENTOR"],
  async (user, formData: FormData) => {
    const studentId = formData.get("studentId") as string;
    const projectSubmissionId = formData.get("projectSubmissionId") as string | null;
    const reflectionSubmissionId = formData.get("reflectionSubmissionId") as string | null;
    const statusDecision = formData.get("statusDecision") as "APPROVED" | "NEEDS_REVISION";
    const feedbackText = formData.get("feedbackText") as string;
    const chapterId = formData.get("chapterId") as string;
    
    // Extract rubric parameters
    const conceptScore = parseInt(formData.get("conceptScore") as string || "0");
    const thinkingScore = parseInt(formData.get("thinkingScore") as string || "0");
    const applicationScore = parseInt(formData.get("applicationScore") as string || "0");
    const expressionScore = parseInt(formData.get("expressionScore") as string || "0");

    if (!studentId || !chapterId) {
      throw new Error("Student and Chapter context are required.");
    }
    if (!projectSubmissionId && !reflectionSubmissionId) {
      throw new Error("Must review a specific project or reflection submission.");
    }
    if (!statusDecision || !feedbackText) {
      throw new Error("Feedback and status decision are mandatory.");
    }

    const supabase = await createAdminClient();

    // 1. Validate the Mentor -> Student assignment AND Team scope
    const { data: assignment, error: assignmentError } = await supabase
      .from("mentor_assignments")
      .select("id")
      .eq("mentor_id", user.id)
      .eq("student_id", studentId)
      .eq("team_id", user.team_id)
      .single();

    if (assignmentError || !assignment) {
      console.warn(`[SECURITY] Mentor ${user.id} attempted to review unassigned or out-of-team student ${studentId}.`);
      throw new Error("You are not authorized to review this student.");
    }

    // 2. Insert the Review securely
    const { data: review, error: reviewError } = await supabase
      .from("mentor_reviews")
      .insert({
        mentor_id: user.id,
        student_id: studentId,
        team_id: user.team_id,
        status_decision: statusDecision,
        feedback_text: feedbackText,
        project_submission_id: projectSubmissionId || null,
        reflection_submission_id: reflectionSubmissionId || null,
      })
      .select("id")
      .single();

    if (reviewError || !review) {
      console.error("[submitMentorReview] Error:", reviewError);
      throw new Error("Failed to submit review.");
    }

    // 3. Insert Rubric Scores if it's an approval
    if (statusDecision === "APPROVED") {
      const rubrics = [
        { review_id: review.id, dimension: "Concept Clarity", score: conceptScore },
        { review_id: review.id, dimension: "Critical Thinking", score: thinkingScore },
        { review_id: review.id, dimension: "Application", score: applicationScore },
        { review_id: review.id, dimension: "Expression", score: expressionScore }
      ];
      await supabase.from("rubric_scores").insert(rubrics);

      // 4. Update the Submission Status
      if (projectSubmissionId) {
        await supabase.from("project_submissions")
          .update({ status: "APPROVED", updated_at: new Date().toISOString() })
          .eq("id", projectSubmissionId)
          .eq("user_id", studentId); // Extra check for ownership
      }
      if (reflectionSubmissionId) {
        await supabase.from("reflection_submissions")
          .update({ status: "APPROVED", updated_at: new Date().toISOString() })
          .eq("id", reflectionSubmissionId)
          .eq("user_id", studentId);
      }

      // 5. Trigger Skill Engine Delta Updates
      // Map the Rubric Dimensions to the 5 Core System Skills.
      // This is the core intelligence mapping logic matching the architectural spec.
      const skillEvals: any[] = [
        { skillName: "Understanding", rawScore: conceptScore },
        { skillName: "Thinking", rawScore: thinkingScore },
        { skillName: "Practical", rawScore: applicationScore },
        { skillName: "Communication", rawScore: expressionScore },
        { skillName: "Creativity", rawScore: Math.floor((applicationScore + expressionScore) / 2) } // Derived
      ];

      await processMentorSkillEvaluation(studentId, chapterId, user.id, skillEvals);

      // 6. FINALIZE CHAPTER PROGRESS: Safe auto-unlock logic
      // Only completing a chapter once Mentor approves.
      await supabase.from("chapter_progress")
        .upsert({
          user_id: studentId,
          chapter_id: chapterId,
          status: "COMPLETED",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, chapter_id' });

    } else {
      // 4b. Update the Submission Status to Needs Revision
      if (projectSubmissionId) {
        await supabase.from("project_submissions")
          .update({ status: "NEEDS_REVISION", updated_at: new Date().toISOString() })
          .eq("id", projectSubmissionId);
      }
      if (reflectionSubmissionId) {
        await supabase.from("reflection_submissions")
          .update({ status: "NEEDS_REVISION", updated_at: new Date().toISOString() })
          .eq("id", reflectionSubmissionId);
      }
    }

    // Notify student
    const reviewMsg = statusDecision === "APPROVED"
      ? "Your submission has been approved! Skills updated."
      : "Your submission needs revision. Check mentor feedback.";
    await createNotification(studentId, user.team_id, "REVIEW_COMPLETED", reviewMsg, { chapterId, statusDecision });

    revalidatePath(`/mentor/dashboard`);
    revalidatePath(`/mentor/student/${studentId}`);
    return { success: true, message: `Review submitted. Student status: ${statusDecision}` };
  }
);
