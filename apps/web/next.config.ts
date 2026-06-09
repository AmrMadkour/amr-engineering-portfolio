import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
const withMDX = createMDX({ extension: /\.mdx?$/, options: { remarkPlugins: [remarkGfm] } })

const config: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    qualities: [75, 85, 90, 95, 100],
  },
}

export default withMDX(withNextIntl(config))
