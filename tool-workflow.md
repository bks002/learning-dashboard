# AI Tool Workflow (Part A)

> **Canonical full document:** [docs/tool-workflow.MD](docs/tool-workflow.MD) — step-by-step prompt history for Phases 1–6.

## 1. Primary AI Tool Used

**Cursor** (Agent mode) — scaffolding, iterative implementation, test generation, debugging, and documentation with project context.

## 2. How I Provide Project Context to the Tool

- Shared the .NET AI Capability Exercise participant guide (Option 2 requirements)
- Maintained [docs/PROJECT-PLAN.md](docs/PROJECT-PLAN.md) as the phased source of truth
- Described stack upfront: ASP.NET Core minimal API, EF Core + SQLite, React + TypeScript + Vite
- Pointed the agent at `backend/`, `frontend/`, and `docs/` before codegen
- Used [tool-specific/cursor-workflow/](tool-specific/cursor-workflow/) for persistent Cursor context

## 3. AI Usage Across the Lifecycle

| Phase | AI role | My role |
|-------|---------|---------|
| Requirement analysis | Clarify entities, acceptance criteria, dashboard rules | Final scope (Option 2 Core first) |
| Planning / design | API shape, folder structure, phased checklist | Architecture decisions, overdue logic |
| Code generation | Entities, DTOs, endpoints, React pages, CSS | Review business rules and RBAC |
| Validation | Test cases, edge cases | Run `dotnet test` / `npm test` after each phase |
| Testing | Integration tests, Vitest component tests | Assert correct behavior |
| Debugging | NuGet 401, EF conflicts, Swagger version, file locks | Reproduce and verify fixes |
| Code review | Security, missing UI states | Final merge decisions |
| Documentation | README, lifecycle artifacts, prompt templates | Own the reflection and trade-offs |

Detailed prompts grouped by activity: [ai-prompts/](ai-prompts/).

## 4. Information I Avoid Sharing with AI Tools

- API keys, tokens, and production passwords
- Real connection strings with credentials (SQLite local only)
- Personal email addresses or PII (seed data uses `@example.com`)
- Employer-specific proprietary code or internal package feeds

## 5. Reusing This Workflow in a Real Project

- Start with a written plan and acceptance checklist before codegen
- Provide entity specs, API contracts, and folder conventions upfront
- Implement in small verified steps; run build/tests after each step
- Document AI usage **as you go** (not at the end)
- Keep `NuGet.Config` / lockfiles committed for reproducible clones
- Store reusable prompts in `ai-prompts/` and `docs/prompts/`
