# Requirement Analysis

## Selected Project Option

**Option 2 — Frontend-Heavy: AI Learning Dashboard / Project Tracker**

## My Understanding (in my own words)

Build a small dashboard where teams track learning and project tasks: who owns each item, its priority, status, and due date. Users need a summary view (counts), a searchable/filterable list, and create/edit/detail flows. The signature Core judgment piece is **frontend state handling** — every data-fetching screen must show loading, empty, success, and error states clearly. Data must persist in a real database across restarts.

Stretch (optional) can add audit logs, richer filters, auth, Docker, and CI — implemented in Phase 6 after Core was solid.

## Functional Requirements

### Core (mandatory)

| # | Requirement |
|---|-------------|
| F1 | Create a `ProjectTask` via UI |
| F2 | Dashboard with 5 summary cards from backend counts |
| F3 | List tasks from database |
| F4 | View task detail |
| F5 | Update task fields (title, description, priority, status, owner, due date) |
| F6 | Mark task in progress or completed |
| F7 | Keyword search **or** status filter |
| F8 | Persist all data; survive application restart |
| F9 | Validate required fields (backend + meaningful UI errors) |
| F10 | Loading, empty, success, and error states on frontend |

### Stretch (Phase 6 — implemented)

| # | Requirement |
|---|-------------|
| S1 | `ActivityLog` audit trail per task |
| S2 | Priority filter, sort, pagination on task list |
| S3 | JWT login, protected routes, Admin/Member RBAC |
| S4 | Responsive layout and accessibility improvements |
| S5 | Docker Compose + GitHub Actions CI |
| S6 | Reusable AI prompt templates in repo |

## Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Stack | ASP.NET Core Web API, EF Core, SQLite, React + TypeScript |
| Clone-to-run | README, migrations, lockfiles, no committed secrets |
| Tests | Integration tests (create → list → update) + dashboard counts; frontend component tests |
| Dev experience | Vite proxy to API; Swagger in Development |

## Assumptions

- Users are **seeded only** (no user-management UI in Core)
- Single-tenant local SQLite (no multi-tenant `CompanyId`)
- Auth is optional for Core; added in Stretch with demo passwords
- Overdue = `dueDate < today (UTC date)` AND `status != Completed`
- High-priority count includes **all** statuses with `priority == High`

## Clarifications (questions for a product owner)

1. Should Members create tasks only for themselves, or for any owner? → **Implemented:** any owner on create; Members can only **edit** own tasks (Stretch RBAC).
2. Is category a free-text field? → **Yes**, optional string.
3. Should completed tasks count as overdue? → **No**, excluded from overdue count.

## Edge Cases

| Case | Expected behavior |
|------|-------------------|
| Empty task list | Empty state with CTA to create |
| Invalid task id in URL | Error / not-found message |
| Empty title on create | `400` from API; client validation message |
| Invalid owner id | `400` from API |
| API unreachable | Error state with retry |
| Unauthenticated access (Stretch) | Redirect to `/login` |
| Member edits another user's task | `403` from API |
| Filter + search returns no rows | Empty state with filter hint |
