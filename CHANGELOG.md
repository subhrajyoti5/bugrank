# Changelog

All notable changes to Bugrank will be documented in this file.

## [1.0.0] - 2026-01-21

### Added - Initial Release

#### Frontend
- Multi-page React application with React Router
- Login page with Google Sign-In
- Problems list page with challenge cards
- Monaco code editor with syntax highlighting
- Run button for penalty-free testing
- Submit button for official evaluation
- Leaderboard page with top 20 users
- Profile page with user statistics
- Protected routes with authentication
- Toast notifications for user feedback
- Responsive navbar with navigation
- Custom Tailwind animations and styling

#### Backend
- Express server with TypeScript
- OOP architecture following SOLID principles
- BaseService abstract class
- GeminiService for AI code analysis
- SubmissionService for Run/Submit logic
- Firebase Admin SDK integration
- Authentication middleware
- Rate limiting (100 req/15min)
- Error handling middleware
- CORS configuration
- Health check endpoint

#### Database
- Firestore collections: users, challenges, submissions, leaderboard
- Security rules for authenticated access
- Optimized indexes for queries

#### AI Integration
- Google Gemini 1.5 Flash integration
- Code accuracy scoring (1-10)
- Time/space complexity analysis
- Constructive feedback generation
- Success threshold (accuracy ≥ 8)

#### Cloud Functions
- Hourly leaderboard update function
- User creation trigger function
- Weekly old submissions cleanup

#### Documentation
- Comprehensive README.md
- QUICKSTART.md for fast setup
- SETUP.md with detailed instructions
- DEPLOYMENT.md for production
- IMPLEMENTATION_SUMMARY.md
- Sample challenges with README

#### Deployment
- Vercel configuration for frontend
- Heroku Procfile for backend
- Firebase configuration files
- Environment variable templates

### Features
- Success-only scoring system
- Penalty formula: base - (attempts × 5) - (lines × 1) - (time × 0.1)
- Diff calculation for lines changed
- Time tracking for submissions
- User stats: total score, submissions, success rate

### Design
- Inter font family
- Minimal yet engaging UI
- Subtle hover animations
- Loading states
- Card-based layouts
- Color-coded difficulty badges

### Security
- Firebase Auth token validation
- Firestore security rules
- Input sanitization
- Rate limiting
- HTTPS enforcement
- Environment variable management

## [Unreleased]

### Planned
- Python language support
- JavaScript language support
- Real-time leaderboard
- Dark mode
- User-created challenges
- Test case execution
- Social features (comments, likes)
- Achievements and badges
- Mobile optimization
- Email notifications

---

Format based on [Keep a Changelog](https://keepachangelog.com/)
