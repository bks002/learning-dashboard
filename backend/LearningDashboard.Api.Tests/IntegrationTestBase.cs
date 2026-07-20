using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Entities;

namespace LearningDashboard.Api.Tests;

public abstract class IntegrationTestBase : IClassFixture<LearningDashboardApiFactory>
{
    protected readonly HttpClient Client;
    protected readonly JsonSerializerOptions JsonOptions;

    protected IntegrationTestBase(LearningDashboardApiFactory factory)
    {
        factory.SeedDatabase();
        Client = factory.CreateClient();
        JsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        };
    }

    protected async Task<ProjectTaskResponse> CreateTaskAsync(
        string title,
        int ownerId = 1,
        TaskPriority priority = TaskPriority.Medium,
        Entities.TaskStatus status = Entities.TaskStatus.Planned)
    {
        var request = new CreateProjectTaskRequest
        {
            Title = title,
            Description = "Integration test task",
            Category = "Test",
            Priority = priority,
            Status = status,
            OwnerId = ownerId
        };

        var response = await Client.PostAsJsonAsync("/api/tasks", request, JsonOptions);
        response.EnsureSuccessStatusCode();

        var created = await response.Content.ReadFromJsonAsync<ProjectTaskResponse>(JsonOptions);
        return created ?? throw new InvalidOperationException("Create task returned null.");
    }

    protected async Task<DashboardSummaryResponse> GetDashboardSummaryAsync()
    {
        var summary = await Client.GetFromJsonAsync<DashboardSummaryResponse>("/api/dashboard/summary", JsonOptions);
        return summary ?? throw new InvalidOperationException("Dashboard summary returned null.");
    }
}
