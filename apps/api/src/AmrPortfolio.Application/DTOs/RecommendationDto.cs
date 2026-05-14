namespace AmrPortfolio.Application.DTOs;

public sealed record RecommendationDto(
    string Id,
    string AuthorName,
    string AuthorTitle,
    string AuthorCompany,
    string? AuthorAvatarUrl,
    string Text,
    string Date
);
