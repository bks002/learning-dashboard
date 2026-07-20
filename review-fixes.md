# Review Fixes

Changes applied after self-review and AI-assisted review.

| # | Finding | Fix | Files |
|---|---------|-----|-------|
| 1 | NuGet 401 on clone | Root `NuGet.Config` → nuget.org only | `NuGet.Config` |
| 2 | `TaskStatus` ambiguity | `Entities.TaskStatus` qualification | Services, tests, seed |
| 3 | Swagger startup crash | Compatible Swashbuckle version | `.csproj` |
| 4 | Enum JSON mismatch | `JsonStringEnumConverter` | `Program.cs` |
| 5 | Missing UI states on list page | Empty/loading/error on `TaskListPage` | `TaskListPage.tsx` |
| 6 | Server errors not on form fields | Merge API validation into `TaskForm` | `TaskForm.tsx` |
| 7 | Phase 6 paged API break | Update types, tests, list page | `api.ts`, `TaskFlowTests.cs`, `TaskListPage.tsx` |
| 8 | Unauthorized response compile error | `Results.Json(..., 401)` | `AuthEndpoints.cs` |
| 9 | Dashboard tests missing auth context | `AuthProvider` + `MemoryRouter` in tests | `DashboardPage.test.tsx` |
| 10 | Centered narrow layout | Full-width `#root` + responsive padding | `index.css`, `AppLayout.css` |
| 11 | SUBMISSION-DRAFT test counts stale | Updated to 7/7 backend tests | `docs/SUBMISSION-DRAFT.md` |
| 12 | Missing lifecycle artifacts | Added root-level assessment docs | This commit |

## Verification after fixes

```bash
cd backend && dotnet test    # 7/7
cd frontend && npm test      # 7/7
cd frontend && npm run build # success
```

Manual: login → dashboard → create → list → edit → activity log.
