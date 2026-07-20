using System.ComponentModel.DataAnnotations;

namespace LearningDashboard.Api.DTOs;

public class UpdateTaskStatusRequest
{
    [Required]
    public Entities.TaskStatus Status { get; set; }
}
