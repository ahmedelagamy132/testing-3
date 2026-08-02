"use client"

import { useRef } from "react"
import type { DashboardData } from "@/lib/types"
import { useFrameInView } from "@/components/puck/frame-runtime"

const DEFAULT_BARS = [42, 58, 51, 64, 72, 69, 81, 88, 83, 92, 97, 104]

const DEFAULT_NAV = ["Overview", "Ads", "Funnels", "Automation", "Data", "Reports"]
const DEFAULT_CLIENTS = [
  { initials: "AR", name: "Arvo Labs" },
  { initials: "NV", name: "Novae" },
  { initials: "KL", name: "Kilo & Co" },
]
const DEFAULT_KPIS = [
  { label: "Qualified Leads", value: "1,284", delta: "+38%", color: "teal" as const },
  { label: "Pipeline",        value: "$482K", delta: "+21%", color: "navy" as const },
  { label: "ROAS",            value: "5.2×",  delta: "+0.8×", color: "teal" as const },
  { label: "CAC",             value: "$41",   delta: "-29%", color: "navy" as const },
]
const DEFAULT_FUNNEL = [
  { name: "Visitors",    value: "48,210" },
  { name: "Engaged",     value: "12,882" },
  { name: "Leads",       value: "3,104"  },
  { name: "SQLs",        value: "1,284"  },
  { name: "Closed-won",  value: "184"    },
]
const FUNNEL_WIDTHS = [100, 72, 46, 28, 14]

export default function Dashboard({ data }: { data?: DashboardData } = {}) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartVisible = useFrameInView(chartRef, { amount: 0.2, once: true })

  const urlLabel       = data?.urlLabel       ?? "app.miduva.systems / growth-os"
  const statusLabel    = data?.statusLabel    ?? "LIVE"
  const syncLabel      = data?.syncLabel      ?? "synced 12s ago"
  const navItems       = data?.navItems?.length       ? data.navItems       : DEFAULT_NAV
  const systemLabel    = data?.systemLabel    ?? "System"
  const clientsLabel   = data?.clientsLabel   ?? "Clients"
  const clients        = data?.clients?.length        ? data.clients        : DEFAULT_CLIENTS
  const eyebrow        = data?.eyebrow        ?? "Growth System · Arvo Labs"
  const title          = data?.title          ?? "Q2 Performance Overview"
  const rangeLabels    = data?.rangeLabels?.length ? data.rangeLabels : ["7d", "30d", "QTD", "YTD"]
  const activeRangeIndex = Math.max(0, Math.min(rangeLabels.length - 1, data?.activeRangeIndex ?? 2))
  const kpis           = data?.kpis?.length           ? data.kpis           : DEFAULT_KPIS
  const chartTitle     = data?.chartTitle     ?? "Lead flow · last 12 weeks"
  const chartSubtitle  = data?.chartSubtitle  ?? "Paid + Organic + Automation"
  const chartLegend    = data?.chartLegend?.length ? data.chartLegend : ["Paid", "Organic", "Nurture"]
  const chartAxisLabels = data?.chartAxisLabels?.length ? data.chartAxisLabels : ["1.2k", "800", "400", "0"]
  const chartWeekLabels = data?.chartWeekLabels?.length ? data.chartWeekLabels : ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12"]
  const chartValues    = data?.chartValues?.length ? data.chartValues.slice(0, 24) : DEFAULT_BARS
  const funnelTitle    = data?.funnelTitle    ?? "Funnel health"
  const funnelStages   = data?.funnelStages?.length ? data.funnelStages : DEFAULT_FUNNEL
  const optimizedLabel = data?.optimizedLabel ?? "optimized"
  const automationLabel = data?.automationLabel ?? "Automation health"
  const automationHealth = Math.max(0, Math.min(100, data?.automationHealth ?? 96))

  return (
    <div className="relative mx-auto max-w-7xl dash-fade-y">
      <div className="dashboard-frame dash-fade-x">
        <div className="dashboard-tilt">
          <div className="dashboard-skew relative">
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
                    {urlLabel}
                  </div>
                  <div className="ml-auto flex items-center gap-2 mono text-[10px] text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal-500)]" />
                      {statusLabel}
                    </span>
                    <span className="hidden sm:inline">· {syncLabel}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-12 gap-0">
                  {/* Sidebar */}
                  <aside className="hidden md:block col-span-2 border-r border-[var(--line)] bg-[var(--card-2)] p-4 space-y-4">
                    <div>
                      <div className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">{systemLabel}</div>
                      {navItems.map((n, i) => (
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
                      <div className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">{clientsLabel}</div>
                      <div className="space-y-1.5 text-[11px] text-[var(--muted)]">
                        {clients.map((c, i) => {
                          const tone = i % 3 === 0
                            ? "bg-[var(--teal-500)]/15 text-[var(--teal-500)]"
                            : i % 3 === 1
                              ? "bg-[var(--navy-700)]/10 text-[var(--navy-700)]"
                              : "bg-[#F5B84C]/20 text-[#C17A00]"
                          return (
                            <div key={c.name} className="flex items-center gap-2">
                              <span className={`h-4 w-4 rounded-md ${tone} text-[8px] font-bold flex items-center justify-center`}>{c.initials}</span>
                              {c.name}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </aside>

                  {/* Main */}
                  <section className="col-span-12 md:col-span-10 p-5 lg:p-6">
                    <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                      <div>
                        <div className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">{eyebrow}</div>
                        <div className="text-[19px] font-bold text-[var(--navy-900)] tracking-tight">{title}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {rangeLabels.map((t, i) => (
                          <button
                            key={t}
                            className={`text-[11px] mono px-2.5 py-1 rounded-md border ${
                              i === activeRangeIndex
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
                      {kpis.map((k, i) => (
                        <div key={i} className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-3">
                          <div className="flex items-center justify-between">
                            <div className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">{k.label}</div>
                            <span className={`text-[10px] mono px-1.5 py-0.5 rounded ${k.color === "teal" ? "bg-[var(--teal-50)] text-[var(--teal-500)]" : "bg-[var(--navy-900)]/5 text-[var(--navy-700)]"}`}>
                              {k.delta}
                            </span>
                          </div>
                          <div className="mt-1.5 text-[22px] font-bold text-[var(--navy-900)] tracking-tight">{k.value}</div>
                          <div className="mt-2 h-1 rounded-full bg-[var(--card-2)] overflow-hidden">
                            <div
                              className={`h-full ${k.color === "teal" ? "bg-[var(--teal-500)]" : "bg-[var(--navy-700)]"}`}
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
                            <div className="text-[13px] font-semibold text-[var(--navy-900)]">{chartTitle}</div>
                            <div className="mono text-[10px] text-[var(--muted)]">{chartSubtitle}</div>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] mono text-[var(--muted)]">
                            {chartLegend.slice(0, 3).map((label, i) => (
                              <span key={`${label}-${i}`} className="inline-flex items-center gap-1">
                                <span className={`h-1.5 w-2.5 rounded-sm ${i === 0 ? "bg-[var(--teal-500)]" : i === 1 ? "bg-[var(--navy-700)]" : "bg-[var(--teal-300)]"}`}/>{label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div ref={chartRef} className="relative h-36 flex items-stretch gap-1.5 pl-6">
                          <div className="absolute left-0 inset-y-0 flex flex-col justify-between mono text-[9px] text-[var(--muted)] py-1">
                            {chartAxisLabels.slice(0, 4).map((label, i) => <span key={`${label}-${i}`}>{label}</span>)}
                          </div>
                          <div className="absolute inset-0 left-6 pointer-events-none flex flex-col justify-between py-1">
                            {[0, 1, 2, 3].map((i) => <div key={i} className="h-px bg-[var(--line)]"/>)}
                          </div>
                          {chartValues.map((h, i) => (
                            <div
                              key={i}
                              className={`relative flex-1 flex flex-col justify-end gap-px ${chartVisible ? "bar-grow" : ""}`}
                              style={{ animationDelay: `${0.6 + i * 0.05}s` }}
                            >
                              <div className="w-full rounded-sm bg-[var(--teal-300)]" style={{ height: `${h * 0.3}%` }}/>
                              <div className="w-full rounded-sm bg-[var(--navy-700)]" style={{ height: `${h * 0.35}%` }}/>
                              <div className="w-full rounded-sm bg-[var(--teal-500)]" style={{ height: `${h * 0.55}%` }}/>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pl-6 flex justify-between mono text-[9px] text-[var(--muted)]">
                          {chartWeekLabels.slice(0, chartValues.length).map((w) => (
                            <span key={w}>{w}</span>
                          ))}
                        </div>
                      </div>

                      {/* Funnel */}
                      <div className="lg:col-span-2 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-[13px] font-semibold text-[var(--navy-900)]">{funnelTitle}</div>
                          <span className="mono text-[10px] text-[var(--teal-500)] bg-[var(--teal-50)] px-1.5 py-0.5 rounded">{optimizedLabel}</span>
                        </div>
                        <div className="space-y-2.5">
                          {funnelStages.map((s, i) => (
                            <div key={i}>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-[var(--muted)]">{s.name}</span>
                                <span className="mono text-[var(--navy-900)] font-semibold">{s.value}</span>
                              </div>
                              <div className="mt-1 h-2 rounded bg-[var(--card-2)] overflow-hidden">
                                <div className="h-full rounded bg-gradient-to-r from-[var(--teal-500)] to-[var(--navy-700)]" style={{ width: `${FUNNEL_WIDTHS[i] ?? Math.max(10, 100 - i * 18)}%` }}/>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-dashed border-[var(--line)] flex items-center justify-between">
                          <div className="text-[11px] text-[var(--muted)]">{automationLabel}</div>
                          <div className="flex items-center gap-1">
                            {[1, 1, 1, 1, 0.4].map((v, i) => (
                              <span key={i} className="h-3 w-1.5 rounded-sm" style={{ background: `rgba(43,200,183,${v})` }}/>
                            ))}
                            <span className="mono text-[10px] text-[var(--muted)] ml-1">{automationHealth}%</span>
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
