"use client"

import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { createPortal } from "react-dom"
import { useFrameRuntime } from "@/components/puck/frame-runtime"
import { trackLead } from "@/lib/analytics"

export type LeadModalKind = "rfp" | "talk"

// Hero buttons whose href is one of these open the matching modal instead of
// navigating. Editors can repoint the buttons elsewhere in the site editor.
export const LEAD_MODAL_HREFS: Record<string, LeadModalKind> = {
  "#rfp": "rfp",
  "#lets-talk": "talk",
}

const COPY: Record<LeadModalKind, { title: string; subtitle: string }> = {
  rfp: {
    title: "Request for Proposal",
    subtitle: "Looking for a growth team to take part in your selection process?",
  },
  talk: {
    title: "Let's talk about better results.",
    subtitle: "If you're ready to grow your business, we're ready to be your partner.",
  },
}

export const BUDGET_OPTIONS = [
  "Under $750",
  "$750 to $1,500",
  "$1,500 to $5,000",
  "$5,000 to $10,000",
  "$10,000 to $25,000",
  "$25,000 to $50,000",
  "Above $50,000",
]

type Status = "idle" | "submitting" | "submitted" | "invalid" | "error"

export function LeadModal({ kind, onClose }: { kind: LeadModalKind | null; onClose: () => void }) {
  const runtime = useFrameRuntime()
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>("idle")

  useEffect(() => {
    // Resolve the document from the rendered field so this works inside the
    // site editor's preview iframe as well as on the live page.
    const doc = firstFieldRef.current?.ownerDocument
    if (!doc) return
    const body = doc.body
    const previousOverflow = body.style.overflow
    body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    doc.addEventListener("keydown", onKey)
    firstFieldRef.current?.focus()
    return () => {
      body.style.overflow = previousOverflow
      doc.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  if (!kind) return null
  const target = runtime?.document.body ?? (typeof document !== "undefined" ? document.body : null)
  if (!target) return null

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const value = (key: string) => String(form.get(key) ?? "").trim()
    setStatus("submitting")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: kind,
          name: `${value("firstName")} ${value("lastName")}`.trim(),
          email: value("email"),
          website: value("website"),
          budget: value("budget"),
          phone: value("phone"),
        }),
      })
      if (res.ok) {
        setStatus("submitted")
        trackLead(kind === "rfp" ? "hero-rfp" : "hero-lets-talk")
      } else {
        setStatus(res.status === 400 ? "invalid" : "error")
      }
    } catch {
      setStatus("error")
    }
  }

  const { title, subtitle } = COPY[kind]

  return createPortal(
    <div className="lead-modal" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="lead-modal__panel" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
        <button type="button" className="lead-modal__close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/miduva-logo-white.png" alt="Miduva" className="lead-modal__logo" />
        <h2 id="lead-modal-title" className="lead-modal__title">{title}</h2>
        <p className="lead-modal__subtitle">{subtitle}</p>

        {status === "submitted" ? (
          <p className="lead-modal__done" role="status">Thanks — we&rsquo;ll be in touch within one business day to book your call.</p>
        ) : (
          <form className="lead-modal__form" onSubmit={onSubmit} noValidate={false}>
            <input ref={firstFieldRef} name="firstName" placeholder="First Name" autoComplete="given-name" required maxLength={80} />
            <input name="lastName" placeholder="Last Name" autoComplete="family-name" maxLength={80} />
            <input name="email" type="email" placeholder="Email" autoComplete="email" required maxLength={254} />
            <input name="website" type="text" inputMode="url" placeholder="Website URL?" autoComplete="url" maxLength={200} />
            <select name="budget" defaultValue="" required>
              <option value="" disabled>Monthly Marketing Budget</option>
              {BUDGET_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <input name="phone" type="tel" placeholder="Phone" autoComplete="tel" maxLength={40} />

            <p className="lead-modal__consent">
              By clicking the button below, you agree that Miduva may contact you by email or phone about your request. See our <a href="/privacy">Privacy Policy</a>.
            </p>
            {status === "invalid" && <p className="lead-modal__error" role="alert">Please check your name and email and try again.</p>}
            {status === "error" && <p className="lead-modal__error" role="alert">Something went wrong. Please try again in a moment.</p>}
            <button type="submit" className="lead-modal__submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Book a call"}
            </button>
          </form>
        )}
      </div>

      <style>{`
        .lead-modal {
          position: fixed; inset: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          padding: 24px 16px;
          background: rgba(2, 4, 12, 0.78);
          backdrop-filter: blur(4px);
          overflow-y: auto;
        }
        .lead-modal__panel {
          position: relative;
          width: min(100%, 900px);
          margin: auto;
          padding: clamp(32px, 5vw, 56px) clamp(20px, 4vw, 40px) clamp(28px, 4vw, 40px);
          background: #0b1224;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          text-align: center;
          font-family: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif;
        }
        .lead-modal__close {
          position: absolute; top: 0; right: 0;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.8);
          border: 0; cursor: pointer;
        }
        .lead-modal__close:hover { color: #fff; background: rgba(255, 255, 255, 0.12); }
        .lead-modal__logo { height: 34px; width: auto; margin: 0 auto 24px; }
        .lead-modal__title { font-size: clamp(24px, 3vw, 34px); font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; }
        .lead-modal__subtitle { margin: 14px auto 0; max-width: 34em; font-size: 16px; color: rgba(255, 255, 255, 0.72); }
        .lead-modal__form {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
          margin-top: 36px; text-align: left;
        }
        .lead-modal__form input,
        .lead-modal__form select {
          width: 100%; height: 50px; padding: 0 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 0;
          color: #fff; font: inherit; font-size: 15px;
          outline: none;
        }
        .lead-modal__form select { appearance: none; color: rgba(255, 255, 255, 0.9); }
        .lead-modal__form select:invalid { color: rgba(255, 255, 255, 0.5); }
        .lead-modal__form select option { color: #0b1224; }
        .lead-modal__form input::placeholder { color: rgba(255, 255, 255, 0.5); }
        .lead-modal__form input:focus,
        .lead-modal__form select:focus { border-color: #0066ff; }
        .lead-modal__consent,
        .lead-modal__error { grid-column: 1 / -1; font-size: 12px; line-height: 1.5; color: rgba(255, 255, 255, 0.5); }
        .lead-modal__consent a { text-decoration: underline; }
        .lead-modal__error { color: #ff8a8a; font-size: 14px; }
        .lead-modal__submit {
          grid-column: 2; justify-self: end;
          padding: 16px 40px;
          background: #0066ff; border: 1px solid #0066ff; border-radius: 0;
          color: #fff; font: inherit; font-size: 17px; cursor: pointer;
          transition: background-color 0.18s ease;
        }
        .lead-modal__submit:hover { background: #1f7bff; }
        .lead-modal__submit:disabled { opacity: 0.6; cursor: wait; }
        .lead-modal__done { margin-top: 32px; font-size: 17px; color: rgba(255, 255, 255, 0.85); }
        @media (max-width: 640px) {
          .lead-modal__form { grid-template-columns: 1fr; gap: 12px; }
          .lead-modal__submit { grid-column: 1; justify-self: stretch; }
        }
      `}</style>
    </div>,
    target,
  )
}
