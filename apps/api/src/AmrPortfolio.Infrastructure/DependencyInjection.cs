using AmrPortfolio.Application.Interfaces;
using AmrPortfolio.Infrastructure.Content;
using Microsoft.Extensions.DependencyInjection;

namespace AmrPortfolio.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string contentBasePath)
    {
        services.AddMemoryCache();
        services.AddSingleton<IContentRepository>(sp =>
            new JsonContentRepository(
                sp.GetRequiredService<Microsoft.Extensions.Caching.Memory.IMemoryCache>(),
                sp.GetRequiredService<Microsoft.Extensions.Logging.ILogger<JsonContentRepository>>(),
                contentBasePath));
        return services;
    }
}
