using LearningDashboard.Api.Data;
using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearningDashboard.Api.Services;

public class DashboardService(AppDbContext dbContext) : IDashboardService
{
    public async Task<DashboardSummaryResponse> GetSummaryAsync(CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;

        var tasks = await dbContext.ProjectTasks
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return new DashboardSummaryResponse
        {
            TotalItems = tasks.Count,
            CompletedItems = tasks.Count(task => task.Status == Entities.TaskStatus.Completed),
            InProgressItems = tasks.Count(task => task.Status == Entities.TaskStatus.InProgress),
            OverdueItems = tasks.Count(task =>
                task.DueDate.HasValue &&
                task.DueDate.Value.Date < today &&
                task.Status != Entities.TaskStatus.Completed),
            HighPriorityItems = tasks.Count(task => task.Priority == TaskPriority.High)
        };
    }
}
