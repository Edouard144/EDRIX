-- Plans available in EDRIX
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,        -- "Free", "Pro", "Enterprise"
  slug VARCHAR(100) UNIQUE NOT NULL, -- "free", "pro", "enterprise"
  price_monthly NUMERIC(10,2) DEFAULT 0,
  limits JSONB DEFAULT '{}',         -- { "api_calls": 10000, "jobs": 100 }
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- One subscription per org
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status VARCHAR(50) DEFAULT 'active', -- active | cancelled | past_due
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Every billable action is recorded here (append-only)
-- This table grows very large — never delete rows
CREATE TABLE IF NOT EXISTS usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,  -- "api_call" | "job_minute" | "log_written"
  quantity NUMERIC(10,4) DEFAULT 1,  -- how many units
  unit_price NUMERIC(10,8) DEFAULT 0,-- price per unit
  metadata JSONB DEFAULT '{}',       -- { "endpoint": "/api/users", "duration_ms": 45 }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monthly invoices generated per org
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'draft', -- draft | open | paid | void
  amount_due NUMERIC(10,2) DEFAULT 0,
  amount_paid NUMERIC(10,2) DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Line items inside each invoice
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,         -- "API calls (10,432 calls)"
  quantity NUMERIC(10,4) NOT NULL,
  unit_price NUMERIC(10,8) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Billing alerts (warn before limit hit)
CREATE TABLE IF NOT EXISTS billing_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,        -- "usage_threshold" | "invoice_due"
  threshold NUMERIC(10,2),           -- alert at $50 spend
  is_triggered BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast usage queries
CREATE INDEX IF NOT EXISTS idx_usage_events_org_id ON usage_events(org_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON usage_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_type ON usage_events(event_type);