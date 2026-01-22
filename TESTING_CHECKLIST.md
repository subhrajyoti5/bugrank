# Bugrank Testing Checklist

Use this checklist to verify all functionality before deployment.

## Pre-Testing Setup

- [ ] Firebase project created and configured
- [ ] Google Auth enabled in Firebase
- [ ] Firestore database created
- [ ] Gemini API key obtained
- [ ] Environment variables set in client/.env
- [ ] Environment variables set in server/.env
- [ ] At least one challenge seeded in Firestore
- [ ] Dependencies installed (npm run install:all)
- [ ] Frontend running on localhost:3000
- [ ] Backend running on localhost:5000

## 1. Authentication Tests

### Login Page
- [ ] Page loads without errors
- [ ] "Bugrank" logo displays
- [ ] "Welcome to Bugrank" heading visible
- [ ] Google Sign-In button displays
- [ ] Google Sign-In button has hover effect
- [ ] Feature stats show (5+ Challenges, AI Powered, Free Testing)

### Sign-In Flow
- [ ] Clicking "Sign in with Google" opens popup
- [ ] Can select Google account
- [ ] Successfully signs in
- [ ] User redirected to /problems page
- [ ] User document created in Firestore users collection
- [ ] User has default values (totalScore: 0, etc.)

### Authentication State
- [ ] User info shows in navbar (name, photo, score)
- [ ] Sign out button visible in navbar
- [ ] Clicking sign out logs user out
- [ ] After sign out, redirected to /login
- [ ] Protected routes redirect to /login when not authenticated

## 2. Problems Page Tests

### Page Layout
- [ ] Page title: "Debugging Challenges"
- [ ] Subtitle explains Run vs Submit
- [ ] Challenge cards display in grid
- [ ] Each card shows: title, difficulty, description, time limit, base score
- [ ] Difficulty badge color-coded (green=easy, yellow=medium, red=hard)
- [ ] Cards have hover effect (scale + shadow)
- [ ] "Start Challenge →" link visible on hover

### Challenge Cards
- [ ] Challenge title is bold and prominent
- [ ] Difficulty badge displays correctly
- [ ] Description text is clipped to 2 lines
- [ ] Time limit shows with clock icon
- [ ] Base score shows with award icon
- [ ] Language (C++/JAVA) displays
- [ ] Clicking card navigates to /editor/:id

### Empty State
- [ ] If no challenges, shows "No Challenges Yet" message
- [ ] Empty state has bug icon

## 3. Editor Page Tests

### Page Load
- [ ] Challenge loads correctly
- [ ] Challenge title displays in header
- [ ] "Back to Problems" button visible
- [ ] Timer starts at 0s and increments
- [ ] Attempts counter shows 0
- [ ] Lines changed shows 0
- [ ] Monaco editor loads with buggy code
- [ ] Code has syntax highlighting
- [ ] Editor is editable

### Problem Description Section
- [ ] Description displays correctly
- [ ] Language shown (C++/JAVA)
- [ ] Base score shown
- [ ] Time limit shown
- [ ] Info box explains Run vs Submit

### Monaco Editor
- [ ] Code loads correctly
- [ ] Syntax highlighting works
- [ ] Can edit code
- [ ] Line numbers visible
- [ ] Auto-complete works (Ctrl+Space)
- [ ] Undo/Redo works (Ctrl+Z/Y)
- [ ] Copy/Paste works

### Run Button (Penalty-Free Testing)
- [ ] "Run (Test)" button visible
- [ ] Button has play icon
- [ ] Clicking shows loading state
- [ ] Loading spinner displays
- [ ] Button disabled during execution
- [ ] AI analysis returns (5-10 seconds)
- [ ] Run Result card displays
- [ ] Shows AI accuracy score (1-10)
- [ ] Shows time complexity (e.g., O(n))
- [ ] Shows space complexity
- [ ] Shows feedback message
- [ ] NO submission created in Firestore
- [ ] Attempts counter stays at 0
- [ ] User score unchanged in Firestore
- [ ] Can run multiple times without penalty

### Submit Button (Official Evaluation)
- [ ] "Submit (Score)" button visible
- [ ] Button has send icon
- [ ] Button is primary color (blue)
- [ ] Clicking shows loading state
- [ ] Loading spinner displays
- [ ] Button disabled during execution
- [ ] AI analysis returns (5-10 seconds)

### Submit - Incorrect Solution
- [ ] Shows red error card
- [ ] "Not Quite Right" message
- [ ] AI accuracy score < 8
- [ ] Time/space complexity shown
- [ ] Feedback provided
- [ ] NO score awarded
- [ ] Submission created in Firestore
- [ ] Submission.isCorrect = false
- [ ] Submission.score is undefined
- [ ] Attempts counter increments
- [ ] User totalSubmissions increments in Firestore
- [ ] User successfulSubmissions stays same
- [ ] User totalScore unchanged

### Submit - Correct Solution
- [ ] Fix the code to be correct
- [ ] Click Submit
- [ ] Shows green success card
- [ ] "Correct Solution!" message
- [ ] AI accuracy score ≥ 8
- [ ] Score calculated and displayed
- [ ] Score formula applied: base - penalties
- [ ] Time/space complexity shown
- [ ] Positive feedback provided
- [ ] Submission created in Firestore
- [ ] Submission.isCorrect = true
- [ ] Submission.score is set
- [ ] Submission has timeTaken, linesChanged, attempts
- [ ] User totalScore updated in Firestore
- [ ] User totalSubmissions increments
- [ ] User successfulSubmissions increments
- [ ] Success toast notification shows

### Metrics Tracking
- [ ] Lines changed updates as code is edited
- [ ] Timer continues running
- [ ] Attempts counter accurate
- [ ] All metrics saved in submission

## 4. Leaderboard Page Tests

### Page Layout
- [ ] Page title: "Leaderboard"
- [ ] Subtitle mentions hourly updates
- [ ] Table header visible (Rank, User, Score, Solved)
- [ ] Top 20 users displayed

### Leaderboard Table
- [ ] Rank 1 has trophy icon (gold)
- [ ] Rank 2 has medal icon (silver)
- [ ] Rank 3 has award icon (bronze)
- [ ] Other ranks show #4, #5, etc.
- [ ] User avatar displays
- [ ] User display name shows
- [ ] Current user row highlighted (if in top 20)
- [ ] "You" badge shows for current user
- [ ] Total score displays (right-aligned)
- [ ] Successful submissions count shows
- [ ] Rows have hover effect

### User Rank Card
- [ ] If user rank > 20, shows card at top
- [ ] Card displays user's rank (#21, #22, etc.)
- [ ] Card has blue background

### Empty State
- [ ] If no users, shows "No Rankings Yet" message
- [ ] Empty state has trophy icon

### Data Accuracy
- [ ] Users sorted by totalScore descending
- [ ] Ranks are sequential (1, 2, 3...)
- [ ] Scores match Firestore data
- [ ] After submitting challenge, leaderboard updates (may take up to 1 hour for Cloud Function)

## 5. Profile Page Tests

### Page Layout
- [ ] User avatar displays (large)
- [ ] User display name shown
- [ ] User email shown
- [ ] Total points badge visible (yellow trophy)
- [ ] Problems solved count (green target)
- [ ] Success rate percentage (blue trend)

### Stats Grid
- [ ] Total Points card shows correct value
- [ ] Problems Solved card shows successfulSubmissions
- [ ] Total Attempts card shows totalSubmissions
- [ ] Success Rate card shows percentage
- [ ] All cards have colored numbers
- [ ] Cards animate on load (staggered)

### Recent Submissions
- [ ] "Recent Submissions" heading with icon
- [ ] Submissions list displays (up to 10)
- [ ] Each submission shows:
  - Challenge name
  - Date and time
  - Correct/Incorrect badge (green/red)
  - Score if correct
- [ ] Submissions sorted by date (newest first)
- [ ] Submission cards have hover effect

### Empty State
- [ ] If no submissions, shows "No submissions yet" message
- [ ] Empty state has code icon

### Data Accuracy
- [ ] Stats match Firestore user document
- [ ] Success rate calculated correctly: (successful / total) × 100
- [ ] Submissions fetched from Firestore
- [ ] Only current user's submissions shown

## 6. Navigation Tests

### Navbar
- [ ] Logo (Bugrank with bug icon) visible
- [ ] Logo links to /problems
- [ ] "Problems" link highlighted on /problems page
- [ ] "Leaderboard" link highlighted on /leaderboard page
- [ ] "Profile" link highlighted on /profile page
- [ ] Active link has blue background
- [ ] Inactive links have hover effect
- [ ] User avatar in navbar
- [ ] User name shows (desktop)
- [ ] User score shows (desktop)
- [ ] Sign out button visible
- [ ] Sign out button has logout icon

### Route Protection
- [ ] Can't access /problems without auth (redirects to /login)
- [ ] Can't access /editor/:id without auth
- [ ] Can't access /leaderboard without auth
- [ ] Can't access /profile without auth
- [ ] Root path (/) redirects to /problems
- [ ] Invalid routes redirect to /problems
- [ ] After successful login, redirects to /problems

## 7. Backend API Tests

### Health Check
- [ ] GET /health returns 200
- [ ] Response has success: true
- [ ] Response has message and timestamp

### Challenges API
- [ ] GET /api/challenges requires auth (401 without token)
- [ ] GET /api/challenges returns array with auth
- [ ] GET /api/challenges/:id returns single challenge
- [ ] GET /api/challenges/invalid returns 404

### Submissions API
- [ ] POST /api/submissions/run requires auth
- [ ] POST /api/submissions/run with valid data returns AI analysis
- [ ] POST /api/submissions/run does NOT create submission in DB
- [ ] POST /api/submissions/submit requires auth
- [ ] POST /api/submissions/submit creates submission in DB
- [ ] POST /api/submissions/submit updates user stats if correct
- [ ] GET /api/submissions/user/:userId requires auth
- [ ] GET /api/submissions/user/:userId returns only user's submissions
- [ ] GET /api/submissions/user/:otherUserId returns 403

### Leaderboard API
- [ ] GET /api/leaderboard requires auth
- [ ] GET /api/leaderboard returns top 20 users
- [ ] GET /api/leaderboard?limit=5 returns only 5 users
- [ ] GET /api/leaderboard/rank/:userId returns user's rank
- [ ] Users sorted by totalScore descending

### Error Handling
- [ ] Invalid JSON returns 400
- [ ] Missing required fields returns 400
- [ ] Invalid challenge ID returns 404
- [ ] Expired auth token returns 401
- [ ] Rate limit exceeded returns 429 (after 100 requests)

## 8. Firebase Tests

### Firestore Collections
- [ ] users collection exists
- [ ] challenges collection exists
- [ ] submissions collection exists
- [ ] leaderboard collection exists (after first Cloud Function run)

### Firestore Security Rules
- [ ] Unauthenticated users can't read/write
- [ ] Authenticated users can read own user document
- [ ] Authenticated users can't write other users' documents
- [ ] Authenticated users can read all challenges
- [ ] Authenticated users can't write challenges
- [ ] Authenticated users can read own submissions
- [ ] Authenticated users can't read others' submissions
- [ ] Authenticated users can read leaderboard
- [ ] Authenticated users can't write leaderboard

### Cloud Functions (After Deployment)
- [ ] updateLeaderboard scheduled function deployed
- [ ] Function runs every 60 minutes
- [ ] Function updates leaderboard collection
- [ ] onUserCreate trigger deployed
- [ ] Trigger adds default fields to new users
- [ ] cleanupOldSubmissions scheduled function deployed

## 9. UI/UX Tests

### Styling
- [ ] Inter font loads correctly
- [ ] Tailwind styles apply
- [ ] Custom animations work (fade-in, slide-up)
- [ ] Hover effects smooth
- [ ] Button active states work (scale down)
- [ ] Loading spinners visible
- [ ] Toast notifications appear and disappear

### Responsiveness
- [ ] Desktop (1920px) looks good
- [ ] Laptop (1280px) looks good
- [ ] Tablet (768px) looks good
- [ ] Mobile (375px) - basic testing
- [ ] Navbar adapts to screen size
- [ ] Cards stack on small screens
- [ ] Editor page usable on all sizes

### Accessibility
- [ ] All buttons have descriptive text
- [ ] Images have alt text
- [ ] Color contrast sufficient
- [ ] Keyboard navigation works (Tab key)
- [ ] Focus states visible

## 10. Performance Tests

### Frontend
- [ ] Initial load < 3 seconds
- [ ] Page transitions smooth
- [ ] Monaco editor loads quickly
- [ ] Images load without delay
- [ ] No console errors
- [ ] No console warnings

### Backend
- [ ] API responses < 500ms (non-AI)
- [ ] Run endpoint < 10 seconds (AI call)
- [ ] Submit endpoint < 10 seconds (AI call)
- [ ] Database queries optimized
- [ ] No memory leaks

### Gemini AI
- [ ] AI responses within 5-10 seconds
- [ ] Handles rate limiting gracefully
- [ ] Parses JSON responses correctly
- [ ] Error handling works

## 11. Error Scenarios

### Network Errors
- [ ] Frontend shows error message if backend down
- [ ] Backend returns proper HTTP status codes
- [ ] Timeouts handled gracefully

### AI Errors
- [ ] If Gemini fails, returns default analysis
- [ ] If rate limited, shows appropriate message
- [ ] Invalid responses handled

### Database Errors
- [ ] Firestore connection errors handled
- [ ] Query failures return error messages
- [ ] Write failures don't break app

## 12. Deployment Checklist

### Pre-Deployment
- [ ] All tests above pass
- [ ] No console errors
- [ ] Environment variables documented
- [ ] README.md up to date
- [ ] DEPLOYMENT.md reviewed

### Frontend (Vercel)
- [ ] Builds successfully
- [ ] Environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled
- [ ] Deployed and accessible

### Backend (Heroku)
- [ ] Builds successfully
- [ ] Environment variables set
- [ ] Database connections work
- [ ] Health check passes
- [ ] Deployed and accessible

### Firebase
- [ ] Firestore rules deployed
- [ ] Indexes deployed
- [ ] Cloud Functions deployed
- [ ] Functions executing correctly

### Integration
- [ ] Frontend connects to backend
- [ ] Backend connects to Firebase
- [ ] Backend connects to Gemini
- [ ] Auth flow works end-to-end
- [ ] All features work in production

## Final Verification

- [ ] Sign up new user
- [ ] Complete a challenge
- [ ] Check leaderboard
- [ ] View profile
- [ ] No errors in any logs
- [ ] All success metrics trackable

---

**Testing Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

**Tested By**: _____________

**Date**: _____________

**Environment**: ⬜ Local | ⬜ Staging | ⬜ Production

**Notes**:
