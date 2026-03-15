--------------------------------------------------------
-- PHASE 9: ADMIN GOVERNANCE CRUD (INVESTOR DEMO)
--------------------------------------------------------

-- 1. User Status Support (Soft disable)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;

-- 2. Curriculum Metadata Support
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE'));

-- 3. Audit Logging (For Admin Actions)
-- Resolve conflict with legacy audit_logs from 0001_init.sql
DROP TABLE IF EXISTS public.audit_logs CASCADE;

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id TEXT NOT NULL,
  actor_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- e.g. 'ROLE_CHANGE', 'USER_DEACTIVATED', 'MENTOR_ASSIGNED'
  target_id TEXT, -- e.g. the user_id that was changed
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_audit_logs_team ON public.audit_logs(team_id);
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_id);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service Role Only - audit logs" ON public.audit_logs FOR SELECT USING (false);
