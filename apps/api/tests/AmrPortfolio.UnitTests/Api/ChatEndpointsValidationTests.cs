using System.Net;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using AmrPortfolio.Application.DTOs;
using AmrPortfolio.Application.Interfaces;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace AmrPortfolio.UnitTests.Api;

// Each test gets its own factory/server so the rate limiter (10 req/min) never interferes.
// Collection("WebApp") serializes all WebApplicationFactory-based tests to prevent concurrent startup failures.
[Collection("WebApp")]
public sealed class ChatEndpointsValidationTests : IDisposable
{
  private readonly ChatTestApiFactory _factory;
  private readonly HttpClient _client;

  public ChatEndpointsValidationTests()
  {
    _factory = new ChatTestApiFactory();
    _client = _factory.CreateClient();
  }

  public void Dispose()
  {
    _client.Dispose();
    _factory.Dispose();
  }

  [Fact]
  public async Task Post_EmptyMessage_Returns400()
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = "", locale = "en", history = Array.Empty<object>() }));

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task Post_WhitespaceMessage_Returns400()
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = "   ", locale = "en", history = Array.Empty<object>() }));

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task Post_MessageExceeds2000Chars_Returns400()
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = new string('x', 2001), locale = "en", history = Array.Empty<object>() }));

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task Post_MessageExactly2000Chars_Returns200()
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = new string('x', 2000), locale = "en", history = Array.Empty<object>() }));

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Theory]
  [InlineData("fr")]
  [InlineData("de")]
  [InlineData("")]
  [InlineData("EN")]
  public async Task Post_InvalidLocale_Returns400(string locale)
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = "hello", locale, history = Array.Empty<object>() }));

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Theory]
  [InlineData("en")]
  [InlineData("ar")]
  [InlineData("nl")]
  public async Task Post_ValidLocale_Returns200(string locale)
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = "hello", locale, history = Array.Empty<object>() }));

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Fact]
  public async Task Post_ValidRequest_ResponseIsEventStream()
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = "hello", locale = "en", history = Array.Empty<object>() }));

    Assert.Equal("text/event-stream; charset=utf-8", response.Content.Headers.ContentType?.ToString());
  }

  [Fact]
  public async Task Post_ValidRequest_BodyContainsDoneSignal()
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = "hello", locale = "en", history = Array.Empty<object>() }));
    var body = await response.Content.ReadAsStringAsync();

    Assert.Contains("data: [DONE]", body);
  }

  private static StringContent Body(object payload) =>
      new(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
}

/// <summary>
/// Test factory: replaces IChatService with a no-op stub so no real Gemini calls are made.
/// </summary>
public sealed class ChatTestApiFactory : WebApplicationFactory<Program>
{
  protected override void ConfigureWebHost(Microsoft.AspNetCore.Hosting.IWebHostBuilder builder)
  {
    // Provide Gemini config so AddInfrastructure doesn't throw on missing key
    builder.UseSetting("Gemini:ApiKey", "test-api-key-not-real");
    builder.UseSetting("Gemini:ModelId", "gemini-test");
    builder.UseSetting("ContentPath", FindContentPath());

    builder.ConfigureServices(services =>
    {
      // Replace the real GeminiChatService singleton with a no-op stub
      var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IChatService));
      if (descriptor != null) services.Remove(descriptor);
      services.AddSingleton<IChatService, NoOpChatService>();
    });
  }

  private static string FindContentPath()
  {
    var dir = new DirectoryInfo(AppContext.BaseDirectory);
    while (dir != null && !Directory.Exists(Path.Combine(dir.FullName, "content")))
      dir = dir.Parent;
    if (dir == null)
      throw new InvalidOperationException("content/ directory not found in any ancestor of " + AppContext.BaseDirectory);
    return Path.Combine(dir.FullName, "content");
  }

  private sealed class NoOpChatService : IChatService
  {
    public async IAsyncEnumerable<ChatEventDto> StreamResponseAsync(
        ChatRequestDto request,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
      await Task.CompletedTask;
      yield break;
    }
  }
}
