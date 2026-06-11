import ReactMarkdown from 'react-markdown'
import { AssistantAvatar } from './AssistantAvatar'
import type { ChatMessage as ChatMessageType } from './useChatStream'

interface Props {
  message: ChatMessageType
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'
  const isEmpty = message.content === '' && message.isStreaming

  return (
    <div className={`chat-msg-row ${isUser ? 'chat-msg-row--user' : 'chat-msg-row--assistant'}`}>
      {!isUser && (
        <div className="chat-avatar chat-avatar--face" aria-hidden="true">
          <AssistantAvatar size={28} />
        </div>
      )}
      <div className={`chat-msg-bubble ${isUser ? 'chat-msg-bubble--user' : 'chat-msg-bubble--assistant'}`}>
        {isEmpty ? (
          <span className="chat-typing" aria-label="Thinking">
            <span className="chat-typing-dot" />
            <span className="chat-typing-dot" />
            <span className="chat-typing-dot" />
          </span>
        ) : isUser ? (
          <>
            {message.content}
            {message.isStreaming && <span className="chat-cursor" aria-hidden="true" />}
          </>
        ) : (
          <div className="chat-markdown">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {message.isStreaming && <span className="chat-cursor" aria-hidden="true" />}
          </div>
        )}
      </div>
    </div>
  )
}
