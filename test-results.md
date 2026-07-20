# Test Results

**Recorded:** 2026-07-20  
**Environment:** Windows, .NET SDK 9.0.x, Node.js 20+, local development machine

## Backend — `dotnet test`

```
Passed!  - Failed: 0, Passed: 7, Skipped: 0, Total: 7
```

| Test | Result |
|------|--------|
| `TaskFlowTests.CreateTask_AppearsInList` | Pass |
| `TaskFlowTests.UpdateTask_PersistsFields` | Pass |
| `TaskFlowTests.CreateTask_WithEmptyTitle_ReturnsBadRequest` | Pass |
| `TaskFlowTests.GetTasks_WithStatusFilter_ReturnsMatchingTasks` | Pass |
| `TaskFlowTests.GetTasks_WithSearch_ReturnsMatchingTasks` | Pass |
| `TaskFlowTests.GetTasks_WithPagination_ReturnsPagedResult` | Pass |
| `DashboardTests.DashboardCounts_UpdateAfterCreateUpdateAndComplete` | Pass |

**Command:**
```bash
cd backend
dotnet test
```

## Frontend — `npm test`

```
Test Files  3 passed (3)
Tests       7 passed (7)
```

| File | Tests | Result |
|------|-------|--------|
| `DashboardPage.test.tsx` | 2 | Pass |
| `TaskForm.test.tsx` | 2 | Pass |
| `taskFormValidation.test.ts` | 3 | Pass |

**Command:**
```bash
cd frontend
npm test
```

## Production Build — `npm run build`

```
✓ built successfully (tsc -b && vite build)
```

## CI

GitHub Actions workflow `.github/workflows/ci.yml` runs both test suites on push/PR to `main`.

## Manual Verification (Core acceptance)

- [x] Create task via UI → appears in list
- [x] Dashboard counts update after create/complete
- [x] Status filter and search in browser
- [x] Login at `/login` with seeded account (Stretch)
- [x] Activity log visible after task update (Stretch)
- [x] Data persists after backend restart

## Notes

- Integration tests use in-memory SQLite; not the on-disk `learningdashboard.db`
- Frontend tests mock `getDashboardSummary`; no live API required for `npm test`
