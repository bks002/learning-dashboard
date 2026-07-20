# UI Flow

## Routes

| Path | Page | Auth | Description |
|------|------|------|-------------|
| `/login` | LoginPage | Public | JWT sign-in |
| `/` | DashboardPage | Protected | 5 summary cards + quick actions |
| `/tasks` | TaskListPage | Protected | Paged table, filters, search |
| `/tasks/new` | CreateTaskPage | Protected | Create form |
| `/tasks/:id` | TaskDetailPage | Protected | Read-only detail + status actions + activity log |
| `/tasks/:id/edit` | EditTaskPage | Protected | Pre-filled edit form |

Unauthenticated users hitting protected routes → redirect to `/login` with return URL.

## Primary User Flows

### 1. Sign in (Stretch)

```
/login → enter credentials → POST /api/auth/login → store JWT → redirect to /
```

### 2. View dashboard

```
/ → GET /api/dashboard/summary
  → LoadingSpinner
  → 5 DashboardCards OR ErrorMessage (retry)
```

### 3. Create task

```
/tasks/new → TaskForm (GET /api/users for owner dropdown)
  → validate → POST /api/tasks
  → Success → navigate to /tasks/:id with success message
  → Error → inline / ErrorMessage
```

### 4. Browse and filter tasks

```
/tasks → GET /api/tasks?page&status&search&priority&sortBy
  → LoadingSpinner
  → Table OR EmptyState OR ErrorMessage
  → Pagination prev/next
```

### 5. View and update task

```
/tasks/:id → GET /api/tasks/:id + GET /api/tasks/:id/activity
  → Detail card + status buttons (PATCH /status)
  → Activity timeline
/tasks/:id/edit → PUT /api/tasks/:id → redirect with success
```

## UI States (signature Core piece)

| State | Component | Used on |
|-------|-----------|---------|
| Loading | `LoadingSpinner` | Dashboard, list, detail, forms, activity |
| Empty | `EmptyState` | Task list (no rows / no filter matches) |
| Error | `ErrorMessage` | API failures, with optional retry |
| Success | `SuccessMessage` | After create/update/status change |

## Navigation

`AppLayout` — sticky header with brand, nav pills (Dashboard / Tasks / New Task), user avatar, sign out.

## Accessibility

- Skip link to `#main-content`
- `aria-label` on filters and pagination
- Focus-visible outlines on interactive elements
- Semantic landmarks (`header`, `main`, `nav`)
