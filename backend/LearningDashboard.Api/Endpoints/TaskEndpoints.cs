using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Extensions;
using LearningDashboard.Api.Services;

namespace LearningDashboard.Api.Endpoints;

public static class TaskEndpoints
{
    public static RouteGroupBuilder MapTaskEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/tasks", async (
            int? page,
            int? pageSize,
            string? status,
            string? search,
            string? priority,
            string? sortBy,
            string? sortDir,
            ITaskService taskService,
            CancellationToken cancellationToken) =>
        {
            var query = new TaskListQuery
            {
                Page = page ?? 1,
                PageSize = pageSize ?? 10,
                Status = status,
                Search = search,
                Priority = priority,
                SortBy = sortBy ?? "updatedAt",
                SortDir = sortDir ?? "desc"
            };

            var tasks = await taskService.GetTasksAsync(query, cancellationToken);
            return Results.Ok(tasks);
        })
        .WithName("GetTasks");

        group.MapGet("/tasks/{id:int}", async (
            int id,
            ITaskService taskService,
            CancellationToken cancellationToken) =>
        {
            var task = await taskService.GetTaskByIdAsync(id, cancellationToken);
            return task is null ? Results.NotFound() : Results.Ok(task);
        })
        .WithName("GetTaskById");

        group.MapPost("/tasks", async (
            CreateProjectTaskRequest request,
            HttpContext httpContext,
            ITaskService taskService,
            CancellationToken cancellationToken) =>
        {
            var (task, error) = await taskService.CreateTaskAsync(
                request,
                httpContext.User.GetUserId(),
                cancellationToken);

            if (error is not null)
            {
                return Results.BadRequest(new { error });
            }

            return Results.Created($"/api/tasks/{task!.Id}", task);
        })
        .WithName("CreateTask");

        group.MapPut("/tasks/{id:int}", async (
            int id,
            UpdateProjectTaskRequest request,
            HttpContext httpContext,
            ITaskService taskService,
            CancellationToken cancellationToken) =>
        {
            var (task, error) = await taskService.UpdateTaskAsync(
                id,
                request,
                httpContext.User.GetUserId(),
                httpContext.User.GetUserRole(),
                cancellationToken);

            if (error is null)
            {
                return Results.Ok(task);
            }

            return error == "Task not found."
                ? Results.NotFound(new { error })
                : error.Contains("permission", StringComparison.OrdinalIgnoreCase)
                    ? Results.Forbid()
                    : Results.BadRequest(new { error });
        })
        .WithName("UpdateTask");

        group.MapPatch("/tasks/{id:int}/status", async (
            int id,
            UpdateTaskStatusRequest request,
            HttpContext httpContext,
            ITaskService taskService,
            CancellationToken cancellationToken) =>
        {
            var (task, error) = await taskService.UpdateTaskStatusAsync(
                id,
                request.Status,
                httpContext.User.GetUserId(),
                httpContext.User.GetUserRole(),
                cancellationToken);

            if (error is null)
            {
                return Results.Ok(task);
            }

            return error == "Task not found."
                ? Results.NotFound(new { error })
                : error.Contains("permission", StringComparison.OrdinalIgnoreCase)
                    ? Results.Forbid()
                    : Results.BadRequest(new { error });
        })
        .WithName("UpdateTaskStatus");

        return group;
    }
}
