"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { ProblemSolutionData, ProblemCard as ProblemCardData } from "@/lib/types"
import {
  bindFrameScrollProgress,
  STICKY_SCROLL_RANGE,
  useFrameInView,
  useFrameMediaQuery,
  useFrameRuntime,
} from "@/components/puck/frame-runtime"

/* ─── Register GSAP plugin ─── */
gsap.registerPlugin(ScrollTrigger)

/* ─── Default Data ─── */
const DEFAULT_PROBLEMS: ProblemCardData[] = [
  {
    id: "ads",
    num: "01",
    label: "Trap 01",
    title: "Traffic that goes nowhere",
    detail: "You're buying clicks. Not customers. Your ad spend is a leaky bucket.",
    icon: "close",
  },
  {
    id: "traffic",
    num: "02",
    label: "Trap 02",
    title: "Visitors that bounce",
    detail: "People land, scan, leave. No funnel. No follow-up. No revenue.",
    icon: "alert",
  },
  {
    id: "leads",
    num: "03",
    label: "Trap 03",
    title: "Leads that go cold",
    detail: "Hot prospects slip through the cracks. No system to catch them.",
    icon: "close",
  },
]

const DEFAULT_BULLETS = [
  "Ads engineered to attract ready buyers",
  "Funnels built to convert, not decorate",
  "Automation that nurtures while you sleep",
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

/* ─── Problem Card ─── */
// Brand palette only: teal marks what works, navy/muted marks what is lost.
const TEAL = "#2BC8B7"
const TEAL_SOFT = "rgba(43,200,183,0.14)"

// What each trap costs. Illustrative figures shown under each card.
const TRAP_STATS = [
  { value: "68%", label: "of ad spend never converts" },
  { value: "74%", label: "of visitors leave in seconds" },
  { value: "4 in 5", label: "leads never get a follow-up" },
]

/* Trap 01 — a campaign report where spend collapses into a handful of customers. */
const SPEND_ROWS = [
  { label: "Clicks", value: "12,480", pct: 100 },
  { label: "Visits", value: "7,310", pct: 58 },
  { label: "Leads", value: "214", pct: 14 },
  { label: "Customers", value: "9", pct: 3, win: true },
]

function SpendReport({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-5" aria-hidden>
      <div className="w-full max-w-[250px] rounded-[12px] border border-[var(--line)] bg-[var(--card)] px-3.5 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="flex items-center gap-1.5 mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: TEAL }}
              animate={active ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            Campaign · 30d
          </span>
          <span className="mono text-[9px] uppercase tracking-[0.12em] text-[var(--navy-900)]">$24k spent</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {SPEND_ROWS.map((row, i) => (
            <div key={row.label} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-medium" style={{ color: row.win ? TEAL : "var(--muted)" }}>{row.label}</span>
                <span className="mono text-[10px] font-semibold" style={{ color: row.win ? TEAL : "var(--navy-900)" }}>{row.value}</span>
              </div>
              <span className="relative h-[5px] rounded-full bg-[var(--chip)] overflow-hidden">
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: row.win ? TEAL : "var(--navy-600)", opacity: row.win ? 1 : 0.55 - i * 0.08 }}
                  initial={{ width: "0%" }}
                  animate={{ width: active ? `${Math.max(row.pct, 3)}%` : "0%" }}
                  transition={{ duration: 1.1, delay: 0.2 + i * 0.22, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Trap 02 — visitors land on the page and leave straight away. */
const CURSORS = [
  { from: [-70, 50], at: [40, 30], to: [150, -30], delay: 0 },
  { from: [60, 110], at: [90, 55], to: [-40, 120], delay: 0.9 },
  { from: [200, 90], at: [130, 40], to: [230, -20], delay: 1.8 },
]

function BouncingVisitors({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center" aria-hidden>
      {/* Mini landing page */}
      <div className="relative mt-6 w-[190px] h-[118px] rounded-[10px] border border-[var(--line)] bg-[var(--card)] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
        <div className="flex items-center gap-1 px-2.5 h-5 border-b border-[var(--line)]">
          {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--line)]" />)}
        </div>
        <div className="p-3 flex flex-col gap-1.5">
          <span className="h-2 w-[70%] rounded-full bg-[var(--muted)] opacity-25" />
          <span className="h-1.5 w-[90%] rounded-full bg-[var(--muted)] opacity-15" />
          <span className="h-1.5 w-[60%] rounded-full bg-[var(--muted)] opacity-15" />
          <span className="mt-2 h-4 w-14 rounded-full" style={{ background: TEAL_SOFT }} />
        </div>
        {CURSORS.map((c, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 24 24"
            className="absolute top-0 left-0 w-4 h-4"
            initial={{ x: c.from[0], y: c.from[1], opacity: 0 }}
            animate={active ? { x: [c.from[0], c.at[0], c.at[0], c.to[0]], y: [c.from[1], c.at[1], c.at[1], c.to[1]], opacity: [0, 1, 1, 0] } : { opacity: 0 }}
            transition={{ duration: 2.4, delay: c.delay, repeat: Infinity, repeatDelay: 0.3, times: [0, 0.35, 0.55, 1], ease: "easeInOut" }}
          >
            <path d="M4 3l7 17 2.5-7.5L21 10z" fill="var(--ink)" stroke="var(--card)" strokeWidth="1.2" strokeLinejoin="round" />
          </motion.svg>
        ))}
      </div>

      {/* Bounce-rate meter */}
      <div className="absolute right-3 top-3 md:right-4 md:top-4 flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--card)] pl-2.5 pr-3 py-1">
        <span className="mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">Bounce</span>
        <span className="relative w-10 h-1 rounded-full bg-[var(--line)] overflow-hidden">
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full bg-[var(--navy-600)]"
            initial={{ width: "0%" }}
            animate={{ width: active ? "74%" : "0%" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
        <span className="mono text-[9px] text-[var(--navy-900)]">74%</span>
      </div>
    </div>
  )
}

/* Trap 03 — new leads arrive hot, sit unanswered, and cool off the list. */
const TEMPS = [
  { label: "Hot", color: "var(--teal-500)", bg: "rgba(43,200,183,0.14)", wait: "now" },
  { label: "Warm", color: "var(--navy-600)", bg: "var(--chip)", wait: "6h" },
  { label: "Cold", color: "var(--muted)", bg: "var(--chip)", wait: "2d" },
]
const LEAD_WIDTHS = [62, 48, 70, 54, 66, 44]

function ColdLeads({ active }: { active: boolean }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => setTick((t) => t + 1), 1800)
    return () => window.clearInterval(id)
  }, [active])

  const rows = [0, 1, 2].map((pos) => ({ key: tick - pos, pos }))

  return (
    <div className="relative w-full h-full flex items-center justify-center px-5" aria-hidden>
      <div className="w-full max-w-[240px] flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1 mb-0.5">
          <span className="mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">Inbox · leads</span>
          <span className="mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">No reply</span>
        </div>
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map(({ key, pos }) => {
            const t = TEMPS[pos]
            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: pos === 2 ? 0.55 : 1, y: 0 }}
                exit={{ opacity: 0, y: 14, filter: "blur(2px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2.5 rounded-[10px] border border-[var(--line)] bg-[var(--card)] px-2.5 py-2"
              >
                <span className="w-5 h-5 rounded-full flex-shrink-0 transition-colors duration-700" style={{ background: t.bg, boxShadow: `inset 0 0 0 1px ${t.color}` }} />
                <span className="h-1.5 rounded-full bg-[var(--muted)] opacity-25" style={{ width: `${LEAD_WIDTHS[((key % 6) + 6) % 6]}px` }} />
                <span className="ml-auto flex items-center gap-2">
                  <span
                    className="mono text-[9px] uppercase tracking-[0.12em] rounded-full px-1.5 py-0.5 transition-colors duration-700"
                    style={{ color: t.color, background: t.bg }}
                  >
                    {t.label}
                  </span>
                  <span className="mono text-[9px] text-[var(--muted)] w-6 text-right">{t.wait}</span>
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

const TRAP_VISUALS = [SpendReport, BouncingVisitors, ColdLeads]

function ProblemCard({
  problem,
  index,
  className = "",
}: {
  problem: ProblemCardData
  index: number
  className?: string
}) {
  const entranceRef = useRef<HTMLDivElement>(null)
  const isInView = useFrameInView(entranceRef, { once: true, margin: "-60px" })
  const reduceMotion = useReducedMotion()
  const Icon = problem.icon === "alert" ? IconAlert : IconClose
  const Visual = TRAP_VISUALS[index % TRAP_VISUALS.length]
  const stat = TRAP_STATS[index % TRAP_STATS.length]

  return (
    <motion.div
      ref={entranceRef}
      data-edit-path={`problems.${index}`}
      data-miduva-native-id={`problem:${problem.id}`}
      data-trap-card
      className={`group relative h-full flex flex-col overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--card)] shadow-[0_1px_2px_rgba(15,35,73,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(43,200,183,0.35)] hover:shadow-[0_0_40px_rgba(43,200,183,0.06)] ${className}`}
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.55, delay: 0.08 + index * 0.055, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* ── Live illustration ── */}
      <div
        className="relative h-[184px] border-b border-[var(--line)] overflow-hidden"
        style={{
          background: "var(--paper-2)",
          backgroundImage: "radial-gradient(var(--line) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      >
        <div
          aria-hidden
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-56 h-40 rounded-full pointer-events-none opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle, rgba(43,200,183,0.14) 0%, transparent 70%)", filter: "blur(24px)" }}
        />
        <div className="relative h-full">
          <Visual active={isInView && !reduceMotion} />
        </div>
      </div>

      {/* ── Copy ── */}
      <div className="relative flex flex-col flex-1 p-6 md:p-7">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-7 h-7 rounded-lg ring-1 ring-[var(--line)] bg-[var(--chip)] flex items-center justify-center flex-shrink-0 text-[var(--teal-500)]">
            <Icon className="w-4 h-4" />
          </span>
          <span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">{problem.label}</span>
        </div>

        <h3 className="text-[20px] md:text-[22px] font-extrabold tracking-[-0.03em] leading-[1.2] text-[var(--ink)]">
          {problem.title}
        </h3>
        <p className="mt-2 text-[14px] leading-[1.6] text-[var(--muted)]">
          {problem.detail}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-baseline gap-3 pt-4 border-t border-[var(--line)]">
            <span className="text-[26px] font-extrabold tracking-[-0.04em] leading-none text-[var(--navy-900)]">
              {stat.value}
            </span>
            <span className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] leading-[1.4]">
              {stat.label}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Solution: the three fixes wired into one system ─── */
function IconTarget({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className}>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}
function IconFunnel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 4h18l-7 8.5V19l-4 2v-8.5L3 4z" />
    </svg>
  )
}
function IconBolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  )
}
const FLOW_ICONS = [IconTarget, IconFunnel, IconBolt]

function SystemFlow({ bullets }: { bullets: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useFrameInView(ref, { margin: "-40px" })
  const reduceMotion = useReducedMotion()
  const live = isInView && !reduceMotion

  return (
    <div ref={ref} className="relative">
      {/* Spine */}
      <div aria-hidden className="absolute left-[19px] top-5 bottom-7 w-px bg-white/10" />
      {live && (
        <motion.div
          aria-hidden
          className="absolute left-[18px] w-[3px] h-14 rounded-full"
          style={{ background: "linear-gradient(180deg, transparent, #4FD6C7, transparent)", boxShadow: "0 0 12px rgba(79,214,199,0.8)" }}
          initial={{ top: "0%", opacity: 0 }}
          animate={{ top: ["0%", "82%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.85, 1] }}
        />
      )}

      <div className="flex flex-col gap-2.5">
        {bullets.slice(0, 3).map((point, index) => {
          const Icon = FLOW_ICONS[index] ?? IconTarget
          return (
            <div key={point} className="relative flex items-center gap-4" data-edit-path={`solution.bullets.${index}`}>
              <span className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#0A1830] ring-1 ring-[rgba(43,200,183,0.35)] text-[#4FD6C7] shadow-[0_0_20px_rgba(43,200,183,0.15)]">
                <Icon className="w-[18px] h-[18px]" />
              </span>
              <div className="flex-1 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] backdrop-blur-sm px-4 py-3">
                <span className="text-[13px] md:text-[14px] font-semibold text-white/85 tracking-[-0.01em] leading-[1.35]">{point}</span>
                <span className="hidden sm:inline-flex items-center gap-1.5 flex-shrink-0 mono text-[9px] uppercase tracking-[0.16em] text-[#4FD6C7]/80">
                  <IconCheck className="w-3 h-3" />
                  Fixes trap 0{index + 1}
                </span>
              </div>
            </div>
          )
        })}

        {/* Output */}
        <div className="relative flex items-center gap-4 mt-1">
          <span className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#04121F]" style={{ background: "linear-gradient(180deg, #4FD6C7, #2BC8B7)", boxShadow: "0 0 24px rgba(43,200,183,0.45)" }}>
            <IconArrowUpRight />
          </span>
          <div className="flex-1 flex items-center justify-between gap-4 rounded-xl border border-[rgba(43,200,183,0.35)] bg-[rgba(43,200,183,0.08)] px-4 py-3">
            <div className="flex flex-col">
              <span className="mono text-[9px] uppercase tracking-[0.18em] text-[#4FD6C7]/80">Output</span>
              <span className="text-[14px] font-bold text-white tracking-[-0.01em]">Customers, on repeat</span>
            </div>
            <svg viewBox="0 0 120 32" className="w-24 md:w-28 h-8 flex-shrink-0" aria-hidden>
              <defs>
                <linearGradient id="flow-spark" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2BC8B7" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2BC8B7" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M2 28 L20 24 L36 25 L52 18 L68 19 L84 11 L100 9 L118 3 L118 32 L2 32 Z" fill="url(#flow-spark)" />
              <motion.path
                d="M2 28 L20 24 L36 25 L52 18 L68 19 L84 11 L100 9 L118 3"
                fill="none"
                stroke="#4FD6C7"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: reduceMotion ? 1 : 0 }}
                animate={{ pathLength: isInView || reduceMotion ? 1 : 0 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <circle cx="118" cy="3" r="2.5" fill="#4FD6C7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Section ─── */
export default function ProblemSolution({ data }: { data?: ProblemSolutionData }) {
  const problemEyebrow    = data?.problemEyebrow  ?? "/ the problem"
  const problemHeadline   = data?.problemHeadline ?? "Three traps that kill growth."
  const problems          = data?.problems?.length ? data.problems : DEFAULT_PROBLEMS

  const solutionHeadline  = data?.solution?.headline       ?? "One system."
  const solutionAccent    = data?.solution?.headlineAccent ?? "Zero gaps."
  const solutionSub       = data?.solution?.subheadline    ?? "We build the machine that fixes all three traps."
  const bullets           = data?.solution?.bullets?.length ? data.solution.bullets : DEFAULT_BULLETS
  const ctaLabel          = data?.solution?.ctaLabel ?? "See How It Works"
  const ctaHref           = data?.solution?.ctaHref  ?? "#cta"
  const bottomNote        = data?.solution?.bottomNote ?? "One connected machine. End-to-end."

  const outerRef = useRef<HTMLDivElement>(null)
  const bentoRef = useRef<HTMLDivElement>(null)
  const problemHeaderRef = useRef<HTMLDivElement>(null)
  const gridWrapRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const mergeRingRef = useRef<HTMLDivElement>(null)
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

  const runtime = useFrameRuntime()
  const isMobile = useFrameMediaQuery("(max-width: 767px)")

  useLayoutEffect(() => {
    if (!runtime || isMobile) return
    let stopFrameProgress: (() => void) | undefined
    const ctx = gsap.context(() => {
      const solutionEls = [
        eyebrowRef.current,
        headlineRef.current,
        subheadRef.current,
        bulletsRef.current,
        ctaRef.current,
      ]

      const cards = [card1Ref.current, card2Ref.current, card3Ref.current]
      const faces = cards.map((c) => c?.querySelector<HTMLElement>("[data-trap-card]") ?? null)
      const gap = gridRef.current ? parseFloat(getComputedStyle(gridRef.current).columnGap) || 20 : 20
      const headerLift = (problemHeaderRef.current?.offsetHeight ?? 120) + 48

      gsap.set(solutionRef.current, { pointerEvents: "none" })
      gsap.set(solutionInnerRef.current, { clipPath: "inset(50% 0% 50% 0% round 24px)" })
      gsap.set(mergeRingRef.current, { opacity: 0 })
      gsap.set(solutionEls, { opacity: 0, y: 18 })

      const tl = gsap.timeline(runtime.isIframe
        ? { paused: true }
        : {
            scrollTrigger: {
              trigger: outerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          })

      // 1 — "Zero gaps": the three traps slide together into one panel.
      tl.to(cards[0], { x: gap, duration: 0.18, ease: easeCustom }, 0.16)
      tl.to(cards[2], { x: -gap, duration: 0.18, ease: easeCustom }, 0.16)
      tl.to(faces[0], { borderTopRightRadius: 0, borderBottomRightRadius: 0, duration: 0.18, ease: easeCustom }, 0.16)
      tl.to(faces[1], { borderRadius: 0, duration: 0.18, ease: easeCustom }, 0.16)
      tl.to(faces[2], { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, duration: 0.18, ease: easeCustom }, 0.16)
      tl.to(mergeRingRef.current, { opacity: 1, duration: 0.08, ease: "none" }, 0.30)

      // 2 — the merged panel rises to centre and becomes the solution.
      tl.to(problemHeaderRef.current, { opacity: 0, y: -24, duration: 0.12, ease: easeCustom }, 0.38)
      tl.to(gridWrapRef.current, { y: -headerLift / 2, duration: 0.18, ease: easeCustom }, 0.38)
      // The panel splits open along its middle and the solution unfolds from it.
      tl.to(solutionInnerRef.current, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 0.14, ease: easeCustom }, 0.46)
      tl.to(cards, { opacity: 0, duration: 0.04, ease: "none" }, 0.56)
      tl.to(mergeRingRef.current, { opacity: 0, duration: 0.04, ease: "none" }, 0.56)
      tl.set(solutionRef.current, { pointerEvents: "auto" }, 0.56)

      // 3 — the fix, line by line.
      tl.to(eyebrowRef.current,  { opacity: 1, y: 0, duration: 0.06, ease: easeCustom }, 0.56)
      tl.to(headlineRef.current, { opacity: 1, y: 0, duration: 0.08, ease: easeCustom }, 0.60)
      tl.to(subheadRef.current,  { opacity: 1, y: 0, duration: 0.07, ease: easeCustom }, 0.65)
      tl.to(bulletsRef.current,  { opacity: 1, y: 0, duration: 0.07, ease: easeCustom }, 0.70)
      tl.to(ctaRef.current,      { opacity: 1, y: 0, duration: 0.06, ease: easeCustom }, 0.75)

      // Hold the finished state; keeps timeline time aligned with scroll progress.
      tl.set({}, {}, 1)

      if (runtime.isIframe && outerRef.current) {
        stopFrameProgress = bindFrameScrollProgress(
          runtime,
          outerRef.current,
          STICKY_SCROLL_RANGE,
          (progress) => tl.progress(progress),
        )
      }
    }, outerRef)

    return () => {
      stopFrameProgress?.()
      ctx.revert()
    }
  }, [isMobile, runtime])

  return (
    <section id="problem-solution" className="relative">
      <div
        ref={outerRef}
        className="relative h-auto md:h-[300vh] lg:h-[350vh] w-full"
        style={{ background: "var(--paper)" }}
      >
        {/* Top hairline */}
        <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px pointer-events-none z-10" style={{ background: "linear-gradient(90deg, transparent, rgba(43,200,183,0.25), transparent)" }} />

        <div className="relative md:sticky md:top-0 h-auto md:h-screen w-full overflow-visible md:overflow-hidden flex flex-col md:flex-row items-stretch md:items-start justify-start md:justify-center gap-12 md:gap-0 pt-20 pb-20 md:py-0 md:pt-28">
          <div
            className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(43,200,183,0.06) 0%, transparent 70%)", filter: "blur(60px)" }}
            aria-hidden
          />

          {/* ── Bento Grid (Problems) ── */}
          <div ref={bentoRef} className="relative z-10 w-full max-w-6xl mx-auto px-6">
            <div ref={problemHeaderRef} className="mb-10 md:mb-12">
              <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-3" data-edit-path="problemEyebrow">
                {problemEyebrow}
              </div>
              <h2 className="text-[34px] md:text-[52px] font-extrabold tracking-[-0.04em] text-[var(--navy-900)] leading-[1.05]" data-edit-path="problemHeadline">
                {problemHeadline}
              </h2>
            </div>

            <div ref={gridWrapRef} className="relative md:will-change-transform">
              <div ref={gridRef} className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
                <div ref={card1Ref} className="md:will-change-transform">
                  <ProblemCard problem={problems[0]} index={0} className="h-full" />
                </div>
                <div ref={card2Ref} className="md:will-change-transform">
                  <ProblemCard problem={problems[1]} index={1} className="h-full" />
                </div>
                <div ref={card3Ref} className="md:will-change-transform">
                  <ProblemCard problem={problems[2]} index={2} className="h-full" />
                </div>
              </div>

              {/* Outline that appears once the gaps close */}
              <div
                ref={mergeRingRef}
                aria-hidden
                className="hidden md:block absolute inset-0 rounded-[24px] pointer-events-none border border-[rgba(43,200,183,0.55)] shadow-[0_0_60px_rgba(43,200,183,0.12)] opacity-0"
              />

              {/* ── Solution (takes the merged panel's place on desktop, inline below on mobile) ── */}
              <div
                ref={solutionRef}
                className="relative mt-12 md:mt-0 md:absolute md:inset-0 z-20 md:flex md:items-center"
              >
            <div className="w-full md:h-full md:px-5">
              <div className="md:h-full">
                {/* Hairline gradient border — the clip-path reveal targets this wrapper */}
                <div
                  ref={solutionInnerRef}
                  className="relative md:min-h-full md:flex rounded-[24px] p-px shadow-[0_30px_80px_-30px_rgba(43,200,183,0.35)]"
                  style={{ background: "linear-gradient(135deg, rgba(43,200,183,0.65) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.04) 65%, rgba(43,200,183,0.35) 100%)" }}
                >
                  <div className="relative flex-1 overflow-hidden rounded-[23px]">
                    {/* Deep navy base (slightly deeper in dark mode) */}
                    <div aria-hidden className="absolute inset-0 dark:hidden" style={{ background: "linear-gradient(140deg, #14295A 0%, #0B1B3A 55%, #081530 100%)" }} />
                    <div aria-hidden className="absolute inset-0 hidden dark:block" style={{ background: "linear-gradient(140deg, #0B1A34 0%, #060F20 60%, #030812 100%)" }} />
                    {/* Fine grid, fading out from the diagram side */}
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                        maskImage: "radial-gradient(ellipse 70% 90% at 78% 50%, black 0%, transparent 75%)",
                        WebkitMaskImage: "radial-gradient(ellipse 70% 90% at 78% 50%, black 0%, transparent 75%)",
                      }}
                    />
                    <div aria-hidden className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(43,200,183,0.20) 0%, transparent 65%)", filter: "blur(60px)" }} />
                    <div aria-hidden className="absolute -bottom-40 right-[10%] w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(43,200,183,0.12) 0%, transparent 65%)", filter: "blur(60px)" }} />
                    {/* Top edge light */}
                    <div aria-hidden className="absolute top-0 left-10 right-10 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }} />

                    <div className="relative z-10 h-full grid grid-cols-1 md:grid-cols-12 items-center gap-10 md:gap-8 px-6 py-9 md:px-10 md:py-10 lg:px-14 lg:py-12">
                      {/* ── Message ── */}
                      <div className="md:col-span-5 flex flex-col">
                        <div ref={eyebrowRef} className="mono text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-4">
                          / the solution
                        </div>
                        <p ref={headlineRef} className="text-[32px] md:text-[42px] lg:text-[52px] font-extrabold tracking-[-0.04em] leading-[1.02] text-white" data-edit-path="solution.headline">
                          {solutionHeadline}
                          <br />
                          <span className="shine" data-edit-path="solution.headlineAccent">{solutionAccent}</span>
                        </p>
                        <p ref={subheadRef} className="mt-4 text-[15px] leading-[1.6] text-white/55 max-w-[34ch]" data-edit-path="solution.subheadline">
                          {solutionSub}
                        </p>
                        <div ref={ctaRef} className="mt-7">
                          <a
                            href={ctaHref}
                            data-edit-path="solution.ctaLabel"
                            className="group/btn inline-flex items-center justify-between gap-3 pl-5 md:pl-6 pr-1.5 py-1.5 rounded-full text-[13px] font-semibold shadow-[0_8px_30px_-6px_rgba(43,200,183,0.55)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_10px_40px_-6px_rgba(43,200,183,0.75)] active:scale-[0.98] w-full md:w-auto"
                            style={{ background: "linear-gradient(180deg, #4FD6C7 0%, #2BC8B7 100%)", color: "#04121F" }}
                          >
                            <span>{ctaLabel}</span>
                            <span className="w-9 h-9 rounded-full bg-[#04121F] text-[#4FD6C7] flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
                              <IconArrowUpRight />
                            </span>
                          </a>
                        </div>
                      </div>

                      {/* ── The system: three fixes wired into one output ── */}
                      <div ref={bulletsRef} className="md:col-span-7">
                        <SystemFlow bullets={bullets} />
                        <p className="mt-4 mono text-[10px] uppercase tracking-[0.2em] text-white/30 text-right">{bottomNote}</p>
                      </div>
                    </div>
                  </div>
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
