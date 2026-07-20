using System.ComponentModel.DataAnnotations;

namespace LearningDashboard.Api.Validation;

public sealed class ValidationFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        foreach (var argument in context.Arguments)
        {
            if (argument is null)
            {
                continue;
            }

            var argumentType = argument.GetType();

            if (argumentType.IsPrimitive || argumentType == typeof(string) || argumentType == typeof(DateTime) || argumentType == typeof(DateOnly))
            {
                continue;
            }

            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(argument);

            if (!Validator.TryValidateObject(argument, validationContext, validationResults, validateAllProperties: true))
            {
                var errors = validationResults
                    .GroupBy(result => result.MemberNames.FirstOrDefault() ?? string.Empty)
                    .ToDictionary(
                        group => group.Key,
                        group => group.Select(result => result.ErrorMessage ?? "Invalid value.").ToArray());

                return Results.ValidationProblem(errors);
            }
        }

        return await next(context);
    }
}
