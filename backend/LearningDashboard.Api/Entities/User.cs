using System.ComponentModel.DataAnnotations;

namespace LearningDashboard.Api.Entities;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
}
