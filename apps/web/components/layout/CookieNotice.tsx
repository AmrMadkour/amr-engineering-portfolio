'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

const STORAGE_KEY = 'cookie-notice-ack'

export function CookieNotice() {
  const [visible, setVisible] = useState(false)
  const t = useTranslations('CookieNotice')
  const locale = useLocale()

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      // localStorage blocked (private browsing edge case) — don't show
    }
  }, [])

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-notice" role="region" aria-label={t('ariaLabel')}>
      <p className="cookie-notice__text">
        {t('message')}{' '}
        <Link href={`/${locale}/privacy-policy`} className="cookie-notice__link">
          {t('policyLink')}
        </Link>
      </p>
      <button onClick={dismiss} className="cookie-notice__btn">
        {t('dismiss')}
      </button>
    </div>
  )
}
