"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "motion/react"

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
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setCount(Math.round(eased * target))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [started, target, duration])
  return count
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  {
    id: "leads",
    value: 120,
    suffix: "+",
    label: "Leads Generated",
    sub: "Per client, per quarter on average",
    delay: 0,
    barDelay: 0.1,
  },
  {
    id: "conversion",
    value: 3,
    suffix: "×",
    label: "Conversion Rate",
    sub: "Compared to industry baseline",
    delay: 0.14,
    barDelay: 0.24,
  },
  {
    id: "cpl",
    value: 40,
    suffix: "%",
    label: "Lower Cost per Lead",
    sub: "After full system optimization",
    delay: 0.28,
    barDelay: 0.38,
  },
] as const

// ─── Single stat ──────────────────────────────────────────────────────────────
function StatItem({
  stat,
  started,
}: {
  stat: (typeof STATS)[number]
  started: boolean
}) {
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
        {/* Animated number — blurs in as it counts */}
        <motion.span
          style={{
            fontSize: "clamp(72px, 11vw, 136px)",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            color: "var(--navy-900)",
            fontFamily: "var(--font-jakarta)",
            display: "block",
          }}
          animate={{
            filter: started
              ? count < stat.value
                ? "blur(4px)"
                : "blur(0px)"
              : "blur(12px)",
            opacity: started ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
        >
          {count}
        </motion.span>

        {/* Suffix — pulses teal when count lands */}
        <motion.span
          style={{
            fontSize: "clamp(36px, 5.5vw, 72px)",
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
      <div
        style={{
          height: 2,
          width: "100%",
          background: "var(--line)",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{ height: "100%", background: "var(--teal-500)", borderRadius: 1 }}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={started ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.9, delay: stat.barDelay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Label */}
      <div>
        <p
          style={{
            fontSize: "clamp(15px, 1.5vw, 19px)",
            fontWeight: 700,
            color: "var(--navy-900)",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {stat.label}
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            marginTop: 5,
            lineHeight: 1.55,
          }}
        >
          {stat.sub}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ResultsStats() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section
      style={{
        background: "var(--paper)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Very subtle dot-grid texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(15,35,73,0.045) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      {/* Teal top-edge glow — ties to dark section above */}
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
            "linear-gradient(90deg, transparent, var(--teal-500), transparent)",
          pointerEvents: "none",
        }}
      />

      <div
        ref={sectionRef}
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28"
      >
        {/* Header */}
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-3">
            / results
          </div>
          <h2 className="text-[36px] md:text-[52px] font-extrabold tracking-[-0.04em] text-[var(--navy-900)] leading-[1.05]">
            Numbers don{"'"}t lie.
          </h2>
          <p className="mt-4 text-[15px] md:text-[17px] text-[var(--muted)] max-w-lg leading-[1.65]">
            Aggregated across all active client systems.
            Measured. Verified. Repeatable.
          </p>
        </motion.div>

        {/* Stats — 3-column, divided */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
          }}
          className="grid-cols-1 md:grid-cols-3"
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.id}
              style={{
                paddingRight: i < STATS.length - 1 ? "clamp(24px, 4vw, 64px)" : 0,
                paddingLeft: i > 0 ? "clamp(24px, 4vw, 64px)" : 0,
                borderRight:
                  i < STATS.length - 1
                    ? "1px solid var(--line)"
                    : "none",
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
            All metrics averaged across Q1–Q2 client cohorts
          </p>
          <a
            href="#cta"
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-opacity hover:opacity-80 flex-shrink-0"
          >
            Get your free growth plan
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
