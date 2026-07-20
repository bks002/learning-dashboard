# Implementation Plan

> **Detailed phased checklist:** [docs/PROJECT-PLAN.md](docs/PROJECT-PLAN.md)

## Overview

Build Option 2 (Learning Dashboard) in six phases: foundation → API → UI → tests → polish → stretch. Freeze stretch until Core tests pass.

## Task Breakdown

| Phase | Focus | Exit criteria |
|-------|-------|---------------|
| 1 | Entities, DbContext, SQLite, seed, CORS, validation | API runs, DB seeds |
| 2 | All Core API endpoints + dashboard counts | Swagger/manual verification |
| 3 | React pages, routing, UI states, forms | Full browser flow |
| 4 | xUnit integration + Vitest component tests | `dotnet test`, `npm test` green |
| 5 | `.gitignore`, README, clone-to-run | 12/12 acceptance criteria |
| 6 | Auth, pagination, activity log, Docker, CI, prompts | Stretch complete; 7/7 tests |

## Milestones

1. **Day 1–2:** Backend Core (Phases 1–2)
2. **Day 2–3:** Frontend Core (Phase 3)
3. **Day 3–4:** Tests + hardening (Phases 4–5)
4. **Day 4+:** Stretch + lifecycle artifacts (Phase 6)

## AI Usage Plan

- Use Cursor Agent for boilerplate; own business rules (overdue, dashboard counts, RBAC)
- Document prompts in `ai-prompts/` as work proceeds
- Run `dotnet build` / `dotnet test` after each backend step
- Run `npm test` / `npm run build` after frontend changes

## Risks

| Risk | Mitigation |
|------|------------|
| Stretch eats Core time | Freeze Phase 6 until 12/12 Core pass |
| Dashboard count drift | Single `DashboardService`; dedicated test |
| UI states skipped | Build loading/error first per page |
| NuGet corporate feed 401 | Root `NuGet.Config` → nuget.org only |
| Auth breaks local dev | Document login; tests use `Testing` env bypass |

## Mitigation

- `PROJECT-PLAN.md` §6 acceptance checklist reviewed before submission
- CI workflow runs both test suites on push to `main`
