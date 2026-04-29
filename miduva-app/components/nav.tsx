"use client"

import { useState, useEffect } from "react"

interface NavProps {
  theme: "dark" | "light"
  setTheme: (t: "dark" | "light") => void
  heroRevealed?: boolean
}

export default function Nav({ theme, setTheme, heroRevealed = true }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 30)

      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      // Hide navigation when scrolled into the last ~50% of the viewport (during the cinematic footer reveal)
      setIsHidden(docHeight - (scrollPosition + windowHeight) < windowHeight * 0.5)
    }
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])

  const items = [
    { n: "Services", h: "#services" },
    { n: "Systems",  h: "#systems"  },
    { n: "Case Studies", h: "#cases" },
    { n: "About",    h: "#about"    },
  ]

  const hidden = !heroRevealed || isHidden

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 px-3 transition-transform duration-500 will-change-transform ${
        hidden ? "-translate-y-[150%]" : "translate-y-0"
      }`}
    >
      <nav
        className={`mx-auto mt-3 border rounded-2xl transition-all duration-500 ${
          scrolled
            ? "max-w-4xl bg-[var(--card)]/75 backdrop-blur-xl border-[var(--line)] shadow-[0_10px_40px_-20px_rgba(15,35,73,.25)] dark:shadow-[0_10px_40px_-20px_rgba(0,0,0,.6)]"
            : "max-w-6xl bg-transparent border-transparent shadow-none backdrop-blur-none"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <a href="#" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/miduva-logo.png" alt="Miduva" className="h-7 w-auto" />
          </a>

          <ul
            className={`hidden lg:flex items-center gap-8 text-[13.5px] font-medium ${
              scrolled ? "text-[var(--muted)]" : "text-white/80"
            }`}
          >
            {items.map((i) => (
              <li key={i.n}>
                <a
                  href={i.h}
                  className={`transition ${scrolled ? "hover:text-[var(--navy-900)]" : "hover:text-white"}`}
                >
                  {i.n}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className={`h-9 w-9 rounded-xl flex items-center justify-center transition hover:text-[var(--teal-500)] ${
                scrolled
                  ? "border border-[var(--line)] bg-[var(--chip)] text-[var(--navy-900)]"
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
            <a
              href="#"
              className={`text-sm font-medium px-4 py-2 rounded-xl transition ${
                scrolled ? "text-[var(--navy-900)] hover:bg-[var(--paper-2)]" : "text-white/80 hover:text-white"
              }`}
            >
              Client Login
            </a>
            <a href="#cta" className="text-sm font-semibold px-4 py-2 rounded-xl btn-primary inline-flex items-center gap-2">
              Book a Call
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <div className="lg:hidden flex items-center gap-2">
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
            {items.map((i) => (
              <a key={i.n} href={i.h} className="block text-[var(--muted)] text-sm">
                {i.n}
              </a>
            ))}
            <a
              href="#cta"
              className="block text-center text-sm font-semibold px-4 py-2 rounded-xl btn-primary"
            >
              Book a Call
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}
