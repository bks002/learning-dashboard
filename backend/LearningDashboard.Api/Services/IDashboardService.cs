using LearningDashboard.Api.DTOs;

namespace LearningDashboard.Api.Services;

public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummaryAsync(CancellationToken cancellationToken = default);
}
