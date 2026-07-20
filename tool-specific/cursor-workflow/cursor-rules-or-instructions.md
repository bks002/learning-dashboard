# Cursor — Rules and Instructions

## Agent instructions used for this project

1. **Work in the project directory** — `learning-dashboard/`; avoid unnecessary workspace root switches.
2. **Follow PROJECT-PLAN phases** — Core before Stretch; tests must pass before Phase 6.
3. **Minimal diffs** — do not refactor unrelated code.
4. **Match existing patterns** — naming, folder structure, CSS conventions.
5. **No global git config changes** — use `git -c user.email=... -c user.name=...` per commit if needed.
6. **No secrets in repo** — gitignore `.env`, `*.db`; use `@example.com` for seeds.
7. **Run tests after logic changes** — `dotnet test`, `npm test`.
8. **Document AI usage** — update workflow docs as you go.

## Cursor features used

| Feature | Usage |
|---------|-------|
| Agent mode | Multi-file implementation, tests, docs |
| Chat | Clarifications, debugging, review |
| Terminal | `dotnet run`, `npm run dev`, `dotnet test` |

## Persistent context files

Point the agent at these before new work:

- `tool-specific/cursor-workflow/project-context.md` (this folder)
- `docs/PROJECT-PLAN.md`
- `acceptance-criteria.md`

## Reusable prompt templates

`docs/prompts/`:
- `01-backend-entities.md`
- `02-api-endpoints.md`
- `03-frontend-page-states.md`

## Quality gates

| Gate | Command |
|------|---------|
| Backend build | `dotnet build` |
| Backend tests | `dotnet test` (7/7) |
| Frontend tests | `npm test` (7/7) |
| Frontend build | `npm run build` |
| Manual smoke | Login → dashboard → create task → list |

## Assessment alignment

- Part A: `tool-workflow.md` + `docs/tool-workflow.MD`
- Part B: Option 2 Core + Stretch in `backend/` + `frontend/`
- Part C: `docs/SUBMISSION-DRAFT.md` + participation form
