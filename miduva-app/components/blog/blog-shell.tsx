"use client"

import { useRef, type ReactNode } from "react"
import Nav from "@/components/nav"
import { CinematicFooter } from "@/components/ui/motion-footer"
import { FrameRuntimeProvider } from "@/components/puck/frame-runtime"
import type { SiteChrome } from "@/lib/blog-chrome"

/** The landing page's nav and footer around blog content, in the site's dark theme. */
export function BlogShell({ chrome, children }: { chrome: SiteChrome; children: ReactNode }) {
  const navRef = useRef<HTMLElement>(null)
  return (
    <FrameRuntimeProvider className="relative min-h-screen overflow-x-clip">
      <Nav ref={navRef} theme="dark" data={chrome.nav} branding={chrome.branding} homeHref="/" />
      <main style={{ background: "var(--paper)" }}>{children}</main>
      <CinematicFooter data={chrome.footer} />
    </FrameRuntimeProvider>
  )
}
