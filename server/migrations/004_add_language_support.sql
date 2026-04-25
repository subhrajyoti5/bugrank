-- Migration: Add multi-language support (C++, Python, Java)

-- Add language column to submissions table to track which language was used
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'cpp';

-- Create index on language for faster queries across languages
CREATE INDEX IF NOT EXISTS idx_submissions_language ON submissions(language);

-- Add language column to challenges table to support language-specific variants
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'cpp';

-- Update existing submissions and challenges to ensure they're marked as cpp
UPDATE submissions SET language = 'cpp' WHERE language IS NULL;
UPDATE challenges SET language = 'cpp' WHERE language IS NULL;

-- Create a view for challenges grouped by language (useful for analytics)
CREATE OR REPLACE VIEW challenges_by_language AS
SELECT language, COUNT(*) as count FROM challenges GROUP BY language;

-- Create index for faster challenge queries by language
CREATE INDEX IF NOT EXISTS idx_challenges_language ON challenges(language);
