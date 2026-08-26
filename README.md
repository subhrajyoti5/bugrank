# BugRank

BugRank is a debugging-first coding platform where users fix real bugs in broken codebases, submit patches, and compete on a live leaderboard.

**Live:** [bugrank.in](https://bugrank.in)

---

## Why BugRank

Most coding platforms reward writing fresh solutions.  
BugRank evaluates practical engineering signals:

- reading and understanding existing code
- producing minimal, correct fixes
- handling runtime/compiler feedback quickly
- optimizing under time and attempt pressure

---

## Core Product Capabilities

- **Challenge workflow:** browse bug-fix challenges by difficulty and language
- **Editor experience:** in-browser coding with run/submit actions
- **Dual evaluation path:**
  - `Run` for diagnostics + AI feedback
  - `Submit` for scored evaluation and leaderboard impact
- **Scoring model:** penalties for extra attempts, larger diffs, and higher time-to-fix
- **Auth + profiles:** Google OAuth + user progression stats
- **Leaderboard:** rank by cumulative performance and successful fixes

---

## Technical Highlights

- **Monorepo architecture** with shared types across client/server
- **Self-hosted code execution pipeline** (sandboxed job directory + runner scripts)
- **Production security middleware:** Helmet, CORS policy, request rate limiting
- **Execution safeguards:** input/code size limits, timeouts, queueing, and cached results
- **AI-assisted analysis** via Gemini for code quality and feedback loops

---

## Tech Stack

### Frontend
- React + TypeScript + Vite
- TailwindCSS
- Monaco Editor

### Backend
- Node.js + Express + TypeScript
- PostgreSQL (`pg`)
- Passport Google OAuth

### Shared/Infra
- Workspace-based monorepo (`client`, `server`, `shared`)
- Dockerized server runtime
- Shell-based sandbox runner (`scripts/run_all.sh`, `scripts/run_cpp.sh`)

---

## Repository Structure

```text
bugrank/
├── client/    # React frontend
├── server/    # Express API + evaluation services
├── shared/    # Shared types/contracts
├── scripts/   # Code execution runner scripts
└── Dockerfile
```

---

## Local Setup

### 1) Install dependencies

```bash
npm run install:all
```

### 2) Configure environment

Client (`/client/.env`):
```env
VITE_API_URL=http://localhost:5000
```

Server (`/server/.env`) commonly used variables:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=bugrank_auth
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=change_me
JWT_EXPIRES_IN=24h

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

GEMINI_API_KEY=...
```

### 3) Run in development

```bash
npm run dev
```

---

## Build

```bash
npm run build
```

---

## Blog / Build Story

Detailed architecture and build notes:  
[I built a competitive coding platform from scratch — here’s how it works](https://medium.com/@jsubhra502/i-built-a-competitive-coding-platform-from-scratch-heres-how-it-works-390814f334ee)
