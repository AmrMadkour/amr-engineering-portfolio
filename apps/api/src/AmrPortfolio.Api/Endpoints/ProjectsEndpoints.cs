using AmrPortfolio.Application.DTOs;
using AmrPortfolio.Application.Interfaces;

namespace AmrPortfolio.Api.Endpoints;

public static class ProjectsEndpoints
{
  public static RouteGroupBuilder MapProjectsEndpoints(this RouteGroupBuilder group)
  {
    group.MapGet("/projects", async (string locale, IContentRepository repo, CancellationToken ct) =>
    {
      var projects = await repo.GetProjectsAsync(locale, ct);
      return TypedResults.Ok(projects);
    })
    .WithName("GetProjects")
    .WithSummary("Returns all portfolio projects for the given locale.")
    .Produces<IReadOnlyList<ProjectDto>>(StatusCodes.Status200OK)
    .ProducesProblem(StatusCodes.Status404NotFound);

    return group;
  }
}
