# Quick Start Guide - PostgreSQL Auth

## ✅ What's Been Fixed

All code has been updated to use PostgreSQL with real authentication:

### Server-Side ✅
- ✅ Database connection configured
- ✅ AuthService with bcrypt + JWT
- ✅ Auth routes: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- ✅ Auth middleware validates JWT and sessions
- ✅ All routes now require authentication
- ✅ Submissions, challenges, and leaderboard use database queries
- ✅ Automatic challenge seeding on startup
- ✅ Session cleanup job runs hourly

### Client-Side ✅
- ✅ AuthContext with login/register functions
- ✅ LoginPage with email/password forms
- ✅ ProtectedRoute redirects to login if not authenticated
- ✅ API client attaches tokens automatically
- ✅ 401 errors redirect to login page

### Database ✅
- ✅ Migration scripts created
- ✅ Tables: users, sessions, submissions, challenges
- ✅ Indexes for performance
- ✅ JSONB profile_data for flexibility

## 🚀 Quick Setup (3 Steps)

### Step 1: Run Database Setup Script

```powershell
.\setup-database.ps1
```

This will:
- Create `bugrank_auth` database
- Run migrations
- Create `.env` file from template

### Step 2: Configure Environment

Edit `server\.env` and update:

```env
DB_PASSWORD=your_actual_postgres_password
JWT_SECRET=change_this_to_a_random_secure_string
```

### Step 3: Start the Application

Terminal 1 (Server):
```bash
cd server
npm run dev
```

Terminal 2 (Client):
```bash
cd client
npm run dev
```

## 🎯 Testing Auth

1. Open `http://localhost:5173/login`
2. Click "Create Account"
3. Fill in:
   - Display Name: Test User
   - Email: test@example.com
   - Password: password123
4. Click "Create Account"
5. You should be redirected to `/problems`
6. Try submitting a challenge!

## 📊 Database Verification

Check if everything is working:

```sql
-- Connect to database
psql -U postgres -d bugrank_auth

-- Check users
SELECT id, email, display_name, total_score FROM users;

-- Check active sessions
SELECT s.id, u.email, s.created_at, s.expires_at 
FROM sessions s 
JOIN users u ON s.user_id = u.id 
WHERE s.expires_at > NOW();

-- Check challenges
SELECT id, title, difficulty FROM challenges;

-- Check submissions
SELECT id, user_id, challenge_id, is_correct, points_earned 
FROM submissions 
ORDER BY submitted_at DESC 
LIMIT 10;
```

## 🔐 API Endpoints

### Auth Endpoints (No auth required)
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Protected Endpoints (Auth required)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user
- `GET /api/challenges` - All challenges
- `GET /api/challenges/:id` - Single challenge
- `POST /api/submissions/run` - Test code
- `POST /api/submissions/submit` - Submit for scoring
- `GET /api/leaderboard` - Top users

## 🔧 Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify DB_PASSWORD in `.env`
- Try: `psql -U postgres -l` to test connection

### "Migration failed"
- Make sure database exists: `CREATE DATABASE bugrank_auth;`
- Run manually: `psql -U postgres -d bugrank_auth -f server/migrations/001_create_tables.sql`

### "Invalid credentials" when logging in
- Make sure you registered first
- Password minimum 6 characters
- Email must be valid format

### "401 Unauthorized" on API calls
- Clear browser localStorage
- Log out and log in again
- Check server logs for auth errors

## 📝 What Changed

### Files Modified:
- `server/src/index.ts` - Added auth routes, challenge seeding
- `server/src/middleware/auth.ts` - Real JWT validation
- `server/src/routes/submissions.ts` - Use authMiddleware, userDb
- `server/src/routes/challenges.ts` - Use authMiddleware, challengeDb
- `server/src/routes/leaderboard.ts` - Use authMiddleware, userDb
- `server/src/services/SubmissionService.ts` - Database operations
- `client/src/contexts/AuthContext.tsx` - Real login/register
- `client/src/pages/LoginPage.tsx` - Email/password forms
- `client/src/components/ProtectedRoute.tsx` - Real auth check
- `client/src/services/api.ts` - Token attachment

### Files Created:
- `server/src/config/database.ts` - PostgreSQL connection
- `server/src/services/AuthService.ts` - Auth logic
- `server/src/routes/auth.ts` - Auth endpoints
- `server/src/data/storage.ts` - Database operations
- `server/migrations/001_create_tables.sql` - Schema
- `setup-database.ps1` - Setup script

## 🎉 You're All Set!

The authentication system is now fully functional with:
- ✅ Secure password hashing (bcrypt)
- ✅ JWT + session tokens
- ✅ 24-hour session expiry
- ✅ Persistent user data
- ✅ Real leaderboard with scores
- ✅ User submissions tracking
- ✅ Protected routes

Start coding and debugging! 🐛
