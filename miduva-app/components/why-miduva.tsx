"use client"

import { useRef } from "react"
import { motion } from "motion/react"
import type { WhyMiduvaData, DifferentiatorCard as DiffCardData } from "@/lib/types"
import { useFrameInView } from "@/components/puck/frame-runtime"

/* ═══════════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════════ */

type DiffDisplay = DiffCardData & { grid: string }

const GRID_CLASSES = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-12",
]

const DEFAULT_DIFFERENTIATORS: DiffDisplay[] = [
  {
    id: "custom",
    num: "01",
    title: "Custom Solutions",
    subtitle: "Tailored architecture",
    oldWay: "cookie-cutter packages",
    newWay: "systems built around your business",
    grid: GRID_CLASSES[0],
  },
  {
    id: "data",
    num: "02",
    title: "Data-Driven Decisions",
    subtitle: "Quantified strategy",
    oldWay: "gut-feel strategy",
    newWay: "every move backed by real numbers",
    grid: GRID_CLASSES[1],
  },
  {
    id: "ai",
    num: "03",
    title: "AI-Powered Systems",
    subtitle: "Intelligent automation",
    oldWay: "manual, repetitive tasks",
    newWay: "AI agents running the heavy lifting",
    grid: GRID_CLASSES[2],
  },
  {
    id: "roi",
    num: "04",
    title: "Focus on ROI",
    subtitle: "Revenue-first metrics",
    oldWay: "vanity metrics and reports",
    newWay: "revenue impact, measured and proven",
    grid: GRID_CLASSES[3],
  },
]

/* ═══════════════════════════════════════════════════════════════════════════════
   ULTRA-THIN CUSTOM ICONS
   ═══════════════════════════════════════════════════════════════════════════════ */

function IconLayers({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 12l10 5 10-5" />
      <path d="M2 17l10 5 10-5" />
    </svg>
  )
}

function IconChart({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  )
}

function IconChip({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <path d="M6 10H3M6 14H3" />
      <path d="M21 10h-3M21 14h-3" />
      <path d="M10 6V3M14 6V3" />
      <path d="M10 21v-3M14 21v-3" />
    </svg>
  )
}

function IconDollar({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v12" />
      <path d="M15 9.5c0-.8-.7-1.5-1.5-1.5H11c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5h2c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5H11c-.8 0-1.5-.7-1.5-1.5" />
    </svg>
  )
}

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  custom: IconLayers,
  data:   IconChart,
  ai:     IconChip,
  roi:    IconDollar,
}

const EASE_FLUID  = [0.32, 0.72, 0, 1] as const
const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const

/* ═══════════════════════════════════════════════════════════════════════════════
   DIFFERENTIATOR CARD
   ═══════════════════════════════════════════════════════════════════════════════ */

function DifferentiatorCard({
  diff,
  index,
  isParentInView,
  wideStatValue,
  wideStatLabel,
}: {
  diff: DiffDisplay
  index: number
  isParentInView: boolean
  wideStatValue: string
  wideStatLabel: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useFrameInView(cardRef, { once: true, margin: "-60px" })

  const Icon   = ICONS[diff.id] ?? IconLayers
  const isWide = diff.grid.includes("col-span-12")

  return (
    <motion.div
      ref={cardRef}
      data-edit-path={`differentiators.${index}`}
      data-miduva-native-id={`differentiator:${diff.id}`}
      className={`${diff.grid} group relative overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--card)] shadow-[0_1px_2px_rgba(15,35,73,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(43,200,183,0.35)] hover:shadow-[0_0_40px_rgba(43,200,183,0.06)]`}
      initial={{ opacity: 0, y: 18 }}
      animate={isParentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.55, delay: 0.08 + index * 0.055, ease: EASE_FLUID }}
    >
      <div className={`relative z-10 h-full flex flex-col ${isWide ? "md:flex-row md:items-center md:justify-between md:gap-10" : ""} p-6 md:p-8`}>
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl ring-1 ring-[var(--line)] bg-[var(--chip)] flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:ring-teal-500/30 group-hover:bg-teal-500/10">
              <Icon className="w-[18px] h-[18px] text-[var(--teal-500)]" />
            </div>
            <span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
              {diff.subtitle}
            </span>
          </div>

          <h3 className="text-[clamp(18px,1.8vw,24px)] font-extrabold tracking-[-0.03em] leading-[1.15] mb-3 text-[var(--ink)]">
            {diff.title}
          </h3>

          <div className="h-[2px] rounded-full overflow-hidden mb-5 max-w-[120px] bg-[var(--line)]">
            <motion.div
              className="h-full bg-[var(--teal-500)] rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.2, delay: 0.3 + index * 0.08, ease: EASE_SMOOTH }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] line-through leading-relaxed text-[var(--muted)] decoration-[var(--muted)]/40">
              {diff.oldWay}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--teal-500)]/60 mono">↓</span>
              <span className="text-[14px] font-semibold text-[var(--teal-500)] leading-relaxed">{diff.newWay}</span>
            </div>
          </div>
        </div>

        {/* Wide card stat — full-width band on mobile, inline cluster on desktop. */}
        {isWide && (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6 md:flex-shrink-0 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-[var(--line)]">
            <div className="flex items-end gap-[5px] md:gap-[6px] h-12 md:h-14 flex-1 md:flex-none">
              {[32, 48, 40, 64, 72, 56, 80, 88, 76, 92, 84, 96].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 md:flex-none md:w-[6px] rounded-full bg-teal-500/25 origin-bottom"
                  style={{ height: `${h}%` }}
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.04, ease: EASE_SMOOTH }}
                />
              ))}
            </div>
            <div className="flex items-baseline justify-between gap-3 md:block md:text-right">
              <div className="text-[32px] md:text-[36px] font-extrabold tracking-[-0.04em] leading-none text-[var(--navy-900)]" data-edit-path="wideStatValue">
                {wideStatValue}
              </div>
              <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] md:mt-1" data-edit-path="wideStatLabel">
                {wideStatLabel}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ambient number */}
      <div
        aria-hidden
        className="absolute bottom-[-12px] right-3 md:bottom-[-16px] text-[clamp(60px,9vw,120px)] font-extrabold leading-none tracking-[-0.06em] pointer-events-none select-none mono text-[var(--ink)]/[0.04]"
      >
        {diff.num}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function WhyMiduva({ data }: { data?: WhyMiduvaData }) {
  const eyebrow = data?.eyebrow ?? "/ why miduva"
  const wideStatValue = data?.wideStatValue ?? "4.8×"
  const wideStatLabel = data?.wideStatLabel ?? "Avg. ROAS"
  const phrases = [
    { text: data?.statementLead ?? "We don't sell", dim: false, shine: false, strike: false },
    { text: data?.statementOldWay ?? "services.", dim: true, shine: false, strike: true },
    { text: data?.statementBridge ?? "We build", dim: false, shine: false, strike: false },
    { text: data?.statementAccent ?? "systems", dim: false, shine: true, strike: false },
    { text: data?.statementTail ?? "designed to grow your business.", dim: false, shine: false, strike: false },
  ]

  const differentiators: DiffDisplay[] = data?.differentiators?.length
    ? data.differentiators.map((d, i) => ({ ...d, grid: GRID_CLASSES[i] ?? "md:col-span-6" }))
    : DEFAULT_DIFFERENTIATORS

  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView   = useFrameInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section id="why-miduva" className="relative overflow-hidden" style={{ background: "var(--paper)" }}>
      {/* Top hairline */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(43,200,183,0.25), transparent)" }} />

      {/* Ambient glow */}
      <div aria-hidden className="absolute -top-[120px] -left-[120px] w-[560px] h-[560px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(43,200,183,0.07) 0%, transparent 60%)", filter: "blur(80px)" }} />

      <div ref={sectionRef} className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Header */}
        <motion.div
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.55, ease: EASE_FLUID }}
        >
          <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-3" data-edit-path="eyebrow">
            {eyebrow}
          </div>
          <h2
            className="text-[34px] md:text-[52px] font-extrabold tracking-[-0.04em] leading-[1.05] text-[var(--navy-900)] max-w-4xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {phrases.map((phrase, i) => (
              <span
                key={i}
                className={`relative inline mr-[0.28em] ${phrase.shine ? "shine" : ""}`}
                style={phrase.dim ? { color: "var(--muted)", opacity: 0.6 } : undefined}
                data-edit-path={['statementLead', 'statementOldWay', 'statementBridge', 'statementAccent', 'statementTail'][i]}
              >
                {phrase.text}
                {phrase.strike && (
                  <motion.span
                    aria-hidden
                    className="absolute left-0 right-0 top-[54%] h-[2px] origin-left bg-[var(--muted)]"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.5, delay: 0.4, ease: EASE_SMOOTH }}
                  />
                )}
              </span>
            ))}
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {differentiators.map((d, i) => (
            <DifferentiatorCard
              key={d.id}
              diff={d}
              index={i}
              isParentInView={isInView}
              wideStatValue={wideStatValue}
              wideStatLabel={wideStatLabel}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
