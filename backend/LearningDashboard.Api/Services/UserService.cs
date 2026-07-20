using LearningDashboard.Api.Data;
using LearningDashboard.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LearningDashboard.Api.Services;

public class UserService(AppDbContext dbContext) : IUserService
{
    public async Task<IReadOnlyList<UserResponse>> GetUsersAsync(CancellationToken cancellationToken = default)
    {
        var users = await dbContext.Users
            .AsNoTracking()
            .OrderBy(user => user.Name)
            .ToListAsync(cancellationToken);

        return users.Select(user => user.ToResponse()).ToList();
    }
}
