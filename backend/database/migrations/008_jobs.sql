-- Jobs table for background task processing
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  payload JSONB DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | running | completed | failed | dead
  result JSONB,
  error_message TEXT,
  priority INTEGER DEFAULT 0, -- higher = more urgent
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dead letter queue (failed jobs that exceeded max attempts)
CREATE TABLE IF NOT EXISTS dead_letter_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  original_job_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  payload JSONB DEFAULT '{}',
  error_message TEXT,
  failed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast job queries
CREATE INDEX IF NOT EXISTS idx_jobs_org_id ON jobs(org_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_priority ON jobs(priority DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_at ON jobs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- Indexes for dead letter queue
CREATE INDEX IF NOT EXISTS idx_dead_letter_org_id ON dead_letter_jobs(org_id);
CREATE INDEX IF NOT EXISTS idx_dead_letter_created_at ON dead_letter_jobs(created_at DESC);
