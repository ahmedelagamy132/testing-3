"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useLivePreview } from "@payloadcms/live-preview-react"
import { AppWrapper } from "@/components/app-wrapper"
import { transformLandingPage } from "@/payload/utils/transform-landing-page"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawDoc = Record<string, any>

interface Props {
  initialDoc: RawDoc | null
  serverURL: string
}

// The public site is designed for a desktop viewport. Two cases:
//   • viewport < 1440: render the site inside a fixed 1440px box and scale
//     the box down so the desktop layout stays intact (the site root uses
//     `overflow-x-clip`, so without this the right edge of every section is
//     silently cut off).
//   • viewport ≥ 1440: don't constrain. Let the site render at the popup's
//     natural width — its own `max-w-*` containers center the content.
//     If we instead pinned the inner to 1440, everything past 1440 would
//     be visible empty space on the right.
const DESIGN_WIDTH = 1440

function PreviewScaler({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [needsScaling, setNeedsScaling] = useState(false)
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const recompute = () => {
      const available = outer.clientWidth
      if (available >= DESIGN_WIDTH) {
        setNeedsScaling(false)
        setScale(1)
        setScaledHeight(undefined)
        return
      }
      const next = available / DESIGN_WIDTH
      setNeedsScaling(true)
      setScale(next)
      setScaledHeight(inner.scrollHeight * next)
    }

    recompute()

    const ro = new ResizeObserver(recompute)
    ro.observe(outer)
    ro.observe(inner)
    window.addEventListener("resize", recompute)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", recompute)
    }
  }, [])

  return (
    <div
      ref={outerRef}
      style={{
        width: "100%",
        overflow: needsScaling ? "hidden" : "visible",
        height: needsScaling ? scaledHeight : undefined,
      }}
    >
      <div
        ref={innerRef}
        style={
          needsScaling
            ? {
                width: DESIGN_WIDTH,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }
            : { width: "100%" }
        }
      >
        {children}
      </div>
    </div>
  )
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
      const anchor = payload.anchor as string | null | undefined
      // null/empty anchor means "exit focus mode and show the whole page".
      if (anchor === null || anchor === undefined || anchor === "") {
        applyFocus(null)
        return
      }
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
      <PreviewScaler>
        <AppWrapper data={transformLandingPage(data)} />
      </PreviewScaler>
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
