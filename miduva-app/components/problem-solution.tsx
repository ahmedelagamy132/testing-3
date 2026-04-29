"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { XCircle, AlertTriangle, Zap, CheckCircle } from "lucide-react"

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

const RESULTS = [
  { label: "More Leads" },
  { label: "Better Conversion" },
  { label: "Automated Follow-Up" },
]

/* ─── Color tokens ─── */
const ORANGE = {
  base: "#F97316",
  light: "#FB923C",
  soft: "#FDBA74",
  glow: "rgba(249,115,22,0.15)",
  border: "rgba(249,115,22,0.30)",
  track: "rgba(249,115,22,0.40)",
  orb: "rgba(249,115,22,0.95)",
}

const CYAN = {
  base: "#2BC8B7",
  glow: "rgba(43,200,183,0.15)",
  border: "rgba(43,200,183,0.30)",
  track: "rgba(43,200,183,0.40)",
  orb: "rgba(43,200,183,0.95)",
}

/* ─── Spring presets ─── */
const springReveal = { type: "spring" as const, stiffness: 90, damping: 14 }
const springBounce = { type: "spring" as const, stiffness: 110, damping: 12 }

/* ─── Sub-components ─── */

function SweepReveal({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute inset-0 z-20 pointer-events-none rounded-[inherit]"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
      }}
      initial={{ x: "-100%" }}
      animate={{ x: "200%" }}
      transition={{ duration: 1.2, delay, ease: "easeInOut" }}
    />
  )
}

function ProblemNode({
  problem,
  index,
  isInView,
}: {
  problem: (typeof PROBLEMS)[0]
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -70, rotateY: 10, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, x: 0, rotateY: 0, scale: 1 }
          : { opacity: 0, x: -70, rotateY: 10, scale: 0.95 }
      }
      transition={{ ...springReveal, delay: 0.1 + index * 0.15 }}
      whileHover={{ y: -5, transition: { duration: 0.35 } }}
      className="relative flex flex-col gap-4 rounded-2xl border p-5 md:p-6 overflow-hidden group"
      style={{
        borderColor: ORANGE.border,
        background:
          "linear-gradient(180deg, rgba(249,115,22,0.04), rgba(6,14,30,0.55))",
        boxShadow: `inset 0 0 0 1px ${ORANGE.glow}, 0 8px 32px -10px rgba(0,0,0,0.15)`,
        backdropFilter: "blur(8px)",
      }}
    >
      {isInView && <SweepReveal delay={0.2 + index * 0.15} />}

      {/* Warm radial tint */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(249,115,22,0.08) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      {/* Top row: icon + label */}
      <div className="relative z-10 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
          style={{
            background: "rgba(249,115,22,0.10)",
            border: "1px solid rgba(249,115,22,0.25)",
            boxShadow: "0 0 16px rgba(249,115,22,0.08)",
          }}
        >
          {problem.icon === "x" ? (
            <XCircle
              style={{ width: 20, height: 20, color: ORANGE.base }}
              strokeWidth={2}
            />
          ) : (
            <AlertTriangle
              style={{ width: 20, height: 20, color: ORANGE.base }}
              strokeWidth={2}
            />
          )}
        </div>
        <p
          className="mono text-[11px] md:text-[12px] uppercase tracking-[0.22em] font-medium"
          style={{ color: ORANGE.soft }}
        >
          {problem.label}
        </p>
      </div>

      {/* Title */}
      <h3
        className="relative z-10 text-[17px] md:text-[19px] font-bold tracking-[-0.025em] leading-[1.25]"
        style={{ color: "var(--muted)" }}
      >
        {problem.title}
      </h3>

      {/* Detail */}
      <p
        className="relative z-10 text-[13px] md:text-[14.5px] leading-[1.6]"
        style={{ color: "var(--muted)", opacity: 0.75 }}
      >
        {problem.detail}
      </p>

      {/* Bottom glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${ORANGE.track} 40%, rgba(234,88,12,0.25) 70%, transparent 100%)`,
        }}
        aria-hidden
      />
    </motion.div>
  )
}

function FlowConnector({
  direction,
  color,
  delay = 0,
  className = "",
}: {
  direction: "horizontal" | "vertical"
  color: "orange" | "cyan"
  delay?: number
  className?: string
}) {
  const palette = color === "orange" ? ORANGE : CYAN
  const isH = direction === "horizontal"

  return (
    <motion.div
      className={`relative overflow-hidden ${isH ? "h-[2px]" : "w-[2px]"} ${className}`}
      initial={isH ? { scaleX: 0 } : { scaleY: 0 }}
      animate={isH ? { scaleX: 1 } : { scaleY: 1 }}
      style={{ transformOrigin: isH ? "left" : "top" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Track */}
      <div
        className="absolute inset-0"
        style={{ background: palette.track }}
        aria-hidden
      />

      {/* Glowing orb */}
      <div
        className={`absolute rounded-full ${
          isH
            ? "top-1/2 -translate-y-1/2 w-2 h-2"
            : "left-1/2 -translate-x-1/2 w-2 h-2"
        }`}
        style={{
          background: palette.orb,
          boxShadow: `0 0 8px ${palette.orb}, 0 0 20px ${palette.glow}`,
          animation: isH
            ? `packet-h 2.2s ${delay + 0.5}s linear infinite`
            : `packet-v 2.2s ${delay + 0.5}s linear infinite`,
        }}
        aria-hidden
      />
    </motion.div>
  )
}

function EngineNode({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.65, y: 30 }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.65, y: 30 }
      }
      transition={{ ...springBounce, delay: 0.55 }}
      whileHover={{ y: -6, transition: { duration: 0.4 } }}
      className="relative flex flex-col items-center justify-center text-center rounded-[28px] border-2 p-8 md:p-10 w-full max-w-[320px] engine-glow overflow-hidden"
      style={{
        borderColor: CYAN.border,
        background:
          "linear-gradient(180deg, #0D1F42 0%, #08152E 100%)",
      }}
    >
      {isInView && <SweepReveal delay={0.75} />}

      {/* Inner glow layers */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{
          boxShadow: "inset 0 0 80px rgba(43,200,183,0.06)",
        }}
        aria-hidden
      />
      <div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(43,200,183,0.16) 0%, transparent 65%)",
          filter: "blur(44px)",
        }}
        aria-hidden
      />
      <div
        className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(43,200,183,0.14) 0%, transparent 65%)",
          filter: "blur(44px)",
        }}
        aria-hidden
      />

      {/* Soft ring pulse */}
      <motion.div
        className="absolute inset-0 rounded-[28px] pointer-events-none border"
        style={{ borderColor: CYAN.border }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      {/* Icon */}
      <div
        className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: "rgba(43,200,183,0.10)",
          border: "1px solid rgba(43,200,183,0.30)",
          boxShadow: "0 0 24px rgba(43,200,183,0.14)",
        }}
      >
        <Zap
          style={{ width: 30, height: 30, color: CYAN.base }}
          strokeWidth={2}
        />
      </div>

      {/* Label */}
      <p
        className="relative z-10 mono text-[12px] uppercase tracking-[0.22em] font-medium mb-2"
        style={{ color: CYAN.base, opacity: 0.7 }}
      >
        Processing
      </p>

      {/* Title */}
      <h3 className="relative z-10 text-[22px] md:text-[26px] font-extrabold tracking-[-0.025em] leading-[1.15] text-white">
        Complete Growth System
      </h3>

      {/* Subtitle */}
      <p className="relative z-10 mt-4 text-[13px] md:text-[14px] leading-[1.55] text-white/45 max-w-[240px]">
        We solve this by building{" "}
        <span className="text-white/75 font-semibold">complete systems</span>{" "}
        — not isolated services.
      </p>
    </motion.div>
  )
}

function OutputNode({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60, rotateY: -8, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, x: 0, rotateY: 0, scale: 1 }
          : { opacity: 0, x: 60, rotateY: -8, scale: 0.95 }
      }
      transition={{ ...springReveal, delay: 0.85 }}
      whileHover={{ y: -5, transition: { duration: 0.35 } }}
      className="relative flex flex-col gap-5 rounded-[24px] border p-7 md:p-8 overflow-hidden w-full max-w-[340px]"
      style={{
        borderColor: CYAN.border,
        background:
          "linear-gradient(180deg, rgba(43,200,183,0.04), rgba(6,14,30,0.50))",
        boxShadow: `inset 0 0 0 1px ${CYAN.glow}, 0 8px 32px -10px rgba(0,0,0,0.15)`,
        backdropFilter: "blur(8px)",
      }}
    >
      {isInView && <SweepReveal delay={1.0} />}

      {/* Success glow */}
      <div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(43,200,183,0.12) 0%, transparent 65%)",
          filter: "blur(36px)",
        }}
        aria-hidden
      />

      {/* Header */}
      <div className="relative z-10">
        <p
          className="mono text-[11px] md:text-[12px] uppercase tracking-[0.22em] font-medium mb-2"
          style={{ color: CYAN.base, opacity: 0.7 }}
        >
          Output
        </p>
        <h3
          className="text-[19px] md:text-[21px] font-extrabold tracking-[-0.025em] leading-[1.2]"
          style={{ color: "var(--ink)" }}
        >
          Predictable Growth System
        </h3>
      </div>

      {/* Result tags */}
      <div className="relative z-10 flex flex-wrap gap-2.5">
        {RESULTS.map((result, i) => (
          <motion.span
            key={result.label}
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 10, scale: 0.92 }
            }
            transition={{
              ...springReveal,
              delay: 1.05 + i * 0.12,
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] md:text-[13px] font-semibold border"
            style={{
              background: "rgba(43,200,183,0.08)",
              color: CYAN.base,
              borderColor: CYAN.border,
            }}
          >
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {result.label}
          </motion.span>
        ))}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${CYAN.track} 40%, rgba(43,200,183,0.20) 70%, transparent 100%)`,
        }}
        aria-hidden
      />
    </motion.div>
  )
}

/* ─── Main section ─── */

export default function ProblemSolution() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" })

  const flowRef = useRef<HTMLDivElement>(null)
  const flowInView = useInView(flowRef, { once: true, margin: "-80px" })

  return (
    <section
      id="problem-solution"
      className="py-20 md:py-32 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="mb-14 md:mb-20"
          initial={{ opacity: 0, y: 24 }}
          animate={
            headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
          }
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-3">
            / the problem
          </div>
          <h2 className="text-[38px] md:text-[56px] font-extrabold tracking-[-0.04em] text-[var(--navy-900)] leading-[1.05]">
            Sound familiar?
          </h2>
        </motion.div>

        {/* Flow visualization */}
        <div ref={flowRef} className="relative">
          {/* ── Desktop layout ── */}
          <div
            className="hidden lg:flex items-stretch justify-center gap-0"
            style={{ perspective: "1200px" }}
          >
            {/* Left column: Problem inputs */}
            <div className="flex flex-col justify-center gap-5 w-80 flex-shrink-0">
              {PROBLEMS.map((problem, i) => (
                <div key={problem.id} className="flex items-center">
                  <ProblemNode
                    problem={problem}
                    index={i}
                    isInView={flowInView}
                  />
                  {/* Connector to engine */}
                  <div className="w-12 h-[2px] flex-shrink-0">
                    <FlowConnector
                      direction="horizontal"
                      color="orange"
                      delay={0.35 + i * 0.15}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Center column: Engine */}
            <div className="flex items-center justify-center px-5">
              <motion.div
                animate={
                  flowInView
                    ? { y: [0, -6, 0] }
                    : {}
                }
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                }}
              >
                <EngineNode isInView={flowInView} />
              </motion.div>
            </div>

            {/* Right column: Output */}
            <div className="flex items-center flex-shrink-0">
              {/* Connector from engine */}
              <div className="w-12 h-[2px] flex-shrink-0">
                <FlowConnector
                  direction="horizontal"
                  color="cyan"
                  delay={0.9}
                />
              </div>
              <motion.div
                animate={
                  flowInView
                    ? { y: [0, -5, 0] }
                    : {}
                }
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.8,
                }}
              >
                <OutputNode isInView={flowInView} />
              </motion.div>
            </div>
          </div>

          {/* ── Mobile / tablet layout ── */}
          <div className="lg:hidden flex flex-col items-center">
            {/* Problem stack */}
            <div className="flex flex-col gap-4 w-full max-w-md">
              {PROBLEMS.map((problem, i) => (
                <div key={problem.id}>
                  <ProblemNode
                    problem={problem}
                    index={i}
                    isInView={flowInView}
                  />
                  {i < PROBLEMS.length - 1 && (
                    <div className="flex justify-center py-3">
                      <FlowConnector
                        direction="vertical"
                        color="orange"
                        delay={0.3 + i * 0.15}
                        className="h-6"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Vertical connector to engine */}
            <div className="flex justify-center py-4">
              <FlowConnector
                direction="vertical"
                color="orange"
                delay={0.7}
                className="h-12"
              />
            </div>

            {/* Engine */}
            <motion.div
              animate={flowInView ? { y: [0, -5, 0] } : {}}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              }}
            >
              <EngineNode isInView={flowInView} />
            </motion.div>

            {/* Vertical connector to output */}
            <div className="flex justify-center py-4">
              <FlowConnector
                direction="vertical"
                color="cyan"
                delay={1.0}
                className="h-12"
              />
            </div>

            {/* Output */}
            <motion.div
              animate={flowInView ? { y: [0, -4, 0] } : {}}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.6,
              }}
            >
              <OutputNode isInView={flowInView} />
            </motion.div>
          </div>

          {/* Ambient background glow behind engine (desktop) */}
          <div
            className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full pointer-events-none -z-10"
            style={{
              background:
                "radial-gradient(circle, rgba(43,200,183,0.05) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}
