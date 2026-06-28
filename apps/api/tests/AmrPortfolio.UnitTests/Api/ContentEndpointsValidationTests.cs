using System.Net;

namespace AmrPortfolio.UnitTests.Api;

[Collection("WebApp")]
public sealed class ContentEndpointsValidationTests : IDisposable
{
  private readonly ChatTestApiFactory _factory;
  private readonly HttpClient _client;

  public ContentEndpointsValidationTests()
  {
    _factory = new ChatTestApiFactory();
    _client = _factory.CreateClient();
  }

  public void Dispose()
  {
    _client.Dispose();
    _factory.Dispose();
  }

  [Theory]
  [InlineData("/v1/profile?locale=fr")]
  [InlineData("/v1/experience?locale=de")]
  [InlineData("/v1/projects?locale=EN")]
  [InlineData("/v1/recommendations?locale=../../etc")]
  [InlineData("/v1/profile")]
  [InlineData("/v1/experience")]
  [InlineData("/v1/projects")]
  [InlineData("/v1/recommendations")]
  public async Task Get_InvalidOrMissingLocale_Returns400(string url)
  {
    var response = await _client.GetAsync(url);
    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Theory]
  [InlineData("/v1/profile?locale=en")]
  [InlineData("/v1/experience?locale=en")]
  [InlineData("/v1/projects?locale=en")]
  [InlineData("/v1/recommendations?locale=en")]
  public async Task Get_ValidLocale_Returns200(string url)
  {
    var response = await _client.GetAsync(url);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }
}
