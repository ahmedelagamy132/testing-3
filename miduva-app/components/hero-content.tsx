"use client"

import { useState, useEffect } from "react"

const phrases = ["generate leads.", "drive sales.", "scale your business."]

export default function HeroContent() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

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
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 clamp(24px, 5vw, 72px)",
      }}
    >
      <div style={{ maxWidth: "clamp(280px, 42vw, 620px)" }}>
        <h1
          style={{
            fontFamily:
              "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(32px, 4.2vw, 76px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: 0,
            color: "#fff",
          }}
        >
          We build custom growth systems.
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
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Engineered to{" "}
          <span
            className={`phrase-wrap inline-block ${visible ? "p-in" : "p-out"}`}
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            {phrases[idx]}
          </span>
        </p>

        <div
          style={{
            marginTop: "clamp(20px, 3.5vh, 40px)",
            height: 1,
            background: "rgba(255,255,255,0.15)",
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
            color: "rgba(255,255,255,0.45)",
            margin: "16px 0 0",
          }}
        >
          A system that learns, adapts, and accelerates your growth.
        </p>

        <p
          style={{
            fontSize: "clamp(12px, 0.9vw, 14px)",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.6)",
            margin: "10px 0 0",
          }}
        >
          No generic services. We design tailored systems using ads, funnels,
          automation, and data — engineered end-to-end, owned by you.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            marginTop: "clamp(24px, 4vh, 44px)",
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          {/* Primary */}
          <a
            href="#get-started"
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
            Get Started
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Secondary */}
          <a
            href="#case-studies"
            className="hero-btn-secondary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "clamp(10px,1.1vh,14px) clamp(20px,2vw,32px)",
              borderRadius: 999,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.85)",
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
            See Our Work
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
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.32);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
