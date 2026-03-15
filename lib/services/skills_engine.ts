import { createAdminClient } from "@/lib/db/supabase";

export interface RawSkillEvaluation {
  skillName: 'Understanding' | 'Practical' | 'Thinking' | 'Communication' | 'Creativity';
  rawScore: number;
}

function normalizeScore(raw: number, currentCumulative: number): number {
  const baseDelta = (raw / 100) * 10;
  const difficultyModifier = Math.max(0.1, 1 - (currentCumulative / 1000));
  return Math.max(1, Math.round(baseDelta * difficultyModifier));
}

function computeTrend(lastCumulative: number, newCumulative: number, previousTrend: number): number {
  const delta = newCumulative - lastCumulative;
  return Number(((previousTrend * 0.7) + (delta * 0.3)).toFixed(2));
}

export async function processMentorSkillEvaluation(
  studentId: string, 
  chapterId: string, 
  mentorId: string, 
  evaluations: RawSkillEvaluation[]
) {
  const supabase = await createAdminClient();

  const { data: skills } = await supabase.from('skills').select('id, name');
  const { data: tags } = await supabase.from('tags').select('*');
  if (!skills || !tags) throw new Error("System configuration missing (skills/tags)");

  for (const evalEntry of evaluations) {
    const skill = skills.find(s => s.name === evalEntry.skillName);
    if (!skill) continue;

    const { data: history } = await supabase
      .from('skill_history')
      .select('cumulative_score, trend_indicator')
      .eq('user_id', studentId)
      .eq('skill_id', skill.id)
      .single();

    const currentScore = history ? history.cumulative_score : 0;
    const currentTrend = history ? history.trend_indicator : 0.0;

    const delta = normalizeScore(evalEntry.rawScore, currentScore);
    const newCumulative = currentScore + delta;
    const newTrend = computeTrend(currentScore, newCumulative, currentTrend);

    await supabase.from('skill_scores').insert({
      user_id: studentId,
      skill_id: skill.id,
      chapter_id: chapterId,
      mentor_id: mentorId,
      raw_score: evalEntry.rawScore,
      normalized_score: delta
    });

    await supabase.from('skill_history').upsert({
      user_id: studentId,
      skill_id: skill.id,
      cumulative_score: newCumulative,
      trend_indicator: newTrend,
      last_updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, skill_id' });

    const { data: allHistoryData } = await supabase
      .from('skill_history')
      .select(`cumulative_score, skills ( name )`)
      .eq('user_id', studentId);

    if (allHistoryData) {
      const profileMap = allHistoryData.reduce((acc: Record<string, number>, curr: any) => {
        if (curr.skills && curr.skills.name) acc[curr.skills.name] = curr.cumulative_score;
        return acc;
      }, {});

      for (const tag of tags) {
        const reqs = tag.threshold_requirements as Record<string, number>;
        let qualifies = true;
        for (const [reqSkill, reqMin] of Object.entries(reqs)) {
          if ((profileMap[reqSkill] || 0) < reqMin) {
            qualifies = false;
            break;
          }
        }
        if (qualifies) {
          await supabase.from('user_tags').upsert({
            user_id: studentId,
            tag_id: tag.id
          }, { onConflict: 'user_id, tag_id' });
        }
      }
    }
  }

  return { success: true };
}

export async function getStudentSkillDashboard(userId: string) {
  const supabase = await createAdminClient(); 

  const { data: skills } = await supabase.from('skills').select('*');
  const { data: history = [] } = await supabase.from('skill_history').select('*').eq('user_id', userId);
  
  const { data: recentScores = [] } = await supabase
    .from('skill_scores')
    .select(`raw_score, normalized_score, recorded_at, skills(name), chapters(name)`)
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(10);

  const { data: userTags = [] } = await supabase
    .from('user_tags')
    .select(`awarded_at, tags(name, description, tier)`)
    .eq('user_id', userId)
    .order('awarded_at', { ascending: false });

  const skillProfiles = skills?.map(skill => {
    const hist = history?.find(h => h.skill_id === skill.id);
    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      cumulative: hist?.cumulative_score || 0,
      trend: hist?.trend_indicator || 0.0
    };
  }) || [];

  const sortedProfiles = [...skillProfiles].sort((a, b) => b.cumulative - a.cumulative);
  const strengths = sortedProfiles.filter(p => p.cumulative > 0).slice(0, 2);
  const potentialAreas = sortedProfiles.filter(p => p.cumulative > 0).slice(-2);

  return {
    skillProfiles,
    recentScores,
    userTags,
    strengths,
    potentialAreas
  };
}
