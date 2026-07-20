# Reflection

## What I Built

A full-stack **Learning Dashboard** (Option 2) with ASP.NET Core 9 API, EF Core + SQLite, and a React + TypeScript SPA. The Core delivers task tracking with dashboard summaries, search/filter, validation, and required UI states. Phase 6 Stretch added JWT authentication, RBAC, activity audit logs, pagination, Docker, CI, and a polished full-width UI.

## How I Used AI (across the lifecycle)

| Stage | Approach |
|-------|----------|
| Requirements | Broke the participant guide into `PROJECT-PLAN.md` phases before coding |
| Design | AI proposed API endpoints and folder layout; I confirmed overdue and count rules |
| Implementation | Cursor Agent generated entities, services, pages — reviewed each phase |
| Testing | AI drafted integration and component tests; I ran suites after every change |
| Debugging | Shared stack traces; AI suggested fixes; I verified with rebuild/test |
| Documentation | AI helped draft README and lifecycle artifacts; I own accuracy and voice |
| Review | AI flagged missing states and RBAC placement; I accepted or rejected per scope |

## What AI Helped With Most

- Boilerplate speed (entities, DTOs, minimal API endpoints, React page scaffolding)
- Consistent error/loading/empty state components across pages
- Integration test setup with `WebApplicationFactory`
- Documentation structure matching the assessment guide

## What AI Got Wrong

- Initially used `Results.Unauthorized(body)` — invalid minimal API overload
- Paged API change in Phase 6 broke frontend until types were updated together
- Suggested workspace root switching that caused interruptions — skipped when unnecessary
- `SUBMISSION-DRAFT.md` "future improvements" listed items already done in Phase 6 until corrected

## How I Validated AI Output

- `dotnet build` / `dotnet test` after every backend step
- `npm test` / `npm run build` after frontend changes
- Manual browser verification against 12 Core acceptance criteria
- Compared dashboard counts to raw SQL / API responses after mutations
- Clone-to-run mindset: no committed `node_modules`, `bin`, or `.db`

## What I Would Improve Next

- Playwright E2E covering login and full task lifecycle
- Integration tests for auth, RBAC 403, and activity log endpoints
- Environment-based JWT secrets (no key in `appsettings.json` for production)
- Toast notifications instead of inline success messages only

## Reusable Workflow

- **Plan first:** `PROJECT-PLAN.md` + `implementation-plan.md`
- **Prompt library:** `ai-prompts/` + `docs/prompts/`
- **Cursor context:** `tool-specific/cursor-workflow/`
- **Test gate:** never merge a phase without green `dotnet test` and `npm test`
- **Document as you go:** `tool-workflow.md` / `docs/tool-workflow.MD`, not at the end
