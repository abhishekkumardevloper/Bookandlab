--------------------------------------------------------
-- PHASE 2: STUDENT LEARNING CORE ENTITIES
--------------------------------------------------------

-- Subjects
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class_level TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Units (For hierarchical ordering, mainly Class 9-10)
CREATE TABLE public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Chapters
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  why_it_matters TEXT,
  outcomes JSONB, -- Array of strings
  estimated_time INTEGER, -- In minutes
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Chapter Steps (Fixed 1-6)
CREATE TABLE public.chapter_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL CHECK (step_number >= 1 AND step_number <= 6),
  type TEXT NOT NULL, -- e.g., 'THEORY', 'PROJECT', 'REFLECTION'
  content_reference TEXT, -- URL or slug to markdown/CMS content
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Chapter Progress
CREATE TABLE public.chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'LOCKED' CHECK (status IN ('LOCKED', 'IN_PROGRESS', 'COMPLETED')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, chapter_id)
);

-- Step Progress
CREATE TABLE public.step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES public.chapter_steps(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED')),
  data JSONB, -- For saving draft projects or reflections
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, step_id)
);

-- Learning Sessions Tracker
CREATE TABLE public.learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  device_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

--------------------------------------------------------
-- INDEXES FOR PERFORMANCE
--------------------------------------------------------
CREATE INDEX idx_units_subject ON public.units(subject_id);
CREATE INDEX idx_chapters_subject ON public.chapters(subject_id);
CREATE INDEX idx_chapters_unit ON public.chapters(unit_id);
CREATE INDEX idx_chapter_steps_chapter ON public.chapter_steps(chapter_id);
CREATE INDEX idx_chapter_progress_user ON public.chapter_progress(user_id);
CREATE INDEX idx_step_progress_user ON public.step_progress(user_id);
CREATE INDEX idx_learning_sessions_user ON public.learning_sessions(user_id);

--------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
--------------------------------------------------------

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;

-- Read Access for Curriculum (Everyone can read curriculum structure)
CREATE POLICY "Curriculum is viewable by all users" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Units are viewable by all users" ON public.units FOR SELECT USING (true);
CREATE POLICY "Chapters are viewable by all users" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Chapter steps are viewable by all users" ON public.chapter_steps FOR SELECT USING (true);

-- Progress Access (Users only see/update their own progress)
CREATE POLICY "Users view own chapter progress" ON chapter_progress
  FOR SELECT USING (false /* Service Role Auth Only */);
CREATE POLICY "Users view own step progress" ON step_progress
  FOR SELECT USING (false /* Service Role Auth Only */);
CREATE POLICY "Users view own sessions" ON learning_sessions
  FOR SELECT USING (false /* Service Role Auth Only */);

-- Note: In this architecture, we strongly recommend handling progress mutations
-- exclusively through Server Actions (Service Role keys) to enforce business logic
-- (like sequential locking) securely in Next.js, rather than relying on RLS alone.
