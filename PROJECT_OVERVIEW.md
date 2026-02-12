# BugPulse - Project Overview

## 🎯 Core Idea

**BugPulse** is a competitive programming platform where developers compete to find and fix bugs in code as quickly and efficiently as possible. Instead of solving algorithmic puzzles, you're debugging real-world code issues from actual codebases.

### The Challenge
- Users are presented with buggy code (C++ and Java)
- They must identify the bug and fix it with minimal changes
- The faster and cleaner the fix, the higher the score

### Competitive Edge
- **Real-time leaderboard** tracking top debuggers
- **Smart scoring system** that rewards:
  - Speed (faster fixes = higher scores)
  - Efficiency (fewer lines changed = better)
  - Accuracy (correct solutions on first try)
  - Code quality (analyzed by AI)

### Why It's Different
Traditional coding platforms focus on algorithmic problem-solving. BugPulse focuses on a critical real-world skill: **debugging**. This mirrors actual software development where debugging consumes 50% of development time.

## 🚀 Key Features

### 1. Authentication System
- **Email/Password authentication** with PostgreSQL
- **Google OAuth 2.0** integration for social login
- Email normalization (case-insensitive, trimmed)
- Secure bcrypt password hashing (salt rounds: 10)
- JWT + Session-based authentication (24-hour sessions)
- User profiles with statistics tracking
- Automatic user creation for OAuth sign-ins

### 2. Challenge System
- **15 pre-built C++ debugging challenges**
- Categories: Memory leaks, buffer overflows, integer overflows, const correctness
- Each challenge has:
  - Buggy code to fix
  - Test cases for validation
  - Difficulty levels (easy/medium/hard)
  - Base score (100-300 points)

### 3. Code Editor
- **Monaco Editor** (VS Code's editor engine)
- Syntax highlighting for C++ and Java
- Real-time diff viewer showing code changes
- Line-by-line comparison with original code

### 4. Code Execution & Validation
- **Self-hosted execution strategy**:
  - "Run" button: AI-powered code analysis (Gemini AI) + actual execution - FREE and instant
  - "Submit" button: Self-hosted C++ compilation and execution - FREE and accurate
- Automatic test case validation
- Compilation error detection with detailed feedback
- Docker containerized execution environment
- VPS-hosted judging system (Hostinger KVM)
- Memory leak detection
- Output comparison with expected results
- SHA-256 result caching (1-hour TTL)

### 5. AI-Powered Analysis
- **Gemini AI integration** for instant code feedback on "Run"
- Smart caching with 1-hour TTL to optimize performance
- Fallback local analysis when AI is unavailable
- Evaluates:
  - Correctness of the fix
  - Code efficiency
  - Code quality and best practices
- Rate limiting: 30 runs per 5 minutes, 15 submissions per 15 minutes

### 6. Scoring Algorithm
```
Score = BaseScore × (1 - 0.1 × Attempts) × (1 - 0.05 × LinesChanged) × (1 - 0.001 × TimeInSeconds)
```
Penalties for:
- Multiple attempts
- Excessive code changes
- Slow completion time

### 7. Leaderboard
- Global ranking system
- Shows total score, submissions, and success rate
- Real-time updates
- User rank calculation

### 8. User Dashboard
- Personal statistics
- Submission history
- Progress tracking
- Challenge completion status

## 🎓 Learning Outcomes

### For Users
1. **Debugging Skills**: Master finding and fixing bugs quickly
2. **Code Quality**: Learn to write clean, minimal fixes
3. **Time Management**: Balance speed with accuracy
4. **Problem Solving**: Develop systematic debugging approaches

### Technical Skills Developed
- Memory management (C++/Java)
- Understanding compiler errors
- Test-driven debugging
- Code optimization
- Best practices in OOP

## 🌟 Use Cases

### 1. Technical Interview Preparation
- Practice debugging under time pressure
- Build confidence in code review
- Prepare for live coding rounds

### 2. Team Training
- Companies can use BugPulse for:
  - Onboarding new developers
  - Team building competitions
  - Skill assessment
  - Code review practice

### 3. Educational Tool
- Computer Science courses
- Coding bootcamps
- Self-paced learning
- Competitive programming clubs

### 4. Recruitment
- Pre-screening candidates
- Technical assessments
- Debugging skill evaluation
- Timed coding challenges

## 💡 Core Philosophy

**"Great developers don't just write code—they fix it faster than they break it."**

BugPulse believes that debugging is an art. The best developers aren't those who never make mistakes, but those who can identify and fix bugs systematically and efficiently. This platform gamifies that essential skill, making debugging practice engaging and competitive.

## 🎮 User Journey

1. **Sign Up** → Create account with email/password
2. **Browse Challenges** → See list of 15 debugging challenges
3. **Select Challenge** → View buggy code and description
4. **Fix the Bug** → Edit code in Monaco editor
5. **Run Tests** → Validate with test cases
6. **Submit** → Get scored based on performance
7. **View Leaderboard** → See your rank among competitors
8. **Iterate** → Try more challenges, improve score

## 📊 Success Metrics

- **User Engagement**: Number of challenges attempted
- **Completion Rate**: Percentage of solved challenges
- **Average Score**: Quality of solutions
- **Time to Solve**: Debugging efficiency
- **Leaderboard Activity**: Competitive participation

## 🔮 Future Vision

### Planned Features
- More programming languages (Python, JavaScript, Go)
- User-submitted challenges
- Team competitions
- Code review features
- Badges and achievements
- Difficulty progression system
- Tutorial mode for beginners
- Video explanations for solutions
- Community discussions

### Scalability
- Multi-tenant architecture
- Cloud deployment (Azure/AWS)
- Horizontal scaling for code execution
- Caching layer for performance
- CDN for static assets

## 🎯 Target Audience

### Primary Users
- Computer Science students
- Junior developers (0-3 years experience)
- Interview candidates
- Coding bootcamp students

### Secondary Users
- Technical recruiters
- Engineering managers
- Educators and instructors
- Competitive programmers

## 🏆 Competitive Advantage

### Why BugPulse Stands Out
- Focus on debugging, not algorithms
- Real-world code scenarios
- AI-powered feedback
- Faster challenges (5-15 minutes each)
- Professional debugging scenarios
- Actual compiler integration
- Detailed performance metrics
- Educational focus

### vs General Practice
- Gamification and competition
- Instant feedback
- Structured learning path
- Community and leaderboard

---

**Built with ❤️ for developers who love fixing things**
