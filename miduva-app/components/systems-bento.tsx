"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useTransform, useSpring } from "motion/react"

const SYSTEMS = [
  {
    id: "lead-gen",
    num: "01",
    label: "Lead Generation System",
    title: "Consistent leads.\nOn autopilot.",
    description: "Generate predictable lead flow using ads, funnels & precision conversion systems built for your market.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    span: "col",
  },
  {
    id: "website-conversion",
    num: "02",
    label: "Website & Conversion System",
    title: "Your website,\nactually converting.",
    description: "Turn traffic into revenue with a high-performance site engineered around your buyer's journey.",
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop",
    span: "col",
  },
  {
    id: "automation",
    num: "03",
    label: "Smart Automation System",
    title: "Sales & follow-ups running 24/7 — without hiring.",
    description: "CRM workflows, AI agents, and email sequences that close deals while you sleep.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    span: "full",
  },
]

function BentoCard({
  system,
  index,
  full = false,
}: {
  system: (typeof SYSTEMS)[0]
  index: number
  full?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 20 }
  const imgX = useSpring(useTransform(mouseX, [-1, 1], [-10, 10]), springConfig)
  const imgY = useSpring(useTransform(mouseY, [-1, 1], [-8, 8]), springConfig)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width * 2 - 1)
    mouseY.set((e.clientY - rect.top) / rect.height * 2 - 1)
  }

  function onMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-[24px] border border-[var(--line)] group cursor-pointer transition-colors duration-500 hover:border-[var(--teal-500)]/40 ${full ? "min-h-[240px] md:min-h-[280px]" : "min-h-[340px] md:min-h-[400px]"}`}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
    >
      {/* Image layer with parallax */}
      <div className="absolute inset-0 overflow-hidden rounded-[24px]">
        <motion.img
          src={system.imageUrl}
          alt={system.label}
          className="absolute inset-[-8%] w-[116%] h-[116%] object-cover"
          style={{ x: imgX, y: imgY }}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy-900)]/20 to-transparent" />

      {/* Teal glow on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[var(--teal-500)]/12 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-7">
        {/* Top label */}
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="mono text-[11px] uppercase tracking-[0.22em] text-white/70">{system.num}</span>
            <span className="w-4 h-px bg-white/40" />
            <span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--teal-400)] font-semibold">{system.label}</span>
          </div>

          <h3
            className={`font-extrabold text-white tracking-[-0.03em] leading-[1.1] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${full ? "text-[26px] md:text-[32px] max-w-[560px]" : "text-[24px] md:text-[30px]"}`}
            style={{ whiteSpace: "pre-line" }}
          >
            {system.title}
          </h3>
        </div>

        {/* Bottom: description + CTA */}
        <div className={`${full ? "max-w-[420px]" : "mt-6"}`}>
          <p className="text-[13px] text-white/75 leading-[1.6] mb-4">
            {system.description}
          </p>
          <a
            href="#cta"
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-[var(--teal-400)] hover:text-white transition-colors group/cta"
          >
            <span className="px-3 py-1.5 rounded-full border border-[var(--teal-500)]/40 bg-[var(--teal-500)]/10 backdrop-blur-sm group-hover/cta:bg-[var(--teal-500)]/25 transition-colors">
              Explore Your System
            </span>
            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ duration: 0.25 }}
            >
              →
            </motion.span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function SystemsBento() {
  const topCards = SYSTEMS.filter((s) => s.span === "col")
  const fullCard = SYSTEMS.find((s) => s.span === "full")!

  return (
    <section id="systems-bento" className="py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-4">/ our systems</div>
          <h2 className="text-[48px] md:text-[64px] font-extrabold tracking-[-0.04em] text-[var(--navy-900)] leading-[1.02]">
            Three systems.<br />
            <span className="text-[var(--teal-500)]">One growth machine.</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div className="flex flex-col gap-4">
          {/* Top row: 60/40 */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-4">
            {topCards.map((system, i) => (
              <BentoCard key={system.id} system={system} index={i} />
            ))}
          </div>
          {/* Full-width bottom card */}
          <BentoCard system={fullCard} index={2} full />
        </div>
      </div>
    </section>
  )
}
