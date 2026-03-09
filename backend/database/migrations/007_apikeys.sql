-- API keys let developers access EDRIX programmatically
-- We never store the full key — only a hash (like passwords)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,         -- "Production Key", "CI/CD Key"
  key_prefix VARCHAR(10) NOT NULL,    -- first 8 chars shown: "edx_a1b2"
  key_hash TEXT NOT NULL,             -- full key hashed with SHA-256
  scopes TEXT[] DEFAULT '{}',         -- ["read", "write", "deploy"]
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,             -- NULL = never expires
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);