-- A webhook is a URL that EDRIX calls when something happens
-- Example: user.created → POST https://sara-app.com/hooks
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,                    -- endpoint to call
  secret TEXT NOT NULL,                 -- used to sign payloads (HMAC-SHA256)
  events TEXT[] NOT NULL DEFAULT '{}',  -- ["user.created", "job.failed"]
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Every webhook call attempt is logged here
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  event VARCHAR(255) NOT NULL,          -- "user.created"
  payload JSONB NOT NULL,               -- the data sent
  status VARCHAR(50) DEFAULT 'pending', -- pending | success | failed
  response_status INT,                  -- HTTP status from their server
  response_body TEXT,                   -- what their server returned
  attempts INT DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries(status);