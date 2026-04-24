const bars = [42, 58, 51, 64, 72, 69, 81, 88, 83, 92, 97, 104]

export default function Dashboard() {
  return (
    <div className="relative mx-auto max-w-7xl dash-fade-y">
      <div className="dash-fade-x -mr-16 pl-16 lg:-mr-56 lg:pl-56" style={{ perspective: "1200px" }}>
        <div style={{ transform: "rotateX(18deg)" }}>
          <div className="relative" style={{ transform: "skewX(0.22rad)" }}>
            <div className="relative rounded-[26px] p-2 bg-gradient-to-b from-[var(--card)] to-[var(--card-2)] border border-[var(--line)] shadow-[0_40px_80px_-30px_rgba(15,35,73,.35)] dark:shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]">
              <div className="rounded-[20px] bg-[var(--card)] overflow-hidden border border-[var(--line)]">
                {/* Chrome bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line)] bg-[var(--card-2)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF6159]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C940]" />
                  <div className="ml-4 mono text-[11px] text-[var(--muted)] flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="10" rx="2"/>
                      <path d="M7 11V7a5 5 0 1 1 10 0v4"/>
                    </svg>
                    app.miduva.systems / growth-os
                  </div>
                  <div className="ml-auto flex items-center gap-2 mono text-[10px] text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal-500)]" />
                      LIVE
                    </span>
                    <span className="hidden sm:inline">· synced 12s ago</span>
                  </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-12 gap-0">
                  {/* Sidebar */}
                  <aside className="hidden md:block col-span-2 border-r border-[var(--line)] bg-[var(--card-2)] p-4 space-y-4">
                    <div>
                      <div className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">System</div>
                      {["Overview", "Ads", "Funnels", "Automation", "Data", "Reports"].map((n, i) => (
                        <div
                          key={n}
                          className={`flex items-center gap-2 text-[12px] py-1.5 px-2 rounded-md ${
                            i === 0
                              ? "bg-[var(--card)] text-[var(--navy-900)] font-semibold border border-[var(--line)]"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-[var(--teal-500)]" : "bg-[var(--line)]"}`} />
                          {n}
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-[var(--line)]">
                      <div className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">Clients</div>
                      <div className="space-y-1.5 text-[11px] text-[var(--muted)]">
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded-md bg-[var(--teal-500)]/15 text-[var(--teal-500)] text-[8px] font-bold flex items-center justify-center">AR</span>
                          Arvo Labs
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded-md bg-[var(--navy-700)]/10 text-[var(--navy-700)] text-[8px] font-bold flex items-center justify-center">NV</span>
                          Novae
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded-md bg-[#F5B84C]/20 text-[#C17A00] text-[8px] font-bold flex items-center justify-center">KL</span>
                          Kilo &amp; Co
                        </div>
                      </div>
                    </div>
                  </aside>

                  {/* Main */}
                  <section className="col-span-12 md:col-span-10 p-5 lg:p-6">
                    <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                      <div>
                        <div className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">Growth System · Arvo Labs</div>
                        <div className="text-[19px] font-bold text-[var(--navy-900)] tracking-tight">Q2 Performance Overview</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {["7d", "30d", "QTD", "YTD"].map((t, i) => (
                          <button
                            key={t}
                            className={`text-[11px] mono px-2.5 py-1 rounded-md border ${
                              i === 2
                                ? "bg-[var(--navy-700)] text-[var(--card)] border-[var(--navy-700)]"
                                : "border-[var(--line)] text-[var(--muted)]"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                      {[
                        { k: "Qualified Leads", v: "1,284", d: "+38%", c: "teal" },
                        { k: "Pipeline",        v: "$482K", d: "+21%", c: "navy" },
                        { k: "ROAS",            v: "5.2×",  d: "+0.8×", c: "teal" },
                        { k: "CAC",             v: "$41",   d: "-29%", c: "navy" },
                      ].map((k, i) => (
                        <div key={i} className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-3">
                          <div className="flex items-center justify-between">
                            <div className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">{k.k}</div>
                            <span className={`text-[10px] mono px-1.5 py-0.5 rounded ${k.c === "teal" ? "bg-[var(--teal-50)] text-[var(--teal-500)]" : "bg-[var(--navy-900)]/5 text-[var(--navy-700)]"}`}>
                              {k.d}
                            </span>
                          </div>
                          <div className="mt-1.5 text-[22px] font-bold text-[var(--navy-900)] tracking-tight">{k.v}</div>
                          <div className="mt-2 h-1 rounded-full bg-[var(--card-2)] overflow-hidden">
                            <div
                              className={`h-full ${k.c === "teal" ? "bg-[var(--teal-500)]" : "bg-[var(--navy-700)]"}`}
                              style={{ width: `${60 + i * 8}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                      {/* Bar chart */}
                      <div className="lg:col-span-3 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-[13px] font-semibold text-[var(--navy-900)]">Lead flow · last 12 weeks</div>
                            <div className="mono text-[10px] text-[var(--muted)]">Paid + Organic + Automation</div>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] mono text-[var(--muted)]">
                            <span className="inline-flex items-center gap-1"><span className="h-1.5 w-2.5 rounded-sm bg-[var(--teal-500)]"/>Paid</span>
                            <span className="inline-flex items-center gap-1"><span className="h-1.5 w-2.5 rounded-sm bg-[var(--navy-700)]"/>Organic</span>
                            <span className="inline-flex items-center gap-1"><span className="h-1.5 w-2.5 rounded-sm bg-[var(--teal-300)]"/>Nurture</span>
                          </div>
                        </div>
                        <div className="relative h-36 flex items-stretch gap-1.5 pl-6">
                          <div className="absolute left-0 inset-y-0 flex flex-col justify-between mono text-[9px] text-[var(--muted)] py-1">
                            <span>1.2k</span><span>800</span><span>400</span><span>0</span>
                          </div>
                          <div className="absolute inset-0 left-6 pointer-events-none flex flex-col justify-between py-1">
                            {[0, 1, 2, 3].map((i) => <div key={i} className="h-px bg-[var(--line)]"/>)}
                          </div>
                          {bars.map((h, i) => (
                            <div
                              key={i}
                              className="relative flex-1 flex flex-col justify-end gap-px bar-grow"
                              style={{ animationDelay: `${0.6 + i * 0.05}s` }}
                            >
                              <div className="w-full rounded-sm bg-[var(--teal-300)]" style={{ height: `${h * 0.3}%` }}/>
                              <div className="w-full rounded-sm bg-[var(--navy-700)]" style={{ height: `${h * 0.35}%` }}/>
                              <div className="w-full rounded-sm bg-[var(--teal-500)]" style={{ height: `${h * 0.55}%` }}/>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pl-6 flex justify-between mono text-[9px] text-[var(--muted)]">
                          {["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12"].map((w) => (
                            <span key={w}>{w}</span>
                          ))}
                        </div>
                      </div>

                      {/* Funnel */}
                      <div className="lg:col-span-2 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-[13px] font-semibold text-[var(--navy-900)]">Funnel health</div>
                          <span className="mono text-[10px] text-[var(--teal-500)] bg-[var(--teal-50)] px-1.5 py-0.5 rounded">optimized</span>
                        </div>
                        <div className="space-y-2.5">
                          {[
                            { n: "Visitors",    v: "48,210", w: 100 },
                            { n: "Engaged",     v: "12,882", w: 72  },
                            { n: "Leads",       v: "3,104",  w: 46  },
                            { n: "SQLs",        v: "1,284",  w: 28  },
                            { n: "Closed-won",  v: "184",    w: 14  },
                          ].map((s, i) => (
                            <div key={i}>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-[var(--muted)]">{s.n}</span>
                                <span className="mono text-[var(--navy-900)] font-semibold">{s.v}</span>
                              </div>
                              <div className="mt-1 h-2 rounded bg-[var(--card-2)] overflow-hidden">
                                <div className="h-full rounded bg-gradient-to-r from-[var(--teal-500)] to-[var(--navy-700)]" style={{ width: `${s.w}%` }}/>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-dashed border-[var(--line)] flex items-center justify-between">
                          <div className="text-[11px] text-[var(--muted)]">Automation health</div>
                          <div className="flex items-center gap-1">
                            {[1, 1, 1, 1, 0.4].map((v, i) => (
                              <span key={i} className="h-3 w-1.5 rounded-sm" style={{ background: `rgba(43,200,183,${v})` }}/>
                            ))}
                            <span className="mono text-[10px] text-[var(--muted)] ml-1">96%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
