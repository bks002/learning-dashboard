using System.ComponentModel.DataAnnotations;
using LearningDashboard.Api.Entities;

namespace LearningDashboard.Api.DTOs;

public class CreateProjectTaskRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [MaxLength(100)]
    public string? Category { get; set; }

    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    public Entities.TaskStatus Status { get; set; } = Entities.TaskStatus.Planned;

    [Range(1, int.MaxValue)]
    public int OwnerId { get; set; }

    public DateTime? DueDate { get; set; }
}
