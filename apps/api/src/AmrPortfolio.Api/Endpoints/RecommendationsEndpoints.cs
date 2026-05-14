using AmrPortfolio.Application.DTOs;
using AmrPortfolio.Application.Interfaces;

namespace AmrPortfolio.Api.Endpoints;

public static class RecommendationsEndpoints
{
    public static RouteGroupBuilder MapRecommendationsEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/recommendations", async (string locale, IContentRepository repo, CancellationToken ct) =>
        {
            var recommendations = await repo.GetRecommendationsAsync(locale, ct);
            return TypedResults.Ok(recommendations);
        })
        .WithName("GetRecommendations")
        .WithSummary("Returns all recommendations for the given locale.")
        .Produces<IReadOnlyList<RecommendationDto>>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound);

        return group;
    }
}
