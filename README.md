# Bugrank 🐛

An innovative web platform dedicated to enhancing programming debugging skills through competitive, AI-assisted challenges.

## Tech Stack

- **Frontend**: React 18 + TypeScript + React Router + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript (OOP Architecture)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Sign-In)
- **AI Analysis**: Google Gemini Free API
- **Scheduling**: Firebase Cloud Functions
- **Deployment**: Vercel (Frontend) + Heroku (Backend)

## Project Structure

```
bugrank/
├── client/          # React frontend application
├── server/          # Node.js Express backend
├── functions/       # Firebase Cloud Functions
└── shared/          # Shared types and utilities
```

## Key Features

- **Penalty-Free Testing**: 'Run' button for iterative debugging without score impact
- **Success-Only Scoring**: 'Submit' button scores only when AI confirms correctness
- **Hourly Leaderboards**: Automated updates via Cloud Functions
- **AI-Powered Feedback**: Google Gemini analyzes code accuracy and complexity
- **Minimal Engaging UI**: Clean design with Inter font and subtle animations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account
- Google Gemini API key

### Installation

```bash
# Install all dependencies
npm install

# Setup client
cd client && npm install

# Setup server
cd ../server && npm install

# Setup functions
cd ../functions && npm install
```

### Environment Variables

Create `.env` files in `client/` and `server/` directories:

**client/.env**
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_API_URL=http://localhost:5000
```

**server/.env**
```
FIREBASE_PROJECT_ID=your_project_id
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

### Development

```bash
# Run frontend (from client/)
npm run dev

# Run backend (from server/)
npm run dev

# Deploy functions (from functions/)
firebase deploy --only functions
```

## Scoring Formula

```
score = base - (attempts × penalty) - (lines_changed × penalty) - (time_taken × penalty)
```

- Base: 100 points
- Attempt penalty: 5 points
- Line penalty: 1 point per line
- Time penalty: 0.1 points per second

Score is applied **only if AI accuracy ≥ 8/10**

## Timeline

- **Week 1**: Infrastructure setup, Firebase/Gemini integration, OOP backend
- **Week 2**: Frontend UI, Run/Submit mechanics, deployment

## Success Metrics

- Sign-ups: 50+
- Submission completion rate: 70%
- AI satisfaction: 4/5
- User retention: 20%

## License

MIT
