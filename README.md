<h1 align="center">BugRank</h1>
<p align="center"><b>Debugging-first coding platform where engineers fix broken production-style code and compete on execution quality.</b></p>

<p align="center">
  <a href="https://bugrank.in"><img src="https://img.shields.io/badge/Live-bugrank.in-0a0a0a?style=for-the-badge&logo=vercel" alt="Live" /></a>
  <img src="https://img.shields.io/badge/Stage-Production-111111?style=for-the-badge" alt="Production" />
  <img src="https://img.shields.io/badge/Monorepo-Client%20%7C%20Server%20%7C%20Shared-111111?style=for-the-badge" alt="Monorepo" />
  <img src="https://img.shields.io/badge/License-MIT-111111?style=for-the-badge" alt="MIT License" />
</p>

## Executive Summary

BugRank is a full-stack platform designed to evaluate real debugging ability instead of solution-template memorization.

- **Product:** users receive buggy code, patch it, run diagnostics, and submit fixes for score
- **Evaluation:** `Run` for iterative feedback + `Submit` for scored validation
- **Scoring:** weighted by correctness, attempts, diff size, and time-to-fix
- **System Design:** React + Express monorepo with shared contracts and self-hosted execution pipeline
- **Security posture:** rate limits, Helmet, CORS policy, execution constraints, and isolated runner jobs
- **Outcome:** measurable debugging performance through profiles and global leaderboard

---

## What Makes It Recruiter-Relevant

- Focuses on **maintaining and fixing existing systems**, not greenfield toy prompts
- Tests **practical engineering behavior**: diagnosis, minimal patching, and feedback-driven iteration
- Demonstrates end-to-end ownership: **frontend UX, backend APIs, auth, scoring logic, and infra**

---

## Core Capabilities

- Bug-fix challenge feed (difficulty + language)
- In-browser editor workflow
- AI-assisted analysis feedback loop
- Self-hosted runtime execution pipeline
- User profiles and performance tracking
- Global leaderboard ranking

---

## Tech Stack

**Frontend**
- React, TypeScript, Vite, TailwindCSS, Monaco Editor

**Backend**
- Node.js, Express, TypeScript, PostgreSQL, Passport Google OAuth

**Infra**
- Dockerized server runtime
- Sandbox runner scripts (`scripts/run_all.sh`, `scripts/run_cpp.sh`)
- Workspace monorepo (`client`, `server`, `shared`)

---

## Repository Structure

```text
bugrank/
├── client/    # React frontend
├── server/    # Express API + scoring/evaluation services
├── shared/    # Shared types/contracts
├── scripts/   # Execution runner scripts
└── Dockerfile
```

---

## Local Setup

### 1) Install
```bash
npm run install:all
```

### 2) Configure env

Client (`/client/.env`)
```env
VITE_API_URL=http://localhost:5000
```

Server (`/server/.env`)
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

### 3) Run
```bash
npm run dev
```

### 4) Build
```bash
npm run build
```

---

## Build Notes

[I built a competitive coding platform from scratch — here’s how it works](https://medium.com/@jsubhra502/i-built-a-competitive-coding-platform-from-scratch-heres-how-it-works-390814f334ee)
