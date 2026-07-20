using LearningDashboard.Api.DTOs;

namespace LearningDashboard.Api.Services;

public interface IUserService
{
    Task<IReadOnlyList<UserResponse>> GetUsersAsync(CancellationToken cancellationToken = default);
}
