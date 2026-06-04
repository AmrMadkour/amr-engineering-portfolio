'use client'

import { motion } from 'framer-motion'
import { AssistantAvatar } from './AssistantAvatar'

interface Props {
  onClick: () => void
}

export function ChatBubble({ onClick }: Props) {
  return (
    <motion.button
      className="chat-fab chat-fab--face"
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Open AI assistant"
    >
      <AssistantAvatar size={52} />
    </motion.button>
  )
}
