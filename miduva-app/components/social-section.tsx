"use client"

import { useRef } from "react"
import { motion } from "motion/react"
import type { SocialData, SocialLink, SocialPlatform } from "@/lib/types"
import { useFrameInView } from "@/components/puck/frame-runtime"

const PLATFORMS: Record<SocialPlatform, { name: string; path: string }> = {
  linkedin: { name: "LinkedIn", path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z" },
  instagram: { name: "Instagram", path: "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5.85-7.8a1.07 1.07 0 1 1-2.14 0 1.07 1.07 0 0 1 2.14 0zM21.4 8.3c-.06-1.4-.37-2.64-1.4-3.66-1.02-1.02-2.27-1.34-3.66-1.4C14.9 3.16 9.1 3.16 7.66 3.24c-1.4.07-2.63.38-3.66 1.4C2.98 5.66 2.67 6.9 2.6 8.3c-.08 1.44-.08 5.95 0 7.4.06 1.4.37 2.64 1.4 3.66 1.03 1.02 2.27 1.34 3.66 1.4 1.44.08 7.24.08 8.68 0 1.4-.06 2.64-.38 3.66-1.4 1.02-1.02 1.34-2.27 1.4-3.66.08-1.45.08-5.95 0-7.4zm-1.86 8.93a2.96 2.96 0 0 1-1.67 1.67c-1.15.46-3.9.35-5.17.35s-4.03.1-5.17-.35a2.96 2.96 0 0 1-1.67-1.67c-.46-1.15-.35-3.9-.35-5.17s-.1-4.03.35-5.17a2.96 2.96 0 0 1 1.67-1.67C7.97 4.77 10.72 4.88 12 4.88s4.03-.1 5.17.35c.77.3 1.37.9 1.67 1.67.46 1.15.35 3.9.35 5.17s.11 4.03-.35 5.17z" },
  facebook: { name: "Facebook", path: "M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.92.26-1.55 1.58-1.55h1.68V3.4A22.6 22.6 0 0 0 14.3 3.3c-2.43 0-4.1 1.48-4.1 4.2v2.3H7.5V13h2.7v8z" },
  x: { name: "X", path: "M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77zm-1.08 16.2h1.7L7.4 4.73H5.58z" },
  youtube: { name: "YouTube", path: "M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z" },
  tiktok: { name: "TikTok", path: "M16.6 3h-3.1v12.2a2.7 2.7 0 1 1-2.7-2.7c.27 0 .53.04.78.11V9.45a5.85 5.85 0 1 0 5.02 5.8V9.1a7.3 7.3 0 0 0 4.3 1.38V7.4a4.3 4.3 0 0 1-4.3-4.4z" },
  whatsapp: { name: "WhatsApp", path: "M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.16-1.5A9.9 9.9 0 1 0 12.04 2zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.06.89.9-2.98-.2-.31a8.2 8.2 0 1 1 6.86 3.73zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.31-.02-.43l-.76-1.83c-.2-.48-.4-.41-.56-.42h-.47a.9.9 0 0 0-.66.31 2.77 2.77 0 0 0-.86 2.06 4.8 4.8 0 0 0 1 2.55 11 11 0 0 0 4.2 3.7c1.56.68 2.18.73 2.96.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28z" },
  behance: { name: "Behance", path: "M8.6 11.3c.9-.43 1.38-1.1 1.38-2.15 0-2.07-1.55-2.58-3.33-2.58H1.8v11.3h5c1.88 0 3.64-.9 3.64-2.99 0-1.29-.61-2.25-1.84-2.58zM4.06 8.5h2.12c.82 0 1.55.23 1.55 1.17 0 .87-.57 1.22-1.38 1.22H4.06zm2.42 7.45H4.06v-3.1H6.5c.99 0 1.62.41 1.62 1.47 0 1.03-.75 1.63-1.64 1.63zM21.9 13.6c0-2.43-1.42-4.45-3.98-4.45-2.48 0-4.17 1.87-4.17 4.32 0 2.54 1.6 4.28 4.17 4.28 1.94 0 3.2-.88 3.8-2.74h-1.97c-.21.7-1.09 1.06-1.77 1.06-1.32 0-2-.77-2-2.08h5.88c.02-.13.03-.26.03-.4zm-5.9-1.02c.07-1.07.78-1.75 1.86-1.75 1.13 0 1.7.67 1.8 1.75zM15.2 7.36h4.6v1.12h-4.6z" },
  dribbble: { name: "Dribbble", path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.6 4.6a8.5 8.5 0 0 1 1.9 5.3 19.8 19.8 0 0 0-5.9-.3l-.48-1.15c2.07-.85 3.6-2 4.48-3.85zM12 3.5c2.15 0 4.1.8 5.6 2.1-.78 1.62-2.2 2.65-4.1 3.38A35 35 0 0 0 10.45 3.6c.5-.07 1.02-.1 1.55-.1zm-3.17.6a42 42 0 0 1 3.07 5.33A30 30 0 0 1 3.7 10.6a8.5 8.5 0 0 1 5.13-6.5zM3.5 12.1v-.04c3.07.05 6.07-.42 9.06-1.4.16.3.3.61.45.92a14.3 14.3 0 0 0-7.58 6.03A8.5 8.5 0 0 1 3.5 12.1zm3.1 6.6a12.8 12.8 0 0 1 6.98-5.6c.85 2.2 1.47 4.5 1.86 6.85A8.5 8.5 0 0 1 6.6 18.7zm10.3.6a35 35 0 0 0-1.73-6.38c1.8-.25 3.66-.12 5.4.34a8.5 8.5 0 0 1-3.67 6.04z" },
  github: { name: "GitHub", path: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z" },
}

/** Only real https profile links are shown. */
function profileUrl(link: SocialLink) {
  try {
    const url = new URL(link.url.trim())
    return url.protocol === "https:" ? url : null
  } catch {
    return null
  }
}

/** "@miduva" style handle from the label, or derived from the profile path. */
function handle(link: SocialLink, url: URL) {
  if (link.label?.trim()) return link.label.trim()
  const last = url.pathname.split("/").filter(Boolean).pop()
  return last ? `@${decodeURIComponent(last).replace(/^@/, "")}` : url.hostname.replace(/^www\./, "")
}

export default function SocialSection({ data }: { data?: SocialData }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useFrameInView(ref, { once: true, margin: "-60px" })

  const eyebrow = data?.eyebrow ?? "/ follow along"
  const headline = data?.headline ?? "See how we build"
  const headlineAccent = data?.headlineAccent ?? "growth systems."
  const body = data?.body ?? ""
  const links = (data?.links ?? [])
    .map((link, index) => ({ link, index, url: profileUrl(link) }))
    .filter((entry): entry is { link: SocialLink; index: number; url: URL } => !!entry.url && entry.link.platform in PLATFORMS)

  // Nothing to show until at least one profile link is filled in.
  if (links.length === 0) return null

  return (
    <section id="social" className="relative overflow-hidden" style={{ background: "var(--paper)" }}>
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(43,200,183,0.25), transparent)" }} />
      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-2xl text-center mb-10 md:mb-12">
          <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-3" data-edit-path="eyebrow">{eyebrow}</div>
          <h2 className="text-[34px] md:text-[52px] font-extrabold tracking-[-0.04em] leading-[1.05] text-[var(--navy-900)]" data-edit-path="headline">
            {headline}{" "}
            <span className="shine" data-edit-path="headlineAccent">{headlineAccent}</span>
          </h2>
          {body && <p className="mt-4 text-[15px] md:text-[17px] leading-[1.6] text-[var(--muted)]" data-edit-path="body">{body}</p>}
        </div>

        <ul className={`grid gap-4 ${links.length >= 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : links.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"}`}>
          {links.map(({ link, index, url }, i) => {
            const platform = PLATFORMS[link.platform]
            return (
              <motion.li
                key={`${link.platform}-${index}`}
                data-edit-path={`links.${index}`}
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: 0.5, delay: 0.06 + i * 0.06, ease: [0.32, 0.72, 0, 1] }}
              >
                <a
                  href={url.toString()}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="group flex h-full items-center gap-4 rounded-[20px] border border-[var(--line)] bg-[var(--card)] p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[rgba(43,200,183,0.4)] hover:shadow-[0_0_40px_rgba(43,200,183,0.08)]"
                  aria-label={`Miduva on ${platform.name} (opens in a new tab)`}
                >
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[rgba(43,200,183,0.1)] text-[var(--teal-500)] ring-1 ring-[rgba(43,200,183,0.25)] transition-colors group-hover:bg-[var(--teal-500)] group-hover:text-[#04121F]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d={platform.path} /></svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold tracking-[-0.01em] text-[var(--ink)]">{platform.name}</span>
                    <span className="block truncate text-[13px] text-[var(--muted)]">{handle(link, url)}</span>
                  </span>
                  <span aria-hidden className="text-[var(--muted)] transition-colors group-hover:text-[var(--teal-500)]">↗</span>
                </a>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
