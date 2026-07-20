# AI Prompts — Implementation

## Phase 1 — Backend foundation

**Prompt:** Create User and ProjectTask entities with enums, AppDbContext, SQLite config, DbSeeder with 3 users and 2 tasks, InitialCreate migration, ValidationFilter, CORS for localhost:5173.

**Accepted:** Entity annotations, `HasData` seed, auto-migrate on startup.

**Rejected:** Putting business logic in endpoints — moved to services in Phase 2.

## Phase 2 — Core API

**Prompt:** Implement DashboardService, TaskService, UserService and 7 endpoints under /api.

**Accepted:** Dashboard summary DTO, task CRUD, status PATCH, owner validation.

## Phase 3 — Frontend

**Prompt:** Scaffold React pages with react-router-dom, api.ts with ApiError, TaskForm with validation, all UI states.

**Accepted:** Debounced search, status filter, shared CSS.

## Phase 6 — Stretch

**Prompt:** Add ActivityLog, JWT auth with Admin/Member RBAC, pagination/filter/sort on tasks, login page, Docker, CI.

**Accepted:** All stretch items after Core tests passed.

**Changed:** Updated frontend for paged API response; fixed `Results.Json` for 401.

## Reusable templates

See [docs/prompts/](../docs/prompts/):
- `01-backend-entities.md`
- `02-api-endpoints.md`
- `03-frontend-page-states.md`

## Full step-by-step log

[docs/tool-workflow.MD](../docs/tool-workflow.MD)
