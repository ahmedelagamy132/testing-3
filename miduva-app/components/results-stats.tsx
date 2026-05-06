"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "motion/react"
import type { ResultsData } from "@/lib/sanity/types"

// ─── Count-up hook (ease-out cubic, RAF-driven) ───────────────────────────────
function useCountUp(target: number, duration = 1900, started: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let startTs = 0
    let frame = 0
    const step = (ts: number) => {
      if (!startTs) startTs = ts
      const elapsed = ts - startTs
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [started, target, duration])
  return count
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

// ─── Local display type (adds animation timing to StatCard) ──────────────────
type StatDisplay = {
  id: string
  value: number
  suffix: string
  label: string
  sub: string
  delay: number
  barDelay: number
}

const DEFAULT_STATS: StatDisplay[] = [
  { id: "leads",      value: 120, suffix: "+", label: "Leads Generated",       sub: "Per client, per quarter on average",  delay: 0,    barDelay: 0.1  },
  { id: "conversion", value: 3,   suffix: "×", label: "Conversion Rate",        sub: "Compared to industry baseline",        delay: 0.14, barDelay: 0.24 },
  { id: "cpl",        value: 40,  suffix: "%", label: "Lower Cost per Lead",    sub: "After full system optimization",       delay: 0.28, barDelay: 0.38 },
]

const DELAYS = [
  { delay: 0,    barDelay: 0.1  },
  { delay: 0.14, barDelay: 0.24 },
  { delay: 0.28, barDelay: 0.38 },
]

// ─── Single stat ──────────────────────────────────────────────────────────────
function StatItem({ stat, started }: { stat: StatDisplay; started: boolean }) {
  const count = useCountUp(stat.value, 1900, started)
  const done = count === stat.value

  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ opacity: 0, y: 40 }}
      animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay: stat.delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Number row */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 2, lineHeight: 1 }}>
        <motion.span
          style={{
            fontSize: "clamp(56px, 12vw, 136px)",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            color: "var(--navy-900)",
            fontFamily: "var(--font-jakarta)",
            display: "block",
          }}
          animate={{
            filter: started ? (count < stat.value ? "blur(4px)" : "blur(0px)") : "blur(12px)",
            opacity: started ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
        >
          {count}
        </motion.span>

        <motion.span
          style={{
            fontSize: "clamp(28px, 6vw, 72px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            fontFamily: "var(--font-jakarta)",
          }}
          animate={{
            color: done ? "var(--teal-500)" : "var(--teal-400)",
            scale: done ? [1, 1.18, 1] : 1,
          }}
          transition={{ duration: 0.4, ease: "backOut" }}
        >
          {stat.suffix}
        </motion.span>
      </div>

      {/* Teal underline draws itself */}
      <div style={{ height: 2, width: "100%", background: "var(--line)", borderRadius: 1, overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", background: "var(--teal-500)", borderRadius: 1 }}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={started ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.9, delay: stat.barDelay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Label */}
      <div>
        <p style={{ fontSize: "clamp(15px, 1.5vw, 19px)", fontWeight: 700, color: "var(--navy-900)", letterSpacing: "-0.02em", margin: 0 }}>
          {stat.label}
        </p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 5, lineHeight: 1.55 }}>
          {stat.sub}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ResultsStats({ data }: { data?: ResultsData }) {
  const eyebrow     = data?.eyebrow    ?? "/ results"
  const headline    = data?.headline   ?? "Numbers don't lie."
  const subheadline = data?.subheadline ?? "Aggregated across all active client systems.\nMeasured. Verified. Repeatable."
  const trustNote   = data?.trustNote  ?? "All metrics averaged across Q1–Q2 client cohorts"
  const ctaLabel    = data?.ctaLabel   ?? "Get your free growth plan"
  const ctaHref     = data?.ctaHref    ?? "#cta"

  const stats: StatDisplay[] = data?.stats?.length
    ? data.stats.map((s, i) => ({
        ...s,
        delay:    DELAYS[i]?.delay    ?? 0,
        barDelay: DELAYS[i]?.barDelay ?? 0.1,
      }))
    : DEFAULT_STATS

  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(statsRef, { once: true, margin: "0px 0px -10% 0px" })
  const isMobile = useIsMobile()

  return (
    <section id="results" style={{ background: "var(--paper)", position: "relative", overflow: "hidden" }}>
      {/* Very subtle dot-grid texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(15,35,73,0.045) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      {/* Teal top-edge glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: 1,
          background: "linear-gradient(90deg, transparent, var(--teal-500), transparent)",
          pointerEvents: "none",
        }}
      />

      <div ref={sectionRef} className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Header */}
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-3">
            {eyebrow}
          </div>
          <h2 className="text-[36px] md:text-[52px] font-extrabold tracking-[-0.04em] text-[var(--navy-900)] leading-[1.05]">
            {headline}
          </h2>
          <p className="mt-4 text-[15px] md:text-[17px] text-[var(--muted)] max-w-lg leading-[1.65]" style={{ whiteSpace: "pre-line" }}>
            {subheadline}
          </p>
        </motion.div>

        {/* Stats grid */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {stats.map((stat, i) => (
            <div
              key={stat.id}
              style={isMobile ? {
                padding: "32px 0",
                borderBottom: i < stats.length - 1 ? "1px solid var(--line)" : "none",
              } : {
                paddingRight: i < stats.length - 1 ? "clamp(24px, 4vw, 64px)" : 0,
                paddingLeft:  i > 0               ? "clamp(24px, 4vw, 64px)" : 0,
                borderRight:  i < stats.length - 1 ? "1px solid var(--line)" : "none",
              }}
            >
              <StatItem stat={stat} started={isInView} />
            </div>
          ))}
        </div>

        {/* Bottom trust strip */}
        <motion.div
          className="mt-16 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--line)" }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            {trustNote}
          </p>
          <a
            href={ctaHref}
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-opacity hover:opacity-80 flex-shrink-0"
          >
            {ctaLabel}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
