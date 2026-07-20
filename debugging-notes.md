# Debugging Notes

## Issue 1: NuGet restore 401 (corporate Azure feed)

### Problem
`dotnet restore` failed with HTTP 401 against a corporate Azure DevOps NuGet feed not available in a clean clone.

### How I Investigated
Read the full error URL in restore output; checked for global vs project `NuGet.Config`.

### How AI Helped
Suggested a project-level `NuGet.Config` clearing other sources and pinning nuget.org only.

### What I Validated
`dotnet restore` succeeded after adding root `NuGet.Config`.

### Final Fix
Committed `NuGet.Config` at repository root with nuget.org as sole package source.

---

## Issue 2: `TaskStatus` naming conflict

### Problem
Build error: `TaskStatus` ambiguous between domain enum and `System.Threading.Tasks.TaskStatus`.

### How I Investigated
Compiler error pointed to entity and DTO files.

### How AI Helped
Generated entities; I flagged the conflict.

### What I Validated
Fully qualified `Entities.TaskStatus` in C# where needed.

### Final Fix
Use `Entities.TaskStatus` in services, tests, and seed data.

---

## Issue 3: Swagger / OpenAPI startup crash

### Problem
API failed to start with `Microsoft.OpenApi` type load exception on certain package versions.

### How AI Helped
Suggested aligning Swashbuckle with ASP.NET Core 9 and downgrading if needed.

### Final Fix
Pinned compatible Swashbuckle version; Swagger works in Development at `/swagger`.

---

## Issue 4: Enum JSON deserialization

### Problem
Frontend sent enum strings; API expected numeric enums by default.

### Final Fix
Registered `JsonStringEnumConverter` in `Program.cs` for HTTP JSON options.

---

## Issue 5: API file lock during build (Windows)

### Problem
`dotnet build` failed — `LearningDashboard.Api.exe` locked by running `dotnet run` process.

### How I Investigated
MSB3027 error listed locking PID.

### Final Fix
Stop the running API process before rebuild; documented in troubleshooting.

---

## Issue 6: Paged tasks response broke frontend/tests

### Problem
Phase 6 changed `GET /api/tasks` from array to paged object; frontend and tests expected flat list.

### How AI Helped
Updated `TaskFlowTests` to deserialize `PagedTasksResponse`; updated `api.ts` and `TaskListPage`.

### What I Validated
`dotnet test` 7/7; manual task list pagination in browser.

### Final Fix
`PagedTasks` type + `.items` access in UI and tests.

---

## Issue 7: `Results.Unauthorized` invalid overload

### Problem
Auth endpoint compile error — `Results.Unauthorized()` does not accept body in minimal APIs.

### Final Fix
`Results.Json(new { error }, statusCode: 401)`.

---

## Issue 8: Frontend tests after auth + Link components

### Problem
`DashboardPage.test.tsx` failed — `useAuth` and `Link` require providers.

### Final Fix
Wrap tests with `AuthProvider` + `MemoryRouter`; mock `authStorage`.
