using AmrPortfolio.Application.DTOs;

namespace AmrPortfolio.Application.Interfaces;

public interface IChatService
{
  IAsyncEnumerable<ChatEventDto> StreamResponseAsync(ChatRequestDto request, CancellationToken ct = default);
}

public abstract record ChatEventDto;
public sealed record TextDeltaEvent(string Content) : ChatEventDto;
public sealed record ActionEvent(string Name, object Payload) : ChatEventDto;
public sealed record ErrorEvent(string Code) : ChatEventDto;
