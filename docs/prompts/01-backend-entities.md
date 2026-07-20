# Prompt: Scaffold backend entities and DbContext

Use this when starting a new ASP.NET Core API with EF Core.

## Context to provide

- Entity names and fields from the assessment spec
- Folder layout: `Entities/`, `Data/`, `DTOs/`, `Services/`, `Endpoints/`
- Target: .NET 9, SQLite, enum storage as strings

## Prompt

```
Create domain entities [User, ProjectTask] with these fields: [paste spec].
Add AppDbContext with fluent configuration, restrict delete on task ownership,
enum-as-string conversions, and a DbSeeder with fixed IDs for migrations.
Wire SQLite in Program.cs with auto-migrate on startup.
Do not add controllers — use minimal API endpoint groups.
```

## Expected output

- Entity classes with data annotations
- `AppDbContext` + `DbSeeder`
- Initial EF migration
- `Program.cs` with `AddDbContext` and `Migrate()`

## Review checklist

- [ ] Required fields and max lengths match spec
- [ ] Seed uses static `DateTime` for `HasData`
- [ ] `TaskStatus` does not conflict with `System.Threading.Tasks.TaskStatus`
