using LearningDashboard.Api.Data;
using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearningDashboard.Api.Services;

public class TaskService(AppDbContext dbContext) : ITaskService
{
    public async Task<IReadOnlyList<ProjectTaskResponse>> GetTasksAsync(
        string? status,
        string? search,
        CancellationToken cancellationToken = default)
    {
        var query = dbContext.ProjectTasks
            .AsNoTracking()
            .Include(task => task.Owner)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<Entities.TaskStatus>(status, ignoreCase: true, out var parsedStatus))
        {
            query = query.Where(task => task.Status == parsedStatus);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var keyword = search.Trim();
            query = query.Where(task =>
                EF.Functions.Like(task.Title, $"%{keyword}%") ||
                (task.Description != null && EF.Functions.Like(task.Description, $"%{keyword}%")) ||
                (task.Category != null && EF.Functions.Like(task.Category, $"%{keyword}%")));
        }

        var tasks = await query
            .OrderByDescending(task => task.UpdatedAt)
            .ToListAsync(cancellationToken);

        return tasks.Select(task => task.ToResponse()).ToList();
    }

    public async Task<ProjectTaskResponse?> GetTaskByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var task = await dbContext.ProjectTasks
            .AsNoTracking()
            .Include(task => task.Owner)
            .FirstOrDefaultAsync(task => task.Id == id, cancellationToken);

        return task?.ToResponse();
    }

    public async Task<(ProjectTaskResponse? Task, string? Error)> CreateTaskAsync(
        CreateProjectTaskRequest request,
        CancellationToken cancellationToken = default)
    {
        var ownerExists = await dbContext.Users.AnyAsync(user => user.Id == request.OwnerId, cancellationToken);
        if (!ownerExists)
        {
            return (null, $"Owner with id {request.OwnerId} was not found.");
        }

        var now = DateTime.UtcNow;
        var task = new ProjectTask
        {
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            Priority = request.Priority,
            Status = request.Status,
            OwnerId = request.OwnerId,
            DueDate = request.DueDate,
            CreatedAt = now,
            UpdatedAt = now
        };

        dbContext.ProjectTasks.Add(task);
        await dbContext.SaveChangesAsync(cancellationToken);

        await dbContext.Entry(task).Reference(t => t.Owner).LoadAsync(cancellationToken);
        return (task.ToResponse(), null);
    }

    public async Task<(ProjectTaskResponse? Task, string? Error)> UpdateTaskAsync(
        int id,
        UpdateProjectTaskRequest request,
        CancellationToken cancellationToken = default)
    {
        var task = await dbContext.ProjectTasks
            .Include(t => t.Owner)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (task is null)
        {
            return (null, "Task not found.");
        }

        var ownerExists = await dbContext.Users.AnyAsync(user => user.Id == request.OwnerId, cancellationToken);
        if (!ownerExists)
        {
            return (null, $"Owner with id {request.OwnerId} was not found.");
        }

        task.Title = request.Title;
        task.Description = request.Description;
        task.Category = request.Category;
        task.Priority = request.Priority;
        task.Status = request.Status;
        task.OwnerId = request.OwnerId;
        task.DueDate = request.DueDate;
        task.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return (task.ToResponse(), null);
    }

    public async Task<(ProjectTaskResponse? Task, string? Error)> UpdateTaskStatusAsync(
        int id,
        Entities.TaskStatus status,
        CancellationToken cancellationToken = default)
    {
        var task = await dbContext.ProjectTasks
            .Include(t => t.Owner)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (task is null)
        {
            return (null, "Task not found.");
        }

        task.Status = status;
        task.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return (task.ToResponse(), null);
    }
}
