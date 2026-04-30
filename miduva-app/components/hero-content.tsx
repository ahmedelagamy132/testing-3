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
        justifyContent: "flex-end",
      }}
    >
      {/* Vertical edge label (desktop only) */}
      <div
        className="hidden md:flex"
        style={{
          position: "absolute",
          left: "clamp(20px, 2.4vw, 36px)",
          top: "50%",
          transform: "translateY(-50%)",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            display: "block",
            width: 1,
            height: 80,
            background: "rgba(255,255,255,0.3)",
          }}
        />
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            display: "block",
            fontFamily:
              "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.75)",
            whiteSpace: "nowrap",
          }}
        >
          Your Portal for Revenue
        </span>
        <span
          style={{
            display: "block",
            width: 1,
            height: 80,
            background: "rgba(255,255,255,0.3)",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          padding: "clamp(28px, 5vh, 64px) clamp(24px, 6vw, 80px)",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontFamily:
              "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "clamp(36px, 5.6vw, 88px)",
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
            margin: 0,
            color: "#fff",
            textWrap: "balance",
          }}
        >
          We build custom growth systems.
        </h1>

        <p
          style={{
            fontFamily:
              "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif",
            fontWeight: 300,
            fontSize: "clamp(22px, 3vw, 44px)",
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
            marginTop: 8,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Engineered to{" "}
          <span
            className={`phrase-wrap inline-block ${visible ? "p-in" : "p-out"}`}
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {phrases[idx]}
          </span>
        </p>

        <div
          style={{
            marginTop: "clamp(28px, 5vh, 56px)",
            height: 1,
            width: "100%",
            background: "rgba(255,255,255,0.18)",
          }}
        />

        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "1fr",
            columnGap: 32,
            rowGap: 18,
          }}
          className="hero-footer-grid"
        >
          <div style={{ maxWidth: 360 }}>
            <p
              style={{
                fontFamily:
                  "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 11,
                letterSpacing: "0.18em",
                lineHeight: 1.6,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                margin: 0,
              }}
            >
              A system that learns, adapts, and accelerates your growth.
            </p>
          </div>

          <div style={{ maxWidth: 520 }}>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.7)",
                margin: 0,
              }}
            >
              No generic services. We design tailored systems using ads,
              funnels, automation, and data — engineered end-to-end, owned by
              you.
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.7)",
                margin: "12px 0 0",
              }}
            >
              Growth that doesn&apos;t just respond — it anticipates, adapts,
              and scales with precision.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .hero-footer-grid {
            grid-template-columns: 1fr 1fr !important;
            justify-content: space-between;
          }
          .hero-footer-grid > div:last-child {
            justify-self: end;
          }
        }
      `}</style>
    </div>
  )
}
