using AmrPortfolio.Application.DTOs;

namespace AmrPortfolio.Application.Interfaces;

public interface IContentRepository
{
    Task<ProfileDto> GetProfileAsync(string locale, CancellationToken ct = default);
    Task<IReadOnlyList<ProjectDto>> GetProjectsAsync(string locale, CancellationToken ct = default);
    Task<IReadOnlyList<ExperienceDto>> GetExperienceAsync(string locale, CancellationToken ct = default);
    Task<IReadOnlyList<RecommendationDto>> GetRecommendationsAsync(string locale, CancellationToken ct = default);
}
