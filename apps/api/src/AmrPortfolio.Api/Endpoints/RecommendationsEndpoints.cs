using AmrPortfolio.Application.Constants;
using AmrPortfolio.Application.DTOs;
using AmrPortfolio.Application.Interfaces;

namespace AmrPortfolio.Api.Endpoints;

public static class RecommendationsEndpoints
{
  public static RouteGroupBuilder MapRecommendationsEndpoints(this RouteGroupBuilder group)
  {
    group.MapGet("/recommendations", async (string? locale, IContentRepository repo, CancellationToken ct) =>
    {
      if (!SupportedLocales.IsValid(locale))
        return Results.BadRequest($"Unsupported locale '{locale}'. Supported: {string.Join(", ", SupportedLocales.All)}.");

      var recommendations = await repo.GetRecommendationsAsync(locale!, ct);
      return Results.Ok(recommendations);
    })
    .WithName("GetRecommendations")
    .WithSummary("Returns all recommendations for the given locale.")
    .Produces<IReadOnlyList<RecommendationDto>>(StatusCodes.Status200OK)
    .ProducesProblem(StatusCodes.Status404NotFound);

    return group;
  }
}
