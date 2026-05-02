"use client"

import { useRef, useEffect } from "react"

export default function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const layers = el.querySelector("[data-parallax-layers]")
      const header = el.querySelector(".parallax__header")
      if (!layers || !header) return
      const rect = (header as HTMLElement).getBoundingClientRect()
      const scrollable = (header as HTMLElement).offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const p = Math.min(1, Math.max(0, -rect.top / scrollable))
      const config = [
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
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const bars = [42, 58, 51, 64, 72, 69, 81, 88, 83, 92, 97, 104]

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
              <div style={{ display: "flex", alignItems: "flex-end", gap: 14, width: "88%", maxWidth: 1100, height: "62%", opacity: 0.18 }}>
                {[38, 54, 46, 62, 70, 66, 78, 86, 80, 92, 102, 118, 112, 128].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h * 0.7}%`,
                      background: "linear-gradient(180deg,var(--navy-700),var(--navy-900))",
                      borderRadius: "14px 14px 2px 2px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Layer 3 — title */}
            <div data-parallax-layer="3" className="parallax__layer">
              <div style={{ textAlign: "center" }}>
                <div
                  className="mono"
                  style={{ fontSize: 13, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--teal-500)", marginBottom: 18 }}
                >
                  The Miduva Difference
                </div>
                <h2 className="parallax__title">
                  Built as a<br />
                  <em>system.</em>
                </h2>
                <div style={{ marginTop: 22, maxWidth: 620, marginInline: "auto", color: "var(--muted)", fontSize: 18, lineHeight: 1.55 }}>
                  Not a one-off campaign, not a template. A connected machine — ads → funnels → automation → data — tuned for your business.
                </div>
              </div>
            </div>

            {/* Layer 4 — pipeline card, anchored bottom-right */}
            <div data-parallax-layer="4" className="parallax__layer">
              <div
                style={{
                  position: "absolute",
                  bottom: 52,
                  right: 52,
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: 20,
                  padding: "18px 20px",
                  width: 300,
                  boxShadow: "0 32px 64px -24px rgba(15,35,73,.4), 0 0 0 1px rgba(255,255,255,0.04)",
                  transform: "rotate(1.5deg)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--muted)" }}>
                    Pipeline · live
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: "var(--teal-500)",
                      boxShadow: "0 0 0 3px rgba(0,198,160,0.25)",
                      display: "inline-block",
                    }} />
                  </span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "var(--navy-900)", letterSpacing: "-.02em", marginTop: 2 }}>
                  $482,120
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 12, color: "var(--teal-500)", fontWeight: 600 }}>
                  <span>▲ 21.4%</span>
                  <span style={{ color: "var(--muted)", fontWeight: 400 }}>vs last Q</span>
                </div>
                <div style={{ height: 1, background: "var(--line)", margin: "12px 0" }} />
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 52 }}>
                  {bars.map((h, i) => (
                    <div
                      key={i}
                      style={{ flex: 1, height: `${h * 0.85}%`, background: "var(--teal-500)", borderRadius: 2, opacity: 0.7 + i * 0.025 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="parallax__fade" />
        </div>
      </section>

      <section className="parallax__content">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none" className="mark">
          <path
            d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z"
            fill="currentColor"
          />
        </svg>
        <div className="mono" style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)" }}>
          Eight modules · one OS
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "var(--navy-900)", maxWidth: 560, letterSpacing: "-.02em" }}>
          Every lever connected, every number visible, every dollar accounted for.
        </div>
      </section>
    </div>
  )
}
