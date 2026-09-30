"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import type { HowItWorksData } from "@/lib/types"
import { useFrameInView } from "@/components/puck/frame-runtime"

// ─── Data ─────────────────────────────────────────────────────────────────────
type Step = {
  id: string
  num: string
  title: string
  description: string
  imageUrl: string
  imageAlt?: string
}

const DEFAULT_STEPS: Step[] = [
  {
    id: "analyze",
    num: "01",
    title: "Analyze Your Business",
    description:
      "We audit your channels, funnels, and conversion gaps to build a complete picture of where you stand and where the biggest opportunities hide.",
    imageUrl:
      "/assets/visuals/analyze.webp",
  },
  {
    id: "strategy",
    num: "02",
    title: "Build a Custom Strategy",
    description:
      "A system blueprint tailored to your market, audience, and goals — no templates, no guesswork, just a clear plan for growth.",
    imageUrl:
      "/assets/visuals/strategy.webp",
  },
  {
    id: "launch",
    num: "03",
    title: "Launch & Optimize the System",
    description:
      "Everything goes live and gets tuned until it performs. We test, iterate, and refine until every metric is moving in the right direction.",
    imageUrl:
      "/assets/visuals/launch.webp",
  },
  {
    id: "scale",
    num: "04",
    title: "Scale Your Results",
    description:
      "More traffic, better conversions, automated follow-up — compounding returns that grow your business while you focus on what you do best.",
    imageUrl:
      "/assets/visuals/scale.webp",
  },
]

// ─── Step Card ────────────────────────────────────────────────────────────────
function StepCard({ step, index, total }: { step: Step; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useFrameInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      data-edit-path={`steps.${index}`}
      data-miduva-native-id={`step:${step.id}`}
      className="group relative h-full flex flex-col overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--card)] shadow-[0_1px_2px_rgba(15,35,73,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(43,200,183,0.35)] hover:shadow-[0_0_40px_rgba(43,200,183,0.06)]"
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.55, delay: 0.08 + index * 0.07, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* ── Image ── */}
      <div className="relative h-[184px] border-b border-[var(--line)] overflow-hidden">
        {step.imageUrl && (
          <Image
            src={step.imageUrl}
            alt={step.imageAlt || step.title}
            fill
            unoptimized
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(2,6,15,0.55) 0%, transparent 55%)" }}
        />
        <span className="absolute left-4 bottom-3 mono text-[11px] uppercase tracking-[0.18em] text-white/80">
          Step {step.num} <span className="text-white/40">/ 0{total}</span>
        </span>
      </div>

      {/* ── Copy ── */}
      <div className="relative flex flex-col flex-1 p-6 md:p-7">
        <span className="mono text-[34px] font-extrabold leading-none tracking-[-0.04em] text-[var(--teal-500)]">
          {step.num}
        </span>
        <h3 className="mt-4 text-[20px] md:text-[22px] font-extrabold tracking-[-0.03em] leading-[1.2] text-[var(--ink)]">
          {step.title}
        </h3>
        <p className="mt-2 text-[14px] leading-[1.6] text-[var(--muted)]">
          {step.description}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function HowItWorks({ data }: { data?: HowItWorksData }) {
  const eyebrow  = data?.eyebrow  ?? "/ how it works"
  const headline = data?.headline ?? "From audit to scale —"
  const headlineAccent = data?.headlineAccent ?? "four steps."
  const steps: Step[] = data?.steps?.length
    ? data.steps.map((s, i) => ({
        ...(s as Step),
        imageUrl: (s as Step).imageUrl || DEFAULT_STEPS[i]?.imageUrl || DEFAULT_STEPS[0].imageUrl,
      }))
    : DEFAULT_STEPS

  return (
    <section id="how-it-works" className="relative overflow-hidden" style={{ background: "var(--paper)" }}>
      {/* Top hairline */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(43,200,183,0.25), transparent)" }} />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(43,200,183,0.07) 0%, transparent 60%)", filter: "blur(80px)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="mb-10 md:mb-12">
          <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-3" data-edit-path="eyebrow">
            {eyebrow}
          </div>
          <h2 className="text-[34px] md:text-[52px] font-extrabold tracking-[-0.04em] text-[var(--navy-900)] leading-[1.05]" data-edit-path="headline">
            {headline}{" "}
            <span className="shine" data-edit-path="headlineAccent">{headlineAccent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {steps.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} total={steps.length} />
          ))}
        </div>
      </div>
    </section>
  )
}
