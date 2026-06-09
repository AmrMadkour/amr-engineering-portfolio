using AmrPortfolio.Application.Interfaces;

namespace AmrPortfolio.UnitTests.Application;

/// <summary>
/// Verifies ChatErrorCodes constants match the keys used in messages/{locale}.json
/// under ChatWidget.errors.*. If a constant changes here, i18n files must be updated too.
/// </summary>
public sealed class ChatErrorCodesTests
{
  [Fact] public void RateLimited_HasExpectedKey() => Assert.Equal("rateLimited", ChatErrorCodes.RateLimited);
  [Fact] public void Unavailable_HasExpectedKey() => Assert.Equal("unavailable", ChatErrorCodes.Unavailable);
  [Fact] public void Timeout_HasExpectedKey() => Assert.Equal("timeout", ChatErrorCodes.Timeout);
  [Fact] public void ConfigError_HasExpectedKey() => Assert.Equal("configError", ChatErrorCodes.ConfigError);
  [Fact] public void Unknown_HasExpectedKey() => Assert.Equal("unknown", ChatErrorCodes.Unknown);
}
