"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"
import type { GrowthOsData, GrowthOsModule } from "@/lib/types"
import { useFrameInView, useFrameIsDark } from "@/components/puck/frame-runtime"

const DEFAULT_MODULES: GrowthOsModule[] = [
  { name: "Paid Ads",      tag: "Meta · Google · TikTok",   description: "Multi-channel acquisition tuned for CAC efficiency.",       color: "teal", span: 2, visual: "bars"   },
  { name: "Funnel Design", tag: "High-converting flows",    description: "Landing pages & flows that turn clicks into SQLs.",          color: "navy", span: 1, visual: "funnel" },
  { name: "Automation",    tag: "Sequences & triggers",     description: "Smart nurture that responds to behaviour in real time.",     color: "teal", span: 1, visual: "nodes"  },
  { name: "CRM & Data",    tag: "Pipeline · attribution",   description: "Clean data architecture with full-funnel visibility.",       color: "navy", span: 2, visual: "grid"   },
  { name: "Lead Scoring",  tag: "Qualify & prioritise",     description: "AI-ranked leads so sales always knows who to call.",         color: "teal", span: 2, visual: "rings"  },
  { name: "Analytics",     tag: "Live · actionable",        description: "No vanity metrics. Just decisions that move revenue.",       color: "navy", span: 1, visual: "spark"  },
]

function ModuleVisual({ type, color }: { type: string; color: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (type !== "rings") return
    let timer: ReturnType<typeof setTimeout>
    const target = 94
    let n = 0
    const step = () => {
      if (n < target) {
        const remaining = target - n
        n += remaining > 30 ? 3 : remaining > 10 ? 2 : 1
        if (n > target) n = target
        setCount(n)
        const delay = remaining > 30 ? 25 : remaining > 10 ? 40 : 70
        timer = setTimeout(step, delay)
      } else {
        timer = setTimeout(() => { n = 0; setCount(0); timer = setTimeout(step, 300) }, 2000)
      }
    }
    timer = setTimeout(step, 600)
    return () => clearTimeout(timer)
  }, [type])

  const c = color === "teal" ? "#2BC8B7" : "#4A7BC4"
  const cLight = color === "teal" ? "#8EE5DB" : "#7EB0E8"
  const cFade = color === "teal" ? "rgba(43,200,183,0.12)" : "rgba(74,123,196,0.15)"

  switch (type) {
    case "bars":
      return (
        <svg viewBox="0 0 120 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="bgrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity="1" />
              <stop offset="100%" stopColor={cLight} stopOpacity="0.4" />
            </linearGradient>
            <filter id="bglow">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {[20, 35, 28, 50, 42, 58, 48, 68, 55, 75, 62, 82].map((h, i) => {
            const bright = i % 3 === 0
            const vals = [h * 0.48, h * 0.62, h * 0.54, h * 0.60, h * 0.50, h * 0.62]
            const hStr = vals.map(v => v.toFixed(1)).join(";")
            const yStr = vals.map(v => (60 - v).toFixed(1)).join(";")
            const dur = `${3.8 + i * 0.22}s`
            return (
              <g key={i}>
                <rect
                  x={6 + i * 9.5} y={60 - h * 0.6} width="6" height={h * 0.6} rx="3"
                  fill={bright ? "url(#bgrad)" : i % 3 === 1 ? cLight : cFade}
                  filter={bright ? "url(#bglow)" : undefined}
                  opacity={bright ? 1 : 0.65}
                >
                  <animate attributeName="height" values={hStr} dur={dur} repeatCount="indefinite" />
                  <animate attributeName="y" values={yStr} dur={dur} repeatCount="indefinite" />
                </rect>
                {bright && (
                  <rect x={6 + i * 9.5} y={60 - h * 0.6} width="6" height="2.5" rx="1.25"
                    fill={c} filter="url(#bglow)">
                    <animate attributeName="y" values={yStr} dur={dur} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.5;1" dur={`${2.8 + i * 0.15}s`} repeatCount="indefinite" />
                  </rect>
                )}
              </g>
            )
          })}
          <line x1="6" y1="59.5" x2="114" y2="59.5" stroke={c} strokeWidth="0.4" opacity="0.2" />
        </svg>
      )
    case "funnel":
      return (
        <svg viewBox="0 0 120 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="fgradTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity="0.25" />
              <stop offset="100%" stopColor={cLight} stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="fgradMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity="0.18" />
              <stop offset="100%" stopColor={cLight} stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="fgradBot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity="0.14" />
              <stop offset="100%" stopColor={cLight} stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="fPipe" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={c} stopOpacity="0" />
              <stop offset="50%" stopColor={c} stopOpacity="0.35" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </linearGradient>
            <filter id="fglow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Funnel layers */}
          <path d="M10 6 L110 6 L82 24 L82 36 L38 36 L38 24 Z" fill="url(#fgradTop)" stroke={c} strokeWidth="0.6" opacity="0.5" />
          <path d="M38 24 L82 24 L72 34 L72 44 L48 44 L48 34 Z" fill="url(#fgradMid)" stroke={c} strokeWidth="0.6" opacity="0.45" />
          <path d="M48 34 L72 34 L66 42 L66 52 L54 52 L54 42 Z" fill="url(#fgradBot)" stroke={c} strokeWidth="0.6" opacity="0.4" />

          {/* Inner pipe glow */}
          <path d="M60 6 L60 52" stroke="url(#fPipe)" strokeWidth="2" fill="none" opacity="0.6" />

          {/* Stage dividers */}
          <line x1="38" y1="24" x2="82" y2="24" stroke={c} strokeWidth="0.4" opacity="0.3" strokeDasharray="2 2" />
          <line x1="48" y1="34" x2="72" y2="34" stroke={c} strokeWidth="0.4" opacity="0.3" strokeDasharray="2 2" />
          <line x1="54" y1="42" x2="66" y2="42" stroke={c} strokeWidth="0.4" opacity="0.3" strokeDasharray="2 2" />

          {/* Side stage labels */}
          <text x="8" y="16" fill={c} fontSize="5" fontWeight="600" fontFamily="monospace" opacity="0.7">48K</text>
          <text x="8" y="30" fill={c} fontSize="5" fontWeight="600" fontFamily="monospace" opacity="0.7">12K</text>
          <text x="8" y="40" fill={c} fontSize="5" fontWeight="600" fontFamily="monospace" opacity="0.7">3K</text>
          <text x="8" y="50" fill={c} fontSize="5" fontWeight="600" fontFamily="monospace" opacity="0.9">184</text>

          {/* Conversion arrows */}
          <path d="M92 16 L96 16 L94 14 M96 16 L94 18" stroke={c} strokeWidth="0.6" fill="none" opacity="0.5" />
          <path d="M84 30 L88 30 L86 28 M88 30 L86 32" stroke={c} strokeWidth="0.6" fill="none" opacity="0.5" />
          <path d="M76 40 L80 40 L78 38 M80 40 L78 42" stroke={c} strokeWidth="0.6" fill="none" opacity="0.5" />

          {/* Conversion % */}
          <text x="96" y="17" fill={cLight} fontSize="5" fontWeight="700" fontFamily="monospace" opacity="0.8">26%</text>
          <text x="88" y="31" fill={cLight} fontSize="5" fontWeight="700" fontFamily="monospace" opacity="0.8">24%</text>
          <text x="80" y="41" fill={cLight} fontSize="5" fontWeight="700" fontFamily="monospace" opacity="0.8">6%</text>

          {/* Flowing particles */}
          {[
            { cx: 60, values: "6;15;15;24;24;30;30;38;38;46;46;52;52", opacity: "1;1;0.8;0.8;0.6;0.6;0.5;0.5;0.4;0.4;0.2;0.2;0", dur: "3.5s", begin: "0s", r: 2 },
            { cx: 45, values: "6;15;15;24;24;30;30;38;38;46;46;52;52", opacity: "1;1;0.8;0.8;0.6;0.6;0.5;0.5;0.4;0.4;0.2;0.2;0", dur: "3.5s", begin: "0.6s", r: 1.8 },
            { cx: 75, values: "6;15;15;24;24;30;30;38;38;46;46;52;52", opacity: "1;1;0.8;0.8;0.6;0.6;0.5;0.5;0.4;0.4;0.2;0.2;0", dur: "3.5s", begin: "1.2s", r: 1.6 },
            { cx: 52, values: "6;15;15;24;24;30;30;38;38;46;46;52;52", opacity: "1;1;0.8;0.8;0.6;0.6;0.5;0.5;0.4;0.4;0.2;0.2;0", dur: "3.5s", begin: "1.8s", r: 1.5 },
            { cx: 68, values: "6;15;15;24;24;30;30;38;38;46;46;52;52", opacity: "1;1;0.8;0.8;0.6;0.6;0.5;0.5;0.4;0.4;0.2;0.2;0", dur: "3.5s", begin: "2.4s", r: 1.7 },
            { cx: 60, values: "6;15;15;24;24;30;30;38;38;46;46;52;52", opacity: "1;1;0.8;0.8;0.6;0.6;0.5;0.5;0.4;0.4;0.2;0.2;0", dur: "3.5s", begin: "3s", r: 1.4 },
          ].map((p, i) => (
            <circle key={i} cx={p.cx} cy="6" r={p.r} fill={c} filter="url(#fglow)">
              <animate attributeName="cy" values={p.values} dur={p.dur} begin={p.begin} repeatCount="indefinite" />
              <animate attributeName="opacity" values={p.opacity} dur={p.dur} begin={p.begin} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Bottom glow pool */}
          <ellipse cx="60" cy="54" rx="8" ry="2" fill={c} opacity="0.15">
            <animate attributeName="rx" values="6;10;6" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite" />
          </ellipse>
        </svg>
      )
    case "nodes":
      return (
        <svg viewBox="0 0 120 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="nglow">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Edges */}
          <line x1="20" y1="20" x2="50" y2="15" stroke={c} strokeWidth="0.8" opacity="0.2" />
          <line x1="50" y1="15" x2="80" y2="25" stroke={c} strokeWidth="0.8" opacity="0.2" />
          <line x1="20" y1="20" x2="35" y2="45" stroke={c} strokeWidth="0.8" opacity="0.2" />
          <line x1="50" y1="15" x2="65" y2="40" stroke={c} strokeWidth="0.8" opacity="0.2" />
          <line x1="80" y1="25" x2="95" y2="50" stroke={c} strokeWidth="0.8" opacity="0.2" />
          <line x1="35" y1="45" x2="65" y2="40" stroke={c} strokeWidth="0.8" opacity="0.2" />
          <line x1="65" y1="40" x2="95" y2="50" stroke={c} strokeWidth="0.8" opacity="0.2" />
          {/* Data packets — 3 packets on the main trunk */}
          {[
            { path: "M20,20 L50,15 L80,25", dur: "3.5s", begin: "0s"   },
            { path: "M50,15 L65,40 L95,50",  dur: "4.0s", begin: "1.2s" },
            { path: "M20,20 L35,45 L65,40",  dur: "3.8s", begin: "2.4s" },
          ].map((e, i) => (
            <circle key={i} r="1.8" fill={c} filter="url(#nglow)">
              <animateMotion dur={e.dur} begin={e.begin} repeatCount="indefinite" path={e.path} />
              <animate attributeName="opacity" values="0;0.8;0.8;0" dur={e.dur} begin={e.begin}
                repeatCount="indefinite" keyTimes="0;0.08;0.88;1" />
            </circle>
          ))}
          {/* Nodes */}
          {[
            { x: 20, y: 20 }, { x: 50, y: 15 }, { x: 80, y: 25 },
            { x: 35, y: 45 }, { x: 65, y: 40 }, { x: 95, y: 50 },
          ].map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="6" fill={cFade} />
              <circle cx={p.x} cy={p.y} r="3" fill={c} filter="url(#nglow)">
                <animate attributeName="r" values="3;4.2;3" dur={`${1.8 + i * 0.35}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.55;1" dur={`${1.8 + i * 0.35}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </svg>
      )
    case "grid":
      return (
        <svg viewBox="0 0 120 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 14 }).map((_, col) => {
              const active = (row + col) % 5 === 0 || (row * 14 + col) % 11 === 0
              return (
                <rect
                  key={`${row}-${col}`}
                  x={8 + col * 7.5}
                  y={6 + row * 6.8}
                  width="4"
                  height="4"
                  rx="1"
                  fill={active ? c : cFade}
                  opacity={active ? 0.8 : 0.4}
                >
                  {active && (
                    <animate
                      attributeName="opacity"
                      values="0.8;0.3;0.8"
                      dur={`${2 + ((row * col) % 3)}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </rect>
              )
            })
          )}
        </svg>
      )
    case "rings":
      return (
        <svg viewBox="0 0 120 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="rglow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {[28, 22, 16].map((r, i) => (
            <circle key={i} cx="60" cy="30" r={r} fill="none"
              stroke={i === 0 ? c : cLight}
              strokeWidth={i === 0 ? 1.8 : 1.2}
              opacity={0.3 + i * 0.2}
              strokeDasharray={`${2 * Math.PI * r * 0.75} ${2 * Math.PI * r * 0.25}`}
              strokeLinecap="round"
              filter={i === 0 ? "url(#rglow)" : undefined}
            >
              <animateTransform attributeName="transform" type="rotate"
                from={`${i % 2 === 0 ? 0 : 360} 60 30`}
                to={`${i % 2 === 0 ? 360 : 0} 60 30`}
                dur={`${8 + i * 4}s`} repeatCount="indefinite"
              />
            </circle>
          ))}
          {/* Indicator dot orbiting the outer ring */}
          <circle cx="60" cy="2" r="3" fill={c} filter="url(#rglow)">
            <animateTransform attributeName="transform" type="rotate"
              from="0 60 30" to="360 60 30" dur="8s" repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
          </circle>
          {/* Live counter */}
          <text x="60" y="35" textAnchor="middle" fill={c} fontSize="14" fontWeight="700"
            fontFamily="monospace" filter="url(#rglow)">
            {String(count).padStart(2, "0")}
          </text>
          <text x="60" y="44" textAnchor="middle" fill={cLight} fontSize="5" fontFamily="monospace" opacity="0.7">
            SCORE
          </text>
        </svg>
      )
    case "spark": {
      const sp = "M8 48 L18 38 L28 42 L38 28 L48 32 L58 18 L68 22 L78 12 L88 16 L98 8 L108 10 L112 6"
      return (
        <svg viewBox="0 0 120 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="sgrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity="0.35" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </linearGradient>
            <filter id="sglow">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d={sp} fill="none" stroke={c} strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
          <path d={`${sp} L112 60 L8 60 Z`} fill="url(#sgrad)" opacity="0.2" />
          {/* Static data-point dots */}
          {[38, 42, 28, 32, 18, 22, 12, 16, 8, 10].map((y, i) => (
            <circle key={i} cx={18 + i * 10} cy={y} r="2" fill={c} opacity="0.5">
              <animate attributeName="r" values="2;3;2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {/* Glowing tracer outer */}
          <circle r="5" fill={c} filter="url(#sglow)">
            <animateMotion dur="4s" repeatCount="indefinite" path={sp} />
            <animate attributeName="opacity" values="0;0.7;0.7;0" dur="4s" repeatCount="indefinite"
              keyTimes="0;0.06;0.9;1" />
          </circle>
          {/* Tracer inner bright core */}
          <circle r="2.5" fill={c}>
            <animateMotion dur="4s" repeatCount="indefinite" path={sp} />
            <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite"
              keyTimes="0;0.06;0.9;1" />
          </circle>
          <circle r="1" fill="#fff">
            <animateMotion dur="4s" repeatCount="indefinite" path={sp} />
            <animate attributeName="opacity" values="0;0.9;0.9;0" dur="4s" repeatCount="indefinite"
              keyTimes="0;0.06;0.9;1" />
          </circle>
        </svg>
      )
    }
    default:
      return null
  }
}

function ModuleCard({
  name: n,
  tag,
  description: desc,
  color,
  visual,
  index,
  isDark,
}: GrowthOsModule & { index: number; isDark: boolean }) {
  const [hovered, setHovered] = useState(false)
  const isTeal = color === "teal"

  const accent = isTeal
    ? "var(--teal-500)"
    : isDark ? "#ADBFE8" : "var(--navy-700)"
  const accentGlow = isTeal
    ? "rgba(43,200,183,0.18)"
    : isDark ? "rgba(173,191,232,0.15)" : "rgba(74,123,196,0.18)"
  const accentBorder = isTeal
    ? "rgba(43,200,183,0.35)"
    : isDark ? "rgba(173,191,232,0.28)" : "rgba(74,123,196,0.38)"

  const baseBg = isDark
    ? "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)"
    : "var(--card)"
  const baseBorder = isDark ? "rgba(255,255,255,0.07)" : "var(--line)"
  const baseShadow = isDark
    ? "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)"
    : "0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.05)"
  const hoverShadow = isDark
    ? `0 20px 50px -15px ${accentGlow}, 0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)`
    : `0 20px 50px -15px ${accentGlow}, inset 0 1px 0 rgba(255,255,255,0.06)`

  const iconBg = isTeal
    ? "var(--teal-50)"
    : isDark ? "rgba(173,191,232,0.08)" : "rgba(74,123,196,0.10)"
  const iconGlow = hovered
    ? isTeal
      ? "0 0 16px rgba(43,200,183,0.25)"
      : isDark ? "0 0 16px rgba(173,191,232,0.20)" : "0 0 16px rgba(74,123,196,0.20)"
    : "none"

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-500 h-full"
      style={{
        background: baseBg,
        border: `1px solid ${hovered ? accentBorder : baseBorder}`,
        boxShadow: hovered ? hoverShadow : baseShadow,
        transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated gradient border overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${accentBorder} 0%, transparent 40%, transparent 60%, ${accentBorder} 100%)`,
          padding: "1px",
        }}
      />

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
        style={{
          backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative p-5 lg:p-6 flex flex-col h-full min-h-[220px]">
        {/* Top: Icon + Title row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span
              className="relative flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                width: 36,
                height: 36,
                background: iconBg,
                boxShadow: iconGlow,
              }}
            >
              <span
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background: accent,
                  boxShadow: `0 0 10px ${accentGlow}`,
                }}
              />
              {isTeal && (
                <span
                  className="absolute rounded-full animate-ping"
                  style={{
                    width: 8,
                    height: 8,
                    background: accent,
                    opacity: 0.3,
                  }}
                />
              )}
            </span>
            <div>
              <div className="text-[15px] font-bold text-[var(--navy-900)] tracking-tight leading-snug">
                {n}
              </div>
              <div className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] mt-0.5">
                {tag}
              </div>
            </div>
          </div>

          {/* Index badge */}
          <span
            className="mono text-[10px] font-bold px-2 py-1 rounded-md transition-colors duration-300"
            style={{
              background: hovered
                ? isTeal
                  ? "var(--teal-50)"
                  : isDark ? "rgba(173,191,232,0.10)" : "rgba(74,123,196,0.12)"
                : "transparent",
              color: accent,
            }}
          >
            0{index + 1}
          </span>
        </div>

        {/* SVG Visual — full-width, prominent */}
        <div className="w-full h-20 sm:h-24 my-3 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
          <ModuleVisual type={visual} color={color} />
        </div>

        {/* Description */}
        <p className="text-[12.5px] text-[var(--muted)] leading-relaxed max-w-[280px]">
          {desc}
        </p>

        {/* CTA */}
        <div className="mt-auto pt-3 flex items-center justify-end">
          <div
            className="flex items-center gap-1.5 text-[11px] font-semibold transition-all duration-300"
            style={{
              color: hovered ? accent : "var(--muted)",
              transform: hovered ? "translateX(2px)" : "translateX(0)",
            }}
          >
            Explore
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-0.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
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
    <section ref={sectionRef} id="growth-os" className="mt-16 md:mt-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="flex items-end justify-between flex-wrap gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-2">
              {eyebrow}
            </div>
            <h2 className="text-[22px] md:text-[28px] font-extrabold text-[var(--navy-900)] tracking-[-0.03em] leading-tight">
              {headline}{" "}
              <span style={{ color: "var(--teal-500)" }}>{headlineAccent}</span>
            </h2>
            <p className="mt-1.5 text-[13px] text-[var(--muted)] max-w-md leading-relaxed">
              {description}
            </p>
          </div>
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-[var(--navy-900)] border border-[var(--line)] px-4 py-2 rounded-full hover:border-[var(--teal-500)] hover:text-[var(--teal-500)] transition-colors duration-200"
          >
            {ctaLabel}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Bento grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map((m, i) => (
            <motion.div
              key={i}
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
