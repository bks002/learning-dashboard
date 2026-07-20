using LearningDashboard.Api.Services;

namespace LearningDashboard.Api.Endpoints;

public static class UserEndpoints
{
    public static RouteGroupBuilder MapUserEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/users", async (
            IUserService userService,
            CancellationToken cancellationToken) =>
        {
            var users = await userService.GetUsersAsync(cancellationToken);
            return Results.Ok(users);
        })
        .WithName("GetUsers");

        return group;
    }
}
