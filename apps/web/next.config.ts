import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
const withMDX = createMDX({ extension: /\.mdx?$/ })

const config: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
}

export default withMDX(withNextIntl(config))
