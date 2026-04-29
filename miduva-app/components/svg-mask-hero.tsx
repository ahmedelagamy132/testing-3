"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface SvgMaskHeroProps {
  letter?: string
  bgSrc?: string
  overlayColor?: string
  scrollLength?: number
  initialScale?: number
  endScale?: number
}

export default function SvgMaskHero({
  letter = "M",
  bgSrc = "/assets/background.png",
  overlayColor = "#0b1220",
  scrollLength = 2000,
  initialScale = 50,
  endScale = 1,
}: SvgMaskHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const maskRectRef = useRef<SVGRectElement>(null)
  const overlayRectRef = useRef<SVGRectElement>(null)
  const letterRef = useRef<SVGTextElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const svg = svgRef.current
    const letter = letterRef.current
    if (!section || !svg || !letter) return

    const w = window.innerWidth
    const h = window.innerHeight
    const cx = w / 2
    const cy = h / 2
    const fontSize = Math.min(w * 0.38, 680)

    // Set SVG dimensions and element positions directly — no state re-render
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`)
    maskRectRef.current?.setAttribute("width", String(w))
    maskRectRef.current?.setAttribute("height", String(h))
    overlayRectRef.current?.setAttribute("width", String(w))
    overlayRectRef.current?.setAttribute("height", String(h))
    letter.setAttribute("x", String(cx))
    letter.setAttribute("y", String(cy))
    letter.setAttribute("font-size", String(fontSize))

    // Apply initial scale BEFORE browser paints
    gsap.registerPlugin(ScrollTrigger)
    const origin = `${cx} ${cy}`
    gsap.set(letter, { scale: initialScale, svgOrigin: origin })

    const tween = gsap.to(letter, {
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
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [initialScale, endScale, scrollLength])

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
              ref={letterRef}
              x="720"
              y="450"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="547"
              fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fill="black"
            >
              {letter}
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
