import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const config: NextConfig = {
  // @next/mdx will be wired here in Phase 1.4 (content scaffold)
}

export default withNextIntl(config)
