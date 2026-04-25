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

  // Concentrate the animation into the entry window: completes when the
  // section top is 35% from the viewport top (not spread across the full travel).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 35%"],
  })

  // 120px absolute rise — clearly visible curtain-from-below motion.
  const y = useTransform(scrollYProgress, [0, 1], ["120px", "0px"])
  // Subtle scale from 0.96 → 1 gives the "card emerging from depth" feel.
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1])
  // Top corners round at entry then flatten as the section settles.
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.45],
    ["1.75rem 1.75rem 0rem 0rem", "0rem 0rem 0rem 0rem"]
  )

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <motion.div style={{ y, scale, borderRadius }}>
        {children}
      </motion.div>
    </div>
  )
}
