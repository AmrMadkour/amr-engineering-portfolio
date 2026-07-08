using System.Text.Json;
using AmrPortfolio.Application.Constants;
using AmrPortfolio.Application.DTOs;
using AmrPortfolio.Application.Interfaces;

namespace AmrPortfolio.Api.Endpoints;

public static class ChatEndpoints
{
  private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

  public static RouteGroupBuilder MapChatEndpoints(this RouteGroupBuilder group)
  {
    group.MapPost("/chat", async (
        ChatRequestDto request,
        IChatService chatService,
        HttpContext ctx,
        CancellationToken ct) =>
    {
      if (string.IsNullOrWhiteSpace(request.Message) || request.Message.Length > 2000)
        return Results.BadRequest("Message must be between 1 and 2000 characters.");

      // Prevent path traversal — locale is used to build a file path in JsonContentRepository.
      if (!SupportedLocales.IsValid(request.Locale))
        return Results.BadRequest($"Unsupported locale '{request.Locale}'. Supported: {string.Join(", ", SupportedLocales.All)}.");

      ctx.Response.ContentType = "text/event-stream; charset=utf-8";
      ctx.Response.Headers.CacheControl = "no-cache";
      ctx.Response.Headers.Connection = "keep-alive";
      ctx.Response.Headers["X-Accel-Buffering"] = "no";

      await foreach (var evt in chatService.StreamResponseAsync(request, ct))
      {
        if (ct.IsCancellationRequested) break;

        var json = evt switch
        {
          TextDeltaEvent d => JsonSerializer.Serialize(new { type = "delta", content = d.Content }, JsonOpts),
          ActionEvent a => JsonSerializer.Serialize(new { type = "action", name = a.Name, payload = a.Payload }, JsonOpts),
          ErrorEvent e => JsonSerializer.Serialize(new { type = "error", code = e.Code }, JsonOpts),
          _ => null
        };

        if (json != null)
        {
          await ctx.Response.WriteAsync($"data: {json}\n\n", ct);
          await ctx.Response.Body.FlushAsync(ct);
        }
      }

      await ctx.Response.WriteAsync("data: [DONE]\n\n", ct);
      await ctx.Response.Body.FlushAsync(ct);

      return Results.Empty;
    })
    .WithName("StreamChat")
    .WithSummary("Streams an AI assistant response via Server-Sent Events.")
    .Accepts<ChatRequestDto>("application/json")
    .RequireRateLimiting("chat")
    .ExcludeFromDescription();

    return group;
  }
}
