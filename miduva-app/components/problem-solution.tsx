"use client"

import { useRef, useState, useLayoutEffect, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "motion/react"

/* ─── Register GSAP plugin ─── */
gsap.registerPlugin(ScrollTrigger)

/* ─── Dark-mode hook ─── */
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

/* ─── Data ─── */
const PROBLEMS = [
  {
    id: "ads",
    label: "Trap 01",
    title: "Traffic that goes nowhere",
    detail: "You're buying clicks. Not customers. Your ad spend is a leaky bucket.",
    icon: "close" as const,
  },
  {
    id: "traffic",
    label: "Trap 02",
    title: "Visitors that bounce",
    detail: "People land, scan, leave. No funnel. No follow-up. No revenue.",
    icon: "alert" as const,
  },
  {
    id: "leads",
    label: "Trap 03",
    title: "Leads that go cold",
    detail: "Hot prospects slip through the cracks. No system to catch them.",
    icon: "close" as const,
  },
]

/* ─── Custom ease reference ─── */
const easeCustom = "power3.inOut"

/* ─── Ultra-thin line icons (Phosphor-style) ─── */
function IconClose({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}

function IconAlert({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function IconArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ─── Noise texture overlay ─── */
function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }}
      aria-hidden
    />
  )
}

/* ─── Problem Card (WhyMiduva Style) ─── */
function ProblemCard({
  problem,
  index,
  className = "",
}: {
  problem: (typeof PROBLEMS)[0]
  index: number
  className?: string
}) {
  const entranceRef = useRef<HTMLDivElement>(null)
  const hoverRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(entranceRef, { once: true, margin: "-60px" })
  const isDark = useIsDark()
  const Icon = problem.icon === "alert" ? IconAlert : IconClose

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const liftY = useMotionValue(0)

  const springCfg = { stiffness: 120, damping: 18 }
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), springCfg)
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [5, -5]), springCfg)
  const springY = useSpring(liftY, springCfg)

  const num = problem.label.replace("Trap ", "")

  return (
    <motion.div
      ref={entranceRef}
      className={`relative group h-full ${className}`}
      style={{ perspective: 900 }}
      initial={{ opacity: 0, y: 60, scale: 0.96, filter: "blur(8px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, y: 60, scale: 0.96, filter: "blur(8px)" }
      }
      transition={{
        duration: 0.8,
        delay: 0.15 + index * 0.12,
        ease: [0.32, 0.72, 0, 1],
      }}
    >
      {/* ── Double-Bezel Outer Shell ── */}
      <motion.div
        ref={hoverRef}
        className={`relative h-full p-[5px] rounded-[2rem] ring-1 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isDark
            ? "bg-white/[0.03] ring-white/[0.08] group-hover:ring-white/[0.16] group-hover:bg-white/[0.05]"
            : "bg-[var(--chip)] ring-[var(--line)] group-hover:ring-[var(--teal-500)]/30 group-hover:bg-[var(--paper-2)]"
        }`}
        style={{
          rotateX,
          rotateY,
          y: springY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={(e) => {
          const rect = hoverRef.current?.getBoundingClientRect()
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
          className={`relative h-full overflow-hidden rounded-[calc(2rem-5px)] transition-shadow duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isDark
              ? "bg-[#08080c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_40px_rgba(43,200,183,0.06)]"
              : "bg-[var(--card)] shadow-[inset_0_1px_1px_rgba(15,35,73,0.06)] group-hover:shadow-[inset_0_1px_1px_rgba(15,35,73,0.1),0_0_40px_rgba(43,200,183,0.06)]"
          }`}
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

          <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
            {/* Icon + Label row */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className={`w-10 h-10 rounded-xl ring-1 flex items-center justify-center flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:ring-teal-500/30 group-hover:bg-teal-500/10 ${
                  isDark ? "bg-white/[0.04] ring-white/[0.1]" : "bg-[var(--chip)] ring-[var(--line)]"
                }`}
              >
                <Icon className="w-[18px] h-[18px] text-teal-400/80 transition-colors duration-500 group-hover:text-teal-400" />
              </div>
              <span
                className={`text-[10px] uppercase tracking-[0.2em] font-medium mono ${
                  isDark ? "text-white/30" : "text-[var(--muted)]"
                }`}
              >
                {problem.label}
              </span>
            </div>

            {/* Title */}
            <h3
              className={`text-[20px] md:text-[22px] font-extrabold tracking-[-0.03em] leading-[1.2] mb-3 ${
                isDark ? "text-white" : "text-[var(--ink)]"
              }`}
            >
              {problem.title}
            </h3>

            {/* Teal underline */}
            <div
              className={`h-[2px] rounded-full overflow-hidden mb-5 max-w-[120px] ${
                isDark ? "bg-white/[0.06]" : "bg-[var(--line)]"
              }`}
            >
              <div className="h-full bg-teal-500 rounded-full origin-left scale-x-100" />
            </div>

            {/* Detail */}
            <p
              className={`text-[13px] leading-[1.65] ${
                isDark ? "text-white/50" : "text-[var(--muted)]"
              }`}
            >
              {problem.detail}
            </p>

            {/* Spacer */}
            <div className="flex-1 min-h-[20px]" />
          </div>

          {/* Giant ambient number */}
          <div
            aria-hidden
            className={`absolute bottom-[-16px] right-2 text-[clamp(80px,10vw,140px)] font-extrabold leading-none tracking-[-0.06em] pointer-events-none select-none mono transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[-4px] ${
              isDark
                ? "text-white/[0.04] group-hover:text-white/[0.06]"
                : "text-[var(--ink)]/[0.04] group-hover:text-[var(--ink)]/[0.06]"
            }`}
          >
            {num}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main Section ─── */
export default function ProblemSolution() {
  const outerRef = useRef<HTMLDivElement>(null)
  const bentoRef = useRef<HTMLDivElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)
  const solutionRef = useRef<HTMLDivElement>(null)
  const solutionInnerRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLParagraphElement>(null)
  const subheadRef = useRef<HTMLParagraphElement>(null)
  const bulletsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = [card1Ref.current, card2Ref.current, card3Ref.current]
      const solutionEls = [
        eyebrowRef.current,
        headlineRef.current,
        subheadRef.current,
        bulletsRef.current,
        ctaRef.current,
      ]

      /* ── Initial states ── */
      gsap.set(solutionRef.current, {
        scale: 0.65,
        opacity: 0,
        y: "35vh",
      })
      gsap.set(solutionEls, {
        opacity: 0,
        y: 24,
      })

      /* ── Scroll-driven timeline ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      })

      /* ── Phase 1: Parallax Drift (0% → 26%) ── */
      tl.to(
        card1Ref.current,
        { y: "-4vh", duration: 0.18, ease: "none" },
        0.22
      )
      tl.to(
        card2Ref.current,
        { y: "-10vh", duration: 0.18, ease: "none" },
        0.22
      )
      tl.to(
        card3Ref.current,
        { y: "-16vh", duration: 0.18, ease: "none" },
        0.22
      )
      tl.to(
        solutionRef.current,
        { y: "8vh", scale: 0.82, opacity: 0.25, duration: 0.18, ease: "none" },
        0.22
      )

      /* ── Phase 3: THE EXPLOSION (48% → 75%) ── */
      tl.to(
        card1Ref.current,
        {
          x: "-38vw",
          y: "-32vh",
          rotate: -14,
          scale: 0.52,
          opacity: 0,
          duration: 0.20,
          ease: easeCustom,
        },
        0.48
      )
      tl.to(
        card2Ref.current,
        {
          x: "40vw",
          y: "-22vh",
          rotate: 11,
          scale: 0.52,
          opacity: 0,
          duration: 0.20,
          ease: easeCustom,
        },
        0.51
      )
      tl.to(
        card3Ref.current,
        {
          x: "32vw",
          y: "28vh",
          rotate: -9,
          scale: 0.52,
          opacity: 0,
          duration: 0.20,
          ease: easeCustom,
        },
        0.54
      )
      tl.to(
        solutionRef.current,
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.22,
          ease: easeCustom,
        },
        0.50
      )

      /* ── Phase 4: Solution Content Reveal (75% → 100%) ── */
      tl.to(
        eyebrowRef.current,
        { opacity: 1, y: 0, duration: 0.06, ease: easeCustom },
        0.75
      )
      tl.to(
        headlineRef.current,
        { opacity: 1, y: 0, duration: 0.08, ease: easeCustom },
        0.78
      )
      tl.to(
        subheadRef.current,
        { opacity: 1, y: 0, duration: 0.07, ease: easeCustom },
        0.82
      )
      tl.to(
        bulletsRef.current,
        { opacity: 1, y: 0, duration: 0.07, ease: easeCustom },
        0.86
      )
      tl.to(
        ctaRef.current,
        { opacity: 1, y: 0, duration: 0.06, ease: easeCustom },
        0.91
      )
    }, outerRef)

    return () => ctx.revert()
  }, [])

  const bullets = [
    "Ads engineered to attract ready buyers",
    "Funnels built to convert, not decorate",
    "Automation that nurtures while you sleep",
  ]

  return (
    <section
      id="problem-solution"
      className="relative"
    >
      {/* ── Tall scroll track ── */}
      <div
        ref={outerRef}
        className="relative h-[300vh] md:h-[350vh] w-full bg-[#F8F9FB] dark:bg-[#020204]"
      >
        <NoiseOverlay />

        {/* ── Sticky viewport ── */}
        <div className="sticky top-0 h-screen w-full overflow-y-auto md:overflow-hidden flex items-center justify-center">
          {/* Ambient background glow */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(43,200,183,0.06) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
            aria-hidden
          />

          {/* ── Bento Grid (Problems) ── */}
          <div
            ref={bentoRef}
            className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-8"
          >
            {/* Section header — fades with the bento */}
            <div className="mb-4 md:mb-10 text-center md:text-left">
              <div className="inline-flex mb-4">
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--teal-500)] font-medium px-3 py-1 rounded-full bg-[var(--teal-500)]/[0.06] ring-1 ring-[var(--teal-500)]/15">
                  / the problem
                </span>
              </div>
              <h2 className="text-[36px] md:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.04em] text-[var(--ink)] leading-[1.05]">
                Three traps that
                <br className="hidden md:block" />
                {" "}kill growth.
              </h2>
            </div>

            {/* Asymmetrical Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-[1fr]">
              {/* Trap 01 — tall hero card */}
              <div
                ref={card1Ref}
                className="md:row-span-2 will-change-transform"
              >
                <ProblemCard problem={PROBLEMS[0]} index={0} />
              </div>

              {/* Trap 02 */}
              <div
                ref={card2Ref}
                className="will-change-transform"
              >
                <ProblemCard problem={PROBLEMS[1]} index={1} />
              </div>

              {/* Trap 03 */}
              <div
                ref={card3Ref}
                className="will-change-transform"
              >
                <ProblemCard problem={PROBLEMS[2]} index={2} />
              </div>
            </div>
          </div>

          {/* ── Solution Overlay (appears on top after explosion) ── */}
          <div
            ref={solutionRef}
            className="absolute inset-0 z-20 flex items-center justify-center p-6 md:p-12 lg:p-20 will-change-transform"
          >
            <div className="w-full max-w-5xl mx-auto">
              {/* Double-Bezel Outer Shell */}
              <div className="p-[6px] rounded-[2rem] bg-[#0F2349]/[0.08] dark:bg-white/[0.03] ring-1 ring-[#0F2349]/10 dark:ring-white/[0.08]">
                {/* Double-Bezel Inner Core */}
                <div
                  ref={solutionInnerRef}
                  className="relative overflow-hidden rounded-[calc(2rem-6px)] bg-[#0F2349] dark:bg-[#020204]"
                >
                  {/* Teal glow — top left */}
                  <div
                    className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(43,200,183,0.18) 0%, transparent 65%)",
                      filter: "blur(52px)",
                    }}
                    aria-hidden
                  />
                  {/* Teal glow — bottom right */}
                  <div
                    className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(43,200,183,0.13) 0%, transparent 65%)",
                      filter: "blur(44px)",
                    }}
                    aria-hidden
                  />

                  <div className="relative z-10 px-8 py-12 md:px-14 md:py-16 lg:px-20 lg:py-20 flex flex-col gap-7 md:gap-8">
                    {/* Eyebrow */}
                    <div ref={eyebrowRef} className="inline-flex">
                      <span className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--teal-500)] font-medium px-3 py-1 rounded-full bg-[var(--teal-500)]/[0.08] ring-1 ring-[var(--teal-500)]/15">
                        / the solution
                      </span>
                    </div>

                    {/* Headline */}
                    <p
                      ref={headlineRef}
                      className="text-[28px] md:text-[44px] lg:text-[56px] font-extrabold tracking-[-0.035em] leading-[1.08] text-white max-w-4xl"
                    >
                      One system.{" "}
                      <span className="shine">Zero gaps.</span>
                    </p>

                    {/* Subhead */}
                    <p
                      ref={subheadRef}
                      className="text-[15px] md:text-[16px] leading-[1.6] text-white/40 max-w-2xl -mt-2 md:-mt-3"
                    >
                      We build the machine that fixes all three traps.
                    </p>

                    {/* Bullets */}
                    <div ref={bulletsRef} className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
                      {bullets.map((point) => (
                        <div
                          key={point}
                          className="flex items-center gap-2.5"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2BC8B7]/15 flex items-center justify-center">
                            <IconCheck className="text-[#2BC8B7]" />
                          </span>
                          <span className="text-[14px] font-medium text-white/50 tracking-tight">
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA strip with Button-in-Button */}
                    <div
                      ref={ctaRef}
                      className="pt-8 flex items-center justify-between flex-wrap gap-4"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <p className="mono text-[11px] uppercase tracking-[0.18em] text-white/25">
                        One connected machine. End-to-end.
                      </p>

                      <a
                        href="#cta"
                        className="group/btn inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full text-[13px] font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background: "#2BC8B7", color: "#020204" }}
                      >
                        <span>See How It Works</span>
                        {/* Button-in-Button Trailing Icon */}
                        <span className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-[1px] group-hover/btn:scale-105">
                          <IconArrowUpRight />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
