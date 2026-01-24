# Bugrank - Technical Guide

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** (build tool and dev server)
- **TailwindCSS** (styling)
- **Monaco Editor** (code editor)
- **React Router** (routing)
- **Axios** (HTTP client)
- **React Hot Toast** (notifications)

### Backend
- **Node.js** with Express.js
- **TypeScript** (type safety)
- **PostgreSQL 15** (database)
- **JWT** (authentication tokens)
- **bcryptjs** (password hashing)
- **Google Gemini AI** (code analysis)
- **g++ compiler** (C++ code execution)

### Database
- **PostgreSQL 15.x**
- Tables: users, sessions, challenges, submissions
- JSONB for flexible profile data
- Indexes for performance

## 📁 Project Structure

```
bugrank/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Navbar, Layout, ProtectedRoute
│   │   ├── contexts/      # AuthContext (state management)
│   │   ├── pages/         # LoginPage, ProblemsPage, EditorPage, LeaderboardPage, ProfilePage
│   │   └── services/      # API services (challengeService, submissionService, etc.)
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── server/                # Backend Express app
│   ├── src/
│   │   ├── config/       # database.ts, gemini.ts
│   │   ├── data/         # storage.ts (database operations), seedChallenges.ts
│   │   ├── middleware/   # auth.ts (JWT validation), errorHandler.ts
│   │   ├── routes/       # auth.ts, challenges.ts, submissions.ts, leaderboard.ts
│   │   ├── services/     # AuthService, SubmissionService, GeminiService, CompilerService
│   │   └── index.ts      # Server entry point
│   ├── migrations/        # 001_create_tables.sql
│   └── package.json       # Backend dependencies
│
├── shared/                # Shared TypeScript types
│   └── src/types/        # User, Challenge, Submission, etc.
│
└── challenges/            # Challenge source files (16 C++ files)
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL 15+**
- **g++** compiler (MinGW on Windows, GCC on Linux/Mac)
- **Git**

### 1. Clone Repository
```bash
git clone <repository-url>
cd bugrank
```

### 2. Database Setup

#### Install PostgreSQL
- Download from https://www.postgresql.org/download/
- Install and remember the password for 'postgres' user

#### Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE bugrank_auth;

# Exit
\q
```

#### Run Migrations
```bash
cd server
$env:PGPASSWORD="your_postgres_password"  # Windows PowerShell
# OR
export PGPASSWORD="your_postgres_password"  # Linux/Mac

psql -U postgres -d bugrank_auth -f migrations/001_create_tables.sql
```

This creates 4 tables:
- **users**: User accounts with password hashes
- **sessions**: Active user sessions
- **challenges**: Debugging challenges
- **submissions**: User code submissions

### 3. Backend Setup

#### Install Dependencies
```bash
cd server
npm install
```

#### Configure Environment
Create `server/.env`:
```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=bugrank_auth
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Google Gemini AI (Optional - fallback analysis works without it)
GEMINI_API_KEY=your_gemini_api_key
```

#### Start Backend Server
```bash
npm run dev
```

Server will start on **http://localhost:5000**

Expected output:
```
🐛 Bugrank server running on port 5000
📝 Environment: development
🤖 Gemini API: Configured
🔐 Auth: PostgreSQL + JWT enabled
Connected to PostgreSQL database
📚 Seeding challenges to database...
✅ Seeded 15 challenges
```

### 4. Frontend Setup

#### Install Dependencies
```bash
cd client
npm install
```

#### Configure Environment
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

#### Start Frontend
```bash
npm run dev
```

Frontend will start on **http://localhost:3000**

### 5. Verify Setup

Open http://localhost:3000 in your browser. You should see:
- Login/Register page
- Ability to create an account
- Problems page with 15 challenges
- Code editor when you click a challenge

## 🔌 Connection Details

### Database Connection
**File**: `server/src/config/database.ts`

```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;
```

**Connection String**: `postgresql://postgres:password@localhost:5432/bugrank_auth`

### API Endpoints

#### Authentication Routes (`/api/auth`)
- `POST /register` - Create new account
- `POST /login` - Login with email/password
- `POST /logout` - End session
- `GET /me` - Get current user info
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile

#### Challenge Routes (`/api/challenges`)
- `GET /` - List all challenges
- `GET /:id` - Get specific challenge

#### Submission Routes (`/api/submissions`)
- `POST /run` - Test code without scoring
- `POST /submit` - Submit code for scoring
- `GET /history` - Get user's submission history

#### Leaderboard Routes (`/api/leaderboard`)
- `GET /` - Get top users
- `GET /rank/:userId` - Get user's rank

### Frontend-Backend Communication

**File**: `client/src/services/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Request interceptor - attach auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bugrank_token');
  const sessionToken = localStorage.getItem('bugrank_session');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (sessionToken) {
    config.headers['x-session-token'] = sessionToken;
  }
  
  return config;
});

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 🔐 Authentication Flow

### Registration
1. User enters email, password, display name
2. Frontend sends POST to `/api/auth/register`
3. Backend hashes password with bcrypt (10 salt rounds)
4. User record created in PostgreSQL
5. JWT token generated (24h expiry)
6. Session created in database
7. Both tokens returned to frontend
8. Tokens stored in localStorage
9. User redirected to problems page

### Login
1. User enters email, password
2. Frontend sends POST to `/api/auth/login`
3. Backend queries user by email
4. Password verified with `bcrypt.compare()`
5. If valid, JWT + session token generated
6. Tokens returned and stored
7. User data loaded into AuthContext
8. Navbar shows user score

### Protected Routes
1. Frontend checks if user exists in AuthContext
2. If not, redirects to `/login`
3. All API requests include tokens in headers
4. Backend middleware validates tokens
5. If invalid, returns 401
6. Frontend intercepts and redirects to login

## 🏃 Running in Production

### Build Frontend
```bash
cd client
npm run build
# Creates dist/ folder
```

### Build Backend
```bash
cd server
npm run build
# Creates dist/ folder
```

### Serve Production
```bash
# Backend
cd server
npm start

# Frontend (use nginx or serve package)
npx serve -s client/dist -l 3000
```

### Environment Variables (Production)
- Change JWT_SECRET to secure random string
- Use production PostgreSQL instance
- Set NODE_ENV=production
- Configure CORS for production domains
- Use HTTPS for all connections

## 🐛 Troubleshooting

### Database Connection Fails
```bash
# Check PostgreSQL is running
pg_isready

# Verify credentials
psql -U postgres -d bugrank_auth

# Check .env file has correct password
```

### Port Already in Use
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process
Stop-Process -Id <PID> -Force
```

### Challenges Not Loading
```bash
# Check database has challenges
psql -U postgres -d bugrank_auth -c "SELECT COUNT(*) FROM challenges;"

# If 0, restart server to seed challenges
```

### Compilation Errors
```bash
# Verify g++ is installed
g++ --version

# Test compilation manually
cd server
g++ -o test test.cpp
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    total_score INTEGER DEFAULT 0,
    total_submissions INTEGER DEFAULT 0,
    successful_submissions INTEGER DEFAULT 0,
    profile_data JSONB DEFAULT '{}'::jsonb
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
```

### Challenges Table
```sql
CREATE TABLE challenges (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    language VARCHAR(20) NOT NULL,
    buggy_code TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    test_cases JSONB,
    time_limit INTEGER DEFAULT 600,
    base_score INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Submissions Table
```sql
CREATE TABLE submissions (
    id VARCHAR(100) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge_id VARCHAR(50) REFERENCES challenges(id),
    code TEXT NOT NULL,
    diff TEXT,
    attempt_number INTEGER DEFAULT 1,
    time_taken INTEGER,
    code_quality INTEGER,
    is_correct BOOLEAN DEFAULT FALSE,
    points_earned INTEGER DEFAULT 0,
    analysis JSONB,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

**Need help? Check logs in terminal for detailed error messages.**
