# AI Prompts — Debugging

## NuGet 401

**Prompt:** dotnet restore fails with 401 to Azure DevOps feed — fix for clean clone.

**Fix accepted:** Project-level `NuGet.Config` with nuget.org only.

## TaskStatus conflict

**Prompt:** Build error — TaskStatus ambiguous between domain and System.Threading.Tasks.

**Fix accepted:** Qualify as `Entities.TaskStatus`.

## Swagger crash

**Prompt:** API won't start — OpenApi type load exception.

**Fix accepted:** Align Swashbuckle package version with ASP.NET Core 9.

## Paged API break

**Prompt:** Frontend task list empty after Phase 6 — GET /api/tasks now returns paged object.

**Fix accepted:** `PagedTasks` type, use `.items` in TaskListPage and tests.

## File lock on build

**Issue:** Running API locks exe on Windows.

**Resolution:** Stop `dotnet run` before `dotnet build` — documented in debugging-notes.md.

## Full log

[debugging-notes.md](../debugging-notes.md)
