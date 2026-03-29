/*
  # Create Waitlist Users Table

  1. New Tables
    - `waitlist_users`
      - `id` (uuid, primary key) - Unique identifier for each user
      - `email` (text, unique, not null) - User's email address
      - `created_at` (timestamptz, default now()) - When the user signed up
      - `last_sign_in` (timestamptz) - Track last sign in time
      - `status` (text, default 'active') - User status (active, inactive)
  
  2. Security
    - Enable RLS on `waitlist_users` table
    - No public access - only service role can read/write
    - This keeps user data private from normal users
  
  3. Notes
    - Users can sign up/sign in with just email
    - No passwords for now - just email tracking
    - Admin-only access via service role
*/

CREATE TABLE IF NOT EXISTS waitlist_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_sign_in timestamptz DEFAULT now(),
  status text DEFAULT 'active'
);

-- Enable RLS
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;

-- No policies = no public access
-- Only service role (backend) can access this table

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_users_email ON waitlist_users(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_created_at ON waitlist_users(created_at DESC);