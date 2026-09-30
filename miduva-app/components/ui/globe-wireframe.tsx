"use client"

import { useEffect, useRef } from "react"
import { geoGraticule, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo"
import { feature } from "topojson-client"
import type { GeometryCollection, Topology } from "topojson-specification"
import { cn } from "@/lib/utils"

type WorldTopology = Topology<{ countries: GeometryCollection }>

const SVG_NS = "http://www.w3.org/2000/svg"

// Pre-projected sphere + graticule + countries, re-projected every frame on
// the existing <path> nodes so auto-rotation never rebuilds the DOM.
export function GlobeWireframe({
  className,
  autoRotateSpeed = 0.18,
  initialRotation = [-30, -18],
  strokeWidth = 0.6,
  graticuleOpacity = 0.14,
  enableInteraction = true,
}: {
  className?: string
  autoRotateSpeed?: number
  initialRotation?: [number, number]
  strokeWidth?: number
  graticuleOpacity?: number
  enableInteraction?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const svg = svgRef.current
    if (!container || !svg) return

    let disposed = false
    let frame = 0
    let visible = false
    let dragging = false
    let last: [number, number] = [0, 0]
    const rotation: [number, number] = [...initialRotation]
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const projection = geoOrthographic().precision(0.3).clipAngle(90)
    const path = geoPath(projection)
    const layers: { el: SVGPathElement; datum: GeoPermissibleObjects }[] = []

    const makePath = (datum: GeoPermissibleObjects, attrs: Record<string, string>) => {
      const el = document.createElementNS(SVG_NS, "path")
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
      svg.appendChild(el)
      layers.push({ el, datum })
    }

    const resize = () => {
      const size = container.clientWidth
      svg.setAttribute("viewBox", `0 0 ${size} ${size}`)
      projection.scale(size / 2 - strokeWidth * 2).translate([size / 2, size / 2])
      draw()
    }

    const draw = () => {
      projection.rotate(rotation)
      for (const { el, datum } of layers) el.setAttribute("d", path(datum) ?? "")
    }

    const tick = () => {
      if (!dragging && !reducedMotion) {
        rotation[0] = (rotation[0] + autoRotateSpeed) % 360
        draw()
      }
      frame = visible ? requestAnimationFrame(tick) : 0
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame && layers.length) frame = requestAnimationFrame(tick)
    }, { threshold: 0.05 })

    const ro = new ResizeObserver(resize)

    const onDown = (e: PointerEvent) => {
      dragging = true
      last = [e.clientX, e.clientY]
      svg.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      rotation[0] += (e.clientX - last[0]) * 0.35
      rotation[1] = Math.max(-70, Math.min(70, rotation[1] - (e.clientY - last[1]) * 0.35))
      last = [e.clientX, e.clientY]
      draw()
    }
    const onUp = () => { dragging = false }

    import("world-atlas/countries-110m.json").then((mod) => {
      if (disposed) return
      const world = (mod.default ?? mod) as unknown as WorldTopology
      const countries = feature(world, world.objects.countries)

      makePath({ type: "Sphere" }, { class: "globe-sphere", fill: "none", stroke: "currentColor", "stroke-width": "1.2", opacity: "0.5" })
      makePath(geoGraticule()(), { fill: "none", stroke: "currentColor", "stroke-width": "0.6", opacity: String(graticuleOpacity) })
      for (const f of countries.features) {
        makePath(f, { fill: "none", stroke: "currentColor", "stroke-width": String(strokeWidth), "stroke-linejoin": "round", opacity: "0.75" })
      }

      ro.observe(container)
      io.observe(container)
      resize()
      svg.style.opacity = "1"
    })

    if (enableInteraction) {
      svg.addEventListener("pointerdown", onDown)
      svg.addEventListener("pointermove", onMove)
      svg.addEventListener("pointerup", onUp)
      svg.addEventListener("pointercancel", onUp)
    }

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      io.disconnect()
      ro.disconnect()
      svg.removeEventListener("pointerdown", onDown)
      svg.removeEventListener("pointermove", onMove)
      svg.removeEventListener("pointerup", onUp)
      svg.removeEventListener("pointercancel", onUp)
      svg.replaceChildren()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={containerRef} className={cn("relative aspect-square w-full", className)}>
      <svg
        ref={svgRef}
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000"
        style={{ cursor: enableInteraction ? "grab" : "default", touchAction: "pan-y" }}
      />
    </div>
  )
}

export function FormDots({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("h-4 w-full shrink-0", className)}
      style={{
        backgroundImage: "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)",
        backgroundSize: "6px 100%",
        maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    />
  )
}
