--------------------------------------------------------
-- PHASE 5: MENTOR SYSTEM & EVALUATION ENGINE
--------------------------------------------------------

-- 1. Mentor Assignments (Hard mapping of students to a mentor per team)
CREATE TABLE public.mentor_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(mentor_id, student_id, team_id)
);

-- 2. Mentor Reviews (The core evaluation record)
CREATE TABLE public.mentor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  student_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL,
  project_submission_id UUID REFERENCES public.project_submissions(id) ON DELETE SET NULL,
  reflection_submission_id UUID REFERENCES public.reflection_submissions(id) ON DELETE SET NULL,
  status_decision TEXT NOT NULL CHECK (status_decision IN ('APPROVED', 'NEEDS_REVISION')),
  feedback_text TEXT NOT NULL,
  reviewed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CHECK (project_submission_id IS NOT NULL OR reflection_submission_id IS NOT NULL)
);

-- 3. Rubric Scores (Granular dimension scoring)
CREATE TABLE public.rubric_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.mentor_reviews(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL CHECK (dimension IN ('Concept Clarity', 'Critical Thinking', 'Application', 'Expression')),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  UNIQUE(review_id, dimension)
);

--------------------------------------------------------
-- INDEXES
--------------------------------------------------------
CREATE INDEX idx_mentor_assignments_mentor_team ON public.mentor_assignments(mentor_id, team_id);
CREATE INDEX idx_mentor_assignments_student ON public.mentor_assignments(student_id);
CREATE INDEX idx_mentor_reviews_mentor_team ON public.mentor_reviews(mentor_id, team_id);
CREATE INDEX idx_mentor_reviews_student ON public.mentor_reviews(student_id);
CREATE INDEX idx_rubric_scores_review ON public.rubric_scores(review_id);

--------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES (FAIL-SAFE)
--------------------------------------------------------

ALTER TABLE public.mentor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubric_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service Role Only - assignments" ON public.mentor_assignments
  FOR SELECT USING (false);

CREATE POLICY "Service Role Only - reviews" ON public.mentor_reviews
  FOR SELECT USING (false);

CREATE POLICY "Service Role Only - rubrics" ON public.rubric_scores
  FOR SELECT USING (false);

-- The actual logic (ensuring mentor can only review assigned students,
-- within the identical team_id, and triggering skill updates) is explicitly
-- and entirely enforced in Next.js Server Actions using createAdminClient.
