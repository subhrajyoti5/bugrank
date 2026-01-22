# Bugrank Setup Guide

Complete guide to set up and run Bugrank locally and deploy to production.

## Prerequisites

- Node.js 18+ and npm
- Firebase account
- Google Gemini API key
- Git

## Step 1: Clone and Install

```bash
# Clone the repository
cd bugrank

# Install all dependencies
npm run install:all
# OR install individually:
npm install
cd client && npm install
cd ../server && npm install
cd ../functions && npm install
cd ../shared && npm install && npm run build
```

## Step 2: Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "bugrank"
3. Enable Google Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Deploy firestore.rules and firestore.indexes.json

### Get Firebase Credentials

**For Frontend (client/.env):**
1. Go to Project Settings > General
2. Under "Your apps", add a Web app
3. Copy the Firebase config

**For Backend (server/.env):**
1. Go to Project Settings > Service Accounts
2. Generate new private key
3. Download JSON file

### Update .firebaserc

```bash
# In root directory
firebase use --add
# Select your project
```

## Step 3: Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy the key for server/.env

## Step 4: Configure Environment Variables

### Client (.env)

```bash
cd client
cp .env.example .env
# Edit .env with your Firebase config
```

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_API_URL=http://localhost:5000
```

### Server (.env)

```bash
cd ../server
cp .env.example .env
# Edit .env
```

```env
NODE_ENV=development
PORT=5000

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

GEMINI_API_KEY=your_gemini_api_key

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Step 5: Seed Sample Challenges

Use Firebase Console or create a seed script:

```javascript
// seed.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const challenges = [
  {
    id: 'cpp-array-bounds',
    title: 'Fix Array Index Out of Bounds',
    description: 'This C++ code attempts to access an array element beyond its size. Fix the loop condition.',
    difficulty: 'easy',
    language: 'cpp',
    buggyCode: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5};
    for(int i = 0; i <= nums.size(); i++) {
        std::cout << nums[i] << " ";
    }
    return 0;
}`,
    expectedOutput: '1 2 3 4 5',
    timeLimit: 300,
    baseScore: 100,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

async function seed() {
  for (const c of challenges) {
    await db.collection('challenges').doc(c.id).set(c);
    console.log('Added:', c.id);
  }
  process.exit(0);
}

seed();
```

Run: `node seed.js`

## Step 6: Run Development Servers

### Terminal 1 - Frontend
```bash
cd client
npm run dev
# Opens at http://localhost:3000
```

### Terminal 2 - Backend
```bash
cd server
npm run dev
# Runs at http://localhost:5000
```

### Terminal 3 - Firebase Emulators (Optional)
```bash
firebase emulators:start
```

## Step 7: Deploy

### Deploy Cloud Functions

```bash
cd functions
npm run deploy
```

### Deploy Frontend (Vercel)

```bash
cd client
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy Backend (Heroku)

```bash
cd server

# Login to Heroku
heroku login

# Create app
heroku create bugrank-api

# Set environment variables
heroku config:set FIREBASE_PROJECT_ID=your_project_id
heroku config:set GEMINI_API_KEY=your_key
# ... set all env vars

# Deploy
git push heroku main
```

## Step 8: Configure Firestore Security Rules

Deploy the security rules:

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Testing

```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

## Troubleshooting

### CORS Errors
- Ensure ALLOWED_ORIGINS in server/.env includes your frontend URL
- Update Firebase Auth authorized domains

### Gemini API Errors
- Check API key is valid
- Verify you're within rate limits (5-15 RPM for free tier)
- Check API quota in Google Cloud Console

### Firebase Auth Issues
- Ensure Google sign-in is enabled
- Check authorized domains include localhost and your deployment URL

### Firestore Permission Denied
- Deploy firestore.rules
- Ensure user is authenticated

## Production Checklist

- [ ] Update .firebaserc with production project
- [ ] Set all environment variables
- [ ] Deploy Firestore rules and indexes
- [ ] Seed initial challenges
- [ ] Deploy Cloud Functions
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Heroku
- [ ] Test authentication flow
- [ ] Test Run and Submit functionality
- [ ] Verify leaderboard updates hourly
- [ ] Set up monitoring and logging

## Support

For issues, check:
- Firebase Console logs
- Server logs (Heroku/local terminal)
- Browser console for frontend errors
- Cloud Functions logs in Firebase Console
