import type { Config } from 'tailwindcss'
import path from 'path'

const config: Config = {
  darkMode: 'class',
  content: [
    path.join(__dirname, './app/**/*.{ts,tsx,mdx}'),
    path.join(__dirname, './components/**/*.{ts,tsx}'),
    path.join(__dirname, './features/**/*.{ts,tsx}'),
    path.join(__dirname, './hooks/**/*.{ts,tsx}'),
    path.join(__dirname, './lib/**/*.{ts,tsx}'),
    path.join(__dirname, './types/**/*.{ts,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'Outfit', 'Outfit Placeholder', 'Google Sans Display', 'Google Sans', 'ui-sans-serif', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
