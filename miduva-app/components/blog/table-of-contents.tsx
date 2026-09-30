"use client"

import { useEffect, useState } from "react"
import type { TocItem } from "@/lib/wordpress"

/** Article outline with the current section highlighted while reading. */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => !!el)
    if (!headings.length) return
    const onScroll = () => {
      // The last heading above the upper third of the screen is the one being read.
      const line = window.innerHeight * 0.3
      let current = headings[0].id
      for (const h of headings) if (h.getBoundingClientRect().top <= line) current = h.id
      setActive(current)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [items])

  if (!items.length) return null
  return (
    <nav aria-label="Table of contents">
      <ol className="space-y-1 border-l border-[var(--line)]">
        {items.map((item) => {
          const isActive = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1.5 text-[13.5px] leading-[1.4] transition-colors ${item.level === 3 ? "pl-7" : "pl-4"} ${
                  isActive ? "border-[var(--teal-500)] text-[var(--ink)] font-semibold" : "border-transparent text-[var(--muted)] hover:text-[var(--navy-700)]"
                }`}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
