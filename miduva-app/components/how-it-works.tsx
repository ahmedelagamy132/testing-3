"use client"

import { useRef, useEffect } from "react"
import { motion, useInView } from "motion/react"
import { ScanSearch, FileStack, Rocket, TrendingUp } from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────────────
const CARD_MAX_W = 900   // px
const CARD_VW    = 0.78  // 78vw
const CONNECTOR_W = 60   // px between cards
const NUM_STEPS   = 4

function getCardWidth() {
  return Math.min(CARD_VW * window.innerWidth, CARD_MAX_W)
}
function getTravel() {
  return (NUM_STEPS - 1) * (getCardWidth() + CONNECTOR_W)
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "analyze",
    num: "01",
    icon: ScanSearch,
    title: "Analyze Your Business",
    description: "We audit your channels, funnels, and conversion gaps.",
  },
  {
    id: "strategy",
    num: "02",
    icon: FileStack,
    title: "Build a Custom Strategy",
    description: "A system blueprint tailored to your market and goals.",
  },
  {
    id: "launch",
    num: "03",
    icon: Rocket,
    title: "Launch & Optimize the System",
    description: "Everything goes live and gets tuned until it performs.",
  },
  {
    id: "scale",
    num: "04",
    icon: TrendingUp,
    title: "Scale Your Results",
    description: "More traffic, better conversions, automated follow-up — compounding.",
  },
] as const

// ─── Circuit connector ────────────────────────────────────────────────────────
function CircuitConnector() {
  return (
    <div
      aria-hidden
      style={{
        width: CONNECTOR_W,
        height: 2,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(43,200,183,0.15), rgba(43,200,183,0.50), rgba(43,200,183,0.15))",
        }}
      />
      {[0, 1].map((i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--teal-500)",
            boxShadow: "0 0 8px rgba(43,200,183,0.9)",
            animation: "flow-dot-hz 2s ease-in-out infinite",
            animationDelay: `${i}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Step card ────────────────────────────────────────────────────────────────
function StepCard({ step }: { step: (typeof STEPS)[number] }) {
  const Icon = step.icon

  return (
    <div
      style={{
        width: `min(${CARD_VW * 100}vw, ${CARD_MAX_W}px)`,
        height: "calc(100vh - 210px)",
        flexShrink: 0,
        position: "relative",
        borderRadius: 32,
        overflow: "hidden",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(43,200,183,0.15)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 32px 80px -20px rgba(0,0,0,0.5)",
      }}
    >
      {/* Teal glow — top right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(43,200,183,0.14) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "55%",
          background: "linear-gradient(to bottom, transparent, rgba(5,12,36,0.50))",
          pointerEvents: "none",
        }}
      />

      {/* Giant number — bottom right, prominent */}
      <div
        aria-hidden
        className="mono"
        style={{
          position: "absolute",
          bottom: -28,
          right: 12,
          fontSize: "clamp(160px, 20vw, 280px)",
          fontWeight: 800,
          color: "rgba(255,255,255,0.07)",
          lineHeight: 1,
          letterSpacing: "-0.06em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {step.num}
      </div>

      {/* Bottom teal accent line */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(43,200,183,0.35) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "clamp(28px, 3.5vw, 52px)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(43,200,183,0.10)",
            border: "1px solid rgba(43,200,183,0.24)",
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: 24, height: 24, color: "var(--teal-500)" }} strokeWidth={1.75} />
        </div>

        {/* Title + Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: "80%" }}>
          <h3
            style={{
              fontSize: "clamp(22px, 2.8vw, 40px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "white",
              margin: 0,
            }}
          >
            {step.title}
          </h3>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.50)",
              margin: 0,
            }}
          >
            {step.description}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const stripRef   = useRef<HTMLDivElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Extend section height so the user scrolls through the full horizontal travel
    const recalc = () => {
      const travel = getTravel()
      section.style.height = `${window.innerHeight + travel}px`
    }

    let raf = 0
    const update = () => {
      raf = 0
      const s  = sectionRef.current
      const st = stripRef.current
      if (!s || !st) return
      const rect       = s.getBoundingClientRect()
      const scrollable = s.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable))
      st.style.transform = `translateX(${-progress * getTravel()}px)`
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const onResize = () => { recalc(); update() }

    // Double-RAF: wait for DOM layout to settle after initial render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        recalc()
        update()
      })
    })

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      style={{ background: "#0F2349" }}
    >
      {/* Connector dot animation — scoped keyframe */}
      <style>{`
        @keyframes flow-dot-hz {
          0%   { opacity: 0; transform: translateY(-50%) translateX(0px); }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-50%) translateX(${CONNECTOR_W}px); }
        }
      `}</style>

      {/* ── Sticky viewport (pinned at top for the full scroll duration) ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#0F2349",
        }}
        className="grain"
      >
        {/* Ambient glows */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -160, left: -160,
            width: 600, height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(43,200,183,0.10) 0%, transparent 60%)",
            filter: "blur(72px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -160, right: -160,
            width: 480, height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(43,200,183,0.07) 0%, transparent 60%)",
            filter: "blur(72px)",
            pointerEvents: "none",
          }}
        />

        {/* ── Header (stays pinned while cards scroll) ── */}
        <motion.div
          ref={headerRef}
          style={{ padding: "44px clamp(24px, 5vw, 80px) 28px" }}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="mono"
            style={{
              fontSize: 13,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--teal-500)",
              marginBottom: 10,
            }}
          >
            / how it works
          </div>
          <h2
            style={{
              fontSize: "clamp(26px, 3.5vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "white",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            From audit to scale —{" "}
            <span className="shine">four steps.</span>
          </h2>
        </motion.div>

        {/* ── Horizontal strip (driven by scroll progress) ── */}
        <div
          ref={stripRef}
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: "clamp(24px, 5vw, 80px)",
            willChange: "transform",
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
            >
              <StepCard step={step} />
              {i < STEPS.length - 1 && <CircuitConnector />}
            </div>
          ))}
        </div>

        {/* ── Scroll hint dots (bottom center) ── */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            pointerEvents: "none",
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.id}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
