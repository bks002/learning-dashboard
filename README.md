# Learning Dashboard

A full-stack dashboard for tracking learning goals, project tasks, ownership, due dates, and progress — built for the .NET AI Capability Exercise.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | ASP.NET Core Web API (.NET 9) |
| ORM | Entity Framework Core + SQLite |
| Frontend | React + TypeScript + Vite |
| Backend tests | xUnit + WebApplicationFactory |
| Frontend tests | Vitest + React Testing Library |

## Prerequisites

Install these before cloning:

| Tool | Version | Verify |
|------|---------|--------|
| [.NET SDK](https://dotnet.microsoft.com/download) | 9.x | `dotnet --version` |
| [Node.js](https://nodejs.org/) | 20+ | `node --version` |
| npm | 10+ (bundled with Node) | `npm --version` |

## Clone and run locally

Everything needed to run the app is in this repository (source, migrations, lockfiles, config). Generated folders (`node_modules`, `bin`, `obj`, SQLite DB) are created on your machine and are **not** committed.

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd learning-dashboard
```

### 2. Start the backend (Terminal 1)

```bash
cd backend
dotnet restore
dotnet run --project LearningDashboard.Api --launch-profile http
```

| Item | Value |
|------|-------|
| API | http://localhost:5004 |
| Swagger | http://localhost:5004/swagger |
| Health | http://localhost:5004/api/health |

**First run:** EF Core applies migrations and creates `backend/LearningDashboard.Api/Data/learningdashboard.db` with seed data (3 users, 2 sample tasks). This file is gitignored and persists across restarts.

### 3. Start the frontend (Terminal 2)

```bash
cd frontend
npm ci
npm run dev
```

| Item | Value |
|------|-------|
| App UI | http://localhost:5173 |

The Vite dev server proxies `/api` to `http://localhost:5004`, so the UI talks to the backend without CORS setup.

### Sign in (Phase 6)

The API requires JWT authentication in Development and Production. Sign in at http://localhost:5173/login with a seeded account:

| Email | Password | Role |
|-------|----------|------|
| `alice@example.com` | `Password123!` | Admin |
| `bob@example.com` | `Password123!` | Member |
| `carol@example.com` | `Password123!` | Member |

> Use `npm ci` (not `npm install`) after clone to install exact versions from `package-lock.json`.

### 4. Optional environment file

```bash
cd frontend
cp .env.example .env   # Linux/macOS
# copy .env.example .env  # Windows
```

Default `VITE_API_BASE_URL=/api` works with the Vite proxy. Only change this if you run the API on a different host/port.

## What is committed vs generated

| Committed (in git) | Generated locally (gitignored) |
|--------------------|--------------------------------|
| Source code (`backend/`, `frontend/src/`) | `backend/**/bin/`, `backend/**/obj/` |
| EF migrations (`backend/.../Migrations/`) | `backend/LearningDashboard.Api/Data/*.db` |
| `package-lock.json`, `package.json` | `frontend/node_modules/` |
| `NuGet.Config`, solution, csproj files | `frontend/dist/` |
| `docs/`, `README.md`, `.env.example` | `.env` (if you create one) |

## Tests

```bash
# Backend — 7 integration tests (create, update, filter, search, pagination, dashboard counts, validation)
cd backend
dotnet test

# Frontend — 7 tests (dashboard counts, form validation, form submit)
cd frontend
npm test
```

Backend tests use in-memory SQLite via `WebApplicationFactory` (auth disabled in `Testing` environment). Frontend tests use Vitest + React Testing Library with mocked API calls.

## Docker (optional)

Run the full stack with Docker Compose:

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Web UI | http://localhost:8080 |
| API (direct) | http://localhost:5004 |

The web container proxies `/api` to the API container. SQLite data persists in the `api-data` Docker volume.

## Project structure

```
learning-dashboard/
├── backend/
│   ├── LearningDashboard.Api/        # Web API, entities, migrations, SQLite
│   ├── LearningDashboard.Api.Tests/  # Integration tests
│   └── LearningDashboard.sln
├── frontend/                         # React SPA (Vite)
├── docs/
│   ├── PROJECT-PLAN.md               # Phased implementation plan
│   ├── prompts/                      # Reusable AI prompt templates (Phase 6)
│   └── tool-workflow.MD              # Part A: AI workflow document
├── .github/workflows/ci.yml          # GitHub Actions (dotnet test + npm test)
├── docker-compose.yml
├── NuGet.Config                      # nuget.org only (avoids corporate feed 401s)
├── .gitignore
└── README.md
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Port 5004 already in use | Stop the other process or change `applicationUrl` in `backend/LearningDashboard.Api/Properties/launchSettings.json` |
| Port 5173 already in use | Vite will offer the next port, or stop the conflicting process |
| `dotnet restore` fails with NuGet 401 | Ensure `NuGet.Config` at repo root is present (uses nuget.org only) |
| Frontend cannot reach API | Confirm backend is running; use `http://localhost:5173` (proxy), not opening `dist/` directly in dev |
| Empty database after clone | Normal before first `dotnet run` — migrations create and seed the DB automatically |
| Data missing after delete | Do not delete `Data/learningdashboard.db` unless you want a fresh database |

## Assessment parts

- **Part A:** `docs/tool-workflow.MD` — AI workflow documentation (includes Phase 6)
- **Part B:** Core dashboard app + Phase 6 stretch features (this repo)
- **Part C:** Submission via participation form — draft answers in `docs/SUBMISSION-DRAFT.md`

See `docs/PROJECT-PLAN.md` for the full phased plan (Phases 1–6) and acceptance criteria checklist.

## Assessment lifecycle artifacts

Per the .NET AI Capability Exercise participant guide:

| Artifact | Location |
|----------|----------|
| Candidate info | [candidate-info.md](candidate-info.md) |
| AI workflow (Part A) | [tool-workflow.md](tool-workflow.md) · [docs/tool-workflow.MD](docs/tool-workflow.MD) |
| Requirements | [requirements-analysis.md](requirements-analysis.md) |
| Acceptance criteria | [acceptance-criteria.md](acceptance-criteria.md) |
| Implementation plan | [implementation-plan.md](implementation-plan.md) · [docs/PROJECT-PLAN.md](docs/PROJECT-PLAN.md) |
| Design / API / data / UI | [design-notes.md](design-notes.md), [api-contract.md](api-contract.md), [data-model.md](data-model.md), [ui-flow.md](ui-flow.md) |
| Testing | [test-strategy.md](test-strategy.md), [test-results.md](test-results.md) |
| Debugging / review | [debugging-notes.md](debugging-notes.md), [code-review-notes.md](code-review-notes.md), [review-fixes.md](review-fixes.md) |
| Submission | [reflection.md](reflection.md), [pr-description.md](pr-description.md), [final-ai-usage-summary.md](final-ai-usage-summary.md), [docs/SUBMISSION-DRAFT.md](docs/SUBMISSION-DRAFT.md) |
| Database | [database/setup-notes.md](database/setup-notes.md) |
| AI prompts | [ai-prompts/](ai-prompts/) · [docs/prompts/](docs/prompts/) |
| Cursor workflow | [tool-specific/cursor-workflow/](tool-specific/cursor-workflow/) |
