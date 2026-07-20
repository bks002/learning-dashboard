# Database Setup Notes

## Database Choice

| Item | Detail |
|------|--------|
| **Database** | SQLite 3 (file-based) |
| **ORM** | Entity Framework Core 9.0.15 |
| **Location** | `backend/LearningDashboard.Api/Data/learningdashboard.db` |
| **In git?** | **No** — file is gitignored; schema travels via migrations |

## Connection String

**`appsettings.json`:**
```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=Data/learningdashboard.db"
}
```

At runtime, `Program.cs` resolves the path under `ContentRootPath/Data/learningdashboard.db` and creates the `Data/` directory if missing.

No real passwords in connection strings. JWT settings in `appsettings.json` use a **development-only** placeholder key.

## Migration Commands

From repository root:

```bash
cd backend

# Apply migrations (also runs automatically on startup)
dotnet ef database update --project LearningDashboard.Api

# Create a new migration (if schema changes)
dotnet ef migrations add <MigrationName> --project LearningDashboard.Api
```

Migrations are checked into:
`backend/LearningDashboard.Api/Migrations/`

See [schema-or-migrations/README.md](schema-or-migrations/README.md).

## Seed Data

| Source | What |
|--------|------|
| `DbSeeder.cs` (`HasData`) | 3 users, 2 sample tasks (fixed timestamps for EF) |
| `PasswordSeeder.cs` (startup) | Sets `Password123!` hash for users without one |

Details: [seed-data/README.md](seed-data/README.md).

## Steps to Run Locally

1. `cd backend && dotnet restore`
2. `dotnet run --project LearningDashboard.Api --launch-profile http`
3. On first run: migrations apply → `learningdashboard.db` created and seeded
4. Stop and restart API → data still present in SQLite file

## Verify Persistence After Restart

1. Create a task via UI or Swagger
2. Stop the API (`Ctrl+C`)
3. Start the API again
4. Confirm task still appears in list and dashboard counts updated

## Integration Tests

Tests use **in-memory SQLite** via `WebApplicationFactory` — they do not read/write the on-disk `learningdashboard.db`.

## Docker

When using `docker compose up`, SQLite file persists in Docker volume `api-data` mounted at `/app/Data`.
