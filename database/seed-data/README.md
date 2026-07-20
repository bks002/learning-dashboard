# Seed Data

## Users (via `DbSeeder.HasData`)

| Id | Name | Email | Role |
|----|------|-------|------|
| 1 | Alice Admin | alice@example.com | Admin |
| 2 | Bob Member | bob@example.com | Member |
| 3 | Carol Member | carol@example.com | Member |

Passwords are **not** in the migration seed. On startup, `PasswordSeeder` sets:

- **Password:** `Password123!` (all three users)

## Sample Tasks (via `DbSeeder.HasData`)

| Id | Title | Owner | Status | Priority |
|----|-------|-------|--------|----------|
| 1 | Complete EF Core fundamentals | Alice (1) | InProgress | High |
| 2 | Build dashboard summary API | Bob (2) | Planned | Medium |

## Timestamps

Seed uses fixed UTC timestamp `2026-01-01` for EF `HasData` compatibility.

## Re-seed / fresh database

Delete `backend/LearningDashboard.Api/Data/learningdashboard.db` and restart the API. Migrations recreate schema and seed data.
