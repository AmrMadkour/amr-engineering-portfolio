using AmrPortfolio.Application.DTOs;
using AmrPortfolio.Application.Interfaces;

namespace AmrPortfolio.Api.Endpoints;

public static class ExperienceEndpoints
{
  public static RouteGroupBuilder MapExperienceEndpoints(this RouteGroupBuilder group)
  {
    group.MapGet("/experience", async (string locale, IContentRepository repo, CancellationToken ct) =>
    {
      var experience = await repo.GetExperienceAsync(locale, ct);
      return TypedResults.Ok(experience);
    })
    .WithName("GetExperience")
    .WithSummary("Returns all experience entries for the given locale.")
    .Produces<IReadOnlyList<ExperienceDto>>(StatusCodes.Status200OK)
    .ProducesProblem(StatusCodes.Status404NotFound);

    return group;
  }
}
