"use client"

import { useState, useEffect, useRef } from "react"

interface ParallaxHeroProps {
  theme: "dark" | "light"
}

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
    <h1 className="rise-2 mt-8 max-w-5xl mx-auto text-center text-[40px] leading-[1.15] sm:text-[56px] md:text-[68px] lg:text-[76px] font-extrabold tracking-[-0.035em] text-[var(--navy-900)]" style={{ animationDelay: "1.4s" }}>
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
    <p className="rise-3 mx-auto text-center mt-7 max-w-2xl text-[17px] md:text-[19px] leading-[1.55] text-[var(--muted)] text-balance" style={{ animationDelay: "1.6s" }}>
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
    <div id="cta" className="rise-4 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animationDelay: "1.8s" }}>
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

export default function ParallaxHero({ theme }: ParallaxHeroProps) {
  const wrapRef = useRef<HTMLElement>(null)
  const darkBgRef = useRef<HTMLDivElement>(null)
  const canyonRef = useRef<HTMLImageElement>(null)
  const caveRef = useRef<HTMLImageElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = 0
      const wrap = wrapRef.current
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      const total = Math.max(1, wrap.offsetHeight - vh)
      const t = Math.min(1, Math.max(0, -rect.top / total))

      if (theme === "light") {
        const canyon = canyonRef.current
        const cave = caveRef.current
        const bloom = bloomRef.current
        if (canyon) {
          const canyonScale = 1.08 + t * 0.06
          canyon.style.transform = `translateY(${t * -4}%) scale(${canyonScale})`
        }
        if (cave) {
          const caveScale = 1 + t * 2.4
          cave.style.transform = `scale(${caveScale})`
          cave.style.opacity = String(1 - Math.pow(t, 1.6))
        }
        if (bloom) {
          bloom.style.opacity = String(Math.min(1, t * 1.4) * 0.6)
        }
      } else {
        const dark = darkBgRef.current
        const p = (vh - rect.top) / (vh + wrap.offsetHeight)
        if (dark) dark.style.transform = `translateY(${(p - 0.5) * -22}%)`
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", tick)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", tick)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [theme])

  const check = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-[var(--teal-500)]">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  )

  return (
    <section
      ref={wrapRef}
      style={{ position: "relative", height: theme === "light" ? "200vh" : "100vh" }}
    >
      <div
        style={{
          position: "sticky", top: 0, height: "100vh",
          overflow: "hidden", display: "flex", alignItems: "center",
        }}
      >
      {theme === "dark" ? (
        <div
          ref={darkBgRef}
          style={{ position: "absolute", inset: 0, willChange: "transform", pointerEvents: "none", zIndex: 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/earth.png"
            alt=""
            style={{
              position: "absolute", left: "50%", top: "50%",
              transform: "translateX(-50%) translateY(-50%)",
              height: "92vh", width: "auto", display: "block", userSelect: "none",
            }}
          />
        </div>
      ) : (
        <>
          {/* Canyon (destination) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={canyonRef}
            src="/assets/background.png"
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
              transform: "translateY(0%) scale(1.05)",
              willChange: "transform",
              userSelect: "none", pointerEvents: "none", zIndex: 0,
            }}
          />

          {/* Warm bloom at cave mouth */}
          <div
            ref={bloomRef}
            style={{
              position: "absolute", inset: 0,
              opacity: 0, willChange: "opacity",
              background:
                "radial-gradient(ellipse 45% 40% at 50% 52%, rgba(255,230,180,.55) 0%, rgba(255,210,150,.18) 40%, transparent 70%)",
              mixBlendMode: "screen",
              pointerEvents: "none", zIndex: 1,
            }}
          />

          {/* Cave foreground — full image visible (path included), mask reveals canyon through opening */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={caveRef}
            src="/assets/foreground.png"
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              transform: "scale(1)",
              transformOrigin: "50% 50%",
              objectFit: "contain", objectPosition: "center",
              willChange: "transform, opacity",
              userSelect: "none", pointerEvents: "none", zIndex: 2,
              maskImage:
                "radial-gradient(ellipse 48% 38% at 50% 48%, transparent 60%, rgba(0,0,0,0.4) 85%, black 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 48% 38% at 50% 48%, transparent 60%, rgba(0,0,0,0.4) 85%, black 100%)",
            }}
          />
        </>
      )}

      {/* Radial overlay */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          background:
            theme === "dark"
              ? "radial-gradient(ellipse 75% 80% at 50% 50%,rgba(2,6,15,.1) 0%,rgba(2,6,15,.55) 55%,rgba(2,6,15,.95) 90%)"
              : "radial-gradient(ellipse 75% 80% at 50% 50%,transparent 0%,rgba(2,6,15,.08) 60%,rgba(2,6,15,.35) 92%)",
        }}
      />

      {/* Edge fades */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          background:
            theme === "dark"
              ? "linear-gradient(to bottom,rgba(2,6,15,.6) 0%,transparent 20%,transparent 75%,rgba(2,6,15,.7) 100%)"
              : "linear-gradient(to bottom,rgba(2,6,15,.18) 0%,transparent 20%,transparent 75%,rgba(2,6,15,.22) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative", zIndex: 4, width: "100%",
          padding: "clamp(100px,14vh,150px) clamp(24px,6vw,96px) 0",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Headline />
          <Sub />
          <CTAs />
          <div
            className="rise-5 mt-8 flex items-center justify-center gap-5 text-[12px] text-[var(--muted)]"
            style={{ flexWrap: "wrap", animationDelay: "2.0s" }}
          >
            <span className="inline-flex items-center gap-1.5">{check} No contracts</span>
            <span className="inline-flex items-center gap-1.5">{check} 30-min intro call</span>
            <span className="inline-flex items-center gap-1.5">{check} Plan delivered in 48h</span>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
