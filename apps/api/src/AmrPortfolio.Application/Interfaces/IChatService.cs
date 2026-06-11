using AmrPortfolio.Application.DTOs;

namespace AmrPortfolio.Application.Interfaces;

public interface IChatService
{
  IAsyncEnumerable<ChatEventDto> StreamResponseAsync(ChatRequestDto request, CancellationToken ct = default);
}

public abstract record ChatEventDto;
public sealed record TextDeltaEvent(string Content) : ChatEventDto;
public sealed record ActionEvent(string Name, object Payload) : ChatEventDto;

// Error codes — the frontend translates these via i18n. No human-readable strings in the backend.
public sealed record ErrorEvent(string Code) : ChatEventDto;

public static class ChatErrorCodes
{
  public const string RateLimited = "rateLimited";
  public const string Unavailable = "unavailable";
  public const string Timeout = "timeout";
  public const string ConfigError = "configError";
  public const string Unknown = "unknown";
}
