-- Every action in EDRIX writes a log
-- Partitioned by date for performance (huge tables)
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  level VARCHAR(20) NOT NULL DEFAULT 'info', -- info | warn | error | debug
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',               -- any extra data (user_id, ip, etc.)
  source VARCHAR(100),                       -- "api", "worker", "auth", "billing"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast filtering by org + level + date
CREATE INDEX IF NOT EXISTS idx_logs_org_id ON logs(org_id);
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_source ON logs(source);