namespace LearningDashboard.Api.DTOs;

public class DashboardSummaryResponse
{
    public int TotalItems { get; set; }

    public int CompletedItems { get; set; }

    public int InProgressItems { get; set; }

    public int OverdueItems { get; set; }

    public int HighPriorityItems { get; set; }
}
