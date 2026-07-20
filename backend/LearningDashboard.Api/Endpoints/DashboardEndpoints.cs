using LearningDashboard.Api.Services;

namespace LearningDashboard.Api.Endpoints;

public static class DashboardEndpoints
{
    public static RouteGroupBuilder MapDashboardEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/dashboard/summary", async (
            IDashboardService dashboardService,
            CancellationToken cancellationToken) =>
        {
            var summary = await dashboardService.GetSummaryAsync(cancellationToken);
            return Results.Ok(summary);
        })
        .WithName("GetDashboardSummary");

        return group;
    }
}
