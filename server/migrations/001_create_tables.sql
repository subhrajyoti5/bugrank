-- Migration: Create users and sessions tables with user context support

-- Create users table with all fields
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_score INTEGER DEFAULT 0,
    total_submissions INTEGER DEFAULT 0,
    successful_submissions INTEGER DEFAULT 0,
    last_login TIMESTAMP,
    profile_data JSONB DEFAULT '{}'::jsonb
);

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
    language VARCHAR(50) NOT NULL,
    buggy_code TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    test_cases JSONB,
    time_limit INTEGER DEFAULT 300,
    base_score INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on difficulty for faster filtering
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);

-- Add comments for documentation
COMMENT ON TABLE users IS 'Stores user authentication and profile data';
COMMENT ON TABLE sessions IS 'Tracks active user sessions with 24-hour expiry';
COMMENT ON TABLE submissions IS 'Records all code submissions and analysis results';
COMMENT ON TABLE challenges IS 'Contains all coding challenges';

COMMENT ON COLUMN users.profile_data IS 'JSONB field for flexible user profile data (bio, preferences, etc.)';
COMMENT ON COLUMN users.last_login IS 'Timestamp of users last successful login';
COMMENT ON COLUMN sessions.expires_at IS 'Session expiration time (24 hours from creation)';
