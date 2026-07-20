# API Contract

Base URL: `/api`  
Auth: `Authorization: Bearer <token>` required except where noted.  
Enums: JSON strings (`Planned`, `InProgress`, `Completed`, `Low`, `Medium`, `High`, `Admin`, `Member`).

---

## Health

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/health` | Anonymous | Liveness check |

**Response:** `{ "status": "healthy" }`

---

## Auth (Stretch)

### POST `/auth/login`

**Request:**
```json
{ "email": "alice@example.com", "password": "Password123!" }
```

**Response `200`:**
```json
{
  "token": "<jwt>",
  "userId": 1,
  "name": "Alice Admin",
  "email": "alice@example.com",
  "role": "Admin"
}
```

**Errors:** `401` invalid credentials

---

## Dashboard

### GET `/dashboard/summary`

**Response `200`:**
```json
{
  "totalItems": 5,
  "completedItems": 2,
  "inProgressItems": 1,
  "overdueItems": 1,
  "highPriorityItems": 3
}
```

**Rules:** Overdue = `dueDate < today (UTC)` AND `status != Completed`. High priority = all tasks with `priority == High`.

---

## Users

### GET `/users`

**Response `200`:** `UserResponse[]` — `{ id, name, email, role }` (for owner dropdown)

---

## Tasks

### GET `/tasks`

**Query:** `page`, `pageSize`, `status`, `search`, `priority`, `sortBy`, `sortDir`

**Response `200`:**
```json
{
  "items": [ "ProjectTaskResponse..." ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 25,
  "totalPages": 3
}
```

**Defaults:** `page=1`, `pageSize=10`, `sortBy=updatedAt`, `sortDir=desc`

### GET `/tasks/{id}`

**Response `200`:** `ProjectTaskResponse`  
**Errors:** `404`

### POST `/tasks`

**Request:** `CreateProjectTaskRequest` — `title` (required), `description`, `category`, `priority`, `status`, `ownerId`, `dueDate`

**Response `201`:** `ProjectTaskResponse`  
**Errors:** `400` validation / invalid owner

### PUT `/tasks/{id}`

**Request:** `UpdateProjectTaskRequest` (same fields as create)  
**Response `200`:** `ProjectTaskResponse`  
**Errors:** `400`, `403`, `404`

### PATCH `/tasks/{id}/status`

**Request:** `{ "status": "InProgress" }`  
**Response `200`:** `ProjectTaskResponse`  
**Errors:** `403`, `404`

---

## Activity (Stretch)

### GET `/tasks/{id}/activity`

**Response `200`:** `ActivityLogResponse[]` — `{ id, taskId, action, message, performedByUserId, performedByUserName, createdAt }`

---

## ProjectTaskResponse

```json
{
  "id": 1,
  "title": "string",
  "description": "string | null",
  "category": "string | null",
  "priority": "Low | Medium | High",
  "status": "Planned | InProgress | Completed",
  "ownerId": 1,
  "ownerName": "string",
  "dueDate": "ISO-8601 | null",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

## Validation Rules (create/update)

| Field | Rule |
|-------|------|
| title | Required, max 200 |
| description | Max 2000 |
| category | Max 100 |
| ownerId | Must reference existing user |

## Error Responses

- `400` — `ValidationProblem` or `{ "error": "..." }`
- `401` — `{ "error": "Unauthorized" }`
- `403` — `{ "error": "..." }` (RBAC)
- `404` — `{ "error": "Task not found" }`

Swagger UI (Development): http://localhost:5004/swagger
