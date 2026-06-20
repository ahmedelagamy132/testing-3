"use client"

import { useState, useEffect } from "react"
import type { HeroData } from "@/lib/types"

const DEFAULT_PHRASES = ["generate leads.", "drive sales.", "scale your business."]

interface HeroContentProps {
  theme?: "dark" | "light"
  data?: HeroData
}

export default function HeroContent({ theme = "dark", data }: HeroContentProps) {
  const phrases    = data?.phrases?.length ? data.phrases : DEFAULT_PHRASES
  const headline   = data?.headline    ?? "We build custom growth systems."
  const tagline    = data?.tagline     ?? "A system that learns, adapts, and accelerates your growth."
  const body       = data?.body        ?? "No generic services. We design tailored systems using ads, funnels, automation, and data — engineered end-to-end, owned by you."
  const primaryLabel  = data?.primaryCta?.label  ?? "Get Started"
  const primaryHref   = data?.primaryCta?.href   ?? "#get-started"
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

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % phrases.length)
        setVisible(true)
      }, 380)
    }, 2800)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="hero-section"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "clamp(120px, 20vh, 200px) clamp(24px, 5vw, 72px) clamp(40px, 6vh, 80px)",
        ["--btn-secondary-hover-bg" as any]: theme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
        ["--btn-secondary-hover-border" as any]: theme === "dark" ? "rgba(255, 255, 255, 0.32)" : "var(--navy-300)",
      }}
    >
      <div className="hero-content-wrapper" style={{ maxWidth: "clamp(280px, 42vw, 620px)" }}>
        <h1
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
          Engineered to{" "}
          <span
            className={`phrase-wrap inline-block ${visible ? "p-in" : "p-out"}`}
            style={{ color: theme === "dark" ? "rgba(255,255,255,0.9)" : "var(--navy-700)" }}
          >
            {phrases[idx]}
          </span>
        </p>

          <div
            style={{
              marginTop: "clamp(20px, 3.5vh, 40px)",
              height: 1,
              background: theme === "dark" ? "rgba(255,255,255,0.15)" : "var(--line)",
            }}
          />

        <p
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
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          {/* Primary */}
          <a
            href={primaryHref}
            className="hero-btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "clamp(10px,1.1vh,14px) clamp(20px,2vw,32px)",
              borderRadius: 999,
              background: "linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)",
              color: "#fff",
              fontFamily:
                "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(13px, 0.95vw, 15px)",
              letterSpacing: "-0.01em",
              textDecoration: "none",
              boxShadow: "0 0 28px rgba(0,180,255,0.35)",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
            }}
          >
            {primaryLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Secondary */}
          <a
            href={secondaryHref}
            className="hero-btn-secondary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "clamp(10px,1.1vh,14px) clamp(20px,2vw,32px)",
              borderRadius: 999,
              background: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              border: theme === "dark" ? "1px solid rgba(255,255,255,0.18)" : "1px solid var(--line)",
              color: theme === "dark" ? "rgba(255,255,255,0.85)" : "var(--navy-700)",
              fontFamily:
                "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "clamp(13px, 0.95vw, 15px)",
              letterSpacing: "-0.01em",
              textDecoration: "none",
              backdropFilter: "blur(8px)",
              transition: "background 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
            }}
          >
            {secondaryLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 42px rgba(0, 180, 255, 0.55);
        }
        .hero-btn-secondary:hover {
          background: var(--btn-secondary-hover-bg);
          border-color: var(--btn-secondary-hover-border);
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .hero-section {
            align-items: center !important;
          }
          .hero-content-wrapper {
            text-align: center !important;
            max-width: calc(100vw - 48px) !important;
          }
          .hero-cta-group {
            justify-content: center !important;
            flex-wrap: nowrap !important;
            gap: 8px !important;
          }
          .hero-btn-primary,
          .hero-btn-secondary {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
