# Prompt: Add API endpoint group with validation

Use when adding CRUD endpoints to an existing minimal API project.

## Context to provide

- Existing `ValidationFilter` and `MapApiGroup()` extension
- DTOs for request/response (separate from entities)
- Service layer returning `(Result, Error)` tuples

## Prompt

```
Add minimal API endpoints for [resource]:
- GET list with optional ?status= and ?search=
- GET by id
- POST create (201 + Location header)
- PUT full update
- PATCH status-only update

Use existing TaskService pattern: scoped service, Include owner for list/detail,
server-side timestamps, owner existence check returns 400, missing resource returns 404.
Register on MapApiGroup() so ValidationFilter applies.
Add JsonStringEnumConverter for string enums in JSON.
```

## Review checklist

- [ ] Validation errors return `ValidationProblem` (400)
- [ ] Enums serialize as strings in Swagger
- [ ] Business rules match assessment (e.g. overdue counts)
