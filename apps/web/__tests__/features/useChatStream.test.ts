import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useChatStream } from '@/features/ChatWidget/useChatStream'

const BASE_OPTS = {
  locale: 'en',
  apiBase: 'http://test-api',
  errorMessage: 'Something went wrong.',
}

function makeSseStream(lines: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(line + '\n'))
      }
      controller.close()
    },
  })
}

function mockFetch(lines: string[]) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    body: makeSseStream(lines),
  }))
}

beforeEach(() => {
  vi.stubGlobal('crypto', { randomUUID: vi.fn().mockReturnValue('test-uuid') })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('useChatStream — SSE parsing', () => {
  it('appends delta content to the assistant message', async () => {
    mockFetch([
      'data: {"type":"delta","content":"Hello "}',
      'data: {"type":"delta","content":"world"}',
      'data: [DONE]',
    ])

    const { result } = renderHook(() => useChatStream(BASE_OPTS))
    await act(() => result.current.sendMessage('hi'))

    await waitFor(() => {
      const assistant = result.current.messages.find(m => m.role === 'assistant')
      expect(assistant?.content).toBe('Hello world')
    })
  })

  it('sets error message when an error event is received', async () => {
    const translateErrorCode = vi.fn().mockReturnValue('Rate limited!')
    mockFetch([
      'data: {"type":"error","code":"rateLimited"}',
      'data: [DONE]',
    ])

    const { result } = renderHook(() =>
      useChatStream({ ...BASE_OPTS, translateErrorCode }),
    )
    await act(() => result.current.sendMessage('hi'))

    await waitFor(() => {
      const assistant = result.current.messages.find(m => m.role === 'assistant')
      expect(assistant?.content).toBe('Rate limited!')
      expect(translateErrorCode).toHaveBeenCalledWith('rateLimited')
    })
  })

  it('calls onAction when an action event is received', async () => {
    const onAction = vi.fn()
    mockFetch([
      'data: {"type":"action","name":"navigate_to_page","payload":{"slug":"metrixlab-senior"}}',
      'data: [DONE]',
    ])

    const { result } = renderHook(() =>
      useChatStream({ ...BASE_OPTS, onAction }),
    )
    await act(() => result.current.sendMessage('show backend work'))

    await waitFor(() => {
      expect(onAction).toHaveBeenCalledWith({
        name: 'navigate_to_page',
        payload: { slug: 'metrixlab-senior' },
      })
    })
  })

  it('silently skips malformed SSE lines', async () => {
    mockFetch([
      'data: not-valid-json{{{',
      'data: {"type":"delta","content":"OK"}',
      'data: [DONE]',
    ])

    const { result } = renderHook(() => useChatStream(BASE_OPTS))
    await act(() => result.current.sendMessage('hi'))

    await waitFor(() => {
      const assistant = result.current.messages.find(m => m.role === 'assistant')
      expect(assistant?.content).toBe('OK')
    })
  })
})

describe('useChatStream — history cap', () => {
  it('sends at most the last 10 non-streaming messages as history', async () => {
    mockFetch(['data: [DONE]'])

    // Pre-populate hook with 12 messages via multiple sends
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, body: makeSseStream(['data: [DONE]']) })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useChatStream(BASE_OPTS))

    // Send 6 exchanges (12 messages) sequentially
    for (let i = 0; i < 6; i++) {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        body: makeSseStream([`data: {"type":"delta","content":"reply${i}"}`, 'data: [DONE]']),
      })
      await act(() => result.current.sendMessage(`msg${i}`))
      await waitFor(() => !result.current.isStreaming)
    }

    // One more send — check the history payload
    fetchMock.mockResolvedValueOnce({ ok: true, body: makeSseStream(['data: [DONE]']) })
    await act(() => result.current.sendMessage('final'))

    const lastCall = fetchMock.mock.calls.at(-1)!
    const body = JSON.parse(lastCall[1].body as string)
    expect(body.history.length).toBeLessThanOrEqual(10)
  })
})

describe('useChatStream — abort', () => {
  it('ignores AbortError and does not set an error message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(
      Object.assign(new DOMException('Aborted', 'AbortError')),
    ))

    const { result } = renderHook(() => useChatStream(BASE_OPTS))
    await act(() => result.current.sendMessage('hi'))

    await waitFor(() => !result.current.isStreaming)
    const assistant = result.current.messages.find(m => m.role === 'assistant')
    // Content stays empty (no error message injected)
    expect(assistant?.content).toBe('')
  })

  it('clearMessages resets all state', async () => {
    mockFetch([
      'data: {"type":"delta","content":"hello"}',
      'data: [DONE]',
    ])

    const { result } = renderHook(() => useChatStream(BASE_OPTS))
    await act(() => result.current.sendMessage('hi'))
    await waitFor(() => result.current.messages.length > 0)

    act(() => result.current.clearMessages())
    expect(result.current.messages).toHaveLength(0)
    expect(result.current.isStreaming).toBe(false)
  })
})

describe('useChatStream — network error', () => {
  it('sets the fallback error message on fetch failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const { result } = renderHook(() => useChatStream(BASE_OPTS))
    await act(() => result.current.sendMessage('hi'))

    await waitFor(() => {
      const assistant = result.current.messages.find(m => m.role === 'assistant')
      expect(assistant?.content).toBe('Something went wrong.')
    })
  })

  it('sets error message on non-ok HTTP response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      body: null,
    }))

    const { result } = renderHook(() => useChatStream(BASE_OPTS))
    await act(() => result.current.sendMessage('hi'))

    await waitFor(() => {
      const assistant = result.current.messages.find(m => m.role === 'assistant')
      expect(assistant?.content).toBe('Something went wrong.')
    })
  })
})
