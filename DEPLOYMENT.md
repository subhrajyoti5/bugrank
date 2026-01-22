# Bugrank Deployment Guide

Production deployment guide for Bugrank platform.

## Architecture Overview

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Vercel    │─────▶│   Heroku     │─────▶│  Firebase   │
│  (Frontend) │      │  (Backend)   │      │ (Database)  │
└─────────────┘      └──────────────┘      └─────────────┘
                                                   │
                                                   ▼
                                           ┌─────────────┐
                                           │   Gemini    │
                                           │  API (AI)   │
                                           └─────────────┘
```

## Cost Estimates (MVP)

| Service | Tier | Cost |
|---------|------|------|
| Firebase (Firestore + Auth) | Spark (Free) | $0 |
| Google Gemini API | Free tier | $0 |
| Vercel (Frontend) | Hobby | $0 |
| Heroku (Backend) | Eco Dyno | $5/month |
| **Total** | | **~$5/month** |

## Pre-Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Google Gemini API key obtained
- [ ] All environment variables documented
- [ ] Firestore security rules tested
- [ ] Sample challenges seeded
- [ ] Local testing completed
- [ ] GitHub repository created

## 1. Firebase Setup

### Create and Configure Project

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init

# Select:
# - Firestore
# - Functions
# - Choose existing project
```

### Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Deploy Cloud Functions

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

Verify in Firebase Console:
- `updateLeaderboard` scheduled for every 60 minutes
- `onUserCreate` triggered on user creation
- `cleanupOldSubmissions` scheduled weekly

## 2. Frontend Deployment (Vercel)

### Step 1: Prepare for Deployment

```bash
cd client

# Test production build
npm run build
npm run preview
```

### Step 2: Deploy to Vercel

**Option A: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

**Option B: GitHub Integration (Recommended)**

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Configure Environment Variables

In Vercel Dashboard > Settings > Environment Variables:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=bugrank-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bugrank-xxx
VITE_FIREBASE_STORAGE_BUCKET=bugrank-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456
VITE_FIREBASE_APP_ID=1:123456:web:abc...
VITE_API_URL=https://bugrank-api.herokuapp.com
```

### Step 4: Configure Custom Domain (Optional)

1. Go to Vercel Dashboard > Settings > Domains
2. Add your domain (e.g., bugrank.com)
3. Configure DNS records as shown

### Step 5: Update Firebase Auth Domains

1. Firebase Console > Authentication > Settings
2. Add Vercel domain to authorized domains:
   - `bugrank.vercel.app`
   - Your custom domain if configured

## 3. Backend Deployment (Heroku)

### Step 1: Prepare Backend

```bash
cd server

# Test production build
npm run build
npm start
```

### Step 2: Create Heroku App

```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create bugrank-api

# Or use existing app
heroku git:remote -a bugrank-api
```

### Step 3: Configure Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
heroku config:set GEMINI_API_KEY=your-gemini-key

# For FIREBASE_PRIVATE_KEY (multiline)
heroku config:set FIREBASE_PRIVATE_KEY="$(cat serviceAccountKey.json | jq -r .private_key)"

# Set allowed origins (Vercel URL)
heroku config:set ALLOWED_ORIGINS=https://bugrank.vercel.app,https://bugrank.com
```

### Step 4: Create Procfile

Already created in the repository:

```
web: node dist/index.js
```

### Step 5: Deploy

```bash
# Push to Heroku
git push heroku main

# Or if on a different branch
git push heroku your-branch:main

# Check logs
heroku logs --tail
```

### Step 6: Verify Deployment

```bash
# Test health endpoint
curl https://bugrank-api.herokuapp.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Bugrank API is running",
  "timestamp": "2026-01-21T..."
}
```

## 4. Update Frontend API URL

Update Vercel environment variable:

```bash
vercel env add VITE_API_URL production
# Enter: https://bugrank-api.herokuapp.com
```

Redeploy frontend:
```bash
vercel --prod
```

## 5. Post-Deployment Testing

### Test Authentication
1. Visit deployed frontend
2. Click "Sign in with Google"
3. Verify user is created in Firestore

### Test Challenge Loading
1. Navigate to /problems
2. Verify challenges load correctly

### Test Editor (Run)
1. Select a challenge
2. Modify code
3. Click "Run" button
4. Verify AI feedback appears
5. Check no submission is created in Firestore

### Test Editor (Submit)
1. Fix the code correctly
2. Click "Submit" button
3. Verify:
   - AI confirms correctness
   - Score is calculated and awarded
   - User stats updated
   - Submission saved to Firestore

### Test Leaderboard
1. Navigate to /leaderboard
2. Verify top users appear
3. Wait 1 hour
4. Verify leaderboard updates automatically

## 6. Monitoring and Logs

### Frontend (Vercel)
- Deployments: vercel.com/dashboard
- Analytics: Built-in Vercel Analytics
- Errors: Vercel Logs

### Backend (Heroku)
```bash
# Real-time logs
heroku logs --tail

# App metrics
heroku ps
heroku logs --source app --tail
```

### Firebase
- Firestore usage: Firebase Console > Usage
- Auth users: Firebase Console > Authentication
- Functions logs: Firebase Console > Functions > Logs

### Gemini API
- Monitor usage: Google Cloud Console > APIs & Services

## 7. Scaling Considerations

### When to Scale Up

**Indicators:**
- Frontend load time > 3s
- Backend response time > 500ms
- Gemini API rate limit errors
- Firestore read/write limits reached

**Actions:**

**Frontend (Vercel):**
- Already auto-scales
- Consider CDN optimization

**Backend (Heroku):**
```bash
# Scale to multiple dynos
heroku ps:scale web=2

# Upgrade to Standard tier
heroku dyno:type standard-1x
```

**Firestore:**
- Monitor free tier limits:
  - 50K reads/day
  - 20K writes/day
  - 1GB storage
- Upgrade to Blaze (pay-as-you-go)

**Gemini API:**
- Free tier: 5-15 RPM, 1,500 requests/day
- Implement queue system for bursts
- Consider paid tier if needed

## 8. Security Best Practices

### Environment Variables
- Never commit .env files
- Use Vercel/Heroku secret management
- Rotate API keys regularly

### Firestore Rules
- Already configured for authenticated access
- Review rules before production
- Test with Firebase emulator

### Rate Limiting
- Already implemented (100 req/15min)
- Monitor and adjust as needed

### HTTPS
- Enabled by default on Vercel/Heroku
- Ensure all API calls use HTTPS

## 9. Backup Strategy

### Firestore
```bash
# Export data
gcloud firestore export gs://[BUCKET_NAME]

# Schedule daily backups
firebase functions:shell
# Configure export function
```

### Code
- Git repository on GitHub
- Regular commits
- Tag releases

## 10. Rollback Procedure

### Frontend (Vercel)
1. Go to Vercel Dashboard > Deployments
2. Find previous working deployment
3. Click "..." > Promote to Production

### Backend (Heroku)
```bash
# View releases
heroku releases

# Rollback to previous release
heroku rollback v[VERSION_NUMBER]
```

### Functions (Firebase)
1. Firebase Console > Functions
2. Delete problematic function
3. Redeploy from last working commit

## 11. CI/CD Setup (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd client && npm install && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd server && npm install && npm run build
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: bugrank-api
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## 12. Cost Optimization

### Minimize Firebase Costs
- Use Firestore wisely (batch operations)
- Implement pagination
- Cache frequently accessed data
- Use Cloud Functions sparingly

### Minimize Gemini API Costs
- Implement request queuing
- Cache similar analyses
- Use shorter prompts
- Monitor usage dashboard

### Heroku Alternatives (If needed)
- Railway.app (Free tier)
- Render.com (Free tier)
- Google Cloud Run (Pay per use)

## Support and Monitoring

### Health Checks
- Frontend: https://bugrank.vercel.app
- Backend: https://bugrank-api.herokuapp.com/health
- Firebase: Console dashboard

### Uptime Monitoring (Free)
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)
- Configure alerts for downtime

## Success Metrics Dashboard

Track these in Firebase Analytics:
- Daily Active Users (DAU)
- Sign-ups per day
- Challenges attempted
- Submission completion rate (target: 70%)
- Average session duration
- User retention (target: 20%)

---

**Deployment Complete! 🎉**

Your Bugrank platform is now live and ready for users.
