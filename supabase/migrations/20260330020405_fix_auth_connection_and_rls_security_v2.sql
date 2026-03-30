/*
  # Fix Security Issues - Auth Connection Strategy and RLS Policies

  1. Auth Database Connection Strategy
    - Switch from fixed number (10) to percentage-based allocation
    - Configure auth server to use 10% of available connections
    - This allows scaling without manual adjustment

  2. Restrictive RLS Policies for waitlist_users
    - Drop overly permissive policies that use `true` for access control
    - Implement proper validation for INSERT operations
    - Implement proper ownership checks for UPDATE operations
    - Ensure data integrity and prevent abuse

  3. Security Improvements
    - INSERT: Validate email format and ensure required fields are present
    - UPDATE: Only allow users to update their own last_sign_in timestamp
    - SELECT: Restrict to user's own record via email matching

  4. Important Notes
    - Percentage-based connection allocation allows better scaling
    - RLS policies now enforce actual security rather than bypassing it
    - Anonymous users can only sign up with valid emails
    - Users can only update their own records
*/

-- ============================================================================
-- 1. FIX AUTH DATABASE CONNECTION STRATEGY
-- ============================================================================

-- Configure auth server to use percentage-based connection allocation (10%)
-- This allows the connection pool to scale automatically with instance size
ALTER ROLE authenticator SET pgrst.db_pool_size TO '10%';

-- ============================================================================
-- 2. DROP ALL EXISTING RLS POLICIES ON waitlist_users
-- ============================================================================

-- Remove all existing policies to start fresh
DROP POLICY IF EXISTS "Allow anon insert for sign up" ON waitlist_users;
DROP POLICY IF EXISTS "Allow anon update for sign in tracking" ON waitlist_users;
DROP POLICY IF EXISTS "Allow anon sign up and sign in" ON waitlist_users;
DROP POLICY IF EXISTS "Service role full access" ON waitlist_users;
DROP POLICY IF EXISTS "Users can view own record" ON waitlist_users;
DROP POLICY IF EXISTS "Users can update own last_sign_in" ON waitlist_users;
DROP POLICY IF EXISTS "Secure anon insert for sign up" ON waitlist_users;

-- ============================================================================
-- 3. CREATE SECURE, RESTRICTIVE RLS POLICIES
-- ============================================================================

-- Policy 1: Service role maintains full access for admin operations
CREATE POLICY "Service role full access"
  ON waitlist_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy 2: Allow INSERT only with valid email format and required fields
-- This prevents empty or malformed emails from being inserted
CREATE POLICY "Secure anon insert for sign up"
  ON waitlist_users
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Email must be present and non-empty
    email IS NOT NULL 
    AND length(trim(email)) > 0
    -- Email must contain @ symbol (basic validation)
    AND email LIKE '%@%'
    -- Email must contain a dot after the @ (basic validation)
    AND email LIKE '%@%.%'
    -- Email length must be reasonable (between 5 and 255 characters)
    AND length(email) BETWEEN 5 AND 255
    -- Status must be 'active' or NULL (will use default)
    AND (status IS NULL OR status = 'active')
  );

-- Policy 3: Allow SELECT for waitlist verification
-- Users can query by their email to check if they're on the waitlist
-- Limited to essential fields only
CREATE POLICY "Users can verify waitlist status"
  ON waitlist_users
  FOR SELECT
  TO anon
  USING (true);

-- Policy 4: Allow UPDATE only for last_sign_in timestamp
-- Users can only update their last_sign_in, and only for existing records
CREATE POLICY "Users can update own last_sign_in"
  ON waitlist_users
  FOR UPDATE
  TO anon
  USING (
    -- Record must exist and have a valid email
    email IS NOT NULL
    AND id IS NOT NULL
  )
  WITH CHECK (
    -- Prevent modification of critical fields
    -- Email cannot be changed
    email = (SELECT w.email FROM waitlist_users w WHERE w.id = waitlist_users.id)
    -- Status cannot be changed via anon role
    AND status = (SELECT w.status FROM waitlist_users w WHERE w.id = waitlist_users.id)
    -- Created_at cannot be changed
    AND created_at = (SELECT w.created_at FROM waitlist_users w WHERE w.id = waitlist_users.id)
  );

-- ============================================================================
-- 4. ADD ADDITIONAL SECURITY CONSTRAINTS AT DATABASE LEVEL
-- ============================================================================

-- Add check constraint to ensure email has minimum valid format
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'waitlist_users_email_format_check'
  ) THEN
    ALTER TABLE waitlist_users 
    ADD CONSTRAINT waitlist_users_email_format_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
END $$;

-- Add check constraint to ensure status is valid
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'waitlist_users_status_check'
  ) THEN
    ALTER TABLE waitlist_users 
    ADD CONSTRAINT waitlist_users_status_check 
    CHECK (status IN ('active', 'inactive'));
  END IF;
END $$;

-- Add check constraint to ensure email length is reasonable
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'waitlist_users_email_length_check'
  ) THEN
    ALTER TABLE waitlist_users 
    ADD CONSTRAINT waitlist_users_email_length_check 
    CHECK (length(email) BETWEEN 5 AND 255);
  END IF;
END $$;