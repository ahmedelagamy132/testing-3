"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface SvgMaskHeroProps {
  text?: string
  bgSrc?: string
  overlayColor?: string
  scrollLength?: number
  initialScale?: number
  endScale?: number
  onRevealComplete?: () => void
  onRevealReverse?: () => void
}

export default function SvgMaskHero({
  text = "Miduva",
  bgSrc = "/assets/background.png",
  overlayColor = "#0b1220",
  scrollLength = 2000,
  initialScale = 1,
  endScale = 35,
  onRevealComplete,
  onRevealReverse,
}: SvgMaskHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const overlay = overlayRef.current
    const text = textRef.current
    const hint = hintRef.current
    if (!section || !overlay || !text) return

    gsap.registerPlugin(ScrollTrigger)

    // Initial states
    gsap.set(text, { scale: initialScale, opacity: 1 })
    gsap.set(overlay, { opacity: 1 })

    // Scale text up and fade it out
    const textTween = gsap.to(text, {
      scale: endScale,
      opacity: 0,
      ease: "none",
      transformOrigin: "center center",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${scrollLength}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onLeave: () => onRevealComplete?.(),
        onEnterBack: () => onRevealReverse?.(),
      },
    })

    // Fade dark overlay out so full background is visible by the end
    const overlayTween = gsap.to(overlay, {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${scrollLength}`,
        scrub: true,
      },
    })

    // Fade scroll hint quickly
    const hintTween = hint
      ? gsap.to(hint, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${scrollLength * 0.12}`,
            scrub: true,
          },
        })
      : null

    return () => {
      textTween.scrollTrigger?.kill()
      textTween.kill()
      overlayTween.scrollTrigger?.kill()
      overlayTween.kill()
      hintTween?.scrollTrigger?.kill()
      hintTween?.kill()
    }
  }, [initialScale, endScale, scrollLength, onRevealComplete, onRevealReverse])

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
      }}
    >
      {/* 1. Background image — completely static, never moves or scales */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgSrc}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          userSelect: "none",
          pointerEvents: "none",
          display: "block",
        }}
      />

      {/* 2. Dark overlay — fades out on scroll */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: overlayColor,
        }}
      />

      {/* 3. Text — scales up and fades out on scroll */}
      <div
        ref={textRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: "clamp(80px, 18vw, 280px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            fontFamily: "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif",
            color: "rgba(255,255,255,0.92)",
            userSelect: "none",
            textShadow: "0 0 80px rgba(43,200,183,0.35)",
            willChange: "transform",
          }}
        >
          {text}
        </span>
      </div>

      {/* Scroll hint */}
      <div
        ref={hintRef}
        className="scroll-hint"
        style={{ zIndex: 3, color: "rgba(255,255,255,0.55)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
        scroll
      </div>
    </section>
  )
}
