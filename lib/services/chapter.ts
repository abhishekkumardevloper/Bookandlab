import { createAdminClient } from "@/lib/db/supabase";

export async function getChapterOverview(chapterId: string, userId: string) {
  const supabase = await createAdminClient();

  // Fetch chapter basics
  const { data: chapter } = await supabase
    .from('chapters')
    .select(`
      id, name, description, why_it_matters, outcomes, estimated_time,
      subjects(id, name)
    `)
    .eq('id', chapterId)
    .eq('status', 'ACTIVE')
    .single();

  if (!chapter) return null;

  // Fetch steps
  const { data: steps = [] } = await supabase
    .from('chapter_steps')
    .select('*')
    .eq('chapter_id', chapterId)
    .order('step_number');

  // Fetch progress
  const { data: allStepProgress = [] } = await supabase
    .from('step_progress')
    .select('*')
    .eq('user_id', userId)
    .in('step_id', (steps || []).map(s => s.id));

  // Sequence Lock Logic: A step is unlocked IF the previous step is COMPLETED.
  // Step 1 is always unlocked.
  let isPreviousCompleted = true; // For step 1
  
  const enhancedSteps = (steps || []).map((step, index) => {
    const progressRecord = (allStepProgress || []).find(p => p.step_id === step.id);
    const status = progressRecord?.status || 'LOCKED';
    
    // Determine if user is allowed to access THIS step
    const isUnlocked = isPreviousCompleted || status === 'COMPLETED' || status === 'IN_PROGRESS';
    
    // Set for the NEXT iteration
    isPreviousCompleted = status === 'COMPLETED';

    return {
      ...step,
      progress: progressRecord,
      derivedStatus: !isUnlocked ? 'LOCKED' : (status === 'LOCKED' ? 'IN_PROGRESS' : status),
      isUnlocked
    };
  });

  // Fetch phase 4 logic: Project and Reflection specific configurations
  const { data: project } = await supabase.from("projects").select("*").eq("chapter_id", chapterId).single();
  const { data: reflection } = await supabase.from("reflections").select("*").eq("chapter_id", chapterId).single();

  let projectSubmission = null;
  if (project) {
    const { data: ps } = await supabase
      .from("project_submissions")
      .select("*")
      .eq("project_id", project.id)
      .eq("user_id", userId)
      .single();
    if (ps) projectSubmission = ps;
  }

  let reflectionSubmission = null;
  if (reflection) {
    const { data: rs } = await supabase
      .from("reflection_submissions")
      .select("*")
      .eq("reflection_id", reflection.id)
      .eq("user_id", userId)
      .single();
    if (rs) reflectionSubmission = rs;
  }

  return {
    chapter,
    steps: enhancedSteps,
    project,
    projectSubmission,
    reflection,
    reflectionSubmission
  };
}
