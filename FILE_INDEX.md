# Bugrank - Complete File Index

Generated: January 21, 2026

## 📂 Root Directory

```
bugrank/
├── .firebaserc                      # Firebase project configuration
├── .git/                            # Git repository
├── .gitignore                       # Git ignore patterns
├── CHANGELOG.md                     # Version history and changes
├── CONTRIBUTING.md                  # Contribution guidelines
├── DEPLOYMENT.md                    # Production deployment guide
├── firebase.json                    # Firebase configuration
├── firestore.indexes.json           # Firestore query indexes
├── firestore.rules                  # Firestore security rules
├── IMPLEMENTATION_SUMMARY.md        # Complete implementation details
├── LICENSE                          # MIT License
├── package.json                     # Root workspace configuration
├── QUICKSTART.md                    # 5-minute setup guide
├── README.md                        # Project overview
├── SETUP.md                         # Detailed setup instructions
├── TESTING_CHECKLIST.md             # Comprehensive testing guide
└── FILE_INDEX.md                    # This file
```

## 📂 Client (Frontend - React)

```
client/
├── .env.example                     # Environment variables template
├── .eslintrc.cjs                    # ESLint configuration
├── index.html                       # HTML entry point
├── package.json                     # Frontend dependencies
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.node.json               # TypeScript for Vite
├── vercel.json                      # Vercel deployment config
├── vite.config.ts                   # Vite build configuration
│
├── public/
│   └── bug-icon.svg                 # Bugrank logo SVG
│
└── src/
    ├── main.tsx                     # React entry point
    ├── App.tsx                      # Root App component with routing
    ├── index.css                    # Global styles + Tailwind
    │
    ├── components/
    │   ├── Layout.tsx               # Main layout wrapper
    │   ├── Navbar.tsx               # Navigation bar component
    │   └── ProtectedRoute.tsx       # Route authentication guard
    │
    ├── config/
    │   └── firebase.ts              # Firebase client configuration
    │
    ├── contexts/
    │   └── AuthContext.tsx          # Authentication state management
    │
    ├── pages/
    │   ├── LoginPage.tsx            # Google Sign-In page
    │   ├── ProblemsPage.tsx         # Challenge list page
    │   ├── EditorPage.tsx           # Code editor with Run/Submit
    │   ├── LeaderboardPage.tsx      # Top users ranking
    │   └── ProfilePage.tsx          # User profile and stats
    │
    └── services/
        ├── api.ts                   # Axios HTTP client
        ├── challengeService.ts      # Challenge API calls
        ├── submissionService.ts     # Run/Submit API calls
        └── leaderboardService.ts    # Leaderboard API calls
```

## 📂 Server (Backend - Express)

```
server/
├── .env.example                     # Environment variables template
├── package.json                     # Backend dependencies
├── Procfile                         # Heroku deployment config
├── tsconfig.json                    # TypeScript configuration
│
└── src/
    ├── index.ts                     # Express app entry point
    │
    ├── config/
    │   ├── firebase.ts              # Firebase Admin SDK setup
    │   └── gemini.ts                # Google Gemini AI setup
    │
    ├── middleware/
    │   ├── auth.ts                  # JWT token authentication
    │   └── errorHandler.ts          # Global error handling
    │
    ├── routes/
    │   ├── challenges.ts            # Challenge endpoints
    │   ├── submissions.ts           # Run/Submit endpoints
    │   └── leaderboard.ts           # Leaderboard endpoints
    │
    └── services/
        ├── GeminiService.ts         # AI analysis service (BaseService + GeminiService)
        └── SubmissionService.ts     # Run/Submit logic with scoring
```

## 📂 Functions (Firebase Cloud Functions)

```
functions/
├── package.json                     # Functions dependencies
├── tsconfig.json                    # TypeScript configuration
│
└── src/
    └── index.ts                     # Cloud Functions
        ├── updateLeaderboard        # Scheduled (hourly)
        ├── onUserCreate             # Firestore trigger
        └── cleanupOldSubmissions    # Scheduled (weekly)
```

## 📂 Shared (TypeScript Types)

```
shared/
├── package.json                     # Shared package config
├── tsconfig.json                    # TypeScript configuration
│
└── src/
    ├── index.ts                     # Export barrel
    │
    └── types/
        └── index.ts                 # Shared TypeScript interfaces
            ├── User
            ├── Challenge
            ├── Submission
            ├── AIAnalysis
            ├── LeaderboardEntry
            ├── ApiResponse
            ├── RunResult
            ├── SubmitResult
            ├── SubmissionType (enum)
            ├── ScoringConfig
            └── DEFAULT_SCORING_CONFIG
```

## 📂 Sample Challenges

```
sample-challenges/
├── README.md                        # Challenge seeding guide
├── challenge1.cpp                   # Array index out of bounds bug
├── challenge2.cpp                   # Memory leak bug
└── challenge3.java                  # Null pointer exception bug
```

## 📄 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Project overview, features, tech stack |
| QUICKSTART.md | 5-minute local setup guide |
| SETUP.md | Detailed development setup with Firebase & Gemini |
| DEPLOYMENT.md | Production deployment (Vercel + Heroku) |
| IMPLEMENTATION_SUMMARY.md | Complete implementation details & architecture |
| TESTING_CHECKLIST.md | Comprehensive testing procedures |
| CONTRIBUTING.md | Contribution guidelines |
| CHANGELOG.md | Version history |
| LICENSE | MIT License |
| FILE_INDEX.md | This file - complete project structure |

## 📊 File Statistics

### Code Files
- **TypeScript**: 35+ files
- **React Components**: 8 files
- **Express Routes**: 3 files
- **Services**: 3 files
- **Middleware**: 2 files
- **Cloud Functions**: 3 functions

### Configuration Files
- **Package.json**: 5 files (root, client, server, functions, shared)
- **TypeScript Config**: 5 files
- **Build Config**: 4 files (Vite, Tailwind, PostCSS, ESLint)
- **Deployment Config**: 3 files (Vercel, Heroku, Firebase)

### Documentation
- **Markdown Files**: 10 files
- **Total Documentation**: ~15,000 words

### Sample Data
- **Challenge Files**: 3 files

## 🎯 Key Implementation Files

### Must Review Files

1. **Frontend Core**
   - [client/src/App.tsx](client/src/App.tsx) - Routing setup
   - [client/src/pages/EditorPage.tsx](client/src/pages/EditorPage.tsx) - Run/Submit logic
   - [client/src/contexts/AuthContext.tsx](client/src/contexts/AuthContext.tsx) - Auth state

2. **Backend Core**
   - [server/src/index.ts](server/src/index.ts) - Express app
   - [server/src/services/SubmissionService.ts](server/src/services/SubmissionService.ts) - Core business logic
   - [server/src/services/GeminiService.ts](server/src/services/GeminiService.ts) - AI integration

3. **Configuration**
   - [.firebaserc](.firebaserc) - Firebase project
   - [firestore.rules](firestore.rules) - Security rules
   - [firebase.json](firebase.json) - Firebase config

4. **Documentation**
   - [README.md](README.md) - Start here
   - [QUICKSTART.md](QUICKSTART.md) - Fast setup
   - [SETUP.md](SETUP.md) - Detailed setup

## 🔧 Configuration Files Reference

### Environment Variables

**Client (.env)**
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_API_URL
```

**Server (.env)**
```
NODE_ENV
PORT
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
GEMINI_API_KEY
ALLOWED_ORIGINS
```

### Build Commands

```bash
# Frontend
cd client
npm run dev          # Development server
npm run build        # Production build

# Backend
cd server
npm run dev          # Development with hot reload
npm run build        # TypeScript compilation

# Shared
cd shared
npm run build        # Build shared types

# Functions
cd functions
npm run deploy       # Deploy to Firebase
```

## 📈 Lines of Code (Approximate)

| Component | Files | Lines |
|-----------|-------|-------|
| Frontend React | 15 | ~2,500 |
| Backend Express | 10 | ~1,200 |
| Cloud Functions | 1 | ~150 |
| Shared Types | 1 | ~200 |
| Configuration | 15 | ~500 |
| Documentation | 10 | ~5,000 |
| **Total** | **52** | **~9,550** |

## 🎨 Tech Stack File Mapping

| Technology | Files |
|------------|-------|
| React 18 | client/src/**/*.tsx |
| TypeScript | **/*.ts, **/*.tsx |
| Tailwind CSS | client/src/index.css, client/tailwind.config.js |
| Express | server/src/index.ts, server/src/routes/*.ts |
| Firebase Auth | client/src/config/firebase.ts, server/src/config/firebase.ts |
| Firestore | firestore.rules, firestore.indexes.json |
| Gemini AI | server/src/config/gemini.ts, server/src/services/GeminiService.ts |
| Monaco Editor | client/src/pages/EditorPage.tsx |
| React Router | client/src/App.tsx |

## 🚀 Deployment Files

### Vercel (Frontend)
- [client/vercel.json](client/vercel.json)
- Environment variables set in Vercel dashboard

### Heroku (Backend)
- [server/Procfile](server/Procfile)
- Environment variables set via Heroku CLI

### Firebase (Functions)
- [.firebaserc](.firebaserc)
- [firebase.json](firebase.json)
- [functions/src/index.ts](functions/src/index.ts)

## 🔍 Quick File Finder

Looking for...

- **Authentication?** → [client/src/contexts/AuthContext.tsx](client/src/contexts/AuthContext.tsx)
- **Editor logic?** → [client/src/pages/EditorPage.tsx](client/src/pages/EditorPage.tsx)
- **AI integration?** → [server/src/services/GeminiService.ts](server/src/services/GeminiService.ts)
- **Scoring formula?** → [server/src/services/SubmissionService.ts](server/src/services/SubmissionService.ts)
- **Security rules?** → [firestore.rules](firestore.rules)
- **Setup instructions?** → [SETUP.md](SETUP.md)
- **Deployment guide?** → [DEPLOYMENT.md](DEPLOYMENT.md)
- **API endpoints?** → [server/src/routes/](server/src/routes/)
- **Type definitions?** → [shared/src/types/index.ts](shared/src/types/index.ts)

## 📝 Notes

- All TypeScript files use strict mode
- ESLint configured for code quality
- Prettier recommended for formatting
- Follow SOLID principles in backend code
- Use React hooks in frontend components
- Environment variables never committed
- Secrets managed via platform configs

---

**Generated from Bugrank v1.0.0**
**Total Project Size: ~9,550 lines of code**
**Files Created: 52+**
**Documentation: 10 comprehensive guides**
