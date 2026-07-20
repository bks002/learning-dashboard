using LearningDashboard.Api.Services;

namespace LearningDashboard.Api.Endpoints;

public static class ActivityLogEndpoints
{
    public static RouteGroupBuilder MapActivityLogEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/tasks/{id:int}/activity", async (
            int id,
            ITaskService taskService,
            IActivityLogService activityLogService,
            CancellationToken cancellationToken) =>
        {
            var task = await taskService.GetTaskByIdAsync(id, cancellationToken);
            if (task is null)
            {
                return Results.NotFound();
            }

            var logs = await activityLogService.GetLogsForTaskAsync(id, cancellationToken);
            return Results.Ok(logs);
        })
        .WithName("GetTaskActivityLogs");

        return group;
    }
}
