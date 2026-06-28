using AmrPortfolio.Application.Constants;

namespace AmrPortfolio.UnitTests.Application;

public sealed class SupportedLocalesTests
{
  [Theory]
  [InlineData("en")]
  [InlineData("ar")]
  [InlineData("nl")]
  public void IsValid_KnownLocale_ReturnsTrue(string locale) =>
    Assert.True(SupportedLocales.IsValid(locale));

  [Theory]
  [InlineData("fr")]
  [InlineData("de")]
  [InlineData("EN")]
  [InlineData("")]
  public void IsValid_UnknownLocale_ReturnsFalse(string locale) =>
    Assert.False(SupportedLocales.IsValid(locale));

  [Fact]
  public void IsValid_Null_ReturnsFalse() =>
    Assert.False(SupportedLocales.IsValid(null));

  [Fact]
  public void All_ContainsExactlyThreeLocales() =>
    Assert.Equal(3, SupportedLocales.All.Length);
}
