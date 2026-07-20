using LearningDashboard.Api.Data;
using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearningDashboard.Api.Services;

public class TaskService(AppDbContext dbContext, IActivityLogService activityLogService) : ITaskService
{
    public async Task<PagedTasksResponse> GetTasksAsync(
        TaskListQuery query,
        CancellationToken cancellationToken = default)
    {
        var page = query.Page < 1 ? 1 : query.Page;
        var pageSize = query.PageSize < 1 ? 10 : Math.Min(query.PageSize, 100);

        var dbQuery = dbContext.ProjectTasks
            .AsNoTracking()
            .Include(task => task.Owner)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Status) &&
            Enum.TryParse<Entities.TaskStatus>(query.Status, ignoreCase: true, out var parsedStatus))
        {
            dbQuery = dbQuery.Where(task => task.Status == parsedStatus);
        }

        if (!string.IsNullOrWhiteSpace(query.Priority) &&
            Enum.TryParse<TaskPriority>(query.Priority, ignoreCase: true, out var parsedPriority))
        {
            dbQuery = dbQuery.Where(task => task.Priority == parsedPriority);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var keyword = query.Search.Trim();
            dbQuery = dbQuery.Where(task =>
                EF.Functions.Like(task.Title, $"%{keyword}%") ||
                (task.Description != null && EF.Functions.Like(task.Description, $"%{keyword}%")) ||
                (task.Category != null && EF.Functions.Like(task.Category, $"%{keyword}%")));
        }

        dbQuery = ApplySorting(dbQuery, query.SortBy, query.SortDir);

        var totalCount = await dbQuery.CountAsync(cancellationToken);
        var totalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize);

        var tasks = await dbQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedTasksResponse
        {
            Items = tasks.Select(task => task.ToResponse()).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };
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
        int? performedByUserId,
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

        await activityLogService.LogAsync(
            task.Id,
            ActivityAction.Created,
            $"Task \"{task.Title}\" was created.",
            performedByUserId,
            cancellationToken);

        return (task.ToResponse(), null);
    }

    public async Task<(ProjectTaskResponse? Task, string? Error)> UpdateTaskAsync(
        int id,
        UpdateProjectTaskRequest request,
        int? userId,
        UserRole? role,
        CancellationToken cancellationToken = default)
    {
        var task = await dbContext.ProjectTasks
            .Include(t => t.Owner)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (task is null)
        {
            return (null, "Task not found.");
        }

        if (!CanModifyTask(task, userId, role))
        {
            return (null, "You do not have permission to update this task.");
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

        await activityLogService.LogAsync(
            task.Id,
            ActivityAction.Updated,
            $"Task \"{task.Title}\" was updated.",
            userId,
            cancellationToken);

        return (task.ToResponse(), null);
    }

    public async Task<(ProjectTaskResponse? Task, string? Error)> UpdateTaskStatusAsync(
        int id,
        Entities.TaskStatus status,
        int? userId,
        UserRole? role,
        CancellationToken cancellationToken = default)
    {
        var task = await dbContext.ProjectTasks
            .Include(t => t.Owner)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (task is null)
        {
            return (null, "Task not found.");
        }

        if (!CanModifyTask(task, userId, role))
        {
            return (null, "You do not have permission to update this task.");
        }

        task.Status = status;
        task.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        await activityLogService.LogAsync(
            task.Id,
            ActivityAction.StatusChanged,
            $"Task status changed to {status}.",
            userId,
            cancellationToken);

        return (task.ToResponse(), null);
    }

    private static bool CanModifyTask(ProjectTask task, int? userId, UserRole? role)
    {
        if (userId is null && role is null)
        {
            return true;
        }

        if (role == UserRole.Admin)
        {
            return true;
        }

        return userId.HasValue && task.OwnerId == userId.Value;
    }

    private static IQueryable<ProjectTask> ApplySorting(
        IQueryable<ProjectTask> query,
        string sortBy,
        string sortDir)
    {
        var descending = sortDir.Equals("desc", StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLowerInvariant() switch
        {
            "title" => descending
                ? query.OrderByDescending(task => task.Title)
                : query.OrderBy(task => task.Title),
            "duedate" => descending
                ? query.OrderByDescending(task => task.DueDate)
                : query.OrderBy(task => task.DueDate),
            "priority" => descending
                ? query.OrderByDescending(task => task.Priority)
                : query.OrderBy(task => task.Priority),
            "status" => descending
                ? query.OrderByDescending(task => task.Status)
                : query.OrderBy(task => task.Status),
            _ => descending
                ? query.OrderByDescending(task => task.UpdatedAt)
                : query.OrderBy(task => task.UpdatedAt)
        };
    }
}
