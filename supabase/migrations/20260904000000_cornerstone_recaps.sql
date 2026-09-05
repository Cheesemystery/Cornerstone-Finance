-- Cornerstone Recap: additive, server-mediated progress and entitlement model.
ALTER TABLE portfolio_connections ADD COLUMN IF NOT EXISTS error_code text;
ALTER TABLE investment_transactions ADD COLUMN IF NOT EXISTS subtype text;
ALTER TABLE investment_transactions ADD COLUMN IF NOT EXISTS cancel_transaction_id text;
ALTER TABLE investment_transactions ADD COLUMN IF NOT EXISTS ingested_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS contribution_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id uuid REFERENCES investment_accounts(id) ON DELETE CASCADE,
  provider_transaction_id text,
  occurred_on date NOT NULL,
  amount numeric(18,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'USD' CHECK (currency = 'USD'),
  direction text NOT NULL CHECK (direction IN ('contribution','withdrawal')),
  source text NOT NULL CHECK (source IN ('plaid','manual')),
  status text NOT NULL CHECK (status IN ('suggested','confirmed','excluded','deleted')),
  confidence numeric CHECK (confidence IS NULL OR confidence BETWEEN 0 AND 1),
  classification_reason text,
  user_corrected boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS contribution_events_provider_unique ON contribution_events(user_id,provider_transaction_id) WHERE provider_transaction_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS contribution_events_user_date_idx ON contribution_events(user_id,occurred_on DESC) WHERE status <> 'deleted';

CREATE TABLE IF NOT EXISTS recap_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_kind text NOT NULL CHECK (period_kind IN ('monthly','weekly')), period_start date NOT NULL, period_end date NOT NULL CHECK (period_end >= period_start),
  contributed numeric(18,2) NOT NULL DEFAULT 0 CHECK (contributed >= 0), withdrawn numeric(18,2) NOT NULL DEFAULT 0 CHECK (withdrawn >= 0),
  previous_contributed numeric(18,2) NOT NULL DEFAULT 0 CHECK (previous_contributed >= 0), lifetime_contributed numeric(18,2) NOT NULL DEFAULT 0 CHECK (lifetime_contributed >= 0),
  streak integer NOT NULL DEFAULT 0 CHECK (streak >= 0), next_milestone numeric(18,2) NOT NULL CHECK (next_milestone > 0), pending_count integer NOT NULL DEFAULT 0 CHECK (pending_count >= 0),
  revision integer NOT NULL CHECK (revision > 0), calculation_version integer NOT NULL DEFAULT 1, source_as_of timestamptz NOT NULL, generated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id,period_kind,period_start,revision)
);
CREATE INDEX IF NOT EXISTS recap_snapshots_user_period_idx ON recap_snapshots(user_id,period_start DESC,revision DESC);

CREATE TABLE IF NOT EXISTS recap_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_opt_in boolean NOT NULL DEFAULT false, timezone text NOT NULL DEFAULT 'America/Chicago', cohort_opt_in boolean NOT NULL DEFAULT false,
  custom_milestones numeric[] NOT NULL DEFAULT '{}' CHECK (array_length(custom_milestones,1) IS NULL OR array_length(custom_milestones,1) <= 10),
  campus_domain text, campus_verified_at timestamptz, history_eligible_since date, latest_seen_period text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (campus_domain IS NULL OR campus_domain = lower(campus_domain)),
  CHECK (latest_seen_period IS NULL OR latest_seen_period ~ '^\d{4}-(0[1-9]|1[0-2])$')
);

CREATE TABLE IF NOT EXISTS campus_verification_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_hash text NOT NULL, campus_domain text NOT NULL, token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL, consumed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campus_challenge_user_idx ON campus_verification_challenges(user_id,created_at DESC);

CREATE TABLE IF NOT EXISTS campus_cohort_aggregates (
  campus_domain text NOT NULL, period_end date NOT NULL, eligible_users integer NOT NULL CHECK (eligible_users >= 30), score_counts jsonb NOT NULL,
  computed_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(campus_domain,period_end)
);

CREATE TABLE IF NOT EXISTS subscription_entitlements (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text UNIQUE, stripe_subscription_id text UNIQUE,
  status text NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive','trialing','active','past_due','canceled','unpaid')),
  price_key text CHECK (price_key IS NULL OR price_key IN ('monthly','annual')), trial_end timestamptz, current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recap_email_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recap_id uuid NOT NULL REFERENCES recap_snapshots(id) ON DELETE CASCADE, idempotency_key text NOT NULL UNIQUE,
  provider_message_id text, status text NOT NULL CHECK (status IN ('pending','sent','failed','suppressed')), sent_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS provider_webhook_events (
  provider text NOT NULL CHECK (provider IN ('plaid','stripe')), event_digest text NOT NULL,
  event_type text NOT NULL, status text NOT NULL DEFAULT 'received' CHECK (status IN ('received','processed','failed')),
  received_at timestamptz NOT NULL DEFAULT now(), processed_at timestamptz, PRIMARY KEY(provider,event_digest)
);

ALTER TABLE contribution_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE recap_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE recap_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_verification_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_cohort_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE recap_email_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own contributions read" ON contribution_events;
CREATE POLICY "own contributions read" ON contribution_events FOR SELECT TO authenticated USING (auth.uid()=user_id);
DROP POLICY IF EXISTS "own recaps read" ON recap_snapshots;
CREATE POLICY "own recaps read" ON recap_snapshots FOR SELECT TO authenticated USING (auth.uid()=user_id);
DROP POLICY IF EXISTS "own recap preferences read" ON recap_preferences;
CREATE POLICY "own recap preferences read" ON recap_preferences FOR SELECT TO authenticated USING (auth.uid()=user_id);
DROP POLICY IF EXISTS "own entitlements read" ON subscription_entitlements;
CREATE POLICY "own entitlements read" ON subscription_entitlements FOR SELECT TO authenticated USING (auth.uid()=user_id);
DROP POLICY IF EXISTS "own email deliveries read" ON recap_email_deliveries;
CREATE POLICY "own email deliveries read" ON recap_email_deliveries FOR SELECT TO authenticated USING (auth.uid()=user_id);

REVOKE ALL ON contribution_events,recap_snapshots,recap_preferences,campus_verification_challenges,campus_cohort_aggregates,subscription_entitlements,recap_email_deliveries,provider_webhook_events FROM anon,authenticated;
GRANT SELECT ON contribution_events,recap_snapshots,recap_preferences,subscription_entitlements,recap_email_deliveries TO authenticated;

COMMENT ON TABLE contribution_events IS 'Normalized external cash contributions/withdrawals. Provider rows remain suggestions until user-confirmed.';
COMMENT ON TABLE recap_snapshots IS 'Immutable, versioned recap calculations. Corrections create a higher revision.';
COMMENT ON TABLE campus_cohort_aggregates IS 'Server-only consistency distribution; contains no contribution amounts or identities.';
