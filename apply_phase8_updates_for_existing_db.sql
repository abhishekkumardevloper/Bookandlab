-- RUN THIS SCRIPT IN YOUR SUPABASE SQL EDITOR TO APPLY PHASE 8 SECURITY & MULTI-TENANCY UPDATES
-- (This bypasses the CREATE TABLE errors from 0001_init.sql)

-------------------------------------------------------------------------
-- 1. Lock down existing RLS policies in Phase 1 (Init)
-------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (false);

DROP POLICY IF EXISTS "Students manage own profile" ON public.student_profiles;
CREATE POLICY "Students manage own profile" ON public.student_profiles FOR ALL USING (false);

DROP POLICY IF EXISTS "Mentors manage own profile" ON public.mentor_profiles;
CREATE POLICY "Mentors manage own profile" ON public.mentor_profiles FOR ALL USING (false);

DROP POLICY IF EXISTS "Admins manage own profile" ON public.admin_profiles;
CREATE POLICY "Admins manage own profile" ON public.admin_profiles FOR ALL USING (false);

-------------------------------------------------------------------------
-- 2. Lock down existing RLS policies in Phase 2 (Learning Core)
-------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users read own chapter progress" ON public.chapter_progress;
DROP POLICY IF EXISTS "Users view own chapter progress" ON public.chapter_progress;
CREATE POLICY "Users view own chapter progress" ON public.chapter_progress FOR SELECT USING (false);

DROP POLICY IF EXISTS "Users read own step progress" ON public.step_progress;
DROP POLICY IF EXISTS "Users view own step progress" ON public.step_progress;
CREATE POLICY "Users view own step progress" ON public.step_progress FOR SELECT USING (false);

DROP POLICY IF EXISTS "Users read own learning sessions" ON public.learning_sessions;
DROP POLICY IF EXISTS "Users view own sessions" ON public.learning_sessions;
CREATE POLICY "Users view own sessions" ON public.learning_sessions FOR SELECT USING (false);

-------------------------------------------------------------------------
-- 3. Lock down existing RLS policies in Phase 3 (Skill Engine)
-------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users read own skill scores" ON public.skill_scores;
DROP POLICY IF EXISTS "Users view own scores" ON public.skill_scores;
CREATE POLICY "Users view own scores" ON public.skill_scores FOR SELECT USING (false);

DROP POLICY IF EXISTS "Users read own skill history" ON public.skill_history;
DROP POLICY IF EXISTS "Users view own history" ON public.skill_history;
CREATE POLICY "Users view own history" ON public.skill_history FOR SELECT USING (false);

DROP POLICY IF EXISTS "Users read own tags" ON public.user_tags;
DROP POLICY IF EXISTS "Users view own tags" ON public.user_tags;
CREATE POLICY "Users view own tags" ON public.user_tags FOR SELECT USING (false);

-------------------------------------------------------------------------
-- 4. Apply Phase 8 Multi-Tenancy (from 0004_multi_tenancy.sql)
-------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

INSERT INTO public.roles (name, description) VALUES 
  ('STUDENT', 'Base learner role with access to curriculum and projects.'),
  ('MENTOR', 'Can review projects and evaluate student skills.'),
  ('ADMIN', 'Full team management access.')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS team_id TEXT;
CREATE INDEX IF NOT EXISTS idx_users_team ON public.users(team_id);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, team_id)
);

DO $$
DECLARE
  student_role_id UUID;
  mentor_role_id UUID;
  admin_role_id UUID;
  user_rec RECORD;
BEGIN
  SELECT id INTO student_role_id FROM public.roles WHERE name = 'STUDENT';
  SELECT id INTO mentor_role_id FROM public.roles WHERE name = 'MENTOR';
  SELECT id INTO admin_role_id FROM public.roles WHERE name = 'ADMIN';

  UPDATE public.users SET team_id = 'SYSTEM_DEFAULT_TEAM' WHERE team_id IS NULL;

  -- If old 'role' column still exists, migrate it
  -- If old 'role' column still exists, migrate it
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
    EXECUTE '
      INSERT INTO public.user_roles (user_id, team_id, role_id)
      SELECT 
        id, 
        team_id, 
        CASE 
          WHEN role = ''STUDENT'' THEN $1
          WHEN role = ''MENTOR'' THEN $2
          WHEN role = ''ADMIN'' THEN $3
          ELSE $1
        END
      FROM public.users
      ON CONFLICT DO NOTHING;
      
      ALTER TABLE public.users DROP COLUMN role;
      DROP TYPE IF EXISTS public.user_role CASCADE;
    ' USING student_role_id, mentor_role_id, admin_role_id;
  END IF;
END $$;

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Roles viewable by all" ON public.roles;
CREATE POLICY "Roles viewable by all" ON public.roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (false /* Service Role Auth Only */);
