namespace AmrPortfolio.Application.DTOs;

public sealed record ProfileDto(
    string Name,
    string Title,
    string Bio,
    string Email,
    string? GitHubUrl,
    string? LinkedInUrl,
    string? ResumeUrl,
    IReadOnlyList<string> Skills
);
