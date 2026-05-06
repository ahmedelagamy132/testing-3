"use client"

const MODULES = [
  { n: "Paid Ads",      tag: "Meta · Google · TikTok",  color: "teal" },
  { n: "Funnel Design", tag: "High-converting flows",   color: "navy" },
  { n: "Automation",    tag: "Sequences & triggers",    color: "teal" },
  { n: "CRM & Data",    tag: "Pipeline · attribution",  color: "navy" },
  { n: "Lead Scoring",  tag: "Qualify & prioritise",    color: "teal" },
  { n: "Analytics",     tag: "Live · actionable",       color: "navy" },
]

function ModuleCard({ n, tag, color }: (typeof MODULES)[number]) {
  const isTeal = color === "teal"
  return (
    <div
      className="group relative flex flex-col gap-3 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* top row: dot + name */}
      <div className="flex items-center gap-3">
        <span
          className="rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-125"
          style={{
            width: 8,
            height: 8,
            background: isTeal ? "var(--teal-500)" : "var(--navy-700)",
            boxShadow: isTeal ? "0 0 8px rgba(0,198,160,0.5)" : "none",
          }}
        />
        <span className="text-[14px] font-semibold text-[var(--navy-900)] tracking-tight">
          {n}
        </span>
      </div>

      {/* tag */}
      <span className="mono text-[11px] text-[var(--muted)] tracking-[0.06em] leading-relaxed">
        {tag}
      </span>

      {/* subtle bottom accent line on hover */}
      <span
        className="absolute bottom-0 left-5 right-5 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isTeal ? "var(--teal-500)" : "var(--navy-700)",
        }}
      />
    </div>
  )
}

export default function SystemRibbon() {
  return (
    <section id="systems" className="mt-16 md:mt-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-2">
              / growth os
            </div>
            <h2 className="text-[22px] md:text-[28px] font-extrabold text-[var(--navy-900)] tracking-[-0.03em] leading-tight">
              Six modules.{" "}
              <span style={{ color: "var(--teal-500)" }}>One connected system.</span>
            </h2>
            <p className="mt-1.5 text-[13px] text-[var(--muted)] max-w-md leading-relaxed">
              Every lever connected, every number visible, every dollar accounted for.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-[var(--navy-900)] border border-[var(--line)] px-4 py-2 rounded-full hover:border-[var(--teal-500)] hover:text-[var(--teal-500)] transition-colors duration-200"
          >
            See how we build it
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Static grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES.map((m, i) => (
            <ModuleCard key={i} {...m} />
          ))}
        </div>
      </div>
    </section>
  )
}
