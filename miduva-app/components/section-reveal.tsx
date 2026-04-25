"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

export function SectionReveal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 35%"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["120px", "0px"])
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1])
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.45],
    ["1.75rem 1.75rem 0rem 0rem", "0rem 0rem 0rem 0rem"]
  )

  // Shadow that lives outside the clip and bleeds upward over the preceding section.
  // Even when adjacent sections share a background colour this makes the seam visible.
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.18, 0.7, 1], [0, 1, 0.55, 0.2])
  const boxShadow = useTransform(
    shadowOpacity,
    (v) =>
      `0 -${Math.round(v * 55)}px ${Math.round(v * 90)}px rgba(0, 0, 0, ${(v * 0.45).toFixed(3)})`
  )

  return (
    <div ref={ref} className={className} style={{ position: "relative" }}>
      {/* Clip container — keeps the rising inner div from painting outside its bounds */}
      <div style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}>
        <motion.div style={{ y, scale, borderRadius }}>
          {children}
        </motion.div>
      </div>

      {/* Shadow sentinel — 1 px tall, sits at the section's top edge, casts its
          shadow upward into the preceding section's space. Because this element
          is outside the clip container and is painted after its predecessor in
          DOM order, the shadow renders on top of the section above. */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          boxShadow,
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
    </div>
  )
}
