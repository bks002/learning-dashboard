# AI Prompts — Testing

## Backend integration tests

**Prompt:** Add xUnit WebApplicationFactory tests: create task appears in list, update persists, empty title returns 400, status filter works, search works, dashboard counts after create/update/complete.

**Accepted:** `LearningDashboardApiFactory` with in-memory SQLite and `Testing` environment (auth disabled).

**Phase 6 addition:** Update tests for `PagedTasksResponse`; add pagination test.

## Frontend tests

**Prompt:** Add Vitest tests for DashboardPage (mocked API counts + error), TaskForm (validation + submit), taskFormValidation unit tests.

**Phase 6 fix prompt:** Wrap DashboardPage tests with AuthProvider and MemoryRouter after auth was added.

## Results

[test-results.md](../test-results.md) — 7/7 backend, 7/7 frontend.

## Validation prompt pattern

> "After implementing [feature], run dotnet test and npm test. Fix any failures before proceeding."

Used as a gate after each phase.
