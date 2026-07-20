# Code Review Notes

## AI-Assisted Review Summary

Used Cursor Agent to review generated code for:
- Naming consistency across entities, DTOs, and TypeScript types
- Missing UI states on data-fetching pages
- Validation coverage (client + server)
- Secret leakage in committed files
- RBAC enforcement location (service layer vs endpoints)

## My Review Observations

| Area | Observation | Action |
|------|-------------|--------|
| Dashboard counts | Must use single service method | Kept logic in `DashboardService` only |
| Overdue rule | Past due AND not completed | Verified in test + manual check |
| Delete behavior | Restrict on `OwnerId` FK | Prevents orphan tasks |
| Auth in tests | Must not break integration suite | `Testing` env disables JWT |
| API breaking change | Paged tasks in Phase 6 | Updated frontend + tests together |
| Password storage | Demo only | `Password123!` seeded at startup; documented in README |
| JWT key in appsettings | Dev placeholder | Acceptable for exercise; not production |

## Changes Made After Review

1. Added `NuGet.Config` for clone-to-run reliability
2. Qualified `Entities.TaskStatus` to fix compile conflicts
3. Added `JsonStringEnumConverter` for API/frontend enum alignment
4. Moved RBAC checks into `TaskService` (not scattered in endpoints)
5. Added `ProtectedRoute` so unauthenticated users cannot hit dashboard
6. Updated integration tests for `PagedTasksResponse`
7. Full-width layout fix after UI review (removed `max-width` on `#root`)

## Suggestions Rejected (and why)

| Suggestion | Why rejected |
|------------|--------------|
| Add Redis caching for dashboard | Over-engineering for SQLite exercise |
| Switch to PostgreSQL for Core | SQLite meets guide; simpler clone-to-run |
| Global Redux store | Local component state sufficient for app size |
| Force HTTPS in local dev | Complicates Vite proxy; HTTP fine for exercise |

See [review-fixes.md](review-fixes.md) for post-review change log.
