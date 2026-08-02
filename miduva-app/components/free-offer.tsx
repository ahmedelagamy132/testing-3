"use client"

import { useRef } from "react"
import { motion } from "motion/react"
import { CalendarCheck, ArrowRight } from "lucide-react"
import type { FreeOfferData } from "@/lib/types"
import { useFrameInView } from "@/components/puck/frame-runtime"

const DEFAULT_INCLUDES = [
  "Full Business Audit",
  "Custom Growth Plan",
  "Expert Recommendations",
]

export default function FreeOffer({ theme = "light", data }: { theme?: "dark" | "light"; data?: FreeOfferData }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useFrameInView(sectionRef, { once: true, margin: "-80px" })
  const isDark = theme === "dark"

  const eyebrow        = data?.eyebrow        ?? "/ free offer"
  const headlineLine1  = data?.headlineLine1  ?? "Get a Free"
  const headlineAccent = data?.headlineAccent ?? "Growth Strategy"
  const headlineLine3  = data?.headlineLine3  ?? "for Your Business."
  const includes       = data?.includes?.length ? data.includes : DEFAULT_INCLUDES
  const ctaLabel       = data?.ctaLabel       ?? "Book Your Free Call"
  const ctaHref        = data?.ctaHref        ?? "#"
  const trustNote      = data?.trustNote      ?? "No commitment · No credit card · Just real strategy"

  return (
    <section
      id="cta"
      style={{
        background: isDark ? "#020204" : "#0F2349",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
      className="grain free-offer-section"
    >
      {/* Central mega elliptical glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1000,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(43,200,183,${isDark ? "0.20" : "0.16"}) 0%, transparent 60%)`,
          filter: "blur(72px)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle teal grid overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            `linear-gradient(rgba(43,200,183,${isDark ? "0.04" : "0.03"}) 1px, transparent 1px), linear-gradient(90deg, rgba(43,200,183,${isDark ? "0.04" : "0.03"}) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      {/* Teal top-edge seam */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(43,200,183,${isDark ? "0.45" : "0.40"}), transparent)`,
          pointerEvents: "none",
        }}
      />

      <div
        ref={sectionRef}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 860,
          margin: "0 auto",
          padding: "clamp(60px, 8vw, 120px) 24px",
          textAlign: "center",
        }}
      >
        {/* Eyebrow */}
        <motion.div
          className="mono"
          style={{
            fontSize: 13,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--teal-500)",
            marginBottom: 24,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow}
        </motion.div>

        {/* Headline */}
        <motion.h2
          style={{
            fontSize: "clamp(46px, 8vw, 96px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "white",
            lineHeight: 1.02,
            margin: "0 0 32px",
          }}
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {headlineLine1}<br />
          <span className="shine">{headlineAccent}</span><br />
          {headlineLine3}
        </motion.h2>

        {/* Include chips */}
        <motion.div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 52,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.55, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {includes.map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 18px",
                borderRadius: 100,
                background: isDark ? "rgba(43,200,183,0.10)" : "rgba(43,200,183,0.07)",
                border: isDark ? "1px solid rgba(43,200,183,0.25)" : "1px solid rgba(43,200,183,0.20)",
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--teal-500)",
                  flexShrink: 0,
                  display: "block",
                }}
              />
              {label}
            </div>
          ))}
        </motion.div>

        {/* CTA group */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          {/* Button wrapper with pulsing glow */}
          <div style={{ position: "relative", display: "inline-flex" }}>
            <motion.div
              aria-hidden
              style={{
                position: "absolute",
                inset: -12,
                borderRadius: 100,
                background: isDark ? "rgba(43,200,183,0.30)" : "rgba(43,200,183,0.25)",
                filter: "blur(20px)",
                pointerEvents: "none",
              }}
              animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.a
              href={ctaHref}
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "18px 40px",
                borderRadius: 100,
                background: "var(--teal-500)",
                color: "#0F2349",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                textDecoration: "none",
                zIndex: 1,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
            >
              <CalendarCheck style={{ width: 18, height: 18 }} strokeWidth={2} />
              {ctaLabel}
              <ArrowRight style={{ width: 16, height: 16 }} strokeWidth={2.5} />
            </motion.a>
          </div>

          {/* Trust line */}
          <p
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.22)",
              margin: 0,
            }}
          >
            {trustNote}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
