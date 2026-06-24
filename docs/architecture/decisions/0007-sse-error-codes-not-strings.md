# 0007 — SSE Error Events Use Codes, Not Human-Readable Strings

## Status
Accepted

## Context
The `POST /v1/chat` endpoint streams SSE events. When Gemini fails (rate limit, timeout, auth, etc.), the backend needs to signal the error to the frontend. The naive approach is to stream a human-readable English error message from C#.

## Decision
`GeminiChatService` never returns human-readable strings. It yields `ErrorEvent(string Code)` with constants from `ChatErrorCodes` (`rateLimited`, `unavailable`, `timeout`, `configError`, `unknown`). The frontend (`ChatWidget.tsx`) translates codes via `messages/{locale}.json` under `ChatWidget.errors.*`.

## Consequences
- Error messages are fully localised (EN/AR/NL) with zero C# changes.
- Adding a new error type = add a `ChatErrorCodes` constant + a translation key. No string hunting in C#.
- Backend and frontend are decoupled on error presentation — the frontend can rephrase errors without touching the API.
