# PostgreSQL Authentication Setup Guide

This guide will help you set up PostgreSQL authentication for the Bugrank application.

## Prerequisites

- PostgreSQL installed and running on your system
- Node.js and npm installed
- Access to PostgreSQL command line (psql)

## Step 1: Create Database

Open PostgreSQL command line (psql) and run:

```sql
CREATE DATABASE bugrank_auth;
```

## Step 2: Run Migration Script

Connect to the database:

```bash
psql -U postgres -d bugrank_auth
```

Then run the migration file:

```bash
\i server/migrations/001_create_tables.sql
```

Or copy and paste the contents of `server/migrations/001_create_tables.sql` into the psql prompt.

## Step 3: Configure Environment Variables

1. Copy the example environment file in the server directory:

```bash
cd server
cp .env.example .env
```

2. Edit `.env` and update the following values:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=bugrank_auth
DB_PASSWORD=your_actual_password
DB_PORT=5432

# JWT Configuration (IMPORTANT: Change this in production!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173

# Gemini API Configuration (optional)
GEMINI_API_KEY=your_gemini_api_key_here
```

## Step 4: Install Dependencies

If not already installed, run:

```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

## Step 5: Start the Application

### Start the Server

```bash
cd server
npm run dev
```

The server should start on `http://localhost:5000` and you should see:
- ✅ Connected to PostgreSQL database
- 🐛 Bugrank server running on port 5000
- 🔐 Auth: PostgreSQL + JWT enabled

### Start the Client

In a new terminal:

```bash
cd client
npm run dev
```

The client should start on `http://localhost:5173`

## Step 6: Test Authentication

1. Navigate to `http://localhost:5173/login`
2. Click "Don't have an account? Create one"
3. Fill in the registration form:
   - Display Name: Your Name
   - Email: test@example.com
   - Password: password123
4. Click "Create Account"
5. You should be redirected to the problems page

## Database Schema

The migration creates the following tables:

### `users` table
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `display_name` (VARCHAR)
- `photo_url` (VARCHAR, optional)
- `created_at` (TIMESTAMP)
- `total_score` (INTEGER, default 0)
- `total_submissions` (INTEGER, default 0)
- `successful_submissions` (INTEGER, default 0)
- `last_login` (TIMESTAMP)
- `profile_data` (JSONB, for flexible user data)

### `sessions` table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, foreign key to users)
- `session_token` (VARCHAR, UNIQUE)
- `created_at` (TIMESTAMP)
- `expires_at` (TIMESTAMP, 24 hours from creation)
- `ip_address` (INET, optional)
- `user_agent` (TEXT, optional)

### `submissions` table
- Stores all code submissions
- Links to users via `user_id`

### `challenges` table
- Stores all coding challenges

## Session Management

- Sessions expire after 24 hours
- Expired sessions are automatically cleaned up every hour
- Users can be logged out by invalidating their session
- Both JWT tokens and session tokens are supported

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens are signed with a secret key
- Session tokens are unique and validated on each request
- Rate limiting is applied to API endpoints
- CORS is configured for allowed origins only

## Troubleshooting

### Cannot connect to database

- Verify PostgreSQL is running: `pg_ctl status`
- Check database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

### Migration errors

- Drop existing tables if needed: `DROP TABLE IF EXISTS users CASCADE;`
- Verify you're connected to the correct database
- Check PostgreSQL logs for detailed error messages

### Authentication not working

- Clear browser localStorage
- Check server logs for authentication errors
- Verify JWT_SECRET is set in `.env`
- Ensure client is sending correct headers

## Next Steps

1. ✅ Database and tables created
2. ✅ Environment variables configured
3. ✅ Authentication working
4. 🔄 Update routes to use database instead of in-memory storage
5. 🔄 Test all features with real authentication

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and invalidate session
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/profile` - Get user profile data
- `PUT /api/auth/profile` - Update user profile data

### Existing Endpoints (now require authentication)
- `GET /api/challenges` - Get all challenges
- `POST /api/submissions` - Submit code solution
- `GET /api/leaderboard` - Get leaderboard

All endpoints (except auth endpoints) now require authentication via JWT token or session token.
