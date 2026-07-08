using System.Runtime.CompilerServices;
using AmrPortfolio.Application.DTOs;
using AmrPortfolio.Application.Interfaces;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace AmrPortfolio.IntegrationTests.Api;

// Each test class gets its own factory instance so the rate limiter (10 req/min) never
// carries state between test classes. Collection("WebApp") serializes factory-based tests
// to prevent concurrent startup failures.
[CollectionDefinition("WebApp")]
public sealed class WebAppCollection : ICollectionFixture<ChatTestApiFactory> { }

public sealed class ChatTestApiFactory : WebApplicationFactory<Program>
{
  protected override void ConfigureWebHost(Microsoft.AspNetCore.Hosting.IWebHostBuilder builder)
  {
    builder.UseSetting("Gemini:ApiKey", "test-api-key-not-real");
    builder.UseSetting("Gemini:ModelId", "gemini-test");
    builder.UseSetting("ContentPath", FindContentPath());

    builder.ConfigureServices(services =>
    {
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
