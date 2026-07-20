# Cursor — Project Context

## Repository

- **Name:** learning-dashboard
- **URL:** https://github.com/bks002/learning-dashboard
- **Option:** 2 — Frontend-Heavy Learning Dashboard / Project Tracker

## Stack

| Layer | Technology |
|-------|------------|
| Backend | ASP.NET Core 9 minimal API, EF Core 9, SQLite |
| Frontend | React 19, TypeScript, Vite, react-router-dom |
| Tests | xUnit + WebApplicationFactory; Vitest + RTL |
| Auth (Stretch) | JWT Bearer, Admin/Member RBAC |

## Folder layout

```
backend/LearningDashboard.Api/     # API, entities, migrations
backend/LearningDashboard.Api.Tests/
frontend/src/                      # React SPA
docs/                              # PROJECT-PLAN, tool-workflow, prompts
database/                          # setup notes, seed description
ai-prompts/                        # prompt history by activity
```

## Key conventions

- Enums serialized as JSON strings
- `Entities.TaskStatus` — qualify to avoid BCL conflict
- API routes under `/api`; Vite proxies in dev
- UI states required: loading, empty, error, success
- Tests: auth disabled in `Testing` environment
- Do not update global git config; use per-commit `-c user.*` if needed

## Demo login

`alice@example.com` / `Password123!` (Admin)

## Primary references

- [docs/PROJECT-PLAN.md](../../docs/PROJECT-PLAN.md)
- [acceptance-criteria.md](../../acceptance-criteria.md)
- [api-contract.md](../../api-contract.md)
