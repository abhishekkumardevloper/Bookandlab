import { createAdminClient } from "@/lib/db/supabase";

export type ChapterStatus = 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ChapterView {
  id: string;
  name: string;
  description: string;
  unit_id: string | null;
  sequence_order: number;
  status: ChapterStatus;
  // Metadata for custom sorting
  outcomes: any;
  estimated_time: number;
}

export interface UnitView {
  id: string;
  name: string;
  sequence_order: number;
  chapters: ChapterView[];
}

export async function getSubjectCurriculum(subjectId: string, userId: string) {
  const supabase = await createAdminClient();

  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .single();

  if (!subject) return null;

  const isSeniorClass = ['9', '10', '11', '12'].includes(subject.class_level);

  // Fetch Units
  const { data: units = [] } = await supabase
    .from('units')
    .select('*')
    .eq('subject_id', subjectId)
    .order('sequence_order');

  // Fetch Chapters - FIXED: Removed duplicate and syntax-breaking .order() chain
  const { data: chapters = [] } = await supabase
    .from('chapters')
    .select('*')
    .eq('subject_id', subjectId)
    .eq('status', 'ACTIVE') // ENFORCE VISIBILITY
    .order('sequence_order');

  // Fetch User Progress
  const { data: progress = [] } = await supabase
    .from('chapter_progress')
    .select('chapter_id, status')
    .eq('user_id', userId);

  // Map progress to chapters
  const mappedChapters: ChapterView[] = (chapters || []).map(ch => {
    const prog = (progress || []).find(p => p.chapter_id === ch.id);
    return {
      id: ch.id,
      name: ch.name,
      description: ch.description,
      unit_id: ch.unit_id,
      sequence_order: ch.sequence_order,
      status: (prog?.status as ChapterStatus) || 'LOCKED',
      outcomes: ch.outcomes,
      estimated_time: ch.estimated_time
    };
  });

  let structuredCurriculum: UnitView[] | ChapterView[] = [];

  if (isSeniorClass && units && units.length > 0) {
    // Group by units
    structuredCurriculum = units.map(u => ({
      id: u.id,
      name: u.name,
      sequence_order: u.sequence_order,
      chapters: mappedChapters.filter(c => c.unit_id === u.id).sort((a, b) => a.sequence_order - b.sequence_order)
    }));
  } else {
    // Flat list of chapters
    structuredCurriculum = mappedChapters;
  }

  return {
    subject,
    isSeniorClass,
    curriculum: structuredCurriculum,
    flatChapters: mappedChapters // Keep flat list handy for custom filter/sorting on the client
  };
}
