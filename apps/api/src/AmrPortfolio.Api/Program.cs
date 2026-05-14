using AmrPortfolio.Api.Endpoints;
using AmrPortfolio.Api.Middleware;
using AmrPortfolio.Infrastructure;
using Scalar.AspNetCore;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((ctx, services, config) =>
        config.ReadFrom.Configuration(ctx.Configuration)
              .ReadFrom.Services(services)
              .Enrich.FromLogContext()
              .WriteTo.Console()
              .WriteTo.File("logs/api-.log", rollingInterval: RollingInterval.Day)
        // TODO: add OpenTelemetry exporter here (Stage 3+)
    );

    // CORS
    var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(',') ?? [];
    builder.Services.AddCors(options =>
        options.AddDefaultPolicy(policy =>
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()));

    // OpenAPI
    builder.Services.AddOpenApi();

    // Exception handling
    builder.Services.AddProblemDetails();
    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

    // Infrastructure — IContentRepository + IMemoryCache
    var contentPath = builder.Configuration["ContentPath"]
        ?? Path.Combine(builder.Environment.ContentRootPath, "..", "..", "..", "..", "content");
    builder.Services.AddInfrastructure(Path.GetFullPath(contentPath));

    var app = builder.Build();

    app.UseExceptionHandler();
    app.UseSerilogRequestLogging();
    app.UseCors();

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference();
    }

    // Health
    app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
       .WithTags("Health")
       .ExcludeFromDescription();

    // v1 endpoints
    var v1 = app.MapGroup("/v1");
    v1.MapProfileEndpoints();
    v1.MapProjectsEndpoints();
    v1.MapExperienceEndpoints();
    v1.MapRecommendationsEndpoints();

    app.Run();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "Application failed to start");
    throw;
}
finally
{
    Log.CloseAndFlush();
}

public partial class Program { }
