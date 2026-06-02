namespace AmrPortfolio.Application.DTOs;

public sealed record ExperienceDto(
    string Id,
    string Slug,
    string Type,
    bool Featured,
    string? Company,
    string? Role,
    string StartDate,
    string? EndDate,
    string Description,
    IReadOnlyList<string> Highlights,
    IReadOnlyList<string> Technologies,
    string? Domain
);
