using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Entities;

namespace LearningDashboard.Api.Services;

public interface ITaskService
{
    Task<PagedTasksResponse> GetTasksAsync(
        TaskListQuery query,
        CancellationToken cancellationToken = default);

    Task<ProjectTaskResponse?> GetTaskByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<(ProjectTaskResponse? Task, string? Error)> CreateTaskAsync(
        CreateProjectTaskRequest request,
        int? performedByUserId,
        CancellationToken cancellationToken = default);

    Task<(ProjectTaskResponse? Task, string? Error)> UpdateTaskAsync(
        int id,
        UpdateProjectTaskRequest request,
        int? userId,
        UserRole? role,
        CancellationToken cancellationToken = default);

    Task<(ProjectTaskResponse? Task, string? Error)> UpdateTaskStatusAsync(
        int id,
        Entities.TaskStatus status,
        int? userId,
        UserRole? role,
        CancellationToken cancellationToken = default);
}
