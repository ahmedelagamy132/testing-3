"use client"

import { useRef, useLayoutEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/* ─── Register GSAP plugin ─── */
gsap.registerPlugin(ScrollTrigger)

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

/* ─── Problem Card (Double-Bezel) ─── */
function ProblemCard({
  problem,
  className = "",
}: {
  problem: (typeof PROBLEMS)[0]
  className?: string
}) {
  const Icon = problem.icon === "alert" ? IconAlert : IconClose

  return (
    <div className={`relative group h-full ${className}`}>
      {/* ── Double-Bezel: Outer Shell ── */}
      <div className="p-[6px] rounded-[2rem] ring-1 ring-black/[0.06] dark:ring-white/[0.12] bg-black/[0.03] dark:bg-white/[0.05] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:ring-black/[0.12] dark:group-hover:ring-white/[0.20] group-hover:bg-black/[0.06] dark:group-hover:bg-white/[0.08] h-full">
        {/* ── Double-Bezel: Inner Core ── */}
        <div className="relative overflow-hidden rounded-[calc(2rem-6px)] bg-white dark:bg-[#0e0e18] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_24px_48px_-12px_rgba(15,35,73,0.08)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_24px_48px_-12px_rgba(0,0,0,0.5)] h-full flex flex-col">
          {/* Radial tint — light:amber, dark:teal */}
          <div
            className="absolute inset-0 pointer-events-none dark:hidden"
            style={{
              background:
                "radial-gradient(ellipse at 20% 0%, rgba(251,191,36,0.05) 0%, transparent 60%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none hidden dark:block"
            style={{
              background:
                "radial-gradient(ellipse at 20% 0%, rgba(43,200,183,0.07) 0%, transparent 60%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 p-7 md:p-8 flex flex-col gap-5 h-full">
            {/* Icon + Label row — light:amber, dark:teal */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-400/[0.08] dark:bg-teal-400/[0.08] ring-1 ring-amber-400/20 dark:ring-teal-400/20 text-amber-500 dark:text-teal-400 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
                <Icon />
              </div>
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-amber-500/60 dark:text-teal-400/60 font-medium">
                {problem.label}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-[20px] md:text-[22px] font-bold tracking-[-0.03em] leading-[1.2] text-[var(--ink)]">
              {problem.title}
            </h3>

            {/* Detail */}
            <p className="text-[13px] leading-[1.65] text-[var(--muted)]">
              {problem.detail}
            </p>

            {/* Spacer for tall card */}
            <div className="flex-1 min-h-[20px]" />

            {/* Decorative stat / accent for tall card */}
            {problem.id === "ads" && (
              <div className="pt-4 mt-auto" style={{ borderTop: "1px solid var(--line)" }}>
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] md:text-[40px] font-extrabold tracking-[-0.04em] text-[var(--ink)]/10">
                    01
                  </span>
                  <span className="text-[11px] mono uppercase tracking-[0.14em] text-[var(--muted)]/40">
                    of 3 traps
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom stress line — light:amber/red, dark:teal */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1.5px] pointer-events-none dark:hidden"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.15) 30%, rgba(239,68,68,0.1) 60%, transparent 100%)",
            }}
            aria-hidden
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[1.5px] pointer-events-none hidden dark:block"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(43,200,183,0.18) 40%, rgba(43,200,183,0.08) 70%, transparent 100%)",
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
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
      gsap.set(cards, {
        opacity: 0,
        y: 60,
        scale: 0.96,
      })
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

      /* ── Phase 1: Bento Reveal (0% → 22%) ── */
      tl.to(
        card1Ref.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.10, ease: easeCustom },
        0
      )
      tl.to(
        card2Ref.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.10, ease: easeCustom },
        0.05
      )
      tl.to(
        card3Ref.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.10, ease: easeCustom },
        0.10
      )

      /* ── Phase 2: Parallax Drift (22% → 48%) ── */
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
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
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
            <div className="mb-10 md:mb-12 text-center md:text-left">
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
                <ProblemCard problem={PROBLEMS[0]} />
              </div>

              {/* Trap 02 */}
              <div
                ref={card2Ref}
                className="will-change-transform"
              >
                <ProblemCard problem={PROBLEMS[1]} />
              </div>

              {/* Trap 03 */}
              <div
                ref={card3Ref}
                className="will-change-transform"
              >
                <ProblemCard problem={PROBLEMS[2]} />
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
