/*
  # User Profiles, Onboarding, and Progression System

  ## Overview
  Creates comprehensive tables for user profiles, onboarding flow, portfolio management, and gamification.

  ## New Tables
  
  ### `user_profiles`
  - `id` (uuid, primary key) - User identifier
  - `email` (text, unique) - User email
  - `full_name` (text) - User's full name
  - `starting_budget` (numeric) - Initial investment amount
  - `risk_tolerance` (text) - low, medium, high
  - `investment_goal` (text) - grow_money, learn_investing, make_income
  - `onboarding_completed` (boolean) - Has user finished onboarding
  - `created_at` (timestamptz) - Account creation date
  - `updated_at` (timestamptz) - Last profile update
  
  ### `user_portfolios`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to user_profiles
  - `asset_symbol` (text) - Stock/ETF ticker symbol
  - `asset_name` (text) - Full name of asset
  - `allocation_percentage` (numeric) - % of portfolio
  - `amount_invested` (numeric) - Dollar amount
  - `reasoning` (text) - Why this asset was recommended
  - `created_at` (timestamptz)
  
  ### `user_progress`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to user_profiles
  - `investment_streak_days` (integer) - Consecutive days active
  - `portfolio_level` (text) - beginner, intermediate, advanced
  - `modules_completed` (text[]) - Array of completed learning modules
  - `total_deposits` (numeric) - Lifetime deposits
  - `last_activity_date` (timestamptz) - Last login/action
  - `milestones_achieved` (text[]) - Array of achievement names
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `portfolio_health_scores`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `health_score` (integer) - 0-100 score
  - `diversification_score` (integer)
  - `risk_score` (integer)
  - `performance_score` (integer)
  - `calculated_at` (timestamptz)
  
  ### `ai_suggestions`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `suggestion_text` (text) - The AI-generated suggestion
  - `suggestion_type` (text) - next_move, warning, opportunity
  - `is_active` (boolean) - Is this the current suggestion
  - `created_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Policies restrict by authenticated user ID
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  starting_budget numeric DEFAULT 0,
  risk_tolerance text CHECK (risk_tolerance IN ('low', 'medium', 'high')),
  investment_goal text CHECK (investment_goal IN ('grow_money', 'learn_investing', 'make_income')),
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_portfolios table
CREATE TABLE IF NOT EXISTS user_portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  asset_symbol text NOT NULL,
  asset_name text NOT NULL,
  allocation_percentage numeric DEFAULT 0 CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
  amount_invested numeric DEFAULT 0,
  reasoning text,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  investment_streak_days integer DEFAULT 0,
  portfolio_level text DEFAULT 'beginner' CHECK (portfolio_level IN ('beginner', 'intermediate', 'advanced')),
  modules_completed text[] DEFAULT '{}',
  total_deposits numeric DEFAULT 0,
  last_activity_date timestamptz DEFAULT now(),
  milestones_achieved text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create portfolio_health_scores table
CREATE TABLE IF NOT EXISTS portfolio_health_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  health_score integer DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
  diversification_score integer DEFAULT 0 CHECK (diversification_score >= 0 AND diversification_score <= 100),
  risk_score integer DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  performance_score integer DEFAULT 0 CHECK (performance_score >= 0 AND performance_score <= 100),
  calculated_at timestamptz DEFAULT now()
);

-- Create ai_suggestions table
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  suggestion_text text NOT NULL,
  suggestion_type text DEFAULT 'next_move' CHECK (suggestion_type IN ('next_move', 'warning', 'opportunity')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can read own portfolio" ON user_portfolios;
DROP POLICY IF EXISTS "Users can insert own portfolio" ON user_portfolios;
DROP POLICY IF EXISTS "Users can update own portfolio" ON user_portfolios;
DROP POLICY IF EXISTS "Users can delete own portfolio" ON user_portfolios;

DROP POLICY IF EXISTS "Users can read own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;

DROP POLICY IF EXISTS "Users can read own health scores" ON portfolio_health_scores;
DROP POLICY IF EXISTS "Users can insert own health scores" ON portfolio_health_scores;
DROP POLICY IF EXISTS "Users can update own health scores" ON portfolio_health_scores;
DROP POLICY IF EXISTS "Users can delete own health scores" ON portfolio_health_scores;

DROP POLICY IF EXISTS "Users can read own suggestions" ON ai_suggestions;
DROP POLICY IF EXISTS "Users can insert own suggestions" ON ai_suggestions;
DROP POLICY IF EXISTS "Users can update own suggestions" ON ai_suggestions;
DROP POLICY IF EXISTS "Users can delete own suggestions" ON ai_suggestions;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (email = current_user);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (email = current_user);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (email = current_user)
  WITH CHECK (email = current_user);

CREATE POLICY "Users can delete own profile"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (email = current_user);

-- RLS Policies for user_portfolios
CREATE POLICY "Users can read own portfolio"
  ON user_portfolios FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can insert own portfolio"
  ON user_portfolios FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can update own portfolio"
  ON user_portfolios FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user))
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can delete own portfolio"
  ON user_portfolios FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

-- RLS Policies for user_progress
CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user))
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

-- RLS Policies for portfolio_health_scores
CREATE POLICY "Users can read own health scores"
  ON portfolio_health_scores FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can insert own health scores"
  ON portfolio_health_scores FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can update own health scores"
  ON portfolio_health_scores FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user))
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can delete own health scores"
  ON portfolio_health_scores FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

-- RLS Policies for ai_suggestions
CREATE POLICY "Users can read own suggestions"
  ON ai_suggestions FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can insert own suggestions"
  ON ai_suggestions FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can update own suggestions"
  ON ai_suggestions FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user))
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can delete own suggestions"
  ON ai_suggestions FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_portfolios_user_id ON user_portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_health_scores_user_id ON portfolio_health_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user_id ON ai_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_is_active ON ai_suggestions(is_active);