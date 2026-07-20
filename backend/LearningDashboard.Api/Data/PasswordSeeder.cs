using LearningDashboard.Api.Data;
using LearningDashboard.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LearningDashboard.Api.Data;

public static class PasswordSeeder
{
    private const string DefaultPassword = "Password123!";

    public static async Task SeedAsync(AppDbContext dbContext, CancellationToken cancellationToken = default)
    {
        var users = await dbContext.Users
            .Where(user => user.PasswordHash == null)
            .ToListAsync(cancellationToken);

        if (users.Count == 0)
        {
            return;
        }

        var hasher = new PasswordHasher<User>();
        foreach (var user in users)
        {
            user.PasswordHash = hasher.HashPassword(user, DefaultPassword);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
