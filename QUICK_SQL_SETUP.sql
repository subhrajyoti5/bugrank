-- Quick setup commands for PostgreSQL Authentication

-- 1. Create the database (if not already created)
-- Run this in psql as postgres user
CREATE DATABASE bugrank_auth;

-- 2. Connect to the database
\c bugrank_auth;

-- 3. Run the migration script
-- Option A: From psql command line
\i server/migrations/001_create_tables.sql

-- Option B: Or paste the SQL directly:

-- Modify existing users table to add new fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS profile_data JSONB DEFAULT '{}'::jsonb;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create sessions table for session management
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id VARCHAR(100) NOT NULL,
    code TEXT NOT NULL,
    diff TEXT,
    attempt_number INTEGER DEFAULT 1,
    time_taken INTEGER DEFAULT 0,
    code_quality INTEGER DEFAULT 0,
    is_correct BOOLEAN DEFAULT false,
    points_earned INTEGER DEFAULT 0,
    analysis JSONB,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for submissions
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    buggy_code TEXT NOT NULL,
    correct_code TEXT NOT NULL,
    test_cases JSONB NOT NULL,
    time_limit INTEGER DEFAULT 300,
    points INTEGER DEFAULT 100,
    hidden_test_case JSONB,
    tags TEXT[]
);

-- Create index on difficulty for faster filtering
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);

-- 4. Verify tables were created
\dt

-- 5. Check users table structure
\d users

-- 6. Check sessions table structure
\d sessions

-- Expected output: You should see users, sessions, submissions, and challenges tables

-- 7. Test by creating a sample user (optional)
-- Note: password is bcrypt hash of "password123"
-- INSERT INTO users (email, password_hash, display_name, created_at, total_score, total_submissions, successful_submissions)
-- VALUES ('test@example.com', '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Test User', NOW(), 0, 0, 0);

-- 8. View all users (should be empty initially)
SELECT * FROM users;

-- 9. View all sessions (should be empty initially)
SELECT * FROM sessions;

-- Useful queries for debugging:

-- Count users
SELECT COUNT(*) FROM users;

-- View recent sessions
SELECT s.id, u.email, s.created_at, s.expires_at 
FROM sessions s 
JOIN users u ON s.user_id = u.id 
ORDER BY s.created_at DESC 
LIMIT 10;

-- View active sessions (not expired)
SELECT s.id, u.email, s.created_at, s.expires_at 
FROM sessions s 
JOIN users u ON s.user_id = u.id 
WHERE s.expires_at > NOW()
ORDER BY s.created_at DESC;

-- Clean up expired sessions manually (if needed)
DELETE FROM sessions WHERE expires_at < NOW();

-- Drop all tables (CAUTION: This deletes all data!)
-- DROP TABLE IF EXISTS sessions CASCADE;
-- DROP TABLE IF EXISTS submissions CASCADE;
-- DROP TABLE IF EXISTS challenges CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
