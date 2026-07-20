# Cursor — Tasks

## Completed

- [x] Phase 1: Entities, DbContext, SQLite, seed, validation, CORS
- [x] Phase 2: Services + 7 Core API endpoints
- [x] Phase 3: React pages, routing, UI states, TaskForm
- [x] Phase 4: Integration tests (7) + frontend tests (7)
- [x] Phase 5: README, .gitignore, clone-to-run verification
- [x] Phase 6: Auth, activity log, pagination, Docker, CI, UI polish
- [x] Lifecycle artifacts per participant guide
- [x] Push to GitHub

## Task workflow for Cursor Agent

1. Read `project-context.md` and relevant phase in `docs/PROJECT-PLAN.md`
2. Implement smallest verifiable slice
3. Run `dotnet test` / `npm test`
4. Update `docs/tool-workflow.MD` or `ai-prompts/` with prompt summary
5. Do not proceed to next phase until exit criteria met

## If resuming work

```bash
# Backend
cd backend && dotnet run --project LearningDashboard.Api --launch-profile http

# Frontend
cd frontend && npm run dev
```

Sign in at http://localhost:5173/login before using the app.
