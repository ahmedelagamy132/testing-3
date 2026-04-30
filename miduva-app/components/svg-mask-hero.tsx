"use client"

import type React from "react"
import { useId, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface SvgMaskHeroProps {
  text?: string
  overlayColor?: string
  scrollLength?: number
  endScale?: number
  onRevealComplete?: () => void
  onRevealReverse?: () => void
  /** Element whose clip-path should be swept in lockstep with the scan beam. */
  scanTarget?: React.RefObject<HTMLElement | null>
  children?: React.ReactNode
}

export default function SvgMaskHero({
  text = "Miduva",
  overlayColor = "#0b1220",
  scrollLength = 2200,
  endScale = 38,
  onRevealComplete,
  onRevealReverse,
  scanTarget,
  children,
}: SvgMaskHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const textGroupRef = useRef<SVGGElement>(null)
  const fillRef = useRef<SVGRectElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const scanRef = useRef<HTMLDivElement>(null)
  const maskId = `miduva-text-mask-${useId().replace(/:/g, "")}`
  // Track whether we've already fired the reveal callback so onUpdate doesn't spam it
  const revealFiredRef = useRef(false)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const textGroup = textGroupRef.current
    const fillRect = fillRef.current
    const content = contentRef.current
    const hint = hintRef.current
    const grid = gridRef.current
    const scan = scanRef.current
    const navEl = scanTarget?.current ?? null
    if (!section || !textGroup || !fillRect || !content) return

    gsap.registerPlugin(ScrollTrigger)

    gsap.set(textGroup, { svgOrigin: "800 450", scale: 1 })
    gsap.set(content, { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" })
    // Grid is hidden — the scan paints it into existence during Phase 2.
    if (grid) gsap.set(grid, { opacity: 0, clipPath: "inset(0 100% 0 0)" })
    if (scan) gsap.set(scan, { opacity: 0, left: "-4%" })
    if (navEl) gsap.set(navEl, { clipPath: "inset(0 100% 0 0)" })
    revealFiredRef.current = false

    // Threshold (0–1) at which hero content starts appearing → nav should show
    const NAV_THRESHOLD = 0.68

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${scrollLength}`,
        scrub: 0.4,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.progress >= NAV_THRESHOLD && !revealFiredRef.current) {
            revealFiredRef.current = true
            onRevealComplete?.()
          } else if (self.progress < NAV_THRESHOLD && revealFiredRef.current) {
            revealFiredRef.current = false
            onRevealReverse?.()
          }
        },
        onEnterBack: () => {
          if (revealFiredRef.current) {
            revealFiredRef.current = false
            onRevealReverse?.()
          }
        },
      },
    })

    // Phase 1 (0% → 70%): zoom the text-shaped hole until it covers the screen
    tl.to(textGroup, { scale: endScale, ease: "power1.in", duration: 0.7 }, 0)
    tl.to(fillRect, { opacity: 1, ease: "power1.in", duration: 0.7 }, 0)
    // Phase 2 (70% → 88%): a vertical light beam sweeps across, painting the
    // blueprint grid and the hero content into existence as it passes.
    if (scan) {
      tl.to(scan, { opacity: 1, ease: "power2.out", duration: 0.02 }, 0.7)
      tl.to(scan, { left: "104%", ease: "none", duration: 0.18 }, 0.7)
      tl.to(scan, { opacity: 0, ease: "power2.in", duration: 0.03 }, 0.86)
    }
    if (grid) {
      tl.to(grid, { opacity: 1, ease: "none", duration: 0.02 }, 0.7)
      tl.to(grid, { clipPath: "inset(0 0% 0 0)", ease: "none", duration: 0.18 }, 0.7)
    }
    tl.to(content, { opacity: 1, y: 0, ease: "power2.out", duration: 0.04 }, 0.7)
    tl.to(content, { clipPath: "inset(0 0% 0 0)", ease: "none", duration: 0.18 }, 0.7)
    if (navEl) {
      tl.to(navEl, { clipPath: "inset(0 0% 0 0)", ease: "none", duration: 0.18 }, 0.7)
    }

    let hintTween: gsap.core.Tween | null = null
    if (hint) {
      hintTween = gsap.to(hint, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollLength * 0.1}`,
          scrub: true,
        },
      })
    }

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      hintTween?.scrollTrigger?.kill()
      hintTween?.kill()
    }
  }, [endScale, scrollLength, onRevealComplete, onRevealReverse, scanTarget])

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Solid dark base. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: overlayColor,
        }}
      />
      {/* Soft luminous gradient — what the text-shaped hole reveals during Phase 1.
          A radial blue glow gives the letters a lit-from-within quality. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(70,120,210,0.55) 0%, rgba(40,75,150,0.35) 35%, rgba(20,40,90,0.18) 65%, transparent 90%)",
        }}
      />
      {/* Blueprint grid — hidden until the scan beam paints it in during Phase 2. */}
      <div
        ref={gridRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          backgroundImage:
            "linear-gradient(to right, rgba(190,215,255,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(190,215,255,0.16) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: "center",
          willChange: "opacity, clip-path",
        }}
      />
      {/* Dark overlay with a text-shaped hole. As the text scales up, the hole
          grows until the entire overlay is "punched out" and the surface below is fully visible. */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect x="-2000" y="-2000" width="5600" height="4900" fill="white" />
            <rect ref={fillRef} x="0" y="0" width="1600" height="900" fill="black" opacity="0" />
            <g ref={textGroupRef}>
              <text
                x="800"
                y="450"
                textAnchor="middle"
                dominantBaseline="central"
                fill="black"
                fontSize="260"
                fontWeight={900}
                letterSpacing="-10"
                style={{
                  fontFamily:
                    "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif",
                }}
              >
                {text}
              </text>
            </g>
          </mask>
        </defs>
        <rect
          x="-2000"
          y="-2000"
          width="5600"
          height="4900"
          fill={overlayColor}
          mask={`url(#${maskId})`}
        />
      </svg>

      {/* Vertical light beam — sweeps left→right and "paints" the hero into existence. */}
      <div
        ref={scanRef}
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "-4%",
          width: 2,
          zIndex: 4,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(220,235,255,0.95) 40%, rgba(220,235,255,0.95) 60%, transparent 100%)",
          boxShadow:
            "0 0 18px 4px rgba(190,215,255,0.55), 0 0 60px 18px rgba(120,160,240,0.28)",
          willChange: "left, opacity",
        }}
      />

      {/* Hero content fades in (and is revealed by the scan beam) over the background */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          willChange: "opacity, transform, clip-path",
        }}
      >
        {children}
      </div>

      <div
        ref={hintRef}
        className="scroll-hint"
        style={{ zIndex: 6, color: "rgba(255,255,255,0.55)" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        scroll
      </div>
    </section>
  )
}
