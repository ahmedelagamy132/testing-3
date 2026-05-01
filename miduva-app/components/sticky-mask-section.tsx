"use client"

import { useRef, useEffect } from "react"

export default function StickyMaskSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const easedProgress = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const animate = () => {
      const container = containerRef.current
      const mask = maskRef.current
      if (!container || !mask) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      const scrolled = -container.getBoundingClientRect().top
      const scrollable = container.offsetHeight - window.innerHeight
      const raw = Math.max(0, Math.min(1, scrolled / scrollable))

      // Lerp toward raw progress for smooth easing
      easedProgress.current += (raw - easedProgress.current) * 0.1

      // Mask grows from 8% (tiny portal) to 180% (fully covering viewport)
      const size = 8 + easedProgress.current * 172
      mask.style.webkitMaskSize = `${size}%`
      mask.style.maskSize = `${size}%`

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ height: "350vh", position: "relative", backgroundColor: "#03050f" }}
    >
      <div
        ref={maskRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          maskImage: "url('/assets/mask-circle.svg')",
          WebkitMaskImage: "url('/assets/mask-circle.svg')",
          maskSize: "8%",
          WebkitMaskSize: "8%",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      >
        {/* Video revealed through the expanding circular mask */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Overlay text — visible once mask is large enough */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to top, rgba(3,5,15,0.7) 0%, transparent 60%)",
            textAlign: "center",
            padding: "0 clamp(24px, 5vw, 72px)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
              fontSize: "clamp(10px, 0.75vw, 12px)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 16,
            }}
          >
            Growth. Engineered.
          </p>
          <h2
            style={{
              fontFamily: "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(36px, 6vw, 96px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#fff",
              margin: 0,
            }}
          >
            Systems that scale.
          </h2>
        </div>
      </div>
    </div>
  )
}
