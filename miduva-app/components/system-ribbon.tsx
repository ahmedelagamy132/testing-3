const items = [
  { n: "Paid Ads",             i: "📈" },
  { n: "Funnel Design",        i: "🧭" },
  { n: "Marketing Automation", i: "⚙️" },
  { n: "CRM & Data",           i: "🗂" },
  { n: "Lead Scoring",         i: "🎯" },
  { n: "Landing Pages",        i: "🧱" },
  { n: "Retention Loops",      i: "🔁" },
  { n: "Analytics",            i: "📊" },
]

const row = [...items, ...items]

export default function SystemRibbon() {
  return (
    <section id="systems" className="mt-16 md:mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">The Miduva Growth OS</div>
            <div className="text-[22px] md:text-[26px] font-bold text-[var(--navy-900)] tracking-tight">
              Eight components. One tailored system.
            </div>
          </div>
          <a
            href="#"
            className="text-[13px] font-semibold text-[var(--navy-900)] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
          >
            See how we build it
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="relative overflow-hidden scroll-mask">
        <div className="flex gap-3 ticker w-max">
          {row.map((it, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 rounded-full border border-[var(--line)] bg-[var(--card)]/80 backdrop-blur"
            >
              <span className="text-[16px]">{it.i}</span>
              <span className="text-[13.5px] font-semibold text-[var(--navy-900)] whitespace-nowrap">{it.n}</span>
              <span className="mono text-[10px] text-[var(--muted)] border-l border-[var(--line)] pl-3">module</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
