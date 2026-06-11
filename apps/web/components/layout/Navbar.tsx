'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  House, Briefcase, Phone,
  Sun, Moon, Globe, ChevronDown, Menu, X,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { smoothScrollTop } from '@/lib/smoothScrollTop'

const NAV_ITEMS = [
  { key: 'home',       href: '/',           icon: House     },
  { key: 'experience', href: '/experience', icon: Briefcase },
  { key: 'contact',    href: '/contact',    icon: Phone     },
] as const

const LOCALES = [
  { code: 'en', label: 'EN', name: 'English'    },
  { code: 'ar', label: 'AR', name: 'العربية'    },
  { code: 'nl', label: 'NL', name: 'Nederlands' },
] as const

interface NavbarProps { locale: string }

export function Navbar({ locale }: NavbarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  const [mounted,   setMounted]   = useState(false)
  const [langOpen,  setLangOpen]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 60) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close language dropdown on outside click
  useEffect(() => {
    if (!langOpen) return
    function onOut(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false)
    }
    document.addEventListener('mousedown', onOut)
    return () => document.removeEventListener('mousedown', onOut)
  }, [langOpen])

  // Close mobile menu on route change or when viewport grows past mobile breakpoint
  useEffect(() => { setMenuOpen(false) }, [pathname])
  useEffect(() => {
    function onResize() { if (window.innerWidth > 680) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function switchLocale(next: string) {
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
    setLangOpen(false)
  }

  function getFullHref(href: string) {
    return href === '/' ? `/${locale}` : `/${locale}${href}`
  }

  function isNavActive(href: string) {
    const full = getFullHref(href)
    return href === '/'
      ? pathname === `/${locale}` || pathname === `/${locale}/`
      : pathname === full || pathname.startsWith(`${full}/`)
  }

  const t = useTranslations('Navigation')
  const currentLocale = LOCALES.find((l) => l.code === locale)

  return (
    <>
    <header className={cn('nav-header', scrolled && 'nav-header--scrolled')}>

      {/* ── Main bar ── */}
      <nav className="nav-pill">

        {/* Left — Identity */}
        <Link
          href={`/${locale}`}
          className="nav-identity"
          scroll={false}
          onClick={(e) => {
            if (pathname === `/${locale}` || pathname === `/${locale}/`) {
              e.preventDefault()
              smoothScrollTop()
            }
          }}
        >
          <p className="nav-name"><span className="nav-name-first">Amr</span> Madkour</p>
        </Link>

        {/* Center — Desktop nav icons */}
        <div className="nav-icons">
          {NAV_ITEMS.map(({ key, href, icon: Icon }) => (
            <Link
              key={key}
              href={getFullHref(href)}
              className="nav-icon-link"
              scroll={false}
              onClick={(e) => {
                if (isNavActive(href)) {
                  e.preventDefault()
                  smoothScrollTop()
                }
              }}
            >
              <div className={cn('nav-icon-btn', isNavActive(href) && 'nav-icon-btn--active')}>
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <span className={cn('nav-icon-label', isNavActive(href) && 'nav-icon-label--visible')}>
                {t(key)}
              </span>
            </Link>
          ))}
        </div>

        {/* Right — Controls */}
        <div className="nav-controls">

          {/* Theme toggle */}
          <button
            className="nav-ctrl-btn"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          >
            {!mounted || resolvedTheme !== 'dark'
              ? <Moon size={20} strokeWidth={1.5} />
              : <Sun  size={20} strokeWidth={1.5} />}
          </button>

          <span className="nav-divider" />

          {/* Language dropdown */}
          <div className="nav-lang-wrapper" ref={langRef}>
            <button
              className={cn('nav-lang-trigger', langOpen && 'nav-lang-trigger--open')}
              onClick={() => setLangOpen((o) => !o)}
              aria-label="Switch language"
            >
              <Globe size={18} strokeWidth={1.5} />
              <span>{currentLocale?.label ?? locale.toUpperCase()}</span>
              <ChevronDown
                size={15}
                strokeWidth={2}
                style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
              />
            </button>

            {langOpen && (
              <div className="nav-lang-dropdown">
                {LOCALES.map(({ code, label, name }) => (
                  <button
                    key={code}
                    className={cn('nav-lang-option', code === locale && 'nav-lang-option--active')}
                    onClick={() => switchLocale(code)}
                  >
                    <span style={{ minWidth: 32 }}>{label}</span>
                    <span style={{ opacity: 0.5, fontSize: 13 }}>{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger separator + button — mobile only (shown via CSS) */}
          <span className="nav-hamburger-sep" />
          <button
            className={cn('nav-hamburger', menuOpen && 'nav-hamburger--open')}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen
              ? <X    size={22} strokeWidth={1.5} />
              : <Menu size={22} strokeWidth={1.5} />}
          </button>

        </div>
      </nav>

    </header>

    {/* ── Mobile menu drawer — outside <header> so it gets a global z-index ── */}
    {menuOpen && (
      <div className="nav-mobile-panel">
        {NAV_ITEMS.map(({ key, href }) => (
          <Link
            key={key}
            href={getFullHref(href)}
            className={cn('nav-mobile-link', isNavActive(href) && 'nav-mobile-link--active')}
            scroll={false}
            onClick={(e) => {
              setMenuOpen(false)
              if (isNavActive(href)) {
                e.preventDefault()
                smoothScrollTop()
              }
            }}
          >
            {t(key)}
          </Link>
        ))}
      </div>
    )}
    </>
  )
}
