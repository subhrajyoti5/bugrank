# 📊 BugPulse Database Schema (Complete)

---

## 🗄️ Entity Relationship Diagram

```
┌─────────────────────┐          ┌──────────────────────┐
│       users         │ 1      ∞ │      sessions        │
│─────────────────────│◄─────────┤──────────────────────│
│ id (PK)             │          │ id (PK)              │
│ email (UNIQUE)      │          │ user_id (FK)         │
│ password_hash       │          │ session_token        │
│ display_name        │          │ created_at           │
│ photo_url           │          │ expires_at (24hr)    │
│ created_at          │          │ ip_address           │
│ total_score         │          │ user_agent           │
│ total_submissions   │          └──────────────────────┘
│ successful_..       │
│ last_login          │
│ profile_data (JSON) │
└─────────────────────┘
         △
         │ 1     ∞
         │
         └──────────────────┐
                            │
                ┌───────────┴──────────┐
                │                      │
         ┌──────┴─────────┐    ┌──────┴──────────┐
         │  submissions   │    │   challenges    │
         │────────────────│    │─────────────────│
         │ id (PK)        │    │ id (PK)         │
         │ user_id (FK)   │    │ title           │
         │ challenge_id   │    │ description     │
         │ code (TEXT)    │    │ difficulty      │
         │ diff (TEXT)    │    │ language        │
         │ attempt_#      │    │ buggy_code      │
         │ time_taken     │    │ expected_output │
         │ code_quality   │    │ test_cases      │
         │ is_correct     │    │ time_limit      │
         │ points_earned  │    │ base_score      │
         │ analysis       │    │ created_at      │
         │ submitted_at   │    └─────────────────┘
         └────────────────┘
```

---

## 📋 Table Definitions

### 1️⃣ **users** (Authentication & Profile)

```sql
CREATE TABLE users (
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

CREATE INDEX idx_users_email ON users(email);
```

| Column | Type | Notes |
|--------|------|-------|
| `id` | SERIAL PK | Auto-increment user ID |
| `email` | VARCHAR(255) UNIQUE | Login identifier |
| `password_hash` | VARCHAR(255) | Bcrypt hashed password |
| `display_name` | VARCHAR(255) | Public username |
| `photo_url` | VARCHAR(255) | Avatar image URL |
| `created_at` | TIMESTAMP | Registration date |
| `total_score` | INTEGER | Sum of all points earned |
| `total_submissions` | INTEGER | Count of all submissions |
| `successful_submissions` | INTEGER | Count of AC submissions |
| `last_login` | TIMESTAMP | Last login timestamp |
| `profile_data` | JSONB | Flexible JSON (bio, preferences) |

---

### 2️⃣ **sessions** (User Sessions)

```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

| Column | Type | Notes |
|--------|------|-------|
| `id` | SERIAL PK | Session ID |
| `user_id` | INTEGER FK | References users.id |
| `session_token` | VARCHAR(255) UNIQUE | JWT or random token |
| `created_at` | TIMESTAMP | Login time |
| `expires_at` | TIMESTAMP | Session expiry (24hr from login) |
| `ip_address` | INET | User's IP for security audit |
| `user_agent` | TEXT | Browser/device info |

**Behavior:**
- Session expires 24 hours after creation
- Soft delete on logout (mark expired)
- Hard delete when user deleted (CASCADE)

---

### 3️⃣ **challenges** (Coding Problems)

```sql
CREATE TABLE challenges (
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

CREATE INDEX idx_challenges_difficulty ON challenges(difficulty);
```

| Column | Type | Notes |
|--------|------|-------|
| `id` | VARCHAR(100) PK | Unique challenge identifier |
| `title` | VARCHAR(255) | Challenge name |
| `description` | TEXT | Full problem statement |
| `difficulty` | VARCHAR(50) | easy / medium / hard |
| `language` | VARCHAR(50) | cpp / java / python |
| `buggy_code` | TEXT | Initial buggy code user fixes |
| `expected_output` | TEXT | Test case output |
| `test_cases` | JSONB | Array of test case objects |
| `time_limit` | INTEGER | Execution timeout (seconds) |
| `base_score` | INTEGER | Points for correct solution |
| `created_at` | TIMESTAMP | Creation date |

**Example test_cases JSON:**
```json
{
  "tests": [
    {
      "input": "5",
      "expectedOutput": "120",
      "description": "5 factorial"
    },
    {
      "input": "0",
      "expectedOutput": "1",
      "description": "0 factorial"
    }
  ]
}
```

---

### 4️⃣ **submissions** (User Submissions)

```sql
CREATE TABLE submissions (
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

CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);
```

| Column | Type | Notes |
|--------|------|-------|
| `id` | VARCHAR(255) PK | UUID of submission |
| `user_id` | INTEGER FK | References users.id |
| `challenge_id` | VARCHAR(100) | References challenges.id |
| `code` | TEXT | User's submitted code |
| `diff` | TEXT | Diff from buggy_code |
| `attempt_number` | INTEGER | Which attempt (1st, 2nd, etc) |
| `time_taken` | INTEGER | Time spent (seconds) |
| `code_quality` | INTEGER | 0-100 score from AI |
| `is_correct` | BOOLEAN | AC status |
| `points_earned` | INTEGER | Points awarded |
| `analysis` | JSONB | AI analysis feedback |
| `submitted_at` | TIMESTAMP | Submission time |

**Example analysis JSON:**
```json
{
  "status": "AC",
  "stdout": "120",
  "stderr": "",
  "feedback": "Perfect! Your solution uses correct recursion...",
  "issues": [],
  "improvements": ["Consider adding memoization for optimization"]
}
```

---

## 🔑 Key Relationships

### User → Sessions (1:N)
```
One user can have multiple active sessions (desktop, mobile, etc)
Deleting a user CASCADE deletes all their sessions
```

### User → Submissions (1:N)
```
One user can have many submissions across different challenges
Deleting a user CASCADE deletes all their submissions
```

### Challenge → Submissions (1:N)
```
One challenge can have many user submissions
Deleting a challenge CASCADE deletes all its submissions
```

---

## 📈 Indexes for Performance

| Index | Table | Columns | Purpose |
|-------|-------|---------|---------|
| `idx_users_email` | users | email | Fast login lookup |
| `idx_sessions_user_id` | sessions | user_id | Find user's sessions |
| `idx_sessions_token` | sessions | session_token | Verify token |
| `idx_sessions_expires_at` | sessions | expires_at | Find expired sessions for cleanup |
| `idx_submissions_user_id` | submissions | user_id | Get user's submission history |
| `idx_submissions_challenge_id` | submissions | challenge_id | Get challenge's submissions |
| `idx_submissions_submitted_at` | submissions | submitted_at | Sort by recency |
| `idx_challenges_difficulty` | challenges | difficulty | Filter by difficulty |

---

## 🔐 Data Integrity Rules

### Constraints
- ✅ Foreign Keys with CASCADE DELETE
- ✅ UNIQUE email (prevent duplicate accounts)
- ✅ UNIQUE session_token (prevent token reuse)
- ✅ TIMESTAMP defaults (auto-populated)

### Defaults
- `total_score` → 0
- `total_submissions` → 0
- `successful_submissions` → 0
- `is_correct` → false
- `time_limit` → 300 seconds
- `base_score` → 100 points

---

## 💾 Sample Queries

### Get user's leaderboard rank
```sql
SELECT 
  users.id,
  users.display_name,
  users.total_score,
  users.successful_submissions,
  ROW_NUMBER() OVER (ORDER BY users.total_score DESC) as rank
FROM users
ORDER BY total_score DESC
LIMIT 100;
```

### Get user's submission history
```sql
SELECT 
  submissions.id,
  challenges.title,
  submissions.is_correct,
  submissions.code_quality,
  submissions.submitted_at
FROM submissions
JOIN challenges ON submissions.challenge_id = challenges.id
WHERE submissions.user_id = $1
ORDER BY submissions.submitted_at DESC;
```

### Get challenge statistics
```sql
SELECT 
  challenges.title,
  COUNT(submissions.id) as total_submissions,
  SUM(CASE WHEN submissions.is_correct THEN 1 ELSE 0 END) as successful_count,
  AVG(submissions.code_quality) as avg_quality
FROM challenges
LEFT JOIN submissions ON challenges.id = submissions.challenge_id
GROUP BY challenges.id
ORDER BY total_submissions DESC;
```

### Find expired sessions for cleanup
```sql
DELETE FROM sessions
WHERE expires_at < NOW();
```

---

## 📝 Notes

### JSONB vs Traditional Columns
- `profile_data` (JSONB): Flexible, can add user preferences without migrations
- `test_cases` (JSONB): Array of test objects with varying structures
- `analysis` (JSONB): Complex AI feedback with multiple fields

### Timestamps
- All use UTC (`DEFAULT CURRENT_TIMESTAMP`)
- `sessions.expires_at` is explicitly set (24 hours from created_at)
- Application layer handles timezone conversion

### Scaling Considerations
- **Sessions table**: Consider archiving old sessions monthly
- **Submissions table**: Add partitioning by date if > 10M rows
- **Indexes**: Review and optimize based on actual query patterns

---

## ✅ Migration Order

1. Create `users` table
2. Create `sessions` table (depends on users)
3. Create `challenges` table (independent)
4. Create `submissions` table (depends on users + challenges)
5. Add indexes on all tables
6. Seed challenges data

Run with:
```bash
psql -U bugpulse_user -d bugpulse -f 001_create_tables.sql
psql -U bugpulse_user -d bugpulse -f 002_seed_challenges.sql
```
