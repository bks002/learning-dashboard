using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Extensions;
using LearningDashboard.Api.Services;

namespace LearningDashboard.Api.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder group)
    {
        group.MapPost("/auth/login", async (
            LoginRequest request,
            IAuthService authService,
            CancellationToken cancellationToken) =>
        {
            var (response, error) = await authService.LoginAsync(request, cancellationToken);
            return error is null
                ? Results.Ok(response)
                : Results.Json(new { error }, statusCode: StatusCodes.Status401Unauthorized);
        })
        .AllowAnonymous()
        .WithName("Login");

        return group;
    }
}
