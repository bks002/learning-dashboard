using LearningDashboard.Api.Entities;

namespace LearningDashboard.Api.DTOs;

public class TaskListQuery
{
    public int Page { get; init; } = 1;

    public int PageSize { get; init; } = 10;

    public string? Status { get; init; }

    public string? Search { get; init; }

    public string? Priority { get; init; }

    public string SortBy { get; init; } = "updatedAt";

    public string SortDir { get; init; } = "desc";
}
