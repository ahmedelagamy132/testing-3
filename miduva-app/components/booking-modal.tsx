"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useFrameRuntime } from "@/components/puck/frame-runtime"
import { trackLead } from "@/lib/analytics"

/** Only https booking pages are embedded. */
export function safeBookingUrl(value?: string) {
  if (!value) return null
  try {
    const url = new URL(value.trim())
    return url.protocol === "https:" ? url : null
  } catch {
    return null
  }
}

/** Adds each provider's embed parameters so the page fits the popup and the site's dark theme. */
function embedUrl(url: URL) {
  const out = new URL(url)
  if (/(^|\.)cal\.com$/.test(out.hostname)) {
    out.searchParams.set("embed", "true")
    out.searchParams.set("theme", "dark")
    if (!out.searchParams.has("layout")) out.searchParams.set("layout", "month_view")
  } else if (/(^|\.)calendly\.com$/.test(out.hostname)) {
    out.searchParams.set("embed_type", "Inline")
    out.searchParams.set("embed_domain", typeof window !== "undefined" ? window.location.hostname : "miduva.com")
    out.searchParams.set("hide_gdpr_banner", "1")
    out.searchParams.set("background_color", "060e1e")
    out.searchParams.set("text_color", "f0f4ff")
    out.searchParams.set("primary_color", "2bc8b7")
  }
  return out.toString()
}

export function BookingModal({ url, onClose }: { url: URL; onClose: () => void }) {
  const runtime = useFrameRuntime()
  const closeRef = useRef<HTMLButtonElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const doc = closeRef.current?.ownerDocument
    if (!doc) return
    const body = doc.body
    const previous = body.style.overflow
    body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    doc.addEventListener("keydown", onKey)
    closeRef.current?.focus()
    trackLead("booking-calendar-opened")
    return () => {
      body.style.overflow = previous
      doc.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  const target = runtime?.document.body ?? (typeof document !== "undefined" ? document.body : null)
  if (!target) return null

  return createPortal(
    <div className="booking-modal" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="booking-modal__panel" role="dialog" aria-modal="true" aria-label="Book a free strategy call">
        <div className="booking-modal__bar">
          <span className="mono">Book a free strategy call</span>
          <div className="booking-modal__actions">
            <a href={url.toString()} target="_blank" rel="noopener noreferrer">Open in new tab ↗</a>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
        </div>
        <div className="booking-modal__frame">
          {!loaded && <div className="booking-modal__loading mono" aria-hidden>Loading calendar…</div>}
          <iframe src={embedUrl(url)} title="Booking calendar" onLoad={() => setLoaded(true)} allow="payment" />
        </div>
      </div>

      <style>{`
        .booking-modal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px 16px; background: rgba(2, 4, 12, 0.8); backdrop-filter: blur(4px); }
        .booking-modal__panel { display: flex; flex-direction: column; width: min(100%, 1040px); height: min(100%, 760px); overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; background: #060e1e; box-shadow: 0 40px 100px -30px rgba(0, 0, 0, 0.8); }
        .booking-modal__bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 10px 10px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
        .booking-modal__bar > span { color: #2bc8b7; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; }
        .booking-modal__actions { display: flex; align-items: center; gap: 6px; }
        .booking-modal__actions a { padding: 8px 12px; border-radius: 8px; color: rgba(240, 244, 255, 0.7); font-size: 13px; }
        .booking-modal__actions a:hover { color: #fff; background: rgba(255, 255, 255, 0.06); }
        .booking-modal__actions button { display: flex; width: 36px; height: 36px; align-items: center; justify-content: center; border: 0; border-radius: 8px; background: rgba(255, 255, 255, 0.06); color: rgba(240, 244, 255, 0.85); cursor: pointer; }
        .booking-modal__actions button:hover { background: rgba(255, 255, 255, 0.12); color: #fff; }
        .booking-modal__frame { position: relative; flex: 1; }
        .booking-modal__frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; background: transparent; }
        .booking-modal__loading { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: rgba(240, 244, 255, 0.5); font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; }
        @media (max-width: 640px) {
          .booking-modal { padding: 0; }
          .booking-modal__panel { width: 100%; height: 100%; border-radius: 0; border: 0; }
          .booking-modal__actions a { display: none; }
        }
      `}</style>
    </div>,
    target,
  )
}
