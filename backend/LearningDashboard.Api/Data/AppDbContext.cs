using LearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearningDashboard.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<ProjectTask> ProjectTasks => Set<ProjectTask>();
    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(user => user.Id);

            entity.Property(user => user.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(user => user.Email)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(user => user.Role)
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Property(user => user.PasswordHash)
                .HasMaxLength(500);
        });

        modelBuilder.Entity<ActivityLog>(entity =>
        {
            entity.HasKey(log => log.Id);

            entity.Property(log => log.Action)
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Property(log => log.Message)
                .IsRequired()
                .HasMaxLength(500);

            entity.HasOne(log => log.Task)
                .WithMany()
                .HasForeignKey(log => log.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(log => log.PerformedByUser)
                .WithMany()
                .HasForeignKey(log => log.PerformedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ProjectTask>(entity =>
        {
            entity.HasKey(task => task.Id);

            entity.Property(task => task.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(task => task.Description)
                .HasMaxLength(2000);

            entity.Property(task => task.Category)
                .HasMaxLength(100);

            entity.Property(task => task.Priority)
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Property(task => task.Status)
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.HasOne(task => task.Owner)
                .WithMany(user => user.Tasks)
                .HasForeignKey(task => task.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        DbSeeder.Seed(modelBuilder);
    }
}
