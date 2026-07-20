using LearningDashboard.Api.Validation;

namespace LearningDashboard.Api.Extensions;

public static class WebApplicationExtensions
{
    public static RouteGroupBuilder MapApiGroup(this WebApplication app)
    {
        return app.MapGroup("/api")
            .AddEndpointFilter<ValidationFilter>();
    }
}
