"use client"

import { useState, useEffect } from "react"
import type { CSSProperties } from "react"
import type { HeroData } from "@/lib/types"

const DEFAULT_PHRASES = ["generate leads.", "drive sales.", "scale your business."]

interface HeroContentProps {
  theme?: "dark" | "light"
  data?: HeroData
}

export default function HeroContent({ theme = "dark", data }: HeroContentProps) {
  const phrases    = data?.phrases?.length ? data.phrases : DEFAULT_PHRASES
  const phrasePrefix = data?.phrasePrefix ?? "Engineered to"
  const headline   = data?.headline    ?? "We build custom growth systems."
  const tagline    = data?.tagline     ?? "A system that learns, adapts, and accelerates your growth."
  const body       = data?.body        ?? "No generic services. We design tailored systems using ads, funnels, automation, and data — engineered end-to-end, owned by you."
  const primaryLabel  = data?.primaryCta?.label  ?? "Get Started"
  const primaryHref   = data?.primaryCta?.href   ?? "#contact"
  const secondaryLabel = data?.secondaryCta?.label ?? "See Our Work"
  const secondaryHref  = data?.secondaryCta?.href  ?? "#our-work"

  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  // Legibility safety net over the busy hero artwork, layered on top of the
  // backdrop scrim. Soft and theme-aware so it reads as depth, not a hard halo.
  const headingShadow = theme === "dark"
    ? "0 1px 24px rgba(2,4,12,0.55), 0 1px 2px rgba(2,4,12,0.45)"
    : "0 1px 18px rgba(255,255,255,0.7)"
  const textShadow = theme === "dark"
    ? "0 1px 12px rgba(2,4,12,0.7), 0 1px 2px rgba(2,4,12,0.5)"
    : "0 1px 8px rgba(255,255,255,0.85)"
  const heroStyle: CSSProperties & {
    "--btn-secondary-hover-bg": string
    "--btn-secondary-hover-border": string
  } = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "clamp(120px, 20vh, 200px) clamp(24px, 5vw, 72px) clamp(40px, 6vh, 80px)",
    "--btn-secondary-hover-bg": theme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
    "--btn-secondary-hover-border": theme === "dark" ? "rgba(255, 255, 255, 0.32)" : "var(--navy-300)",
  }

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % phrases.length)
        setVisible(true)
      }, 380)
    }, 2800)
    return () => clearInterval(t)
  }, [phrases.length])

  return (
    <div
      className="hero-section"
      style={heroStyle}
    >
      <div className="hero-content-wrapper" style={{ maxWidth: "clamp(280px, 42vw, 620px)" }}>
        <h1
          className="hero-headline"
          data-edit-path="headline"
          style={{
            fontFamily:
              "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(32px, 4.2vw, 76px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: 0,
            color: theme === "dark" ? "#fff" : "var(--navy-900)",
            textShadow: headingShadow,
          }}
        >
          {headline}
        </h1>

        <p
          className="hero-subline"
          data-edit-path="phrasePrefix"
          style={{
            fontFamily:
              "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif",
            fontWeight: 300,
            fontSize: "clamp(16px, 1.8vw, 32px)",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            marginTop: 12,
            color: theme === "dark" ? "rgba(255,255,255,0.7)" : "var(--muted)",
            textShadow,
          }}
        >
          {phrasePrefix}{" "}
          <span
            className={`phrase-wrap inline-block ${visible ? "p-in" : "p-out"}`}
            data-edit-path={`phrases.${idx}`}
            style={{ color: theme === "dark" ? "rgba(255,255,255,0.9)" : "var(--navy-700)" }}
          >
            {phrases[idx]}
          </span>
        </p>

          <div
            className="hero-divider"
            style={{
              marginTop: "clamp(20px, 3.5vh, 40px)",
              height: 1,
              background: theme === "dark" ? "rgba(255,255,255,0.15)" : "var(--line)",
            }}
          />

        <p
          className="hero-tagline"
          data-edit-path="tagline"
          style={{
            fontFamily:
              "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "clamp(10px, 0.75vw, 12px)",
            letterSpacing: "0.2em",
            lineHeight: 1.7,
            textTransform: "uppercase",
            color: theme === "dark" ? "rgba(255,255,255,0.72)" : "var(--muted)",
            textShadow,
            margin: "16px 0 0",
          }}
        >
          {tagline}
        </p>

        <p
          className="hero-body"
          data-edit-path="body"
          style={{
            fontSize: "clamp(12px, 0.9vw, 14px)",
            lineHeight: 1.75,
            color: theme === "dark" ? "rgba(255,255,255,0.78)" : "var(--muted)",
            textShadow,
            margin: "10px 0 0",
          }}
        >
          {body}
        </p>

        {/* CTA Buttons */}
        <div
          className="hero-cta-group"
          style={{
            marginTop: "clamp(24px, 4vh, 44px)",
            display: "flex",
            gap: "clamp(16px, 2.4vw, 40px)",
            flexWrap: "wrap",
          }}
        >
          {/* Secondary — outlined, sits first like NP Digital's "RFP" */}
          <a
            href={secondaryHref}
            data-edit-path="secondaryCta"
            className="hero-btn hero-btn-secondary"
          >
            {secondaryLabel}
          </a>

          {/* Primary — solid fill */}
          <a
            href={primaryHref}
            data-edit-path="primaryCta"
            className="hero-btn hero-btn-primary"
          >
            {primaryLabel}
          </a>
        </div>
      </div>

      <style jsx>{`
        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: clamp(120px, 10vw, 150px);
          padding: clamp(14px, 1.6vh, 20px) clamp(28px, 2.6vw, 44px);
          border-radius: 0;
          font-family: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif;
          font-weight: 500;
          font-size: clamp(15px, 1.15vw, 19px);
          letter-spacing: -0.01em;
          line-height: 1;
          text-decoration: none;
          color: #fff;
          transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
        }
        .hero-btn-primary {
          background: #0066ff;
          border: 1px solid #0066ff;
        }
        .hero-btn-primary:hover {
          background: #1f7bff;
          border-color: #1f7bff;
        }
        .hero-btn-secondary {
          background: transparent;
          border: 1px solid #0066ff;
        }
        .hero-btn-secondary:hover {
          background: rgba(0, 102, 255, 0.14);
        }
        @media (max-width: 768px) {
          .hero-section {
            align-items: center !important;
            justify-content: flex-start !important;
            padding: clamp(166px, 20svh, 188px) 18px 22px !important;
          }
          .hero-content-wrapper {
            position: relative !important;
            isolation: isolate !important;
            text-align: center !important;
            max-width: min(100%, 380px) !important;
            margin-inline: auto !important;
          }
          .hero-headline {
            max-width: 8.5em !important;
            margin-inline: auto !important;
            font-size: clamp(34px, 10.2vw, 45px) !important;
            line-height: 0.94 !important;
            letter-spacing: -0.045em !important;
          }
          .hero-subline {
            max-width: 16em !important;
            margin: 10px auto 0 !important;
            font-size: clamp(16px, 4.3vw, 19px) !important;
            line-height: 1.16 !important;
          }
          .hero-divider {
            width: 64px !important;
            margin: 13px auto 0 !important;
            background: linear-gradient(90deg, transparent, rgba(43, 200, 183, 0.85), transparent) !important;
          }
          .hero-tagline {
            font-size: 9.5px !important;
            line-height: 1.38 !important;
            letter-spacing: 0.1em !important;
            margin: 10px auto 0 !important;
            max-width: 31ch !important;
          }
          .hero-body {
            display: none !important;
          }
          .hero-cta-group {
            justify-content: center !important;
            flex-direction: column-reverse !important;
            flex-wrap: nowrap !important;
            gap: 10px !important;
            width: min(100%, 300px) !important;
            margin: 16px auto 0 !important;
          }
          .hero-btn-primary,
          .hero-btn-secondary {
            width: 100% !important;
            flex: 0 0 auto !important;
            justify-content: center;
            min-width: 0;
            min-height: 46px;
            padding: 12px 16px !important;
            font-size: 15px !important;
          }
        }
        @media (max-width: 380px) {
          .hero-section {
            padding: clamp(146px, 18svh, 164px) 16px 20px !important;
          }
          .hero-headline {
            font-size: clamp(31px, 9.8vw, 38px) !important;
          }
        }
      `}</style>
    </div>
  )
}
