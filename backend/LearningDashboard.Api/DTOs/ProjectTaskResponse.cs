using LearningDashboard.Api.Entities;

namespace LearningDashboard.Api.DTOs;

public class ProjectTaskResponse
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Category { get; set; }

    public TaskPriority Priority { get; set; }

    public Entities.TaskStatus Status { get; set; }

    public int OwnerId { get; set; }

    public string OwnerName { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
