using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Services;

namespace LearningDashboard.Api.Endpoints;

public static class TaskEndpoints
{
    public static RouteGroupBuilder MapTaskEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/tasks", async (
            string? status,
            string? search,
            ITaskService taskService,
            CancellationToken cancellationToken) =>
        {
            var tasks = await taskService.GetTasksAsync(status, search, cancellationToken);
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
            ITaskService taskService,
            CancellationToken cancellationToken) =>
        {
            var (task, error) = await taskService.CreateTaskAsync(request, cancellationToken);

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
            ITaskService taskService,
            CancellationToken cancellationToken) =>
        {
            var (task, error) = await taskService.UpdateTaskAsync(id, request, cancellationToken);

            if (error is null)
            {
                return Results.Ok(task);
            }

            return error == "Task not found."
                ? Results.NotFound(new { error })
                : Results.BadRequest(new { error });
        })
        .WithName("UpdateTask");

        group.MapPatch("/tasks/{id:int}/status", async (
            int id,
            UpdateTaskStatusRequest request,
            ITaskService taskService,
            CancellationToken cancellationToken) =>
        {
            var (task, error) = await taskService.UpdateTaskStatusAsync(id, request.Status, cancellationToken);

            if (error is null)
            {
                return Results.Ok(task);
            }

            return Results.NotFound(new { error });
        })
        .WithName("UpdateTaskStatus");

        return group;
    }
}
