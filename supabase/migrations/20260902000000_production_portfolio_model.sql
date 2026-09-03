CREATE TABLE IF NOT EXISTS portfolio_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('plaid','csv','manual')), institution_name text, encrypted_access_token text,
  provider_item_id text UNIQUE, sync_cursor text, status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','syncing','error','disconnected')),
  last_synced_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS investment_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id uuid REFERENCES portfolio_connections(id) ON DELETE CASCADE, provider_account_id text, name text NOT NULL,
  type text NOT NULL DEFAULT 'investment', currency text NOT NULL DEFAULT 'USD', created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(connection_id, provider_account_id)
);
CREATE TABLE IF NOT EXISTS securities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), provider_security_id text UNIQUE, symbol text NOT NULL, name text NOT NULL,
  asset_class text NOT NULL, sector text, currency text NOT NULL DEFAULT 'USD', updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES investment_accounts(id) ON DELETE CASCADE, security_id uuid NOT NULL REFERENCES securities(id),
  quantity numeric NOT NULL, price numeric NOT NULL, previous_close numeric, cost_basis numeric, as_of timestamptz NOT NULL,
  UNIQUE(account_id, security_id)
);
CREATE TABLE IF NOT EXISTS holding_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  holding_id uuid NOT NULL REFERENCES holdings(id) ON DELETE CASCADE, quantity numeric NOT NULL, price numeric NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS investment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES investment_accounts(id) ON DELETE CASCADE, provider_transaction_id text,
  security_id uuid REFERENCES securities(id), occurred_on date NOT NULL, type text NOT NULL, quantity numeric, price numeric,
  amount numeric NOT NULL, fees numeric NOT NULL DEFAULT 0, source text NOT NULL, UNIQUE(account_id, provider_transaction_id)
);
CREATE TABLE IF NOT EXISTS portfolio_briefings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generated_at timestamptz NOT NULL DEFAULT now(), source_as_of timestamptz NOT NULL, facts jsonb NOT NULL,
  events jsonb NOT NULL, generation_metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE TABLE IF NOT EXISTS portfolio_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL, configuration jsonb NOT NULL, enabled boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  kind text NOT NULL, subject_id text, metadata jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS portfolio_connections_user_idx ON portfolio_connections(user_id);
CREATE INDEX IF NOT EXISTS investment_accounts_user_idx ON investment_accounts(user_id);
CREATE INDEX IF NOT EXISTS holdings_user_idx ON holdings(user_id);
CREATE INDEX IF NOT EXISTS holding_snapshots_user_time_idx ON holding_snapshots(user_id, captured_at DESC);
CREATE INDEX IF NOT EXISTS investment_transactions_user_date_idx ON investment_transactions(user_id, occurred_on DESC);
CREATE INDEX IF NOT EXISTS portfolio_briefings_user_time_idx ON portfolio_briefings(user_id, generated_at DESC);
ALTER TABLE portfolio_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE securities ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE holding_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own connections" ON portfolio_connections FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own accounts" ON investment_accounts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "authenticated securities read" ON securities FOR SELECT TO authenticated USING (true);
CREATE POLICY "own holdings" ON holdings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own holding snapshots" ON holding_snapshots FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own transactions" ON investment_transactions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own briefings" ON portfolio_briefings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own alerts" ON portfolio_alerts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own audit events read" ON audit_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
REVOKE ALL ON portfolio_connections, investment_accounts, holdings, holding_snapshots, investment_transactions, portfolio_briefings, portfolio_alerts, audit_events FROM anon;
