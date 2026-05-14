using System.Diagnostics;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace AmrPortfolio.Api.Middleware;

public sealed class GlobalExceptionHandler(
    ILogger<GlobalExceptionHandler> logger,
    IWebHostEnvironment env) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var (statusCode, title) = exception switch
        {
            FileNotFoundException     => (StatusCodes.Status404NotFound,            "Content not found"),
            InvalidOperationException => (StatusCodes.Status422UnprocessableEntity, "Content error"),
            _                         => (StatusCodes.Status500InternalServerError,  "Server error")
        };

        logger.LogError(exception, "Unhandled exception — {Title} ({StatusCode})", title, statusCode);

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title  = title,
            Detail = env.IsDevelopment() ? exception.Message : null,
            Extensions =
            {
                ["traceId"] = Activity.Current?.Id ?? httpContext.TraceIdentifier
            }
        };

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);
        return true;
    }
}
