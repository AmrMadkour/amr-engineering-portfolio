# AI Chat Flow

How a single user message travels from the browser to Gemini and back as a live stream.
This document covers the *how* — the *why* behind individual decisions lives in the ADRs linked throughout.

---

## Overview

The chat feature is a **Server-Sent Events (SSE) stream** built on three layers:

```
Browser → POST /v1/chat → ChatEndpoints.cs → GeminiChatService → Gemini API
                                                    ↑
                                        IContentRepository (cached JSON)
```

The backend streams events back as they arrive from Gemini — the browser renders text tokens in real time and can trigger UI actions (page navigation, opening links) mid-stream.

---

## 1. Request Shape

The frontend sends a single `POST /v1/chat` with this body:

```json
{
  "message": "Tell me about his backend experience",
  "history": [
    { "role": "user",      "content": "Hi" },
    { "role": "assistant", "content": "Hello!" }
  ],
  "locale": "en",
  "pageContext": { "page": "experience", "slug": null }
}
```

| Field | Purpose |
|---|---|
| `message` | The user's current input |
| `history` | Prior turns — gives Gemini conversation context |
| `locale` | `en`, `ar`, or `nl` — selects which content folder to read and hints the response language |
| `pageContext` | What the user is currently looking at — included in the system prompt so the AI knows the context |

---

## 2. Rate Limiting and Validation (`Program.cs` → `ChatEndpoints.cs`)

Before any AI work starts, two gates run in sequence:

**Rate limiter** (registered in `Program.cs`): 10 requests per minute per IP address, fixed window. Exceeding the limit returns `429` immediately — the request never reaches the service.

**Input validation** (`ChatEndpoints.cs`):
- Message must be 1–2000 characters → `400` if not
- Locale must be one of `en`, `ar`, `nl` — this is a path-traversal guard because locale maps directly to a folder on disk (`content/{locale}/`)

If both pass, SSE headers are set and the stream begins:

```
Content-Type: text/event-stream; charset=utf-8
Cache-Control: no-cache
X-Accel-Buffering: no   ← tells nginx/Render not to buffer the response
```

---

## 3. System Prompt Assembly (`BuildSystemPromptAsync`)

Before calling Gemini, `GeminiChatService` builds a system prompt that contains everything the AI needs to answer questions about the portfolio. Four content types are fetched **in parallel**:

```csharp
await Task.WhenAll(
    _repo.GetProfileAsync(locale, ct),
    _repo.GetExperienceAsync(locale, ct),
    _repo.GetProjectsAsync(locale, ct),
    _repo.GetRecommendationsAsync(locale, ct)
);
```

`JsonContentRepository` reads `content/{locale}/*.json` from disk with a **15-minute `IMemoryCache`** — on a warm process the JSON is never re-read from disk.

The prompt is assembled in order:

1. **Role and tone** — "You are Ask Amr, answer questions about Amr's background..."
2. **Language rule** — detect the user's language and always respond in it; use `locale` only as a fallback for ambiguous short inputs
3. **Response style rules** — greetings get one sentence; factual questions get 1–3; full breakdowns get up to 150 words
4. **Tool use rules** — when to navigate vs. answer with text (see section 4)
5. **Current page context** — so the AI knows what the user is looking at
6. **Full portfolio data** — Profile, all Experience entries (with highlights and technologies), Projects, Recommendations

The full prompt is roughly 3K tokens — well within Gemini Flash's 1M token limit. No vector database or retrieval step is needed; see [ADR 0005](decisions/0005-no-vector-db-full-context.md).

If prompt assembly fails (e.g. a content file is missing), an `ErrorEvent("unavailable")` is yielded immediately and the stream ends.

---

## 4. Function Calling (Tools)

Gemini is given five tool declarations. These let the AI trigger frontend UI actions mid-stream rather than just returning text:

| Tool | When Gemini uses it |
|---|---|
| `navigate_to_page` | User wants to visually explore the portfolio, not just read an answer |
| `open_booking` | User wants to schedule a call or meeting |
| `open_linkedin` | User wants to connect on LinkedIn |
| `open_github` | User wants to browse code or repositories |
| `download_resume` | User asks for the CV or resume |

The system prompt includes explicit guidance so Gemini reasons about *intent*, not keywords:
- "What was his first role?" → text only (a sentence answers it)
- "Show me his backend experience" → `navigate_to_page` + a short intro text

Tools and text can arrive in the same response. The rule is always: text first, then action.

See [ADR 0004](decisions/0004-gemini-over-semantic-kernel.md) for why Gemini's native function calling was chosen over Semantic Kernel's plugin abstraction.

---

## 5. Streaming and Retry Logic

### Timeout

Two cancellation sources are linked together:

```csharp
using var timeoutCts = new CancellationTokenSource(TimeSpan.FromSeconds(45));
using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(ct, timeoutCts.Token);
```

- `ct` — the HTTP request's cancellation token (fires when the client disconnects)
- `timeoutCts` — a hard 45-second ceiling on the entire Gemini response, independent of the HTTP client's internal timeout

### Retry loop

The stream attempt runs up to twice:

- **Attempt 0** — starts immediately
- **Attempt 1** — only if attempt 0 throws a `GeminiApiException`; waits 2 seconds first for rate-limit recovery

If the client disconnects mid-stream, the loop exits silently — no error event is sent because there is nobody to receive it.

### Per-chunk processing

Each chunk from Gemini can carry text tokens, function calls, or both:

```csharp
// Text token — streamed to the client immediately
if (!string.IsNullOrEmpty(text))
    yield return new TextDeltaEvent(text);

// Function call — triggers a UI action on the frontend
foreach (var call in calls)
    yield return new ActionEvent(call.Name, call.Args);
```

---

## 6. SSE Serialization (`ChatEndpoints.cs`)

Each `ChatEventDto` yielded by the service is pattern-matched to a JSON payload and written to the HTTP response immediately, followed by a flush:

```
data: {"type":"delta","content":"Amr has 8 years of "}\n\n
data: {"type":"delta","content":"backend experience"}\n\n
data: {"type":"action","name":"navigate_to_page","payload":{"page":"experience","domain":"backend"}}\n\n
data: [DONE]\n\n
```

`FlushAsync` after every write ensures each line reaches the browser the moment it's ready — the response is never buffered.

---

## 7. Error Handling

When an exception escapes the stream, `ClassifyGeminiError` walks the **full exception chain** (including inner exceptions) and maps it to a `ChatErrorCodes` constant:

| Matched content | Code |
|---|---|
| `"429"`, `"quota"`, `"RESOURCE_EXHAUSTED"` | `"rateLimited"` |
| `"401"`, `"403"`, `"API_KEY"`, `"UNAUTHENTICATED"` | `"configError"` |
| `"timeout"`, `"timed out"`, `"TaskCanceled"` | `"timeout"` |
| `"500"`, `"502"`, `"503"`, `"INTERNAL"` | `"unavailable"` |
| Any `GeminiApiException` | `"unavailable"` |
| Anything else | `"unknown"` |

The error code is streamed as:

```
data: {"type":"error","code":"rateLimited"}\n\n
```

The frontend (`ChatWidget.tsx`) reads the `code` field and looks up a human-readable message in `messages/{locale}.json` under `ChatWidget.errors.*`. No English strings ever cross the wire from the backend — see [ADR 0007](decisions/0007-sse-error-codes-not-strings.md).

---

## 8. End-to-End Diagram

```
Browser
  │
  │  POST /v1/chat  { message, history, locale, pageContext }
  ▼
RateLimiter — 10 req/min/IP (Program.cs)
  │  429 if exceeded
  ▼
ChatEndpoints.cs
  │  validate: message length, locale whitelist
  │  400 if invalid
  │  set SSE response headers
  ▼
GeminiChatService.StreamResponseAsync()
  │
  ├─ BuildSystemPromptAsync()
  │    └─ JsonContentRepository
  │         ├─ IMemoryCache (15-min TTL)
  │         └─ content/{locale}/*.json  (profile, experience, projects, recommendations)
  │
  ├─ GoogleAI SDK
  │    ├─ GenerativeModel (system prompt, 5 tool declarations)
  │    └─ StartChat(history)
  │
  └─ SendMessageStream(message)  ──────────────► Gemini API (gemini-flash-latest)
       │                                              │
       │  chunks arrive as they are generated         │
       │ ◄────────────────────────────────────────────┘
       │
       ├─ yield TextDeltaEvent(text)
       └─ yield ActionEvent(name, args)
            │
            ▼
ChatEndpoints.cs
  │  pattern-match event → JSON payload
  │  WriteAsync("data: {...}\n\n")
  │  FlushAsync()
  ▼
Browser
  ├─ delta  → append text token to chat bubble
  ├─ action → trigger UI action (navigate, open link, download)
  └─ error  → look up code in messages/{locale}.json → show localised message
```

---

## Key Files

| File | Role |
|---|---|
| `apps/api/src/AmrPortfolio.Api/Program.cs` | DI wiring, rate limiter, middleware pipeline |
| `apps/api/src/AmrPortfolio.Api/Endpoints/ChatEndpoints.cs` | HTTP entry point, SSE serialization |
| `apps/api/src/AmrPortfolio.Application/Interfaces/IChatService.cs` | `IChatService` contract + `ChatEventDto` hierarchy |
| `apps/api/src/AmrPortfolio.Application/DTOs/ChatDto.cs` | `ChatRequestDto`, `ChatMessageDto`, `PageContextDto` |
| `apps/api/src/AmrPortfolio.Application/Constants/ChatErrorCodes.cs` | Error code constants |
| `apps/api/src/AmrPortfolio.Infrastructure/AI/GeminiChatService.cs` | Gemini integration, streaming, retry, error classification |
| `apps/web/features/ChatWidget/` | Frontend widget, SSE consumption, UI action dispatch |
| `messages/{locale}.json` | Localised error messages under `ChatWidget.errors.*` |
| `content/{locale}/*.json` | Portfolio data injected into the system prompt |
