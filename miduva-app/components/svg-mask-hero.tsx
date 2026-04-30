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
      {/* Atmospheric backdrop — sits BEHIND the illustration to give it depth */}
      <div className="hero-backdrop" aria-hidden>
        <div className="hb-base" />
        <div className="hb-orb hb-orb-cyan" />
        <div className="hb-orb hb-orb-blue" />
        <div className="hb-orb hb-orb-violet" />
        <div className="hb-grid" />
        <div className="hb-conic" />
      </div>

      {/* Background illustration — full-bleed cover, anchored to the right */}
      <div className="hero-illustration" aria-hidden>
        <Image
          src="/hero-bg-image.png"
          alt=""
          fill
          priority
          unoptimized
          style={{ objectFit: "contain", objectPosition: "center right" }}
        />
      </div>

      {/* Vignette layered above the image: darkens the left for text legibility,
          fades the image edges into the atmospheric backdrop */}
      <div className="hb-vignette" aria-hidden />

      <style jsx>{`
        .hero-backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .hero-illustration {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          /* Mix the illustration with the glow behind it */
          mix-blend-mode: screen;
          filter: drop-shadow(0 0 60px rgba(0, 180, 255, 0.18))
            drop-shadow(0 0 120px rgba(140, 70, 255, 0.12));
          animation: hb-float 9s ease-in-out infinite alternate;
        }
        @keyframes hb-float {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
        .hb-base {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              120% 90% at 75% 50%,
              #0a1633 0%,
              #060a1f 55%,
              #03050f 100%
            );
        }
        .hb-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          will-change: transform;
          mix-blend-mode: screen;
        }
        .hb-orb-cyan {
          width: 42vw;
          height: 42vw;
          top: 8%;
          right: 4%;
          background: radial-gradient(
            circle,
            rgba(0, 200, 255, 0.55) 0%,
            rgba(0, 200, 255, 0) 65%
          );
          animation: hb-drift-a 22s ease-in-out infinite alternate;
        }
        .hb-orb-blue {
          width: 34vw;
          height: 34vw;
          top: 35%;
          right: 28%;
          background: radial-gradient(
            circle,
            rgba(40, 90, 255, 0.5) 0%,
            rgba(40, 90, 255, 0) 65%
          );
          animation: hb-drift-b 28s ease-in-out infinite alternate;
        }
        .hb-orb-violet {
          width: 30vw;
          height: 30vw;
          top: -4%;
          right: 48%;
          background: radial-gradient(
            circle,
            rgba(140, 70, 255, 0.4) 0%,
            rgba(140, 70, 255, 0) 65%
          );
          animation: hb-drift-c 32s ease-in-out infinite alternate;
        }
        .hb-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
          background-size: 64px 64px;
          background-position: -1px -1px;
          -webkit-mask-image: radial-gradient(
            ellipse 70% 60% at 70% 50%,
            #000 0%,
            transparent 80%
          );
          mask-image: radial-gradient(
            ellipse 70% 60% at 70% 50%,
            #000 0%,
            transparent 80%
          );
        }
        .hb-conic {
          position: absolute;
          inset: -10%;
          background: conic-gradient(
            from 200deg at 78% 50%,
            transparent 0deg,
            rgba(0, 200, 255, 0.1) 50deg,
            transparent 120deg,
            rgba(140, 70, 255, 0.08) 230deg,
            transparent 320deg
          );
          mix-blend-mode: screen;
          animation: hb-spin 60s linear infinite;
        }
        .hb-vignette {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            linear-gradient(
              to right,
              rgba(3, 5, 15, 0.92) 0%,
              rgba(3, 5, 15, 0.55) 30%,
              rgba(3, 5, 15, 0) 55%
            ),
            linear-gradient(
              to top,
              rgba(3, 5, 15, 0.55) 0%,
              rgba(3, 5, 15, 0.15) 40%,
              transparent 75%
            );
        }
        @keyframes hb-drift-a {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(-4vw, 3vw) scale(1.08); }
        }
        @keyframes hb-drift-b {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(3vw, -4vw) scale(1.1); }
        }
        @keyframes hb-drift-c {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(2vw, 4vw) scale(1.05); }
        }
        @keyframes hb-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hb-orb,
          .hb-conic {
            animation: none;
          }
        }
      `}</style>

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