using LearningDashboard.Api.Entities;

namespace LearningDashboard.Api.DTOs;

public class ActivityLogResponse
{
    public int Id { get; set; }

    public int TaskId { get; set; }

    public ActivityAction Action { get; set; }

    public string Message { get; set; } = string.Empty;

    public int? PerformedByUserId { get; set; }

    public string? PerformedByUserName { get; set; }

    public DateTime CreatedAt { get; set; }
}
