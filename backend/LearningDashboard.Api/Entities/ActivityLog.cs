namespace LearningDashboard.Api.Entities;

public class ActivityLog
{
    public int Id { get; set; }

    public int TaskId { get; set; }

    public ProjectTask Task { get; set; } = null!;

    public ActivityAction Action { get; set; }

    public string Message { get; set; } = string.Empty;

    public int? PerformedByUserId { get; set; }

    public User? PerformedByUser { get; set; }

    public DateTime CreatedAt { get; set; }
}
