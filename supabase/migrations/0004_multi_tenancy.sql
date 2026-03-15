-- 0004_multi_tenancy.sql

-- 1. Create Roles Table
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- e.g. STUDENT, MENTOR, ADMIN
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert base roles
INSERT INTO public.roles (name, description) VALUES 
  ('STUDENT', 'Base learner role with access to curriculum and projects.'),
  ('MENTOR', 'Can review projects and evaluate student skills.'),
  ('ADMIN', 'Full team management access.');

-- 2. Modify Users Table
-- Add team_id to users to associate a user directly with their primary Stack Auth Team context.
ALTER TABLE public.users ADD COLUMN team_id TEXT;
CREATE INDEX idx_users_team ON public.users(team_id);

-- 3. Create User_Roles Table for strict Team-Scoped RBAC
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, team_id) -- A user has exactly one explicit role per team
);

-- 4. Data Migration: Move existing global roles to the user_roles table
-- Note: Since existing users might not have a team_id yet from Stack Auth, 
-- we will initialize team_id as 'DEFAULT_TEAM' for existing users temporarily,
-- or handle it gracefully.
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

  -- Update any existing users without a team_id to a placeholder so we can map roles
  UPDATE public.users SET team_id = 'SYSTEM_DEFAULT_TEAM' WHERE team_id IS NULL;

  FOR user_rec IN SELECT id, role, team_id FROM public.users LOOP
    IF user_rec.role = 'STUDENT' THEN
      INSERT INTO public.user_roles (user_id, team_id, role_id) VALUES (user_rec.id, user_rec.team_id, student_role_id) ON CONFLICT DO NOTHING;
    ELSIF user_rec.role = 'MENTOR' THEN
      INSERT INTO public.user_roles (user_id, team_id, role_id) VALUES (user_rec.id, user_rec.team_id, mentor_role_id) ON CONFLICT DO NOTHING;
    ELSIF user_rec.role = 'ADMIN' THEN
      INSERT INTO public.user_roles (user_id, team_id, role_id) VALUES (user_rec.id, user_rec.team_id, admin_role_id) ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END $$;

-- 5. Hardening: Drop the old global role column
ALTER TABLE public.users DROP COLUMN role;
DROP TYPE IF EXISTS public.user_role;

-- 6. Add Team ID to core execution tables to enforce tenancy boundaries
-- (Profiles already map to users, but core data like subjects might need team context if 
-- schools have different curriculum. For now, curriculum is global, but user progress is tenant-isolated)

-- 7. Update RLS Defense-in-Depth Polices
-- (Assuming Service Role handles mutations, RLS is just a fallback to prevent accidental exposure)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roles viewable by all" ON public.roles FOR SELECT USING (true);

-- Safety net: The client should NOT query user_roles directly, but if they do, they can only see their own.
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT USING (false /* Service Role Auth Only */);
