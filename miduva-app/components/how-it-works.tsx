"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

// ─── Data ─────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "analyze",
    num: "01",
    title: "Analyze Your Business",
    description:
      "We audit your channels, funnels, and conversion gaps to build a complete picture of where you stand and where the biggest opportunities hide.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "strategy",
    num: "02",
    title: "Build a Custom Strategy",
    description:
      "A system blueprint tailored to your market, audience, and goals — no templates, no guesswork, just a clear plan for growth.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "launch",
    num: "03",
    title: "Launch & Optimize the System",
    description:
      "Everything goes live and gets tuned until it performs. We test, iterate, and refine until every metric is moving in the right direction.",
    image:
      "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "scale",
    num: "04",
    title: "Scale Your Results",
    description:
      "More traffic, better conversions, automated follow-up — compounding returns that grow your business while you focus on what you do best.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
  },
] as const

// ─── Step Slide ───────────────────────────────────────────────────────────────
function StepSlide({
  step,
  index,
  progress,
}: {
  step: (typeof STEPS)[number]
  index: number
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
}) {
  // Each slide is active during its quarter of the scroll range
  const slideStart = index / STEPS.length
  const slideEnd = (index + 1) / STEPS.length

  // Map global progress to local 0-1 for this slide
  const local = useTransform(progress, [slideStart, slideEnd], [0, 1])

  // Text comes in from bottom
  const textY = useTransform(local, [0, 0.3, 0.7, 1], [120, 0, 0, -120])
  const textOpacity = useTransform(local, [0, 0.15, 0.85, 1], [0, 1, 1, 0])

  // Image comes in from right with parallax
  const imageX = useTransform(local, [0, 0.3, 0.7, 1], [200, 0, 0, -200])
  const imageScale = useTransform(local, [0, 0.3, 0.7, 1], [1.15, 1, 1, 1.15])
  const imageOpacity = useTransform(local, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Number scale / opacity
  const numScale = useTransform(local, [0, 0.25, 0.75, 1], [0.6, 1, 1, 0.6])
  const numOpacity = useTransform(local, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {/* ── Left: Text ── */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 20,
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(40px, 6vw, 120px)",
          y: textY,
          opacity: textOpacity,
        }}
      >
        {/* Giant number */}
        <motion.div
          style={{
            scale: numScale,
            opacity: numOpacity,
          }}
          className="mono"
        >
          <div
            style={{
              fontSize: "clamp(64px, 10vw, 160px)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "var(--teal-500)",
              marginBottom: "clamp(16px, 2vw, 32px)",
              textShadow: "0 0 60px rgba(43,200,183,0.25)",
            }}
          >
            {step.num}
          </div>
        </motion.div>

        {/* Title */}
        <h3
          style={{
            fontSize: "clamp(28px, 3.5vw, 56px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "white",
            margin: "0 0 clamp(12px, 1.5vw, 24px) 0",
            maxWidth: 600,
          }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: "clamp(15px, 1.2vw, 20px)",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.55)",
            margin: 0,
            maxWidth: 520,
          }}
        >
          {step.description}
        </p>

        {/* Accent line */}
        <div
          style={{
            marginTop: "clamp(24px, 3vw, 48px)",
            width: 60,
            height: 3,
            borderRadius: 2,
            background: "var(--teal-500)",
            boxShadow: "0 0 20px rgba(43,200,183,0.4)",
          }}
        />
      </motion.div>

      {/* ── Right: Image ── */}
      <motion.div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "55%",
          height: "100%",
          x: imageX,
          opacity: imageOpacity,
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            scale: imageScale,
          }}
        >
          {/* Image */}
          <img
            src={step.image}
            alt={step.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />

          {/* Gradient overlays for seamless blending */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, #0F2349 0%, rgba(15,35,73,0.85) 25%, transparent 60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, #0F2349 0%, transparent 25%), linear-gradient(to bottom, #0F2349 0%, transparent 25%)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Step indicator pill */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "clamp(32px, 4vw, 64px)",
          left: "clamp(40px, 6vw, 120px)",
          zIndex: 30,
          opacity: textOpacity,
        }}
        className="mono"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 20px",
            borderRadius: 100,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            fontSize: 13,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span style={{ color: "var(--teal-500)" }}>{step.num}</span>
          <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.15)" }} />
          <span>0{STEPS.length}</span>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const scaleX = useTransform(progress, [0, 1], [0, 1])

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 100,
        background: "rgba(255,255,255,0.06)",
      }}
    >
      <motion.div
        style={{
          height: "100%",
          background: "var(--teal-500)",
          boxShadow: "0 0 12px rgba(43,200,183,0.5)",
          transformOrigin: "left",
          scaleX,
        }}
      />
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  return (
    <>
      <ProgressBar progress={scrollYProgress} />

      <section
        ref={sectionRef}
        id="how-it-works"
        style={{
          position: "relative",
          height: `${STEPS.length * 100}vh`,
          background: "#0F2349",
        }}
      >
        {/* Sticky viewport */}
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
              top: -200,
              left: -200,
              width: 700,
              height: 700,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(43,200,183,0.10) 0%, transparent 60%)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: -200,
              right: -200,
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(43,200,183,0.07) 0%, transparent 60%)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />

          {/* Header */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              padding: "clamp(32px, 4vw, 64px) clamp(40px, 6vw, 120px)",
              pointerEvents: "none",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 13,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--teal-500)",
                marginBottom: 12,
              }}
            >
              / how it works
            </div>
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 42px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "white",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              From audit to scale —{" "}
              <span className="shine">four steps.</span>
            </h2>
          </div>

          {/* Slides */}
          {STEPS.map((step, i) => (
            <StepSlide key={step.id} step={step} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </section>
    </>
  )
}
