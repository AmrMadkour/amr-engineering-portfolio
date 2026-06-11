'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { AssistantAvatar } from './AssistantAvatar'
import { useTranslations } from 'next-intl'
import { ChatMessage } from './ChatMessage'
import type { ChatMessage as ChatMessageType } from './useChatStream'

type DirectAction = { name: string; payload: Record<string, unknown> }
type QuickAction = { label: string } & (
  | { message: string; direct?: never }
  | { direct: DirectAction; message?: never }
)

interface Props {
  messages: ChatMessageType[]
  isStreaming: boolean
  onSend: (text: string) => void
  onDirectAction: (action: DirectAction) => void
  onClose: () => void
}

// Messages sent to AI are locale-independent (AI detects the language from the label click context).
// Labels come from i18n via t('quickActions.*') in the component.
const QUICK_ACTION_DEFS: (Omit<QuickAction, 'label'> & { key: string })[] = [
  { key: 'background', message: "What's Amr's background?" },
  { key: 'experience', direct: { name: 'navigate_to_page', payload: { page: 'experience' } } },
  { key: 'resume',     direct: { name: 'download_resume',  payload: {} } },
  { key: 'bookCall',   direct: { name: 'open_booking',     payload: {} } },
]

const windowVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: 16, scale: 0.96, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
}

export function ChatWindow({ messages, isStreaming, onSend, onDirectAction, onClose }: Props) {
  const t = useTranslations('ChatWidget')
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const quickActions = QUICK_ACTION_DEFS.map(({ key, ...def }) => ({
    ...def,
    label: t(`quickActions.${key}` as Parameters<typeof t>[0]),
  })) as QuickAction[]

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSend() {
    const text = input.trim()
    if (!text || isStreaming) return
    setInput('')
    onSend(text)
  }

  return (
    <motion.div
      className="chat-window"
      variants={windowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="dialog"
      aria-label={t('title')}
    >
      {/* Header */}
      <div className="chat-window-header">
        <div className="chat-header-identity">
          <div className="chat-avatar chat-avatar--header chat-avatar--face">
            <AssistantAvatar size={32} />
          </div>
          <span className="chat-header-title">{t('title')}</span>
        </div>
        <div className="chat-header-actions">
          <span className={`chat-status-dot ${isStreaming ? 'chat-status-dot--active' : ''}`} aria-hidden="true" />
          <button className="chat-close-btn" onClick={onClose} aria-label="Close chat">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.length === 0 && (
          <div className="chat-empty-state">
            <p className="chat-greeting">{t('greeting')}</p>
            <div className="chat-quick-actions">
              {quickActions.map(action => (
                <button
                  key={action.label}
                  className="chat-quick-action-btn"
                  onClick={() => action.direct ? onDirectAction(action.direct) : onSend(action.message!)}
                  disabled={isStreaming}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('placeholder')}
          disabled={isStreaming}
          rows={1}
          aria-label={t('placeholder')}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>
    </motion.div>
  )
}
