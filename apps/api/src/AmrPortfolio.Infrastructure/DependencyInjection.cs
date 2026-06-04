using AmrPortfolio.Application.Interfaces;
using AmrPortfolio.Infrastructure.AI;
using AmrPortfolio.Infrastructure.Content;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AmrPortfolio.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string contentBasePath,
        IConfiguration configuration)
    {
        services.AddMemoryCache();

        services.AddSingleton<IContentRepository>(sp =>
            new JsonContentRepository(
                sp.GetRequiredService<Microsoft.Extensions.Caching.Memory.IMemoryCache>(),
                sp.GetRequiredService<ILogger<JsonContentRepository>>(),
                contentBasePath));

        var apiKey = configuration["Gemini:ApiKey"]
            ?? throw new InvalidOperationException("Gemini:ApiKey is not configured. Add it to .env as Gemini__ApiKey=<your-key>");
        var modelId = configuration["Gemini:ModelId"] ?? "gemini-flash-latest";

        services.AddSingleton<IChatService>(sp =>
            new GeminiChatService(
                sp.GetRequiredService<IContentRepository>(),
                sp.GetRequiredService<ILogger<GeminiChatService>>(),
                apiKey,
                modelId));

        return services;
    }
}
