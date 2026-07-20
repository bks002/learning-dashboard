# Design Notes

## Architecture Overview

```
Browser (React SPA :5173)
    │  /api/* proxied in dev
    ▼
ASP.NET Core 9 Minimal API (:5004)
    │  JWT auth (except health + login)
    ▼
Service layer (Dashboard, Task, User, Auth, ActivityLog)
    ▼
EF Core 9 + SQLite (Data/learningdashboard.db)
```

| Layer | Location |
|-------|----------|
| Frontend | `frontend/src/` — pages, components, services, context |
| Backend | `backend/LearningDashboard.Api/` — endpoints, services, entities |
| Tests | `backend/LearningDashboard.Api.Tests/`, `frontend/src/**/*.test.tsx` |

## Frontend Design

- **Routing:** `react-router-dom` — `/`, `/tasks`, `/tasks/new`, `/tasks/:id`, `/tasks/:id/edit`, `/login`
- **Auth (Stretch):** `AuthContext` + `ProtectedRoute`; JWT in `localStorage`
- **API client:** `services/api.ts` with `Authorization` header and typed `ApiError`
- **State components:** `LoadingSpinner`, `EmptyState`, `ErrorMessage`, `SuccessMessage`
- **Forms:** `TaskForm` + `taskFormValidation.ts` (blur + submit, server error merge)
- **Styling:** CSS modules per page + `styles/shared.css`; Plus Jakarta Sans; full-width layout

## Backend Design

- **Pattern:** Minimal APIs grouped under `/api` via `MapApiGroup()`
- **Validation:** Data annotations on DTOs + global `ValidationFilter` → `400 ValidationProblem`
- **Enums:** Stored as strings in JSON via `JsonStringEnumConverter`
- **Timestamps:** Set server-side on create/update (`UtcNow`)
- **RBAC:** `TaskService.CanModifyTask` — Admin any task; Member own tasks only
- **Testing env:** Auth disabled in `WebApplicationFactory` (`Testing` environment)

## Database Design

- **Engine:** SQLite file at `LearningDashboard.Api/Data/learningdashboard.db` (gitignored)
- **Schema:** EF Core migrations in `Migrations/` (committed)
- **Seed:** `DbSeeder.HasData` for users + tasks; `PasswordSeeder` at startup for demo passwords
- **Relationships:** `ProjectTask.OwnerId` → `User.Id` with `DeleteBehavior.Restrict`
- **Stretch:** `ActivityLog` table linked to `ProjectTask` and optional `User`

## Validation Strategy

| Layer | Mechanism |
|-------|-----------|
| API DTOs | `[Required]`, `[MaxLength]`, `[Range]`, `[EmailAddress]` |
| Business | Owner exists check; RBAC on update/status |
| Client | `taskFormValidation.ts` before submit |

## Error Handling Strategy

| HTTP | When |
|------|------|
| `400` | Validation failure, invalid owner |
| `401` | Missing/invalid JWT |
| `403` | RBAC denial |
| `404` | Task not found |
| `201` | Task created |

Frontend maps `ApiError` to `ErrorMessage` or inline field errors.

## Testing Strategy Link

See [test-strategy.md](test-strategy.md) and [test-results.md](test-results.md).
