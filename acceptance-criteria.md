# Acceptance Criteria

**Project option:** Option 2 — AI Learning Dashboard / Project Tracker  
**Verified:** 2026-07-20 (Core 12/12; Stretch Phase 6 complete)

## Core

- [x] A user can create an item via the UI (`CreateTaskPage`, `TaskFlowTests.CreateTask_AppearsInList`)
- [x] A user can view dashboard summary data from the backend (`DashboardPage`, `DashboardTests`)
- [x] A user can view all items from the database (`TaskListPage`, integration tests)
- [x] A user can open an item detail view (`TaskDetailPage`)
- [x] A user can update item details and status (`EditTaskPage`, `TaskFlowTests.UpdateTask_PersistsFields`, PATCH status)
- [x] Keyword search or status filter works (`GetTasks_WithStatusFilter`, `GetTasks_WithSearch`, `TaskListPage`)
- [x] Dashboard counts update correctly from the data (`DashboardTests.DashboardCounts_UpdateAfterCreateUpdateAndComplete`)
- [x] Data remains available after restart (SQLite + EF migrations on startup)
- [x] Backend validation prevents invalid records (`CreateTask_WithEmptyTitle_ReturnsBadRequest`, `taskFormValidation.test.ts`)
- [x] Frontend shows loading, empty, success, and error states (all data pages)
- [x] No secrets committed to the repo (`.gitignore`, `@example.com` seeds)
- [x] Core flow tests pass (`dotnet test` 7/7, `npm test` 7/7)

## Validation

- [x] Required title and owner enforced client-side and server-side
- [x] Invalid owner returns `400`
- [x] `ValidationProblem` JSON on invalid POST/PUT

## Error Handling

- [x] API returns `404` for missing task
- [x] API returns `401`/`403` for auth failures (Stretch)
- [x] UI `ErrorMessage` with retry on load failures
- [x] Form merges server validation errors into fields

## Testing

- [x] Backend: create → list, update → persist, filter, search, pagination, dashboard counts, validation
- [x] Frontend: dashboard render, form validation, successful submit payload

## Documentation

- [x] `README.md` clone-to-run instructions
- [x] `tool-workflow.md` / `docs/tool-workflow.MD` (Part A)
- [x] Lifecycle artifacts in repository (this file and siblings)
- [x] Phase 6 documented in `docs/PROJECT-PLAN.md` §4

## Stretch (Phase 6)

- [x] Activity log on task detail
- [x] Multi-filter, sort, pagination
- [x] JWT auth + RBAC
- [x] Docker + CI
- [x] AI prompt templates (`docs/prompts/`, `ai-prompts/`)
