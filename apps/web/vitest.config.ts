import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    env: {
      NEXT_PUBLIC_API_URL: 'http://test-api',
    },
    include: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'lib/**',
        'services/**',
        'hooks/**',
        'features/ChatWidget/useChatStream.ts',
        'features/ChatWidget/ChatActionHandler.ts',
        'components/layout/CookieNotice.tsx',
      ],
      exclude: [
        '**/*.test.*',
        '**/__tests__/**',
        '**/*.config.*',
        '**/node_modules/**',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        statements: 70,
        branches: 60,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@content': path.resolve(__dirname, '../../content'),
    },
  },
})
