using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Entities;

namespace LearningDashboard.Api.Services;

public interface IActivityLogService
{
    Task LogAsync(
        int taskId,
        ActivityAction action,
        string message,
        int? performedByUserId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ActivityLogResponse>> GetLogsForTaskAsync(
        int taskId,
        CancellationToken cancellationToken = default);
}
