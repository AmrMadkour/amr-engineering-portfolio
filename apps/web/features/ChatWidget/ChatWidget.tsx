'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { ChatBubble } from './ChatBubble'
import { ChatWindow } from './ChatWindow'
import { useChatStream } from './useChatStream'
import { handleChatAction } from './ChatActionHandler'
import type { Profile } from '@/types/profile'

interface Props {
  profile: Profile
}

function derivePageContext(pathname: string, locale: string): { page: string; slug?: string } {
  const stripped = pathname.replace(`/${locale}`, '') || '/'

  if (stripped === '/' || stripped === '') return { page: 'home' }
  if (stripped.startsWith('/experience/')) {
    const slug = stripped.replace('/experience/', '')
    return { page: 'experience', slug: slug || undefined }
  }
  if (stripped.startsWith('/experience')) return { page: 'experience' }
  if (stripped.startsWith('/contact')) return { page: 'contact' }
  return { page: 'home' }
}

export function ChatWidget({ profile }: Props) {
  const locale = useLocale()
  const t = useTranslations('ChatWidget')
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  const pageContext = derivePageContext(pathname, locale)
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

  const onAction = useCallback(
    (action: Parameters<typeof handleChatAction>[0]) => {
      handleChatAction(action, router, locale, profile)
    },
    [router, locale, profile],
  )

  const { messages, isStreaming, sendMessage } = useChatStream({
    locale,
    apiBase,
    pageContext,
    onAction,
    errorMessage: t('errorMessage'),
    translateErrorCode: (code) => {
      switch (code) {
        case 'rateLimited':  return t('errors.rateLimited')
        case 'unavailable':  return t('errors.unavailable')
        case 'timeout':      return t('errors.timeout')
        case 'configError':  return t('errors.configError')
        default:             return t('errorMessage')
      }
    },
  })

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={widgetRef}>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            messages={messages}
            isStreaming={isStreaming}
            onSend={sendMessage}
            onDirectAction={onAction}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      {!isOpen && (
        <ChatBubble onClick={() => setIsOpen(true)} />
      )}
    </div>
  )
}
