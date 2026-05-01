"use client"

import type React from "react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface SvgMaskHeroProps {
  text?: string
  onRevealComplete?: () => void
  children?: React.ReactNode
  // Kept for backward compatibility with existing call sites; unused.
  overlayColor?: string
  scrollLength?: number
  endScale?: number
  onRevealReverse?: () => void
  scanTarget?: React.RefObject<HTMLElement | null>
}

type Phase = "intro" | "split" | "done"

const LETTER_STAGGER_MS = 75
const LETTER_RISE_MS = 600
const HOLD_MS = 350
const SPLIT_MS = 800

export default function SvgMaskHero({
  text = "Miduva",
  onRevealComplete,
  children,
}: SvgMaskHeroProps) {
  const [phase, setPhase] = useState<Phase>("intro")
  const hintRef = useRef<HTMLDivElement>(null)

  // Lock scroll during the intro animation so users can't skip past it
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  useEffect(() => {
    const cascadeEnd = (text.length - 1) * LETTER_STAGGER_MS + LETTER_RISE_MS
    const splitAt = cascadeEnd + HOLD_MS
    // Fire reveal slightly before split fully ends so nav transition feels live
    const revealAt = splitAt + SPLIT_MS - 250

    const t1 = window.setTimeout(() => setPhase("split"), splitAt)
    const t2 = window.setTimeout(() => {
      setPhase("done")
      document.body.style.overflow = ""
      onRevealComplete?.()
    }, revealAt)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [text, onRevealComplete])

  // Fade scroll hint as the user scrolls
  useEffect(() => {
    if (phase !== "done") return
    const hint = hintRef.current
    if (!hint) return
    const onScroll = () => {
      const y = window.scrollY
      const o = Math.max(0, 1 - y / 220)
      hint.style.opacity = String(o)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [phase])

  const letters = Array.from(text)

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#05081a",
      }}
    >
      {/* Atmospheric backdrop — sits BEHIND the illustration */}
      <div className="hero-backdrop" aria-hidden>
        <div className="hb-base" />
        <div className="hb-orb hb-orb-cyan" />
        <div className="hb-orb hb-orb-blue" />
        <div className="hb-orb hb-orb-violet" />
        <div className="hb-grid" />
        <div className="hb-conic" />
      </div>

      {/* Background illustration */}
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

      {/* Vignette for text legibility */}
      <div className="hb-vignette" aria-hidden />

      {/* Hero content — fades in once the wordmark splits */}
      <div
        className="hero-content-wrap"
        style={{
          opacity: phase !== "intro" ? 1 : 0,
          transform: phase !== "intro" ? "translateY(0)" : "translateY(18px)",
        }}
      >
        {children}
      </div>

      {/* Intro overlay: solid dark "curtains" + letter cascade, then vertical split */}
      {phase !== "done" && (
        <div
          className={`hero-intro ${phase === "split" ? "is-split" : ""}`}
          aria-label={text}
          role="img"
        >
          {/* Dark curtains that split open to reveal the hero */}
          <div className="hero-curtain hero-curtain-top" aria-hidden />
          <div className="hero-curtain hero-curtain-bottom" aria-hidden />

          {/* Wordmark sits above the curtains; halves slide out with them */}
          <div className="hero-wordmark">
            <div className="hero-half hero-half-top" aria-hidden>
              {letters.map((c, i) => (
                <span
                  key={`t-${i}`}
                  className="hero-letter"
                  style={{ opacity: 0, animationDelay: `${i * LETTER_STAGGER_MS}ms` }}
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="hero-half hero-half-bottom" aria-hidden>
              {letters.map((c, i) => (
                <span
                  key={`b-${i}`}
                  className="hero-letter"
                  style={{ opacity: 0, animationDelay: `${i * LETTER_STAGGER_MS}ms` }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Hairline that briefly traces the split line */}
          <div className="hero-split-line" aria-hidden />
        </div>
      )}

      {phase === "done" && (
        <div
          ref={hintRef}
          className="scroll-hint hero-hint-in"
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
      )}

      <style jsx>{`
        .hero-backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .hb-base {
          position: absolute;
          inset: 0;
          background: radial-gradient(
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

        .hero-illustration {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          mix-blend-mode: screen;
          filter: drop-shadow(0 0 60px rgba(0, 180, 255, 0.18))
            drop-shadow(0 0 120px rgba(140, 70, 255, 0.12));
          animation: hb-float 9s ease-in-out infinite alternate;
        }

        /* Hero content fades in as the split begins */
        .hero-content-wrap {
          position: absolute;
          inset: 0;
          z-index: 2;
          transition:
            opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
            transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        /* Intro overlay */
        .hero-intro {
          position: absolute;
          inset: 0;
          z-index: 4;
          display: grid;
          place-items: center;
          pointer-events: none;
          background: transparent;
        }

        /* Solid dark curtains — cover everything during intro,
           split open along the vertical center to reveal the hero */
        .hero-curtain {
          position: absolute;
          left: 0;
          right: 0;
          height: 50%;
          background-color: #05081a;
          background-image:
            radial-gradient(
              80% 100% at 50% 100%,
              rgba(10, 22, 51, 1) 0%,
              rgba(3, 5, 15, 1) 100%
            );
          will-change: transform;
          transition: transform 0.85s cubic-bezier(0.7, 0, 0.2, 1);
        }
        .hero-curtain-top {
          top: 0;
          background-color: #05081a;
          background-image:
            radial-gradient(
              80% 100% at 50% 100%,
              rgba(10, 22, 51, 1) 0%,
              rgba(3, 5, 15, 1) 100%
            );
        }
        .hero-curtain-bottom {
          bottom: 0;
          background-color: #05081a;
          background-image:
            radial-gradient(
              80% 100% at 50% 0%,
              rgba(10, 22, 51, 1) 0%,
              rgba(3, 5, 15, 1) 100%
            );
        }
        .hero-intro.is-split .hero-curtain-top {
          transform: translateY(-100%);
        }
        .hero-intro.is-split .hero-curtain-bottom {
          transform: translateY(100%);
        }

        /* Hairline that briefly glows along the split seam */
        .hero-split-line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(0, 200, 255, 0.7) 30%,
            rgba(140, 70, 255, 0.7) 70%,
            transparent 100%
          );
          opacity: 0;
          transform: scaleX(0.2);
          transform-origin: center;
          transition:
            opacity 0.25s ease,
            transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .hero-intro.is-split .hero-split-line {
          opacity: 1;
          transform: scaleX(1);
        }

        .hero-wordmark {
          position: relative;
          line-height: 1;
          z-index: 2;
        }
        .hero-half {
          font-family: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(72px, 13vw, 200px);
          letter-spacing: -0.05em;
          color: #ffffff;
          white-space: nowrap;
          line-height: 1;
          will-change: transform, opacity;
          transition:
            transform 0.8s cubic-bezier(0.7, 0, 0.25, 1),
            opacity 0.55s ease 0.05s;
        }
        .hero-half-top {
          clip-path: inset(0 0 50% 0);
        }
        .hero-half-bottom {
          position: absolute;
          inset: 0;
          clip-path: inset(50% 0 0 0);
        }
        .hero-intro.is-split .hero-half-top {
          transform: translateY(-70vh);
          opacity: 0;
        }
        .hero-intro.is-split .hero-half-bottom {
          transform: translateY(70vh);
          opacity: 0;
        }

        .hero-letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(40%);
          animation: hero-letter-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes hero-letter-in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-hint-in {
          opacity: 0;
          animation: hero-hint-in 0.6s ease 0.1s forwards;
        }
        @keyframes hero-hint-in {
          to {
            opacity: 1;
          }
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
        @keyframes hb-float {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hb-orb,
          .hb-conic,
          .hero-illustration {
            animation: none;
          }
          .hero-letter {
            animation-duration: 0.001s;
          }
          .hero-half {
            transition-duration: 0.001s;
          }
        }
      `}</style>
    </section>
  )
}
