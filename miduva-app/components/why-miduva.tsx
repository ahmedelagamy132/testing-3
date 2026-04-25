"use client"

import { useRef } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "motion/react"
import { Layers, BarChart2, Cpu, DollarSign } from "lucide-react"

const DIFFERENTIATORS = [
  {
    id: "custom",
    num: "01",
    icon: Layers,
    title: "Custom Solutions",
    oldWay: "cookie-cutter packages",
    newWay: "systems built around your business",
  },
  {
    id: "data",
    num: "02",
    icon: BarChart2,
    title: "Data-Driven Decisions",
    oldWay: "gut-feel strategy",
    newWay: "every move backed by real numbers",
  },
  {
    id: "ai",
    num: "03",
    icon: Cpu,
    title: "AI-Powered Systems",
    oldWay: "manual, repetitive tasks",
    newWay: "AI agents running the heavy lifting",
  },
  {
    id: "roi",
    num: "04",
    icon: DollarSign,
    title: "Focus on ROI",
    oldWay: "vanity metrics and reports",
    newWay: "revenue impact, measured and proven",
  },
] as const

const PHRASES = [
  { text: "We don't sell", dim: false, shine: false, strike: false },
  { text: "services.", dim: true, shine: false, strike: true },
  { text: "We build", dim: false, shine: false, strike: false },
  { text: "systems", dim: false, shine: true, strike: false },
  { text: "designed to grow your business.", dim: false, shine: false, strike: false },
] as const

// ─── Single differentiator card ───────────────────────────────────────────────
function DifferentiatorCard({
  data,
  index,
  isParentInView,
}: {
  data: (typeof DIFFERENTIATORS)[number]
  index: number
  isParentInView: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: "-60px" })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const liftY = useMotionValue(0)

  const springCfg = { stiffness: 120, damping: 18 }
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), springCfg)
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [6, -6]), springCfg)
  const springY = useSpring(liftY, springCfg)

  const Icon = data.icon

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        y: springY,
        transformPerspective: 900,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(43,200,183,0.12)",
        borderRadius: 24,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(24px, 2.5vw, 36px)",
        cursor: "default",
      }}
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={
        isParentInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 50, scale: 0.94 }
      }
      transition={{ duration: 0.7, delay: 0.1 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const rect = cardRef.current?.getBoundingClientRect()
        if (!rect) return
        mouseX.set((e.clientX - rect.left) / rect.width * 2 - 1)
        mouseY.set((e.clientY - rect.top) / rect.height * 2 - 1)
      }}
      onMouseEnter={() => liftY.set(-6)}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); liftY.set(0) }}
    >
      {/* Ambient teal glow — top right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -60, right: -60,
          width: 200, height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(43,200,183,0.10) 0%, transparent 70%)",
          filter: "blur(32px)",
          pointerEvents: "none",
        }}
      />

      {/* Icon pill */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44, height: 44,
          borderRadius: 14,
          background: "rgba(43,200,183,0.10)",
          border: "1px solid rgba(43,200,183,0.24)",
          marginBottom: 20,
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: 22, height: 22, color: "var(--teal-500)" }} strokeWidth={1.75} />
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "clamp(18px, 1.8vw, 22px)",
          fontWeight: 800,
          color: "white",
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
          margin: "0 0 14px",
        }}
      >
        {data.title}
      </h3>

      {/* Teal underline */}
      <div
        style={{
          height: 2,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 1,
          overflow: "hidden",
          marginBottom: 18,
        }}
      >
        <motion.div
          style={{ height: "100%", background: "var(--teal-500)", borderRadius: 1, transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 0.3 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Contrast comparison */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.28)",
            textDecoration: "line-through",
            textDecorationColor: "rgba(255,255,255,0.20)",
            lineHeight: 1.4,
          }}
        >
          {data.oldWay}
        </span>
        <span style={{ fontSize: 11, color: "rgba(43,200,183,0.50)", fontFamily: "monospace" }}>
          ↓
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--teal-400)", lineHeight: 1.4 }}>
          {data.newWay}
        </span>
      </div>

      {/* Ambient number */}
      <div
        aria-hidden
        className="mono"
        style={{
          position: "absolute",
          bottom: -20, right: 10,
          fontSize: "clamp(80px, 10vw, 120px)",
          fontWeight: 800,
          color: "rgba(255,255,255,0.06)",
          lineHeight: 1,
          letterSpacing: "-0.06em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {data.num}
      </div>
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function WhyMiduva() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section
      id="why-miduva"
      style={{ background: "#0F2349", position: "relative", overflow: "hidden" }}
      className="grain"
    >
      {/* Ambient blobs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -160, left: -160,
          width: 600, height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(43,200,183,0.09) 0%, transparent 60%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -140, right: -140,
          width: 500, height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(43,200,183,0.06) 0%, transparent 60%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Teal top-edge seam */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "60%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(43,200,183,0.35), transparent)",
          pointerEvents: "none",
        }}
      />

      <div ref={sectionRef} className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">

        {/* Eyebrow */}
        <motion.div
          className="mono"
          style={{
            fontSize: 13,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--teal-500)",
            marginBottom: 24,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          / why miduva
        </motion.div>

        {/* Headline — cinematic word reveal */}
        <div
          className="mb-16 md:mb-20"
          style={{
            fontSize: "clamp(30px, 4vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "white",
            lineHeight: 1.15,
          }}
        >
          {PHRASES.map((phrase, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                overflow: "hidden",
                marginRight: "0.28em",
                verticalAlign: "bottom",
                position: "relative",
              }}
            >
              <motion.span
                style={{
                  display: "inline-block",
                  position: "relative",
                  ...(phrase.dim ? { color: "rgba(255,255,255,0.35)" } : {}),
                }}
                className={phrase.shine ? "shine" : ""}
                initial={{ clipPath: "inset(0 0 100% 0)", y: 8 }}
                animate={
                  isInView
                    ? { clipPath: "inset(0 0 0% 0)", y: 0 }
                    : { clipPath: "inset(0 0 100% 0)", y: 8 }
                }
                transition={{ duration: 0.65, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {phrase.text}

                {/* Animated strikethrough on "services." */}
                {phrase.strike && (
                  <motion.span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0, right: 0,
                      top: "52%",
                      height: 2,
                      background: "rgba(255,255,255,0.35)",
                      transformOrigin: "left",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </motion.span>
            </span>
          ))}
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ perspective: "1200px" }}
        >
          {DIFFERENTIATORS.map((d, i) => (
            <DifferentiatorCard
              key={d.id}
              data={d}
              index={i}
              isParentInView={isInView}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
