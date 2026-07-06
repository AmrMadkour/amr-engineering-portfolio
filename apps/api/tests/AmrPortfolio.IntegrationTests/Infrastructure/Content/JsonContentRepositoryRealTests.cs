using AmrPortfolio.Infrastructure.Content;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;

namespace AmrPortfolio.IntegrationTests.Infrastructure.Content;

public sealed class JsonContentRepositoryRealTests : IDisposable
{
  private readonly MemoryCache _cache;
  private readonly JsonContentRepository _repo;

  public JsonContentRepositoryRealTests()
  {
    _cache = new MemoryCache(new MemoryCacheOptions());
    _repo = new JsonContentRepository(
        _cache,
        NullLogger<JsonContentRepository>.Instance,
        FindContentPath());
  }

  private static string FindContentPath()
  {
    var dir = new DirectoryInfo(AppContext.BaseDirectory);
    while (dir != null && !Directory.Exists(Path.Combine(dir.FullName, "content")))
      dir = dir.Parent;
    if (dir == null)
      throw new InvalidOperationException("content/ directory not found in any ancestor of " + AppContext.BaseDirectory);
    return Path.Combine(dir.FullName, "content");
  }

  [Fact]
  public async Task GetProfileAsync_EnLocale_ReturnsValidProfile()
  {
    var profile = await _repo.GetProfileAsync("en");

    Assert.NotNull(profile);
    Assert.NotEmpty(profile.Name);
    Assert.NotEmpty(profile.Title);
    Assert.NotEmpty(profile.Email);
    Assert.NotEmpty(profile.Skills);
  }

  [Fact]
  public async Task GetProjectsAsync_EnLocale_ReturnsNonEmptyList()
  {
    var projects = await _repo.GetProjectsAsync("en");

    Assert.NotEmpty(projects);
    Assert.All(projects, p =>
    {
      Assert.NotEmpty(p.Id);
      Assert.NotEmpty(p.Title);
    });
  }

  [Fact]
  public async Task GetExperienceAsync_EnLocale_ReturnsNonEmptyList()
  {
    var experience = await _repo.GetExperienceAsync("en");

    Assert.NotEmpty(experience);
    Assert.All(experience, e =>
    {
      Assert.NotEmpty(e.Id);
      Assert.NotEmpty(e.Slug);
    });
  }

  [Fact]
  public async Task GetRecommendationsAsync_EnLocale_ReturnsNonEmptyList()
  {
    var recs = await _repo.GetRecommendationsAsync("en");

    Assert.NotEmpty(recs);
    Assert.All(recs, r => Assert.NotEmpty(r.AuthorName));
  }

  [Theory]
  [InlineData("en")]
  [InlineData("ar")]
  [InlineData("nl")]
  public async Task GetProfileAsync_AllLocales_Deserialize(string locale)
  {
    var profile = await _repo.GetProfileAsync(locale);

    Assert.NotNull(profile);
    Assert.NotEmpty(profile.Name);
  }

  [Fact]
  public async Task GetProfileAsync_CalledTwice_ReturnsSameReference()
  {
    var first = await _repo.GetProfileAsync("en");
    var second = await _repo.GetProfileAsync("en");

    Assert.Same(first, second);
  }

  [Fact]
  public async Task GetProfileAsync_DifferentLocales_ReturnDifferentObjects()
  {
    var en = await _repo.GetProfileAsync("en");
    var ar = await _repo.GetProfileAsync("ar");

    Assert.NotSame(en, ar);
  }

  [Fact]
  public async Task GetProjectsAsync_CalledTwice_ReturnsSameReference()
  {
    var first = await _repo.GetProjectsAsync("en");
    var second = await _repo.GetProjectsAsync("en");

    Assert.Same(first, second);
  }

  [Fact]
  public async Task GetExperienceAsync_CalledTwice_ReturnsSameReference()
  {
    var first = await _repo.GetExperienceAsync("en");
    var second = await _repo.GetExperienceAsync("en");

    Assert.Same(first, second);
  }

  [Fact]
  public async Task GetRecommendationsAsync_CalledTwice_ReturnsSameReference()
  {
    var first = await _repo.GetRecommendationsAsync("en");
    var second = await _repo.GetRecommendationsAsync("en");

    Assert.Same(first, second);
  }

  [Fact]
  public async Task GetProfileAsync_UnknownLocale_ThrowsException()
  {
    await Assert.ThrowsAnyAsync<Exception>(() => _repo.GetProfileAsync("xx"));
  }

  public void Dispose() => _cache.Dispose();
}
