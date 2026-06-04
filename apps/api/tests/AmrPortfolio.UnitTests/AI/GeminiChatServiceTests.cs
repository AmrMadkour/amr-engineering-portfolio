using AmrPortfolio.Application.Interfaces;
using AmrPortfolio.Infrastructure.AI;
using Mscc.GenerativeAI;

namespace AmrPortfolio.UnitTests.AI;

public sealed class GeminiChatServiceTests
{
    // -----------------------------------------------------------------------
    // ClassifyGeminiError — message pattern matching
    // -----------------------------------------------------------------------

    [Theory]
    [InlineData("429 Too Many Requests",           ChatErrorCodes.RateLimited)]
    [InlineData("RESOURCE_EXHAUSTED quota limit",  ChatErrorCodes.RateLimited)]
    [InlineData("daily quota exceeded",            ChatErrorCodes.RateLimited)]
    [InlineData("401 Unauthorized",                ChatErrorCodes.ConfigError)]
    [InlineData("403 Forbidden",                   ChatErrorCodes.ConfigError)]
    [InlineData("API_KEY not valid",               ChatErrorCodes.ConfigError)]
    [InlineData("UNAUTHENTICATED request",         ChatErrorCodes.ConfigError)]
    [InlineData("connection timeout occurred",     ChatErrorCodes.Timeout)]
    [InlineData("Timeout waiting for response",    ChatErrorCodes.Timeout)]
    [InlineData("operation timed out",             ChatErrorCodes.Timeout)]
    [InlineData("TaskCanceled during stream",      ChatErrorCodes.Timeout)]
    [InlineData("500 Internal Server Error",       ChatErrorCodes.Unavailable)]
    [InlineData("503 Service Unavailable",         ChatErrorCodes.Unavailable)]
    [InlineData("502 Bad Gateway",                 ChatErrorCodes.Unavailable)]
    [InlineData("INTERNAL error from server",      ChatErrorCodes.Unavailable)]
    [InlineData("The request was not successful.", ChatErrorCodes.Unavailable)]
    [InlineData("some completely unknown error",   ChatErrorCodes.Unknown)]
    public void ClassifyGeminiError_ReturnsExpectedCode_ForMessagePattern(
        string message, string expectedCode)
    {
        var result = GeminiChatService.ClassifyGeminiError(new Exception(message));

        Assert.Equal(expectedCode, result);
    }

    [Fact]
    public void ClassifyGeminiError_ReturnsUnavailable_ForGeminiApiException()
    {
        // GeminiApiException is thrown by Mscc.GenerativeAI for any Gemini API error.
        // The library wraps unparseable error bodies — catch-all should be Unavailable.
        var ex = new GeminiApiException("Unexpected error from Gemini");

        var result = GeminiChatService.ClassifyGeminiError(ex);

        Assert.Equal(ChatErrorCodes.Unavailable, result);
    }

    [Fact]
    public void ClassifyGeminiError_WalksInnerExceptions_ToFindPattern()
    {
        // The Mscc library wraps exceptions — the meaningful keyword is often in InnerException.
        var inner = new Exception("429 rate limit hit");
        var outer = new Exception("The request was not successful.", inner);

        var result = GeminiChatService.ClassifyGeminiError(outer);

        Assert.Equal(ChatErrorCodes.RateLimited, result);
    }

    [Fact]
    public void ClassifyGeminiError_PrioritisesOuterException_WhenBothMatch()
    {
        // Outer matches rate-limit; inner matches timeout — outer wins (checked first).
        var inner = new Exception("connection timeout");
        var outer = new Exception("429 Too Many Requests", inner);

        var result = GeminiChatService.ClassifyGeminiError(outer);

        Assert.Equal(ChatErrorCodes.RateLimited, result);
    }
}
