# AI Tool Workflow

> Part A deliverable for the .NET AI Capability Exercise.

## 1. Primary AI Tool Used

**Cursor** (Agent mode) — used for scaffolding, code generation, planning, and iterative implementation with full project context.

## 2. How I Provide Project Context to the Tool

- Shared the assessment participant guide requirements (entities, features, acceptance criteria)
- Referenced `docs/PROJECT-PLAN.md` for phased implementation steps
- Described the recommended stack: ASP.NET Core Web API, EF Core + SQLite, React + TypeScript
- Pointed to the existing repo structure (`backend/`, `frontend/`, `docs/`) before making changes
- Asked the agent to work directly in the project path without switching workspace roots

## 3. AI Usage Across the Development Lifecycle

### Requirement Analysis

- Broke the assessment into Part A (workflow doc), Part B (app), and Part C (submission)
- Mapped core entities (`User`, `ProjectTask`) and fields from the guide
- Defined dashboard count rules (total, completed, in-progress, overdue, high-priority) before coding

### Planning and Design

- Created `docs/PROJECT-PLAN.md` with phased steps, API endpoints, and acceptance checklist
- Chose minimal API (no controllers), enum storage as strings, and `DeleteBehavior.Restrict` on task ownership
- Confirmed backend folder layout: `Entities/`, `Data/`, `DTOs/`, `Services/`, `Endpoints/`

### Code Generation

#### Phase 1 — Backend foundation (complete)

| Step | Task | Status | What was done |
|------|------|--------|---------------|
| 1 | Define domain entities | Done | Created `User`, `ProjectTask`, and enums (`TaskPriority`, `TaskStatus`, `UserRole`) with data annotations |
| 2 | Create `AppDbContext` | Done | Added `DbSet`s, fluent configuration, and User → ProjectTask relationship |
| 3 | Configure SQLite | Done | Added `DefaultConnection` in `appsettings.json`; registered `AppDbContext` with `UseSqlite` in `Program.cs` |
| 4 | Database seeding | Done | Created `DbSeeder.cs` with 3 users and 2 sample tasks via `HasData()` |
| 5 | EF Core migration | Done | Added `InitialCreate` migration; applied with `dotnet ef database update` |
| 6 | Auto-migrate on startup | Done | `db.Database.Migrate()` on startup; DB pinned to `Data/learningdashboard.db` |
| 7 | Global validation | Done | `ValidationFilter` + data annotations on DTOs; returns `400 ValidationProblem` |
| 8 | CORS | Done | `Frontend` policy for `http://localhost:5173`; configurable via `appsettings.json` |

**Step 1 — Entities**

- Prompted AI to create entities matching the assessment spec
- Reviewed generated models for required fields, navigation properties, and sensible defaults (`Status = Planned`, `Priority = Medium`)

**Step 2 — AppDbContext**

- AI generated fluent API configuration for keys, max lengths, enum conversions, and FK relationship
- Verified `OwnerId` uses restrict delete to prevent orphaned task references

**Step 3 — SQLite configuration**

- AI added connection string (`Data Source=learningdashboard.db`) and wired `AddDbContext` in `Program.cs`
- Confirmed build passes with `dotnet build`

**Step 4 — Database seeding**

- AI created `Data/DbSeeder.cs` with fixed seed IDs for reproducible migrations
- Seeded 3 users (1 admin, 2 members) and 2 sample tasks for local development
- Wired `DbSeeder.Seed(modelBuilder)` into `AppDbContext.OnModelCreating`
- Fixed `TaskStatus` naming conflict with `System.Threading.Tasks.TaskStatus` during build

**Step 5 — EF Core migration**

- Installed `dotnet-ef` 9.0.15 (matching EF Core version)
- Created `Migrations/20260720162312_InitialCreate.cs` with `Users` and `ProjectTasks` tables
- Applied migration successfully; seed data inserted via migration `INSERT` statements

**Step 6 — Auto-migrate on startup**

- Pinned SQLite file to `LearningDashboard.Api/Data/learningdashboard.db` using `ContentRootPath`
- Ensures `Data/` directory is created before connecting
- Calls `db.Database.Migrate()` on app startup so fresh clones auto-create the local DB
- Database file remains gitignored; schema + seed travel via migrations in source control

**Step 7 — Global validation**

- Added `Validation/ValidationFilter.cs` as a minimal API endpoint filter using data annotations
- Created `DTOs/CreateProjectTaskRequest.cs` with `[Required]`, `[MaxLength]`, and `[Range]` rules
- Registered `AddProblemDetails()` for consistent error responses
- Applied filter globally via `MapApiGroup()` extension on `/api` routes
- Invalid requests return `400` with `ValidationProblem` JSON (temporary `/api/validation/preview` endpoint for testing)

**Step 8 — CORS**

- Added `Frontend` CORS policy allowing `http://localhost:5173` (Vite dev server)
- Made allowed origins configurable under `Cors:AllowedOrigins` in `appsettings.json`
- Wired `app.UseCors("Frontend")` before API endpoints
- Removed default weather forecast stub; added `/api/health` instead

#### Phase 2 — Core API (complete)

| Step | Task | Status | What was done |
|------|------|--------|---------------|
| 1 | Response DTOs | Done | `UserResponse`, `ProjectTaskResponse`, `DashboardSummaryResponse`, `UpdateProjectTaskRequest`, `UpdateTaskStatusRequest`, `ProjectTaskMappings` |
| 2 | Service layer | Done | `DashboardService`, `UserService`, `TaskService` with interfaces; registered as scoped in DI |
| 3 | API endpoints | Done | 7 routes under `/api` via `DashboardEndpoints`, `UserEndpoints`, `TaskEndpoints` |
| 4 | Business rules | Done | Server-side timestamps, owner validation, status filter, keyword search |
| 5 | Error handling | Done | `400` invalid owner, `404` missing task, `201` on create, `ValidationProblem` via existing filter |
| 6 | Manual verification | Done | Tested against seeded data; dashboard counts and filters confirmed |

**Step 1 — Response DTOs**

- Prompted AI to create response models separate from entities (API contract vs persistence layer)
- Files created in `DTOs/`:
  - `UserResponse` — `id`, `name`, `email`, `role`
  - `ProjectTaskResponse` — all task fields plus `ownerName` for list/detail views
  - `DashboardSummaryResponse` — `totalItems`, `completedItems`, `inProgressItems`, `overdueItems`, `highPriorityItems`
  - `UpdateProjectTaskRequest` — full update payload with same validation as create
  - `UpdateTaskStatusRequest` — single `status` field for PATCH endpoint
  - `ProjectTaskMappings` — `ToResponse()` extension methods for `User` and `ProjectTask`
- Reused existing `CreateProjectTaskRequest` from Phase 1 for POST
- Used `Entities.TaskStatus` qualified name to avoid conflict with `System.Threading.Tasks.TaskStatus`

**Step 2 — Service layer**

- Created three scoped services in `Services/`:
  - `DashboardService` — queries all tasks, computes counts in memory using assessment rules:
    - Overdue = `dueDate < today (UTC)` AND `status != Completed`
    - High priority = `priority == High` (all statuses)
  - `UserService` — returns seeded users ordered by name
  - `TaskService` — CRUD + `GetTasksAsync(status, search)` with EF `Include` for owner name
- `TaskService` returns `(Task, Error)` tuples so endpoints can map to `400`/`404` without exceptions
- Owner existence checked via `AnyAsync` before create/update
- `CreatedAt`/`UpdatedAt` set server-side in `TaskService`, not accepted from client
- Registered in `Program.cs`: `AddScoped<IDashboardService, DashboardService>()` etc.

**Step 3 — API endpoints**

- Created endpoint extension classes in `Endpoints/`:
  - `GET /api/dashboard/summary` → `DashboardEndpoints`
  - `GET /api/users` → `UserEndpoints`
  - `GET /api/tasks` → list with optional `?status=` and `?search=` query params
  - `GET /api/tasks/{id}` → detail
  - `POST /api/tasks` → create (returns `201 Created` with location header)
  - `PUT /api/tasks/{id}` → full update
  - `PATCH /api/tasks/{id}/status` → status-only update (in progress / completed)
- All routes registered on `MapApiGroup()` so `ValidationFilter` applies automatically
- Removed temporary `/api/validation/preview` endpoint from Phase 1

**Step 4 — Business rules**

- Status filter: case-insensitive enum parse (`?status=InProgress`); ignored if invalid
- Keyword search: `EF.Functions.Like` on `title`, `description`, `category`
- Tasks ordered by `UpdatedAt` descending in list view
- Invalid `ownerId` on create/update returns `400` with `{ "error": "Owner with id X was not found." }`
- Missing task on get/update/patch returns `404`

**Step 5 — Error handling**

| Scenario | HTTP status | Response shape |
|----------|-------------|----------------|
| Validation failure (empty title, etc.) | `400` | `ValidationProblem` JSON |
| Owner not found | `400` | `{ "error": "..." }` |
| Task not found | `404` | `{ "error": "..." }` or empty body on GET |
| Successful create | `201` | Task body + `Location: /api/tasks/{id}` |
| Successful update/patch | `200` | Updated task body |

**Step 6 — Manual verification**

- Ran API on `http://localhost:5004` and tested with `Invoke-RestMethod`:
  - `GET /api/dashboard/summary` → `{ totalItems: 2, completedItems: 0, inProgressItems: 1, overdueItems: 0, highPriorityItems: 1 }` (matches seed data)
  - `GET /api/users` → 3 users
  - `GET /api/tasks` → 2 tasks
  - `GET /api/tasks/1` → "Complete EF Core fundamentals"
  - `GET /api/tasks?status=InProgress` → 1 task
  - `GET /api/tasks?search=EF` → 1 task
- `dotnet build` passes with 0 errors after all changes

**Swagger UI setup and verification**

- Added `Swashbuckle.AspNetCore` 6.9.0 (compatible with .NET 9; v10 caused `Microsoft.OpenApi` type load conflicts)
- Registered in `Program.cs` (Development only):
  - `AddEndpointsApiExplorer()` + `AddSwaggerGen()` with doc title "Learning Dashboard API v1"
  - `UseSwagger()` + `UseSwaggerUI()` at route prefix `swagger`
- Added `JsonStringEnumConverter` so Swagger/JSON clients can send enum values as strings (`"Low"`, `"Planned"`, etc.)
- **Swagger UI URL:** `http://localhost:5004/swagger`
- **OpenAPI JSON:** `http://localhost:5004/swagger/v1/swagger.json`
- Full automated verification: **17/17 checks passed** (health, Swagger, all CRUD endpoints, filters, error cases, CORS)

| Swagger endpoint | Method | Purpose |
|------------------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/dashboard/summary` | GET | Dashboard counts |
| `/api/users` | GET | Owner dropdown data |
| `/api/tasks` | GET | List tasks (`status`, `search` query params) |
| `/api/tasks/{id}` | GET | Task detail |
| `/api/tasks` | POST | Create task |
| `/api/tasks/{id}` | PUT | Full update |
| `/api/tasks/{id}/status` | PATCH | Status-only update |

**Example POST body in Swagger:**

```json
{
  "title": "New learning goal",
  "description": "Created via Swagger",
  "category": "Learning",
  "priority": "High",
  "status": "Planned",
  "ownerId": 1,
  "dueDate": "2026-08-15T00:00:00Z"
}
```

### Validation

- Ran `dotnet build` after each step to confirm zero errors
- Manually reviewed entity fields against assessment requirements before accepting generated code
- Phase 2: verified all 7 endpoints against seeded SQLite data via HTTP calls

### Testing

**Status: backend integration tests complete (Phase 4 — backend)**

| Test class | Test | Assessment requirement |
|------------|------|------------------------|
| `TaskFlowTests` | `CreateTask_AppearsInList` | Create → list |
| `TaskFlowTests` | `UpdateTask_PersistsFields` | Update → persist |
| `TaskFlowTests` | `CreateTask_WithEmptyTitle_ReturnsBadRequest` | Validation rejects invalid create |
| `TaskFlowTests` | `GetTasks_WithStatusFilter_ReturnsMatchingTasks` | Status filter |
| `TaskFlowTests` | `GetTasks_WithSearch_ReturnsMatchingTasks` | Keyword search |
| `DashboardTests` | `DashboardCounts_UpdateAfterCreateUpdateAndComplete` | Dashboard counts after mutations |

**Infrastructure:**

- Added `Microsoft.AspNetCore.Mvc.Testing` 9.0.18
- `LearningDashboardApiFactory` — `WebApplicationFactory<Program>` with in-memory SQLite (`DataSource=:memory:`)
- `IntegrationTestBase` — shared HTTP client, JSON enum converter, helper methods
- Exposed `public partial class Program { }` for test host discovery
- Skipped HTTPS redirection in `Testing` environment

**Result:** `dotnet test` → **6 passed, 0 failed** | `npm test` → **7 passed, 0 failed**

#### Phase 3 — Core UI (complete)

| Step | Task | Status | What was done |
|------|------|--------|---------------|
| 1 | Routing + folder structure | Done | Installed `react-router-dom`; created `components/`, `pages/`, `services/`, `types/`, `hooks/` under `frontend/src/` |
| 2 | TypeScript types | Done | `enums.ts`, `user.ts`, `dashboard.ts`, `projectTask.ts`, barrel `index.ts` |
| 3 | API service layer | Done | `api.ts`, `apiError.ts` — fetch wrapper + 7 endpoint functions |
| 4 | Shared UI state components | Done | `LoadingSpinner`, `EmptyState`, `ErrorMessage`, `SuccessMessage` + `uiStates.css` |
| 5 | App routing | Done | `BrowserRouter`, `AppLayout`, 5 placeholder pages, route table |
| 6 | Dashboard page | Done | 5 summary cards, loading/error states, `DashboardCard` component |
| 7 | Task list page | Done | Table, status filter, debounced search, loading/empty/error states |
| 8 | Create task page | Done | `TaskForm` component, owner dropdown, client + server validation, redirect on success |
| 9 | Task detail page | Done | Read-only detail, status actions, success message from router state |
| 10 | Edit task page | Done | Pre-filled `TaskForm`, `PUT` on save, redirect with success message |
| 11 | Client-side form validation | Done | `validation/taskFormValidation.ts`, blur + submit validation, a11y, server error clearing |
| 12 | Vite proxy (optional) | Done | `/api` → `http://localhost:5004`; default `API_BASE_URL` is `/api` |
| 13 | Basic styling | Done | `styles/shared.css`, global theme refresh, unified buttons/headers, responsive polish |
| 14 | Manual verification | Done | 15/15 API flow checks passed; `npm run build` passes |
| 15 | Workflow + plan wrap-up | Done | Phase 3 marked complete in `PROJECT-PLAN.md`; summary added below |

**Step 1 — Routing + folder structure**

- Installed `react-router-dom` in `frontend/` (added to `package.json` dependencies)
- Created source folders for Phase 3 layout:
  - `frontend/src/components/` — reusable UI (cards, forms, loading/error/empty/success states)
  - `frontend/src/pages/` — route-level screens (Dashboard, TaskList, Create, Detail, Edit)
  - `frontend/src/services/` — API client (`fetch` wrapper → `http://localhost:5004/api`)
  - `frontend/src/types/` — TypeScript models matching backend DTOs
  - `frontend/src/hooks/` — optional shared data-fetching hooks
- Left existing Vite scaffold (`App.tsx`, `main.tsx`) unchanged; routing wiring is Step 5
- No app code changes yet — structure only

**Step 2 — TypeScript types**

- Read backend DTOs in `LearningDashboard.Api/DTOs/` and entity enums to mirror the API contract
- Created `frontend/src/types/` with camelCase property names (ASP.NET Core default JSON serialization):
  - `enums.ts` — `TaskPriority`, `TaskStatus`, `UserRole` as string union types (matches `JsonStringEnumConverter` on API)
  - `user.ts` — `User` (`id`, `name`, `email`, `role`)
  - `dashboard.ts` — `DashboardSummary` (`totalItems`, `completedItems`, `inProgressItems`, `overdueItems`, `highPriorityItems`)
  - `projectTask.ts` — `ProjectTask` response plus `CreateProjectTaskRequest`, `UpdateProjectTaskRequest`, `UpdateTaskStatusRequest`
  - `index.ts` — barrel re-exports for `import type { ... } from '../types'`
- Date fields typed as `string` (ISO 8601 from API); nullable fields use `string | null`
- Used `export type` only (compatible with `verbatimModuleSyntax` / `erasableSyntaxOnly` in tsconfig)
- Verified with `npm run build` — compiles with no errors

**Step 3 — API service layer**

- Created `frontend/src/services/apiError.ts`:
  - `ApiError` class with `status` and optional `validationErrors` (field → message arrays)
  - `parseApiError()` handles three API failure shapes:
    - `400 ValidationProblem` — `{ errors: { Title: [...] } }` (keys normalized to camelCase for forms)
    - `400` business rule — `{ error: "Owner with id X was not found." }`
    - `404` — `{ error: "Task not found." }` or empty body
- Created `frontend/src/services/api.ts`:
  - Base URL: `import.meta.env.VITE_API_BASE_URL` with fallback `http://localhost:5004/api`
  - Shared `request<T>()` wrapper — sets JSON content type, throws `ApiError` on non-2xx, handles empty bodies
  - Exported functions matching backend routes:

| Function | Method | Path |
|----------|--------|------|
| `getDashboardSummary()` | GET | `/dashboard/summary` |
| `getUsers()` | GET | `/users` |
| `getTasks({ status?, search? })` | GET | `/tasks` |
| `getTask(id)` | GET | `/tasks/{id}` |
| `createTask(data)` | POST | `/tasks` |
| `updateTask(id, data)` | PUT | `/tasks/{id}` |
| `updateTaskStatus(id, status)` | PATCH | `/tasks/{id}/status` |

- Query params built via `URLSearchParams` (omits empty values)
- Re-exported `ApiError` from `api.ts` for convenient imports in UI components
- Verified with `npx tsc -p tsconfig.app.json` — compiles with no errors

**Step 4 — Shared UI state components (signature piece foundation)**

- Created reusable state components in `frontend/src/components/` for the assessment-required UI states:
  - `LoadingSpinner.tsx` — animated spinner with optional message, `size` (`default` | `small`), and `inline` layout; uses `role="status"` and `aria-busy`
  - `EmptyState.tsx` — title, optional message, optional `action` slot (e.g. "Create task" link)
  - `ErrorMessage.tsx` — title, message, optional field-level `validationErrors` list (from `ApiError`), optional `onRetry` button
  - `SuccessMessage.tsx` — title, message, optional `onDismiss` button
- Added `uiStates.css` — shared styles using existing `:root` CSS variables (`--accent`, `--text`, `--border`); includes dark-mode-friendly error/success colors
- Barrel export in `components/index.ts` for `import { LoadingSpinner, ... } from '../components'`
- Components are page-agnostic — pages will compose them in Steps 6–10 for loading / empty / error / success states
- Verified with `npx tsc -p tsconfig.app.json` — compiles with no errors

**Step 5 — App routing**

- Wrapped app in `BrowserRouter` in `main.tsx`
- Replaced Vite starter `App.tsx` with `react-router-dom` route table
- Created `AppLayout.tsx` — header with app title + nav links (`Dashboard`, `Tasks`, `New Task`) and `<Outlet />` for page content
- Nav uses `NavLink` with active styling; `end` prop on Dashboard (`/`) and Tasks (`/tasks`) so child routes don't highlight parent links
- Route order places static paths before dynamic `:id` to avoid `"new"` being captured as an id:

| Route | Page | File |
|-------|------|------|
| `/` | Dashboard | `pages/DashboardPage.tsx` |
| `/tasks` | Task list | `pages/TaskListPage.tsx` |
| `/tasks/new` | Create task | `pages/CreateTaskPage.tsx` |
| `/tasks/:id/edit` | Edit task | `pages/EditTaskPage.tsx` |
| `/tasks/:id` | Task detail | `pages/TaskDetailPage.tsx` |

- Pages are placeholders (heading + short description) — real data/UI added in Steps 6–10
- Added `AppLayout.css` for header/nav/main layout; adjusted `#root` in `index.css` for left-aligned app shell
- Updated `index.html` title to "Learning Dashboard"
- Verified with `npx tsc -p tsconfig.app.json` — compiles with no errors

**Step 6 — Dashboard page**

- Implemented `DashboardPage.tsx`:
  - Fetches `getDashboardSummary()` on mount via `useEffect`
  - **Loading:** full-page `LoadingSpinner` with "Loading dashboard..."
  - **Error:** `ErrorMessage` with retry button (calls `loadSummary` again); handles `ApiError` message when API is down
  - **Success:** responsive grid of 5 summary cards mapped from API fields
- Created `DashboardCard.tsx` — reusable presentational card (`label`, `value`, optional `variant`: `default` | `accent` | `warning`)
- Card mapping (matches backend `DashboardSummaryResponse` rules):

| Card | API field | Notes |
|------|-----------|-------|
| Total | `totalItems` | All tasks |
| Completed | `completedItems` | `status === Completed` |
| In Progress | `inProgressItems` | `status === InProgress` |
| Overdue | `overdueItems` | past due and not completed |
| High Priority | `highPriorityItems` | `priority === High` |

- Added `dashboard.css` — responsive CSS grid, card styling using existing theme variables
- Verified with `npx tsc -p tsconfig.app.json` — compiles with no errors

**Step 7 — Task list page**

- Implemented `TaskListPage.tsx`:
  - Fetches `getTasks({ status?, search? })` when status filter or debounced search changes
  - **Loading:** `LoadingSpinner` while fetching
  - **Error:** `ErrorMessage` with retry
  - **Empty:** `EmptyState` — "No tasks yet" (with Create Task link) or "No matching tasks" when filters are active
  - **Success:** responsive table with title (links to `/tasks/:id`), status badge, priority, owner, due date
- Filters:
  - Status dropdown — All / Planned / In Progress / Completed → `?status=` query param
  - Keyword search input — 300ms debounce → `?search=` query param (matches API search on title, description, category)
- Header includes "New Task" link to `/tasks/new`
- Added `taskList.css` — filter controls, table layout, status badges, priority highlight for High
- Verified with `npx tsc -p tsconfig.app.json` — compiles with no errors

**Step 8 — Create task page**

- Created reusable `TaskForm.tsx` (also intended for Edit page in Step 10):
  - Fields: title*, description, category, priority, status, owner*, due date
  - Client validation: required title, required owner, max lengths (200 / 2000 / 100) matching backend data annotations
  - Inline field errors + server `validationErrors` from `ApiError` (camelCase keys)
  - Converts date input (`YYYY-MM-DD`) to ISO UTC string for API (`dueDate`)
- Implemented `CreateTaskPage.tsx`:
  - **Loading:** `LoadingSpinner` while fetching owners via `getUsers()`
  - **Load error:** `ErrorMessage` with retry
  - **Submit:** calls `createTask()`; button shows "Saving..." while submitting
  - **Submit error:** `ErrorMessage` with validation details from API `400` responses
  - **Success:** navigates to `/tasks/:id` with router state `{ successMessage: 'Task created successfully.' }` (detail page will display in Step 9)
- Added `taskForm.css` — form layout, field error styling, submit/cancel actions
- Verified with `npx tsc -p tsconfig.app.json` — compiles with no errors

**Step 9 — Task detail page**

- Implemented `TaskDetailPage.tsx`:
  - Loads task via `getTask(id)` on mount / id change
  - **Loading:** `LoadingSpinner`
  - **Invalid id:** `ErrorMessage` for non-numeric URL param
  - **Not found:** `404` from API → dedicated not-found message + back link
  - **Error:** `ErrorMessage` with retry
  - **Success:** read-only detail card with status, priority, owner, category, due date, created/updated timestamps, description
- **Success message:** reads `location.state.successMessage` from create redirect (Step 8); dismissible via `SuccessMessage`
- **Status actions:**
  - `Mark In Progress` — shown when `status === Planned` → `PATCH /api/tasks/{id}/status`
  - `Mark Completed` — shown when `status !== Completed`
  - Updates local task state on success; shows success banner; disables buttons while updating
  - Action failures shown via `ErrorMessage`
- **Navigation:** back link to `/tasks`, `Edit Task` link to `/tasks/:id/edit`
- Added `taskDetail.css` — detail card grid, status badge, action buttons
- Verified with `npx tsc -p tsconfig.app.json` — compiles with no errors

**Step 10 — Edit task page**

- Implemented `EditTaskPage.tsx`:
  - Loads task + owners in parallel via `Promise.all([getTask(id), getUsers()])`
  - **Loading:** `LoadingSpinner`
  - **Invalid id / not found / error:** same patterns as detail page (`404` handling, retry)
  - Maps `ProjectTask` → `TaskFormValues` with `toFormValues()` (ISO due date → `YYYY-MM-DD` for date input)
  - Reuses `TaskForm` from Step 8 with `key={task.id}` and `initialValues` so fields pre-fill correctly
  - **Submit:** `updateTask(id, values)` via `PUT /api/tasks/{id}`
  - **Submit error:** `ErrorMessage` + server validation field errors
  - **Success:** navigates to `/tasks/:id` with `{ successMessage: 'Task updated successfully.' }`
  - Cancel link returns to task detail (`/tasks/:id`)
- Added `.task-form-page__back-link` to `taskForm.css` for edit page navigation
- Verified with `npx tsc -p tsconfig.app.json` — compiles with no errors

**Step 11 — Client-side form validation**

- Extracted validation to `frontend/src/validation/taskFormValidation.ts` (mirrors backend data annotations):
  - `TASK_FORM_LIMITS` — title 200, description 2000, category 100
  - `validateTaskForm()` — full form check
  - `validateTaskFormField()` — single-field check for blur events
- Rules enforced:
  - Title required (trimmed non-empty)
  - Owner required, must be integer ≥ 1, must exist in loaded users list
  - Max lengths on title, description, category
  - Due date format sanity check when provided
- Enhanced `TaskForm.tsx`:
  - `noValidate` on form — uses custom messages instead of browser defaults
  - Validate on **blur** (per-field, after touch) and on **submit** (all fields)
  - Form-level summary banner (`role="alert"`) when submit attempted with errors
  - `aria-invalid` + `aria-describedby` on invalid fields
  - Client errors clear on edit; server errors clear per-field via `onClearServerError` callback
- Moved `TaskFormValues` to `types/taskForm.ts` to avoid circular imports between form and validation
- Wired `onClearServerError` in `CreateTaskPage` and `EditTaskPage` to clear API validation errors when user edits a field
- Client + server errors merge in display: client errors take precedence per field, then first server message
- Verified with `npx tsc -p tsconfig.app.json` — compiles with no errors

**Step 12 — Vite dev proxy**

- Added Vite dev server proxy in `frontend/vite.config.ts`:
  - `/api` → `http://localhost:5004` with `changeOrigin: true`
  - Browser requests to `http://localhost:5173/api/...` are forwarded to the ASP.NET API (avoids CORS issues in local dev)
- Updated `frontend/src/services/api.ts` default base URL:
  - Was: `http://localhost:5004/api` (absolute, cross-origin)
  - Now: `/api` (relative, same-origin in dev via proxy)
  - Still overridable via `VITE_API_BASE_URL` env var
- Added `frontend/.env.example` documenting `VITE_API_BASE_URL=/api`
- Backend CORS policy from Phase 1 remains for direct absolute-URL access; proxy is the preferred local dev path
- Verified with `npx tsc -p tsconfig.app.json` — compiles with no errors

**Step 13 — Basic styling**

- Added `frontend/src/styles/shared.css` with reusable patterns:
  - `.page-header` — consistent page titles and descriptions
  - `.btn`, `.btn--primary`, `.btn--secondary` — shared button/link styles
  - `.back-link` — navigation back links
- Refreshed `index.css`:
  - Removed unused Vite starter styles (large global `h1`, counter/social rules)
  - Added design tokens: `--surface`, `--danger`, `--success`; refined accent purple palette
  - Body uses `--surface` background; `#root` is a centered app shell with shadow
  - Global focus-visible styles for keyboard accessibility
- Polished component/page CSS:
  - `AppLayout.css` — sticky blurred header
  - `dashboard.css` — card hover lift, responsive value sizing
  - `taskList.css` — filter panel, table card container, mobile padding
  - `taskForm.css` — form in bordered card panel
  - `taskDetail.css` — detail card consistency
  - `uiStates.css` — loading/empty states in dashed bordered panels (more distinct from content)
- Updated pages/components to use shared classes (`btn`, `page-header`, `back-link`)
- Removed unused `App.css` (leftover Vite template)
- Verified with `npx tsc -p tsconfig.app.json` — compiles with no errors

**Step 14 — Manual verification**

- Started backend (`http://localhost:5004`) and frontend (`http://localhost:5173`) locally
- Ran automated end-to-end verification against live API + Vite proxy (maps to UI flows):

| # | Check | Result |
|---|-------|--------|
| 1 | Dashboard counts from API | PASS |
| 2 | Vite proxy `/api` → backend | PASS |
| 3 | Users load (owner dropdown) | PASS |
| 4 | Task list loads seeded tasks | PASS |
| 5 | Status filter | PASS |
| 6 | Keyword search | PASS |
| 7 | Create task | PASS |
| 8 | Created task appears in list | PASS |
| 9 | Dashboard total updates after create | PASS |
| 10 | Task detail loads | PASS |
| 11 | Edit task persists changes | PASS |
| 12 | Mark completed (status PATCH) | PASS |
| 13 | Dashboard completed count updates | PASS |
| 14 | Validation rejects empty title (400) | PASS |
| 15 | Task not found returns 404 | PASS |

- **Production build:** `npm run build` — PASS (after fixing `vite.config.ts` to use `defineConfig` from `vitest/config`, and removing erroneous `dashboard.css` import from `DashboardCard.tsx`)
- **UI states (loading / empty / error / success):** implemented in Steps 4–11; components wired on all data-fetching pages — visual confirmation recommended in browser at `http://localhost:5173`
- **Phase 3 exit criteria met:** full create → list → update → complete flow works; dashboard counts update after mutations

**Step 15 — Workflow + plan wrap-up**

- Marked **Phase 3 — Core UI** as complete in `docs/PROJECT-PLAN.md`:
  - Added 13-item implementation checklist (all checked)
  - Added route table and feature/status mapping with Done column
  - Frontend states table marked Done
  - Exit criteria marked **Met** with reference to Step 14 verification
- Updated Phase 1 plan: frontend scaffold/Vitest install checked; routing/types/API tracked under Phase 3
- Phase 3 deliverables summary:

| Area | Key files |
|------|-----------|
| Routing | `App.tsx`, `AppLayout.tsx`, `pages/*` |
| Types | `types/enums.ts`, `projectTask.ts`, `dashboard.ts`, `user.ts` |
| API client | `services/api.ts`, `services/apiError.ts` |
| UI states | `components/LoadingSpinner.tsx`, `EmptyState.tsx`, `ErrorMessage.tsx`, `SuccessMessage.tsx` |
| Forms | `components/TaskForm.tsx`, `validation/taskFormValidation.ts` |
| Styling | `styles/shared.css`, `index.css`, page CSS modules |
| Config | `vite.config.ts` (proxy + vitest), `.env.example` |

- **How to run full stack locally:**
  1. `cd backend && dotnet run --project LearningDashboard.Api --launch-profile http`
  2. `cd frontend && npm run dev`
  3. Open `http://localhost:5173` (API proxied at `/api`)
- **Next phase:** Phase 4 — frontend Vitest tests (`npm test`); backend tests already pass (`dotnet test` → 6/6)
- Phase 3 AI workflow documented incrementally in Steps 1–15 (this file); no retroactive batch doc needed

#### Phase 5 — Polish and hardening (complete)

| Task | Status | What was done |
|------|--------|---------------|
| `.gitignore` | Done | Root rules for `bin/`, `obj/`, `node_modules/`, `dist/`, `*.db`, `.env`; keeps `package-lock.json` and `.env.example` |
| README | Done | Clone-to-run guide: prerequisites, two-terminal startup, committed vs generated files, troubleshooting |
| Data persistence | Done | SQLite at `Data/learningdashboard.db` (gitignored); migrations + seed on first `dotnet run`; survives restarts |
| Acceptance criteria | Done | 12/12 met; `dotnet test` 6/6; `npm test` 7/7 |

**GitHub clone readiness** — files committed so new users can run locally:

| In repository | Generated on first run (gitignored) |
|---------------|-------------------------------------|
| Source, migrations, `package-lock.json`, `NuGet.Config`, `.env.example` | `node_modules/`, `bin/`, `obj/`, `dist/`, `*.db` |

- Verified `*.db` is gitignored (`git check-ignore`)
- Verified `dotnet test` → 6 passed
- Verified live API returns persisted data after prior sessions

### Debugging

- Resolved NuGet feed issue (corporate Azure feed 401) by adding project-level `NuGet.Config` scoped to nuget.org
- Skipped unnecessary workspace root switching when it caused interruptions

### Code Generation

Phases 1–3, Phase 5 polish, and all mandatory tests (Phase 4) are complete.

#### Phase 4 — Frontend tests (complete)

| Test file | Tests | Coverage |
|-----------|-------|----------|
| `pages/DashboardPage.test.tsx` | 2 | Renders counts from mocked API; error state on API failure |
| `components/TaskForm.test.tsx` | 2 | Empty title validation; successful submit payload |
| `validation/taskFormValidation.test.ts` | 3 | Required title/owner; valid form passes |

**Result:** `npm test` → **7 passed, 0 failed**

### Code Review

- Reviewed generated entities for naming consistency and annotation coverage
- Confirmed seed data uses static timestamps (required for EF Core `HasData` in migrations)
- Phase 3: reviewed UI state coverage on all data-fetching pages before marking phase complete

**Acceptance criteria (PROJECT-PLAN §6):** All 12/12 verified 2026-07-20 — `dotnet test` 6/6, `npm test` 7/7, live API checks, UI state components on all pages, `.gitignore` for secrets/DB.

## 4. Information I Avoid Sharing with AI Tools

- API keys, tokens, and passwords
- Real connection strings with credentials (using local SQLite only)
- Personal email addresses or PII (seed data uses `@example.com` placeholders)
- Employer-specific proprietary code or internal package feeds

## 5. Reusing This Workflow in a Real Project

- Start with a written plan (`PROJECT-PLAN.md`) and phased checklist before codegen
- Provide the agent with entity specs, folder conventions, and acceptance criteria upfront
- Implement in small verified steps (entities → DbContext → config → seed → migrate)
- Run `dotnet build` after each step as a gate
- Document AI usage in `tool-workflow.MD` as you go, not at the end
- Keep a project-level `NuGet.Config` when global feeds may fail in isolated repos
