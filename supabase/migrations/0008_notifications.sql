-- Notification System
-- Stores system events for all user roles

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('REVIEW_COMPLETED', 'PROJECT_SUBMITTED', 'MENTOR_ASSIGNED', 'CHAPTER_UNLOCKED', 'ADMIN_ANNOUNCEMENT', 'ROLE_CHANGED', 'SUBMISSION_STATUS')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, team_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- RLS locked
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_locked" ON notifications FOR ALL USING (false);
