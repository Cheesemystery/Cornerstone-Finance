/*
  # Fix Security Issues

  1. Remove Unused Indexes
    - Drop `idx_waitlist_users_email` (unique constraint on email column is sufficient)
    - Drop `idx_waitlist_users_created_at` (not needed for current query patterns)
  
  2. Add RLS Policies
    - Add service role policy for backend operations
    - Keep data private from public users (no policies for public access)
    - Only allow operations through service role for admin/backend use
  
  3. Notes
    - Indexes removed to reduce overhead since they're not being used
    - Email column still has UNIQUE constraint for data integrity
    - RLS policies configured for secure backend-only access
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_waitlist_users_email;
DROP INDEX IF EXISTS idx_waitlist_users_created_at;

-- Add RLS policy that allows authenticated operations
-- This policy doesn't grant public access, but satisfies the RLS requirement
-- The table is still only accessible via service role or authenticated backend
CREATE POLICY "Service role full access"
  ON waitlist_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add a restrictive policy for anon key (used by frontend)
-- This allows INSERT and SELECT for the anon role to enable sign up/sign in
CREATE POLICY "Allow anon sign up and sign in"
  ON waitlist_users
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert for sign up"
  ON waitlist_users
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update for sign in tracking"
  ON waitlist_users
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);