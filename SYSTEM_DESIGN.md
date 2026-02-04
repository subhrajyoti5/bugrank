# BugPulse - System Design Document

## 🏛️ Architecture Overview

### High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React SPA (Vite + TypeScript)                       │   │
│  │  - Monaco Editor (Code Editing)                      │   │
│  │  - React Router (Navigation)                         │   │
│  │  - Axios (HTTP Client)                               │   │
│  │  - TailwindCSS (Styling)                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓ HTTP/REST                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────┐
│                      APPLICATION TIER                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js API Server (Node.js + TypeScript)        │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Routes Layer                                  │  │  │
│  │  │  - /api/auth    - /api/challenges              │  │  │
│  │  │  - /api/submissions  - /api/leaderboard        │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Middleware Layer                              │  │  │
│  │  │  - JWT Validator  - Session Validator          │  │  │
│  │  │  - Error Handler  - CORS                       │  │  │
│  │  │  - Rate Limiter (15/15min, 30/5min)            │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Services Layer                                │  │  │
│  │  │  - AuthService (User management)               │  │  │
│  │  │  - SubmissionService (Hybrid execution)        │  │  │
│  │  │  - CompilerService (Judge0 primary)            │  │  │
│  │  │  - Judge0Service (RapidAPI integration)        │  │  │
│  │  │  - GeminiService (AI analysis)                 │  │  │
│  │  │  - UsageTracker (Cost monitoring)              │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│             ↓ pg (node-postgres)    ↓ Judge0 API           │
└────────────────────────────────────────────────────────────┘
                 ↓                           ↓
┌──────────────────────────┐   ┌─────────────────────────────┐
│      DATA TIER           │   │   EXTERNAL SERVICES         │
│  ┌────────────────────┐  │   │  ┌───────────────────────┐  │
│  │  PostgreSQL 15     │  │   │  │ Google Gemini AI      │  │
│  │  - users           │  │   │  │ (Run - Free)          │  │
│  │  - sessions        │  │   │  └───────────────────────┘  │
│  │  - challenges      │  │   │  ┌───────────────────────┐  │
│  │  - submissions     │  │   │  │ Judge0 CE (RapidAPI)  │  │
│  │  - indexes         │  │   │  │ (Submit - $0.0017)    │  │
│  └────────────────────┘  │   │  │ - SHA-256 caching     │  │
│                          │   │  │ - 1hr TTL             │  │
│                          │   │  └───────────────────────┘  │
└──────────────────────────┘   └─────────────────────────────┘
```

## 🔧 Component Design

### 1. Frontend Architecture

#### Component Hierarchy
```
App
├── AuthProvider (Context)
│   ├── LoginPage
│   └── ProtectedRoute
│       ├── Layout
│       │   ├── Navbar
│       │   └── Outlet
│       ├── ProblemsPage
│       ├── EditorPage
│       ├── LeaderboardPage
│       └── ProfilePage
```

#### State Management
- **AuthContext**: Global user state, authentication functions
- **Local State**: Component-specific state (useState)
- **Local Storage**: Persistent token storage

#### Data Flow
```
User Action → Component Handler → API Service → Axios Request
                                                      ↓
User sees result ← Component State Update ← Response
```

### 2. Backend Architecture

#### Layered Architecture

**1. Routes Layer** (`routes/`)
- Handles HTTP requests/responses
- Input validation
- Routes to appropriate services

**2. Middleware Layer** (`middleware/`)
- Authentication verification
- Error handling
- Request logging
- CORS handling

**3. Services Layer** (`services/`)
- Business logic
- Data processing
- External API calls
- Database operations

**4. Data Access Layer** (`data/`)
- Database queries
- Data transformation
- CRUD operations

### 3. Database Design

#### Entity-Relationship Diagram
```
┌─────────────┐          ┌──────────────┐
│    users    │ 1     ∞  │   sessions   │
│─────────────│◄─────────┤──────────────│
│ id (PK)     │          │ id (PK)      │
│ email       │          │ user_id (FK) │
│ password_   │          │ session_     │
│   hash      │          │   token      │
│ display_    │          │ expires_at   │
│   name      │          └──────────────┘
│ total_score │
│ ...         │
└─────────────┘
      ∞ │
        │
        │ 1
┌──────────────┐        ┌───────────────┐
│ submissions  │ ∞   1  │  challenges   │
│──────────────│───────►│───────────────│
│ id (PK)      │        │ id (PK)       │
│ user_id (FK) │        │ title         │
│ challenge_id │        │ description   │
│   (FK)       │        │ buggy_code    │
│ code         │        │ expected_     │
│ is_correct   │        │   output      │
│ points_      │        │ base_score    │
│   earned     │        │ test_cases    │
└──────────────┘        └───────────────┘
``` 
#### Indexes for Performance
```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_total_score ON users(total_score DESC);

-- Sessions
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- Submissions
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX idx_submissions_user_challenge ON submissions(user_id, challenge_id);
```

## 🔐 Security Architecture

### Authentication Flow
```
1. User Registration
   └─► Password → bcrypt.hash(10 rounds) → Hash stored in DB

2. User Login
   ├─► Email lookup in DB
   ├─► bcrypt.compare(input, stored_hash)
   ├─► Generate JWT (24h expiry)
   ├─► Create session in DB (24h expiry)
   └─► Return both tokens

3. Protected Request
   ├─► Extract JWT from Authorization header
   ├─► Extract session token from x-session-token header
   ├─► Verify JWT signature
   ├─► Check session in DB (not expired)
   ├─► Attach user to request
   └─► Proceed to route handler
```

### Security Measures

1. **Password Security**
   - bcrypt hashing (10 salt rounds)
   - Unique salt per password
   - No plain text storage

2. **Token Security**
   - JWT signed with secret key
   - Short expiration (24h)
   - HttpOnly cookies (future enhancement)

3. **Session Management**
   - Database-backed sessions
   - Automatic expiry cleanup
   - IP and user agent tracking

4. **Input Validation**
   - Email format validation
   - Password strength requirements
   - SQL injection prevention (parameterized queries)

5. **CORS Configuration**
   - Whitelist allowed origins
   - Credential support
   - Preflight handling

## 🎯 Code Execution Pipeline

### Submission Flow
```
User submits code
      ↓
┌─────────────────────────────────────┐
│  1. SubmissionService.submitCode()  │
└─────────────────────────────────────┘
      ↓
┌─────────────────────────────────────┐
│  2. CompilerService.compileAndRun() │
│     ├─► Generate SHA-256 cache key  │
│     ├─► Check 1-hour in-memory cache│
│     ├─► POST to Judge0 CE endpoint  │
│     │   (Base64 encoded code/stdin) │
│     ├─► Poll for result (async)     │
│     │   Exponential backoff 500ms-3s│
│     ├─► Decode Base64 response      │
│     ├─► Cache result (1hr TTL)      │
│     └─► Throw error if API fails    │
└─────────────────────────────────────┘
      ↓
┌─────────────────────────────────────┐
│  3. Test Case Validation            │
│     └─► Compare output vs expected  │
└─────────────────────────────────────┘
      ↓
┌─────────────────────────────────────┐
│  4. GeminiService.analyzeCode()     │
│     ├─► Send to Gemini AI           │
│     ├─► Get quality scores          │
│     └─► Fallback if AI unavailable  │
└─────────────────────────────────────┘
      ↓
┌─────────────────────────────────────┐
│  5. Calculate Score                 │
│     Score = BaseScore × Multipliers │
│     - Attempt penalty               │
│     - Lines changed penalty         │
│     - Time penalty                  │
└─────────────────────────────────────┘
      ↓
┌─────────────────────────────────────┐
│  6. Save Submission to DB           │
│     └─► Update user statistics      │
└─────────────────────────────────────┘
      ↓
Return result to user
```

### Compiler Service Architecture
```typescript
// Hybrid Execution Strategy
┌────────────────────────────────────┐
│  Run Button (FREE):                │
│  - AI analysis only (Gemini)       │
│  - No compilation costs            │
│  - Rate limit: 30/5min             │
│  - Instant feedback                │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  Submit Button (PAID):             │
│  - Judge0 CE API via RapidAPI      │
│  - Cost: $0.0017 per submission    │
│  - Rate limit: 15/15min            │
│  - 1-hour SHA-256 result caching   │
│  - Cache deduplication saves costs │
│  - Throws errors on API failure    │
└────────────────────────────────────┘

// Judge0 Configuration & Caching
┌────────────────────────────────────┐
│  Judge0 CE API Settings:           │
│  - Language: C++ (GCC 9.2.0) = 54  │
│  - CPU Time Limit: 5 seconds       │
│  - Memory Limit: 256 MB (262144KB) │
│  - Base64 encoding for I/O         │
│  - Async submission (wait=false)   │
│                                    │
│  Caching Strategy:                 │
│  - In-memory Map cache             │
│  - TTL: 1 hour (3600s)             │
│  - Key: SHA-256(code|lang|stdin)   │
│  - Auto cleanup every 10 minutes   │
│  - Cache hit saves $0.0017         │
└────────────────────────────────────┘

// Error Handling & Status Codes
┌────────────────────────────────────┐
│  Judge0 Status Codes:              │
│  - 1,2: In Queue/Processing        │
│  - 3: Accepted (Success)           │
│  - 5: Time Limit Exceeded          │
│  - 6: Compilation Error            │
│  - Other: Runtime/System Error     │
│                                    │
│  Error Strategy:                   │
│  - Throw errors on API failure     │
│  - Detailed logging (request/resp) │
│  - User-friendly error messages    │
│  - No silent failures              │
└────────────────────────────────────┘
```

## 🧮 Scoring Algorithm Design

### Formula
```
Score = BaseScore × AttemptMultiplier × LinesMultiplier × TimeMultiplier
```

### Multipliers
```typescript
AttemptMultiplier = 1 - (0.1 × (attempts - 1))
  // First attempt: 1.0
  // Second attempt: 0.9
  // Third attempt: 0.8
  // Min: 0.5

LinesMultiplier = 1 - (0.05 × linesChanged)
  // 1 line: 0.95
  // 5 lines: 0.75
  // 10 lines: 0.5
  // Min: 0.3

TimeMultiplier = 1 - (0.001 × timeInSeconds)
  // 1 minute: 0.94
  // 5 minutes: 0.7
  // 10 minutes: 0.4
  // No minimum
```

### Example Calculation
```
Base Score: 100 points
Attempts: 2
Lines Changed: 3
Time Taken: 180 seconds (3 minutes)

Score = 100 × (1 - 0.1×1) × (1 - 0.05×3) × (1 - 0.001×180)
      = 100 × 0.9 × 0.85 × 0.82
      = 62.73 points
```

## 📊 Data Models

### TypeScript Interfaces

```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  totalScore: number;
  totalSubmissions: number;
  successfulSubmissions: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'cpp' | 'java' | 'python' | 'javascript';
  buggyCode: string;
  expectedOutput: string;
  timeLimit: number;
  baseScore: number;
  testCase?: TestCase;  // { input: string, expectedOutput: string }
  createdAt: Date;
}

interface TestCase {
  input: string;           // stdin input for program
  expectedOutput: string;  // expected stdout (with \n)
}

interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  linesChanged: number;
  attempts: number;
  timeTaken: number;
  aiAccuracyScore: number;
  isCorrect: boolean;
  score?: number;
  aiAnalysis: AIAnalysis;
  createdAt: Date;
}

interface AIAnalysis {
  isCorrect: boolean;
  accuracyScore: number;
  feedback: string;
  suggestions: string[];
  bugDescription: string;
  correctness: number;
  efficiency: number;
  codeQuality: number;
}
```

## 🔄 API Design

### RESTful Endpoints

#### Authentication API
```
POST   /api/auth/register
Body:  { email, password, displayName }
Response: { user, token, sessionToken }

POST   /api/auth/login
Body:  { email, password }
Response: { user, token, sessionToken }

POST   /api/auth/logout
Headers: { x-session-token }
Response: { message }

GET    /api/auth/me
Headers: { Authorization: Bearer <token> }
Response: { user }

GET    /api/auth/profile
Headers: { Authorization }
Response: { user, profileData }

PUT    /api/auth/profile
Headers: { Authorization }
Body:  { profileData }
Response: { user }
```

#### Challenge API
```
GET    /api/challenges
Headers: { Authorization }
Response: [ ...challenges ]

GET    /api/challenges/:id
Headers: { Authorization }
Response: { challenge }
```

#### Submission API
```
POST   /api/submissions/run
Headers: { Authorization }
Body:  { challengeId, code, testInput? }
Response: { compilerOutput, aiAnalysis?, feedback? }

POST   /api/submissions/submit
Headers: { Authorization }
Body:  { challengeId, code, timeTaken, testInput? }
Response: { submission, score?, aiAnalysis, compilerOutput, message }

GET    /api/submissions/history
Headers: { Authorization }
Response: [ ...submissions ]
```

#### Leaderboard API
```
GET    /api/leaderboard
Headers: { Authorization }
Response: [ ...rankedUsers ]

GET    /api/leaderboard/rank/:userId
Headers: { Authorization }
Response: { rank, totalUsers }
```

## 🚀 Scalability Considerations

### Current Architecture (Single Server)
- Handles ~100 concurrent users
- Single PostgreSQL instance
- In-process code compilation
- Direct API calls

### Future Scaling Strategy

#### Horizontal Scaling
```
                    Load Balancer
                         │
         ┌───────────────┼───────────────┐
         │               │               │
   ┌─────▼─────┐   ┌────▼─────┐   ┌────▼─────┐
   │  App      │   │  App     │   │  App     │
   │  Server 1 │   │  Server 2│   │  Server 3│
   └───────────┘   └──────────┘   └──────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                ┌────────▼────────┐
                │  PostgreSQL     │
                │  Primary        │
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │  PostgreSQL     │
                │  Read Replicas  │
                └─────────────────┘
```

#### Microservices Architecture
```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Auth       │   │  Challenge   │   │  Execution   │
│   Service    │   │  Service     │   │  Service     │
└──────────────┘   └──────────────┘   └──────────────┘
       │                  │                   │
       └──────────────────┼───────────────────┘
                          │
                   ┌──────▼──────┐
                   │   Message   │
                   │   Queue     │
                   │  (RabbitMQ) │
                   └─────────────┘
```

#### Caching Strategy
```
┌──────────────┐
│    Redis     │
│    Cache     │
├──────────────┤
│ - Challenges │
│ - Leaderboard│
│ - Sessions   │
│ - User Stats │
└──────────────┘
```

## 🧪 Testing Strategy

### Test Pyramid
```
                    ┌──────────┐
                    │   E2E    │  Manual + Playwright
                    │  Tests   │  (10%)
                    └──────────┘
               ┌─────────────────┐
               │  Integration    │  API + DB Tests
               │     Tests       │  (30%)
               └─────────────────┘
          ┌──────────────────────────┐
          │     Unit Tests           │  Service/Component Tests
          │                          │  (60%)
          └──────────────────────────┘
```

### Test Coverage
- **Unit Tests**: Services, utilities, helpers
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: User flows (register, solve challenge, leaderboard)

## 📈 Monitoring & Observability

### Metrics to Track
- API response times
- Database query performance
- User registration rate
- Challenge completion rate
- Average score per challenge
- Active user count
- Error rates
- Judge0 API usage & costs
- Judge0 cache hit rate
- Gemini AI request count
- Submission success/failure rates

### Logging Strategy
- Request/response logs
- Error logs with stack traces
- Performance logs
- Security audit logs

---

**Architecture designed for reliability, performance, and future growth**
