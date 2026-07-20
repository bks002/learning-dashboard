# Test Strategy

## Test Scope

| Tier | Tool | Scope |
|------|------|-------|
| Backend integration | xUnit + `WebApplicationFactory` | API create/list/update/filter/search/pagination, dashboard counts, validation |
| Frontend component | Vitest + React Testing Library | Dashboard render, form validation, submit payload |

Auth is **disabled** in the `Testing` environment so integration tests do not require JWT.

## Unit Tests

Not separately required for Core. Business logic (dashboard counts, RBAC) covered by integration tests and manual verification.

## Component Tests

| File | Tests | Coverage |
|------|-------|----------|
| `DashboardPage.test.tsx` | 2 | Renders counts from mocked API; error state |
| `TaskForm.test.tsx` | 2 | Empty title validation; successful submit |
| `taskFormValidation.test.ts` | 3 | Required fields; valid form passes |

## API / Integration Tests

| File | Tests | Coverage |
|------|-------|----------|
| `TaskFlowTests.cs` | 6 | Create→list, update persist, validation, status filter, search, pagination |
| `DashboardTests.cs` | 1 | Dashboard counts after create/update/complete |

**Factory:** `LearningDashboardApiFactory` — in-memory SQLite, `Testing` environment.

## Edge Case Tests

| Case | Test |
|------|------|
| Empty title create | `CreateTask_WithEmptyTitle_ReturnsBadRequest` |
| Status filter | `GetTasks_WithStatusFilter_ReturnsMatchingTasks` |
| Search | `GetTasks_WithSearch_ReturnsMatchingTasks` |
| Pagination shape | `GetTasks_WithPagination_ReturnsPagedResult` |
| Dashboard drift | `DashboardCounts_UpdateAfterCreateUpdateAndComplete` |

## Tests Not Covered (and why)

| Area | Reason |
|------|--------|
| JWT login flow E2E | Stretch; manual verification; tests bypass auth |
| Activity log API | Stretch; manual verification |
| RBAC 403 paths | Stretch; manual verification with Member account |
| Full browser E2E (Playwright) | Out of scope for exercise timebox |
| Docker build in CI | Optional; workflow runs unit/integration tests only |

## How to Run

```bash
cd backend && dotnet test
cd frontend && npm test
```

Results recorded in [test-results.md](test-results.md).
