# Final AI Usage Summary

**Tool:** Cursor (Agent mode)  
**Project:** Learning Dashboard — Option 2  
**Duration:** ~1 week (self-paced)  
**Repository:** https://github.com/bks002/learning-dashboard

## By lifecycle phase

| Phase | AI contribution | Human ownership |
|-------|-----------------|-----------------|
| Requirements | Parsed participant guide; drafted entity list | Chose Option 2; defined overdue/count rules |
| Planning | `PROJECT-PLAN.md` structure, phased checklist | Final architecture (minimal API, SQLite, Vite proxy) |
| Design | API endpoint list, folder layout | RBAC rules, validation strategy |
| Implementation | ~80% codegen (entities, services, UI, CSS) | Review every PR-sized chunk; fix business logic |
| Testing | Test boilerplate, mock patterns | Assert behavior; keep 7/7 + 7/7 green |
| Debugging | NuGet, EF, Swagger, auth compile fixes | Reproduce errors; stop locked processes |
| Code review | Missing-state audit, security scan | Accept/reject suggestions |
| Documentation | README, lifecycle artifacts, prompts | Accuracy, voice, submission form answers |

## Prompt patterns that worked

1. **Context first:** "We're building Option 2 Learning Dashboard; stack is …; see PROJECT-PLAN Phase N"
2. **Small steps:** One phase at a time with exit criteria
3. **Verify gate:** "Run dotnet test before moving to next step"
4. **Explicit constraints:** "Do not update global git config"; "minimal diff"

## Prompt patterns that failed

1. Vague "improve the UI" without constraints → too broad; better with specific pages
2. Switching workspace root mid-session → interruptions; stayed in project path
3. Assuming flat task array after pagination API change → required explicit contract update

## Artifacts produced with AI

| Artifact | Location |
|----------|----------|
| Full workflow log | `docs/tool-workflow.MD` |
| Part A summary | `tool-workflow.md` |
| Prompt templates | `docs/prompts/`, `ai-prompts/` |
| Cursor context | `tool-specific/cursor-workflow/` |
| Lifecycle docs | Root `*.md` files per assessment guide |

## Responsible AI judgment

- Did **not** share secrets, real emails, or employer feeds with AI
- Did **not** commit `.env`, `*.db`, or API keys
- **Did** review all generated auth/RBAC code before shipping
- **Did** run tests locally rather than trusting "it should work"

## Outcome

- Core: **12/12** acceptance criteria
- Tests: **7/7** backend, **7/7** frontend
- Stretch: all six optional items implemented
- Lifecycle: full artifact set per participant guide
