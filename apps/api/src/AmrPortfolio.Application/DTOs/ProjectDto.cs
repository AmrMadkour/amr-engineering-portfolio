namespace AmrPortfolio.Application.DTOs;

public sealed record ProjectDto(
    string Id,
    string Title,
    string Description,
    IReadOnlyList<string> Tags,
    string? LiveUrl,
    string? RepoUrl,
    string StartDate,
    string? EndDate,
    bool Featured
);
