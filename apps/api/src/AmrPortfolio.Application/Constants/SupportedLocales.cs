namespace AmrPortfolio.Application.Constants;

public static class SupportedLocales
{
  public static readonly string[] All = ["en", "ar", "nl"];

  public static bool IsValid(string? locale) =>
    locale != null && All.Contains(locale);
}
