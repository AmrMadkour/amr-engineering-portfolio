using System.Threading.RateLimiting;
using AmrPortfolio.Api.Endpoints;
using AmrPortfolio.Api.Middleware;
using AmrPortfolio.Infrastructure;
using Microsoft.AspNetCore.RateLimiting;
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

  // Rate limiting — 10 requests/min per IP on /v1/chat
  builder.Services.AddRateLimiter(options =>
  {
    options.AddPolicy("chat", httpContext =>
          RateLimitPartition.GetFixedWindowLimiter(
              partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
              factory: _ => new FixedWindowRateLimiterOptions
              {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
              }));
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
  });

  // Infrastructure — IContentRepository + IMemoryCache + IChatService
  var contentPath = builder.Configuration["ContentPath"]
      ?? Path.Combine(builder.Environment.ContentRootPath, "..", "..", "..", "..", "content");
  builder.Services.AddInfrastructure(Path.GetFullPath(contentPath), builder.Configuration);

  var app = builder.Build();

  app.UseExceptionHandler();
  app.UseSerilogRequestLogging();
  app.UseCors();
  app.UseRateLimiter();

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
  v1.MapChatEndpoints();

  await app.RunAsync();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
  Log.Fatal(ex, "Application failed to start");
  throw;
}
finally
{
  await Log.CloseAndFlushAsync();
}

public partial class Program
{
  protected Program() { }
}
