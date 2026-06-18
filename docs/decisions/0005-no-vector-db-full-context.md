# 0005 — No Vector DB, Full Portfolio JSON in System Prompt

## Status
Accepted

## Context
AI chat needs access to portfolio content (experience, projects, profile, recommendations) to answer questions accurately. The standard approach for larger corpora is a vector database with RAG retrieval.

## Decision
The full portfolio JSON (~3K tokens) is loaded per-request from `IContentRepository` (already cached by `IMemoryCache`) and injected into the Gemini system prompt on every call. No vector database, no embedding pipeline.

## Consequences
- Zero additional infrastructure — no Pinecone, Weaviate, or similar.
- Gemini always has the full picture; no retrieval gaps or chunking edge cases.
- Works as long as total content stays within one context window (~3K tokens is well within Gemini Flash's 1M token limit).
- If content grows 100× this decision should be revisited; at current scale it is the correct call.
