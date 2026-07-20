using System.Net.Http.Json;
using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Entities;

namespace LearningDashboard.Api.Tests;

public class DashboardTests(LearningDashboardApiFactory factory) : IntegrationTestBase(factory)
{
    [Fact]
    public async Task DashboardCounts_UpdateAfterCreateUpdateAndComplete()
    {
        var initial = await GetDashboardSummaryAsync();
        var initialTotal = initial.TotalItems;
        var initialCompleted = initial.CompletedItems;
        var initialInProgress = initial.InProgressItems;

        var created = await CreateTaskAsync("Dashboard count test", priority: TaskPriority.High);

        var afterCreate = await GetDashboardSummaryAsync();
        Assert.Equal(initialTotal + 1, afterCreate.TotalItems);
        Assert.Equal(initialInProgress, afterCreate.InProgressItems);
        Assert.Equal(initial.HighPriorityItems + 1, afterCreate.HighPriorityItems);

        var updateRequest = new UpdateProjectTaskRequest
        {
            Title = created.Title,
            Description = created.Description,
            Category = created.Category,
            Priority = created.Priority,
            Status = Entities.TaskStatus.InProgress,
            OwnerId = created.OwnerId
        };

        await Client.PutAsJsonAsync($"/api/tasks/{created.Id}", updateRequest, JsonOptions);

        var afterInProgress = await GetDashboardSummaryAsync();
        Assert.Equal(initialInProgress + 1, afterInProgress.InProgressItems);

        var patchRequest = new UpdateTaskStatusRequest { Status = Entities.TaskStatus.Completed };
        await Client.PatchAsJsonAsync($"/api/tasks/{created.Id}/status", patchRequest, JsonOptions);

        var afterComplete = await GetDashboardSummaryAsync();
        Assert.Equal(initialCompleted + 1, afterComplete.CompletedItems);
        Assert.Equal(initialInProgress, afterComplete.InProgressItems);
    }
}
