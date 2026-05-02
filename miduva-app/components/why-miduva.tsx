"use client"

import { useRef, useState, useEffect } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useScroll,
} from "motion/react"

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

/* ═══════════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════════ */

const DIFFERENTIATORS = [
  {
    id: "custom",
    num: "01",
    title: "Custom Solutions",
    subtitle: "Tailored architecture",
    oldWay: "cookie-cutter packages",
    newWay: "systems built around your business",
    grid: "md:col-span-7 md:row-span-2",
  },
  {
    id: "data",
    num: "02",
    title: "Data-Driven Decisions",
    subtitle: "Quantified strategy",
    oldWay: "gut-feel strategy",
    newWay: "every move backed by real numbers",
    grid: "md:col-span-5",
  },
  {
    id: "ai",
    num: "03",
    title: "AI-Powered Systems",
    subtitle: "Intelligent automation",
    oldWay: "manual, repetitive tasks",
    newWay: "AI agents running the heavy lifting",
    grid: "md:col-span-5",
  },
  {
    id: "roi",
    num: "04",
    title: "Focus on ROI",
    subtitle: "Revenue-first metrics",
    oldWay: "vanity metrics and reports",
    newWay: "revenue impact, measured and proven",
    grid: "md:col-span-12",
  },
] as const

const PHRASES = [
  { text: "We don't sell", dim: false, shine: false, strike: false },
  { text: "services.", dim: true, shine: false, strike: true },
  { text: "We build", dim: false, shine: false, strike: false },
  { text: "systems", dim: false, shine: true, strike: false },
  { text: "designed to grow your business.", dim: false, shine: false, strike: false },
] as const

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
  data: IconChart,
  ai: IconChip,
  roi: IconDollar,
}

/* ═══════════════════════════════════════════════════════════════════════════════
   EASE CURVES
   ═══════════════════════════════════════════════════════════════════════════════ */

const EASE_FLUID = [0.32, 0.72, 0, 1] as const
const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const

/* ═══════════════════════════════════════════════════════════════════════════════
   DIFFERENTIATOR CARD
   ═══════════════════════════════════════════════════════════════════════════════ */

function DifferentiatorCard({
  data,
  index,
  isParentInView,
  isDark,
}: {
  data: (typeof DIFFERENTIATORS)[number]
  index: number
  isParentInView: boolean
  isDark: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: "-60px" })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const liftY = useMotionValue(0)

  const springCfg = { stiffness: 120, damping: 18 }
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), springCfg)
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [5, -5]), springCfg)
  const springY = useSpring(liftY, springCfg)

  const Icon = ICONS[data.id]
  const isWide = data.grid.includes("col-span-12")

  return (
    <motion.div
      ref={cardRef}
      className={`${data.grid} group`}
      initial={{ opacity: 0, y: 60, scale: 0.96, filter: "blur(8px)" }}
      animate={
        isParentInView
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, y: 60, scale: 0.96, filter: "blur(8px)" }
      }
      transition={{
        duration: 0.8,
        delay: 0.15 + index * 0.12,
        ease: EASE_FLUID,
      }}
      style={{ perspective: 900 }}
    >
      {/* ── Double-Bezel Outer Shell ── */}
      <motion.div
        className={`relative h-full p-[5px] rounded-[2rem] ring-1 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isDark ? "bg-white/[0.03] ring-white/[0.08] group-hover:ring-white/[0.16] group-hover:bg-white/[0.05]" : "bg-[var(--chip)] ring-[var(--line)] group-hover:ring-[var(--teal-500)]/30 group-hover:bg-[var(--paper-2)]"}`}
        style={{
          rotateX,
          rotateY,
          y: springY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={(e) => {
          const rect = cardRef.current?.getBoundingClientRect()
          if (!rect) return
          mouseX.set((e.clientX - rect.left) / rect.width * 2 - 1)
          mouseY.set((e.clientY - rect.top) / rect.height * 2 - 1)
        }}
        onMouseEnter={() => liftY.set(-8)}
        onMouseLeave={() => {
          mouseX.set(0)
          mouseY.set(0)
          liftY.set(0)
        }}
      >
        {/* ── Inner Core ── */}
        <div
          className={`relative h-full overflow-hidden rounded-[calc(2rem-5px)] transition-shadow duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isDark ? "bg-[#08080c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_40px_rgba(43,200,183,0.06)]" : "bg-[var(--card)] shadow-[inset_0_1px_1px_rgba(15,35,73,0.06)] group-hover:shadow-[inset_0_1px_1px_rgba(15,35,73,0.1),0_0_40px_rgba(43,200,183,0.06)]"}`}
        >
          {/* Ambient top-right teal glow */}
          <div
            aria-hidden
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(43,200,183,0.10) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Content padding */}
          <div className={`relative z-10 h-full flex flex-col ${isWide ? "md:flex-row md:items-center md:justify-between gap-6 md:gap-10" : ""} p-6 md:p-8`}>
            
            {/* Left content */}
            <div className="flex flex-col flex-1">
              {/* Eyebrow + Icon row */}
              <div className="flex items-center gap-3 mb-5">
                {/* Icon pill — nested circular wrapper */}
                <div className={`w-10 h-10 rounded-xl ring-1 flex items-center justify-center flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:ring-teal-500/30 group-hover:bg-teal-500/10 ${isDark ? "bg-white/[0.04] ring-white/[0.1]" : "bg-[var(--chip)] ring-[var(--line)]"}`}>
                  <Icon className="w-[18px] h-[18px] text-teal-400/80 transition-colors duration-500 group-hover:text-teal-400" />
                </div>
                <span className={`text-[10px] uppercase tracking-[0.2em] font-medium mono ${isDark ? "text-white/30" : "text-[var(--muted)]"}`}>
                  {data.subtitle}
                </span>
              </div>

              {/* Title */}
              <h3 className={`text-[clamp(18px,1.8vw,26px)] font-extrabold tracking-[-0.03em] leading-[1.15] mb-3 ${isDark ? "text-white" : "text-[var(--ink)]"}`}>
                {data.title}
              </h3>

              {/* Teal underline */}
              <div className={`h-[2px] rounded-full overflow-hidden mb-5 max-w-[120px] ${isDark ? "bg-white/[0.06]" : "bg-[var(--line)]"}`}>
                <motion.div
                  className="h-full bg-teal-500 rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 1.2, delay: 0.4 + index * 0.12, ease: EASE_SMOOTH }}
                />
              </div>

              {/* Contrast comparison */}
              <div className="flex flex-col gap-2">
                <span className={`text-[13px] line-through leading-relaxed ${isDark ? "text-white/25 decoration-white/15" : "text-[var(--muted)]/50 decoration-[var(--muted)]/30"}`}>
                  {data.oldWay}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-teal-500/50 mono">↓</span>
                  <span className="text-[13px] font-semibold text-teal-400 leading-relaxed">
                    {data.newWay}
                  </span>
                </div>
              </div>
            </div>

            {/* Wide card right side — mini visual */}
            {isWide && (
              <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
                <div className="hidden md:flex items-end gap-[6px] h-14">
                  {[32, 48, 40, 64, 72, 56, 80, 88, 76, 92, 84, 96].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-[6px] rounded-full bg-teal-500/20"
                      style={{ height: `${h}%` }}
                      initial={{ scaleY: 0 }}
                      animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.6 + i * 0.04,
                        ease: EASE_SMOOTH,
                      }}
                    />
                  ))}
                </div>
                <div className="text-right">
                  <div className={`text-[28px] md:text-[36px] font-extrabold tracking-[-0.04em] leading-none ${isDark ? "text-white" : "text-[var(--ink)]"}`}>
                    4.8×
                  </div>
                  <div className={`text-[10px] uppercase tracking-[0.18em] mono mt-1 ${isDark ? "text-white/25" : "text-[var(--muted)]"}`}>
                    Avg. ROAS
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Giant ambient number */}
          <div
            aria-hidden
            className={`absolute bottom-[-16px] right-2 text-[clamp(80px,10vw,140px)] font-extrabold leading-none tracking-[-0.06em] pointer-events-none select-none mono transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[-4px] ${isDark ? "text-white/[0.04] group-hover:text-white/[0.06]" : "text-[var(--ink)]/[0.04] group-hover:text-[var(--ink)]/[0.06]"}`}
          >
            {data.num}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function WhyMiduva() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const isDark = useIsDark()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Parallax speeds for background layers
  const yOrb1 = useTransform(scrollYProgress, [0, 1], [0, -140])
  const yOrb2 = useTransform(scrollYProgress, [0, 1], [0, -80])
  const yOrb3 = useTransform(scrollYProgress, [0, 1], [0, -40])
  const yWatermark = useTransform(scrollYProgress, [0, 1], [0, -60])
  const yHeadline = useTransform(scrollYProgress, [0, 1], [0, -30])

  return (
    <section
      ref={sectionRef}
      id="why-miduva"
      className="relative overflow-hidden"
      style={{ background: isDark ? "#020204" : "var(--paper)" }}
    >
      {/* ═══════ GRAIN OVERLAY (section-scoped) ═══════ */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* ═══════ PARALLAX BACKGROUND LAYERS ═══════ */}

      {/* Giant watermark */}
      <motion.div
        aria-hidden
        className="absolute top-[10%] left-1/2 -translate-x-1/2 pointer-events-none select-none z-0"
        style={{ y: yWatermark }}
      >
        <span
          className="block text-[clamp(180px,22vw,380px)] font-extrabold tracking-[-0.06em] leading-none mono"
          style={{ color: isDark ? "rgba(255,255,255,0.015)" : "rgba(15,35,73,0.04)" }}
        >
          WHY
        </span>
      </motion.div>

      {/* Orb 1 — large top-left teal */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          y: yOrb1,
          background: "radial-gradient(circle, rgba(43,200,183,0.07) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      {/* Orb 2 — mid-right navy */}
      <motion.div
        aria-hidden
        className="absolute top-[30%] -right-24 w-[480px] h-[480px] rounded-full pointer-events-none z-0"
        style={{
          y: yOrb2,
          background: "radial-gradient(circle, rgba(43,200,183,0.04) 0%, transparent 60%)",
          filter: "blur(70px)",
        }}
      />

      {/* Orb 3 — bottom-center subtle */}
      <motion.div
        aria-hidden
        className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          y: yOrb3,
          background: "radial-gradient(circle, rgba(43,200,183,0.05) 0%, transparent 55%)",
          filter: "blur(90px)",
        }}
      />

      {/* Subtle top edge hairline */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(43,200,183,0.25), transparent)",
        }}
      />

      {/* ═══════ CONTENT ═══════ */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-40">

        {/* Eyebrow tag */}
        <motion.div
          className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium ring-1 text-teal-400 mb-8 mono ${isDark ? "bg-white/[0.04] ring-white/[0.1]" : "bg-[var(--chip)] ring-[var(--line)]"}`}
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 20, filter: "blur(6px)" }
          }
          transition={{ duration: 0.7, ease: EASE_FLUID }}
        >
          Why Miduva
        </motion.div>

        {/* Headline — cinematic word reveal with parallax */}
        <motion.div
          className="mb-20 md:mb-28"
          style={{ y: yHeadline }}
        >
          <h2
            className={`text-[clamp(32px,5vw,56px)] font-extrabold tracking-[-0.04em] leading-[1.1] ${isDark ? "text-white" : "text-[var(--ink)]"}`}
          >
            {PHRASES.map((phrase, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden mr-[0.28em] align-bottom relative"
              >
                <motion.span
                  className={`inline-block relative ${phrase.shine ? "shine" : ""}`}
                  style={phrase.dim ? { color: isDark ? "rgba(255,255,255,0.30)" : "rgba(11,27,58,0.30)" } : undefined}
                  initial={{ clipPath: "inset(0 0 100% 0)", y: 12, filter: "blur(6px)" }}
                  animate={
                    isInView
                      ? { clipPath: "inset(0 0 0% 0)", y: 0, filter: "blur(0px)" }
                      : { clipPath: "inset(0 0 100% 0)", y: 12, filter: "blur(6px)" }
                  }
                  transition={{
                    duration: 0.7,
                    delay: 0.08 + i * 0.08,
                    ease: EASE_FLUID,
                  }}
                >
                  {phrase.text}

                  {/* Animated strikethrough */}
                  {phrase.strike && (
                    <motion.span
                      aria-hidden
                      className={`absolute left-0 right-0 top-[52%] h-[2px] origin-left ${isDark ? "bg-white/25" : "bg-[var(--ink)]/25"}`}
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{ duration: 0.5, delay: 0.6, ease: EASE_SMOOTH }}
                    />
                  )}
                </motion.span>
              </span>
            ))}
          </h2>
        </motion.div>

        {/* Asymmetrical Bento Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5"
          style={{ perspective: "1200px" }}
        >
          {DIFFERENTIATORS.map((d, i) => (
            <DifferentiatorCard
              key={d.id}
              data={d}
              index={i}
              isParentInView={isInView}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
