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
  initialScale = 50,
  endScale = 1,
  onRevealComplete,
  onRevealReverse,
}: SvgMaskHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const maskRectRef = useRef<SVGRectElement>(null)
  const overlayRectRef = useRef<SVGRectElement>(null)
  const textRef = useRef<SVGTextElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const svg = svgRef.current
    const textEl = textRef.current
    if (!section || !svg || !textEl) return

    const w = window.innerWidth
    const h = window.innerHeight
    const cx = w / 2
    const cy = h / 2
    // Scale font so the word fills a nice portion of the viewport at scale 1
    const fontSize = Math.min(w * 0.18, 280)

    // Set SVG dimensions and element positions directly — no state re-render
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`)
    maskRectRef.current?.setAttribute("width", String(w))
    maskRectRef.current?.setAttribute("height", String(h))
    overlayRectRef.current?.setAttribute("width", String(w))
    overlayRectRef.current?.setAttribute("height", String(h))
    textEl.setAttribute("x", String(cx))
    textEl.setAttribute("y", String(cy))
    textEl.setAttribute("font-size", String(fontSize))

    // Apply initial scale BEFORE browser paints
    gsap.registerPlugin(ScrollTrigger)
    const origin = `${cx} ${cy}`
    gsap.set(textEl, { scale: initialScale, svgOrigin: origin })

    const tween = gsap.to(textEl, {
      scale: endScale,
      ease: "none",
      svgOrigin: origin,
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

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [initialScale, endScale, scrollLength, onRevealComplete, onRevealReverse])

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: overlayColor,
      }}
    >
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

      <svg
        ref={svgRef}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          overflow: "visible",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="letter-reveal-mask" maskUnits="userSpaceOnUse">
            <rect ref={maskRectRef} x="0" y="0" width="1440" height="900" fill="white" />
            <text
              ref={textRef}
              x="720"
              y="450"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="280"
              fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fill="black"
            >
              {text}
            </text>
          </mask>
        </defs>

        <rect
          ref={overlayRectRef}
          x="0"
          y="0"
          width="1440"
          height="900"
          fill={overlayColor}
          mask="url(#letter-reveal-mask)"
        />
      </svg>
    </section>
  )
}
