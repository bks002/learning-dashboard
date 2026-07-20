# Part C — Submission Draft

> Draft answers for the participation form. Copy, edit in your own voice, then submit via the official form.

---

## Repository URL

```
https://github.com/bks002/learning-dashboard
```

> Repo remote is configured. Run `gh auth login` once, then `gh repo create learning-dashboard --public --source=. --remote=origin --push` if the repo does not exist yet.

---

## 1. What you built

I built a **full-stack Learning Dashboard** for the .NET AI Capability Exercise — a task-tracking app for learning goals with ownership, priorities, due dates, and progress visibility.

**Backend (ASP.NET Core 9 + EF Core + SQLite)**

- REST API with minimal endpoints under `/api`
- Entities: `User`, `ProjectTask` with enums for priority, status, and role
- Dashboard summary endpoint computing five counts: total, completed, in-progress, overdue, and high-priority tasks
- CRUD for tasks plus a status-only PATCH endpoint
- Global validation via data annotations (`400 ValidationProblem` on invalid input)
- EF Core migrations with seed data (3 users, 2 sample tasks)
- SQLite database created automatically on first run; data persists across restarts
- Swagger UI at `/swagger` (Development)
- **6 integration tests** covering create → list, update → persist, filters, search, dashboard counts, and validation

**Frontend (React + TypeScript + Vite)**

- Five routed pages: Dashboard, Task List, Create Task, Task Detail, Edit Task
- API client with typed errors and Vite dev proxy (`/api` → backend)
- Required UI states on all data-fetching views: **loading**, **empty**, **error**, **success**
- Task form with client-side validation (blur + submit) merged with server validation errors
- Responsive layout with shared styling and accessible form labels

**Documentation**

- `docs/PROJECT-PLAN.md` — phased implementation plan
- `docs/tool-workflow.MD` — Part A AI workflow document (updated throughout build)

---

## 2. How you used AI

**Tool:** Cursor (Agent mode)

**Approach:**

1. Started with a written plan (`PROJECT-PLAN.md`) and worked in small verified steps
2. Provided the agent with entity specs, folder conventions, API contract, and acceptance criteria before codegen
3. Implemented backend first (entities → DbContext → API → tests), then frontend (types → API client → pages → validation)
4. Ran `dotnet build` / `dotnet test` / `npx tsc` after each step as a quality gate
5. Documented AI usage incrementally in `tool-workflow.MD` (not at the end)

**What AI helped with:** scaffolding, DTOs, endpoint wiring, React components, CSS layout, test boilerplate, troubleshooting build errors.

**What I owned:** business rules (overdue = past due and not completed; high-priority count includes all statuses), architecture choices (minimal APIs, enum-as-string, restrict delete on ownership), reviewing generated code against acceptance criteria, and manual verification.

**What I did not share with AI:** secrets, real credentials, employer-specific feeds, or PII.

---

## 3. What you'd improve with more time

| Area | Improvement |
|------|-------------|
| Testing | More frontend tests (task list filters, edit flow, error boundaries) |
| API | Pagination, sorting, multi-filter on task list |
| Features | Activity log / audit trail for task changes |
| Security | JWT auth and role-based access (Admin vs Member) |
| DevOps | Docker Compose + GitHub Actions CI running `dotnet test` and `npm test` on every push |
| UX | Toast notifications, optimistic updates, keyboard shortcuts |
| Accessibility | Full WCAG audit, screen-reader testing |

---

## 4. Challenges and how you solved them

| Challenge | Solution |
|-----------|----------|
| NuGet restore failed with 401 (corporate Azure feed) | Added project-level `NuGet.Config` scoped to nuget.org only |
| EF Core 10 incompatible with .NET 9 | Pinned EF Core and tools to 9.0.15 |
| `TaskStatus` naming conflict with `System.Threading.Tasks.TaskStatus` | Used fully qualified `Entities.TaskStatus` in C# |
| Swagger v10 crashed on startup (`Microsoft.OpenApi` type load) | Downgraded to Swashbuckle 6.9.0 |
| API rejected enum JSON until string converter added | Registered `JsonStringEnumConverter` in `Program.cs` |
| CORS friction in local dev | Vite proxy `/api` → `http://localhost:5004`; relative API base URL |
| Form validation UX (client + server errors) | Extracted `taskFormValidation.ts`; blur + submit validation; per-field server error clearing |
| Clone-to-run for GitHub users | Comprehensive README, `.gitignore` for generated files, `package-lock.json` + migrations committed |

---

## Core acceptance criteria (Section 6) — verified

All **12/12** criteria passed on 2026-07-20.

| # | Criterion | Result |
|---|-----------|--------|
| 1 | Create via UI | Pass — integration test + `TaskForm` submit test + `CreateTaskPage` |
| 2 | Dashboard from backend | Pass — API + `DashboardPage.test.tsx` |
| 3 | List from DB | Pass — integration test + `TaskListPage` |
| 4 | Task detail view | Pass — `TaskDetailPage` + API detail |
| 5 | Update details/status | Pass — integration test + `EditTaskPage` + PATCH actions |
| 6 | Search or status filter | Pass — 2 integration tests + `TaskListPage` UI |
| 7 | Dashboard counts correct | Pass — `DashboardTests` + live API |
| 8 | Data survives restart | Pass — SQLite file + migrations on startup |
| 9 | Backend validation | Pass — 400 on invalid create (API + client tests) |
| 10 | Loading/empty/success/error | Pass — all 5 pages use state components |
| 11 | No secrets | Pass — scan + `.gitignore` |
| 12 | Core tests pass | Pass — `dotnet test` 6/6, `npm test` 7/7 |

See `docs/PROJECT-PLAN.md` §6 for full evidence column.

---

## Pre-submission checklist

| Item | Status |
|------|--------|
| Public/shareable repo URL | ☑ https://github.com/bks002/learning-dashboard |
| `docs/tool-workflow.MD` complete | ☑ |
| `README.md` with run instructions | ☑ |
| `dotnet test` passes (6 tests) | ☑ |
| `npm test` passes | ☑ |
| No secrets in repository | ☑ |
| Participation form answers drafted | ☑ (this document) |

---

## Quick run instructions (for reviewers)

```bash
# Terminal 1 — backend
cd backend
dotnet restore
dotnet run --project LearningDashboard.Api --launch-profile http

# Terminal 2 — frontend
cd frontend
npm ci
npm run dev
```

Open http://localhost:5173

```bash
# Tests
cd backend && dotnet test
cd frontend && npm test
```
