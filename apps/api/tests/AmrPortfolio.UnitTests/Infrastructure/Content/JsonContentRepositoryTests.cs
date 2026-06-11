using AmrPortfolio.Application.DTOs;
using AmrPortfolio.Application.Interfaces;
using NSubstitute;

namespace AmrPortfolio.UnitTests.Infrastructure.Content;

public sealed class ContentRepositoryContractTests
{
  private readonly IContentRepository _repo = Substitute.For<IContentRepository>();

  [Fact]
  public async Task GetProfileAsync_ReturnsProfile_ForGivenLocale()
  {
    var expected = new ProfileDto(
        Name: "Amr Madkour",
        Title: "Senior Software Engineer",
        Bio: "Building production-grade systems.",
        Email: "amr@example.com",
        GitHubUrl: "https://github.com/amr",
        LinkedInUrl: "https://linkedin.com/in/amr",
        ResumeUrl: null,
        SchedulingUrl: "https://cal.com/amr",
        Skills: ["C#", ".NET", "TypeScript"]);

    _repo.GetProfileAsync("en", Arg.Any<CancellationToken>()).Returns(expected);

    var result = await _repo.GetProfileAsync("en");

    Assert.Equal(expected.Name, result.Name);
    Assert.Equal(expected.Email, result.Email);
    Assert.Equal(3, result.Skills.Count);
  }

  [Fact]
  public async Task GetProjectsAsync_ReturnsProjects_ForGivenLocale()
  {
    var expected = new List<ProjectDto>
        {
            new("portfolio", "amr-portfolio", "AMR Portfolio", "Portfolio platform", ["Next.js", ".NET"],
                "https://example.com", "https://github.com/amr/portfolio", "2026-01", null, true, null)
        };

    _repo.GetProjectsAsync("en", Arg.Any<CancellationToken>()).Returns(expected.AsReadOnly());

    var result = await _repo.GetProjectsAsync("en");

    Assert.Single(result);
    Assert.True(result[0].Featured);
  }

  [Fact]
  public async Task GetExperienceAsync_ReturnsExperience_ForGivenLocale()
  {
    var expected = new List<ExperienceDto>
        {
            new("exp-1", "senior-engineer-acme", "company", true, "Acme Corp", "Senior Engineer",
                "2022-01", null, "Led backend services.", ["Reduced latency by 40%"], ["C#", "Kubernetes"], "backend")
        };

    _repo.GetExperienceAsync("en", Arg.Any<CancellationToken>()).Returns(expected.AsReadOnly());

    var result = await _repo.GetExperienceAsync("en");

    Assert.Single(result);
    Assert.Null(result[0].EndDate);
  }

  [Fact]
  public async Task GetRecommendationsAsync_ReturnsRecommendations_ForGivenLocale()
  {
    var expected = new List<RecommendationDto>
        {
            new("rec-1", "Jane Doe", "Engineering Manager", "Acme Corp", null,
                "Outstanding engineer.", "2025-03", "Managed directly", "LinkedIn")
        };

    _repo.GetRecommendationsAsync("en", Arg.Any<CancellationToken>()).Returns(expected.AsReadOnly());

    var result = await _repo.GetRecommendationsAsync("en");

    Assert.Single(result);
    Assert.Equal("Jane Doe", result[0].AuthorName);
  }
}
