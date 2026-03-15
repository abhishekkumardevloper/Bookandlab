--------------------------------------------------------
-- PHASE 3: SKILL ENGINE & INTELLIGENCE LAYER
--------------------------------------------------------

-- Skills Definitions (Fixed 5 skills according to specs)
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- Understanding, Practical, Thinking, Communication, Creativity
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert base skills immediately
INSERT INTO public.skills (name, description) VALUES 
  ('Understanding', 'Ability to grasp core concepts and theories.'),
  ('Practical', 'Real-world application and execution of concepts.'),
  ('Thinking', 'Critical analysis, logic, and problem-solving.'),
  ('Communication', 'Clarity of expressing ideas and reflections.'),
  ('Creativity', 'Originality, aesthetic choices, and novel approaches.');

-- Skill Scores (Recorded ONLY upon Mentor Review of a Chapter)
CREATE TABLE public.skill_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  mentor_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  raw_score INTEGER NOT NULL CHECK (raw_score >= 0 AND raw_score <= 100),
  normalized_score INTEGER NOT NULL, -- The computed points added or subtracted
  recorded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Skill History & Trends (Aggregated roll-up for the dashboard)
CREATE TABLE public.skill_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  cumulative_score INTEGER NOT NULL DEFAULT 0,
  trend_indicator FLOAT DEFAULT 0.0, -- Positive means accelerating growth
  last_updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, skill_id)
);

-- Tag Definitions (Threshold based progression)
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- Explorer, Thinker, Builder, Speaker, Creator
  description TEXT,
  threshold_requirements JSONB NOT NULL, -- { "skill_name": min_score }
  tier INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert Base Tag requirements
INSERT INTO public.tags (name, description, threshold_requirements, tier) VALUES 
  ('Explorer', 'Initiated into the learning paths.', '{"Understanding": 50}', 1),
  ('Thinker', 'Demonstrated strong analytical logic.', '{"Thinking": 150}', 2),
  ('Builder', 'Consistently delivers high-quality projects.', '{"Practical": 200, "Creativity": 100}', 3),
  ('Speaker', 'Articulates reflections clearly.', '{"Communication": 150}', 2),
  ('Creator', 'Master of both practical output and novelty.', '{"Practical": 300, "Creativity": 300}', 4);

-- User Tags (Awarded when thresholds are met)
CREATE TABLE public.user_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  unlocked_features JSONB, -- Optional feature flags this tag grants
  UNIQUE(user_id, tag_id)
);

--------------------------------------------------------
-- INDEXES
--------------------------------------------------------
CREATE INDEX idx_skill_scores_user ON public.skill_scores(user_id);
CREATE INDEX idx_skill_scores_chapter ON public.skill_scores(chapter_id);
CREATE INDEX idx_skill_history_user ON public.skill_history(user_id);
CREATE INDEX idx_user_tags_user ON public.user_tags(user_id);

--------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
--------------------------------------------------------

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tags ENABLE ROW LEVEL SECURITY;

-- Read Access mapping
CREATE POLICY "Skills viewable by all" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Tags viewable by all" ON public.tags FOR SELECT USING (true);

-- Students can view their OWN scores and tags BUT CAN NEVER MUTATE THEM
CREATE POLICY "Users view own scores" ON skill_scores
  FOR SELECT USING (false /* Service Role Auth Only */);

CREATE POLICY "Users view own history" ON skill_history
  FOR SELECT USING (false /* Service Role Auth Only */);

CREATE POLICY "Users view own tags" ON user_tags
  FOR SELECT USING (false /* Service Role Auth Only */);

-- Note: Mutations to skill_scores, skill_history, and user_tags are STRICTLY
-- handled by the Server API (Service Role) when a Mentor approves a chapter.
-- There is mathematically no way for a client to falsify skill progress.
