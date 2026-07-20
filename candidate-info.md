# Candidate Information

| Field | Value |
|-------|-------|
| **Name** | Bhavesh Kumar Singh |
| **Role** | Developer (.NET competency exercise) |
| **Primary Technology Stack** | ASP.NET Core 9, EF Core, SQLite, React, TypeScript, Vite |
| **Primary AI Tool Used** | Cursor (Agent mode) |
| **Project Option Selected** | **Option 2 — Frontend-Heavy: AI Learning Dashboard / Project Tracker** |
| **Assessment Start Date** | 2026-07-20 |
| **Submission Date** | 2026-07-20 |

## Project Summary

A full-stack learning dashboard for tracking project tasks, ownership, priorities, due dates, and progress. The mandatory **Core** delivers create/list/detail/update flows, dashboard summary cards, search/filter, validation, UI states, and tests. **Stretch (Phase 6)** adds JWT auth with RBAC, activity audit log, pagination/sort/multi-filter, Docker, CI, reusable prompt templates, and UI polish.

**Repository:** https://github.com/bks002/learning-dashboard

## Tools Used

| Tool | Purpose |
|------|---------|
| Cursor Agent | Scaffolding, implementation, tests, documentation |
| .NET SDK 9 | Backend API, EF Core migrations, xUnit integration tests |
| Node.js 20 + Vite | React SPA, Vitest + RTL |
| SQLite | Local persistence (gitignored DB file, migrations in repo) |
| Docker Compose | Optional full-stack container run |
| GitHub Actions | CI (`dotnet test` + `npm test`) |

## Setup Summary

1. `cd backend && dotnet run --project LearningDashboard.Api --launch-profile http`
2. `cd frontend && npm ci && npm run dev`
3. Open http://localhost:5173/login — sign in with `alice@example.com` / `Password123!`

See [README.md](README.md) for full clone-to-run instructions.
