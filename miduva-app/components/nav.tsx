"use client"

import { forwardRef, useState, useEffect, useRef } from "react"

interface NavProps {
  theme: "dark" | "light"
  setTheme: (t: "dark" | "light") => void
  heroRevealed?: boolean
}

const Nav = forwardRef<HTMLElement, NavProps>(function Nav(
  { theme, setTheme, heroRevealed = true },
  ref,
) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  // Capture the scroll position at the moment the hero finishes revealing.
  // Any scroll beyond that point should pill the nav.
  const baselineRef = useRef<number | null>(null)
  useEffect(() => {
    if (heroRevealed) {
      baselineRef.current = window.scrollY
      setScrolled(false)
    } else {
      baselineRef.current = null
      setScrolled(false)
    }
  }, [heroRevealed])

  useEffect(() => {
    const on = () => {
      const scrollPosition = window.scrollY
      const baseline = baselineRef.current
      setScrolled(baseline !== null && scrollPosition - baseline > 4)

      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      // Hide navigation when scrolled into the last ~50% of the viewport (during the cinematic footer reveal)
      setIsHidden(docHeight - (scrollPosition + windowHeight) < windowHeight * 0.5)
    }
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])

  const leftItems = [
    { n: "Services",     h: "#services"    },
    { n: "Systems",      h: "#systems"     },
    { n: "How it Works", h: "#how-it-works"},
  ]
  const rightItems = [
    { n: "Case Studies", h: "#cases"  },
    { n: "About",        h: "#about"  },
    { n: "Get Started",  h: "#cta"    },
  ]

  const hiddenForFooter = isHidden
  // Hide the nav during the intro animation; slide in once reveal completes
  const hiddenForIntro = !heroRevealed

  const linkBase =
    "uppercase tracking-[0.14em] text-[11.5px] font-medium transition"
  const linkColor = scrolled
    ? "text-[var(--muted)] hover:text-[var(--navy-900)]"
    : "text-white/75 hover:text-white"

  return (
    <header
      ref={ref}
      className={`fixed top-0 inset-x-0 z-40 px-3 transition-transform duration-500 will-change-transform ${
        hiddenForFooter || hiddenForIntro ? "-translate-y-[150%]" : "translate-y-0"
      }`}
    >
      <nav
        className={`mx-auto mt-3 rounded-full transition-all duration-500 ${
          scrolled
            ? "max-w-5xl border bg-[var(--card)]/75 backdrop-blur-xl border-[var(--line)] shadow-[0_10px_40px_-20px_rgba(15,35,73,.25)] dark:shadow-[0_10px_40px_-20px_rgba(0,0,0,.6)]"
            : "max-w-6xl border border-transparent bg-transparent shadow-none backdrop-blur-none"
        }`}
      >
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center px-8 py-3 gap-8">
          <ul className={`flex items-center justify-start gap-8 ${linkBase} ${linkColor}`}>
            {leftItems.map((i) => (
              <li key={i.n}>
                <a href={i.h}>{i.n}</a>
              </li>
            ))}
          </ul>

          <a href="#" className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/miduva-logo-white.png" alt="Miduva" className="h-7 w-auto" />
          </a>

          <div className="flex items-center justify-end gap-8">
            <ul className={`flex items-center gap-8 ${linkBase} ${linkColor}`}>
              {rightItems.map((i) => (
                <li key={i.n}>
                  <a href={i.h}>{i.n}</a>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className={`h-8 w-8 rounded-full flex items-center justify-center transition hover:text-[var(--teal-500)] ${
                scrolled
                  ? "text-[var(--navy-900)]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="lg:hidden flex items-center justify-between px-5 py-3">
          <a href="#" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/miduva-logo-white.png" alt="Miduva" className="h-7 w-auto" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="h-9 w-9 rounded-lg border border-[var(--line)] flex items-center justify-center text-[var(--navy-900)]"
            >
              {theme === "dark" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg border border-[var(--line)]"
              aria-label="menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16"/>
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden px-5 pb-5 border-t border-[var(--line)] pt-3 space-y-3">
            {[...leftItems, ...rightItems].map((i) => (
              <a key={i.n} href={i.h} className="block text-[var(--muted)] text-sm">
                {i.n}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
})

export default Nav
