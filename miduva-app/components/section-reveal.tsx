"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

/**
 * SectionReveal
 *
 * Replicates the CinematicFooter "curtain reveal" parallax for every section:
 *  - Outer div has the same clip-path polygon as the footer wrapper, containing
 *    any overflow from the inner translateY.
 *  - Inner motion.div starts shifted DOWN (content lags behind the page scroll)
 *    and rises to its natural position as the section enters — the same parallax
 *    mismatch that makes the fixed footer feel like it's "underneath" everything.
 *  - Rounded top corners at entry flatten as the section settles, giving the
 *    "card peeling up from behind" aesthetic.
 */
export function SectionReveal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Track the section's full scroll journey from viewport-bottom to viewport-top
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  })

  // Parallax: content starts 12% below its natural position, rises to 0.
  // This is the same scroll-speed mismatch the fixed footer creates.
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "0%"])

  // Rounded top corners at entry → flat corners once settled (card-peel feel)
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.45],
    ["1.75rem 1.75rem 0rem 0rem", "0rem 0rem 0rem 0rem"]
  )

  return (
    // Same clip-path technique as the CinematicFooter wrapper:
    // a full-rectangle polygon that clips the y-overflow at the section's edges
    <div
      ref={ref}
      className={className}
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <motion.div style={{ y, borderRadius }}>
        {children}
      </motion.div>
    </div>
  )
}
