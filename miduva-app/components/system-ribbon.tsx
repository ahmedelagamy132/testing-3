"use client"

import { useRef } from "react"
import { motion } from "motion/react"
import type { GrowthOsData, GrowthOsModule } from "@/lib/types"
import { useFrameInView, useFrameIsDark } from "@/components/puck/frame-runtime"
import ModuleVisual from "@/components/module-visual"

const DEFAULT_MODULES: GrowthOsModule[] = [
  { name: "Paid Ads",      tag: "Meta · Google · TikTok",   description: "Multi-channel acquisition tuned for CAC efficiency.",       color: "teal", span: 2, visual: "bars"   },
  { name: "Funnel Design", tag: "High-converting flows",    description: "Landing pages & flows that turn clicks into SQLs.",          color: "navy", span: 1, visual: "funnel" },
  { name: "Automation",    tag: "Sequences & triggers",     description: "Smart nurture that responds to behaviour in real time.",     color: "teal", span: 1, visual: "nodes"  },
  { name: "CRM & Data",    tag: "Pipeline · attribution",   description: "Clean data architecture with full-funnel visibility.",       color: "navy", span: 2, visual: "grid"   },
  { name: "Lead Scoring",  tag: "Qualify & prioritise",     description: "AI-ranked leads so sales always knows who to call.",         color: "teal", span: 2, visual: "rings"  },
  { name: "Analytics",     tag: "Live · actionable",        description: "No vanity metrics. Just decisions that move revenue.",       color: "navy", span: 1, visual: "spark"  },
]

function ModuleCard({
  name: n,
  tag,
  description: desc,
  color,
  visual,
  span,
  index,
  isDark,
}: GrowthOsModule & { index: number; isDark: boolean }) {
  const isTeal = color === "teal"
  const isWide = span === 2

  const accent = isTeal ? "var(--teal-500)" : isDark ? "#ADBFE8" : "#4A7BC4"
  const accentGlow = isTeal ? "rgba(43,200,183,0.22)" : "rgba(74,123,196,0.22)"

  return (
    <div
      className="module-card group relative h-full rounded-[22px] p-[5px] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1"
      style={{
        background: isDark ? "rgba(255,255,255,0.025)" : "rgba(15,35,73,0.035)",
        boxShadow: isDark ? "0 0 0 1px rgba(255,255,255,0.07)" : "0 0 0 1px var(--line)",
        ["--module-accent-glow" as string]: accentGlow,
      }}
    >
      <div
        className={`relative h-full overflow-hidden rounded-[17px] flex flex-col ${isWide ? "lg:flex-row" : ""}`}
        style={{
          background: isDark ? "#060E1E" : "white",
          boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.06)" : "inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        {/* Hover glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle, ${accentGlow}, transparent 70%)` }}
        />

        {/* Text */}
        <div className={`relative flex flex-col p-6 lg:p-7 ${isWide ? "lg:w-[44%] lg:shrink-0" : ""}`}>
          <div className="flex items-center gap-3 mb-6">
            <span className="mono text-[11px] font-bold" style={{ color: accent }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden className="h-px w-6" style={{ background: accent, opacity: 0.4 }} />
            <span className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] truncate">
              {tag}
            </span>
          </div>
          <h3 className="text-[22px] lg:text-[24px] font-extrabold tracking-[-0.035em] leading-[1.1] text-[var(--navy-900)]">
            {n}
          </h3>
          <p className="mt-3 text-[14.5px] leading-[1.6] text-[var(--muted)] max-w-[340px]">
            {desc}
          </p>
        </div>

        {/* Visual panel */}
        <div className={`relative flex-1 px-4 pb-4 ${isWide ? "lg:pl-0 lg:pt-4" : ""}`}>
          <div
            className="relative h-full min-h-[150px] overflow-hidden rounded-xl flex items-center justify-center"
            style={{
              background: isDark
                ? "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))"
                : "linear-gradient(180deg, rgba(15,35,73,0.025), rgba(15,35,73,0.01))",
              boxShadow: isDark ? "inset 0 0 0 1px rgba(255,255,255,0.05)" : "inset 0 0 0 1px rgba(15,35,73,0.06)",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.5]"
              style={{
                backgroundImage: `radial-gradient(${isDark ? "rgba(255,255,255,0.06)" : "rgba(15,35,73,0.07)"} 1px, transparent 1px)`,
                backgroundSize: "14px 14px",
              }}
            />
            <div className="relative w-full aspect-[2/1] max-h-[200px] px-2 py-2 transition-opacity duration-500">
              <ModuleVisual type={visual} color={color} isDark={isDark} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SystemRibbon({ data }: { data?: GrowthOsData } = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useFrameInView(sectionRef, { once: true, margin: "-60px" })
  const isDark = useFrameIsDark()

  const eyebrow        = data?.eyebrow        ?? "/ growth os"
  const headline       = data?.headline       ?? "Six modules."
  const headlineAccent = data?.headlineAccent ?? "One connected system."
  const description    = data?.description    ?? "Every lever connected, every number visible, every dollar accounted for."
  const ctaLabel       = data?.ctaLabel       ?? "See how we build it"
  const ctaHref        = data?.ctaHref        ?? "#"
  const modules        = data?.modules?.length ? data.modules : DEFAULT_MODULES

  return (
    <section ref={sectionRef} id="growth-os" className="mt-20 md:mt-28">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="flex items-end justify-between flex-wrap gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div>
            <div className="mono text-[12px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-4" data-edit-path="eyebrow">
              {eyebrow}
            </div>
            <h2 className="text-[34px] md:text-[48px] font-extrabold text-[var(--navy-900)] tracking-[-0.04em] leading-[1.05]" data-edit-path="headline">
              {headline}<br className="hidden sm:block" />{" "}
              <span style={{ color: "var(--teal-500)" }} data-edit-path="headlineAccent">{headlineAccent}</span>
            </h2>
            <p className="mt-4 text-[15px] md:text-[16px] text-[var(--muted)] max-w-md leading-relaxed" data-edit-path="description">
              {description}
            </p>
          </div>
          <a
            href={ctaHref}
            data-edit-path="ctaLabel"
            className="group inline-flex items-center gap-2.5 text-[13px] font-semibold text-[var(--navy-900)] border border-[var(--line)] pl-5 pr-2 py-2 rounded-full hover:border-[var(--teal-500)] transition-colors duration-200"
          >
            {ctaLabel}
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--chip)] text-[var(--teal-500)] transition-transform duration-300 group-hover:translate-x-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        </motion.div>
      </div>

      {/* Bento grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <motion.div
              key={i}
              data-edit-path={`modules.${i}`}
              data-miduva-native-id={`module:${(m as typeof m & { __nativeId?: string }).__nativeId ?? i}`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={m.span === 2 ? "sm:col-span-2" : "col-span-1"}
            >
              <ModuleCard {...m} index={i} isDark={isDark} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
