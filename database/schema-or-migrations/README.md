# Schema / Migrations

EF Core migrations are the source of truth for database schema. They live in the backend project:

```
backend/LearningDashboard.Api/Migrations/
├── 20260720162312_InitialCreate.cs
├── 20260720162312_InitialCreate.Designer.cs
├── 20260720175633_Phase6_StretchFeatures.cs
├── 20260720175633_Phase6_StretchFeatures.Designer.cs
└── AppDbContextModelSnapshot.cs
```

## InitialCreate

- Tables: `Users`, `ProjectTasks`
- Seed: 3 users, 2 tasks via `HasData`

## Phase6_StretchFeatures

- Table: `ActivityLogs`
- Column: `Users.PasswordHash` (nullable)

## Apply on clone

Migrations run automatically when the API starts:

```csharp
db.Database.Migrate();
await PasswordSeeder.SeedAsync(db);
```

No manual SQL scripts required for reviewers.
