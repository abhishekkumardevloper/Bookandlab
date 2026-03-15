import { createAdminClient } from "@/lib/db/supabase";

export async function getStudentGamification(userId: string) {
  const supabase = await createAdminClient();
  const { data: stepProgs } = await supabase.from('step_progress').select('id').eq('user_id', userId).eq('status', 'COMPLETED');
  const { data: projProgs } = await supabase.from('project_submissions').select('id').eq('user_id', userId).eq('status', 'APPROVED');
  const { data: reflProgs } = await supabase.from('reflection_submissions').select('user_id').eq('user_id', userId).eq('status', 'APPROVED');

  const stepXP = (stepProgs?.length || 0) * 100;
  const projXP = (projProgs?.length || 0) * 500;
  const reflXP = (reflProgs?.length || 0) * 200;
  
  const totalXP = stepXP + projXP + reflXP;
  const level = Math.floor(totalXP / 1000) + 1;
  const xpIntoLevel = totalXP % 1000;
  const levelProgress = Math.round((xpIntoLevel / 1000) * 100);

  return {
    totalXP,
    level,
    levelProgress,
    xpNext: 1000 
  };
}

export async function getStudentDashboardData(userId: string) {
  const supabase = await createAdminClient();

  // 1. Fetch Subjects and total chapters
  const { data: subjects = [] } = await supabase
    .from('subjects')
    .select(`
      id,
      name,
      description,
      class_level
    `)
    .order('name');

  const { data: chapters = [] } = await supabase
    .from('chapters')
    .select('id, subject_id, name, sequence_order')
    .eq('status', 'ACTIVE');

  const { data: chapterProgress = [] } = await supabase
    .from('chapter_progress')
    .select('chapter_id, status')
    .eq('user_id', userId);

  // 2. Fetch "Resume Learning" state
  const { data: lastProgress } = await supabase
    .from('chapter_progress')
    .select(`
      chapter_id,
      status, 
      updated_at
    `)
    .eq('user_id', userId)
    .eq('status', 'IN_PROGRESS')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  let resumeChapter = null;
  let resumeStep = null;

  if (lastProgress) {
    const chapter = chapters?.find((c: any) => c.id === lastProgress.chapter_id);
    if (chapter) {
      resumeChapter = chapter;
      const { data: steps } = await supabase
        .from('chapter_steps')
        .select('id, step_number, type')
        .eq('chapter_id', chapter.id)
        .order('step_number', { ascending: true });

      if (steps && steps.length > 0) {
        const { data: stepProgress } = await supabase
          .from('step_progress')
          .select('step_id, status')
          .eq('user_id', userId);

        let nextStepNumber = 1;
        let nextStepId = steps[0].id;
        
        for (const step of steps) {
          const prog = stepProgress?.find((sp: any) => sp.step_id === step.id);
          if (!prog || prog.status !== 'COMPLETED') {
            nextStepNumber = step.step_number;
            nextStepId = step.id;
            break;
          }
        }
        resumeStep = { id: nextStepId, number: nextStepNumber };
      }
    }
  }

  // Formatting subject stats
  const formattedSubjects = subjects?.map((sub: any) => {
    const subChapters = chapters?.filter((c: any) => c.subject_id === sub.id) || [];
    const totalChaptersCount = subChapters.length;
    let completedChapters = 0;
    
    subChapters.forEach((sc: any) => {
      const prog = chapterProgress?.find((cp: any) => cp.chapter_id === sc.id);
      if (prog?.status === 'COMPLETED') completedChapters++;
    });

    const progressPct = totalChaptersCount === 0 ? 0 : Math.round((completedChapters / totalChaptersCount) * 100);

    return {
      ...sub,
      totalChapters: totalChaptersCount,
      completedChapters,
      progressPct
    };
  }) || [];

  const gamification = await getStudentGamification(userId);

  return {
    subjects: formattedSubjects,
    resumeState: lastProgress ? {
      chapter: resumeChapter,
      step: resumeStep
    } : null,
    gamification,
    skills: await (async () => {
      const { data: skillHistory } = await supabase
        .from('skill_history')
        .select('cumulative_score, skills(name)')
        .eq('user_id', userId);
      const map: Record<string, number> = {};
      (skillHistory || []).forEach((h: any) => {
        const name = (h.skills?.name || '').toLowerCase();
        if (name) map[name] = h.cumulative_score || 0;
      });
      return {
        understanding: map['understanding'] || 0,
        practical: map['practical'] || 0,
        thinking: map['thinking'] || 0,
        communication: map['communication'] || 0,
        creativity: map['creativity'] || 0,
      };
    })()
  };
}
