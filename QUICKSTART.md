# Quick Start Guide

Get Bugrank running locally in minutes.

## Prerequisites

- Node.js 18+
- Firebase account
- Google Gemini API key

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
cd client && npm install
cd ../server && npm install
cd ../shared && npm install && npm run build
cd ..
```

### 2. Firebase Setup

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Google Authentication
3. Create Firestore database
4. Get Web app config (for client)
5. Generate service account key (for server)

### 3. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy for server .env

### 4. Configure Environment

**Client (.env)**
```bash
cd client
cp .env.example .env
# Add your Firebase config
```

**Server (.env)**
```bash
cd ../server
cp .env.example .env
# Add Firebase service account + Gemini key
```

### 5. Seed Sample Data

Use Firebase Console to manually add a challenge:

```json
{
  "id": "test-challenge",
  "title": "Fix the Bug",
  "description": "Find and fix the array index bug",
  "difficulty": "easy",
  "language": "cpp",
  "buggyCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1,2,3};\n    for(int i=0; i<=nums.size(); i++) {\n        std::cout << nums[i] << \" \";\n    }\n    return 0;\n}",
  "expectedOutput": "1 2 3",
  "timeLimit": 300,
  "baseScore": 100
}
```

### 6. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 7. Open Browser

Visit: http://localhost:3000

- Sign in with Google
- Select a challenge
- Click "Run" to test (no penalties)
- Click "Submit" when ready (scores if correct)

## Common Issues

### Port Already in Use
```bash
# Backend
PORT=5001 npm run dev

# Frontend uses Vite (auto-picks port)
```

### CORS Errors
Check `ALLOWED_ORIGINS` in server/.env includes `http://localhost:3000`

### Firebase Auth Error
Ensure Google sign-in is enabled in Firebase Console

### Gemini API Error
- Verify API key is correct
- Check you're within rate limits

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed setup
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Add more challenges via Firebase Console
- Deploy to Vercel + Heroku

## Project Structure

```
bugrank/
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Express backend (TypeScript + OOP)
├── functions/       # Firebase Cloud Functions
├── shared/          # Shared types
└── sample-challenges/ # Example buggy code
```

## Key Features

✅ Google Sign-In (Firebase Auth)
✅ Challenge List Page
✅ Monaco Code Editor
✅ **Run** Button (Test without penalties)
✅ **Submit** Button (Scores only if correct)
✅ AI Analysis (Google Gemini)
✅ Scoring Formula (Base - Penalties)
✅ Leaderboard (Hourly Updates)
✅ User Profile & Stats

## Development Commands

```bash
# Root
npm run dev              # Run frontend + backend concurrently
npm run build            # Build all workspaces
npm run install:all      # Install all dependencies

# Client
cd client
npm run dev              # Start dev server
npm run build            # Production build

# Server
cd server
npm run dev              # Start with hot reload
npm run build            # Compile TypeScript

# Functions
cd functions
npm run deploy           # Deploy to Firebase
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router
- **Backend**: Node.js, Express, TypeScript (OOP)
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth (Google)
- **AI**: Google Gemini 1.5 Flash
- **Hosting**: Vercel (Frontend), Heroku (Backend)

## Support

- Issues? Check [SETUP.md](SETUP.md) troubleshooting section
- PRD: See [README.md](README.md)

---

Happy debugging! 🐛
