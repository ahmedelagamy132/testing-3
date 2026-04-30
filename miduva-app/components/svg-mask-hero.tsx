"use client"

import type React from "react"
import Image from "next/image"
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
  children?: React.ReactNode
}

export default function SvgMaskHero({
  text = "Miduva",
  overlayColor = "#0b1220",
  scrollLength = 2200,
  endScale = 38,
  onRevealComplete,
  onRevealReverse,
  children,
}: SvgMaskHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const textGroupRef = useRef<SVGGElement>(null)
  const fillRef = useRef<SVGRectElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const maskId = `miduva-text-mask-${useId().replace(/:/g, "")}`
  // Track whether we've already fired the reveal callback so onUpdate doesn't spam it
  const revealFiredRef = useRef(false)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const textGroup = textGroupRef.current
    const fillRect = fillRef.current
    const content = contentRef.current
    const hint = hintRef.current
    if (!section || !textGroup || !fillRect || !content) return

    gsap.registerPlugin(ScrollTrigger)

    gsap.set(textGroup, { svgOrigin: "800 450", scale: 1 })
    gsap.set(content, { opacity: 0, y: 30 })
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
    // Phase 2 (70% → 100%): fade in the hero content over the revealed background
    tl.to(content, { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 }, 0.7)

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
  }, [endScale, scrollLength, onRevealComplete, onRevealReverse])

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#05081a",
      }}
    >
      {/* Background image — contain so the full illustration is always visible */}
      <Image
        src="/hero-bg-image.png"
        alt=""
        fill
        priority
        unoptimized
        aria-hidden
        style={{ objectFit: "contain", objectPosition: "center right" }}
      />

      {/* Permanent gradient to keep text legible over the background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(5,8,20,0.88) 0%, rgba(5,8,20,0.55) 35%, rgba(5,8,20,0.15) 65%, transparent 100%)",
        }}
      />

      {/* Dark overlay with a text-shaped hole. As the text scales up, the hole
          grows until the entire overlay is "punched out" and the bg is fully visible. */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
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

      {/* Hero content fades in over the revealed background */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          willChange: "opacity, transform",
        }}
      >
        {children}
      </div>

      <div
        ref={hintRef}
        className="scroll-hint"
        style={{ zIndex: 3, color: "rgba(255,255,255,0.55)" }}
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