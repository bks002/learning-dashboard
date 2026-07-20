# PR Description

## Summary

Implements **Option 2: AI Learning Dashboard / Project Tracker** for the .NET AI Capability Exercise — Core features (Phases 1–5) plus Stretch features (Phase 6): JWT auth/RBAC, activity audit log, paginated multi-filter task list, Docker, CI, UI polish, and full lifecycle documentation artifacts.

## Features Implemented

### Core
- Dashboard with 5 summary cards (total, completed, in-progress, overdue, high-priority)
- Task CRUD: create, list, detail, edit, status actions
- Status filter + debounced keyword search
- Loading, empty, success, and error UI states
- EF Core + SQLite persistence with migrations and seed data
- Backend validation + client-side form validation

### Stretch (Phase 6)
- JWT login (`/login`) with Admin/Member RBAC
- Activity log per task
- Pagination, priority filter, sort on task list
- Docker Compose + GitHub Actions CI
- Reusable AI prompt templates
- Full-width responsive UI with accessibility improvements

## Technical Changes

| Layer | Changes |
|-------|---------|
| Backend | `ActivityLog`, `AuthService`, paged `TaskListQuery`, JWT middleware, `PasswordSeeder` |
| Frontend | `AuthContext`, `LoginPage`, `ProtectedRoute`, paged API client, activity UI, design refresh |
| DevOps | `docker-compose.yml`, `.github/workflows/ci.yml`, Dockerfiles |
| Docs | Lifecycle artifacts per participant guide structure |

## Database Changes

- Migration `Phase6_StretchFeatures`: `ActivityLogs` table, `Users.PasswordHash` column
- Seed: 3 users, 2 tasks via `HasData`; passwords seeded at startup

## Testing Done

- `dotnet test` — 7/7 integration tests
- `npm test` — 7/7 frontend tests
- `npm run build` — production build succeeds
- Manual end-to-end: login → dashboard → CRUD → activity log

## AI Usage Summary

Built primarily with **Cursor Agent mode**. Phased plan in `docs/PROJECT-PLAN.md`; prompt history in `docs/tool-workflow.MD` and `ai-prompts/`. I owned business rules (overdue logic, dashboard counts, RBAC), reviewed all generated code, and validated with automated tests.

## Demo Notes

1. Start backend: `cd backend && dotnet run --project LearningDashboard.Api --launch-profile http`
2. Start frontend: `cd frontend && npm ci && npm run dev`
3. Open http://localhost:5173/login
4. Sign in: `alice@example.com` / `Password123!`

## Known Limitations

- JWT key is a dev placeholder in `appsettings.json` (not for production)
- No refresh token or password reset
- Activity log and RBAC lack dedicated automated tests (manual verification)
- Google Fonts loaded from CDN in `index.html` (requires network for typography)

## Future Improvements

- Playwright E2E tests for login + task flow
- Refresh tokens and secure secret management (user secrets / Key Vault)
- Toast notifications and optimistic UI updates
- Full WCAG audit with screen-reader testing
