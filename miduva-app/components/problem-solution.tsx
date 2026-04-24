"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { XCircle, AlertTriangle } from "lucide-react"

const PROBLEMS = [
  {
    id: "ads",
    icon: "x" as const,
    label: "Problem 01",
    title: "Running ads with no results",
    detail: "Budget spent. Clicks arriving. Revenue nowhere.",
  },
  {
    id: "traffic",
    icon: "warn" as const,
    label: "Problem 02",
    title: "Getting traffic but no conversions",
    detail: "Visitors land and leave. Your funnel has a leak.",
  },
  {
    id: "leads",
    icon: "x" as const,
    label: "Problem 03",
    title: "Losing leads without follow-up",
    detail: "Hot prospects go cold. Nothing follows up automatically.",
  },
]

function ProblemCard({
  problem,
  index,
}: {
  problem: (typeof PROBLEMS)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.6, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col gap-4 rounded-[24px] border border-dashed border-amber-400/40 bg-[var(--card)] p-6 md:p-7 overflow-hidden"
      style={{
        boxShadow: "inset 0 0 0 1px rgba(251,191,36,0.10), 0 4px 24px -8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Amber radial tint */}
      <div
        className="absolute inset-0 rounded-[24px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 20% 0%, rgba(251,191,36,0.07) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      {/* Icon */}
      <div
        className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.22)" }}
      >
        {problem.icon === "x" ? (
          <XCircle style={{ width: 18, height: 18, color: "#fbbf24" }} strokeWidth={2} />
        ) : (
          <AlertTriangle style={{ width: 18, height: 18, color: "#fbbf24" }} strokeWidth={2} />
        )}
      </div>

      {/* Label */}
      <p className="relative z-10 mono text-[11px] uppercase tracking-[0.22em] text-amber-400/70">
        {problem.label}
      </p>

      {/* Title */}
      <h3 className="relative z-10 text-[18px] md:text-[20px] font-bold tracking-[-0.025em] leading-[1.25] text-[var(--muted)]">
        {problem.title}
      </h3>

      {/* Detail */}
      <p className="relative z-10 text-[13px] leading-[1.6] text-[var(--muted)]/70">
        {problem.detail}
      </p>

      {/* Bottom crack line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.25) 40%, rgba(239,68,68,0.20) 70%, transparent 100%)",
        }}
        aria-hidden
      />
    </motion.div>
  )
}

function PivotDivider({ isInView }: { isInView: boolean }) {
  return (
    <div className="relative flex items-center justify-center py-10 md:py-12 overflow-hidden">
      {/* Left arm */}
      <motion.div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, var(--line) 100%)", transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Center badge */}
      <motion.div
        className="relative mx-6 flex items-center gap-3 px-5 py-2.5 rounded-full border border-[var(--teal-500)]/30"
        style={{ background: "rgba(43,200,183,0.08)", backdropFilter: "blur(8px)" }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="flex items-center gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="text-[var(--teal-500)] text-[14px] font-bold leading-none"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, delay: i * 0.22, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          ))}
        </span>
        <span className="mono text-[12px] uppercase tracking-[0.22em] text-[var(--teal-500)] font-semibold">
          Instead
        </span>
        <span className="flex items-center gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="text-[var(--teal-500)] text-[14px] font-bold leading-none"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, delay: 0.66 + i * 0.22, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          ))}
        </span>
      </motion.div>

      {/* Right arm */}
      <motion.div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(90deg, var(--line) 0%, transparent 100%)", transformOrigin: "right" }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Glow bloom */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-16 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(43,200,183,0.12) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
        aria-hidden
      />
    </div>
  )
}

function SolutionCard({ isInView }: { isInView: boolean }) {
  const bullets = [
    "Ads that feed the funnel",
    "Funnels that convert",
    "Automation that closes",
  ]

  return (
    <motion.div
      className="relative w-full rounded-[24px] overflow-hidden grain"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: "#0F2349" }}
    >
      {/* Teal glow — top left */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(43,200,183,0.18) 0%, transparent 65%)",
          filter: "blur(48px)",
        }}
        aria-hidden
      />
      {/* Teal glow — bottom right */}
      <div
        className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(43,200,183,0.12) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 px-8 py-12 md:px-14 md:py-16 lg:px-20 lg:py-20 flex flex-col gap-6">
        {/* Label */}
        <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)]">
          / the solution
        </div>

        {/* Main statement */}
        <p className="text-[28px] md:text-[40px] lg:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.1] text-white max-w-4xl">
          We solve this by building{" "}
          <span className="shine">complete systems</span>
          {" "}—{" "}
          <span className="relative inline-block text-white/35">
            <span
              className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 pointer-events-none"
              style={{ background: "rgba(255,255,255,0.30)" }}
              aria-hidden
            />
            not isolated services.
          </span>
        </p>

        {/* Bullet points */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
          {bullets.map((point, i) => (
            <motion.div
              key={point}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -12 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
              transition={{ duration: 0.5, delay: 0.45 + i * 0.11, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--teal-500)" }}
              />
              <span className="text-[13px] font-medium text-white/60 tracking-tight">
                {point}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <div
          className="pt-4 flex items-center justify-between flex-wrap gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="mono text-[12px] uppercase tracking-[0.18em] text-white/30">
            One connected machine. End-to-end.
          </p>
          <a
            href="#cta"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: "var(--teal-500)", color: "#0F2349" }}
          >
            See How It Works
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProblemSolution() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" })

  const pivotRef = useRef<HTMLDivElement>(null)
  const pivotInView = useInView(pivotRef, { once: true, margin: "-60px" })

  return (
    <section id="problem-solution" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-3">
            / the problem
          </div>
          <h2 className="text-[36px] md:text-[52px] font-extrabold tracking-[-0.04em] text-[var(--navy-900)] leading-[1.05]">
            Sound familiar?
          </h2>
        </motion.div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROBLEMS.map((problem, i) => (
            <ProblemCard key={problem.id} problem={problem} index={i} />
          ))}
        </div>

        {/* Pivot + Solution (share one inView trigger) */}
        <div ref={pivotRef}>
          <PivotDivider isInView={pivotInView} />
          <SolutionCard isInView={pivotInView} />
        </div>
      </div>
    </section>
  )
}
