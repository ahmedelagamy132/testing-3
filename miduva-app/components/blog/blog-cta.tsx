"use client"

import { useCallback, useState, type ReactNode } from "react"
import { LeadModal, type LeadModalKind } from "@/components/lead-modal"

/** Square button in the hero's style that opens the RFP / Let's talk lead form. */
export function LeadButton({ kind, variant, children, className = "" }: { kind: LeadModalKind; variant: "solid" | "outline"; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`site-btn ${variant === "solid" ? "site-btn--solid" : "site-btn--outline"} ${className}`}>
        {children}
      </button>
      {open && <LeadModal kind={kind} onClose={close} />}
    </>
  )
}

/** Full-width call to action between post rows and under articles. */
export function CtaBand() {
  return (
    <section className="relative overflow-hidden rounded-[24px] p-px shadow-[0_30px_80px_-30px_rgba(43,200,183,0.35)]" style={{ background: "linear-gradient(135deg, rgba(43,200,183,0.65) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.04) 65%, rgba(43,200,183,0.35) 100%)" }}>
      <div className="relative overflow-hidden rounded-[23px] px-6 py-10 md:px-12 md:py-12" style={{ background: "linear-gradient(140deg, #0B1A34 0%, #060F20 60%, #030812 100%)" }}>
        <div aria-hidden className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(43,200,183,0.20) 0%, transparent 65%)", filter: "blur(60px)" }} />
        <div className="relative grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <div className="mono text-[12px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-3">/ work with miduva</div>
            <p className="text-[28px] md:text-[40px] font-extrabold tracking-[-0.04em] leading-[1.05] text-white">
              Reading is step one.<br /><span className="shine">Let&rsquo;s build the system.</span>
            </p>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.6] text-white/60">
              Ads, funnels, automation and data — engineered around your business and owned by you.
            </p>
          </div>
          <div className="md:col-span-5 flex flex-col-reverse gap-3 sm:flex-row md:justify-end">
            <LeadButton kind="rfp" variant="outline">RFP</LeadButton>
            <LeadButton kind="talk" variant="solid">Let&rsquo;s talk!</LeadButton>
          </div>
        </div>
      </div>
    </section>
  )
}

const BENEFITS = [
  "Get found on Google and AI search",
  "Ads that attract ready buyers",
  "Funnels built to convert",
  "Automation that follows up for you",
]

/** Sidebar lead card on article pages. */
export function SidebarLeadCard() {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[rgba(43,200,183,0.3)] bg-[var(--card)] p-6">
      <div aria-hidden className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(43,200,183,0.18) 0%, transparent 65%)", filter: "blur(30px)" }} />
      <div className="relative">
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--teal-500)]">Free strategy call</div>
        <p className="mt-2 text-[20px] font-extrabold tracking-[-0.03em] leading-[1.2] text-[var(--ink)]">Let&rsquo;s grow your business</p>
        <ul className="mt-4 space-y-2.5">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[13.5px] leading-[1.45] text-[var(--navy-700)]">
              <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-[rgba(43,200,183,0.14)] text-[var(--teal-500)] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              {b}
            </li>
          ))}
        </ul>
        <LeadButton kind="talk" variant="solid" className="mt-6 w-full">Let&rsquo;s talk!</LeadButton>
        <LeadButton kind="rfp" variant="outline" className="mt-2.5 w-full">Request a proposal</LeadButton>
      </div>
    </div>
  )
}
