namespace AmrPortfolio.Application.DTOs;

public sealed record ChatMessageDto(
    string Role,    // "user" | "assistant"
    string Content
);

public sealed record PageContextDto(
    string Page,    // "home" | "experience" | "contact"
    string? Slug    // e.g. "metrixlab-senior" on detail pages
);

public sealed record ChatRequestDto(
    string Message,
    IReadOnlyList<ChatMessageDto> History,
    string Locale,
    PageContextDto? PageContext
);
