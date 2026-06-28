using AmrPortfolio.Application.Constants;
using AmrPortfolio.Application.DTOs;
using AmrPortfolio.Application.Interfaces;

namespace AmrPortfolio.Api.Endpoints;

public static class ProfileEndpoints
{
  public static RouteGroupBuilder MapProfileEndpoints(this RouteGroupBuilder group)
  {
    group.MapGet("/profile", async (string? locale, IContentRepository repo, CancellationToken ct) =>
    {
      if (!SupportedLocales.IsValid(locale))
        return Results.BadRequest($"Unsupported locale '{locale}'. Supported: {string.Join(", ", SupportedLocales.All)}.");

      var profile = await repo.GetProfileAsync(locale!, ct);
      return Results.Ok(profile);
    })
    .WithName("GetProfile")
    .WithSummary("Returns the portfolio owner's profile for the given locale.")
    .Produces<ProfileDto>(StatusCodes.Status200OK)
    .ProducesProblem(StatusCodes.Status404NotFound);

    return group;
  }
}
