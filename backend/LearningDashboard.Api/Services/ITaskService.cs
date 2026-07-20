using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Entities;

namespace LearningDashboard.Api.Services;

public interface ITaskService
{
    Task<IReadOnlyList<ProjectTaskResponse>> GetTasksAsync(
        string? status,
        string? search,
        CancellationToken cancellationToken = default);

    Task<ProjectTaskResponse?> GetTaskByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<(ProjectTaskResponse? Task, string? Error)> CreateTaskAsync(
        CreateProjectTaskRequest request,
        CancellationToken cancellationToken = default);

    Task<(ProjectTaskResponse? Task, string? Error)> UpdateTaskAsync(
        int id,
        UpdateProjectTaskRequest request,
        CancellationToken cancellationToken = default);

    Task<(ProjectTaskResponse? Task, string? Error)> UpdateTaskStatusAsync(
        int id,
        Entities.TaskStatus status,
        CancellationToken cancellationToken = default);
}
