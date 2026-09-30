"use client"

import { useRef, useEffect } from "react"
import type { ParallaxData } from "@/lib/types"
import { useFrameRuntime } from "@/components/puck/frame-runtime"

export default function ParallaxSection({ data }: { data?: ParallaxData }) {
  const ref = useRef<HTMLDivElement>(null)
  const runtime = useFrameRuntime()

  useEffect(() => {
    if (!runtime) return
    const frameWindow = runtime.window
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const layers = el.querySelector("[data-parallax-layers]")
      const header = el.querySelector(".parallax__header")
      if (!layers || !header) return
      const rect = (header as HTMLElement).getBoundingClientRect()
      const scrollable = (header as HTMLElement).offsetHeight - frameWindow.innerHeight
      if (scrollable <= 0) return
      const p = Math.min(1, Math.max(0, -rect.top / scrollable))
      const isMobile = frameWindow.matchMedia("(max-width: 700px)").matches
      const config = isMobile
        ? [
            { sel: '[data-parallax-layer="1"]', y: -8 },
            { sel: '[data-parallax-layer="2"]', y: 0 },
            { sel: '[data-parallax-layer="3"]', y: 0 },
            { sel: '[data-parallax-layer="4"]', y: 0 },
          ]
        : [
            { sel: '[data-parallax-layer="1"]', y: -90 },
            { sel: '[data-parallax-layer="2"]', y: -55 },
            { sel: '[data-parallax-layer="3"]', y: -22 },
            { sel: '[data-parallax-layer="4"]', y: -6  },
          ]
      config.forEach((c) => {
        const n = layers.querySelector(c.sel) as HTMLElement | null
        if (n) n.style.transform = `translateY(${p * c.y}%)`
      })
    }
    const onScroll = () => { if (!raf) raf = frameWindow.requestAnimationFrame(update) }
    update()
    frameWindow.addEventListener("scroll", onScroll, { passive: true })
    frameWindow.addEventListener("resize", onScroll)
    return () => {
      frameWindow.removeEventListener("scroll", onScroll)
      frameWindow.removeEventListener("resize", onScroll)
      if (raf) frameWindow.cancelAnimationFrame(raf)
    }
  }, [runtime])

  const eyebrow         = data?.eyebrow         ?? "The Miduva Difference"
  const headline        = data?.headline        ?? "Built as a"
  const headlineAccent  = data?.headlineAccent  ?? "system."
  return (
    <div className="parallax" ref={ref}>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div data-parallax-layers className="parallax__layers">
            {/* Layer 1 — blobs */}
            <div data-parallax-layer="1" className="parallax__layer">
              <div
                className="parallax__blob"
                style={{ width: 720, height: 720, left: "-8%", top: "8%", background: "radial-gradient(circle,var(--teal-300) 0%,transparent 60%)" }}
              />
              <div
                className="parallax__blob"
                style={{ width: 640, height: 640, right: "-6%", top: "30%", background: "radial-gradient(circle,var(--navy-600) 0%,transparent 60%)", opacity: 0.35 }}
              />
              <div
                className="parallax__blob"
                style={{ width: 520, height: 520, left: "30%", bottom: "-10%", background: "radial-gradient(circle,var(--teal-500) 0%,transparent 60%)", opacity: 0.3 }}
              />
            </div>

            {/* Layer 2 — bar graph silhouette */}
            <div data-parallax-layer="2" className="parallax__layer">
              <div className="parallax__bar-silhouette">
                {[38, 54, 46, 62, 70, 66, 78, 86, 80, 92, 102, 118, 112, 128].map((h, i) => (
                  <div
                    key={i}
                    className="parallax__bar"
                    style={{
                      height: `${h * 0.7}%`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Layer 3 — title */}
            <div data-parallax-layer="3" className="parallax__layer">
              <div style={{ textAlign: "center" }}>
                <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-4" data-edit-path="eyebrow">
                  {eyebrow}
                </div>
                <h2 className="parallax__title" data-edit-path="headline">
                  {headline}<br />
                  <em data-edit-path="headlineAccent">{headlineAccent}</em>
                </h2>
              </div>
            </div>

          </div>
          <div className="parallax__fade" />
        </div>
      </section>

    </div>
  )
}
