using LearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearningDashboard.Api.Data;

public static class DbSeeder
{
    private static readonly DateTime SeedTimestamp = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public static void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Name = "Alice Admin",
                Email = "alice@example.com",
                Role = UserRole.Admin
            },
            new User
            {
                Id = 2,
                Name = "Bob Member",
                Email = "bob@example.com",
                Role = UserRole.Member
            },
            new User
            {
                Id = 3,
                Name = "Carol Member",
                Email = "carol@example.com",
                Role = UserRole.Member
            });

        modelBuilder.Entity<ProjectTask>().HasData(
            new ProjectTask
            {
                Id = 1,
                Title = "Complete EF Core fundamentals",
                Description = "Work through migrations, relationships, and seeding.",
                Category = "Learning",
                Priority = TaskPriority.High,
                Status = Entities.TaskStatus.InProgress,
                OwnerId = 1,
                DueDate = new DateTime(2026, 7, 25, 0, 0, 0, DateTimeKind.Utc),
                CreatedAt = SeedTimestamp,
                UpdatedAt = SeedTimestamp
            },
            new ProjectTask
            {
                Id = 2,
                Title = "Build dashboard summary API",
                Description = "Implement counts for total, completed, in-progress, overdue, and high-priority items.",
                Category = "Project",
                Priority = TaskPriority.Medium,
                Status = Entities.TaskStatus.Planned,
                OwnerId = 2,
                DueDate = new DateTime(2026, 7, 30, 0, 0, 0, DateTimeKind.Utc),
                CreatedAt = SeedTimestamp,
                UpdatedAt = SeedTimestamp
            });
    }
}
