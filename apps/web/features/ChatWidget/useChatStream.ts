'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export interface ChatAction {
  name: string
  payload: Record<string, unknown>
}

interface UseChatStreamOptions {
  locale: string
  apiBase: string
  pageContext?: { page: string; slug?: string }
  onAction?: (action: ChatAction) => void
  errorMessage?: string
  translateErrorCode?: (code: string) => string
}

export function useChatStream({ locale, apiBase, pageContext, onAction, errorMessage, translateErrorCode }: UseChatStreamOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  // Ref so sendMessage never captures a stale messages snapshot in its closure.
  const messagesRef = useRef<ChatMessage[]>(messages)
  useEffect(() => { messagesRef.current = messages }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return

    // Abort any in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text }
    const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '', isStreaming: true }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setIsStreaming(true)

    try {
      const history = messagesRef.current
        .filter(m => !m.isStreaming)
        .slice(-10)
        .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))

      const response = await fetch(`${apiBase}/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          locale,
          pageContext: pageContext ?? null,
        }),
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6)
          if (raw === '[DONE]') break

          try {
            const event = JSON.parse(raw) as { type: string; content?: string; name?: string; payload?: Record<string, unknown>; code?: string }

            if (event.type === 'delta' && event.content) {
              setMessages(prev => {
                const next = [...prev]
                const last = next[next.length - 1]
                if (last?.role === 'assistant') {
                  next[next.length - 1] = { ...last, content: last.content + event.content }
                }
                return next
              })
            } else if (event.type === 'error' && event.code) {
              const msg = translateErrorCode?.(event.code) ?? errorMessage ?? 'Something went wrong. Please try again.'
              setMessages(prev => {
                const next = [...prev]
                const last = next[next.length - 1]
                if (last?.role === 'assistant') {
                  next[next.length - 1] = { ...last, content: msg }
                }
                return next
              })
            } else if (event.type === 'action' && event.name && onAction) {
              onAction({ name: event.name, payload: event.payload ?? {} })
            }
          } catch {
            // Malformed SSE line — skip
          }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return

      setMessages(prev => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.role === 'assistant') {
          next[next.length - 1] = {
            ...last,
            content: errorMessage ?? 'Something went wrong. Please try again.',
            isStreaming: false,
          }
        }
        return next
      })
    } finally {
      setIsStreaming(false)
      setMessages(prev => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.role === 'assistant' && last.isStreaming) {
          next[next.length - 1] = { ...last, isStreaming: false }
        }
        return next
      })
    }
  }, [isStreaming, locale, apiBase, pageContext, onAction, errorMessage, translateErrorCode])

  const clearMessages = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setIsStreaming(false)
  }, [])

  return { messages, isStreaming, sendMessage, clearMessages }
}
