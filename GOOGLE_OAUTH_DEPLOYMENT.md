# Google OAuth Backend and Database Changes

This document lists all backend and database changes required to enable Google OAuth sign-in/sign-up, and provides deployment notes for VPS environments.

## 1. Environment Variables
Add the following to your `.env` file:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
FRONTEND_URL=https://your-frontend-domain.com
```

## 2. Backend Dependencies
Install these packages in the `server` directory:

```
npm install passport passport-google-oauth20
```

## 3. AuthService Changes
File: `server/src/services/AuthService.ts`
- Added `GoogleOAuthData` interface for Google profile data
- Implemented `googleAuth()` method to handle Google sign-in/sign-up
- The method automatically creates new users or links existing email accounts
- Stores Google ID and profile info (name, avatar) in the database

## 4. Auth Routes
File: `server/src/routes/auth.ts`
- Added `GET /api/auth/google` - Initiates Google OAuth flow
- Added `GET /api/auth/google/callback` - Handles Google OAuth callback and redirects to frontend with tokens

## 5. Server Index Configuration
File: `server/src/index.ts`
- Added Passport.js initialization
- Configured Google OAuth 2.0 strategy with client ID and secret
- Set up serialization/deserialization for session management

## 6. Database Changes
File: `server/migrations/003_add_google_oauth.sql`
- Added `google_id` column (VARCHAR, UNIQUE) - stores Google's unique user ID
- Added `google_profile` column (JSONB) - stores full Google profile data

### Migration SQL:
```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS google_profile JSONB;
```

## 7. Frontend Changes
File: `client/src/pages/LoginPage.tsx`
- Added "Sign in with Google" button with Google branding
- Button links to `/api/auth/google` endpoint to initiate OAuth flow

File: `client/src/pages/AuthSuccessPage.tsx` (NEW)
- Handles OAuth callback from `/auth-success?token=...&sessionToken=...`
- Stores tokens in localStorage
- Updates AuthContext with user data
- Redirects to `/problems` page

File: `client/src/contexts/AuthContext.tsx`
- Added `setAuthToken()` method to set authentication token
- Added `setSessionToken()` method to set session token
- Both methods update localStorage and trigger user refresh

File: `client/src/App.tsx`
- Added route `/auth-success` for OAuth callback handling

## 8. How Google OAuth Works

1. User clicks "Sign in with Google" button on login page
2. User is redirected to Google's OAuth consent screen
3. After user approves, Google redirects to `/api/auth/google/callback`
4. Backend creates new user or links existing email account
5. Backend redirects to frontend `/auth-success?token=X&sessionToken=Y`
6. Frontend stores tokens and redirects to problems page

## 9. User Account Behavior

- **New Google User**: Creates new account with Google profile info (name, avatar)
- **Existing Email User**: Links Google account to existing email/password account
- **Password-less Login**: Google users don't need password - they use Google authentication

## 10. Deployment Notes

### VPS Deployment Steps:

1. **Update Environment Variables**
   ```bash
   # Add to .env on VPS
   GOOGLE_CLIENT_ID=your-production-client-id
   GOOGLE_CLIENT_SECRET=your-production-client-secret
   GOOGLE_CALLBACK_URL=https://your-vps-domain.com/api/auth/google/callback
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Run Database Migration**
   ```bash
   # Run the migration to add Google OAuth columns
   psql -U postgres -d bugrank_auth -f migrations/003_add_google_oauth.sql
   ```

4. **Rebuild and Restart Backend**
   ```bash
   npm run build
   npm start
   ```

5. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URIs:
     - `https://your-vps-domain.com/api/auth/google/callback`
   - Copy Client ID and Client Secret to `.env`

6. **Test OAuth Flow**
   - Visit your frontend login page
   - Click "Sign in with Google"
   - Verify you're redirected and logged in after OAuth

## 11. No Additional Features
- No notifications are sent
- No admin restrictions
- No account linking options (Google accounts are kept separate from email/password)
- No 2FA required
- Simple sign-in/sign-up workflow only

## 12. Troubleshooting

**OAuth Callback Issues**:
- Ensure `GOOGLE_CALLBACK_URL` matches the authorized URI in Google Cloud Console
- Check that `FRONTEND_URL` is correct for redirects

**Database Issues**:
- Verify migration was run successfully
- Check that `google_id` and `google_profile` columns exist

**Frontend Token Storage**:
- Verify localStorage keys: `bugrank_token`, `bugrank_session`
- Check browser console for any auth errors

---

**Implementation Date**: February 2025
**Status**: Complete and ready for deployment

