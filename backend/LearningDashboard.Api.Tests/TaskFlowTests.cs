using System.Net;
using System.Net.Http.Json;
using LearningDashboard.Api.DTOs;
using LearningDashboard.Api.Entities;

namespace LearningDashboard.Api.Tests;

public class TaskFlowTests(LearningDashboardApiFactory factory) : IntegrationTestBase(factory)
{
    [Fact]
    public async Task CreateTask_AppearsInList()
    {
        var created = await CreateTaskAsync("Integration create test");

        var tasks = await Client.GetFromJsonAsync<List<ProjectTaskResponse>>("/api/tasks", JsonOptions);

        Assert.NotNull(tasks);
        Assert.Contains(tasks, task => task.Id == created.Id && task.Title == "Integration create test");
    }

    [Fact]
    public async Task UpdateTask_PersistsFields()
    {
        var created = await CreateTaskAsync("Before update");

        var updateRequest = new UpdateProjectTaskRequest
        {
            Title = "After update",
            Description = "Updated description",
            Category = "Updated",
            Priority = TaskPriority.High,
            Status = Entities.TaskStatus.InProgress,
            OwnerId = 2,
            DueDate = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        var updateResponse = await Client.PutAsJsonAsync($"/api/tasks/{created.Id}", updateRequest, JsonOptions);
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        var updated = await Client.GetFromJsonAsync<ProjectTaskResponse>($"/api/tasks/{created.Id}", JsonOptions);

        Assert.NotNull(updated);
        Assert.Equal("After update", updated.Title);
        Assert.Equal("Updated description", updated.Description);
        Assert.Equal("Updated", updated.Category);
        Assert.Equal(TaskPriority.High, updated.Priority);
        Assert.Equal(Entities.TaskStatus.InProgress, updated.Status);
        Assert.Equal(2, updated.OwnerId);
        Assert.Equal("Bob Member", updated.OwnerName);
    }

    [Fact]
    public async Task CreateTask_WithEmptyTitle_ReturnsBadRequest()
    {
        var request = new CreateProjectTaskRequest
        {
            Title = "",
            OwnerId = 1,
            Priority = TaskPriority.Low,
            Status = Entities.TaskStatus.Planned
        };

        var response = await Client.PostAsJsonAsync("/api/tasks", request, JsonOptions);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetTasks_WithStatusFilter_ReturnsMatchingTasks()
    {
        await CreateTaskAsync("Filtered in progress", status: Entities.TaskStatus.InProgress);
        await CreateTaskAsync("Filtered planned", status: Entities.TaskStatus.Planned);

        var tasks = await Client.GetFromJsonAsync<List<ProjectTaskResponse>>(
            "/api/tasks?status=InProgress",
            JsonOptions);

        Assert.NotNull(tasks);
        Assert.NotEmpty(tasks);
        Assert.All(tasks, task => Assert.Equal(Entities.TaskStatus.InProgress, task.Status));
        Assert.Contains(tasks, task => task.Title == "Filtered in progress");
    }

    [Fact]
    public async Task GetTasks_WithSearch_ReturnsMatchingTasks()
    {
        const string uniqueKeyword = "XyZSearchTerm987";
        await CreateTaskAsync($"{uniqueKeyword} task title");

        var tasks = await Client.GetFromJsonAsync<List<ProjectTaskResponse>>(
            $"/api/tasks?search={uniqueKeyword}",
            JsonOptions);

        Assert.NotNull(tasks);
        Assert.Single(tasks);
        Assert.Contains(uniqueKeyword, tasks[0].Title);
    }
}
