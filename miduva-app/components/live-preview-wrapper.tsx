"use client"

import { useCallback, useEffect, useState } from "react"
import { useLivePreview } from "@payloadcms/live-preview-react"
import { AppWrapper } from "@/components/app-wrapper"
import { transformLandingPage } from "@/payload/utils/transform-landing-page"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawDoc = Record<string, any>

interface Props {
  initialDoc: RawDoc | null
  serverURL: string
}

export function LivePreviewWrapper({ initialDoc, serverURL }: Props) {
  const { data } = useLivePreview<RawDoc>({
    initialData: initialDoc ?? {},
    serverURL,
    depth: 1,
  })

  const [focused, setFocused] = useState<string | null>(null)

  const applyFocus = useCallback((anchor: string | null) => {
    setFocused(anchor)
    if (typeof document === "undefined") return
    const body = document.body
    if (anchor) body.dataset.focusSection = anchor
    else delete body.dataset.focusSection

    if (!anchor) return
    const target = document.getElementById(`anchor-${anchor}`)
    if (!target) return

    // Wait one frame so the layout collapses before we scroll into view.
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    })
    target.classList.remove("preview-section-focus")
    void target.offsetWidth
    target.classList.add("preview-section-focus")
    window.setTimeout(() => target.classList.remove("preview-section-focus"), 2400)
  }, [])

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const payload = event.data
      if (!payload || payload.type !== "miduva:focus-section") return
      const anchor = payload.anchor as string | undefined
      if (!anchor) return
      applyFocus(anchor)
    }

    window.addEventListener("message", handler)

    // Tell the parent admin window we're ready to receive focus messages.
    // The tab-watcher will reply with the current selected tab's anchor, fixing the
    // race where the parent fires "focus-section" before this listener is mounted.
    const announce = () => {
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: "miduva:preview-ready" }, "*")
        }
      } catch {
        /* cross-origin, give up — the parent's poll/load fallbacks will catch us */
      }
    }
    announce()
    // Re-announce a couple of times in case the parent's listener hasn't mounted yet.
    const t1 = window.setTimeout(announce, 250)
    const t2 = window.setTimeout(announce, 1000)

    return () => {
      window.removeEventListener("message", handler)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      if (typeof document !== "undefined") delete document.body.dataset.focusSection
    }
  }, [applyFocus])

  return (
    <>
      <AppWrapper data={transformLandingPage(data)} />
      {focused && (
        <button
          type="button"
          onClick={() => applyFocus(null)}
          className="preview-focus-exit"
          aria-label="Show full page"
        >
          <span className="preview-focus-exit__dot" aria-hidden />
          Editing <strong>{focused.replace(/-/g, " ")}</strong>
          <span className="preview-focus-exit__cta">Show full page</span>
        </button>
      )}
    </>
  )
}
