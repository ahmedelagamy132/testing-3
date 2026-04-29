"use client"

import { useState, useEffect } from "react"

function Headline() {
  const phrases = ["generate leads.", "drive sales.", "scale your business."]
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % phrases.length)
        setVisible(true)
      }, 380)
    }, 2800)
    return () => clearInterval(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <h1 className="mt-8 max-w-5xl mx-auto text-center text-[40px] leading-[1.15] sm:text-[56px] md:text-[68px] lg:text-[76px] font-extrabold tracking-[-0.035em] text-[var(--navy-900)]">
      We build{" "}
      <span className="relative inline-block">
        <span className="relative z-10">custom growth</span>
        <svg
          aria-hidden
          className="absolute -bottom-1 left-0 w-full"
          viewBox="0 0 300 14"
          preserveAspectRatio="none"
          height="12"
        >
          <path
            d="M2 9 C 70 2, 150 2, 298 8"
            stroke="var(--teal-500)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </span>{" "}
      <span className="text-[var(--navy-700)]">systems</span> that
      <span className="block mt-1">
        <span className={`phrase-wrap inline-block ${visible ? "p-in" : "p-out"}`}>
          <span className="shine">{phrases[idx]}</span>
        </span>
      </span>
    </h1>
  )
}

function Sub() {
  return (
    <p className="mx-auto text-center mt-7 max-w-2xl text-[17px] md:text-[19px] leading-[1.55] text-[var(--muted)] text-balance">
      No generic services. We design tailored systems using{" "}
      <span className="text-[var(--navy-900)] font-semibold">
        ads, funnels, automation &amp; data
      </span>{" "}
      to grow your business — engineered end-to-end, owned by you.
    </p>
  )
}

function CTAs() {
  return (
    <div id="cta" className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
      <div className="bg-gradient-to-b from-[var(--teal-300)]/60 to-[var(--teal-500)]/30 p-[2px] rounded-2xl shadow-[0_15px_40px_-15px_rgba(43,200,183,.5)]">
        <a
          href="#"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[14px] btn-primary font-semibold text-[15px] tracking-tight"
        >
          <span className="inline-block">🔥</span>
          Book a Free Strategy Call
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
      <a
        href="#"
        className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-[var(--line)] bg-[var(--card)] hover:bg-[var(--paper-2)] font-semibold text-[15px] text-[var(--navy-900)] transition"
      >
        Get Your Free Growth Plan
        <span className="mono text-[11px] text-[var(--muted)] border border-[var(--line)] rounded-md px-1.5 py-0.5 group-hover:border-[var(--teal-500)] group-hover:text-[var(--teal-500)] transition">
          PDF
        </span>
      </a>
    </div>
  )
}

export default function HeroContent() {
  const check = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-[var(--teal-500)]">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  )

  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(80px,12vh,140px) clamp(24px,6vw,96px)",
        textAlign: "center",
        background: "var(--paper)",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Headline />
        <Sub />
        <CTAs />
        <div
          className="mt-8 flex items-center justify-center gap-5 text-[12px] text-[var(--muted)]"
          style={{ flexWrap: "wrap" }}
        >
          <span className="inline-flex items-center gap-1.5">{check} No contracts</span>
          <span className="inline-flex items-center gap-1.5">{check} 30-min intro call</span>
          <span className="inline-flex items-center gap-1.5">{check} Plan delivered in 48h</span>
        </div>
      </div>
    </section>
  )
}
