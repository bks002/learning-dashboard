using LearningDashboard.Api.Data;
using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearningDashboard.Api.Services;

public class ActivityLogService(AppDbContext dbContext) : IActivityLogService
{
    public async Task LogAsync(
        int taskId,
        ActivityAction action,
        string message,
        int? performedByUserId,
        CancellationToken cancellationToken = default)
    {
        dbContext.ActivityLogs.Add(new ActivityLog
        {
            TaskId = taskId,
            Action = action,
            Message = message,
            PerformedByUserId = performedByUserId,
            CreatedAt = DateTime.UtcNow
        });

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<ActivityLogResponse>> GetLogsForTaskAsync(
        int taskId,
        CancellationToken cancellationToken = default)
    {
        var logs = await dbContext.ActivityLogs
            .AsNoTracking()
            .Include(log => log.PerformedByUser)
            .Where(log => log.TaskId == taskId)
            .OrderByDescending(log => log.CreatedAt)
            .ToListAsync(cancellationToken);

        return logs.Select(log => new ActivityLogResponse
        {
            Id = log.Id,
            TaskId = log.TaskId,
            Action = log.Action,
            Message = log.Message,
            PerformedByUserId = log.PerformedByUserId,
            PerformedByUserName = log.PerformedByUser?.Name,
            CreatedAt = log.CreatedAt
        }).ToList();
    }
}
