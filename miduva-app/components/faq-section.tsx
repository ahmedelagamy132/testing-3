"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "motion/react"
import { ChevronDown } from "lucide-react"
import type { FaqData, FaqItem } from "@/lib/types"

function useIsDark() {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return isDark
}

const EASE_FLUID  = [0.32, 0.72, 0, 1] as const
const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const

const DEFAULT_FAQ: FaqItem[] = [
  {
    id: "different",
    num: "01",
    question: "How is Miduva different from a traditional marketing agency?",
    answer:
      "Traditional agencies sell services: ad management, email sequences, content calendars. Miduva builds the infrastructure those services run on. We design a complete acquisition and conversion system, wire it together across your channels, and hand it to you fully owned. When the engagement ends, the system keeps running without us.",
  },
  {
    id: "specialize",
    num: "02",
    question: "Do you work with any business, or do you specialize?",
    answer:
      "We work best with B2B SaaS companies and DTC brands generating between $1M and $30M in annual revenue. At that stage, there's enough volume to optimize against and enough complexity to warrant a system. Earlier-stage companies often need a different approach, and we'll say so upfront rather than take the engagement.",
  },
  {
    id: "first30",
    num: "03",
    question: "What does the first 30 days actually look like?",
    answer:
      "We start with a full audit: current channels, funnel performance, conversion rates, and attribution. In week two, you receive a system blueprint, a prioritized roadmap, and the baseline KPIs we'll measure against. By day 30, the first components are live and generating real data. No 90-day ramp-up periods.",
  },
  {
    id: "timeline",
    num: "04",
    question: "How quickly will I see results?",
    answer:
      "Most clients see measurable changes within 30 to 60 days. Meaningful ROI, the kind you'd present in a board meeting, typically lands in the 60 to 90 day window as the system compounds. We put these expectations in writing before we start, not after a quarter passes.",
  },
  {
    id: "performance",
    num: "05",
    question: "What if the system doesn't perform?",
    answer:
      "We build in checkpoints at 30, 60, and 90 days. If a component isn't hitting its benchmark, we diagnose and rebuild it, not add more budget to something broken. Every system ships with defined success criteria, and we hold ourselves to those, not to billable-hour targets.",
  },
  {
    id: "budget",
    num: "06",
    question: "Do I need a large budget to get started?",
    answer:
      "We don't have a fixed minimum, but we do require an existing audience or traffic source to work with. Cold-start growth from zero is a different playbook. If you're already generating leads or revenue and want to systematize and scale, we're likely a strong fit.",
  },
  {
    id: "team",
    num: "07",
    question: "Will I need to hire a team to manage what you build?",
    answer:
      "No. Operational independence is a design constraint on every system we build. It should run with minimal ongoing management from your side. We document everything, train your team on the parts that matter, and design for the scenario where we're no longer involved.",
  },
  {
    id: "ownership",
    num: "08",
    question: "What does 'owned by you' mean in practice?",
    answer:
      "Every tool, account, campaign, and automation lives in your accounts from day one. No proprietary platforms, no locked dashboards, no client portal we control. If you want to bring operations in-house or hand the system to another team, you can. We have no lock-in incentive.",
  },
]

// ─── Single accordion item ───────────────────────────────────────────────────

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
  isDark,
  isInView,
  triggerRef,
  onKeyDown,
}: {
  item: FaqItem
  index: number
  isOpen: boolean
  onToggle: () => void
  isDark: boolean
  isInView: boolean
  triggerRef: (el: HTMLButtonElement | null) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.55, delay: 0.08 + index * 0.055, ease: EASE_FLUID }}
    >
      {/* Separator: gradient teal on open, standard line on closed */}
      <div
        aria-hidden
        style={{
          height: 1,
          background: isOpen
            ? "linear-gradient(90deg, var(--teal-500), rgba(43,200,183,0.25), transparent)"
            : "var(--line)",
          transition: "background 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        id={`faq-trigger-${item.id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${item.id}`}
        onClick={onToggle}
        onKeyDown={onKeyDown}
        className="faq-trigger"
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 28px",
          gap: "0 14px",
          alignItems: "center",
          width: "100%",
          textAlign: "left",
          padding: "20px 0",
          cursor: "pointer",
          background: "none",
          border: "none",
        }}
      >
        {/* Number */}
        <span
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            lineHeight: 1,
            color: isOpen
              ? "var(--teal-500)"
              : isDark
              ? "rgba(255,255,255,0.18)"
              : "var(--muted)",
            transition: "color 0.3s ease",
            userSelect: "none",
            paddingTop: 2,
          }}
        >
          {item.num}
        </span>

        {/* Question */}
        <span
          style={{
            fontSize: "clamp(15px, 1.3vw, 17px)",
            fontWeight: isOpen ? 600 : 500,
            letterSpacing: "-0.01em",
            lineHeight: 1.45,
            color: isOpen
              ? isDark
                ? "rgba(255,255,255,0.95)"
                : "var(--ink)"
              : isDark
              ? "rgba(255,255,255,0.68)"
              : "var(--muted)",
            transition: "color 0.25s ease",
          }}
        >
          {item.question}
        </span>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE_SMOOTH }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: isOpen
              ? "var(--teal-500)"
              : isDark
              ? "rgba(255,255,255,0.28)"
              : "var(--muted)",
            transition: "color 0.3s ease",
            flexShrink: 0,
          }}
        >
          <ChevronDown size={16} strokeWidth={2} />
        </motion.span>
      </button>

      {/* Answer panel: grid-template-rows accordion (no height animation) */}
      <div
        role="region"
        id={`faq-panel-${item.id}`}
        aria-labelledby={`faq-trigger-${item.id}`}
        className="faq-answer-panel"
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.42s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              margin: 0,
              paddingLeft: 54,
              paddingBottom: 22,
              paddingTop: 2,
              fontSize: 15,
              lineHeight: 1.75,
              color: isDark ? "rgba(255,255,255,0.48)" : "var(--muted)",
              maxWidth: "68ch",
            }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function FaqSection({ data }: { data?: FaqData }) {
  const items = data?.items?.length ? data.items : DEFAULT_FAQ
  const [openId, setOpenId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })
  const isDark = useIsDark()
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleToggle = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id))

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const refs = triggerRefs.current
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        refs[(index + 1) % refs.length]?.focus()
        break
      case "ArrowUp":
        e.preventDefault()
        refs[(index - 1 + refs.length) % refs.length]?.focus()
        break
      case "Home":
        e.preventDefault()
        refs[0]?.focus()
        break
      case "End":
        e.preventDefault()
        refs[refs.length - 1]?.focus()
        break
    }
  }

  return (
    <section
      id="faq"
      style={{
        background: isDark ? "#020204" : "var(--paper)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top hairline */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(43,200,183,0.25), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(43,200,183,0.045) 0%, transparent 60%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        ref={sectionRef}
        className="relative z-10 max-w-4xl mx-auto px-6 py-14 md:py-28"
      >
        {/* Header */}
        <motion.div
          className="mb-8 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.55, ease: EASE_FLUID }}
        >
          <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-3">
            Common questions
          </div>
          <h2
            className={`text-[clamp(26px,3.2vw,40px)] font-extrabold tracking-[-0.04em] leading-[1.1] ${
              isDark ? "text-white" : "text-[var(--ink)]"
            }`}
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            What founders ask before they book.
          </h2>
          <p
            className="mt-3 leading-[1.65]"
            style={{
              fontSize: 15,
              color: isDark ? "rgba(255,255,255,0.40)" : "var(--muted)",
              maxWidth: "44ch",
            }}
          >
            If your question isn't here, it will be in the call.
          </p>
        </motion.div>

        {/* Accordion */}
        <div>
          {items.map((item, index) => (
            <AccordionItem
              key={item.id}
              item={item}
              index={index}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
              isDark={isDark}
              isInView={isInView}
              triggerRef={(el) => {
                triggerRefs.current[index] = el
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
          {/* Final separator */}
          <div aria-hidden style={{ height: 1, background: "var(--line)" }} />
        </div>
      </div>
    </section>
  )
}
