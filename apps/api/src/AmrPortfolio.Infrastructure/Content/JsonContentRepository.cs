using System.Text.Json;
using AmrPortfolio.Application.DTOs;
using AmrPortfolio.Application.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace AmrPortfolio.Infrastructure.Content;

public sealed class JsonContentRepository(
    IMemoryCache cache,
    ILogger<JsonContentRepository> logger,
    string contentBasePath) : IContentRepository
{
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(15);

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public Task<ProfileDto> GetProfileAsync(string locale, CancellationToken ct = default) =>
        GetCachedAsync($"profile:{locale}", () => ReadJsonAsync<ProfileDto>("profile.json", locale, ct), ct);

    public Task<IReadOnlyList<ProjectDto>> GetProjectsAsync(string locale, CancellationToken ct = default) =>
        GetCachedAsync($"projects:{locale}", () => ReadJsonArrayAsync<ProjectDto>("projects.json", locale, ct), ct);

    public Task<IReadOnlyList<ExperienceDto>> GetExperienceAsync(string locale, CancellationToken ct = default) =>
        GetCachedAsync($"experience:{locale}", () => ReadJsonArrayAsync<ExperienceDto>("experience.json", locale, ct), ct);

    public Task<IReadOnlyList<RecommendationDto>> GetRecommendationsAsync(string locale, CancellationToken ct = default) =>
        GetCachedAsync($"recommendations:{locale}", () => ReadJsonArrayAsync<RecommendationDto>("recommendations.json", locale, ct), ct);

    private async Task<T> GetCachedAsync<T>(string key, Func<Task<T>> factory, CancellationToken ct)
    {
        if (cache.TryGetValue(key, out T? cached) && cached is not null)
            return cached;

        var value = await factory();
        cache.Set(key, value, CacheTtl);
        logger.LogDebug("Cache miss — loaded {Key}", key);
        return value;
    }

    private async Task<T> ReadJsonAsync<T>(string fileName, string locale, CancellationToken ct)
    {
        var path = Path.Combine(contentBasePath, locale, fileName);
        await using var stream = File.OpenRead(path);
        var result = await JsonSerializer.DeserializeAsync<T>(stream, JsonOptions, ct);
        return result ?? throw new InvalidOperationException($"Failed to deserialize {path}");
    }

    private async Task<IReadOnlyList<T>> ReadJsonArrayAsync<T>(string fileName, string locale, CancellationToken ct)
    {
        var path = Path.Combine(contentBasePath, locale, fileName);
        await using var stream = File.OpenRead(path);
        var result = await JsonSerializer.DeserializeAsync<List<T>>(stream, JsonOptions, ct);
        return result?.AsReadOnly() ?? throw new InvalidOperationException($"Failed to deserialize {path}");
    }
}
