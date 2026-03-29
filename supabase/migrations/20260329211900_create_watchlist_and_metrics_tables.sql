/*
  # Create User Watchlist and Metrics Tables

  ## Overview
  This migration creates tables to store user watchlist data and metrics for the investment dashboard.

  ## New Tables

  ### `user_watchlist`
  Stores tickers that users are actively watching/tracking
  - `id` (uuid, primary key) - Unique identifier for each watchlist entry
  - `user_id` (uuid, foreign key) - References auth.users table
  - `ticker` (text) - Stock/ETF ticker symbol (e.g., "AAPL", "SPY")
  - `company_name` (text) - Full company name
  - `price_when_added` (numeric) - Price at time of adding to watchlist
  - `added_at` (timestamptz) - Timestamp when ticker was added
  - `created_at` (timestamptz) - Record creation timestamp

  ### `user_metrics`
  Stores calculated metrics for each user's dashboard pulse points
  - `id` (uuid, primary key) - Unique identifier for metrics record
  - `user_id` (uuid, foreign key) - References auth.users table
  - `allocation_score` (integer) - Portfolio allocation health score (0-100)
  - `volatility_level` (text) - Current market volatility assessment
  - `noise_level` (integer) - News signal vs noise percentage
  - `streak_count` (integer) - Number of consecutive months investing
  - `last_investment_date` (timestamptz) - Date of most recent investment
  - `updated_at` (timestamptz) - Last metrics calculation timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ### `user_preferences`
  Stores user UI preferences and state
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users table
  - `current_tab` (text) - Last active dashboard tab
  - `watchlist_collapsed` (boolean) - Whether watchlist section is collapsed
  - `updated_at` (timestamptz) - Last preference update timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enables Row Level Security (RLS) on all tables
  - Adds policies for authenticated users to manage only their own data
  - SELECT, INSERT, UPDATE, DELETE policies restrict access to user's own records

  ## Indexes
  - Creates indexes on user_id columns for fast lookups
  - Creates composite index on (user_id, ticker) for watchlist uniqueness
*/

-- Create user_watchlist table
CREATE TABLE IF NOT EXISTS user_watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticker text NOT NULL,
  company_name text NOT NULL,
  price_when_added numeric(10, 2) DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watchlist"
  ON user_watchlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own watchlist"
  ON user_watchlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist"
  ON user_watchlist FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own watchlist"
  ON user_watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_watchlist_user_id ON user_watchlist(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_watchlist_user_ticker ON user_watchlist(user_id, ticker);

-- Create user_metrics table
CREATE TABLE IF NOT EXISTS user_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  allocation_score integer DEFAULT 98,
  volatility_level text DEFAULT 'Low',
  noise_level integer DEFAULT 15,
  streak_count integer DEFAULT 0,
  last_investment_date timestamptz,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own metrics"
  ON user_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metrics"
  ON user_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics"
  ON user_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own metrics"
  ON user_metrics FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_metrics_user_id ON user_metrics(user_id);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_tab text DEFAULT 'dashboard',
  watchlist_collapsed boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);