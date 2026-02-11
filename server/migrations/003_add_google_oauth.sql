-- Migration: Add Google OAuth fields to users table

ALTER TABLE users
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS google_profile JSONB;

-- google_id: stores the unique Google account ID
-- google_profile: stores raw Google profile info (name, avatar, etc.)
