"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import type { HowItWorksData } from "@/lib/types"

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

// ─── Data ─────────────────────────────────────────────────────────────────────
type Step = {
  id: string
  num: string
  title: string
  description: string
  imageUrl: string
}

const DEFAULT_STEPS: Step[] = [
  {
    id: "analyze",
    num: "01",
    title: "Analyze Your Business",
    description:
      "We audit your channels, funnels, and conversion gaps to build a complete picture of where you stand and where the biggest opportunities hide.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "strategy",
    num: "02",
    title: "Build a Custom Strategy",
    description:
      "A system blueprint tailored to your market, audience, and goals — no templates, no guesswork, just a clear plan for growth.",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "launch",
    num: "03",
    title: "Launch & Optimize the System",
    description:
      "Everything goes live and gets tuned until it performs. We test, iterate, and refine until every metric is moving in the right direction.",
    imageUrl:
      "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "scale",
    num: "04",
    title: "Scale Your Results",
    description:
      "More traffic, better conversions, automated follow-up — compounding returns that grow your business while you focus on what you do best.",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
  },
]

// ─── Step Slide ───────────────────────────────────────────────────────────────
function StepSlide({
  step,
  index,
  progress,
  isDark,
  isMobile,
  totalSteps,
}: {
  step: Step
  index: number
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
  isDark: boolean
  isMobile?: boolean
  totalSteps: number
}) {
  const slideStart = index / totalSteps
  const slideEnd = (index + 1) / totalSteps

  const local = useTransform(progress, [slideStart, slideEnd], [0, 1])

  const textY = useTransform(local, [0, 0.3, 0.7, 1], [120, 0, 0, -120])
  const textOpacity = useTransform(local, [0, 0.15, 0.85, 1], [0, 1, 1, 0])

  const imageX = useTransform(local, [0, 0.3, 0.7, 1], [200, 0, 0, -200])
  const imageScale = useTransform(local, [0, 0.3, 0.7, 1], [1.15, 1, 1, 1.15])
  const imageOpacity = useTransform(local, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const numScale = useTransform(local, [0, 0.25, 0.75, 1], [0.6, 1, 1, 0.6])
  const numOpacity = useTransform(local, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {/* ── Background Image ── */}
      <motion.div
        style={{
          position: "absolute",
          right: isMobile ? undefined : 0,
          top: 0,
          width: isMobile ? "100%" : "55%",
          height: "100%",
          x: isMobile ? undefined : imageX,
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
          <Image
            src={step.imageUrl}
            alt={step.title}
            fill
            unoptimized
            style={{
              objectFit: "cover",
              objectPosition: isMobile ? "center top" : "center",
            }}
          />

          {!isMobile && (
            <>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: isDark
                    ? "linear-gradient(to right, #020204 0%, rgba(2,2,4,0.92) 25%, transparent 60%)"
                    : "linear-gradient(to right, #F6F8FC 0%, rgba(246,248,252,0.92) 25%, transparent 60%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: isDark
                    ? "linear-gradient(to top, #020204 0%, transparent 25%), linear-gradient(to bottom, #020204 0%, transparent 25%)"
                    : "linear-gradient(to top, #F6F8FC 0%, transparent 25%), linear-gradient(to bottom, #F6F8FC 0%, transparent 25%)",
                }}
              />
            </>
          )}

          {isMobile && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: isDark
                  ? "linear-gradient(to top, rgba(2,2,4,0.98) 0%, rgba(2,2,4,0.85) 35%, rgba(2,2,4,0.4) 65%, rgba(2,2,4,0.15) 100%)"
                  : "linear-gradient(to top, rgba(246,248,252,0.98) 0%, rgba(246,248,252,0.85) 35%, rgba(246,248,252,0.4) 65%, rgba(246,248,252,0.15) 100%)",
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* ── Text ── */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 20,
          width: isMobile ? "100%" : "50%",
          height: isMobile ? "auto" : "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: isMobile ? "flex-end" : "center",
          padding: isMobile
            ? "24px 24px 100px"
            : "clamp(40px, 6vw, 120px)",
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
              fontSize: isMobile
                ? "clamp(48px, 14vw, 80px)"
                : "clamp(64px, 10vw, 160px)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "var(--teal-500)",
              marginBottom: isMobile ? 12 : "clamp(16px, 2vw, 32px)",
              textShadow: "0 0 60px rgba(43,200,183,0.25)",
            }}
          >
            {step.num}
          </div>
        </motion.div>

        {/* Title */}
        <h3
          style={{
            fontSize: isMobile
              ? "clamp(24px, 7vw, 36px)"
              : "clamp(28px, 3.5vw, 56px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: isDark ? "white" : "var(--ink)",
            margin: "0 0 clamp(12px, 1.5vw, 24px) 0",
            maxWidth: isMobile ? "100%" : 600,
          }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: isMobile
              ? "clamp(14px, 4vw, 16px)"
              : "clamp(15px, 1.2vw, 20px)",
            lineHeight: 1.7,
            color: isDark ? "rgba(255,255,255,0.75)" : "var(--muted)",
            margin: 0,
            maxWidth: isMobile ? "100%" : 520,
          }}
        >
          {step.description}
        </p>

        {/* Accent line */}
        <div
          style={{
            marginTop: isMobile ? 20 : "clamp(24px, 3vw, 48px)",
            width: 60,
            height: 3,
            borderRadius: 2,
            background: "var(--teal-500)",
            boxShadow: "0 0 20px rgba(43,200,183,0.4)",
          }}
        />
      </motion.div>

      {/* Step indicator pill */}
      <motion.div
        style={{
          position: "absolute",
          bottom: isMobile ? 24 : "clamp(32px, 4vw, 64px)",
          left: isMobile ? 24 : "clamp(40px, 6vw, 120px)",
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
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,35,73,0.05)",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,35,73,0.1)",
            backdropFilter: "blur(12px)",
            fontSize: 13,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: isDark ? "rgba(255,255,255,0.5)" : "var(--muted)",
          }}
        >
          <span style={{ color: "var(--teal-500)" }}>{step.num}</span>
          <span style={{ width: 1, height: 12, background: isDark ? "rgba(255,255,255,0.15)" : "rgba(15,35,73,0.15)" }} />
          <span>0{totalSteps}</span>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ progress, isDark }: { progress: ReturnType<typeof useScroll>["scrollYProgress"], isDark: boolean }) {
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
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,35,73,0.1)",
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
export default function HowItWorks({ data }: { data?: HowItWorksData }) {
  const eyebrow  = data?.eyebrow  ?? "/ how it works"
  const headline = data?.headline ?? "From audit to scale —"
  const steps: Step[] = data?.steps?.length ? (data.steps as Step[]) : DEFAULT_STEPS

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })
  const isDark = useIsDark()
  const isMobile = useIsMobile()
  const bg = isDark ? "#020204" : "var(--paper)"

  return (
    <>
      <ProgressBar progress={scrollYProgress} isDark={isDark} />

      <section
        ref={sectionRef}
        id="how-it-works"
        style={{
          position: "relative",
          height: `${steps.length * 100}vh`,
          background: bg,
        }}
      >
        {/* Sticky viewport */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            background: bg,
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
              padding: isMobile
                ? "24px 24px 20px"
                : "clamp(32px, 4vw, 64px) clamp(40px, 6vw, 120px)",
              pointerEvents: "none",
              background: isMobile
                ? isDark
                  ? "linear-gradient(to bottom, #020204 0%, rgba(2,2,4,0.9) 60%, transparent 100%)"
                  : "linear-gradient(to bottom, #F6F8FC 0%, rgba(246,248,252,0.9) 60%, transparent 100%)"
                : undefined,
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
              {eyebrow}
            </div>
            <h2
              style={{
                fontSize: isMobile
                  ? "clamp(20px, 5.5vw, 28px)"
                  : "clamp(24px, 3vw, 42px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: isDark ? "white" : "var(--ink)",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {headline}{" "}
              <span className="shine">four steps.</span>
            </h2>
          </div>

          {/* Slides */}
          {steps.map((step, i) => (
            <StepSlide
              key={step.id}
              step={step}
              index={i}
              progress={scrollYProgress}
              isDark={isDark}
              isMobile={isMobile}
              totalSteps={steps.length}
            />
          ))}
        </div>
      </section>
    </>
  )
}
