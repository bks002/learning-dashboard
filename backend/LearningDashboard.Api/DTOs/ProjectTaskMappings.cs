using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Entities;

namespace LearningDashboard.Api.DTOs;

public static class ProjectTaskMappings
{
    public static ProjectTaskResponse ToResponse(this ProjectTask task) =>
        new()
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Category = task.Category,
            Priority = task.Priority,
            Status = task.Status,
            OwnerId = task.OwnerId,
            OwnerName = task.Owner?.Name ?? string.Empty,
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt
        };

    public static UserResponse ToResponse(this User user) =>
        new()
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
}
