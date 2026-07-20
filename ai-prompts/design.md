# AI Prompts — Design

## Prompt (summary)

> "Design the backend folder layout for a minimal API: Entities, Data/DbSeeder, DTOs, Services, Endpoints. Use enum-as-string JSON. Restrict delete on task ownership FK. Frontend: pages for dashboard, task list, create, detail, edit with loading/empty/error/success states."

## AI response (summary)

Proposed `backend/LearningDashboard.Api/` structure and `frontend/src/{pages,components,services,types}` layout.

## Accepted

- Minimal APIs (no controllers)
- `ValidationFilter` for global validation
- Vite proxy `/api` → `localhost:5004`
- Separate response DTOs from entities

## Changed

- Added `AuthContext` and `ProtectedRoute` in Phase 6 (Stretch)
- Paged `GET /api/tasks` response shape in Phase 6

## Output

- [design-notes.md](../design-notes.md)
- [data-model.md](../data-model.md)
- [api-contract.md](../api-contract.md)
- [ui-flow.md](../ui-flow.md)
