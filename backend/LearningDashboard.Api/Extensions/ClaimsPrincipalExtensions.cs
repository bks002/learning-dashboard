using System.Security.Claims;
using LearningDashboard.Api.Entities;

namespace LearningDashboard.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static int? GetUserId(this ClaimsPrincipal? principal)
    {
        var value = principal?.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var userId) ? userId : null;
    }

    public static UserRole? GetUserRole(this ClaimsPrincipal? principal)
    {
        var value = principal?.FindFirstValue(ClaimTypes.Role);
        return Enum.TryParse<UserRole>(value, ignoreCase: true, out var role) ? role : null;
    }
}
