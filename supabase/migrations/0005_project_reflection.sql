--------------------------------------------------------
-- PHASE 4: PROJECT & REFLECTION ENGINE
--------------------------------------------------------

-- 1. Projects Definitions
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('SAFE_HOME', 'RESEARCH', 'DEMO')),
  instructions TEXT NOT NULL,
  accepted_formats JSONB DEFAULT '["text", "image", "video", "voice"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Project Submissions (Student Work)
CREATE TABLE public.project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  content_text TEXT,
  media_urls JSONB, -- Array of strings for uploaded files
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'NEEDS_REVISION')),
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, project_id) -- Only one active submission record per project
);

-- 3. Reflections Definitions
CREATE TABLE public.reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL DEFAULT 'What did you learn? Where will you apply this in real life? What was difficult?',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Reflection Submissions
CREATE TABLE public.reflection_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL,
  reflection_id UUID NOT NULL REFERENCES public.reflections(id) ON DELETE CASCADE,
  content_text TEXT NOT NULL,
  audio_url TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'NEEDS_REVISION')),
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, reflection_id)
);

--------------------------------------------------------
-- INDEXES
--------------------------------------------------------
CREATE INDEX idx_projects_chapter ON public.projects(chapter_id);
CREATE INDEX idx_project_submissions_user_team ON public.project_submissions(user_id, team_id);
CREATE INDEX idx_reflections_chapter ON public.reflections(chapter_id);
CREATE INDEX idx_reflection_submissions_user_team ON public.reflection_submissions(user_id, team_id);

--------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES (FAIL-SAFE)
--------------------------------------------------------

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflection_submissions ENABLE ROW LEVEL SECURITY;

-- Curriculum structure is viewable safely
CREATE POLICY "Projects viewable by all users" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Reflections viewable by all users" ON public.reflections FOR SELECT USING (true);

-- Student data locked down (Service Role Only mutation/read)
CREATE POLICY "Users view own project submissions" ON public.project_submissions
  FOR SELECT USING (false /* Service Role Auth Only */);

CREATE POLICY "Users view own reflection submissions" ON public.reflection_submissions
  FOR SELECT USING (false /* Service Role Auth Only */);
