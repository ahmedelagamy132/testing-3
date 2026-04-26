"use client"

import * as React from "react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface SectionRevealProps {
  frontSection: React.ReactNode
  backSection: React.ReactNode
  className?: string
}

export function SectionReveal({
  frontSection,
  backSection,
  className,
}: SectionRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const backLayerRef = useRef<HTMLDivElement>(null)
  const backContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !revealRef.current) return

    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 100)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        backLayerRef.current,
        { y: "8vh", scale: 0.94 },
        {
          y: "0vh",
          scale: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: revealRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1.2,
          },
        }
      )

      gsap.fromTo(
        backContentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: revealRef.current,
            start: "top 70%",
            end: "top top",
            scrub: 1.2,
          },
        }
      )
    }, wrapperRef)

    return () => {
      clearTimeout(refreshId)
      ctx.revert()
    }
  }, [])

  return (
    <div ref={wrapperRef} className={className}>
      <div className="relative z-10">{frontSection}</div>

      <div
        ref={revealRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <div
          ref={backLayerRef}
          className="fixed bottom-0 left-0 w-full h-screen overflow-hidden will-change-transform"
        >
          <div
            ref={backContentRef}
            className="relative w-full h-full will-change-transform"
          >
            {backSection}
          </div>
        </div>
      </div>
    </div>
  )
}
