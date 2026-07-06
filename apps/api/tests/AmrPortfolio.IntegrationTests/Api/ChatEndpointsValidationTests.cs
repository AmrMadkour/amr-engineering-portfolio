using System.Net;
using System.Text;
using System.Text.Json;

namespace AmrPortfolio.IntegrationTests.Api;

[Collection("WebApp")]
public sealed class ChatEndpointsValidationTests : IDisposable
{
  private readonly ChatTestApiFactory _factory;
  private readonly HttpClient _client;

  public ChatEndpointsValidationTests()
  {
    _factory = new ChatTestApiFactory();
    _client = _factory.CreateClient();
  }

  public void Dispose()
  {
    _client.Dispose();
    _factory.Dispose();
  }

  [Fact]
  public async Task Post_EmptyMessage_Returns400()
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = "", locale = "en", history = Array.Empty<object>() }));

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task Post_WhitespaceMessage_Returns400()
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = "   ", locale = "en", history = Array.Empty<object>() }));

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task Post_MessageExceeds2000Chars_Returns400()
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = new string('x', 2001), locale = "en", history = Array.Empty<object>() }));

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task Post_MessageExactly2000Chars_Returns200()
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = new string('x', 2000), locale = "en", history = Array.Empty<object>() }));

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Theory]
  [InlineData("fr")]
  [InlineData("de")]
  [InlineData("")]
  [InlineData("EN")]
  public async Task Post_InvalidLocale_Returns400(string locale)
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = "hello", locale, history = Array.Empty<object>() }));

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Theory]
  [InlineData("en")]
  [InlineData("ar")]
  [InlineData("nl")]
  public async Task Post_ValidLocale_Returns200(string locale)
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = "hello", locale, history = Array.Empty<object>() }));

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Fact]
  public async Task Post_ValidRequest_ResponseIsEventStream()
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = "hello", locale = "en", history = Array.Empty<object>() }));

    Assert.Equal("text/event-stream; charset=utf-8", response.Content.Headers.ContentType?.ToString());
  }

  [Fact]
  public async Task Post_ValidRequest_BodyContainsDoneSignal()
  {
    var response = await _client.PostAsync("/v1/chat", Body(new { message = "hello", locale = "en", history = Array.Empty<object>() }));
    var body = await response.Content.ReadAsStringAsync();

    Assert.Contains("data: [DONE]", body);
  }

  private static StringContent Body(object payload) =>
      new(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
}
