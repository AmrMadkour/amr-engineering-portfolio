# Build stage — restore and publish the API project
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /repo

# Copy project files first so restore is a separate cached layer
COPY apps/api/Directory.Build.props ./apps/api/
COPY apps/api/.editorconfig       ./apps/api/
COPY apps/api/src/AmrPortfolio.Api/AmrPortfolio.Api.csproj \
     ./apps/api/src/AmrPortfolio.Api/
COPY apps/api/src/AmrPortfolio.Application/AmrPortfolio.Application.csproj \
     ./apps/api/src/AmrPortfolio.Application/
COPY apps/api/src/AmrPortfolio.Domain/AmrPortfolio.Domain.csproj \
     ./apps/api/src/AmrPortfolio.Domain/
COPY apps/api/src/AmrPortfolio.Infrastructure/AmrPortfolio.Infrastructure.csproj \
     ./apps/api/src/AmrPortfolio.Infrastructure/

RUN dotnet restore apps/api/src/AmrPortfolio.Api/AmrPortfolio.Api.csproj

COPY apps/api/src/ ./apps/api/src/

RUN dotnet publish apps/api/src/AmrPortfolio.Api/AmrPortfolio.Api.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish

# Runtime stage — minimal ASP.NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Portfolio JSON files — ContentPath env var points here
COPY content/ ./content/

# Serilog File sink writes here; directory must exist
RUN mkdir logs

ENV ContentPath=/app/content

EXPOSE 8080

# PORT is injected by Render at container start; falls back to 8080 for local docker run.
# Shell form is required to expand ${PORT:-8080} at runtime, not at build time.
ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} exec dotnet AmrPortfolio.Api.dll"]
