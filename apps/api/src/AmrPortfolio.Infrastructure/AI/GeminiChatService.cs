using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using System.Text;
using AmrPortfolio.Application.DTOs;
using AmrPortfolio.Application.Interfaces;
using Microsoft.Extensions.Logging;
using Mscc.GenerativeAI;
using GeminiContent = Mscc.GenerativeAI.Content;

namespace AmrPortfolio.Infrastructure.AI;

public sealed class GeminiChatService : IChatService
{
  private readonly IContentRepository _repo;
  private readonly ILogger<GeminiChatService> _logger;
  private readonly string _apiKey;
  private readonly string _modelId;

  public GeminiChatService(
      IContentRepository repo,
      ILogger<GeminiChatService> logger,
      string apiKey,
      string modelId)
  {
    _repo = repo;
    _logger = logger;
    _apiKey = apiKey;
    _modelId = modelId;
  }

  [ExcludeFromCodeCoverage(Justification = "Requires live Gemini API key; exercised via integration/manual testing.")]
  public async IAsyncEnumerable<ChatEventDto> StreamResponseAsync(
      ChatRequestDto request,
      [EnumeratorCancellation] CancellationToken ct = default)
  {
    // Build system prompt outside the streaming block so errors surface cleanly
    string? systemPrompt = null;
    Exception? setupError = null;
    try
    {
      systemPrompt = await BuildSystemPromptAsync(request.Locale, request.PageContext, ct);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed to build system prompt for locale {Locale}", request.Locale);
      setupError = ex;
    }

    if (setupError != null)
    {
      yield return new ErrorEvent(ChatErrorCodes.Unavailable);
      yield break;
    }

    var tools = BuildTools();
    var genAI = new GoogleAI(_apiKey);
    var model = genAI.GenerativeModel(
        model: _modelId,
        generationConfig: null,
        safetySettings: null,
        tools: tools,
        systemInstruction: new GeminiContent(systemPrompt!, "user"),
        logger: null);

    var history = request.History
        .Select(m => new ContentResponse(m.Content, m.Role == "user" ? "user" : "model"))
        .ToList();

    var chat = model.StartChat(history, null, null, null, false);

    // 45-second ceiling on the entire Gemini response, independent of the library's internal HttpClient.
    using var timeoutCts = new CancellationTokenSource(TimeSpan.FromSeconds(45));
    using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(ct, timeoutCts.Token);
    var combinedCt = linkedCts.Token;

    // Retry loop: attempt 0 = first try, attempt 1 = one silent retry after 2s (rate-limit recovery).
    // yield is never inside a try+catch — only inside a try+finally — to satisfy CS1626.
    string? finalError = null;

    for (int attempt = 0; attempt <= 1; attempt++)
    {
      if (attempt == 1)
      {
        _logger.LogWarning("Gemini rate-limited on attempt 1 — retrying after 2 s");
        try { await Task.Delay(2000, combinedCt); }
        catch (OperationCanceledException) { yield break; }
      }

      IAsyncEnumerable<GenerateContentResponse>? stream = null;
      try
      {
        stream = chat.SendMessageStream(request.Message, null, null, null, null, null, combinedCt);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Failed to start Gemini stream (attempt {Attempt})", attempt + 1);
        finalError = attempt == 0 ? null : ClassifyGeminiError(ex);
        if (attempt == 0) continue;
        break;
      }

      var enumerator = stream!.GetAsyncEnumerator(combinedCt);
      bool shouldRetry = false;
      string? streamError = null;

      try
      {
        while (true)
        {
          bool hasMore;
          try
          {
            hasMore = await enumerator.MoveNextAsync();
          }
          catch (OperationCanceledException)
          {
            if (timeoutCts.IsCancellationRequested)
              streamError = ChatErrorCodes.Timeout;
            break;
          }
          catch (Exception ex) when (ex is GeminiApiException && attempt == 0)
          {
            // First-attempt Gemini API error — retry once after delay.
            shouldRetry = true;
            break;
          }
          catch (Exception ex)
          {
            _logger.LogError(ex, "Error during Gemini streaming (attempt {Attempt})", attempt + 1);
            streamError = ClassifyGeminiError(ex);
            break;
          }

          if (!hasMore || combinedCt.IsCancellationRequested) break;

          var chunk = enumerator.Current;

          var text = chunk.Text;
          if (!string.IsNullOrEmpty(text))
            yield return new TextDeltaEvent(text);

          var calls = chunk.FunctionCalls;
          if (calls is { Count: > 0 })
          {
            foreach (var call in calls)
              yield return new ActionEvent(call.Name, call.Args ?? new object());
          }
        }
      }
      finally
      {
        await enumerator.DisposeAsync();
      }

      if (shouldRetry && attempt == 0)
        continue; // go to attempt 1

      finalError = streamError;
      break;
    }

    if (finalError != null)
      yield return new ErrorEvent(finalError);
  }

  // Returns a ChatErrorCodes constant — never a human-readable string.
  // The frontend translates codes via i18n so all user-facing text lives in messages/*.json.
  // internal so it can be unit-tested without reflection.
  internal static string ClassifyGeminiError(Exception ex)
  {
    var sb = new StringBuilder();
    for (var e = ex; e != null; e = e.InnerException)
      sb.Append(e.Message);
    var msg = sb.ToString();

    if (msg.Contains("429") || msg.Contains("RESOURCE_EXHAUSTED") || msg.Contains("quota"))
      return ChatErrorCodes.RateLimited;
    if (msg.Contains("401") || msg.Contains("403") || msg.Contains("API_KEY") || msg.Contains("UNAUTHENTICATED"))
      return ChatErrorCodes.ConfigError;
    if (msg.Contains("timeout") || msg.Contains("Timeout") || msg.Contains("timed out") || msg.Contains("TaskCanceled"))
      return ChatErrorCodes.Timeout;
    if (msg.Contains("500") || msg.Contains("503") || msg.Contains("502") || msg.Contains("INTERNAL"))
      return ChatErrorCodes.Unavailable;
    if (ex is GeminiApiException || msg.Contains("not successful"))
      return ChatErrorCodes.Unavailable;

    return ChatErrorCodes.Unknown;
  }

  [ExcludeFromCodeCoverage(Justification = "Only called from the excluded StreamResponseAsync path.")]
  private static Tools BuildTools() =>
  [
      new Tool
        {
            FunctionDeclarations =
            [
                new FunctionDeclaration
                {
                    Name = "navigate_to_page",
                    Description = "Navigate the portfolio to a page or filtered view. Use when the user wants to visually explore content — not just get a quick text answer. Combine with a short text intro.",
                    Parameters = new Schema
                    {
                        Type = ParameterType.Object,
                        Properties = new Dictionary<string, Schema>
                        {
                            ["page"] = new Schema
                            {
                                Type = ParameterType.String,
                                Enum = ["home", "experience", "contact"],
                                Description = "Target page"
                            },
                            ["slug"] = new Schema
                            {
                                Type = ParameterType.String,
                                Description = "Experience entry slug for a detail page, e.g. 'metrixlab-senior'"
                            },
                            ["domain"] = new Schema
                            {
                                Type = ParameterType.String,
                                Enum = ["backend", "fullstack"],
                                Description = "Domain filter for the experience page"
                            }
                        },
                        Required = ["page"]
                    }
                },
                new FunctionDeclaration
                {
                    Name = "open_booking",
                    Description = "Open Amr's scheduling link so the user can book a call or meeting. Use when the user expresses interest in talking or meeting."
                },
                new FunctionDeclaration
                {
                    Name = "open_linkedin",
                    Description = "Open Amr's LinkedIn profile. Use when the user wants to connect on LinkedIn."
                },
                new FunctionDeclaration
                {
                    Name = "open_github",
                    Description = "Open Amr's GitHub profile. Use when the user asks about repositories or source code."
                },
                new FunctionDeclaration
                {
                    Name = "download_resume",
                    Description = "Open Amr's resume PDF. Use when the user asks for a CV or resume download."
                }
            ]
        }
  ];

  [ExcludeFromCodeCoverage(Justification = "Requires live Gemini API key; exercised via integration/manual testing.")]
  private async Task<string> BuildSystemPromptAsync(string locale, PageContextDto? pageContext, CancellationToken ct)
  {
    var profileTask = _repo.GetProfileAsync(locale, ct);
    var expTask = _repo.GetExperienceAsync(locale, ct);
    var projTask = _repo.GetProjectsAsync(locale, ct);
    var recTask = _repo.GetRecommendationsAsync(locale, ct);
    await Task.WhenAll(profileTask, expTask, projTask, recTask);

    var profile = profileTask.Result;
    var experience = expTask.Result;
    var projects = projTask.Result;
    var recommendations = recTask.Result;

    var sb = new StringBuilder();

    sb.AppendLine("You are \"Ask Amr\" — the AI agent on Amr Madkour's portfolio website.");
    sb.AppendLine("Your role: answer questions about Amr's background, skills, experience, and projects.");
    sb.AppendLine("Tone: concise, warm, conversational. Speak as a knowledgeable assistant, not as Amr himself.");
    sb.AppendLine();
    sb.AppendLine("LANGUAGE RULE: Detect the language of the user's message and ALWAYS respond in that same language.");
    sb.AppendLine($"Site locale hint: {locale}. Use this as a fallback only for ambiguous short inputs.");
    sb.AppendLine("Supported languages: English, Arabic (العربية), Dutch (Nederlands). Match language exactly.");
    sb.AppendLine();
    sb.AppendLine("RESPONSE STYLE — match the question type:");
    sb.AppendLine("- Greetings (Hi, Hello, Hey, مرحبا, Hoi, etc.): 1 sentence max. Warm and brief. No self-introduction block.");
    sb.AppendLine("- Simple factual question: 1–3 sentences. Lead with the answer.");
    sb.AppendLine("- 'Tell me about X': 3–5 sentences.");
    sb.AppendLine("- Explicit 'full list' / 'detailed breakdown': up to 150 words, structured.");
    sb.AppendLine("- Never volunteer a list of everything you can do unless the user asks.");
    sb.AppendLine();
    sb.AppendLine("TOOL USE — reason about intent, not keywords:");
    sb.AppendLine();
    sb.AppendLine("navigate_to_page: Ask yourself — does the user want to READ an answer, or EXPLORE the portfolio visually?");
    sb.AppendLine("  → Text only: 'what was his first role?', 'how many years experience?', 'what tech does he use?' — a sentence answers these.");
    sb.AppendLine("  → Navigate + short text: 'I want to see his work', 'show me his backend experience', 'what does his experience look like?', 'I'm interested in his .NET projects', 'tell me about TIQM' (navigate to that experience detail).");
    sb.AppendLine("  → Rule: if a 1–3 sentence answer fully satisfies the question, use text only. If the user would benefit from seeing the actual page, navigate AND give a brief intro text.");
    sb.AppendLine();
    sb.AppendLine("open_booking: user wants to talk, meet, or connect — 'I'd like to chat', 'can we have a call', 'I want to reach out', 'book a meeting'.");
    sb.AppendLine("open_linkedin: user wants to connect professionally or view the LinkedIn profile.");
    sb.AppendLine("open_github: user wants to browse code or repositories.");
    sb.AppendLine("download_resume: user wants the CV — 'I need his resume', 'get the CV', 'download'.");
    sb.AppendLine();
    sb.AppendLine("Always include a short text response alongside any tool action. Text first, then action.");
    sb.AppendLine();

    if (pageContext != null)
    {
      sb.Append($"CURRENT PAGE: {pageContext.Page}");
      if (!string.IsNullOrEmpty(pageContext.Slug)) sb.Append($" / {pageContext.Slug}");
      sb.AppendLine();
      sb.AppendLine();
    }

    sb.AppendLine("--- PROFILE ---");
    sb.AppendLine($"Name: {profile.Name}");
    sb.AppendLine($"Title: {profile.Title}");
    sb.AppendLine($"Bio: {profile.Bio}");
    sb.AppendLine($"Email: {profile.Email}");
    if (profile.LinkedInUrl != null) sb.AppendLine($"LinkedIn: {profile.LinkedInUrl}");
    if (profile.GitHubUrl != null) sb.AppendLine($"GitHub: {profile.GitHubUrl}");
    if (profile.SchedulingUrl != null) sb.AppendLine($"Booking: {profile.SchedulingUrl}");
    sb.AppendLine($"Skills: {string.Join(", ", profile.Skills)}");
    sb.AppendLine();

    sb.AppendLine($"--- EXPERIENCE ({experience.Count} roles) ---");
    foreach (var exp in experience)
    {
      var end = exp.EndDate ?? "Present";
      var where = exp.Company != null ? $" at {exp.Company}" : "";
      var role = exp.Role ?? exp.Type;
      sb.AppendLine($"• {role}{where} ({exp.StartDate}–{end}) [id: {exp.Slug}]");
      sb.AppendLine($"  {exp.Description}");
      if (exp.Highlights.Count > 0)
        sb.AppendLine($"  Highlights: {string.Join("; ", exp.Highlights)}");
      sb.AppendLine($"  Technologies: {string.Join(", ", exp.Technologies)}");
    }
    sb.AppendLine();

    sb.AppendLine($"--- PROJECTS ({projects.Count} projects) ---");
    foreach (var proj in projects)
    {
      sb.AppendLine($"• {proj.Title}: {proj.Description}");
      sb.AppendLine($"  Tags: {string.Join(", ", proj.Tags)}");
    }
    sb.AppendLine();

    sb.AppendLine($"--- RECOMMENDATIONS ({recommendations.Count}) ---");
    foreach (var rec in recommendations)
      sb.AppendLine($"• {rec.AuthorName} ({rec.AuthorTitle} @ {rec.AuthorCompany}): \"{rec.Text}\"");
    sb.AppendLine();

    sb.AppendLine("CONSTRAINTS:");
    sb.AppendLine("- Never invent information not present above.");
    sb.AppendLine("- If asked about something outside this portfolio, politely redirect to Amr's email.");
    sb.AppendLine("- Keep answers focused and under 200 words unless a detailed breakdown is explicitly requested.");

    return sb.ToString();
  }
}
