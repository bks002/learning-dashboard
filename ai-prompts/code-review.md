# AI Prompts — Code Review

## Review prompt (summary)

> "Review the Learning Dashboard codebase against Option 2 acceptance criteria. Check: all 12 criteria, UI states on every data page, no secrets in git, dashboard count logic, validation on create, tests passing."

## AI findings

- Missing empty state when filters return no tasks — **fixed**
- Server validation errors should map to form fields — **fixed**
- RBAC should live in TaskService not endpoints — **accepted**
- JWT key in appsettings is dev-only — **documented**

## My review additions

- Verified overdue excludes completed tasks
- Confirmed `DeleteBehavior.Restrict` on OwnerId
- Checked `.gitignore` covers `*.db`, `.env`, `node_modules`

## Post-review changes

[review-fixes.md](../review-fixes.md)  
[code-review-notes.md](../code-review-notes.md)

## Rejected AI suggestions

- Redis cache for dashboard — unnecessary
- PostgreSQL migration — out of scope for Core
